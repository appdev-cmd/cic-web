import { NextResponse } from 'next/server';
import { requireCmsAccess } from '@/server/auth/guards';
import { getDatabaseClient } from '@/server/db/foundation';

export async function GET() {
  try {
    await requireCmsAccess();
    const client = await getDatabaseClient();
    const { data, error } = await client.from('cic_projects').select('*').order('ordering', { ascending: true }).order('id', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ projects: data ?? [] });
  } catch { return NextResponse.json({ error: 'Unable to load projects.' }, { status: 500 }); }
}
