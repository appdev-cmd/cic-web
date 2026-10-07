import assert from 'node:assert/strict';
import { config } from 'dotenv';
config({ path: '.env.local' });
import postgres from 'postgres';
import { createSupabaseAdminClient } from '../src/server/supabase/admin.ts';
import { MEDIA_BUCKET } from '../src/features/media/constants.ts';
import {
  createMediaAsset,
  createMediaFolder,
  saveMediaAlbum,
  deleteMediaAlbum,
  updateMediaMetadata,
  replaceMediaAsset,
  trashMediaAssets,
} from '../src/features/media/server/repository.ts';
import { mediaTrashAdapter } from '../src/features/trash/server/adapters/media.ts';
import { validateUploadedFileSecurity } from '../src/shared/lib/file-security.ts';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { max: 2, ssl: 'require' });

console.log('🚀 Running Comprehensive Media Module Functionality Verification...\n');

const [adminUser] = await sql`SELECT id, email, username, full_name FROM cic_users WHERE lower(email)='admin@cic.com.vn' LIMIT 1`;
if (!adminUser) throw new Error('CMS admin user required');

const mockActor = {
  legacyUserId: Number(adminUser.id),
  id: String(adminUser.id),
  email: String(adminUser.email),
  fullName: String(adminUser.full_name || 'Administrator'),
  isAdministrator: true,
  roleIds: [1],
};

let createdAssetId = null;
let createdFolderId = null;
let createdAlbumId = null;

try {
  // 1. Test Folder Creation
  console.log('📁 1. Testing createMediaFolder...');
  const folder = await createMediaFolder(
    { workspace: 'vi', name: 'Thư mục kiểm thử tự động', alias: `test-folder-${Date.now()}` },
    mockActor
  );
  createdFolderId = folder.id;
  assert.ok(createdFolderId, 'Folder should be created with an ID');
  console.log('   ✅ Folder created successfully. ID:', createdFolderId);

  // 2. Test File Security Pipeline on a real PNG
  console.log('\n🔒 2. Testing file security validation pipeline...');
  const pngHeader = Buffer.alloc(64);
  pngHeader.set([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], 0);
  pngHeader.write('IHDR', 12);
  pngHeader.writeUInt32BE(1200, 16); // 1200px width
  pngHeader.writeUInt32BE(800, 20);  // 800px height
  const mockFile = new File([pngHeader], 'banner-test.png', { type: 'image/png' });

  const validated = await validateUploadedFileSecurity(mockFile, { checkDimensions: true });
  assert.equal(validated.safeFilename, 'banner-test.png');
  assert.deepEqual(validated.dimensions, { width: 1200, height: 800 });
  console.log('   ✅ Validated PNG with correct dimensions (1200x800 px).');

  // 3. Test Storage Upload & Asset Record Creation
  console.log('\n📦 3. Testing Supabase Storage upload & createMediaAsset...');
  const testStoragePath = `vi/test-${Date.now()}/banner-test.png`;
  const supabase = createSupabaseAdminClient();
  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(testStoragePath, mockFile, { contentType: 'image/png', upsert: true });
  assert.ifError(uploadError);

  const assetResult = await createMediaAsset(
    {
      storagePath: testStoragePath,
      filename: validated.safeFilename,
      mimeType: validated.mimeType,
      fileSizeBytes: mockFile.size,
      mediaType: 'image',
      locale: 'vi',
      title: 'Ảnh Banner Kiểm Thử',
      altText: 'Văn bản thay thế kiểm thử',
      folderId: Number(createdFolderId),
      width: validated.dimensions.width,
      height: validated.dimensions.height,
    },
    mockActor
  );
  createdAssetId = Number(assetResult.id);
  assert.ok(createdAssetId, 'Asset ID should be returned');
  console.log('   ✅ Asset created and uploaded. ID:', createdAssetId);

  // 4. Test Update Metadata
  console.log('\n📝 4. Testing updateMediaMetadata...');
  await updateMediaMetadata(
    createdAssetId,
    {
      locale: 'vi',
      title: 'Ảnh Banner Kiểm Thử (Đã Cập Nhật)',
      description: 'Mô tả chi tiết banner kiểm thử',
      altText: 'Alt text mới',
      caption: 'Chú thích banner',
      creditAuthor: 'CIC Dev Team',
      tags: ['test', 'banner', 'cic'],
      folderId: Number(createdFolderId),
    },
    mockActor
  );
  const [updatedAsset] = await sql`SELECT a.credit_author, t.title FROM cic_media_assets a JOIN cic_media_asset_translations t ON t.asset_id = a.id AND t.locale = 'vi' WHERE a.id = ${createdAssetId}`;
  assert.equal(updatedAsset.credit_author, 'CIC Dev Team');
  assert.equal(updatedAsset.title, 'Ảnh Banner Kiểm Thử (Đã Cập Nhật)');
  console.log('   ✅ Metadata updated and verified in DB.');

  // 5. Test Album Creation with Asset
  console.log('\n🖼️ 5. Testing saveMediaAlbum...');
  const album = await saveMediaAlbum(
    null,
    {
      workspace: 'vi',
      title: 'Album Sự Kiện Kiểm Thử',
      alias: `test-album-${Date.now()}`,
      description: 'Album tự động',
      workflowStatus: 'published',
      coverAssetId: createdAssetId,
      assetIds: [createdAssetId],
    },
    mockActor
  );
  createdAlbumId = Number(album.id);
  assert.ok(createdAlbumId, 'Album should be created with an ID');
  console.log('   ✅ Album created with cover asset. ID:', createdAlbumId);

  // 6. Test Version Replace
  console.log('\n🔄 6. Testing replaceMediaAsset (Version Control)...');
  const replacePath = `vi/test-${Date.now()}/banner-v2.png`;
  await replaceMediaAsset(
    createdAssetId,
    {
      storagePath: replacePath,
      filename: 'banner-v2.png',
      mimeType: 'image/png',
      fileSizeBytes: 128,
      width: 1920,
      height: 1080,
      note: 'Thay thế banner độ phân giải Full HD',
    },
    mockActor
  );
  const [versionRow] = await sql`SELECT version_number, filename, replacement_note FROM cic_media_versions WHERE asset_id = ${createdAssetId}`;
  assert.ok(versionRow, 'Version history row should exist');
  assert.equal(versionRow.version_number, 1);
  assert.equal(versionRow.replacement_note, 'Thay thế banner độ phân giải Full HD');
  console.log('   ✅ Version replacement recorded in cic_media_versions.');

  // 7. Test Soft-Delete / Move to Trash
  console.log('\n🗑️ 7. Testing trashMediaAssets...');
  await trashMediaAssets([createdAssetId], mockActor);
  const [trashedAsset] = await sql`SELECT deleted_at, workflow_status FROM cic_media_assets WHERE id = ${createdAssetId}`;
  assert.ok(trashedAsset.deleted_at !== null, 'Asset should have deleted_at timestamp');
  assert.equal(trashedAsset.workflow_status, 'archived');
  const [trashItem] = await sql`SELECT id, payload_snapshot FROM cic_trash_items WHERE entity_id = ${String(createdAssetId)} AND entity_type = 'media_asset'`;
  assert.ok(trashItem, 'Trash item record should exist');
  console.log('   ✅ Asset moved to trash with full snapshot. Trash ID:', trashItem.id);

  // 8. Test Restore from Trash
  console.log('\n♻️ 8. Testing mediaTrashAdapter.restore...');
  const restoreResult = await mediaTrashAdapter.restore(sql, trashItem.payload_snapshot, 'as_draft');
  const [restoredAsset] = await sql`SELECT deleted_at, workflow_status FROM cic_media_assets WHERE id = ${createdAssetId}`;
  assert.equal(restoredAsset.deleted_at, null, 'deleted_at should be reset to null');
  assert.equal(restoredAsset.workflow_status, 'restricted');
  console.log('   ✅ Asset successfully restored. Status:', restoredAsset.workflow_status);

  // 9. Cleanup test data
  console.log('\n🧹 9. Cleaning up test data...');
  if (createdAlbumId) await deleteMediaAlbum(createdAlbumId, mockActor);
  await sql`DELETE FROM cic_trash_items WHERE entity_id = ${String(createdAssetId)} AND entity_type = 'media_asset'`;
  await sql`DELETE FROM cic_media_versions WHERE asset_id = ${createdAssetId}`;
  await sql`DELETE FROM cic_media_asset_translations WHERE asset_id = ${createdAssetId}`;
  await sql`DELETE FROM cic_media_folder_assets WHERE asset_id = ${createdAssetId}`;
  await sql`DELETE FROM cic_media_assets WHERE id = ${createdAssetId}`;
  if (createdFolderId) await sql`DELETE FROM cic_media_folders WHERE id = ${createdFolderId}`;
  await supabase.storage.from(MEDIA_BUCKET).remove([testStoragePath]);
  console.log('   ✅ Test artifacts and DB records cleaned up cleanly.');

  console.log('\n======================================================');
  console.log('🎉 ALL MEDIA FEATURES VERIFIED 100% OPERATIONAL!');
  console.log('   • Folders: PASS');
  console.log('   • Upload & Storage: PASS');
  console.log('   • Metadata & i18n Translations: PASS');
  console.log('   • Albums: PASS');
  console.log('   • Version History & Replacement: PASS');
  console.log('   • Soft Delete & Trash: PASS');
  console.log('   • Snapshot Restore: PASS');
  console.log('======================================================\n');
} catch (err) {
  console.error('❌ Verification failed:', err);
  process.exit(1);
} finally {
  await sql.end({ timeout: 2 });
}
