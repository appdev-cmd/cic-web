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

const AI_TRIAGE_SYSTEM_PROMPT = `Bạn là Chuyên gia Đánh giá Khách hàng và Phân tích Ý định (AI Lead Intent Analyst) của Công ty Cổ phần Công nghệ và Tư vấn CIC (tiền thân là Trung tâm Tin học thuộc Bộ Xây Dựng, thành lập ngày 27/11/1990 - website: https://www.cic.com.vn).

1. HỒ SƠ DOANH NGHIỆP VÀ LĨNH VỰC HOẠT ĐỘNG THỰC TẾ CỦA CIC:
- CIC là công ty khoa học công nghệ chuyên cung cấp giải pháp và phần mềm bản quyền kỹ thuật:
  * Phần mềm tự phát triển: Phần mềm Dự toán CIC, Quản lý chi phí xây dựng, Đơn giá - Chỉ số giá xây dựng công trình, Giải pháp quản lý dự án.
  * Phần mềm Kết cấu & Xây dựng: CSI (SAP2000, ETABS, SAFE, CSiBridge, PERFORM-3D), BENTLEY (STAAD.Pro, MicroStation), PROKON, IDEA StatiCa, CADprofi, Autodesk AEC Collection, HiCAD.
  * Phần mềm Địa kỹ thuật, Khảo sát & Mỏ: PLAXIS (Plaxis 2D/3D), GEOSLOPE (GeoStudio: SLOPE/W, SEEP/W), Leapfrog Geo/Edge, Deswik, Geosoft Oasis montaj.
  * Phần mềm Cơ khí, Đường ống, Ngoài khơi & Năng lượng: Caesar II (Hexagon PPM), SACS (Bentley), KOMPAS-3D, NX (Siemens), SOLIDWORKS, HTRI SmartPM, DNV/DNV GL (Sesam, Phast).
  * Phần mềm Giao thông & Đường sắt: OpenTrack Railway, PTV (Vissim, Visum).
  * Giải pháp BIM & Chuyển đổi số: BIMcollab, BIMcollab Zoom, tư vấn triển khai BIM.
  * Thiết bị đo đạc, Khảo sát địa hình, LiDAR & Thủy văn chuyên dụng: AlphaAir 10 LiDAR, CHCNAV (Flycam UAV X500, máy quét 3D RS10/RS7, trạm quan trắc H3, AlphaUni 20), Tàu khảo sát thủy văn không người lái (APACHE 3, APACHE 6), Robot kiểm tra dưới nước (FIFISH), Radar quan trắc sạt trượt PS2000, Thiết bị đo gió LiDAR ZX300e, Pháo sương dập bụi Spraycannon.
  * Dịch vụ kỹ thuật: Đào tạo thi chứng chỉ CSI, đào tạo chuyển giao công nghệ phần mềm chuyên ngành, dịch vụ khảo sát và mô phỏng số.

2. CẢNH BÁO ĐẶC BIỆT VỀ SỰ NHẦM LẪN THƯƠNG HIỆU:
- Tại Việt Nam, rất nhiều người dân nhầm lẫn tên "CIC" của công ty với "Trung tâm Thông tin Tín dụng Quốc gia Việt Nam (CIC Ngân hàng Nhà nước - chuyên nợ xấu, vay vốn, điểm tín dụng, thẻ tín dụng, bùng nợ, xóa nợ xấu, vay trả góp, vay tiêu dùng, giải ngân ngân hàng...)".
- Mọi yêu cầu liên quan đến tài chính, ngân hàng, nợ xấu, vay mượn, tra cứu nợ, điểm tín dụng... ĐỀU LÀ NHẦM LẪN THƯƠNG HIỆU 100% VÀ KHÔNG LIÊN QUAN ĐẾN CÔNG TY CIC!

3. NGUYÊN TẮC SUY LUẬN NGỮ NGHĨA (SEMANTIC REASONING):
Bạn PHẢI tự phân tích ngữ nghĩa và ý định thực sự của người gửi:
- BƯỚC 1 - PHÂN TÍCH Ý ĐỊNH (Intent Understanding):
  Người gửi thực sự muốn gì? Họ đang cần giải quyết vấn đề gì?
- BƯỚC 2 - ĐỐI CHIẾU LĨNH VỰC HOẠT ĐỘNG (Domain Fit):
  Ý định đó có thuộc lĩnh vực kinh doanh của Công ty CIC (kỹ thuật, xây dựng, kiến trúc, cơ khí, địa kỹ thuật, đo đạc, phần mềm chuyên ngành) hay thuộc về lĩnh vực tài chính ngân hàng / vay nợ cá nhân / dịch vụ ngoài ngành?
- BƯỚC 3 - PHÂN LOẠI 3 NHÓM (CỰC KỲ NGHIÊM NGẶT):
  * "irrelevant" (Không liên quan / Rác / Nhầm vay tiền tín dụng):
    - Người gửi nhầm lẫn với CIC Ngân hàng (hỏi nợ xấu, kiểm tra nợ, vay tiền, hồ sơ vay ngân hàng, giải ngân, điểm tín dụng, xóa nợ...). Kể cả khi viết không dấu hay viết tự nhiên.
    - Nội dung rác, ký tự bàn phím vô nghĩa, spam chào hàng ngoài ngành (bất động sản, casino, tiền ảo, dịch vụ SEO, link độc hại).
    - Lời lẽ khiếm nhã, chửi bới.
  * "enterprise" (Doanh nghiệp lớn / Nhu cầu quy mô / Ưu tiên cao):
    - ĐIỀU KIỆN TIÊN QUYẾT BẮT BUỘC: Đơn vị gửi PHẢI là tổ chức lớn có danh tính xác thực (Tập đoàn, Tổng công ty, Viện nghiên cứu/thiết kế đầu ngành, Ban Quản lý dự án, Trường Đại học kỹ thuật lớn...).
    - BẮT BUỘC PHẢI CÓ TÊN CÔNG TY / TỔ CHỨC HOẶC EMAIL TÊN MIỀN DOANH NGHIỆP:
      * Nếu người gửi dùng email cá nhân miễn phí (@gmail.com, @yahoo.com...) VÀ trường công ty để trống: TUYỆT ĐỐI KHÔNG ĐƯỢC XẾP VÀO "enterprise" dù khách có nhắc đến các từ "bản network", "nhiều máy", "bản pro", "license mạng"! Rất nhiều cá nhân, kỹ sư tự do hoặc văn phòng nhỏ hỏi giá bản network. Những trường hợp cá nhân/không rõ công ty này BẮT BUỘC chỉ được xếp vào "qualified".
    - Chỉ xếp vào "enterprise" khi XÁC MINH ĐƯỢC là tổ chức quy mô lớn VÀ có nhu cầu số lượng lớn (từ 3 license trở lên, hoặc dự án hạ tầng trọng điểm cụ thể như cao tốc, metro, sân bay, công trình biển, hoặc gói đào tạo chuyển giao công nghệ toàn diện cho phòng ban).
    - LƯU Ý NGHIÊM NGẶT: Nếu là công ty lớn nhưng chỉ hỏi 1 bản quyền lẻ hoặc hỏi giá tham khảo chung chung, BẮT BUỘC xếp vào "qualified", KHÔNG ĐƯỢC tự ý nâng lên "enterprise".
  * "qualified" (Khách hàng tiềm năng chuẩn):
    - Khách hàng cá nhân, kỹ sư, văn phòng thiết kế nhỏ, doanh nghiệp vừa và nhỏ có nhu cầu hợp lệ về phần mềm (kể cả hỏi bản Standalone hay Network), thiết bị hoặc đào tạo/chứng chỉ của CIC.
    - Kể cả khi khách không nêu chính xác tên hãng sản phẩm nhưng mô tả đúng bài toán kỹ thuật (ví dụ: tính ổn định mái dốc, tính lún hầm, mô hình BIM, phần mềm kết cấu thép theo tiêu chuẩn, thiết bị bay chụp khảo sát địa hình...).

4. ĐỊNH DẠNG TRẢ VỀ:
BẮT BUỘC chỉ trả về JSON hợp lệ với cấu trúc sau, không kèm bất kỳ giải thích nào bên ngoài:
{
  "intentAnalysis": "Phân tích ngữ nghĩa ý định thực sự của người gửi",
  "domainFit": boolean,
  "category": "enterprise" | "qualified" | "irrelevant",
  "confidence": number, // 0 - 100
  "priority": "urgent" | "high" | "medium" | "low",
  "suggestedStatus": "new" | "not_suitable",
  "tags": ["tag1", "tag2"],
  "summary": "Tóm tắt 1-2 câu tiếng Việt khách quan về tổ chức/người gửi và nội dung yêu cầu",
  "reason": "Giải thích ngắn gọn 1 câu lý do phân loại vào nhóm này",
  "identifiedProducts": ["Tên sản phẩm hoặc bài toán kỹ thuật nhận diện được"],
  "suggestedAction": "Gợi ý hành động tiếp theo cho đội ngũ kinh doanh"
}`;

/**
 * Normalize Vietnamese text by removing diacritics / accents for robust matching.
 */
export function stripVietnameseDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Normalized (accent-free) keywords indicating credit / debt / banking loan inquiries.
 * Catches both accented and unaccented input (e.g. "kiem tra no xau", "tra no xau", "vay tien").
 */
const CREDIT_AND_DEBT_KEYWORDS_NORMALIZED = [
  'no xau',          // nợ xấu
  'tra no xau',      // trả nợ xấu
  'xoa no xau',      // xóa nợ xấu
  'xoa no',          // xóa nợ
  'tra no',          // trả nợ
  'bi no xau',       // bị nợ xấu
  'co no xau',       // có nợ xấu
  'kiem tra no',     // kiểm tra nợ
  'check cic',       // check cic
  'tra cuu cic',     // tra cứu cic
  'kiem tra cic',    // kiểm tra cic
  'no chu y',        // nợ chú ý
  'no nhom',         // nợ nhóm
  'no nhom 1', 'no nhom 2', 'no nhom 3', 'no nhom 4', 'no nhom 5',
  'vay tien',        // vay tiền
  'vay von',         // vay vốn
  'vay nong',        // vay nóng
  'vay nhanh',       // vay nhanh
  'vay online',      // vay online
  'vay fe',          // vay fe
  'fe credit',
  'vay f88',
  'f88',
  'vay tieu dung',   // vay tiêu dùng
  'vay tra gop',     // vay trả góp
  'vay tin chap',    // vay tín chấp
  'vay the chap',    // vay thế chấp
  'tin chap',
  'the chap',
  'diem tin dung',   // điểm tín dụng
  'bung no',         // bùng nợ
  'bung app',        // bùng app
  'mo the tin dung', // mở thẻ tín dụng
  'the tin dung',    // thẻ tín dụng
  'rut tien the',    // rút tiền thẻ
  'dao han the',     // đáo hạn thẻ
  'vay ngan hang',   // vay ngân hàng
  'giai ngan',       // giải ngân
  'lai suat vay',    // lãi suất vay
  'khoan vay',       // khoản vay
  'ho so vay',       // hồ sơ vay
  'tat toan khoan vay',
  'sotienvay',
  'so tien vay',
  'can vay tien',
  'muon vay tien',
  'cho vay tien',
  'vay duoc khong',
  'vay duoc bao nhieu',
];

export const CIC_PRODUCTS_CATALOG: Array<{ name: string; normalizedKeys: string[] }> = [
  { name: 'Dự toán CIC', normalizedKeys: ['du toan cic', 'du toan', 'quan ly chi phi', 'chi so gia', 'don gia xay dung'] },
  { name: 'SAP2000', normalizedKeys: ['sap2000', 'sap 2000'] },
  { name: 'ETABS', normalizedKeys: ['etabs'] },
  { name: 'SAFE', normalizedKeys: ['safe'] },
  { name: 'CSiBridge', normalizedKeys: ['csibridge', 'csi bridge'] },
  { name: 'PERFORM-3D', normalizedKeys: ['perform-3d', 'perform 3d'] },
  { name: 'Chứng chỉ CSI', normalizedKeys: ['chung chi csi', 'thi csi', 'dao tao csi'] },
  { name: 'STAAD.Pro', normalizedKeys: ['staad', 'staad.pro', 'staadpro'] },
  { name: 'MicroStation', normalizedKeys: ['microstation'] },
  { name: 'SACS', normalizedKeys: ['sacs'] },
  { name: 'PROKON', normalizedKeys: ['prokon', 'padds'] },
  { name: 'IDEA StatiCa', normalizedKeys: ['idea statica', 'statica'] },
  { name: 'CADprofi', normalizedKeys: ['cadprofi'] },
  { name: 'Autodesk AEC', normalizedKeys: ['autocad', 'revit', 'civil 3d', 'navisworks', 'autodesk', 'aec collection'] },
  { name: 'HiCAD', normalizedKeys: ['hicad'] },
  { name: 'PLAXIS', normalizedKeys: ['plaxis', 'plaxis 2d', 'plaxis 3d'] },
  { name: 'GeoStudio', normalizedKeys: ['geostudio', 'geoslope', 'slope/w', 'seep/w'] },
  { name: 'Leapfrog', normalizedKeys: ['leapfrog', 'leapfrog geo'] },
  { name: 'Deswik', normalizedKeys: ['deswik'] },
  { name: 'Caesar II', normalizedKeys: ['caesar ii', 'caesar 2', 'caesar'] },
  { name: 'KOMPAS-3D', normalizedKeys: ['kompas-3d', 'kompas 3d', 'kompas'] },
  { name: 'NX Siemens', normalizedKeys: ['siemens nx', 'phan mem nx'] },
  { name: 'SOLIDWORKS', normalizedKeys: ['solidworks'] },
  { name: 'HTRI SmartPM', normalizedKeys: ['htri', 'smartpm'] },
  { name: 'DNV GL (Sesam/Phast)', normalizedKeys: ['sesam', 'phast', 'dnv'] },
  { name: 'OpenTrack Railway', normalizedKeys: ['opentrack'] },
  { name: 'PTV Vissim/Visum', normalizedKeys: ['vissim', 'visum', 'ptv'] },
  { name: 'BIMcollab', normalizedKeys: ['bimcollab'] },
  { name: 'Giải pháp BIM', normalizedKeys: ['giai phap bim', 'trien khai bim', 'tu van bim'] },
  { name: 'CHCNAV LiDAR / UAV', normalizedKeys: ['chcnav', 'alphaair', 'alpha air', 'lidar', 'uav', 'flycam x500', 'may quet 3d', 'laser scanner', 'rs10', 'rs7', 'alphauni'] },
  { name: 'Tàu đo đạc APACHE', normalizedKeys: ['apache', 'apache 3', 'apache 6', 'tau thuy van'] },
  { name: 'Robot FIFISH', normalizedKeys: ['fifish', 'robot duoi nuoc'] },
  { name: 'Radar PS2000', normalizedKeys: ['ps2000', 'radar quan trac'] },
  { name: 'LiDAR ZX300e', normalizedKeys: ['zx300e', 'do gio lidar'] },
  { name: 'Pháo sương Spraycannon', normalizedKeys: ['spraycannon', 'dap bui'] },
];

export function extractIdentifiedProducts(text: string): string[] {
  const normalized = stripVietnameseDiacritics(text);
  const matched = new Set<string>();

  for (const item of CIC_PRODUCTS_CATALOG) {
    for (const key of item.normalizedKeys) {
      if (normalized.includes(key)) {
        matched.add(item.name);
        break;
      }
    }
  }

  return Array.from(matched);
}

/**
 * Detect credit / loan confusion or spam.
 */
export function detectCreditOrIrrelevant(text: string): { isCredit: boolean; isSpam: boolean; matchedKeyword?: string } {
  const normalized = stripVietnameseDiacritics(text);

  for (const kw of CREDIT_AND_DEBT_KEYWORDS_NORMALIZED) {
    const regex = new RegExp(`(^|\\s)${kw.replace(/\s+/g, '\\s+')}(\\s|$)`, 'i');
    if (regex.test(normalized)) {
      return { isCredit: true, isSpam: false, matchedKeyword: kw };
    }
  }

  // Regex patterns for loan amounts (e.g. "vay 50tr", "vay 20 trieu", "muon 100k")
  if (/\bvay\s+(\d+)\s*(trieu|tr|ti|ty|tỷ|k|dong|vnd)?\b/i.test(normalized) || /\bmuon\s+tien\b/i.test(normalized)) {
    return { isCredit: true, isSpam: false, matchedKeyword: 'vay tiền' };
  }

  // Regex for debt check
  if (/\b(kiem\s+tra|tra\s+cuu|check)\b.*?\bno\s+xau\b/i.test(normalized)) {
    return { isCredit: true, isSpam: false, matchedKeyword: 'kiểm tra nợ xấu' };
  }

  // Keyboard smash
  if (/^[a-z0-9\s]{1,15}$/i.test(text.trim()) && /([a-z0-9])\1{4,}/i.test(text.trim())) {
    return { isCredit: false, isSpam: true, matchedKeyword: 'ký tự lặp vô nghĩa' };
  }

  // Gambling / casino / crypto / generic SEO spam
  if (/(baccarat|casino|keonhacai|kubet|shbet|tiền ảo|crypto|bitcoin|dịch vụ seo|backlink)/i.test(text)) {
    return { isCredit: false, isSpam: true, matchedKeyword: 'quảng cáo ngoài ngành' };
  }

  return { isCredit: false, isSpam: false };
}

const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.com.vn',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'mail.com',
  'proton.me',
  'protonmail.com',
  'yandex.com',
];

/**
 * Verify whether the submission carries credible signals of being a large enterprise / organization.
 * Individuals using free webmail without a verified company name CANNOT be classified as Enterprise.
 */
export function hasEnterpriseSignals(input: CustomerRequestTriageInput, text: string): boolean {
  const normalized = stripVietnameseDiacritics(text);
  const company = (input.company || '').trim().toLowerCase();
  const email = (input.email || '').trim().toLowerCase();

  // 1. Corporate domain email (not free webmail)
  const isCorporateEmail = Boolean(
    email &&
    email.includes('@') &&
    !FREE_EMAIL_DOMAINS.some((d) => email.endsWith(`@${d}`))
  );

  // 2. Explicit verified enterprise company field
  const hasEnterpriseCompany = Boolean(
    company &&
    (company.includes('tập đoàn') ||
      company.includes('tổng công ty') ||
      company.includes('ban quản lý') ||
      company.includes('viện') ||
      company.includes('sở') ||
      company.includes('trường') ||
      company.length >= 6)
  );

  // 3. Explicit large corporate context in text
  const hasOrgContextInText =
    normalized.includes('tap doan') ||
    normalized.includes('tong cong ty') ||
    normalized.includes('ban quan ly') ||
    normalized.includes('du an cao toc') ||
    normalized.includes('du an san bay') ||
    normalized.includes('du an metro') ||
    normalized.includes('vien thiet ke') ||
    normalized.includes('vien nghien cuu') ||
    normalized.includes('cong trinh bien');

  return isCorporateEmail || hasEnterpriseCompany || hasOrgContextInText;
}

/**
 * Fast deterministic pre-check to catch obvious credit/loan confusion or gibberish
 * even before hitting LLM or in case LLM is unreachable.
 */
function heuristicCheck(text: string): Partial<AiTriageResult> | null {
  const check = detectCreditOrIrrelevant(text);

  if (check.isCredit) {
    return {
      category: 'irrelevant',
      confidence: 100,
      priority: 'low',
      suggestedStatus: 'not_suitable',
      tags: ['ai:irrelevant', 'nham_tin_dung'],
      summary: 'Yêu cầu liên quan đến nợ xấu / vay vốn ngân hàng, nhầm lẫn thương hiệu với CIC Ngân hàng Nhà nước.',
      reason: `Phát hiện từ khóa tín dụng/nợ xấu: "${check.matchedKeyword}".`,
      identifiedProducts: [],
      suggestedAction: 'Lưu trữ hoặc chuyển mục Không phù hợp (Nhầm lẫn thương hiệu tín dụng, không phân bổ kinh doanh).',
    };
  }

  if (check.isSpam) {
    return {
      category: 'irrelevant',
      confidence: 100,
      priority: 'low',
      suggestedStatus: 'not_suitable',
      tags: ['ai:irrelevant', 'spam'],
      summary: 'Nội dung điền rác hoặc quảng cáo dịch vụ ngoài ngành không phù hợp.',
      reason: `Phát hiện rác/quảng cáo ngoài ngành: "${check.matchedKeyword}".`,
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

  // 1. Invoke LLM provider as the PRIMARY intelligence engine
  try {
    const provider = getLlmProvider();
    const userPrompt = `Hãy thẩm định và phân loại yêu cầu khách hàng sau đây:\n\n${combinedText}`;

    const rawResult = await provider.generateStructured<Record<string, unknown>>({
      systemPrompt: AI_TRIAGE_SYSTEM_PROMPT,
      userPrompt,
      temperature: 0.1,
    });

    // CRITICAL: Double-check credit confusion even on LLM output
    const postCheck = detectCreditOrIrrelevant(combinedText);
    if (postCheck.isCredit) {
      return {
        category: 'irrelevant',
        confidence: 100,
        priority: 'low',
        suggestedStatus: 'not_suitable',
        tags: ['ai:irrelevant', 'nham_tin_dung'],
        summary: 'Yêu cầu liên quan đến nợ xấu / vay vốn ngân hàng, nhầm lẫn thương hiệu với CIC Ngân hàng Nhà nước.',
        reason: `Phát hiện từ khóa tín dụng/nợ xấu: "${postCheck.matchedKeyword}".`,
        identifiedProducts: [],
        suggestedAction: 'Lưu trữ hoặc chuyển mục Không phù hợp (Nhầm lẫn thương hiệu tín dụng, không phân bổ kinh doanh).',
      };
    }

    const rawCategory = String(rawResult?.category || '').toLowerCase();
    const isValidCategory = ['enterprise', 'qualified', 'irrelevant'].includes(rawCategory);

    // If LLM returned empty/unrecognized object (e.g. from dev stub fallback)
    if (!isValidCategory) {
      const identified = extractIdentifiedProducts(combinedText);
      if (identified.length > 0) {
        return {
          category: 'qualified',
          confidence: 85,
          priority: 'medium',
          suggestedStatus: 'new',
          tags: ['ai:qualified', ...identified.map((p) => `sp:${p.toLowerCase().replace(/\s+/g, '_')}`)],
          summary: `Khách hàng quan tâm đến giải pháp phần mềm / thiết bị: ${identified.join(', ')}.`,
          reason: `Nhận diện sản phẩm kỹ thuật hợp lệ của CIC: ${identified.join(', ')}.`,
          identifiedProducts: identified,
          suggestedAction: 'Phân bổ nhân viên kinh doanh liên hệ tư vấn và gửi báo giá.',
        };
      }

      // No products recognized and vague inquiry -> default to irrelevant
      return {
        category: 'irrelevant',
        confidence: 80,
        priority: 'low',
        suggestedStatus: 'not_suitable',
        tags: ['ai:irrelevant', 'chua_ro_muc_dich'],
        summary: `Yêu cầu từ ${input.fullname || 'khách hàng'} không chứa thông tin sản phẩm hay lĩnh vực kỹ thuật của CIC.`,
        reason: 'Nội dung không đề cập đến bất kỳ phần mềm, thiết bị đo đạc hay dịch vụ kỹ thuật nào của công ty CIC.',
        identifiedProducts: [],
        suggestedAction: 'Kiểm tra lại tính xác thực trước khi phân bổ kinh doanh.',
      };
    }

    let category: AiTriageCategory = rawCategory as AiTriageCategory;
    let rawPriority = String(rawResult?.priority || '').toLowerCase();

    // STRICT ENTERPRISE GUARDRAIL:
    // If AI flagged as enterprise, but sender has NO corporate domain, NO company name, and NO org in text:
    const hasOrgSignals = hasEnterpriseSignals(input, combinedText);
    const wasDemotedFromEnterprise = category === 'enterprise' && !hasOrgSignals;

    if (wasDemotedFromEnterprise) {
      category = 'qualified';
      rawPriority = 'medium';
    }

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
    const filteredRawTags = wasDemotedFromEnterprise
      ? rawTags.filter((t) => !['ai:enterprise', 'doanh_nghiep_lon', 'vip'].includes(t))
      : rawTags;
    const tags = Array.from(new Set([baseTag, ...filteredRawTags]));

    const summary = typeof rawResult?.summary === 'string' && rawResult.summary.trim()
      ? rawResult.summary.trim()
      : `Yêu cầu từ ${input.fullname || 'khách hàng'}: ${input.subject || input.message || 'Không có mô tả'}`;

    const reason = wasDemotedFromEnterprise
      ? 'Khách hàng có nhu cầu hợp lệ về phần mềm nhưng dùng email cá nhân và chưa có thông tin tổ chức/doanh nghiệp lớn xác thực, phân loại nhóm Khách tiềm năng chuẩn (qualified).'
      : (typeof rawResult?.reason === 'string' && rawResult.reason.trim()
        ? rawResult.reason.trim()
        : `Phân loại ${category} dựa trên nội dung yêu cầu.`);

    const identifiedProducts = Array.isArray(rawResult?.identifiedProducts) && (rawResult.identifiedProducts as unknown[]).length > 0
      ? (rawResult.identifiedProducts as unknown[]).map((p) => String(p).trim()).filter(Boolean)
      : extractIdentifiedProducts(combinedText);

    const suggestedAction = typeof rawResult?.suggestedAction === 'string' && rawResult.suggestedAction.trim() && !wasDemotedFromEnterprise
      ? rawResult.suggestedAction.trim()
      : category === 'enterprise'
      ? 'Phân công Trưởng nhóm kinh doanh liên hệ trực tiếp xác nhận quy mô và nhu cầu triển khai'
      : category === 'irrelevant'
      ? 'Lưu trữ hoặc chuyển mục Không phù hợp (không phân bổ kinh doanh).'
      : 'Phân bổ nhân viên kinh doanh liên hệ tư vấn giải pháp, xác nhận quy mô nhu cầu và gửi báo giá.';

    let confidence = 85;
    if (typeof rawResult?.confidence === 'number' && Number.isFinite(rawResult.confidence)) {
      const rawConf = rawResult.confidence <= 1 ? rawResult.confidence * 100 : rawResult.confidence;
      confidence = Math.min(100, Math.max(0, Math.round(rawConf)));
    }

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
    console.error('[analyzeCustomerRequestWithAi] LLM invocation failed, using deterministic fallback:', error);

    const postCheck = detectCreditOrIrrelevant(combinedText);
    if (postCheck.isCredit) {
      return {
        category: 'irrelevant',
        confidence: 100,
        priority: 'low',
        suggestedStatus: 'not_suitable',
        tags: ['ai:irrelevant', 'nham_tin_dung'],
        summary: 'Yêu cầu liên quan đến nợ xấu / vay vốn ngân hàng, nhầm lẫn thương hiệu với CIC Ngân hàng Nhà nước.',
        reason: `Phát hiện từ khóa tín dụng/nợ xấu: "${postCheck.matchedKeyword}".`,
        identifiedProducts: [],
        suggestedAction: 'Lưu trữ hoặc chuyển mục Không phù hợp (Nhầm lẫn thương hiệu tín dụng, không phân bổ kinh doanh).',
      };
    }

    const identified = extractIdentifiedProducts(combinedText);
    const normalized = stripVietnameseDiacritics(combinedText);
    const isBig =
      hasEnterpriseSignals(input, combinedText) &&
      (normalized.includes('tap doan') ||
        normalized.includes('tong cong ty') ||
        normalized.includes('ban quan ly') ||
        normalized.includes('vien') ||
        normalized.includes('du an cao toc') ||
        normalized.includes('license mang') ||
        normalized.includes('network license')) &&
      identified.length > 0;

    if (isBig) {
      return {
        category: 'enterprise',
        confidence: 85,
        priority: 'urgent',
        suggestedStatus: 'new',
        tags: ['ai:enterprise', 'doanh_nghiep_lon'],
        summary: `Yêu cầu từ đơn vị quy mô lớn: ${input.company || input.fullname || 'Khách hàng'}.`,
        reason: 'Tổ chức quy mô lớn quan tâm đến giải pháp kỹ thuật của CIC.',
        identifiedProducts: identified,
        suggestedAction: 'Phân công Trưởng nhóm kinh doanh liên hệ trực tiếp xác nhận quy mô và nhu cầu triển khai.',
      };
    }

    if (identified.length > 0) {
      return {
        category: 'qualified',
        confidence: 85,
        priority: 'medium',
        suggestedStatus: 'new',
        tags: ['ai:qualified'],
        summary: `Yêu cầu tư vấn phần mềm / thiết bị: ${identified.join(', ')}.`,
        reason: 'Khách hàng quan tâm đến sản phẩm kỹ thuật chính hãng của CIC.',
        identifiedProducts: identified,
        suggestedAction: 'Phân bổ nhân viên kinh doanh liên hệ tư vấn giải pháp và gửi báo giá.',
      };
    }

    return {
      category: 'irrelevant',
      confidence: 80,
      priority: 'low',
      suggestedStatus: 'not_suitable',
      tags: ['ai:irrelevant', 'chua_ro_muc_dich'],
      summary: `Yêu cầu từ ${input.fullname || 'khách hàng'} không chứa thông tin sản phẩm hay lĩnh vực kỹ thuật của CIC.`,
      reason: 'Nội dung không đề cập đến bất kỳ phần mềm hay thiết bị kỹ thuật nào của CIC.',
      identifiedProducts: [],
      suggestedAction: 'Kiểm tra lại tính xác thực trước khi phân bổ kinh doanh.',
    };
  }
}
