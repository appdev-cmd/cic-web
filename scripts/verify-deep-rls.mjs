import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });

async function verify() {
  console.log('=== 1. KIỂM TRA TOÀN BỘ BẢNG TRONG DATABASE ===');
  const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });

  try {
    const tables = await sql`
      SELECT c.relname, c.relrowsecurity
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
      ORDER BY c.relname;
    `;

    const disabled = tables.filter(t => !t.relrowsecurity);
    console.log(`- Tổng số bảng public: ${tables.length}`);
    console.log(`- Số bảng có RLS bật: ${tables.filter(t => t.relrowsecurity).length}`);
    console.log(`- Số bảng RLS TẮT: ${disabled.length}`);
    if (disabled.length > 0) {
      console.log('❌ CẢNH BÁO: Còn bảng chưa bật RLS:', disabled.map(t => t.relname));
    } else {
      console.log('✅ 100% bảng public ĐÃ BẬT RLS!');
    }

    console.log('\n=== 2. KIỂM TRA QUYỀN HẠN CỦA ROLE "anon" (ANON KEY) ===');
    const anonPrivs = await sql`
      SELECT c.relname,
             has_table_privilege('anon', c.oid, 'SELECT') as can_select,
             has_table_privilege('anon', c.oid, 'INSERT') as can_insert,
             has_table_privilege('anon', c.oid, 'UPDATE') as can_update,
             has_table_privilege('anon', c.oid, 'DELETE') as can_delete
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
        AND (
          has_table_privilege('anon', c.oid, 'SELECT') OR
          has_table_privilege('anon', c.oid, 'INSERT') OR
          has_table_privilege('anon', c.oid, 'UPDATE') OR
          has_table_privilege('anon', c.oid, 'DELETE')
        );
    `;

    if (anonPrivs.length === 0) {
      console.log('✅ Role "anon" KHÔNG CÓ BẤT KỲ QUYỀN NÀO trên 151 bảng public! (Đã bị revoke toàn bộ)');
    } else {
      console.log(`❌ CẢNH BÁO: Role "anon" vẫn có quyền trên ${anonPrivs.length} bảng:`, anonPrivs);
    }

    console.log('\n=== 3. KIỂM TRA TEST XÂM NHẬP TRỰC TIẾP QUA POSTGREST REST API (VỚI ANON KEY) ===');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && anonKey) {
      const endpointsToTest = [
        { method: 'GET', path: '/rest/v1/cic_contact?select=*', name: 'Đọc bảng cic_contact' },
        { method: 'POST', path: '/rest/v1/cic_contact', body: { name: 'attacker' }, name: 'Ghi vào bảng cic_contact' },
        { method: 'GET', path: '/rest/v1/cic_users?select=*', name: 'Đọc bảng người dùng cic_users' },
        { method: 'GET', path: '/rest/v1/cic_form_submissions?select=*', name: 'Đọc dữ liệu form cic_form_submissions' },
        { method: 'GET', path: '/rest/v1/cic_products?select=*', name: 'Đọc bảng sản phẩm cic_products' },
        { method: 'GET', path: '/rest/v1/cic_activity_logs?select=*', name: 'Đọc log hệ thống cic_activity_logs' }
      ];

      for (const ep of endpointsToTest) {
        try {
          const res = await fetch(`${supabaseUrl}${ep.path}`, {
            method: ep.method,
            headers: {
              'apikey': anonKey,
              'Authorization': `Bearer ${anonKey}`,
              'Content-Type': 'application/json'
            },
            body: ep.body ? JSON.stringify(ep.body) : undefined
          });
          const text = await res.text();
          console.log(`- [${ep.method}] ${ep.name}: HTTP Status ${res.status} | Response: ${text.slice(0, 90)}...`);
        } catch (fetchErr) {
          console.log(`- [${ep.method}] ${ep.name}: Lỗi kết nối: ${fetchErr.message}`);
        }
      }
    }

    console.log('\n=== 4. PHÂN BỐ POLICY TRÊN CÁC BẢNG ===');
    const policySummary = await sql`
      SELECT tablename, count(*)::int as count, string_agg(policyname, ', ') as policies
      FROM pg_policies
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename;
    `;
    console.log(`- Tổng số bảng có policy: ${policySummary.length}`);
    console.log(`- Tổng số bảng Default-Deny (RLS ON, 0 policy - Chặn 100% PostgREST): ${tables.length - policySummary.length}`);

  } finally {
    await sql.end({ timeout: 2 });
  }
}

verify();
