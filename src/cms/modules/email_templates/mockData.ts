import { EmailAudience, EmailEvent, EmailTemplate, EmailWorkspace } from './types';

const events: Array<{ event: EmailEvent; vi: string; en: string }> = [
  { event: 'product_contact', vi: 'Liên hệ sản phẩm', en: 'Product enquiry' },
  { event: 'product_download', vi: 'Tải tài liệu sản phẩm', en: 'Product document download' },
  { event: 'product_purchase', vi: 'Đăng ký mua sản phẩm', en: 'Purchase registration' },
  { event: 'product_quote', vi: 'Yêu cầu báo giá', en: 'Quotation request' },
  { event: 'product_hardlock', vi: 'Yêu cầu khóa cứng', en: 'Hardware lock request' },
];

const customerContent = (locale: EmailWorkspace, event: EmailEvent) => {
  const isEn = locale === 'en';
  const intro = isEn ? 'Hello {{customer.full_name}},' : 'Xin chào {{customer.full_name}},';
  const received = isEn
    ? '{{brand.name}} received your request about {{product.name}} at {{request.received_at}}.'
    : '{{brand.name}} đã tiếp nhận yêu cầu của bạn về {{product.name}} vào {{request.received_at}}.';
  const reference = isEn ? 'Reference: {{request.reference}}' : 'Mã yêu cầu: {{request.reference}}';
  const next = event === 'product_download'
    ? (isEn ? 'Download {{document.name}}: {{document.download_url}}\nAvailable until {{document.expires_at}}.' : 'Tải {{document.name}}: {{document.download_url}}\nLiên kết có hiệu lực đến {{document.expires_at}}.')
    : (isEn ? 'Our team will review the information and contact you with the next steps.' : 'Bộ phận phụ trách sẽ kiểm tra thông tin và liên hệ để hướng dẫn bước tiếp theo.');
  const sign = isEn ? 'Regards,\n{{brand.name}}' : 'Trân trọng,\n{{brand.name}}';
  return [intro, '', received, reference, '', next, '', sign].join('\n');
};

const internalContent = (locale: EmailWorkspace) => locale === 'en'
  ? 'A new request requires review.\n\nRequest: {{request.type_name}} — {{request.reference}}\nCustomer: {{customer.full_name}} — {{customer.email}}\nProduct: {{product.name}}\nMessage: {{request.message}}\n\nOpen in CMS: {{cms.request_url}}'
  : 'Có yêu cầu mới cần kiểm tra.\n\nYêu cầu: {{request.type_name}} — {{request.reference}}\nKhách hàng: {{customer.full_name}} — {{customer.email}}\nSản phẩm: {{product.name}}\nNội dung: {{request.message}}\n\nMở trong CMS: {{cms.request_url}}';

const makeTemplate = (workspace: EmailWorkspace, event: typeof events[number], audience: EmailAudience, index: number): EmailTemplate => {
  const isEn = workspace === 'en';
  const eventName = isEn ? event.en : event.vi;
  return {
    id: `${workspace}-${event.event}-${audience}`,
    workspace,
    name: audience === 'customer'
      ? (isEn ? `${eventName} acknowledgement` : `Xác nhận ${eventName.toLowerCase()}`)
      : (isEn ? `New ${eventName.toLowerCase()} notification` : `Thông báo ${eventName.toLowerCase()} mới`),
    event: event.event,
    audience,
    subject: audience === 'customer'
      ? (isEn ? `${eventName} — {{request.reference}}` : `${eventName} — {{request.reference}}`)
      : `[${eventName}] {{product.name}} — {{request.reference}}`,
    content: audience === 'customer' ? customerContent(workspace, event.event) : internalContent(workspace),
    status: 'draft',
    version: 1,
    usageCount: 0,
    updatedAt: `2026-08-${String(5 - Math.min(index, 4)).padStart(2, '0')} 09:00`,
  };
};

export const mockEmailTemplates: EmailTemplate[] = (['vi', 'en'] as EmailWorkspace[]).flatMap((workspace) =>
  events.flatMap((event, index) => [makeTemplate(workspace, event, 'customer', index), makeTemplate(workspace, event, 'internal', index)]),
);
