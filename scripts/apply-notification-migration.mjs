import fs from 'fs';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required. Run with --env-file=.env.local');
}

const sql = postgres(url, { max: 1 });

async function run() {
  console.log('=== BẮT ĐẦU ÁP DỤNG MIGRATION THÔNG BÁO CMS ===');
  const migrationSql = fs.readFileSync('db_migrate/migrations/20261006_cms_notifications.sql', 'utf8');
  await sql.unsafe(migrationSql);
  console.log('✓ Migration 20261006_cms_notifications.sql đã thực thi thành công!');
  
  // Verify tables exist
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('cms_notifications', 'cms_notification_reads')
  `;
  console.log('Các bảng đã xác nhận tồn tại trong CSDL:', tables.map((t) => t.table_name));
  await sql.end();
}

run().catch((err) => {
  console.error('Lỗi khi chạy migration:', err);
  process.exit(1);
});
