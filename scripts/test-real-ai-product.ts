import { getCicTaxonomyContext, findSimilarProductsContext } from '../src/features/ai-operator/server/context-retriever.ts';
import { getLlmProvider } from '../src/features/ai-operator/server/llm-provider.ts';
import { buildProductDraftPrompt } from '../src/features/ai-operator/server/prompts/product-draft.ts';
import { getPostgresClient } from '../src/server/db/postgres.ts';

async function testRealAi() {
  console.log('=== TEST LIVE QWEN 30B WITH REAL DB GROUNDING ===');
  console.log('Endpoint:', process.env.AI_OPERATOR_API_URL);
  console.log('Model:', process.env.AI_OPERATOR_MODEL);

  const llm = getLlmProvider();
  console.log('Using LLM Provider:', llm.name);

  const input = `ZWCAD 2027 Professional
Hãng: ZWSOFT
Mã: ZW-2027-PRO
Giải pháp thiết kế CAD 2D/3D thay thế AutoCAD bản quyền vĩnh viễn cho kỹ sư xây dựng, hỗ trợ định dạng DWG/DXF chuẩn quốc tế.`;
  console.log('\n--- Input:', input);

  console.log('\n1. Tra cứu ngữ cảnh từ DB PostgreSQL...');
  const taxonomy = await getCicTaxonomyContext();
  console.log(`Đã nạp: ${taxonomy.brands.length} hãng, ${taxonomy.categories.length} danh mục.`);

  console.log('\n2. Tra cứu sản phẩm tương tự...');
  const similar = await findSimilarProductsContext('ZWCAD');
  console.log(`Tìm thấy: ${similar.length} sản phẩm tương tự.`);

  console.log('\n3. Xây dựng Prompt Grounded & Zero-Hallucination...');
  const { systemPrompt, userPrompt } = buildProductDraftPrompt({
    userInput: input,
    locale: 'vi',
    taxonomy,
    similarProducts: similar,
  });

  console.log('\n4. Đang gửi request tới Qwen 30B self-hosted (vui lòng chờ)...');
  const startTime = Date.now();
  const rawDraft = await llm.generateStructured<Record<string, unknown>>({
    systemPrompt,
    userPrompt,
    temperature: 0.2,
  });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✓ Qwen 30B phản hồi thành công sau ${elapsed}s!`);

  console.log('\n=== DỮ LIỆU ĐƯỢC QWEN 30B SINH RA ===');
  console.log(JSON.stringify(rawDraft, null, 2));

  console.log('\n=== KIỂM TRA RÀNG BUỘC CHỐNG BỊA ĐẶT (ZERO-HALLUCINATION) ===');
  console.log('- Tên sản phẩm:', rawDraft.name);
  console.log('- Slug/Alias:', rawDraft.alias);
  console.log('- Mã sản phẩm (Code/SKU):', rawDraft.code === '' ? '✓ ĐỂ TRỐNG (Đúng quy tắc vì input không có)' : rawDraft.code);
  console.log('- Hãng sản xuất ID (manufactoryId):', rawDraft.manufactoryId);
  if (rawDraft.manufactoryId) {
    const brand = taxonomy.brands.find((b) => b.id === Number(rawDraft.manufactoryId));
    console.log('  -> Tên hãng tương ứng trong DB:', brand ? brand.name : 'Không tìm thấy ID');
  }
  console.log('- Danh mục IDs (categoryIds):', rawDraft.categoryIds);
  console.log('- Tóm tắt (Summary):', rawDraft.summary);
  console.log('- Thông số chi tiết (Feature Details):', rawDraft.feature_details === '' ? '✓ ĐỂ TRỐNG (Đúng quy tắc vì input không có tài liệu kỹ thuật chi tiết)' : rawDraft.feature_details);
  console.log('- SEO Title:', rawDraft.seo_title, `(${String(rawDraft.seo_title || '').length} ký tự)`);
  console.log('- SEO Description:', rawDraft.seo_description, `(${String(rawDraft.seo_description || '').length} ký tự)`);
  console.log('- SEO Keyword:', rawDraft.seo_keyword);
  console.log('- Tags:', rawDraft.tags);

  const sql = getPostgresClient();
  await sql.end();
}

testRealAi().catch((err) => {
  console.error('\n❌ Lỗi khi test Qwen 30B:', err);
  process.exit(1);
});
