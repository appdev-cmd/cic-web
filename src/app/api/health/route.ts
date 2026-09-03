import { NextResponse } from 'next/server';

import { getDatabaseClient } from '@/server/db/foundation';
import { throwIfDatabaseError } from '@/server/db/errors';
import { logServerError } from '@/server/logging/logger';

export async function GET() {
  try {
    const client = await getDatabaseClient();
    const { error } = await client.from('cic_languages').select('id', { head: true, count: 'exact' });
    throwIfDatabaseError(error, 'Database health check failed.');
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    logServerError('Database health check failed.', error);
    return NextResponse.json({ status: 'error', database: 'unavailable' }, { status: 503 });
  }
}
