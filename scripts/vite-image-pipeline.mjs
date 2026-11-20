import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {shouldPublishAsset} from './public-asset-policy.mjs';

const script = fileURLToPath(new URL('./optimize-images.py', import.meta.url));
const textExtensions = new Set(['.html', '.json', '.js', '.css', '.svg', '.md']);
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function imagePipeline() {
  let config, publicRoot, cache, manifest, replaceURLs, bareNames;
  return {
    name: 'portfolio-webp',
    apply: 'build',
    configResolved(value) { config = value; },
    async buildStart() {
      publicRoot = fs.realpathSync(path.resolve(config.root, 'public'));
      const id = crypto.createHash('sha256').update(publicRoot).digest('hex').slice(0, 16);
      cache = path.join(os.homedir(), 'Library', 'Caches', 'juyeon-portfolio-webp', id);
      await new Promise((resolve, reject) => {
        const child = spawn('python3', [script, '--public', publicRoot, '--cache', cache], {stdio: 'inherit'});
        child.on('error', reject);
        child.on('exit', code => code === 0 ? resolve() : reject(new Error(`WebP conversion failed (${code})`)));
      });
      manifest = JSON.parse(fs.readFileSync(path.join(cache, 'manifest.json'), 'utf8'));
      const mapping = new Map();
      const names = new Map();
      for (const row of manifest.images) {
        if (!shouldPublishAsset(row.source)) continue;
        const name = path.posix.basename(row.source);
        names.set(name, [...(names.get(name) || []), row]);
        if (row.status !== 'converted') continue;
        mapping.set(row.source, row.target);
        mapping.set(encodeURI(row.source), encodeURI(row.target));
      }
      const pattern = new RegExp([...mapping.keys()].sort((a,b) => b.length-a.length).map(escape).join('|'), 'g');
      replaceURLs = text => mapping.size ? text.replace(pattern, value => mapping.get(value)) : text;
      bareNames = new Map([...names].filter(([,rows]) => rows.every(r => r.status === 'converted'))
        .map(([name]) => [name, name + '.webp']));
    },
    transform(code, id) {
      if (!id.startsWith(path.join(config.root, 'src') + path.sep)) return null;
      // Resolve literal filenames used by brand/file helpers as well as full URLs.
      return {code: replaceURLs(code).replace(/(['"])([^'"\n\/]+\.(?:png|jpe?g))\1/g,
        (match, quote, name) => bareNames.has(name) ? quote + bareNames.get(name) + quote : match), map: null};
    },
    async closeBundle() {
      const output = path.resolve(config.root, config.build.outDir);
      const rows = new Map(manifest.images.map(row => [row.source, row]));
      const jobs = [];
      const excludedAssets = [];
      function collect(directory) {
        for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
          if (entry.name.startsWith('.') || entry.name.endsWith('.tmp.pdf')) continue;
          const source = path.join(directory, entry.name);
          if (entry.isDirectory()) { collect(source); continue; }
          const url = '/' + path.relative(publicRoot, source).split(path.sep).join('/');
          // Check the original path before selecting its generated WebP variant.
          // Originals stay on disk; restricted archives never enter dist/.
          if (!shouldPublishAsset(url)) { excludedAssets.push(url); continue; }
          const row = rows.get(url);
          const relative = (row?.status === 'converted' ? row.target : url).slice(1);
          const target = path.join(output, relative);
          fs.mkdirSync(path.dirname(target), {recursive: true});
          jobs.push(async () => {
            if (row?.status === 'converted') await fs.promises.copyFile(path.join(cache, row.cache_file), target);
            else if (textExtensions.has(path.extname(source))) {
              const text = await fs.promises.readFile(source, 'utf8');
              await fs.promises.writeFile(target, replaceURLs(text));
            } else await fs.promises.copyFile(source, target);
          });
        }
      }
      collect(publicRoot);
      let next = 0, completed = 0;
      await Promise.all(Array.from({length: 4}, async () => {
        while (next < jobs.length) {
          await jobs[next++]();
          if (++completed % 100 === 0) console.log(`Public assets: ${completed}/${jobs.length}`);
        }
      }));
      const report = path.join(config.root, 'research', 'webp-optimization');
      fs.mkdirSync(report, {recursive: true});
      fs.writeFileSync(path.join(report, 'manifest.json'), JSON.stringify(manifest, null, 2));
      fs.writeFileSync(path.join(report, 'public-assets.json'), JSON.stringify({
        copied: jobs.length,
        excluded: excludedAssets.sort(),
        scope: 'Website build only; local originals and Git history are unchanged.',
      }, null, 2));
      console.log(`WebP public assets copied; ${manifest.converted} original images excluded from deployment.`);
      console.log(`Public asset policy: ${excludedAssets.length} unreviewed archive assets omitted from deployment.`);
    },
  };
}
