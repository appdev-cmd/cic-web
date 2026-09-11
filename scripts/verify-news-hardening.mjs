import assert from 'node:assert/strict';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is missing');
const sql = postgres(url, { ssl: 'require', max: 1 });

try {
  console.log('=== 1. VERIFYING PLACEMENT COUNTS ===');
  const counts = await sql.unsafe(`
    SELECT 'vi' as locale,
           count(*) as total,
           count(*) FILTER (WHERE published IS TRUE) as published,
           count(*) FILTER (WHERE is_hot IS TRUE) as hot,
           count(*) FILTER (WHERE show_in_homepage IS TRUE) as home
    FROM public.cic_news
    UNION ALL
    SELECT 'en',
           count(*),
           count(*) FILTER (WHERE published IS TRUE),
           count(*) FILTER (WHERE is_hot IS TRUE),
           count(*) FILTER (WHERE show_in_homepage IS TRUE)
    FROM public.cic_news_en
  `);
  console.log(counts);

  const viRow = counts.find(r => r.locale === 'vi');
  const enRow = counts.find(r => r.locale === 'en');

  assert.equal(viRow.total, '1553');
  assert.equal(viRow.published, '1521');
  assert.equal(viRow.hot, '4');
  assert.equal(viRow.home, '4');

  assert.equal(enRow.total, '300');
  assert.equal(enRow.published, '300');
  assert.equal(enRow.hot, '4');
  assert.equal(enRow.home, '4');
  console.log('✅ Placement counts exactly 4 for all groups!');

  console.log('\n=== 2. VERIFYING TOP 4 KEPT ARTICLES MATCH PURE DATE RANKING ===');
  const expectedViHot = [1719, 1718, 1717, 1716];
  const actualViHot = (await sql.unsafe(`SELECT id, title, coalesce(start_time, created_time, updated_time) as d FROM public.cic_news WHERE is_hot IS TRUE ORDER BY d DESC, id DESC`)).map(r => r.id);
  assert.deepEqual(actualViHot, expectedViHot, 'VI Hot does not match expected TOP 4');

  const expectedViHome = [1719, 1718, 1717, 1716];
  const actualViHome = (await sql.unsafe(`SELECT id, title, coalesce(start_time, created_time, updated_time) as d FROM public.cic_news WHERE show_in_homepage IS TRUE ORDER BY d DESC, id DESC`)).map(r => r.id);
  assert.deepEqual(actualViHome, expectedViHome, 'VI Home does not match expected TOP 4');

  const expectedEnHot = [347, 346, 345, 344];
  const actualEnHot = (await sql.unsafe(`SELECT id, title, coalesce(start_time, created_time, updated_time) as d FROM public.cic_news_en WHERE is_hot IS TRUE ORDER BY d DESC, id DESC`)).map(r => r.id);
  assert.deepEqual(actualEnHot, expectedEnHot, 'EN Hot does not match expected TOP 4');

  const expectedEnHome = [347, 346, 345, 344];
  const actualEnHome = (await sql.unsafe(`SELECT id, title, coalesce(start_time, created_time, updated_time) as d FROM public.cic_news_en WHERE show_in_homepage IS TRUE ORDER BY d DESC, id DESC`)).map(r => r.id);
  assert.deepEqual(actualEnHome, expectedEnHome, 'EN Home does not match expected TOP 4');
  console.log('✅ All 4 groups match expected TOP 4 pure date ranking!');

  console.log('\n=== 3. VERIFYING SEQUENCES SYNCED ===');
  const [viSeqInfo] = await sql.unsafe("SELECT pg_get_serial_sequence('public.cic_news', 'id') as seq, max(id) as max_id FROM public.cic_news");
  const [enSeqInfo] = await sql.unsafe("SELECT pg_get_serial_sequence('public.cic_news_en', 'id') as seq, max(id) as max_id FROM public.cic_news_en");
  const [viSeqVal] = await sql.unsafe(`SELECT last_value FROM ${viSeqInfo.seq}`);
  const [enSeqVal] = await sql.unsafe(`SELECT last_value FROM ${enSeqInfo.seq}`);

  console.log('VI seq:', viSeqInfo.seq, 'last_value:', viSeqVal.last_value, 'max_id:', viSeqInfo.max_id);
  console.log('EN seq:', enSeqInfo.seq, 'last_value:', enSeqVal.last_value, 'max_id:', enSeqInfo.max_id);

  assert.ok(Number(viSeqVal.last_value) >= Number(viSeqInfo.max_id));
  assert.ok(Number(enSeqVal.last_value) >= Number(enSeqInfo.max_id));
  console.log('✅ Sequences properly synced to MAX(id)!');

  console.log('\n=== 4. VERIFYING TRIGGER SAFETY NET (AT MOST 4 ENFORCEMENT) ===');
  let viTriggerBlocked = false;
  try {
    // Pick an article not currently hot
    await sql.unsafe('UPDATE public.cic_news SET is_hot = true WHERE id = 15');
  } catch (err) {
    if (err.message.includes('supports at most 4 Hot News articles')) {
      viTriggerBlocked = true;
    } else {
      throw err;
    }
  }
  assert.ok(viTriggerBlocked, 'Trigger failed to block 5th VI hot news article');

  let enTriggerBlocked = false;
  try {
    await sql.unsafe('UPDATE public.cic_news_en SET show_in_homepage = true WHERE id = 15');
  } catch (err) {
    if (err.message.includes('supports at most 4 Home News articles')) {
      enTriggerBlocked = true;
    } else {
      throw err;
    }
  }
  assert.ok(enTriggerBlocked, 'Trigger failed to block 5th EN home news article');
  console.log('✅ Trigger successfully blocked attempt to add a 5th placement item!');

  console.log('\n=== 5. VERIFYING ALIAS INTEGRITY ===');
  const [viDups] = await sql.unsafe("SELECT count(*) as c FROM cic_news WHERE alias ~ ('-' || id::text || '$') AND id IN (82, 178, 150, 190, 222, 314, 1144, 1132, 1141, 1142)");
  const [enDups] = await sql.unsafe("SELECT count(*) as c FROM cic_news_en WHERE alias ~ ('-' || id::text || '$') AND id IN (82, 178, 150, 190)");
  assert.equal(Number(viDups.c), 0, 'VI aliases unexpectedly modified with -id suffix');
  assert.equal(Number(enDups.c), 0, 'EN aliases unexpectedly modified with -id suffix');
  console.log('✅ Aliases UNCHANGED! No forced unique renaming or -{id} suffixing.');

  console.log('\n🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED!');
} finally {
  await sql.end();
}
