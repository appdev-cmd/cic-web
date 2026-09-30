'use server';

import { requireCmsAccess } from '@/server/auth/guards';
import { getLlmProvider } from './llm-provider';

export interface GenerateSeoInput {
  title: string;
  content?: string;
  moduleType?: 'product' | 'news' | 'event' | 'service' | 'project';
}

export interface GenerateSeoOutput {
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
}

/**
 * Shared AI Action: Generate high-performing SEO metadata
 * Usable across all CMS modules: Products, News, Events, Projects, Services.
 */
export async function generateSeoAction(input: GenerateSeoInput): Promise<GenerateSeoOutput> {
  await requireCmsAccess();

  const title = input.title?.trim();
  if (!title) {
    throw new Error('Tiêu đề hoặc tên bài viết là bắt buộc để tạo SEO.');
  }

  const llm = getLlmProvider();
  const systemPrompt = `Bạn là chuyên gia SEO hàng đầu cho tập đoàn công nghệ và phần mềm kỹ thuật CIC (Building Information Modeling, CAD/CAM, Kết cấu, Giao thông, Địa kỹ thuật).
Nhiệm vụ của bạn là sinh metadata SEO chuẩn Google tối ưu tỷ lệ nhấp (CTR):
- seo_title: Tối đa 65 ký tự, hấp dẫn, chứa từ khóa chính, kèm nhận diện thương hiệu "CIC".
- seo_description: 140 đến 160 ký tự, súc tích, tóm tắt giá trị chính và có lời kêu gọi hành động (Call To Action).
- seo_keyword: 4 đến 8 từ khóa kỹ thuật chuyên ngành quan trọng nhất, cách nhau bằng dấu phẩy.
Trả về định dạng JSON thuần túy gồm 3 trường: seo_title, seo_description, seo_keyword.`;

  const userPrompt = JSON.stringify({
    title,
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

  const systemPrompt = `Bạn là biên tập viên kỹ thuật của CIC. Hãy đọc nội dung và viết một đoạn tóm tắt (excerpt) chuyên nghiệp, súc tích (khoảng 1-2 câu, dưới ${maxLen} ký tự) để hiển thị ngoài danh sách bài viết/sản phẩm.
Định dạng JSON trả về: { "summary": "..." }`;

  const userPrompt = JSON.stringify({
    title,
    content: cleanContent.substring(0, 2000),
  });

  return await llm.generateStructured<GenerateSummaryOutput>({
    systemPrompt,
    userPrompt,
    temperature: 0.3,
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
