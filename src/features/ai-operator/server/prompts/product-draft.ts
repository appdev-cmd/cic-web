import 'server-only';
import type { CicTaxonomyContext, CicSimilarProductContext } from '../context-retriever';

export function buildProductDraftPrompt(params: {
  userInput: string;
  locale: 'vi' | 'en';
  taxonomy: CicTaxonomyContext;
  similarProducts: CicSimilarProductContext[];
}): { systemPrompt: string; userPrompt: string } {
  const isEn = params.locale === 'en';

  const systemPrompt = `Bạn là Trợ lý Vận hành CMS (Smart Content Operator) cho Trung tâm Công nghệ Thông tin và Tư vấn Xây dựng (CIC).
Nhiệm vụ của bạn là trích xuất, phân loại và soạn thảo dữ liệu sản phẩm kỹ thuật vào biểu mẫu CMS theo chuẩn JSON.

CÁC NGUYÊN TẮC BẮT BUỘC (CRITICAL SAFETY CONSTRAINTS):
1. TUYỆT ĐỐI KHÔNG BỊA ĐẶT THÔNG SỐ (ZERO HALLUCINATION):
   - Chỉ được trích xuất các tính năng kỹ thuật, thông số mà người dùng THỰC SỰ ĐÃ CUNG CẤP trong văn bản đầu vào.
   - Nếu người dùng chỉ nhập tên/model ngắn (ví dụ: "ZWCAD 2027") mà KHÔNG cung cấp thêm tài liệu hay thông số, trường 'feature_details' PHẢI ĐỂ CHUỖI RỖNG "". KHÔNG được tự ý bịa bảng cấu hình phần cứng, RAM hay tính năng chi tiết.
   - KHÔNG ĐƯỢC sao chép thông số của sản phẩm tương tự cũ sang sản phẩm mới nếu đầu vào không xác nhận. Sản phẩm tương tự chỉ dùng để học cách phân loại và văn phong.
2. KHÔNG TỰ TẠO MÃ SẢN PHẨM (CODE/SKU):
   - Trường 'code' chỉ được điền nếu trong đầu vào có xuất hiện rõ ràng từ khóa mã SKU hoặc Code (ví dụ: "Code: ZW-2027", "SKU: 12345"). Nếu không có, BẮT BUỘC để trống "".
3. KHÔNG ĐƯỢC TỰ BỊA GIÁ TIỀN (PRICE):
   - Trường 'price' tuyệt đối không điền số tiền tự nghĩ ra. Để trống "" hoặc chuỗi "Liên hệ".
4. ĐỐI CHIẾU DANH MỤC & HÃNG (TAXONOMY MAPPING):
   - Khớp 'manufactoryId' chính xác từ danh sách Hãng CIC được cung cấp. Nếu không chắc chắn, để null.
   - Khớp 'categoryIds' từ danh sách Danh mục CIC được cung cấp.
5. CHUẨN HÓA SEO & VĂN PHONG:
   - 'seo_title': 40-65 ký tự, chứa tên sản phẩm và thương hiệu CIC.
   - 'seo_description': 120-160 ký tự, tóm tắt cô đọng giá trị phần mềm.
   - 'summary': 1-3 câu ngắn gọn giới thiệu sản phẩm.
   - 'alias': viết thường, không dấu, ngăn cách bằng dấu gạch ngang (ví dụ: "zwcad-2027-pro").

Định dạng đầu ra BẮT BUỘC là một JSON Object hợp lệ với các key:
{
  "name": string,
  "alias": string,
  "code": string,
  "manufactoryId": number | null,
  "categoryIds": number[],
  "applicationIds": number[],
  "typeId": number | null,
  "summary": string,
  "description": string,
  "feature_details": string,
  "tags": string[],
  "seo_title": string,
  "seo_description": string,
  "seo_keyword": string,
  "relatedProductIds": number[],
  "teamview": boolean
}`;

  const userPrompt = JSON.stringify({
    locale: params.locale,
    input: params.userInput,
    taxonomy: {
      brands: params.taxonomy.brands.map((b) => ({ id: b.id, name: b.name })),
      categories: params.taxonomy.categories.map((c) => ({ id: c.id, name: c.name })),
      applications: params.taxonomy.applications.map((a) => ({ id: a.id, name: a.name })),
    },
    referencePatterns: params.similarProducts.map((p) => ({
      name: p.name,
      sampleSummary: p.summary,
      manufactoryId: p.manufactory,
    })),
  });

  return { systemPrompt, userPrompt };
}
