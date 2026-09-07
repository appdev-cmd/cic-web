import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const violations = [];
const tracked = execFileSync('git', ['ls-files', '--', 'db_migrate'], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((path) => path.replaceAll('\\', '/'));

const forbiddenTrackedArtifacts = [
  'db_migrate/cic14005_cic_fs.sql',
  'db_migrate/export_data.sql',
];

for (const path of tracked) {
  if (forbiddenTrackedArtifacts.includes(path) || path.includes('/__pycache__/') || path.endsWith('.pyc')) {
    violations.push(`${path}: generated or sensitive ETL artifact must not be tracked`);
  }
}

const configSource = readFileSync(resolve(root, 'db_migrate/config.py'), 'utf8');
for (const variable of [
  'DB_MIGRATE_MYSQL_PASSWORD',
  'DB_MIGRATE_POSTGRES_PASSWORD',
]) {
  if (!configSource.includes(`required("${variable}")`)) {
    violations.push(`db_migrate/config.py: ${variable} must be loaded from the environment`);
  }
}

if (/['"]password['"]\s*:\s*['"][^'"]+['"]/.test(configSource)) {
  violations.push('db_migrate/config.py: hard-coded password literal detected');
}

const exampleEnvironment = readFileSync(resolve(root, '.env.example'), 'utf8');
for (const variable of [
  'CMS_BOOTSTRAP_ADMIN_PASSWORD',
  'DB_MIGRATE_MYSQL_HOST',
  'DB_MIGRATE_MYSQL_USER',
  'DB_MIGRATE_MYSQL_PASSWORD',
  'DB_MIGRATE_MYSQL_DATABASE',
  'DB_MIGRATE_POSTGRES_HOST',
  'DB_MIGRATE_POSTGRES_USER',
  'DB_MIGRATE_POSTGRES_PASSWORD',
  'DB_MIGRATE_POSTGRES_DATABASE',
]) {
  const match = exampleEnvironment.match(new RegExp(`^${variable}=(.*)$`, 'm'));
  if (!match) violations.push(`.env.example: missing ${variable}`);
  else if (match[1].trim() !== '') violations.push(`.env.example: ${variable} must be an empty placeholder`);
}

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Repository security baseline OK: ETL secrets and generated data are not tracked.');
}
