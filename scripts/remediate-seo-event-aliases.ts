/**
 * SEO-013: inspect with --dry-run (default). --apply is a deliberate data migration.
 * Do not run --apply against production without an approved backup/deployment window.
 */
import postgres from 'postgres';
import { normalizeEventSlug } from '../src/features/events/domain/slug';

type Locale = 'vi' | 'en';
type EventRow = { id: number; alias: string; title: string; published: boolean };
type Mapping = EventRow & { locale: Locale; newAlias: string };

const apply = process.argv.includes('--apply');
const dryRun = process.argv.includes('--dry-run') || !apply;
if (apply && process.argv.includes('--dry-run')) throw new Error('Choose either --dry-run or --apply.');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require', prepare: false, max: 1, connect_timeout: 10,
});

function createMappings(locale: Locale, rows: EventRow[]): Mapping[] {
  const occupied = new Set(rows.map((row) => row.alias.trim().toLowerCase()));
  const mappings: Mapping[] = [];
  for (const row of [...rows].sort((a, b) => a.id - b.id)) {
    const normalized = normalizeEventSlug(row.alias);
    if (!normalized) throw new Error(`${locale} Event ${row.id} normalizes to an empty alias.`);
    if (normalized.length > 255) throw new Error(`${locale} Event ${row.id} alias exceeds 255 characters.`);
    if (normalized === row.alias) continue;
    let newAlias = normalized;
    if (occupied.has(newAlias) && newAlias !== row.alias.toLowerCase()) {
      let attempt = 1;
      do {
        const suffix = `-${row.id}${attempt === 1 ? '' : `-${attempt}`}`;
        newAlias = `${normalized.slice(0, 255 - suffix.length)}${suffix}`;
        attempt++;
      } while (occupied.has(newAlias));
    }
    occupied.add(newAlias);
    mappings.push({ ...row, locale, newAlias });
  }
  return mappings;
}

async function loadRows(client: typeof sql, table: 'cic_event' | 'cic_event_en') {
  return client<EventRow[]>`SELECT id, alias, title, published FROM ${client(table)} ORDER BY id`;
}

try {
  if (dryRun) {
    const [vi, en] = await Promise.all([loadRows(sql, 'cic_event'), loadRows(sql, 'cic_event_en')]);
    const mappings = [...createMappings('vi', vi), ...createMappings('en', en)];
    const oldViPaths = new Set<string>();
    for (const row of mappings.filter((entry) => entry.locale === 'vi' && entry.published)) {
      const path = `/events/${row.alias}`.toLowerCase();
      if (oldViPaths.has(path)) throw new Error(`Ambiguous Event redirect source: ${path}`);
      oldViPaths.add(path);
    }
    console.log(JSON.stringify({ mode: 'dry-run', before: { vi: vi.length, en: en.length }, mappings }, null, 2));
  } else {
    await sql.begin(async (tx) => {
      await tx.unsafe('LOCK TABLE public.cic_event, public.cic_event_en, public.cic_redirects IN ACCESS EXCLUSIVE MODE');
      const [vi, en] = await Promise.all([loadRows(tx as typeof sql, 'cic_event'), loadRows(tx as typeof sql, 'cic_event_en')]);
      const mappings = [...createMappings('vi', vi), ...createMappings('en', en)];
      const redirectSources = new Set<string>();
      for (const row of mappings.filter((entry) => entry.locale === 'vi' && entry.published)) {
        const sourcePath = `/events/${row.alias}`;
        const normalizedPath = sourcePath.toLowerCase();
        if (redirectSources.has(normalizedPath)) throw new Error(`Ambiguous Event redirect source: ${sourcePath}`);
        redirectSources.add(normalizedPath);
        const existing = await tx`SELECT id FROM cic_redirects WHERE lower(btrim(source_path)) = ${normalizedPath}`;
        if (existing.length) throw new Error(`Event redirect source already exists: ${sourcePath}`);
      }

      for (const row of mappings) {
        const table = row.locale === 'vi' ? 'cic_event' : 'cic_event_en';
        await tx`UPDATE ${tx(table)} SET alias = ${row.newAlias} WHERE id = ${row.id} AND alias = ${row.alias}`;
        if (row.locale === 'vi' && row.published) {
          await tx`
            INSERT INTO cic_redirects (source_path, target_path, status_code, source, is_active, note)
            VALUES (${`/events/${row.alias}`}, ${`/events/${row.newAlias}`}, 301, 'SEO-013 migration', true,
                    ${`Event ID ${row.id}: alias normalization`})
          `;
        }
      }

      const [afterVi, afterEn] = await Promise.all([loadRows(tx as typeof sql, 'cic_event'), loadRows(tx as typeof sql, 'cic_event_en')]);
      for (const [locale, before, after] of [['vi', vi, afterVi], ['en', en, afterEn]] as const) {
        if (before.length !== after.length || before.filter((r) => r.published).length !== after.filter((r) => r.published).length)
          throw new Error(`${locale} Event count or published state changed.`);
        if (after.some((r) => normalizeEventSlug(r.alias) !== r.alias))
          throw new Error(`${locale} invalid Event alias remains.`);
      }
      console.log(JSON.stringify({ mode: 'applied', count: mappings.length, mappings }, null, 2));
    });
  }
} finally {
  await sql.end();
}
