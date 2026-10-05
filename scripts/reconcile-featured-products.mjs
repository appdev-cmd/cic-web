import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required. Run with --env-file=.env.local');
}

const sql = postgres(url, { max: 1 });

async function main() {
  try {
    console.log('=== BẮT ĐẦU RÀ SOÁT VÀ ĐỒNG BỘ SẢN PHẨM NỔI BẬT (TỐI ĐA 6 MỤC) ===');

    // 1. Vietnamese workspace (cic_products)
    const beforeVi = await sql.unsafe(
      'SELECT id, name, coalesce(edited_time, created_time) as dt FROM cic_products WHERE is_hot = true ORDER BY coalesce(edited_time, created_time) DESC NULLS LAST, id DESC'
    );
    console.log(`Số lượng sản phẩm nổi bật tiếng Việt hiện tại: ${beforeVi.length}/6`);

    const top6Vi = beforeVi.slice(0, 6);
    const top6ViIds = top6Vi.map((p) => p.id);

    if (beforeVi.length > 6) {
      const updatedVi = await sql.unsafe(
        `UPDATE cic_products
         SET is_hot = false
         WHERE is_hot = true AND NOT (id = ANY($1::int[]))
         RETURNING id, name`,
        [top6ViIds]
      );
      console.log(`Đã hủy cờ nổi bật của ${updatedVi.length} sản phẩm tiếng Việt cũ.`);
    }

    const afterVi = await sql.unsafe(
      'SELECT id, name, coalesce(edited_time, created_time) as dt FROM cic_products WHERE is_hot = true ORDER BY coalesce(edited_time, created_time) DESC NULLS LAST, id DESC'
    );
    console.log(`Danh sách 6 sản phẩm nổi bật tiếng Việt được giữ lại:`);
    afterVi.forEach((p, idx) => console.log(`  ${idx + 1}. [ID: ${p.id}] ${p.name}`));

    // 2. English workspace (cic_products_en)
    const beforeEn = await sql.unsafe(
      'SELECT id, name, coalesce(edited_time, created_time) as dt FROM cic_products_en WHERE is_hot = true ORDER BY coalesce(edited_time, created_time) DESC NULLS LAST, id DESC'
    );
    console.log(`\nSố lượng sản phẩm nổi bật tiếng Anh hiện tại: ${beforeEn.length}/6`);

    const top6En = beforeEn.slice(0, 6);
    const top6EnIds = top6En.map((p) => p.id);

    if (beforeEn.length > 6) {
      const updatedEn = await sql.unsafe(
        `UPDATE cic_products_en
         SET is_hot = false
         WHERE is_hot = true AND NOT (id = ANY($1::int[]))
         RETURNING id, name`,
        [top6EnIds]
      );
      console.log(`Đã hủy cờ nổi bật của ${updatedEn.length} sản phẩm tiếng Anh cũ.`);
    }

    const afterEn = await sql.unsafe(
      'SELECT id, name, coalesce(edited_time, created_time) as dt FROM cic_products_en WHERE is_hot = true ORDER BY coalesce(edited_time, created_time) DESC NULLS LAST, id DESC'
    );
    console.log(`Danh sách 6 sản phẩm nổi bật tiếng Anh được giữ lại:`);
    afterEn.forEach((p, idx) => console.log(`  ${idx + 1}. [ID: ${p.id}] ${p.name}`));

    console.log('\n=== HOÀN TẤT ĐỒNG BỘ SẢN PHẨM NỔI BẬT (CHÍNH XÁC 6/6) ===');
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('Lỗi khi đồng bộ sản phẩm nổi bật:', err);
  process.exit(1);
});
