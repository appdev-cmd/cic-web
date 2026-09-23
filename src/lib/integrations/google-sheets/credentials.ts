import 'server-only';
import { google } from 'googleapis';

export interface ServiceAccountCredentials {
  clientEmail: string;
  privateKey: string;
}

export function getGoogleServiceAccountCredentials(): ServiceAccountCredentials | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();

  if (!email || !key) {
    return null;
  }

  // Handle escaped newlines in environment variable
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }

  // Sanity check key header/footer
  if (!key.includes('BEGIN PRIVATE KEY') || !key.includes('END PRIVATE KEY')) {
    return null;
  }

  return {
    clientEmail: email,
    privateKey: key,
  };
}

export function hasGoogleServiceAccountCredentials(): boolean {
  return getGoogleServiceAccountCredentials() !== null;
}

export function getGoogleServiceAccountEmail(): string {
  return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || '';
}

export function getGoogleSheetsClient() {
  const creds = getGoogleServiceAccountCredentials();
  if (!creds) {
    throw new Error('Chưa cấu hình thông tin Google Service Account (GOOGLE_SERVICE_ACCOUNT_EMAIL hoặc GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).');
  }

  const auth = new google.auth.JWT({
    email: creds.clientEmail,
    key: creds.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}
