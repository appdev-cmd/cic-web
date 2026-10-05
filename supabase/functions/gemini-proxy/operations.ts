/**
 * Supabase Edge Function: AI Gateway Operations Registry for CIC CMS
 * Defines supported AI operations, guardrails, models, and prompts.
 */

export interface ProductPrefillInput {
  name: string;
  brand?: string;
  categories?: string[];
  currentSummary?: string;
  existingTags?: string[];
}

export interface FieldEnrichInput {
  fieldType: 'summary' | 'outline' | 'tags' | 'seo' | 'related_products';
  moduleType?: 'product' | 'news' | 'service' | 'event';
  title?: string;
  content?: string;
  context?: string;
  currentValue?: string;
  availableOptions?: Array<{ id: string | number; name: string }>;
}

export interface RawGenerateInput {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GatewayOperationConfig {
  model: string;
  fallbackModel: string;
  temperature: number;
  maxOutputTokens: number;
  systemInstruction: string;
  buildPrompt: (input: any) => string;
}

const CIC_ENTERPRISE_SYSTEM_INSTRUCTION = `Bạn là Trợ lý AI Chuyên gia (AI Co-pilot) của Công ty Cổ phần Công nghệ và Tư vấn CIC (thành lập từ năm 1990).
Lĩnh vực cốt lõi của CIC:
1. Bản quyền phần mềm kỹ thuật hàng đầu: Autodesk (Revit, AutoCAD), Bentley, CSI (SAP2000, ETABS, SAFE), Cubicost (Glodon), Ansys, enjiCAD...
2. Tư vấn giải pháp chuyển đổi số & BIM, Digital Twins, CDE cho ngành Xây dựng, Giao thông, Hạ tầng.
3. Thiết bị khoa học kỹ thuật cao: Thí nghiệm cọc, quan trắc địa kỹ thuật, đo đạc rada, thiết bị kiểm tra không phá hủy.
4. Phát triển bền vững: Kiểm kê khí nhà kính (GHG), tư vấn Net Zero, EPD, ESG.

Yêu cầu ngôn ngữ & văn phong:
- Tiếng Việt chuẩn mực, thuật ngữ kỹ thuật chính xác, hành văn xúc tích, chuẩn văn phong doanh nghiệp B2B.
- Trả về kết quả dưới định dạng JSON hợp lệ, KHÔNG bọc trong markdown codeblock nếu không yêu cầu.`;

export const OPERATIONS: Record<string, GatewayOperationConfig> = {
  'product.prefill': {
    model: 'gemini-2.5-flash',
    fallbackModel: 'gemini-flash-lite-latest',
    temperature: 0.2,
    maxOutputTokens: 2048,
    systemInstruction: `${CIC_ENTERPRISE_SYSTEM_INSTRUCTION}\nNhiệm vụ: Dựa vào Tên sản phẩm, Hãng sản xuất và Lĩnh vực chính, hãy điền đầy đủ các thông tin chuyên môn gồm tóm tắt giải pháp, đặc tính nổi bật, tags chuyên ngành và bộ 3 thẻ SEO Google tối ưu.`,
    buildPrompt: (input: ProductPrefillInput) => `Hãy tạo gợi ý thông tin đầy đủ cho sản phẩm công nghệ sau:
- Tên sản phẩm: ${input.name}
- Hãng sản xuất: ${input.brand || 'Chưa chọn'}
- Lĩnh vực: ${(input.categories || []).join(', ') || 'Chưa chọn'}

Trả về DUY NHẤT một JSON object với các trường sau:
{
  "summary": "Đoạn mô tả tóm tắt giải pháp từ 2-4 câu, nêu bật giá trị và lợi ích cho kỹ sư/doanh nghiệp",
  "feature_details": "Danh sách 3-5 gạch đầu dòng tính năng công nghệ nổi bật nhất của sản phẩm",
  "tags": ["3-6 tags ngắn gọn, viết hoa chữ cái đầu, ví dụ: BIM, Kết Cấu, Phần Mềm Bản Quyền"],
  "seo_title": "Tiêu đề SEO chuẩn Google dưới 65 ký tự, chứa tên sản phẩm và thương hiệu CIC",
  "seo_description": "Mô tả SEO chuẩn Google từ 130-160 ký tự, hấp dẫn, chứa từ khóa chính",
  "seo_keyword": "4-6 từ khóa tìm kiếm phân tách bởi dấu phẩy"
}`,
  },

  'field.enrich': {
    model: 'gemini-2.5-flash',
    fallbackModel: 'gemini-flash-lite-latest',
    temperature: 0.25,
    maxOutputTokens: 1024,
    systemInstruction: CIC_ENTERPRISE_SYSTEM_INSTRUCTION,
    buildPrompt: (input: FieldEnrichInput) => {
      const type = input.fieldType;
      const title = input.title || input.context || '';
      const content = input.content || input.currentValue || '';

      switch (type) {
        case 'summary':
          return `Hãy tóm tắt xúc tích nội dung sau thành đoạn văn 2-3 câu mạch lạc, nêu bật ý cốt lõi:\nTiêu đề: ${title}\nNội dung: ${content}\n\nTrả về JSON: { "summary": "..." }`;
        case 'seo':
          return `Hãy tạo bộ thẻ SEO tối ưu cho công cụ tìm kiếm Google:\nTiêu đề: ${title}\nNội dung: ${content}\n\nTrả về JSON: {\n  "seo_title": "Dưới 65 ký tự",\n  "seo_description": "130-160 ký tự",\n  "seo_keyword": "4-6 từ khóa phân tách dấu phẩy"\n}`;
        case 'tags':
          return `Hãy trích xuất 4-8 thẻ tag chuyên ngành ngắn gọn cho nội dung sau:\nTiêu đề: ${title}\nNội dung: ${content}\n\nTrả về JSON: { "tags": ["Tag 1", "Tag 2", ...] }`;
        case 'outline':
          return `Hãy lập dàn ý bài viết kỹ thuật/chuyên đề chuẩn mực:\nChủ đề: ${title}\n\nTrả về JSON: { "outline": "1. Đặt vấn đề...\\n2. Giải pháp...\\n3. Hiệu quả..." }`;
        default:
          return `Xử lý nội dung: ${title}\n\nTrả về JSON: { "result": "..." }`;
      }
    },
  },

  'raw.generate': {
    model: 'gemini-2.5-flash',
    fallbackModel: 'gemini-flash-lite-latest',
    temperature: 0.2,
    maxOutputTokens: 2048,
    systemInstruction: CIC_ENTERPRISE_SYSTEM_INSTRUCTION,
    buildPrompt: (input: RawGenerateInput) => input.userPrompt,
  },
};
