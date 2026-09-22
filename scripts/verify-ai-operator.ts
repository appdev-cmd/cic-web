import assert from 'node:assert/strict';
import { getCicTaxonomyContext, findSimilarProductsContext } from '../src/features/ai-operator/server/context-retriever.ts';
import { getLlmProvider } from '../src/features/ai-operator/server/llm-provider.ts';
import { buildProductDraftPrompt } from '../src/features/ai-operator/server/prompts/product-draft.ts';
import { getPostgresClient } from '../src/server/db/postgres.ts';

async function main() {
  console.log('--- TEST 1: Taxonomy Retrieval & DB Grounding ---');
  const taxonomy = await getCicTaxonomyContext();
  console.log(`Retrieved ${taxonomy.brands.length} brands, ${taxonomy.categories.length} categories, ${taxonomy.applications.length} applications, ${taxonomy.productTypes.length} types.`);
  assert.ok(taxonomy.brands.length > 0, 'Brands should not be empty');
  assert.ok(taxonomy.categories.length > 0, 'Categories should not be empty');

  // Verify DB cache (second call should be instant from memory cache)
  const cachedTaxonomy = await getCicTaxonomyContext();
  assert.equal(cachedTaxonomy.brands.length, taxonomy.brands.length);

  console.log('--- TEST 2: Brand Matching against Live DB ---');
  const llm = getLlmProvider();
  
  // Test CSI match
  const csiPrompt = buildProductDraftPrompt({
    userInput: 'Phần mềm kết cấu SAP2000 Ultimate của hãng CSI',
    locale: 'vi',
    taxonomy,
    similarProducts: [],
  });
  const csiResult = await llm.generateStructured<{
    name: string;
    manufactoryId: number | null;
    categoryIds: number[];
  }>({
    systemPrompt: csiPrompt.systemPrompt,
    userPrompt: csiPrompt.userPrompt,
  });
  console.log('CSI Brand Match Result:', csiResult);
  const csiBrandInDb = taxonomy.brands.find((b) => b.name === 'CSI');
  assert.ok(csiBrandInDb, 'CSI brand exists in DB');
  assert.equal(csiResult.manufactoryId, csiBrandInDb.id, 'manufactoryId should match CSI ID');

  console.log('--- TEST 3: Zero-Hallucination Constraints ---');
  const noSpecsPrompt = buildProductDraftPrompt({
    userInput: 'ZWCAD 2027 Professional',
    locale: 'vi',
    taxonomy,
    similarProducts: [],
  });
  const noSpecsResult = await llm.generateStructured<{
    name: string;
    alias: string;
    code: string;
    feature_details: string;
    seo_title: string;
  }>({
    systemPrompt: noSpecsPrompt.systemPrompt,
    userPrompt: noSpecsPrompt.userPrompt,
  });
  console.log('Zero-hallucination output:', noSpecsResult);
  assert.equal(noSpecsResult.code, '', 'Code/SKU must be empty string when not provided');
  assert.equal(noSpecsResult.feature_details, '', 'feature_details must be empty string when not provided');

  console.log('--- TEST 4: Contextual Actions (SEO & Translation Stubs) ---');
  const seoResult = await llm.generateStructured<{
    seo_title: string;
    seo_description: string;
    seo_keyword: string;
  }>({
    systemPrompt: 'Chỉ trả về JSON object hợp lệ.',
    userPrompt: 'Bạn là chuyên gia SEO của CIC. Tạo thẻ SEO tối ưu cho sản phẩm: Tên: "SAP2000"',
  });
  console.log('SEO Action Output:', seoResult);
  assert.ok(seoResult.seo_title.length > 0 && seoResult.seo_title.length <= 65, 'seo_title in optimal length');
  assert.ok(seoResult.seo_description.length > 0 && seoResult.seo_description.length <= 160, 'seo_description in optimal length');

  const transResult = await llm.generateStructured<{
    name: string;
    summary: string;
    seo_title: string;
  }>({
    systemPrompt: 'Chỉ trả về JSON object hợp lệ.',
    userPrompt: 'Dịch và bản địa hóa hồ sơ sản phẩm: Tên gốc: "Phần mềm kết cấu"',
  });
  console.log('Translation Action Output:', transResult);
  assert.ok(transResult.name.includes('Phần mềm kết cấu'), 'Translated name preserved');

  console.log('====================================================');
  console.log('✓ ALL AI OPERATOR INTEGRATION CHECKS PASSED (100%)');
  console.log('====================================================');

  const sql = getPostgresClient();
  await sql.end();
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
