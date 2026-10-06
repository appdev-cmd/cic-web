import 'server-only';
import { getLlmProvider } from '@/features/ai-operator/server/llm-provider';

export type AiTriageCategory = 'enterprise' | 'qualified' | 'irrelevant';

export interface CustomerRequestTriageInput {
  fullname?: string | null;
  email?: string | null;
  telephone?: string | null;
  company?: string | null;
  subject?: string | null;
  message?: string | null;
  formName?: string | null;
  values?: Record<string, unknown>;
}

export interface AiTriageResult {
  category: AiTriageCategory;
  confidence: number; // 0 - 100
  priority: 'urgent' | 'high' | 'medium' | 'low';
  suggestedStatus: 'new' | 'not_suitable';
  tags: string[];
  summary: string;
  reason: string;
  identifiedProducts: string[];
  suggestedAction: string;
}

const AI_TRIAGE_SYSTEM_PROMPT = `Bạn là Chuyên gia Đánh giá và Phân loại Khách hàng tiềm năng (Lead Triage AI Specialist) của Công ty Cổ phần Công nghệ và Tư vấn CIC (CIC Technology & Consultancy - website: https://www.cic.com.vn).

1. THÔNG TIN DOANH NGHIỆP CIC:
- Lĩnh vực: Cung cấp, phân phối và phát triển phần mềm chuyên ngành kỹ thuật xây dựng, kiến trúc, kết cấu, địa kỹ thuật, giao thông, BIM, CAD/CAM, chuyển đổi số và giải pháp công nghệ cao.
- Sản phẩm tiêu biểu: CSI (SAP2000, ETABS, SAFE, CSiBridge, PERFORM-3D); Plaxis, GEO5; Kompas-3D; Enscape; Autodesk; thiết bị thí nghiệm, tư vấn BIM, đào tạo kỹ thuật.

2. CẢNH BÁO ĐẶC BIỆT VỀ SỰ NHẦM LẪN THƯƠNG HIỆU:
- Tại Việt Nam, nhiều người nhầm lẫn tên "CIC" của công ty với "Trung tâm Thông tin Tín dụng Quốc gia Việt Nam (CIC ngân hàng / tra cứu nợ xấu / vay vốn)".
- Bất kỳ yêu cầu nào đề cập đến: vay tiền, tra cứu nợ xấu, điểm tín dụng, ngân hàng, mở thẻ tín dụng, bùng nợ, xóa nợ xấu, vay trả góp, CCCD giải ngân, lãi suất... ĐỀU LÀ NHẦM LẪN 100% VÀ KHÔNG LIÊN QUAN ĐẾN HOẠT ĐỘNG KINH DOANH CỦA CÔNG TY CIC!

3. QUY TẮC PHÂN LOẠI CHÍNH XÁC VÀO 3 NHÓM:
- "enterprise" (⭐ Doanh nghiệp lớn / Nhu cầu cao / Ưu tiên cao):
  * Người gửi: Tập đoàn, Tổng công ty, Viện nghiên cứu/thiết kế, Ban Quản lý dự án, Trường Đại học, Sở ban ngành, doanh nghiệp xây dựng/tư vấn quy mô lớn.
  * Nhu cầu: Mua nhiều bản quyền (multi-seat / network license), đào tạo chuyển giao công nghệ cho toàn bộ phòng ban, hợp đồng khung doanh nghiệp, phục vụ các dự án trọng điểm (cao tốc, sân bay, cảng biển, cầu đường, nhà cao tầng...).
  * Output:
    - category: "enterprise"
    - priority: "urgent" (hoặc "high")
    - suggestedStatus: "new"
    - tags: ["ai:enterprise", "vip"]
    - suggestedAction: "Ưu tiên phân bổ ngay cho Trưởng phòng/Sales chính gọi điện xác nhận quy mô"

- "qualified" (💼 Khách hàng tiềm năng chuẩn):
  * Kỹ sư cá nhân, sinh viên ngành xây dựng/kết cấu, công ty vừa và nhỏ hỏi mua 1-2 license phần mềm đúng chuyên ngành của CIC.
  * Đăng ký khóa học, hội thảo kỹ thuật, xin dùng thử (trial), tư vấn kỹ thuật hợp lệ.
  * Output:
    - category: "qualified"
    - priority: "medium"
    - suggestedStatus: "new"
    - tags: ["ai:qualified"]
    - suggestedAction: "Phân bổ nhân viên kinh doanh liên hệ tư vấn và gửi báo giá"

- "irrelevant" (🚫 Không liên quan / Rác / Nhầm vay tiền tín dụng):
  * Nhầm lẫn thương hiệu: Hỏi vay tiền, xóa nợ xấu ngân hàng, kiểm tra điểm tín dụng.
  * Nội dung rác: Chuỗi ký tự bàn phím vô nghĩa (asdfgh, 123456, aaaaa), test bừa bãi.
  * Spam ngoài ngành: Chào bán bất động sản, tiền ảo, casino, dịch vụ SEO, link độc hại.
  * Lời lẽ khiếm nhã, chửi bới, quấy rối.
  * Output:
    - category: "irrelevant"
    - priority: "low"
    - suggestedStatus: "not_suitable"
    - tags: ["ai:irrelevant"] (kèm tag cụ thể nếu rõ như "nham_tin_dung" hoặc "spam")
    - suggestedAction: "Lưu trữ hoặc bỏ qua, không làm phiền nhân viên kinh doanh"

4. ĐỊNH DẠNG TRẢ VỀ:
BẮT BUỘC chỉ trả về JSON hợp lệ với cấu trúc sau, không kèm bất kỳ giải thích nào bên ngoài:
{
  "category": "enterprise" | "qualified" | "irrelevant",
  "confidence": number, // 0 - 100
  "priority": "urgent" | "high" | "medium" | "low",
  "suggestedStatus": "new" | "not_suitable",
  "tags": ["tag1", "tag2"],
  "summary": "Tóm tắt 1-2 câu tiếng Việt súc tích về người gửi và nhu cầu",
  "reason": "Giải thích ngắn gọn 1 câu lý do phân loại vào nhóm này",
  "identifiedProducts": ["Tên phần mềm hoặc giải pháp nếu có, hoặc []"],
  "suggestedAction": "Gợi ý hành động tiếp theo cho đội ngũ kinh doanh"
}`;

/**
 * Fast heuristic pre-check to catch obvious credit/loan confusion or gibberish
 * even before hitting LLM or in case LLM is unreachable.
 */
function heuristicCheck(text: string): Partial<AiTriageResult> | null {
  const lower = text.toLowerCase();
  const creditKeywords = [
    'nợ xấu',
    'vay tiền',
    'vay vốn',
    'điểm tín dụng',
    'bùng nợ',
    'xoá nợ',
    'xóa nợ',
    'tra cứu cic',
    'kiểm tra cic',
    'mở thẻ tín dụng',
    'vay ngân hàng',
    'giải ngân',
    'lãi suất vay',
    'vay tiêu dùng',
    'vay fe',
    'vay online',
    'vay nhanh',
  ];

  for (const kw of creditKeywords) {
    if (lower.includes(kw)) {
      return {
        category: 'irrelevant',
        confidence: 96,
        priority: 'low',
        suggestedStatus: 'not_suitable',
        tags: ['ai:irrelevant', 'nham_tin_dung'],
        summary: 'Người gửi nhầm lẫn với Trung tâm Thông tin Tín dụng Quốc gia (CIC Ngân hàng), yêu cầu liên quan đến nợ xấu/vay vốn.',
        reason: `Phát hiện từ khóa tín dụng/vay vốn ngân hàng: "${kw}".`,
        identifiedProducts: [],
        suggestedAction: 'Bỏ qua hoặc gửi email phản hồi từ chối tự động thông báo nhầm thương hiệu.',
      };
    }
  }

  // Detect gibberish keyboard smash
  if (/^[a-z0-9\s]{1,15}$/i.test(text.trim()) && /([a-z0-9])\1{4,}/i.test(text.trim())) {
    return {
      category: 'irrelevant',
      confidence: 90,
      priority: 'low',
      suggestedStatus: 'not_suitable',
      tags: ['ai:irrelevant', 'spam'],
      summary: 'Nội dung điền rác hoặc ký tự bàn phím lặp lại vô nghĩa.',
      reason: 'Chuỗi ký tự lặp lại vô nghĩa.',
      identifiedProducts: [],
      suggestedAction: 'Xóa hoặc chuyển vào mục Không phù hợp.',
    };
  }

  return null;
}

export async function analyzeCustomerRequestWithAi(
  input: CustomerRequestTriageInput
): Promise<AiTriageResult> {
  const combinedText = [
    input.fullname ? `Họ và tên: ${input.fullname}` : '',
    input.company ? `Đơn vị / Công ty: ${input.company}` : '',
    input.email ? `Email: ${input.email}` : '',
    input.telephone ? `Số điện thoại: ${input.telephone}` : '',
    input.formName ? `Tên biểu mẫu: ${input.formName}` : '',
    input.subject ? `Tiêu đề: ${input.subject}` : '',
    input.message ? `Lời nhắn / Yêu cầu: ${input.message}` : '',
    input.values ? `Dữ liệu form chi tiết: ${JSON.stringify(input.values)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  // 1. Fast heuristic pre-check
  const heuristic = heuristicCheck(combinedText);
  if (heuristic && heuristic.category === 'irrelevant') {
    return {
      category: 'irrelevant',
      confidence: heuristic.confidence ?? 95,
      priority: heuristic.priority ?? 'low',
      suggestedStatus: heuristic.suggestedStatus ?? 'not_suitable',
      tags: heuristic.tags ?? ['ai:irrelevant', 'nham_tin_dung'],
      summary: heuristic.summary ?? 'Nội dung không liên quan đến kinh doanh phần mềm CIC.',
      reason: heuristic.reason ?? 'Nhầm lẫn CIC tín dụng hoặc nội dung rác.',
      identifiedProducts: heuristic.identifiedProducts ?? [],
      suggestedAction: heuristic.suggestedAction ?? 'Bỏ qua / Lưu trữ.',
    };
  }

  // 2. Invoke Gemini LLM via configured provider
  try {
    const provider = getLlmProvider();
    const userPrompt = `Hãy thẩm định và phân loại yêu cầu khách hàng sau đây:\n\n${combinedText}`;

    const rawResult = await provider.generateStructured<Record<string, unknown>>({
      systemPrompt: AI_TRIAGE_SYSTEM_PROMPT,
      userPrompt,
      temperature: 0.1,
    });

    // Validate and sanitize LLM response
    const rawCategory = String(rawResult?.category || '').toLowerCase();
    const category: AiTriageCategory =
      rawCategory === 'enterprise' ? 'enterprise' : rawCategory === 'irrelevant' ? 'irrelevant' : 'qualified';

    const rawPriority = String(rawResult?.priority || '').toLowerCase();
    const priority = (['urgent', 'high', 'medium', 'low'].includes(rawPriority)
      ? rawPriority
      : category === 'enterprise'
      ? 'urgent'
      : category === 'irrelevant'
      ? 'low'
      : 'medium') as 'urgent' | 'high' | 'medium' | 'low';

    const suggestedStatus = (rawResult?.suggestedStatus === 'not_suitable' || category === 'irrelevant'
      ? 'not_suitable'
      : 'new') as 'new' | 'not_suitable';

    const rawTags = Array.isArray(rawResult?.tags)
      ? (rawResult.tags as unknown[]).map((t) => String(t).trim()).filter(Boolean)
      : [];
    const baseTag = category === 'enterprise' ? 'ai:enterprise' : category === 'irrelevant' ? 'ai:irrelevant' : 'ai:qualified';
    const tags = Array.from(new Set([baseTag, ...rawTags]));

    const summary = typeof rawResult?.summary === 'string' && rawResult.summary.trim()
      ? rawResult.summary.trim()
      : `Yêu cầu từ ${input.fullname || 'khách hàng'}: ${input.subject || input.message || 'Không có mô tả'}`;

    const reason = typeof rawResult?.reason === 'string' && rawResult.reason.trim()
      ? rawResult.reason.trim()
      : `Phân loại ${category} dựa trên nội dung yêu cầu.`;

    const identifiedProducts = Array.isArray(rawResult?.identifiedProducts)
      ? (rawResult.identifiedProducts as unknown[]).map((p) => String(p).trim()).filter(Boolean)
      : [];

    const suggestedAction = typeof rawResult?.suggestedAction === 'string' && rawResult.suggestedAction.trim()
      ? rawResult.suggestedAction.trim()
      : category === 'enterprise'
      ? 'Ưu tiên liên hệ sớm xác nhận yêu cầu dự án lớn.'
      : category === 'irrelevant'
      ? 'Chuyển vào mục Không phù hợp / Bỏ qua.'
      : 'Liên hệ tư vấn và gửi báo giá.';

    const confidence = typeof rawResult?.confidence === 'number' && Number.isFinite(rawResult.confidence)
      ? Math.min(100, Math.max(0, Math.round(rawResult.confidence)))
      : 85;

    return {
      category,
      confidence,
      priority,
      suggestedStatus,
      tags,
      summary,
      reason,
      identifiedProducts,
      suggestedAction,
    };
  } catch (error) {
    console.error('[analyzeCustomerRequestWithAi] LLM invocation failed, using graceful fallback:', error);

    // Safe fallback based on keyword heuristics
    const lower = combinedText.toLowerCase();
    const isBig =
      lower.includes('tập đoàn') ||
      lower.includes('tổng công ty') ||
      lower.includes('viện') ||
      lower.includes('dự án') ||
      lower.includes('cao tốc') ||
      lower.includes('license mạng') ||
      lower.includes('network');

    if (isBig) {
      return {
        category: 'enterprise',
        confidence: 75,
        priority: 'high',
        suggestedStatus: 'new',
        tags: ['ai:enterprise', 'vip'],
        summary: `Yêu cầu từ đơn vị quy mô lớn: ${input.company || input.fullname || 'Khách hàng'}.`,
        reason: 'Phát hiện từ khóa doanh nghiệp lớn / dự án quy mô.',
        identifiedProducts: [],
        suggestedAction: 'Ưu tiên liên hệ kiểm tra nhu cầu phần mềm.',
      };
    }

    return {
      category: 'qualified',
      confidence: 70,
      priority: 'medium',
      suggestedStatus: 'new',
      tags: ['ai:qualified'],
      summary: `Yêu cầu liên hệ từ ${input.fullname || 'khách hàng'}.`,
      reason: 'Tiếp nhận thông thường.',
      identifiedProducts: [],
      suggestedAction: 'Phân công nhân viên liên hệ tư vấn.',
    };
  }
}
