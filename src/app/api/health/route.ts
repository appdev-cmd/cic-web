import { NextResponse } from 'next/server';

import { getDatabaseClient } from '@/server/db/foundation';

export async function GET() {
  try {
    const client = await getDatabaseClient();
    const { error } = await client.from('cic_languages').select('id', { head: true, count: 'exact' });
    if (error) throw error;
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch {
    return NextResponse.json({ status: 'error', database: 'unavailable' }, { status: 503 });
  }
}
