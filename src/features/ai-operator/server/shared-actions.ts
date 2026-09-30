'use server';

import { requireCmsAccess } from '@/server/auth/guards';
import { getLlmProvider } from './llm-provider';

export interface GenerateSeoInput {
  title: string;
  brandName?: string;
  categoryName?: string;
  content?: string;
  moduleType?: 'product' | 'news' | 'event' | 'service' | 'project';
}

export interface GenerateSeoOutput {
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
}

/**
 * Shared AI Action: Generate high-performing, accurate B2B SEO metadata
 * Usable across all CMS modules: Products, News, Events, Projects, Services.
 */
export async function generateSeoAction(input: GenerateSeoInput): Promise<GenerateSeoOutput> {
  await requireCmsAccess();

  const title = input.title?.trim();
  if (!title) {
    throw new Error('Tiêu đề hoặc tên bài viết là bắt buộc để tạo SEO.');
  }

  const llm = getLlmProvider();
  const systemPrompt = `Bạn là Giám đốc Marketing & SEO cao cấp của Công ty Cổ phần Công nghệ và Tư vấn Đầu tư Xây dựng (CIC).
QUY TẮC CỐT LÕI VỀ THƯƠNG HIỆU & NỘI DUNG (TUÂN THỦ 100%):
1. VAI TRÒ DOANH NGHIỆP:
   - CIC là ĐƠN VỊ PHÂN PHỐI BẢN QUYỀN CHÍNH THỨC & CHUYỂN GIAO CÔNG NGHỆ tại Việt Nam, KHÔNG PHẢI là tác giả phát triển các phần mềm quốc tế (Ví dụ: CSI là hãng phát triển ETABS/SAP2000; ASCON phát triển Kompas-3D; PTV Group phát triển Vissim/Visum).
   - Chỉ những phần mềm nội bộ như Escon, CICTKT, KPW mới do CIC phát triển.
2. TỪ KHÓA BỊ CẤM TUYỆT ĐỐI (NEGATIVE KEYWORDS):
   - KHÔNG BAO GIỜ dùng các từ: "Tải", "Download", "Tải về", "Cài đặt miễn phí", "Crack", "Full crack", "Keygen", "Link tải".
   - Lý do: Đây là giải pháp phần mềm kỹ thuật bản quyền cao cấp B2B cho kỹ sư/doanh nghiệp. Dùng từ "Tải" làm giảm uy tín thương hiệu và giống các web phát tán phần mềm lậu.
3. TỪ KHÓA KHUYẾN KHÍCH:
   - Hãy dùng: "Bản quyền chính hãng", "Phần mềm", "Giải pháp", "Tư vấn & Báo giá", "Chính hãng tại CIC".

TIÊU CHUẨN ĐẦU RA (JSON):
- seo_title: Tối đa 60 ký tự (chuẩn độ dài hiển thị Google Desktop/Mobile).
  * Mẫu khuyến nghị: "Phần mềm [Tên sản phẩm] ([Hãng SX]) — Bản quyền chính hãng | CIC" hoặc "Bản quyền [Tên sản phẩm] chính hãng [Hãng SX] — CIC"
- seo_description: 135 đến 155 ký tự. Nêu rõ: CIC phân phối chính hãng [Tên sản phẩm] từ [Hãng SX] tại Việt Nam; cung cấp chuyển giao công nghệ, đào tạo và báo giá doanh nghiệp.
- seo_keyword: 5 đến 8 từ khóa kỹ thuật chuẩn (Tên sản phẩm, Hãng SX, Lĩnh vực, Bản quyền chính hãng, Giải pháp CIC).
Chỉ trả về JSON thuần túy: { "seo_title": "...", "seo_description": "...", "seo_keyword": "..." }`;

  const userPrompt = JSON.stringify({
    title,
    brandName: input.brandName || '',
    categoryName: input.categoryName || '',
    moduleType: input.moduleType || 'general',
    sampleContent: (input.content || '').replace(/<[^>]*>?/gm, '').substring(0, 1000),
  });

  return await llm.generateStructured<GenerateSeoOutput>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });
}

export interface GenerateSummaryInput {
  title: string;
  brandName?: string;
  categoryName?: string;
  content: string;
  maxLength?: number;
}

export interface GenerateSummaryOutput {
  summary: string;
}

/**
 * Shared AI Action: Generate concise summary / excerpt from full content
 */
export async function generateSummaryAction(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  await requireCmsAccess();

  const title = input.title?.trim() || '';
  const cleanContent = (input.content || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

  if (!title && !cleanContent) {
    throw new Error('Cần có tiêu đề hoặc nội dung để tạo tóm tắt.');
  }

  const llm = getLlmProvider();
  const maxLen = input.maxLength || 220;

  const systemPrompt = `Bạn là biên tập viên kỹ thuật cao cấp của CIC.
QUY TẮC NỘI DUNG:
1. Xác định đúng quan hệ: CIC là đối tác phân phối chính hãng và hỗ trợ kỹ thuật tại Việt Nam cho giải pháp của Hãng sản xuất đối tác.
2. TUYỆT ĐỐI KHÔNG nhận CIC là đơn vị phát triển nếu phần mềm thuộc đối tác (như CSI, ASCON, PTV Group, Bentley, Autodesk).
3. Văn phong B2B chuyên nghiệp, tập trung vào giá trị kỹ thuật thực tế, tiêu chuẩn tính toán và công năng phục vụ kỹ sư/doanh nghiệp.
4. Độ dài: 1-2 câu súc tích (dưới ${maxLen} ký tự), không chứa markdown, không chứa từ "Tải" hay "Download".
Định dạng JSON: { "summary": "..." }`;

  const userPrompt = JSON.stringify({
    title,
    brandName: input.brandName || '',
    categoryName: input.categoryName || '',
    content: cleanContent.substring(0, 2000),
  });

  return await llm.generateStructured<GenerateSummaryOutput>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });
}

export interface ExtractTagsInput {
  title: string;
  content?: string;
  count?: number;
}

export interface ExtractTagsOutput {
  tags: string[];
}

/**
 * Shared AI Action: Extract relevant topic and technology tags
 */
export async function extractTagsAction(input: ExtractTagsInput): Promise<ExtractTagsOutput> {
  await requireCmsAccess();

  const title = input.title?.trim() || '';
  const cleanContent = (input.content || '').replace(/<[^>]*>?/gm, ' ').substring(0, 1500).trim();

  const llm = getLlmProvider();
  const tagCount = input.count || 5;

  const systemPrompt = `Bạn là chuyên gia phân loại dữ liệu CIC. Hãy trích xuất từ 3 đến ${tagCount} thẻ tag chuyên ngành kỹ thuật chuẩn xác, không trùng lặp, viết hoa chữ cái đầu hoặc đúng danh từ riêng (VD: "SAP2000", "Phần mềm kết cấu", "ASCON", "Bản quyền CIC").
Định dạng JSON trả về: { "tags": ["tag1", "tag2", ...] }`;

  const userPrompt = JSON.stringify({
    title,
    content: cleanContent,
  });

  return await llm.generateStructured<ExtractTagsOutput>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });
}

export interface TranslateFieldsInput {
  fields: Record<string, string>;
  targetLang?: 'en' | 'vi';
}

export interface TranslateFieldsOutput {
  translations: Record<string, string>;
}

/**
 * Shared AI Action: Translate any content fields (Title, Summary, RichText, SEO) between VI and EN.
 * Preserves HTML formatting for rich-text fields.
 */
export async function translateFieldsAction(input: TranslateFieldsInput): Promise<TranslateFieldsOutput> {
  await requireCmsAccess();

  const { fields, targetLang = 'en' } = input;
  const targetLanguageName = targetLang === 'en' ? 'English (Professional Engineering & Business tone)' : 'Tiếng Việt';

  const llm = getLlmProvider();
  const systemPrompt = `You are a professional technical translator for CIC Technology (a leading distributor of engineering software and solutions).
Translate the provided key-value object into ${targetLanguageName}.
CRITICAL RULES:
1. Preserve all HTML tags, classes, and links intact (e.g. <p>, <b>, <ul>, <li>, <h3>, <a>).
2. Use precise software engineering and AEC industry terminology (e.g. Structural analysis, Geotechnical engineering, BIM, CAD, Licensing).
3. Do not invent facts, only translate with high elegance and fidelity.
Return a JSON object containing the translated key-value pairs matching the exact keys. Example: { "translations": { "name": "...", "summary": "..." } }`;

  const userPrompt = JSON.stringify({
    fieldsToTranslate: fields,
    targetLanguage: targetLang,
  });

  return await llm.generateStructured<TranslateFieldsOutput>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });
}

export interface GenerateOutlineInput {
  title: string;
  moduleType?: 'product' | 'news' | 'event';
  notes?: string;
}

export interface GenerateOutlineOutput {
  outlineHtml: string;
}

/**
 * Shared AI Action: Generate a technical outline template for editors to fill in,
 * without replacing their custom images or deep domain knowledge.
 */
export async function generateOutlineAction(input: GenerateOutlineInput): Promise<GenerateOutlineOutput> {
  await requireCmsAccess();

  const title = input.title?.trim();
  if (!title) {
    throw new Error('Tiêu đề là bắt buộc để tạo dàn ý.');
  }

  const llm = getLlmProvider();
  const systemPrompt = `Bạn là biên tập viên kỹ thuật trưởng của CIC.
Nhiệm vụ của bạn là soạn một KHUNG DÀN Ý BÀI VIẾT (Outline Template) chuẩn mực dạng HTML để kỹ sư hoặc biên tập viên dễ dàng điền tiếp số liệu và chèn ảnh minh họa.
KHUNG DÀN Ý PHẢI CÓ CẤU TRÚC:
- <h3>1. Giới thiệu tổng quan</h3> (kèm 1 đoạn gợi mở ngắn)
- <h3>2. Các tính năng & công nghệ nổi bật</h3> (gợi ý các gạch đầu dòng tính năng chính)
- <h3>3. Lợi ích ứng dụng thực tế</h3> (áp dụng cho công trình / dự án)
- <h3>4. Yêu cầu cấu hình & Bản quyền chính hãng</h3> (gợi ý thông tin chuyển giao)
Chỉ trả về JSON định dạng: { "outlineHtml": "<h3>1...</h3><p>...</p>..." }`;

  const userPrompt = JSON.stringify({
    title,
    moduleType: input.moduleType || 'product',
    notes: input.notes || '',
  });

  return await llm.generateStructured<GenerateOutlineOutput>({
    systemPrompt,
    userPrompt,
    temperature: 0.3,
  });
}
