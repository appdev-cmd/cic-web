import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL);

// Template HTML cho chào mừng thành viên mới
const WELCOME_EMAIL_HTML = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <tr>
          <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 30px; text-align: center; border-bottom: 4px solid #ea580c;">
            <div style="display: inline-block; padding: 8px 16px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 12px;">
              <span style="color: #ea580c; font-weight: 900; font-size: 20px; letter-spacing: 2px;">CIC</span>
              <span style="color: #ffffff; font-weight: 600; font-size: 13px; margin-left: 6px; letter-spacing: 0.5px;">TECHNOLOGY & CONSULTANCY</span>
            </div>
            <h1 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">
              CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC
            </h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">
              Cổng Quản trị Nội dung & Dịch vụ (CIC Portal)
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 35px 30px;">
            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px; font-weight: 700;">
              Kính gửi {{customer.full_name}},
            </h2>
            <p style="color: #334155; font-size: 14px; margin: 0 0 20px; line-height: 1.6;">
              Tài khoản của bạn trên hệ thống <strong>{{brand.name}}</strong> đã được khởi tạo thành công. Dưới đây là thông tin đăng nhập chính thức để truy cập vào hệ thống:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 0 0 24px; overflow: hidden;">
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">
                  <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Thông tin Truy cập Hệ thống
                  </strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size: 14px;">
                    <tr>
                      <td style="color: #64748b; padding: 6px 0; width: 140px;">Tên đăng nhập:</td>
                      <td style="color: #0f172a; padding: 6px 0; font-weight: 700; font-family: monospace; font-size: 15px;">
                        {{auth.username}}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #64748b; padding: 6px 0;">Email:</td>
                      <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">
                        {{customer.email}}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #64748b; padding: 6px 0;">Mật khẩu khởi tạo:</td>
                      <td style="padding: 6px 0;">
                        <span style="display: inline-block; background-color: #fff7ed; color: #c2410c; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 14px; font-weight: 700; border: 1px solid #fed7aa;">
                          {{auth.password}}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #64748b; padding: 6px 0;">Vai trò:</td>
                      <td style="color: #1e3a8a; padding: 6px 0; font-weight: 600;">
                        {{auth.role_name}}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{auth.login_url}}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 34px; border-radius: 10px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25); letter-spacing: 0.3px;">
                ĐĂNG NHẬP VÀO HỆ THỐNG
              </a>
            </div>

            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin: 24px 0 0; font-size: 13px; color: #92400e; line-height: 1.6;">
              <strong>Khuyến nghị an toàn:</strong> Vì lý do bảo mật, vui lòng đăng nhập và chủ động thay đổi mật khẩu cá nhân ngay trong lần truy cập đầu tiên. Tuyệt đối không chia sẻ mật khẩu này với người khác.
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.7;">
            <strong style="color: #0f172a; font-size: 13px;">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC</strong><br/>
            Trụ sở chính: Số 37 Lê Đại Hành, Quận Hai Bà Trưng, TP. Hà Nội<br/>
            Tổng đài hỗ trợ: <strong style="color: #ea580c;">{{brand.support_phone}}</strong> | Email: <a href="mailto:{{brand.support_email}}" style="color: #0284c7; text-decoration: none;">{{brand.support_email}}</a><br/>
            Website: <a href="{{brand.website_url}}" target="_blank" style="color: #0284c7; text-decoration: none;">{{brand.website_url}}</a>
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center;">
              Đây là thư điện tử được gửi tự động từ hệ thống quản trị CIC Portal. Vui lòng không phản hồi trực tiếp vào địa chỉ email này.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();

// Template HTML cho đặt lại mật khẩu
const RESET_PASSWORD_EMAIL_HTML = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <tr>
          <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 30px; text-align: center; border-bottom: 4px solid #ea580c;">
            <div style="display: inline-block; padding: 8px 16px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 12px;">
              <span style="color: #ea580c; font-weight: 900; font-size: 20px; letter-spacing: 2px;">CIC</span>
              <span style="color: #ffffff; font-weight: 600; font-size: 13px; margin-left: 6px; letter-spacing: 0.5px;">TECHNOLOGY & CONSULTANCY</span>
            </div>
            <h1 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">
              CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC
            </h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">
              Cổng Quản trị Nội dung & Dịch vụ (CIC Portal)
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 35px 30px;">
            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px; font-weight: 700;">
              Kính gửi {{customer.full_name}},
            </h2>
            <p style="color: #334155; font-size: 14px; margin: 0 0 16px; line-height: 1.6;">
              Hệ thống bảo mật <strong>{{brand.name}}</strong> vừa tiếp nhận yêu cầu thiết lập lại mật khẩu cho tài khoản <strong>{{auth.username}}</strong>.
            </p>
            <p style="color: #334155; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
              Để tạo mật khẩu mới cho tài khoản, vui lòng nhấn vào nút bên dưới:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{auth.reset_password_url}}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 34px; border-radius: 10px; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.25); letter-spacing: 0.3px;">
                ĐẶT LẠI MẬT KHẨU CỦA BẠN
              </a>
            </div>

            <p style="color: #64748b; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
              Nếu nút bấm trên không hoạt động, bạn có thể sao chép liên kết sau và dán vào thanh địa chỉ của trình duyệt:<br/>
              <a href="{{auth.reset_password_url}}" style="color: #0284c7; word-break: break-all; font-family: monospace; font-size: 11px;">{{auth.reset_password_url}}</a>
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #64748b; border-radius: 8px; padding: 14px 16px; margin: 24px 0 0; font-size: 12px; color: #475569; line-height: 1.6;">
              <strong>Lưu ý bảo mật:</strong>
              <ul style="margin: 6px 0 0; padding-left: 18px;">
                <li>Liên kết này chỉ có hiệu lực trong vòng <strong>24 giờ</strong> kể từ thời điểm gửi.</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu hiện tại của bạn vẫn được giữ an toàn tuyệt đối.</li>
              </ul>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.7;">
            <strong style="color: #0f172a; font-size: 13px;">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC</strong><br/>
            Trụ sở chính: Số 37 Lê Đại Hành, Quận Hai Bà Trưng, TP. Hà Nội<br/>
            Tổng đài hỗ trợ: <strong style="color: #ea580c;">{{brand.support_phone}}</strong> | Email: <a href="mailto:{{brand.support_email}}" style="color: #0284c7; text-decoration: none;">{{brand.support_email}}</a><br/>
            Website: <a href="{{brand.website_url}}" target="_blank" style="color: #0284c7; text-decoration: none;">{{brand.website_url}}</a>
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center;">
              Đây là thư điện tử được gửi tự động từ hệ thống quản trị CIC Portal. Vui lòng không phản hồi trực tiếp vào địa chỉ email này.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();

async function run() {
  console.log('1. Adding is_system column to cic_email_templates if not exists...');
  await sql`
    ALTER TABLE cic_email_templates 
    ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT FALSE;
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_cic_email_templates_is_system 
    ON cic_email_templates(is_system);
  `;
  console.log('✓ Column is_system confirmed.');

  // Find actor for created_by
  const [actor] = await sql`SELECT id FROM cic_users WHERE account_status = 'active' ORDER BY id ASC LIMIT 1`;
  const actorId = actor ? Number(actor.id) : 1;

  // 2. Check/Upsert VI auth_activate
  console.log('2. Upserting VI auth_activate (Thông tin tài khoản thành viên mới)...');
  const [existingViActivate] = await sql`
    SELECT id FROM cic_email_templates 
    WHERE workspace = 'vi' AND event_key = 'auth_activate'
  `;

  let viActivateId;
  if (!existingViActivate) {
    const [inserted] = await sql`
      INSERT INTO cic_email_templates (
        workspace, name, event_key, audience, status, is_system,
        created_by, updated_by, activated_by, activated_at
      ) VALUES (
        'vi', 'Thông tin tài khoản thành viên mới', 'auth_activate', 'customer', 'active', true,
        ${actorId}, ${actorId}, ${actorId}, now()
      ) RETURNING id
    `;
    viActivateId = inserted.id;

    const [v] = await sql`
      INSERT INTO cic_email_template_versions (
        template_id, version_number, subject, content, created_by
      ) VALUES (
        ${viActivateId}, 1,
        '[CIC Portal] Thông tin tài khoản quản trị hệ thống của bạn',
        ${WELCOME_EMAIL_HTML},
        ${actorId}
      ) RETURNING id
    `;

    await sql`
      UPDATE cic_email_templates 
      SET active_version_id = ${v.id}, draft_version_id = ${v.id} 
      WHERE id = ${viActivateId}
    `;
    console.log(`✓ Created VI auth_activate template ID: ${viActivateId}`);
  } else {
    viActivateId = existingViActivate.id;
    await sql`
      UPDATE cic_email_templates 
      SET is_system = true, status = 'active' 
      WHERE id = ${viActivateId}
    `;
    console.log(`✓ Updated VI auth_activate template ID ${viActivateId} with is_system=true`);
  }

  // 3. Upsert VI auth_forgot_password (Khôi phục mật khẩu)
  console.log('3. Updating VI auth_forgot_password with CIC branded HTML and is_system=true...');
  const [existingViForgot] = await sql`
    SELECT id, active_version_id FROM cic_email_templates 
    WHERE workspace = 'vi' AND event_key = 'auth_forgot_password'
  `;

  if (existingViForgot) {
    await sql`
      UPDATE cic_email_templates 
      SET 
        name = 'Yêu cầu thiết lập lại mật khẩu tài khoản',
        is_system = true,
        status = 'active',
        updated_at = now()
      WHERE id = ${existingViForgot.id}
    `;

    // Create a new version with the styled HTML
    const [latestV] = await sql`
      SELECT max(version_number)::int as max_v FROM cic_email_template_versions WHERE template_id = ${existingViForgot.id}
    `;
    const nextV = (latestV?.max_v || 1) + 1;

    const [newV] = await sql`
      INSERT INTO cic_email_template_versions (
        template_id, version_number, subject, content, created_by
      ) VALUES (
        ${existingViForgot.id}, ${nextV},
        '[CIC Portal] Yêu cầu thiết lập lại mật khẩu tài khoản',
        ${RESET_PASSWORD_EMAIL_HTML},
        ${actorId}
      ) RETURNING id
    `;

    await sql`
      UPDATE cic_email_templates 
      SET active_version_id = ${newV.id}, draft_version_id = ${newV.id} 
      WHERE id = ${existingViForgot.id}
    `;
    console.log(`✓ Updated VI auth_forgot_password template ID ${existingViForgot.id} to version ${nextV} with CIC HTML.`);
  }

  // 4. Mark EN auth templates as is_system = true
  console.log('4. Marking EN auth templates as is_system=true...');
  await sql`
    UPDATE cic_email_templates 
    SET is_system = true 
    WHERE workspace = 'en' AND event_key IN ('auth_activate', 'auth_forgot_password')
  `;
  console.log('✓ Marked EN auth templates as is_system=true.');

  // 5. Verify all system templates
  const systemTemplates = await sql`
    SELECT t.id, t.workspace, t.name, t.event_key, t.is_system, t.status, v.subject
    FROM cic_email_templates t
    LEFT JOIN cic_email_template_versions v ON v.id = t.active_version_id
    WHERE t.is_system = true
    ORDER BY t.id
  `;
  console.log('Final system templates in database:', systemTemplates);

  await sql.end();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
