import { getPostgresClient } from '../src/server/db/postgres.ts';
import { normalizeLegacyEmailContent } from '../src/lib/email/tokens.ts';

async function seed() {
  const sql = getPostgresClient();

  console.log('Checking current cic_email_templates count...');
  const [existing] = await sql`SELECT count(*)::int as count FROM cic_email_templates`;
  console.log(`Current template count: ${existing.count}`);

  // Fetch actor for created_by
  const [actor] = await sql`
    SELECT id FROM cic_users 
    WHERE account_status = 'active' 
    ORDER BY id ASC LIMIT 1
  `;
  const actorId = actor ? Number(actor.id) : null;

  // 1. Seed from legacy cic_email (VI) and cic_email_en (EN)
  console.log('Fetching legacy emails from cic_email and cic_email_en...');
  const viLegacy = await sql`SELECT * FROM cic_email WHERE content IS NOT NULL AND trim(content) <> ''`;
  const enLegacy = await sql`SELECT * FROM cic_email_en WHERE content IS NOT NULL AND trim(content) <> ''`;

  const mapEventKey = (name: string, types: number | null): string => {
    const n = (name || '').toLowerCase();
    if (types === 18 || n.includes('download') || n.includes('dung thu')) return 'product_download';
    if (n.includes('baogia') || n.includes('bao gia')) return 'product_quote';
    if (n.includes('datmua') || n.includes('dat mua')) return 'product_purchase';
    if (n.includes('hardlock') || n.includes('khoa')) return 'product_hardlock';
    if (types === 17 || n.includes('lienhe') || n.includes('lien he')) return 'product_contact';
    if (types === 16 || n.includes('dang ky')) return 'product_contact';
    return 'product_contact';
  };

  let insertedCount = 0;

  // Process legacy VI
  for (const row of viLegacy) {
    const eventKey = mapEventKey(row.name, row.types);
    const cleanContent = normalizeLegacyEmailContent(row.content);
    const templateName = `[Legacy] ${row.name || 'Mẫu email'}`;
    const subject = `[CIC] Thông tin về {{product.name}} — {{request.reference}}`;

    // Check if already seeded
    const [exist] = await sql`
      SELECT id FROM cic_email_templates 
      WHERE workspace = 'vi' AND name = ${templateName}
    `;
    if (exist) continue;

    // Insert template
    const [tmpl] = await sql`
      INSERT INTO cic_email_templates (
        workspace, name, event_key, audience, status,
        created_by, updated_by, activated_by, activated_at
      ) VALUES (
        'vi', ${templateName}, ${eventKey}, 'customer', 'active',
        ${actorId}, ${actorId}, ${actorId}, now()
      ) RETURNING id
    `;

    // Insert version 1
    const [ver] = await sql`
      INSERT INTO cic_email_template_versions (
        template_id, version_number, subject, content, created_by
      ) VALUES (
        ${tmpl.id}, 1, ${subject}, ${cleanContent}, ${actorId}
      ) RETURNING id
    `;

    // Update pointers
    await sql`
      UPDATE cic_email_templates
      SET active_version_id = ${ver.id}, draft_version_id = ${ver.id}
      WHERE id = ${tmpl.id}
    `;
    insertedCount++;
  }

  // Process legacy EN
  for (const row of enLegacy) {
    const eventKey = mapEventKey(row.name, row.types);
    const cleanContent = normalizeLegacyEmailContent(row.content);
    const templateName = `[Legacy EN] ${row.name || 'Email Template'}`;
    const subject = `[CIC] Information regarding {{product.name}} — {{request.reference}}`;

    const [exist] = await sql`
      SELECT id FROM cic_email_templates 
      WHERE workspace = 'en' AND name = ${templateName}
    `;
    if (exist) continue;

    const [tmpl] = await sql`
      INSERT INTO cic_email_templates (
        workspace, name, event_key, audience, status,
        created_by, updated_by, activated_by, activated_at
      ) VALUES (
        'en', ${templateName}, ${eventKey}, 'customer', 'active',
        ${actorId}, ${actorId}, ${actorId}, now()
      ) RETURNING id
    `;

    const [ver] = await sql`
      INSERT INTO cic_email_template_versions (
        template_id, version_number, subject, content, created_by
      ) VALUES (
        ${tmpl.id}, 1, ${subject}, ${cleanContent}, ${actorId}
      ) RETURNING id
    `;

    await sql`
      UPDATE cic_email_templates
      SET active_version_id = ${ver.id}, draft_version_id = ${ver.id}
      WHERE id = ${tmpl.id}
    `;
    insertedCount++;
  }

  // 2. Seed Standard Core Templates for all 5 product events + auth + order
  const standardEvents: Array<{ key: string; nameVi: string; nameEn: string }> = [
    { key: 'product_contact', nameVi: 'Liên hệ sản phẩm', nameEn: 'Product enquiry' },
    { key: 'product_download', nameVi: 'Tải tài liệu sản phẩm', nameEn: 'Product document download' },
    { key: 'product_purchase', nameVi: 'Đăng ký mua sản phẩm', nameEn: 'Purchase registration' },
    { key: 'product_quote', nameVi: 'Yêu cầu báo giá', nameEn: 'Quotation request' },
    { key: 'product_hardlock', nameVi: 'Yêu cầu khóa cứng', nameEn: 'Hardware lock request' },
    { key: 'auth_activate', nameVi: 'Kích hoạt tài khoản thành viên', nameEn: 'Account activation' },
    { key: 'auth_forgot_password', nameVi: 'Khôi phục mật khẩu (OTP)', nameEn: 'Password recovery OTP' },
    { key: 'order_confirmation', nameVi: 'Xác nhận đơn hàng', nameEn: 'Order confirmation' },
    { key: 'order_payment_success', nameVi: 'Thanh toán đơn hàng thành công', nameEn: 'Order payment success' },
  ];

  for (const workspace of ['vi', 'en'] as const) {
    const isEn = workspace === 'en';

    for (const evt of standardEvents) {
      // Customer template
      const customerName = isEn ? `${evt.nameEn} (Customer)` : `${evt.nameVi} (Gửi khách hàng)`;
      const [existCust] = await sql`
        SELECT id FROM cic_email_templates
        WHERE workspace = ${workspace} AND event_key = ${evt.key} AND audience = 'customer' AND name = ${customerName}
      `;

      if (!existCust) {
        let subject = isEn ? `[CIC] ${evt.nameEn} — {{request.reference}}` : `[CIC] ${evt.nameVi} — {{request.reference}}`;
        let content = '';

        if (evt.key === 'auth_activate') {
          subject = isEn ? `[CIC] Activate your member account` : `[CIC] Kích hoạt tài khoản thành viên`;
          content = isEn
            ? `Dear {{customer.full_name}},\n\nThank you for registering at CIC. Please click the link below to activate your account:\n{{auth.activation_url}}\n\nThis link is valid for 24 hours.\n\nBest regards,\n{{brand.name}}`
            : `Kính gửi {{customer.full_name}},\n\nCảm ơn bạn đã đăng ký tài khoản tại CIC. Vui lòng bấm vào liên kết dưới đây để kích hoạt tài khoản:\n{{auth.activation_url}}\n\nLiên kết có hiệu lực trong vòng 24 giờ.\n\nTrân trọng,\n{{brand.name}}`;
        } else if (evt.key === 'auth_forgot_password') {
          subject = isEn ? `[CIC] Password reset request - OTP code` : `[CIC] Yêu cầu đặt lại mật khẩu - Mã xác nhận OTP`;
          content = isEn
            ? `Dear {{customer.full_name}},\n\nYour OTP code to reset password is: {{auth.otp_code}}\n\nOr click the link: {{auth.reset_password_url}}\n\nThis code is valid for 15 minutes. If you did not request this, please ignore this email.\n\nBest regards,\n{{brand.name}}`
            : `Kính gửi {{customer.full_name}},\n\nMã OTP xác nhận đặt lại mật khẩu của bạn là: {{auth.otp_code}}\n\nHoặc bấm vào liên kết: {{auth.reset_password_url}}\n\nMã có hiệu lực trong 15 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua thư này.\n\nTrân trọng,\n{{brand.name}}`;
        } else if (evt.key === 'order_confirmation') {
          subject = isEn ? `[CIC] Order confirmation #{{order.code}}` : `[CIC] Xác nhận đơn hàng thành công #{{order.code}}`;
          content = isEn
            ? `Dear {{customer.full_name}},\n\nThank you for placing your order at CIC!\nOrder Code: {{order.code}}\nTotal Amount: {{order.total_amount}}\nPayment Method: {{order.payment_method}}\n\nOrder details:\n{{order.items_table}}\n\nOur team will review and contact you shortly.\n\nBest regards,\n{{brand.name}}`
            : `Kính gửi {{customer.full_name}},\n\nCảm ơn bạn đã đặt hàng tại CIC!\nMã đơn hàng: {{order.code}}\nTổng giá trị thanh toán: {{order.total_amount}}\nPhương thức thanh toán: {{order.payment_method}}\n\nChi tiết đơn hàng:\n{{order.items_table}}\n\nĐội ngũ CIC sẽ liên hệ với bạn trong thời gian sớm nhất để bàn giao sản phẩm/dịch vụ.\n\nTrân trọng,\n{{brand.name}}`;
        } else if (evt.key === 'order_payment_success') {
          subject = isEn ? `[CIC] Payment received for order #{{order.code}}` : `[CIC] Xác nhận thanh toán thành công đơn hàng #{{order.code}}`;
          content = isEn
            ? `Dear {{customer.full_name}},\n\nWe have successfully received your payment for order #{{order.code}}.\nAmount: {{order.total_amount}}\n\nThank you for choosing CIC!\n\nBest regards,\n{{brand.name}}`
            : `Kính gửi {{customer.full_name}},\n\nCIC xác nhận đã nhận được thanh toán thành công cho đơn hàng #{{order.code}}.\nSố tiền: {{order.total_amount}}\n\nCảm ơn bạn đã tin tưởng lựa chọn sản phẩm và giải pháp của CIC!\n\nTrân trọng,\n{{brand.name}}`;
        } else if (evt.key === 'product_download') {
          content = isEn
            ? `Dear {{customer.full_name}},\n\nThank you for your interest in {{product.name}}.\nPlease download the document/software using the link below:\n{{document.name}}: {{document.download_url}}\nLink expires at: {{document.expires_at}}\n{{document.download_instruction}}\n\nBest regards,\n{{brand.name}}`
            : `Kính gửi {{customer.full_name}},\n\nCảm ơn bạn đã quan tâm đến sản phẩm {{product.name}}.\nChúng tôi gửi bạn liên kết tải tài liệu/phần mềm dưới đây:\n{{document.name}}: {{document.download_url}}\nLiên kết có hiệu lực đến: {{document.expires_at}}\n{{document.download_instruction}}\n\nTrân trọng,\n{{brand.name}}`;
        } else {
          content = isEn
            ? `Hello {{customer.full_name}},\n\n{{brand.name}} has received your request regarding {{product.name}} at {{request.received_at}}.\nReference: {{request.reference}}\n\nOur team will review the information and contact you with the next steps.\n\nBest regards,\n{{brand.name}}`
            : `Xin chào {{customer.full_name}},\n\n{{brand.name}} đã tiếp nhận yêu cầu của bạn về {{product.name}} vào lúc {{request.received_at}}.\nMã yêu cầu: {{request.reference}}\n\nBộ phận phụ trách sẽ kiểm tra thông tin và liên hệ với bạn để hướng dẫn bước tiếp theo.\n\nTrân trọng,\n{{brand.name}}`;
        }

        const [t] = await sql`
          INSERT INTO cic_email_templates (
            workspace, name, event_key, audience, status,
            created_by, updated_by, activated_by, activated_at
          ) VALUES (
            ${workspace}, ${customerName}, ${evt.key}, 'customer', 'active',
            ${actorId}, ${actorId}, ${actorId}, now()
          ) RETURNING id
        `;

        const [v] = await sql`
          INSERT INTO cic_email_template_versions (
            template_id, version_number, subject, content, created_by
          ) VALUES (
            ${t.id}, 1, ${subject}, ${content}, ${actorId}
          ) RETURNING id
        `;

        await sql`
          UPDATE cic_email_templates
          SET active_version_id = ${v.id}, draft_version_id = ${v.id}
          WHERE id = ${t.id}
        `;
        insertedCount++;
      }

      // Internal template (for requests & orders)
      if (evt.key !== 'auth_activate' && evt.key !== 'auth_forgot_password') {
        const internalName = isEn ? `${evt.nameEn} (Internal Notification)` : `${evt.nameVi} (Thông báo nội bộ)`;
        const [existInt] = await sql`
          SELECT id FROM cic_email_templates
          WHERE workspace = ${workspace} AND event_key = ${evt.key} AND audience = 'internal' AND name = ${internalName}
        `;

        if (!existInt) {
          const subject = isEn
            ? `[INTERNAL] [${evt.nameEn}] {{product.name}} — {{request.reference}}`
            : `[NỘI BỘ] [${evt.nameVi}] {{product.name}} — {{request.reference}}`;
          const content = isEn
            ? `A new request requires review.\n\nRequest: {{request.type_name}} — {{request.reference}}\nCustomer: {{customer.full_name}} — {{customer.email}} — {{customer.phone}}\nProduct: {{product.name}}\nMessage: {{request.message}}\n\nOpen in CMS: {{cms.request_url}}`
            : `Có yêu cầu mới cần kiểm tra và xử lý.\n\nYêu cầu: {{request.type_name}} — {{request.reference}}\nKhách hàng: {{customer.full_name}} — {{customer.email}} — {{customer.phone}}\nSản phẩm: {{product.name}}\nNội dung: {{request.message}}\n\nMở trong CMS: {{cms.request_url}}`;

          const [t] = await sql`
            INSERT INTO cic_email_templates (
              workspace, name, event_key, audience, status,
              created_by, updated_by, activated_by, activated_at
            ) VALUES (
              ${workspace}, ${internalName}, ${evt.key}, 'internal', 'active',
              ${actorId}, ${actorId}, ${actorId}, now()
            ) RETURNING id
          `;

          const [v] = await sql`
            INSERT INTO cic_email_template_versions (
              template_id, version_number, subject, content, created_by
            ) VALUES (
              ${t.id}, 1, ${subject}, ${content}, ${actorId}
            ) RETURNING id
          `;

          await sql`
            UPDATE cic_email_templates
            SET active_version_id = ${v.id}, draft_version_id = ${v.id}
            WHERE id = ${t.id}
          `;
          insertedCount++;
        }
      }
    }
  }

  const [after] = await sql`SELECT count(*)::int as count FROM cic_email_templates`;
  console.log(`Seed completed! Inserted ${insertedCount} templates. Total in DB: ${after.count}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
