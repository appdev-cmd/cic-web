import { NextResponse } from 'next/server';
import { requirePermission } from '@/server/auth/guards';
import { getDatabaseClient } from '@/server/db/foundation';
import { AppError, normalizeServerError } from '@/server/errors';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  return NextResponse.json({ error: 'Unable to load projects.' }, { status: 500 });
}

export async function GET() {
  try {
    await requirePermission('projects', 'view');
    const client = await getDatabaseClient();
    const { data, error } = await client.from('cic_projects').select('id,title,alias,summary,image,sector,solution,technologies,customer_name,location,start_year,end_year,is_ongoing,is_featured,published,ordering').order('ordering', { ascending: true }).order('id', { ascending: true });
    if (error) throw new AppError('Unable to load projects.', 'UNEXPECTED', error);
    return NextResponse.json({ projects: data ?? [] });
  } catch (error) {
    return errorResponse(error);
  }
}
