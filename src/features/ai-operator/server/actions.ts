'use server';

import { getPostgresClient } from '@/server/db/postgres';
import { requireCmsAccess } from '@/server/auth/guards';
import type {
  AiProductDraftResult,
  FieldOrigin,
  FieldChangeItem,
  NeedsAttentionItem,
  ProductAiActionType,
} from '../types';
import { getLlmProvider } from './llm-provider';
import { getCicTaxonomyContext, findSimilarProductsContext } from './context-retriever';
import { buildProductDraftPrompt } from './prompts/product-draft';

interface GeneratedDraftRaw {
  name?: string;
  alias?: string;
  code?: string;
  manufactoryId?: number | null;
  categoryIds?: number[];
  applicationIds?: number[];
  typeId?: number | null;
  summary?: string;
  description?: string;
  feature_details?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keyword?: string;
  relatedProductIds?: number[];
  teamview?: boolean;
}

export async function generateSmartProductDraftAction(
  inputPrompt: string,
  locale: 'vi' | 'en' = 'vi'
): Promise<AiProductDraftResult> {
  // 1. Auth check
  await requireCmsAccess();

  const trimmedInput = inputPrompt.trim();
  if (!trimmedInput) {
    throw new Error('Vui lòng nhập tên hoặc thông tin sản phẩm.');
  }

  const logs: AiProductDraftResult['executionLogs'] = [];

  // Step 1: Parse input
  logs.push({ step: 'parse_input', status: 'done', detail: `Tiếp nhận đầu vào: "${trimmedInput.substring(0, 60)}..."` });

  // Step 2: Context Retrieval
  logs.push({ step: 'retrieve_db_context', status: 'running', detail: 'Đang tra cứu danh mục, hãng và lĩnh vực CIC từ Database...' });
  const taxonomy = await getCicTaxonomyContext();
  const similarProducts = await findSimilarProductsContext(trimmedInput);
  logs.push({
    step: 'retrieve_db_context',
    status: 'done',
    detail: `Khớp thành công ${taxonomy.brands.length} hãng, ${taxonomy.categories.length} danh mục trong hệ thống.`,
  });

  // Step 3: LLM Structured Generation
  logs.push({ step: 'llm_generation', status: 'running', detail: 'Qwen 30B đang phân tích và cấu trúc hóa hồ sơ sản phẩm...' });
  const llm = getLlmProvider();
  const { systemPrompt, userPrompt } = buildProductDraftPrompt({
    userInput: trimmedInput,
    locale,
    taxonomy,
    similarProducts,
  });

  const rawDraft = await llm.generateStructured<GeneratedDraftRaw>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });
  logs.push({ step: 'llm_generation', status: 'done', detail: `Hoàn tất xử lý qua ${llm.name}.` });

  // Step 4: Verification & Safe Mapping
  logs.push({ step: 'deterministic_validation', status: 'running', detail: 'Kiểm tra xung đột alias và các ràng buộc hệ thống...' });
  const sql = getPostgresClient();

  const rawAlias = String(rawDraft.alias || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  let finalAlias = rawAlias || 'san-pham-moi';
  const aliasConflictRows = await sql<{ id: number }[]>`
    SELECT id FROM cic_products WHERE lower(btrim(alias)) = lower(btrim(${finalAlias})) LIMIT 1
  `;

  let hasAliasConflict = false;
  if (aliasConflictRows.length > 0) {
    hasAliasConflict = true;
    finalAlias = `${finalAlias}-${Date.now().toString().slice(-4)}`;
  }

  // Determine Field Origins
  const fieldOrigins: Record<string, FieldOrigin> = {};
  const changes: FieldChangeItem[] = [];
  const needsAttention: NeedsAttentionItem[] = [];

  // Helper to register
  const registerField = (
    field: string,
    label: string,
    group: FieldChangeItem['group'],
    origin: FieldOrigin,
    val: unknown
  ) => {
    fieldOrigins[field] = origin;
    if (val !== undefined && val !== null && val !== '') {
      changes.push({
        field,
        label,
        group,
        origin,
        oldValue: '',
        newValue: val,
      });
    }
  };

  const nameVal = rawDraft.name?.trim() || trimmedInput.split('\n')[0].trim();
  registerField('name', 'Tên sản phẩm', 'normalization', 'verified', nameVal);
  registerField('alias', 'Đường dẫn (Slug)', 'normalization', 'verified', finalAlias);

  // SKU / Code: User correction #2 - DO NOT invent SKU if not provided!
  const codeVal = rawDraft.code?.trim() || '';
  if (codeVal) {
    registerField('code', 'Mã sản phẩm (Code/SKU)', 'normalization', 'verified', codeVal);
  } else {
    fieldOrigins.code = 'missing';
    needsAttention.push({
      field: 'code',
      label: 'Mã sản phẩm (Code/SKU)',
      reason: 'Đầu vào chưa cung cấp mã sản phẩm hoặc SKU quản lý kho.',
      required: false,
    });
  }

  // Price: ALWAYS missing unless explicitly verified
  fieldOrigins.price = 'missing';
  needsAttention.push({
    field: 'price',
    label: 'Giá bán sản phẩm',
    reason: 'Chính sách giá thương mại cần biên tập viên xác nhận hoặc đặt là "Liên hệ".',
    required: true,
    suggestedValue: 'Liên hệ',
  });

  // Manufactory: AI suggested
  const manufactoryVal = rawDraft.manufactoryId ? String(rawDraft.manufactoryId) : '';
  if (manufactoryVal) {
    registerField('manufactory', 'Hãng sản xuất', 'classification', 'suggested', manufactoryVal);
  } else {
    fieldOrigins.manufactory = 'missing';
    needsAttention.push({
      field: 'manufactory',
      label: 'Hãng sản xuất',
      reason: 'Chưa xác định được hãng sản xuất tương ứng trong danh mục CIC.',
      required: true,
    });
  }

  // Categories: AI suggested
  const categoryIdsVal = (rawDraft.categoryIds || []).map(String);
  if (categoryIdsVal.length > 0) {
    registerField('category_ids', 'Danh mục sản phẩm', 'classification', 'suggested', categoryIdsVal);
  } else {
    fieldOrigins.category_ids = 'missing';
    needsAttention.push({
      field: 'category_ids',
      label: 'Danh mục sản phẩm',
      reason: 'Chưa gán danh mục chuyên môn cho sản phẩm.',
      required: true,
    });
  }

  // Editorial content
  registerField('summary', 'Tóm tắt', 'content', 'generated', rawDraft.summary || '');
  registerField('description', 'Mô tả tổng quan', 'content', 'generated', rawDraft.description || '');

  // Feature details: User correction #1 - if not in input, MUST be missing!
  const featureDetailsVal = rawDraft.feature_details?.trim() || '';
  if (featureDetailsVal) {
    registerField('feature_details', 'Thông số & Tính năng chi tiết', 'content', 'generated', featureDetailsVal);
  } else {
    fieldOrigins.feature_details = 'missing';
    needsAttention.push({
      field: 'feature_details',
      label: 'Thông số & Tính năng chi tiết',
      reason: 'Đầu vào chưa có tài liệu kỹ thuật chi tiết để soạn bảng tính năng.',
      required: false,
    });
  }

  // SEO
  registerField('seo_title', 'SEO Title', 'seo', 'generated', rawDraft.seo_title || `${nameVal} — CIC`);
  registerField('seo_description', 'SEO Description', 'seo', 'generated', rawDraft.seo_description || rawDraft.summary || '');
  registerField('seo_keyword', 'SEO Keywords', 'seo', 'generated', rawDraft.seo_keyword || '');
  registerField('tags', 'Thẻ Tags', 'seo', 'generated', rawDraft.tags || []);

  // Safe defaults
  fieldOrigins.published = 'verified';
  fieldOrigins.is_hot = 'verified';
  fieldOrigins.teamview = 'verified';

  if (hasAliasConflict) {
    needsAttention.push({
      field: 'alias',
      label: 'Đường dẫn (Slug)',
      reason: `Đường dẫn gốc "${rawAlias}" đã tồn tại trong DB, hệ thống đã tạm đổi thành "${finalAlias}".`,
      required: true,
      suggestedValue: finalAlias,
    });
  }

  logs.push({
    step: 'deterministic_validation',
    status: 'done',
    detail: `Đã hoàn thiện ${changes.length} trường, ${needsAttention.length} mục cần xác nhận.`,
  });

  const productData: Record<string, unknown> = {
    name: nameVal,
    title: nameVal,
    alias: finalAlias,
    code: codeVal,
    sku: codeVal,
    manufactory: manufactoryVal,
    brand_id: manufactoryVal,
    category_ids: categoryIdsVal,
    category_id: categoryIdsVal[0] || '',
    application: (rawDraft.applicationIds || []).map(String),
    application_areas: (rawDraft.applicationIds || []).map(String),
    types: rawDraft.typeId ? String(rawDraft.typeId) : '',
    product_type: rawDraft.typeId ? String(rawDraft.typeId) : '',
    summary: rawDraft.summary || '',
    short_description: rawDraft.summary || '',
    description: rawDraft.description || '',
    content_html: rawDraft.description || '',
    feature_details: featureDetailsVal,
    tags: rawDraft.tags || [],
    seo_title: rawDraft.seo_title || `${nameVal} — CIC`,
    meta_title: rawDraft.seo_title || `${nameVal} — CIC`,
    seo_description: rawDraft.seo_description || '',
    meta_description: rawDraft.seo_description || '',
    seo_keyword: rawDraft.seo_keyword || '',
    meta_keywords: rawDraft.seo_keyword || '',
    price: '',
    price_old: '',
    published: false, // ALWAYS false
    is_hot: false, // ALWAYS false
    teamview: rawDraft.teamview ?? true,
    ordering: 1,
  };

  const suggestedCount = Object.values(fieldOrigins).filter((o) => o === 'suggested').length;
  const completedCount = Object.values(fieldOrigins).filter((o) => o === 'verified' || o === 'generated').length;

  return {
    productData,
    fieldOrigins,
    changes,
    needsAttention,
    suggestedCount,
    completedCount,
    executionLogs: logs,
  };
}

/**
 * Executes contextual AI actions on an existing product in FormView.
 * Returns partial updates without overwriting untouched user fields.
 */
export async function runProductAiAction(params: {
  actionType: ProductAiActionType;
  currentProduct: Record<string, unknown>;
  locale?: 'vi' | 'en';
}): Promise<{
  updatedFields: Record<string, unknown>;
  explanation: string;
}> {
  await requireCmsAccess();
  const llm = getLlmProvider();
  const locale = params.locale || 'vi';
  const prod = params.currentProduct;

  switch (params.actionType) {
    case 'optimize_seo': {
      const name = String(prod.name || prod.title || 'Sản phẩm');
      const summary = String(prod.summary || prod.description || '');

      const prompt = `Bạn là chuyên gia SEO của CIC. Tạo thẻ SEO tối ưu cho sản phẩm:
Tên: "${name}"
Mô tả: "${summary.substring(0, 300)}"
Yêu cầu:
- seo_title: độ dài 40-65 ký tự, bao gồm tên sản phẩm và chữ "CIC"
- seo_description: độ dài 120-160 ký tự, hấp dẫn, chuẩn Google snippet
- seo_keyword: 5-8 từ khóa kỹ thuật ngăn cách bởi dấu phẩy
Trả về đúng định dạng JSON: { "seo_title": string, "seo_description": string, "seo_keyword": string }`;

      const res = await llm.generateStructured<{ seo_title: string; seo_description: string; seo_keyword: string }>({
        systemPrompt: 'Chỉ trả về JSON object hợp lệ.',
        userPrompt: prompt,
      });

      return {
        updatedFields: {
          seo_title: res.seo_title,
          meta_title: res.seo_title,
          seo_description: res.seo_description,
          meta_description: res.seo_description,
          seo_keyword: res.seo_keyword,
          meta_keywords: res.seo_keyword,
        },
        explanation: 'Đã tối ưu lại bộ thẻ SEO (Title, Description, Keywords) theo độ dài tiêu chuẩn Google.',
      };
    }

    case 'sync_translation': {
      const targetLang = locale === 'vi' ? 'en' : 'vi';
      const name = String(prod.name || prod.title || '');
      const summary = String(prod.summary || '');
      const desc = String(prod.description || '');

      const prompt = `Dịch và bản địa hóa hồ sơ sản phẩm từ ${locale.toUpperCase()} sang ${targetLang.toUpperCase()} cho website CIC:
Tên gốc: "${name}"
Tóm tắt gốc: "${summary}"
Nội dung gốc: "${desc.substring(0, 500)}"
LƯU Ý:
- Giữ nguyên các thuật ngữ kỹ thuật chuyên ngành kỹ thuật xây dựng / phần mềm (BIM, CAD, FEM).
- Viết văn phong thương mại trang trọng.
Trả về JSON: { "name": string, "summary": string, "description": string, "seo_title": string, "seo_description": string }`;

      const res = await llm.generateStructured<{
        name: string;
        summary: string;
        description: string;
        seo_title: string;
        seo_description: string;
      }>({
        systemPrompt: 'Chỉ trả về JSON object hợp lệ.',
        userPrompt: prompt,
      });

      return {
        updatedFields: {
          name: res.name,
          title: res.name,
          summary: res.summary,
          short_description: res.summary,
          description: res.description,
          content_html: res.description,
          seo_title: res.seo_title,
          seo_description: res.seo_description,
        },
        explanation: `Đã dịch thuật ngữ chuyên ngành sang phiên bản Tiếng ${targetLang === 'en' ? 'Anh' : 'Việt'}.`,
      };
    }

    case 'complete_missing':
    default: {
      const taxonomy = await getCicTaxonomyContext();
      const matchedBrand = taxonomy.brands.find((b) =>
        String(prod.name || '').toLowerCase().includes(b.name.toLowerCase())
      );

      const updates: Record<string, unknown> = {};
      if (!prod.manufactory && matchedBrand) {
        updates.manufactory = String(matchedBrand.id);
        updates.brand_id = String(matchedBrand.id);
      }
      if (!prod.seo_title) {
        updates.seo_title = `${String(prod.name || 'Sản phẩm')} — Bản quyền CIC`;
        updates.meta_title = updates.seo_title;
      }
      if (!prod.seo_description && prod.summary) {
        updates.seo_description = String(prod.summary).substring(0, 150);
        updates.meta_description = updates.seo_description;
      }

      return {
        updatedFields: updates,
        explanation: `Đã tự động kiểm tra và điền ${Object.keys(updates).length} trường còn thiếu.`,
      };
    }
  }
}
