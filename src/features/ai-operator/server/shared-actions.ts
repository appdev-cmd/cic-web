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
   - CIC là ĐƠN VỊ PHÂN PHỐI BẢN QUYỀN CHÍNH THỨC, TƯ VẤN GIẢI PHÁP & CHUYỂN GIAO CÔNG NGHỆ tại Việt Nam, KHÔNG PHẢI là tác giả phát triển các sản phẩm/phần mềm quốc tế (trừ các sản phẩm thương hiệu riêng do chính CIC phát triển như Escon, CICTKT, KPW).
   - Hãy tôn trọng thương hiệu và quyền tác giả của Hãng sản xuất (nếu có), đồng thời khẳng định rõ ràng vai trò đại diện phân phối chính hãng và hỗ trợ kỹ thuật của CIC.
2. TỪ KHÓA BỊ CẤM TUYỆT ĐỐI (NEGATIVE KEYWORDS):
   - KHÔNG BAO GIỜ dùng các từ: "Tải", "Download", "Tải về", "Cài đặt miễn phí", "Crack", "Full crack", "Keygen", "Link tải".
   - Lý do: Đây là các giải pháp công nghệ, phần mềm, thiết bị kỹ thuật bản quyền cao cấp B2B. Dùng từ "Tải" làm giảm uy tín thương hiệu và gây hiểu lầm là web chia sẻ phần mềm lậu.
3. TỪ KHÓA KHUYẾN KHÍCH:
   - Hãy linh hoạt sử dụng: "Bản quyền chính hãng", "Giải pháp", "Thiết bị", "Phần mềm", "Tư vấn & Báo giá", "Chính hãng tại CIC".

TIÊU CHUẨN ĐẦU RA (JSON):
- seo_title: Tối đa 60 ký tự (chuẩn độ dài hiển thị Google Desktop/Mobile). Tùy theo bản chất sản phẩm (phần mềm, thiết bị, dịch vụ) để đặt tiêu đề linh hoạt, hấp dẫn và tự nhiên:
  * Ví dụ: "[Tên sản phẩm] ([Hãng SX]) — Bản quyền chính hãng | CIC" hoặc "Giải pháp [Tên sản phẩm] chính hãng [Hãng SX] — CIC"
- seo_description: 135 đến 155 ký tự. Nêu rõ tính năng cốt lõi và vai trò của CIC là đại diện phân phối/chuyển giao công nghệ chính hãng tại Việt Nam, kèm dịch vụ tư vấn kỹ thuật.
- seo_keyword: Chuỗi văn bản chứa 5 đến 8 từ khóa kỹ thuật chuẩn cách nhau bởi dấu phẩy (Ví dụ: "Tên SP, Hãng SX, Lĩnh vực, Bản quyền chính hãng, Giải pháp CIC").
Chỉ trả về JSON thuần túy: { "seo_title": "...", "seo_description": "...", "seo_keyword": "..." }`;

  const userPrompt = JSON.stringify({
    title,
    brandName: input.brandName || '',
    categoryName: input.categoryName || '',
    moduleType: input.moduleType || 'general',
    sampleContent: (input.content || '').replace(/<[^>]*>?/gm, '').substring(0, 1000),
  });

  const raw = await llm.generateStructured<Record<string, unknown>>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });

  const seo_keyword = Array.isArray(raw.seo_keyword)
    ? raw.seo_keyword.map(String).join(', ')
    : String(raw.seo_keyword || '');
  const seo_title = Array.isArray(raw.seo_title)
    ? raw.seo_title.map(String).join(' ')
    : String(raw.seo_title || '');
  const seo_description = Array.isArray(raw.seo_description)
    ? raw.seo_description.map(String).join(' ')
    : String(raw.seo_description || '');

  return { seo_title, seo_description, seo_keyword };
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

  const raw = await llm.generateStructured<any>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });

  const translations = raw && typeof raw === 'object' && 'translations' in raw && typeof raw.translations === 'object' && raw.translations !== null
    ? (raw.translations as Record<string, string>)
    : (raw && typeof raw === 'object' ? (raw as Record<string, string>) : {});

  return { translations };
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

export interface AvailableTaxonomyOption {
  id: string;
  name: string;
}

export interface CandidateProductOption {
  id: string;
  name: string;
  brandName?: string;
  categoryName?: string;
}

export interface ClassifyProductTaxonomyInput {
  name: string;
  brandName?: string;
  categoryNames?: string[];
  content?: string;
  availableTypes: AvailableTaxonomyOption[];
  availableApplications: AvailableTaxonomyOption[];
  candidateProducts: CandidateProductOption[];
}

export interface ClassifyProductTaxonomyOutput {
  suggestedSku: string;
  selectedTypeId: string;
  selectedApplicationIds: string[];
  selectedRelatedProductIds: string[];
}

/**
 * Shared AI Action: Dynamically classify product taxonomy (Types, Applications, SKU, Related Products)
 * based on semantic engineering analysis without hardcoding product names or categories.
 */
export async function classifyProductTaxonomyAction(
  input: ClassifyProductTaxonomyInput
): Promise<ClassifyProductTaxonomyOutput> {
  await requireCmsAccess();

  const name = input.name?.trim();
  if (!name) {
    throw new Error('Tên sản phẩm là bắt buộc để phân loại kỹ thuật.');
  }

  const llm = getLlmProvider();
  const systemPrompt = `Bạn là chuyên gia phân loại kỹ thuật và quản lý danh mục sản phẩm công nghệ của CIC (Công ty phân phối phần mềm, thiết bị kỹ thuật, đào tạo và chuyển giao công nghệ tại Việt Nam).
NHIỆM VỤ: Dựa trên Tên sản phẩm, Hãng sản xuất, Lĩnh vực kỹ thuật và danh sách thực tế các tùy chọn hệ thống được cung cấp:
1. "suggestedSku": Đề xuất mã sản phẩm / Model / SKU chuẩn kỹ thuật quốc tế ngắn gọn, viết hoa, phân cách bằng dấu gạch ngang (VD: 'ETABS-V23', 'KOMPAS-3D-V23', 'VISSIM-2025', 'GEO-STUDIO-2024'). Không chứa ký tự đặc biệt rác.
2. "selectedTypeId": Phân tích sản phẩm để chọn ra đúng 1 "id" từ danh sách "availableTypes" phù hợp nhất với bản chất của sản phẩm (ví dụ phần mềm, bản quyền, thiết bị, dịch vụ đào tạo...). Nếu không tìm thấy loại nào phù hợp, trả về chuỗi rỗng "".
3. "selectedApplicationIds": Chọn từ 1 đến 3 "id" từ danh sách "availableApplications" có tính ứng dụng kỹ thuật phù hợp nhất với sản phẩm. Nếu không có ứng dụng nào phù hợp, trả về mảng rỗng [].
4. "selectedRelatedProductIds": Chọn từ 1 đến 3 "id" từ danh sách "candidateProducts" có mức độ liên quan kỹ thuật hoặc thương mại cao nhất (ưu tiên cùng hãng sản xuất, cùng quy trình thiết kế, hoặc các giải pháp bổ trợ nhau). Nếu không có sản phẩm nào phù hợp, trả về mảng rỗng [].

QUY TẮC BẮT BUỘC:
- Phân tích linh hoạt theo bản chất kỹ thuật của sản phẩm, không suy diễn cố định.
- CHỈ ĐƯỢC CHỌN ID CÓ TRONG DANH SÁCH ĐƯỢC CUNG CẤP, TUYỆT ĐỐI KHÔNG TỰ BỊA RA ID MỚI.
- Định dạng JSON trả về:
{
  "suggestedSku": "...",
  "selectedTypeId": "...",
  "selectedApplicationIds": ["id1", "id2"],
  "selectedRelatedProductIds": ["idA", "idB"]
}`;

  const userPrompt = JSON.stringify({
    productName: name,
    brandName: input.brandName || '',
    categoryNames: input.categoryNames || [],
    sampleContent: (input.content || '').replace(/<[^>]*>?/gm, '').substring(0, 1000),
    availableTypes: input.availableTypes.slice(0, 30),
    availableApplications: input.availableApplications.slice(0, 60),
    candidateProducts: input.candidateProducts.slice(0, 40),
  });

  try {
    const result = await llm.generateStructured<ClassifyProductTaxonomyOutput>({
      systemPrompt,
      userPrompt,
      temperature: 0.1,
    });

    const validTypeId = input.availableTypes.some((t) => t.id === result.selectedTypeId)
      ? result.selectedTypeId
      : '';
    const validAppIds = (result.selectedApplicationIds || []).filter((id) =>
      input.availableApplications.some((a) => a.id === id)
    );
    const validRelatedIds = (result.selectedRelatedProductIds || []).filter((id) =>
      input.candidateProducts.some((p) => p.id === id)
    );

    return {
      suggestedSku:
        result.suggestedSku ||
        name
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 20),
      selectedTypeId: validTypeId,
      selectedApplicationIds: validAppIds,
      selectedRelatedProductIds: validRelatedIds,
    };
  } catch (error) {
    // Dynamic token-similarity fallback without hardcoded keywords
    const cleanTokens = name
      .toLowerCase()
      .split(/[\s\-_/.]+/)
      .filter((t) => t.length > 2);
    const matchedType =
      input.availableTypes.find((t) =>
        cleanTokens.some((tok) => t.name.toLowerCase().includes(tok))
      ) || input.availableTypes[0];
    const matchedApps = input.availableApplications
      .filter((a) => cleanTokens.some((tok) => a.name.toLowerCase().includes(tok)))
      .slice(0, 3);
    const related = input.candidateProducts
      .filter(
        (p) =>
          (input.brandName && p.brandName === input.brandName) ||
          (input.categoryNames && input.categoryNames.includes(p.categoryName || ''))
      )
      .slice(0, 3);

    return {
      suggestedSku: name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 20),
      selectedTypeId: matchedType?.id || '',
      selectedApplicationIds: matchedApps.map((a) => a.id),
      selectedRelatedProductIds: related.map((p) => p.id),
    };
  }
}

