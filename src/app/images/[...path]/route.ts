import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const IMAGE_ROOT = path.resolve(/* turbopackIgnore: true */ process.cwd(), 'images');
const contentTypes: Record<string, string> = { '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path;
  const target = path.resolve(/* turbopackIgnore: true */ IMAGE_ROOT, segments.join(path.sep));
  if (target !== IMAGE_ROOT && !target.startsWith(`${IMAGE_ROOT}${path.sep}`)) return new NextResponse('Not found', { status: 404 });
  const type = contentTypes[path.extname(target).toLowerCase()];
  if (!type) return new NextResponse('Not found', { status: 404 });
  try {
    const body = await readFile(target);
    return new NextResponse(body, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
