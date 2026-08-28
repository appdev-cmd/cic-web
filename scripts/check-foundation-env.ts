import { parseServerEnv } from '../src/server/config/env-schema.ts';

const validEnvironment = {
  APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-test-key',
  NODE_ENV: 'test',
};

parseServerEnv(validEnvironment);

let missingEnvironmentFailed = false;

try {
  parseServerEnv({ NODE_ENV: 'test' });
} catch (error) {
  missingEnvironmentFailed = error instanceof Error
    && error.message.includes('Invalid server environment')
    && error.message.includes('APP_URL')
    && error.message.includes('NEXT_PUBLIC_SUPABASE_URL')
    && error.message.includes('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}

if (!missingEnvironmentFailed) {
  throw new Error('Environment validation did not fail clearly for missing required values.');
}

console.log('Foundation environment validation passed.');
