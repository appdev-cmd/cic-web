import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { extractProductVideoUrl, normalizeProductMediaUrl } from '../src/features/products/mappers.ts';

const sql = getPostgresClient();
try {
  const [product] = await sql`SELECT alias,image,video,link_video FROM cic_products WHERE lower(alias) LIKE '%enjicad%' ORDER BY id LIMIT 1`;
  assert.ok(product, 'Không tìm thấy fixture Enjicad trong DB thật.');
  const imageUrl = normalizeProductMediaUrl(product.image || '/images/products/2022/07/13/original/enjicad-3.jpg');
  const videoUrl = extractProductVideoUrl(product.link_video || product.video);
  assert.ok(imageUrl.startsWith('/images/'), `Ảnh legacy chưa resolve local: ${imageUrl}`);
  await access(path.join(process.cwd(), imageUrl.replace(/^\//, '')));
  assert.match(videoUrl || '', /^https:\/\/(www\.)?youtube\.com\/embed\//);
  console.log(JSON.stringify({ legacyImageLocal: true, imageUrl, iframeHtmlExtracted: true, videoUrl }, null, 2));
} finally { await sql.end(); }
