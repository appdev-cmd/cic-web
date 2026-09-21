import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const IMAGE_ROOT = path.resolve(/* turbopackIgnore: true */ process.cwd(), 'images');
const contentTypes: Record<string, string> = { '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path;
  const target = path.resolve(/* turbopackIgnore: true */ IMAGE_ROOT, segments.join(path.sep));
  if (target !== IMAGE_ROOT && !target.startsWith(`${IMAGE_ROOT}${path.sep}`)) return new NextResponse('Not found', { status: 404 });
  const ext = path.extname(target).toLowerCase();
  const type = contentTypes[ext];
  if (!type) return new NextResponse('Not found', { status: 404 });
  try {
    const body = await readFile(target);
    const isSvg = type === 'image/svg+xml' || ext === '.svg';
    const headers: Record<string, string> = {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'X-Content-Type-Options': 'nosniff',
    };
    if (isSvg) {
      headers['Content-Disposition'] = 'attachment';
      headers['Content-Security-Policy'] = "default-src 'none'; sandbox";
    }
    return new NextResponse(body, { headers });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
