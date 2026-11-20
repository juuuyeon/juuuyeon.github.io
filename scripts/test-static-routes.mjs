import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {exportStaticRoutes, notFoundHtml} from './export-static-routes.mjs';
import {getRoutePath} from '../src/site-route.js';

const execFileAsync = promisify(execFile);
const script = fileURLToPath(new URL('./export-static-routes.mjs', import.meta.url));
const realProjectsFile = fileURLToPath(new URL('../src/projects.json', import.meta.url));
const html = '<!doctype html><html lang="ko"><head><script type="module" src="/assets/app-test.js"></script></head><body><div id="root"></div></body></html>';

async function fixture(t, projects = [{id: 'product'}, {id: 'yeosu-brand'}]) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-static-routes-'));
  t.after(() => rm(root, {recursive: true, force: true}));
  const outputDir = path.join(root, 'dist');
  const projectsFile = path.join(root, 'projects.json');
  await mkdir(outputDir);
  await writeFile(path.join(outputDir, 'index.html'), html);
  await writeFile(projectsFile, JSON.stringify(projects));
  return {root, outputDir, projectsFile};
}

test('exports the list and each project from the exact built HTML', async t => {
  const data = await fixture(t);
  const result = await exportStaticRoutes(data);
  assert.deepEqual(result.routes, ['/', '/projects/', '/projects/product/', '/projects/yeosu-brand/']);
  for (const route of result.routes) {
    assert.equal(await readFile(path.join(data.outputDir, route, 'index.html'), 'utf8'), html);
  }
  assert.equal(await readFile(path.join(data.outputDir, '404.html'), 'utf8'), notFoundHtml);
  assert.equal(await readFile(path.join(data.outputDir, '.nojekyll'), 'utf8'), '');
  assert.match(notFoundHtml, /href="\/"/);
  assert.match(notFoundHtml, /href="\/projects\/"/);
});

test('all current portfolio project IDs have independent entry files', async t => {
  const data = await fixture(t);
  const projects = JSON.parse(await readFile(realProjectsFile, 'utf8'));
  const result = await exportStaticRoutes({outputDir: data.outputDir});
  assert.equal(result.routes.length, projects.length + 2);
  for (const {id} of projects) {
    assert.equal(await readFile(path.join(data.outputDir, 'projects', id, 'index.html'), 'utf8'), html);
  }
});

test('repeat exports update generated routes without deleting unrelated output', async t => {
  const data = await fixture(t);
  await exportStaticRoutes(data);
  await writeFile(path.join(data.outputDir, 'keep.txt'), 'preserved');
  const updated = html.replace('app-test.js', 'app-updated.js');
  await writeFile(path.join(data.outputDir, 'index.html'), updated);
  await exportStaticRoutes(data);
  assert.equal(await readFile(path.join(data.outputDir, 'projects/product/index.html'), 'utf8'), updated);
  assert.equal(await readFile(path.join(data.outputDir, 'keep.txt'), 'utf8'), 'preserved');
});

test('unsafe project IDs fail before route writes', async t => {
  for (const id of ['../escape', '..', '.', '/absolute', 'bad/name', 'bad\\name', '%2e%2e', 'with space', '', null]) {
    const data = await fixture(t, [{id: 'valid'}, {id}]);
    await assert.rejects(exportStaticRoutes(data), /Unsafe project id/);
    assert.deepEqual(await readdir(data.outputDir), ['index.html']);
  }
});

test('duplicate IDs and non-array data fail before route writes', async t => {
  const data = await fixture(t, [{id: 'product'}, {id: 'product'}]);
  await assert.rejects(exportStaticRoutes(data), /unique/);
  await writeFile(data.projectsFile, JSON.stringify({id: 'product'}));
  await assert.rejects(exportStaticRoutes(data), /must be an array/);
  assert.deepEqual(await readdir(data.outputDir), ['index.html']);
});

test('missing build output and non-HTML index are rejected', async t => {
  const data = await fixture(t);
  await assert.rejects(exportStaticRoutes({...data, outputDir: path.join(data.root, 'missing')}), /does not exist/);
  await writeFile(path.join(data.outputDir, 'index.html'), 'not a build document');
  await assert.rejects(exportStaticRoutes(data), /not an HTML document/);
});

test('filesystem and project roots cannot be used as output directories', async () => {
  await assert.rejects(exportStaticRoutes({outputDir: '/'}), /must not be/);
  await assert.rejects(exportStaticRoutes({outputDir: '.'}), /must not be/);
  await assert.rejects(exportStaticRoutes({outputDir: ''}), /non-empty/);
});

test('an output directory symbolic link is rejected', async t => {
  const data = await fixture(t);
  const linked = path.join(data.root, 'linked-dist');
  await symlink(data.outputDir, linked, 'dir');
  await assert.rejects(exportStaticRoutes({...data, outputDir: linked}), /symbolic link/);
});

test('a projects directory symbolic link cannot escape output', async t => {
  const data = await fixture(t);
  const external = path.join(data.root, 'external');
  await mkdir(external);
  await symlink(external, path.join(data.outputDir, 'projects'), 'dir');
  await assert.rejects(exportStaticRoutes(data), /symbolic link/);
  assert.deepEqual(await readdir(external), []);
});

test('a project directory symbolic link cannot escape output', async t => {
  const data = await fixture(t);
  const external = path.join(data.root, 'external');
  await mkdir(external);
  await mkdir(path.join(data.outputDir, 'projects'));
  await symlink(external, path.join(data.outputDir, 'projects/product'), 'dir');
  await assert.rejects(exportStaticRoutes(data), /symbolic link/);
  assert.deepEqual(await readdir(external), []);
});

test('a generated HTML symbolic link is not overwritten', async t => {
  const data = await fixture(t);
  const external = path.join(data.root, 'external.html');
  await writeFile(external, 'preserved');
  await mkdir(path.join(data.outputDir, 'projects'));
  await symlink(external, path.join(data.outputDir, 'projects/index.html'));
  await assert.rejects(exportStaticRoutes(data), /symbolic link/);
  assert.equal(await readFile(external, 'utf8'), 'preserved');
});

test('a build index symbolic link is rejected', async t => {
  const data = await fixture(t);
  const external = path.join(data.root, 'external.html');
  await writeFile(external, html);
  await rm(path.join(data.outputDir, 'index.html'));
  await symlink(external, path.join(data.outputDir, 'index.html'));
  await assert.rejects(exportStaticRoutes(data), /symbolic link/);
});

test('route matching normalizes trailing directory slashes only', () => {
  for (const [pathname, expected] of [
    ['/', '/'], ['', '/'], ['/projects', '/projects'], ['/projects/', '/projects'],
    ['/projects/product/', '/projects/product'], ['/projects/product///', '/projects/product'],
    ['/projects/yeosu-brand', '/projects/yeosu-brand'], ['/projects/unknown/', '/projects/unknown'],
    ['/projects/%2f/', '/projects/%2f'], ['/projects//product', '/projects//product'],
  ]) assert.equal(getRoutePath(pathname), expected);
  assert.equal(getRoutePath(), '/');
  assert.equal(getRoutePath(null), '/');
});

test('CLI rejects unknown flags and extra output arguments', async () => {
  for (const args of [['--invalid'], ['dist', 'another-directory']]) {
    await assert.rejects(execFileAsync(process.execPath, [script, ...args]), error => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /Usage:/);
      return true;
    });
  }
});

test('CLI accepts an explicit build output directory', async t => {
  const data = await fixture(t);
  const {stdout} = await execFileAsync(process.execPath, [script, data.outputDir], {cwd: os.tmpdir()});
  assert.match(stdout, /Exported \d+ static routes/);
  assert.equal(await readFile(path.join(data.outputDir, 'projects/product/index.html'), 'utf8'), html);
});
