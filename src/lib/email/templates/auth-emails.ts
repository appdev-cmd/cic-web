import { sendEmail, type SendMailResult } from '../transporter';
import { getEmailTemplateForEvent } from '@/features/email-templates/server/queries';
import { interpolateTokens } from '../tokens';

interface WelcomeEmailParams {
  to: string;
  fullName: string;
  username: string;
  password?: string;
  roleName?: string;
  loginUrl: string;
}

interface PasswordResetEmailParams {
  to: string;
  fullName: string;
  username: string;
  resetUrl: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Khung sườn email HTML chuẩn thương hiệu CIC
 */
function renderCicEmailWrapper(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.6; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Container 600px -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- HEADER BANNER CHUẨN CIC -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 30px; text-align: center; border-bottom: 4px solid #ea580c;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
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
              </table>
            </td>
          </tr>

          <!-- MAIN BODY CONTENT -->
          <tr>
            <td style="padding: 35px 30px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- FOOTER CHUẨN CIC -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.7;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <strong style="color: #0f172a; font-size: 13px;">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC</strong><br/>
                    <span style="color: #475569;">Trụ sở chính:</span> Số 37 Lê Đại Hành, Quận Hai Bà Trưng, TP. Hà Nội<br/>
                    <span style="color: #475569;">Tổng đài hỗ trợ:</span> <strong style="color: #ea580c;">024 3974 1373</strong> - <strong style="color: #ea580c;">0866 059 659</strong><br/>
                    <span style="color: #475569;">Email:</span> <a href="mailto:info@cic.com.vn" style="color: #0284c7; text-decoration: none;">info@cic.com.vn</a> | 
                    <span style="color: #475569;">Website:</span> <a href="https://www.cic.com.vn" target="_blank" style="color: #0284c7; text-decoration: none;">www.cic.com.vn</a>
                    
                    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #94a3b8; text-align: center;">
                      Đây là thư điện tử được gửi tự động từ hệ thống quản trị CIC Portal. Vui lòng không phản hồi trực tiếp vào địa chỉ email này.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. Mẫu Email Chào mừng & Thông tin tài khoản mới
 */
export function renderWelcomeUserEmailHtml(params: WelcomeEmailParams): string {
  const safeName = escapeHtml(params.fullName || 'Thành viên mới');
  const safeUsername = escapeHtml(params.username);
  const safeEmail = escapeHtml(params.to);
  const safePassword = params.password ? escapeHtml(params.password) : null;
  const safeRole = escapeHtml(params.roleName || 'Quản trị viên');
  const safeLoginUrl = escapeHtml(params.loginUrl);

  const content = `
    <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px; font-weight: 700;">
      Kính gửi ${safeName},
    </h2>
    <p style="color: #334155; font-size: 14px; margin: 0 0 20px;">
      Tài khoản quản trị của bạn trên hệ thống <strong>CIC Portal</strong> đã được khởi tạo thành công. Dưới đây là thông tin đăng nhập chính thức để truy cập vào hệ thống:
    </p>

    <!-- HỘP THÔNG TIN TÀI KHOẢN -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 0 0 24px; overflow: hidden;">
      <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9;">
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
                ${safeUsername}
              </td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Email đăng nhập:</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">
                <a href="mailto:${safeEmail}" style="color: #0284c7; text-decoration: none;">${safeEmail}</a>
              </td>
            </tr>
            ${
              safePassword
                ? `
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Mật khẩu khởi tạo:</td>
              <td style="padding: 6px 0;">
                <span style="display: inline-block; background-color: #fff7ed; color: #c2410c; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 14px; font-weight: 700; border: 1px solid #fed7aa;">
                  ${safePassword}
                </span>
              </td>
            </tr>
            `
                : ''
            }
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Vai trò phân quyền:</td>
              <td style="color: #1e3a8a; padding: 6px 0; font-weight: 600;">
                ${safeRole}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- NÚT BẤM ĐĂNG NHẬP -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${safeLoginUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 34px; border-radius: 10px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25); letter-spacing: 0.3px;">
        ĐĂNG NHẬP VÀO HỆ THỐNG
      </a>
    </div>

    <!-- KHUYẾN NGHỊ BẢO MẬT -->
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin: 24px 0 0; font-size: 13px; color: #92400e; line-height: 1.6;">
      <strong>Khuyến nghị an toàn:</strong> Vì lý do bảo mật, vui lòng đăng nhập và chủ động thay đổi mật khẩu cá nhân ngay trong lần truy cập đầu tiên. Tuyệt đối không chia sẻ mật khẩu này với người khác.
    </div>
  `;

  return renderCicEmailWrapper('Thông tin tài khoản quản trị hệ thống CIC', content);
}

/**
 * 2. Mẫu Email Khôi phục Mật khẩu
 */
export function renderPasswordResetEmailHtml(params: PasswordResetEmailParams): string {
  const safeName = escapeHtml(params.fullName || 'Quý khách');
  const safeUsername = escapeHtml(params.username);
  const safeResetUrl = escapeHtml(params.resetUrl);

  const content = `
    <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px; font-weight: 700;">
      Kính gửi ${safeName},
    </h2>
    <p style="color: #334155; font-size: 14px; margin: 0 0 16px; line-height: 1.6;">
      Hệ thống bảo mật CIC vừa tiếp nhận yêu cầu thiết lập lại mật khẩu cho tài khoản <strong>${safeUsername}</strong>.
    </p>
    <p style="color: #334155; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
      Để tạo mật khẩu mới cho tài khoản, vui lòng nhấn vào nút bên dưới:
    </p>

    <!-- NÚT BẤM THIẾT LẬP MẬT KHẨU -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${safeResetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 34px; border-radius: 10px; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.25); letter-spacing: 0.3px;">
        ĐẶT LẠI MẬT KHẨU CỦA BẠN
      </a>
    </div>

    <!-- LINK PHỤ PHÒNG HỜ KHÔNG CLICK ĐƯỢC -->
    <p style="color: #64748b; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
      Nếu nút bấm trên không hoạt động, bạn có thể sao chép liên kết sau và dán vào thanh địa chỉ của trình duyệt:<br/>
      <a href="${safeResetUrl}" style="color: #0284c7; word-break: break-all; font-family: monospace; font-size: 11px;">${safeResetUrl}</a>
    </p>

    <!-- CẢNH BÁO BẢO MẬT & THỜI HẠN -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #64748b; border-radius: 8px; padding: 14px 16px; margin: 24px 0 0; font-size: 12px; color: #475569; line-height: 1.6;">
      <strong>Lưu ý bảo mật:</strong>
      <ul style="margin: 6px 0 0; padding-left: 18px;">
        <li>Liên kết này chỉ có hiệu lực trong vòng <strong>24 giờ</strong> kể từ thời điểm gửi.</li>
        <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu hiện tại của bạn vẫn được giữ an toàn tuyệt đối.</li>
      </ul>
    </div>
  `;

  return renderCicEmailWrapper('Yêu cầu thiết lập lại mật khẩu tài khoản CIC Portal', content);
}

/**
 * Gửi email chào mừng kèm thông tin tài khoản (Tự động nạp mẫu từ DB nếu có, có fallback)
 */
export async function sendWelcomeUserEmail(params: WelcomeEmailParams): Promise<SendMailResult> {
  const variables: Record<string, string> = {
    '{{customer.full_name}}': params.fullName || 'Thành viên mới',
    '{{auth.username}}': params.username,
    '{{customer.email}}': params.to,
    '{{auth.password}}': params.password || '',
    '{{auth.role_name}}': params.roleName || 'Quản trị viên',
    '{{auth.login_url}}': params.loginUrl,
    '{{auth.activation_url}}': params.loginUrl,
    '{{brand.name}}': 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC',
    '{{brand.website_url}}': 'https://www.cic.com.vn',
    '{{brand.support_email}}': 'info@cic.com.vn',
    '{{brand.support_phone}}': '024 3974 1373 - 0866 059 659',
  };

  try {
    const dbTemplate = await getEmailTemplateForEvent('vi', 'auth_activate', 'customer');
    if (dbTemplate && dbTemplate.content) {
      const subject = interpolateTokens(dbTemplate.subject || '[CIC Portal] Thông tin tài khoản quản trị hệ thống của bạn', variables, { isHtml: false });
      const html = interpolateTokens(dbTemplate.content, variables, { isHtml: true });
      return sendEmail({
        to: params.to,
        subject,
        html,
      });
    }
  } catch (error) {
    console.warn('[sendWelcomeUserEmail] Không thể tải mẫu email từ DB, dùng mẫu mặc định dự phòng:', error);
  }

  // Fallback mặc định nếu chưa cấu hình DB hoặc DB có sự cố
  const html = renderWelcomeUserEmailHtml(params);
  const text = `
Kính gửi ${params.fullName || 'Thành viên mới'},

Tài khoản quản trị của bạn trên hệ thống CIC Portal đã được khởi tạo thành công.
Thông tin đăng nhập:
- Tên đăng nhập: ${params.username}
- Email: ${params.to}
${params.password ? `- Mật khẩu khởi tạo: ${params.password}` : ''}
${params.roleName ? `- Vai trò: ${params.roleName}` : ''}

Đường dẫn đăng nhập: ${params.loginUrl}

Vui lòng đăng nhập và đổi mật khẩu ngay trong lần truy cập đầu tiên.

Trân trọng,
Công ty Cổ phần Công nghệ và Tư vấn CIC
Hotline: 024 3974 1373 - 0866 059 659
Website: https://www.cic.com.vn
  `.trim();

  return sendEmail({
    to: params.to,
    subject: '[CIC Portal] Thông tin tài khoản quản trị hệ thống của bạn',
    html,
    text,
  });
}

/**
 * Gửi email khôi phục mật khẩu tài khoản (Tự động nạp mẫu từ DB nếu có, có fallback)
 */
export async function sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<SendMailResult> {
  const variables: Record<string, string> = {
    '{{customer.full_name}}': params.fullName || 'Quý khách',
    '{{auth.username}}': params.username,
    '{{auth.reset_password_url}}': params.resetUrl,
    '{{brand.name}}': 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC',
    '{{brand.website_url}}': 'https://www.cic.com.vn',
    '{{brand.support_email}}': 'info@cic.com.vn',
    '{{brand.support_phone}}': '024 3974 1373 - 0866 059 659',
  };

  try {
    const dbTemplate = await getEmailTemplateForEvent('vi', 'auth_forgot_password', 'customer');
    if (dbTemplate && dbTemplate.content) {
      const subject = interpolateTokens(dbTemplate.subject || '[CIC Portal] Yêu cầu thiết lập lại mật khẩu tài khoản', variables, { isHtml: false });
      const html = interpolateTokens(dbTemplate.content, variables, { isHtml: true });
      return sendEmail({
        to: params.to,
        subject,
        html,
      });
    }
  } catch (error) {
    console.warn('[sendPasswordResetEmail] Không thể tải mẫu email từ DB, dùng mẫu mặc định dự phòng:', error);
  }

  // Fallback mặc định nếu chưa cấu hình DB hoặc DB có sự cố
  const html = renderPasswordResetEmailHtml(params);
  const text = `
Kính gửi ${params.fullName || 'Quý khách'},

Hệ thống vừa tiếp nhận yêu cầu đặt lại mật khẩu cho tài khoản ${params.username}.
Vui lòng truy cập đường dẫn sau để tạo mật khẩu mới:
${params.resetUrl}

Liên kết này có hiệu lực trong vòng 24 giờ.
Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua thư này.

Trân trọng,
Công ty Cổ phần Công nghệ và Tư vấn CIC
Hotline: 024 3974 1373 - 0866 059 659
Website: https://www.cic.com.vn
  `.trim();

  return sendEmail({
    to: params.to,
    subject: '[CIC Portal] Yêu cầu thiết lập lại mật khẩu tài khoản',
    html,
    text,
  });
}
