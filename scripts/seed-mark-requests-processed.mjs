import { config } from 'dotenv';
import postgres from 'postgres';

// Auto-load .env.local and .env
config({ path: '.env.local', override: false, quiet: true });
config({ path: '.env', override: false, quiet: true });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.warn('⚠️ [SEED] DATABASE_URL is not set. Skipping customer requests status seed.');
  process.exit(0);
}

const sql = postgres(DATABASE_URL, {
  max: 5,
  prepare: false,
  ssl: 'require',
  connect_timeout: 10,
});

async function main() {
  console.log('🔄 [SEED] Starting batch update: Marking all existing customer requests as processed (Đã xử lý)...');

  try {
    await sql.begin(async (tx) => {
      // 1. Update legacy product quote requests (cic_product_contact)
      const updatedQuotes = await tx`
        UPDATE cic_product_contact
        SET published = true
        WHERE published = false
        RETURNING id
      `;

      // 2. Update legacy contact requests VI (cic_contact)
      const updatedContactsVi = await tx`
        UPDATE cic_contact
        SET published = true
        WHERE published = false
        RETURNING id
      `;

      // 3. Update legacy contact requests EN (cic_contact_en)
      const updatedContactsEn = await tx`
        UPDATE cic_contact_en
        SET published = true
        WHERE published = false
        RETURNING id
      `;

      // 4. Ensure cic_customer_request_states table exists
      await tx`
        CREATE TABLE IF NOT EXISTS cic_customer_request_states (
          id BIGSERIAL PRIMARY KEY,
          workspace VARCHAR(5) NOT NULL DEFAULT 'vi',
          source_type VARCHAR(30) NOT NULL,
          source_id BIGINT NOT NULL,
          status VARCHAR(30) NOT NULL DEFAULT 'new',
          priority VARCHAR(20) NOT NULL DEFAULT 'medium',
          assigned_user_id BIGINT NULL,
          tags TEXT[] NOT NULL DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          CONSTRAINT uq_cic_customer_request_state UNIQUE (workspace, source_type, source_id)
        )
      `;

      // 5. Backfill/Upsert completed state for all product quote requests
      const statesQuotes = await tx`
        INSERT INTO cic_customer_request_states (
          workspace, source_type, source_id, status, priority, tags, created_at, updated_at
        )
        SELECT
          'vi',
          'product_contact',
          id,
          'completed',
          'medium',
          '{}',
          COALESCE(created_time, now()),
          now()
        FROM cic_product_contact
        ON CONFLICT (workspace, source_type, source_id)
        DO UPDATE SET status = 'completed', updated_at = now()
        RETURNING id
      `;

      // 6. Backfill/Upsert completed state for all contact requests (VI)
      const statesContactsVi = await tx`
        INSERT INTO cic_customer_request_states (
          workspace, source_type, source_id, status, priority, tags, created_at, updated_at
        )
        SELECT
          'vi',
          'contact',
          id,
          'completed',
          'medium',
          '{}',
          COALESCE(created_time, now()),
          now()
        FROM cic_contact
        ON CONFLICT (workspace, source_type, source_id)
        DO UPDATE SET status = 'completed', updated_at = now()
        RETURNING id
      `;

      // 7. Backfill/Upsert completed state for all contact requests (EN)
      const statesContactsEn = await tx`
        INSERT INTO cic_customer_request_states (
          workspace, source_type, source_id, status, priority, tags, created_at, updated_at
        )
        SELECT
          'en',
          'contact',
          id,
          'completed',
          'medium',
          '{}',
          COALESCE(created_time, now()),
          now()
        FROM cic_contact_en
        ON CONFLICT (workspace, source_type, source_id)
        DO UPDATE SET status = 'completed', updated_at = now()
        RETURNING id
      `;

      // 8. Backfill/Upsert completed state for all orders (cic_order) if table exists
      let statesOrders = [];
      const [orderTable] = await tx`
        SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cic_order'
      `;
      if (orderTable) {
        statesOrders = await tx`
          INSERT INTO cic_customer_request_states (
            workspace, source_type, source_id, status, priority, tags, created_at, updated_at
          )
          SELECT
            'vi',
            'order',
            id,
            'completed',
            'medium',
            '{}',
            COALESCE(created_time, now()),
            now()
          FROM cic_order
          ON CONFLICT (workspace, source_type, source_id)
          DO UPDATE SET status = 'completed', updated_at = now()
          RETURNING id
        `;
      }

      // 9. Backfill/Upsert completed state for all form submissions (cic_form_submissions) if table exists
      let statesSubmissions = [];
      const [formSubTable] = await tx`
        SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cic_form_submissions'
      `;
      if (formSubTable) {
        statesSubmissions = await tx`
          INSERT INTO cic_customer_request_states (
            workspace, source_type, source_id, status, priority, tags, created_at, updated_at
          )
          SELECT
            COALESCE(f.workspace, 'vi'),
            'form_submission',
            fs.id,
            'completed',
            'medium',
            '{}',
            COALESCE(fs.submitted_at, now()),
            now()
          FROM cic_form_submissions fs
          LEFT JOIN cic_forms f ON f.id = fs.form_id
          ON CONFLICT (workspace, source_type, source_id)
          DO UPDATE SET status = 'completed', updated_at = now()
          RETURNING id
        `;
      }

      console.log('✅ [SEED] Customer requests update completed successfully:');
      console.log(`   - Product quote requests updated (published=true): ${updatedQuotes.length}`);
      console.log(`   - Contact requests (VI) updated (published=true): ${updatedContactsVi.length}`);
      console.log(`   - Contact requests (EN) updated (published=true): ${updatedContactsEn.length}`);
      console.log(`   - States synced as 'completed' (Quotes): ${statesQuotes.length}`);
      console.log(`   - States synced as 'completed' (Contacts VI): ${statesContactsVi.length}`);
      console.log(`   - States synced as 'completed' (Contacts EN): ${statesContactsEn.length}`);
      if (orderTable) console.log(`   - States synced as 'completed' (Orders): ${statesOrders.length}`);
      if (formSubTable) console.log(`   - States synced as 'completed' (Form Submissions): ${statesSubmissions.length}`);
    });
  } catch (err) {
    console.error('❌ [SEED] Failed to mark customer requests as processed:', err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
