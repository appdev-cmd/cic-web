import { config } from 'dotenv';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local', override: false, quiet: true });
config({ path: '.env', override: false, quiet: true });

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DATABASE_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing database or Supabase service credentials in environment.');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { max: 2, ssl: 'require' });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET_NAME = 'cms-media';

async function listAllStorageFiles(prefix = '') {
  const files = [];
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(prefix, {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.warn(`⚠️ Warning listing storage prefix "${prefix}":`, error.message);
    return files;
  }

  for (const item of data || []) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null || !item.metadata) {
      // It's a folder, recurse
      const subFiles = await listAllStorageFiles(itemPath);
      files.push(...subFiles);
    } else {
      files.push({
        path: itemPath,
        size: item.metadata.size || 0,
        mimetype: item.metadata.mimetype,
        updated_at: item.updated_at,
      });
    }
  }
  return files;
}

async function auditOrphanMedia() {
  console.log('🔍 [MEDIA AUDIT] Starting Orphan Media & Storage Consistency Audit...\n');

  try {
    // 1. Fetch DB records
    const dbAssets = await sql`
      SELECT id, filename, storage_path, file_size_bytes, workflow_status, deleted_at, created_at
      FROM cic_media_assets
      ORDER BY id ASC
    `;
    console.log(`📊 DB Records in cic_media_assets: ${dbAssets.length} total.`);

    // 2. Fetch Storage objects
    console.log(`📡 Querying Supabase Storage bucket "${BUCKET_NAME}"...`);
    const storageFiles = await listAllStorageFiles();
    console.log(`📦 Storage objects found: ${storageFiles.length} files.\n`);

    const dbPathSet = new Set(dbAssets.map((a) => a.storage_path));
    const storagePathSet = new Set(storageFiles.map((f) => f.path));

    // 3. Detect Ghost files (In Storage, but NOT in DB)
    const ghostFiles = storageFiles.filter((f) => !dbPathSet.has(f.path));
    console.log(`👻 Ghost / Orphan Storage Files (In bucket, missing in DB): ${ghostFiles.length}`);
    if (ghostFiles.length > 0) {
      ghostFiles.slice(0, 10).forEach((f) => console.log(`   - [Ghost] ${f.path} (${f.size} bytes)`));
      if (ghostFiles.length > 10) console.log(`   ... and ${ghostFiles.length - 10} more.`);
    }

    // 4. Detect Dead References (In DB active, missing in Storage)
    const activeDbAssets = dbAssets.filter((a) => a.deleted_at === null);
    const missingPhysical = activeDbAssets.filter((a) => !storagePathSet.has(a.storage_path));
    console.log(`\n💀 Dead References (In DB active, missing physically in Storage): ${missingPhysical.length}`);
    if (missingPhysical.length > 0) {
      missingPhysical.slice(0, 10).forEach((a) => console.log(`   - [Missing] ID ${a.id}: ${a.storage_path}`));
      if (missingPhysical.length > 10) console.log(`   ... and ${missingPhysical.length - 10} more.`);
    }

    // 5. Detect Unreferenced Media (used_by_count = 0 in content modules)
    console.log('\n🔗 Scanning usage references across CMS content modules (News, Products, CTAs, Forms)...');
    const unreferencedAssets = [];
    for (const asset of activeDbAssets.slice(0, 50)) { // sample scan
      const [ctaUsage] = await sql`SELECT count(*)::int n FROM cic_ctas WHERE media_asset_id = ${asset.id} AND deleted_at IS NULL`;
      const [formUsage] = await sql`SELECT count(*)::int n FROM cic_form_submission_values WHERE media_asset_id = ${asset.id}`;
      const [newsUsage] = await sql`
        SELECT count(*)::int n FROM cic_news 
        WHERE image LIKE ${'%' + asset.filename + '%'} OR image LIKE ${'%' + asset.storage_path + '%'} OR content LIKE ${'%' + asset.storage_path + '%'}
      `;
      const [prodUsage] = await sql`
        SELECT count(*)::int n FROM cic_products 
        WHERE image LIKE ${'%' + asset.filename + '%'} OR image LIKE ${'%' + asset.storage_path + '%'} OR description LIKE ${'%' + asset.storage_path + '%'}
      `;

      const totalUsage = Number(ctaUsage.n) + Number(formUsage.n) + Number(newsUsage.n) + Number(prodUsage.n);
      if (totalUsage === 0) {
        unreferencedAssets.push(asset);
      }
    }
    console.log(`ℹ️ Unreferenced Media Assets (Sample of 50 active assets): ${unreferencedAssets.length}`);
    unreferencedAssets.slice(0, 5).forEach((a) => console.log(`   - [Unused] ID ${a.id} (${a.filename})`));

    console.log('\n======================================================');
    console.log('✅ [MEDIA AUDIT COMPLETE]');
    console.log(`   • Total Assets: ${dbAssets.length}`);
    console.log(`   • Ghost Storage Files: ${ghostFiles.length}`);
    console.log(`   • Missing Storage Files: ${missingPhysical.length}`);
    console.log('======================================================\n');
  } finally {
    await sql.end({ timeout: 2 });
  }
}

auditOrphanMedia().catch((err) => {
  console.error('❌ Audit encountered fatal error:', err);
  process.exit(1);
});
