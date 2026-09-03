import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const root = process.cwd();
const clientRoots = ['src/app', 'src/shared', 'src/web', 'src/cms'].map((path) => resolve(root, path));
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.mjs']);
const forbiddenIdentifiers = ['SUPABASE_SERVICE_ROLE_KEY', 'DATABASE_URL'];
const violations = [];

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const target = join(directory, entry);
    return statSync(target).isDirectory() ? walk(target) : sourceExtensions.has(extname(target)) ? [target] : [];
  });
}

for (const file of clientRoots.flatMap(walk)) {
  const code = readFileSync(file, 'utf8');
  const isClientModule = /^\s*['"]use client['"];?/m.test(code);
  if (!isClientModule) continue;
  for (const identifier of forbiddenIdentifiers) {
    if (code.includes(identifier)) violations.push(`${file}: client module references ${identifier}`);
  }
  if (/createSupabaseAdminClient|getPostgresClient|createClient\([^)]*SERVICE_ROLE/.test(code)) {
    violations.push(`${file}: client module references privileged database access`);
  }
}

const browserClientFiles = walk(resolve(root, 'src')).filter((file) => /supabase[\\/]browser\.[cm]?[jt]sx?$/.test(file));
if (browserClientFiles.length) {
  violations.push('Browser Supabase client exists without an approved direct-browser use case.');
}

const staticRoot = resolve(root, '.next/static');
if (existsSync(staticRoot)) {
  const envPath = resolve(root, '.env.local');
  const envText = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
  const secretValues = envText
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*(SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL)\s*=\s*["']?(.*?)["']?\s*$/))
    .filter(Boolean)
    .map((match) => match[2])
    .filter((value) => value.length >= 12);
  const bundles = walk(staticRoot);
  for (const file of bundles) {
    const content = readFileSync(file, 'utf8');
    for (const value of secretValues) {
      if (content.includes(value)) violations.push(`${file}: server secret value found in browser bundle`);
    }
  }
}

if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Data foundation separation OK: no privileged client access or browser bundle secret leak found.');
}
