import 'server-only';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

export interface ServiceAccountCredentials {
  clientEmail: string;
  privateKey: string;
  projectId?: string;
}

let cachedCredentials: ServiceAccountCredentials | null | undefined = undefined;

function sanitizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }
  return key;
}

function parseCredentialsFromFile(filePath: string): ServiceAccountCredentials | null {
  try {
    const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(resolvedPath)) {
      return null;
    }
    const content = fs.readFileSync(resolvedPath, 'utf8');
    const parsed = JSON.parse(content);
    if (parsed.client_email && parsed.private_key) {
      const privateKey = sanitizePrivateKey(parsed.private_key);
      if (privateKey.includes('BEGIN PRIVATE KEY') && privateKey.includes('END PRIVATE KEY')) {
        return {
          clientEmail: parsed.client_email.trim(),
          privateKey,
          projectId: parsed.project_id?.trim(),
        };
      }
    }
  } catch {
    // Ignore read or parse errors
  }
  return null;
}

export function getGoogleServiceAccountCredentials(): ServiceAccountCredentials | null {
  if (cachedCredentials !== undefined) {
    return cachedCredentials;
  }

  // 1. Check environment variables directly
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();

  if (email && rawKey) {
    const privateKey = sanitizePrivateKey(rawKey);
    if (privateKey.includes('BEGIN PRIVATE KEY') && privateKey.includes('END PRIVATE KEY')) {
      cachedCredentials = {
        clientEmail: email,
        privateKey,
        projectId: process.env.GOOGLE_PROJECT_ID?.trim(),
      };
      return cachedCredentials;
    }
  }

  // 2. Check specified key file path via environment variables
  const envKeyFiles = [
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE?.trim(),
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim(),
  ].filter((p): p is string => Boolean(p));

  for (const file of envKeyFiles) {
    const creds = parseCredentialsFromFile(file);
    if (creds) {
      cachedCredentials = creds;
      return cachedCredentials;
    }
  }

  // 3. Fallback: check known default filename at project root
  const defaultFileCreds = parseCredentialsFromFile('ggsheet-form-f662b1519220.json');
  if (defaultFileCreds) {
    cachedCredentials = defaultFileCreds;
    return cachedCredentials;
  }

  // 4. Fallback: check any ggsheet-*.json or *serviceaccount*.json in root
  try {
    const files = fs.readdirSync(process.cwd());
    const matched = files.find(
      (f) =>
        f.endsWith('.json') &&
        (f.startsWith('ggsheet-') || f.toLowerCase().includes('serviceaccount') || f.toLowerCase().includes('google-credentials'))
    );
    if (matched) {
      const wildcardCreds = parseCredentialsFromFile(matched);
      if (wildcardCreds) {
        cachedCredentials = wildcardCreds;
        return cachedCredentials;
      }
    }
  } catch {
    // Ignore directory reading issues
  }

  cachedCredentials = null;
  return null;
}

export function hasGoogleServiceAccountCredentials(): boolean {
  return getGoogleServiceAccountCredentials() !== null;
}

export function getGoogleServiceAccountEmail(): string {
  const creds = getGoogleServiceAccountCredentials();
  return creds?.clientEmail || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || '';
}

export function getGoogleSheetsClient() {
  const creds = getGoogleServiceAccountCredentials();
  if (!creds) {
    throw new Error(
      'Chưa cấu hình thông tin Google Service Account (GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY hoặc file JSON credentials).'
    );
  }

  const auth = new google.auth.JWT({
    email: creds.clientEmail,
    key: creds.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

