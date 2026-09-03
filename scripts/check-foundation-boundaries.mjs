import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

const root = resolve(process.cwd(), 'src');
const scanRoots = ['app', 'server', 'shared', 'features'].map((segment) => join(root, segment));
const sourceExtensions = new Set(['.ts', '.tsx']);

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const target = join(directory, entry);
    return statSync(target).isDirectory() ? walk(target) : sourceExtensions.has(extname(target)) ? [target] : [];
  });
}

const files = scanRoots.flatMap(walk);
const fileSet = new Set(files.map((file) => resolve(file)));
const violations = [];
const graph = new Map();

function sourcePath(file) {
  return relative(root, file).replaceAll('\\', '/');
}

function resolveLocalImport(importer, specifier) {
  const base = specifier.startsWith('@/')
    ? join(root, specifier.slice(2))
    : specifier.startsWith('.')
      ? resolve(dirname(importer), specifier)
      : null;
  if (!base) return null;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (fileSet.has(resolve(candidate))) return resolve(candidate);
  }
  return null;
}

for (const file of files) {
  const code = readFileSync(file, 'utf8');
  const importer = sourcePath(file);
  const isClient = /^\s*['"]use client['"];?/m.test(code);
  const imports = [...code.matchAll(/import\s+(type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g)];
  const edges = [];

  for (const match of imports) {
    const isTypeOnly = Boolean(match[1]);
    const specifier = match[2];
    const target = resolveLocalImport(file, specifier);
    if (target) edges.push(target);

    if (importer.startsWith('server/') && /^@\/(app|features|cms|web)\//.test(specifier)) {
      violations.push(`${importer}: server infrastructure must not import ${specifier}`);
    }
    if (importer.startsWith('shared/') && /^@\/(app|features|server|cms|web)\//.test(specifier)) {
      violations.push(`${importer}: shared foundation must not import ${specifier}`);
    }
    if (importer.startsWith('features/') && /^@\/app\//.test(specifier)) {
      violations.push(`${importer}: feature code must not import app routes (${specifier})`);
    }
    const isServerActionBoundary = /\/server\/actions$/.test(specifier) || /\/server\/actions\.[cm]?[jt]sx?$/.test(specifier);
    if (isClient && !isTypeOnly && !isServerActionBoundary && (/^@\/server\//.test(specifier) || /\/server(?:\/|$)/.test(specifier))) {
      violations.push(`${importer}: client module must not import server runtime (${specifier})`);
    }
  }
  graph.set(resolve(file), edges);
}

const visiting = new Set();
const visited = new Set();
const stack = [];

function visit(file) {
  if (visiting.has(file)) {
    const start = stack.indexOf(file);
    const cycle = [...stack.slice(start), file].map(sourcePath).join(' -> ');
    violations.push(`Circular dependency: ${cycle}`);
    return;
  }
  if (visited.has(file)) return;
  visiting.add(file);
  stack.push(file);
  for (const dependency of graph.get(file) ?? []) visit(dependency);
  stack.pop();
  visiting.delete(file);
  visited.add(file);
}

for (const file of files) visit(resolve(file));

if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Foundation boundaries OK (${files.length} files checked).`);
}
