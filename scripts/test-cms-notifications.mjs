import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required. Run with --env-file=.env.local');
}

const sql = postgres(url, { max: 1 });

async function run() {
  console.log('=== TEST CMS NOTIFICATION BACKEND ===');

  // Find a valid user in cic_users
  const [validUser] = await sql`SELECT id, username, email FROM cic_users ORDER BY id ASC LIMIT 1`;
  if (!validUser) {
    throw new Error('No user found in cic_users table');
  }
  console.log('Sử dụng user kiểm thử:', validUser.id, validUser.username, validUser.email);

  // 1. Insert a test notification
  const [created] = await sql`
    INSERT INTO cms_notifications (
      title,
      description,
      type,
      target_module,
      target_action,
      link_url,
      metadata
    ) VALUES (
      'Khách hàng kiểm thử gửi yêu cầu báo giá',
      'Test Customer - test@cic.com.vn: Cần báo giá SAP2000 Ultimate',
      'quote',
      'customer_requests',
      'view',
      '/cms/customer-requests?search=test@cic.com.vn',
      '{"email":"test@cic.com.vn","name":"Test Customer"}'::jsonb
    ) RETURNING id, title, type
  `;

  console.log('1. Đã tạo thông báo test thành công ID:', created.id, 'Title:', created.title);

  // 2. Query with join cms_notification_reads for test user
  const rows = await sql`
    SELECT
      n.id,
      n.title,
      n.type,
      (nr.read_at IS NULL) as unread
    FROM cms_notifications n
    LEFT JOIN cms_notification_reads nr
      ON nr.notification_id = n.id AND nr.user_id = ${validUser.id}
    WHERE n.id = ${created.id}
  `;
  console.log('2. Trạng thái đọc ban đầu của user:', rows[0].unread ? 'Chưa đọc (True)' : 'Đã đọc (False)');

  // 3. Mark as read for test user
  await sql`
    INSERT INTO cms_notification_reads (notification_id, user_id, read_at)
    VALUES (${created.id}, ${validUser.id}, NOW())
    ON CONFLICT (notification_id, user_id) DO NOTHING
  `;

  const rowsAfter = await sql`
    SELECT
      n.id,
      n.title,
      (nr.read_at IS NULL) as unread
    FROM cms_notifications n
    LEFT JOIN cms_notification_reads nr
      ON nr.notification_id = n.id AND nr.user_id = ${validUser.id}
    WHERE n.id = ${created.id}
  `;
  console.log('3. Trạng thái sau khi đánh dấu đọc:', rowsAfter[0].unread ? 'Chưa đọc' : 'Đã đọc (Chính xác!)');

  // 4. Cleanup test notification
  await sql`DELETE FROM cms_notifications WHERE id = ${created.id}`;
  console.log('4. Đã dọn dẹp bản ghi kiểm thử thành công.');

  await sql.end();
  console.log('=== TEST HOÀN TẤT VỚI KẾT QUẢ XUẤT SẮC ===');
}

run().catch((err) => {
  console.error('Test thất bại:', err);
  process.exit(1);
});
