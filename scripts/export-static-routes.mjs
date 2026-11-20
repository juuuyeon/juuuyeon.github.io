import {lstat, mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const defaultOutputDir = path.join(projectRoot, 'dist');
const defaultProjectsFile = path.join(projectRoot, 'src/projects.json');

function projectIds(projects) {
  if (!Array.isArray(projects)) throw new Error('Projects data must be an array.');
  const ids = projects.map(project => project?.id);
  for (const id of ids) {
    if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`Unsafe project id: ${JSON.stringify(id)}`);
    }
  }
  if (new Set(ids).size !== ids.length) throw new Error('Project ids must be unique.');
  return ids;
}

async function assertNotSymlink(target) {
  try {
    const stat = await lstat(target);
    if (stat.isSymbolicLink()) throw new Error(`Refusing to write through a symbolic link: ${target}`);
    return stat;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function ensureDirectory(target) {
  const stat = await assertNotSymlink(target);
  if (stat && !stat.isDirectory()) throw new Error(`Expected a directory: ${target}`);
  await mkdir(target, {recursive: true});
}

async function writeOutput(target, contents) {
  await assertNotSymlink(target);
  await writeFile(target, contents, 'utf8');
}

export const notFoundHtml = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#f4f4ef">
  <title>페이지를 찾을 수 없습니다 — 박주연</title>
  <style>
    @font-face{font-family:Pretendard;src:url('/PretendardVariable.ttf') format('truetype');font-weight:100 900;font-display:swap}
    *{box-sizing:border-box}
    body{margin:0;background:#f4f4ef;color:#17191b;font-family:Pretendard,system-ui,sans-serif}
    main{max-width:960px;margin:0 auto;padding:clamp(28px,8vw,96px);min-height:100svh;display:flex;flex-direction:column;justify-content:center}
    .brand{font-weight:750;font-size:24px;color:inherit;text-decoration:none}
    .code{margin:72px 0 20px;font-size:14px;letter-spacing:.12em}
    h1{font-size:clamp(32px,6vw,64px);line-height:1.2;letter-spacing:-.045em;margin:0 0 24px;word-break:keep-all}
    p{font-size:17px;line-height:1.7;color:#62676c;word-break:keep-all}
    nav{display:flex;flex-wrap:wrap;gap:16px 28px;margin-top:28px}
    nav a{color:inherit;text-underline-offset:6px;font-size:16px;font-weight:600;padding:12px 0}
    a:focus-visible{outline:2px solid currentColor;outline-offset:6px}
  </style>
</head>
<body>
  <main>
    <a class="brand" href="/" aria-label="박주연 포트폴리오 홈">JP.</a>
    <p class="code">404 / PAGE NOT FOUND</p>
    <h1>페이지를 찾을 수 없습니다.</h1>
    <p>주소가 변경되었거나 없는 페이지입니다.<br>홈이나 프로젝트 목록에서 작업을 살펴보세요.</p>
    <nav aria-label="다음 페이지"><a href="/">포트폴리오 홈</a><a href="/projects/">모든 프로젝트</a></nav>
  </main>
</body>
</html>
`;

/**
 * Emit real directory entry points for static hosts with no SPA rewrites.
 * This is route-file export, not prerendering: each entry runs the same React app.
 * No files are deleted; all writes stay beneath the selected output directory.
 */
export async function exportStaticRoutes({
  outputDir = defaultOutputDir,
  projectsFile = defaultProjectsFile,
} = {}) {
  if (typeof outputDir !== 'string' || !outputDir.trim()) {
    throw new Error('Output directory must be a non-empty path.');
  }
  const output = path.resolve(projectRoot, outputDir);
  if (output === path.parse(output).root || output === path.resolve(projectRoot)) {
    throw new Error('Output directory must not be the filesystem or project root.');
  }

  const outputStat = await assertNotSymlink(output);
  if (!outputStat?.isDirectory()) throw new Error(`Build output directory does not exist: ${output}`);
  const indexFile = path.join(output, 'index.html');
  await assertNotSymlink(indexFile);
  const [indexHtml, projectsJson] = await Promise.all([
    readFile(indexFile, 'utf8'),
    readFile(projectsFile, 'utf8'),
  ]);
  const ids = projectIds(JSON.parse(projectsJson));
  if (!/<html[\s>]/i.test(indexHtml)) throw new Error('Build index.html is not an HTML document.');

  const projectDirectory = path.join(output, 'projects');
  await ensureDirectory(projectDirectory);
  await writeOutput(path.join(projectDirectory, 'index.html'), indexHtml);
  for (const id of ids) {
    const directory = path.join(projectDirectory, id);
    await ensureDirectory(directory);
    await writeOutput(path.join(directory, 'index.html'), indexHtml);
  }
  await writeOutput(path.join(output, '404.html'), notFoundHtml);
  await writeOutput(path.join(output, '.nojekyll'), '');
  return {outputDir: output, routes: ['/', '/projects/', ...ids.map(id => `/projects/${id}/`)]};
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const args = process.argv.slice(2);
  if (args.length > 1 || args.some(arg => !arg.trim() || arg.startsWith('-'))) {
    console.error('Usage: node scripts/export-static-routes.mjs [output-directory]');
    process.exitCode = 1;
  } else {
    try {
      const result = await exportStaticRoutes(args.length ? {outputDir: args[0]} : {});
      console.log(`Exported ${result.routes.length} static routes to ${result.outputDir}`);
    } catch (error) {
      console.error(`Static route export failed: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
