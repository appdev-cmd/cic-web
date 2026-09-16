import 'server-only';
import type { Sql } from 'postgres';
import { getPostgresClient, withTransaction } from '@/server/db/postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type {
  CmsStaticPageListItem,
  CreateLegalPageInput,
  SaveDraftInput,
  StaticPageFullDetail,
  StaticPageRevisionDetail,
  StaticPageSectionItem,
} from '../types';
import { CUSTOM_LEGAL_PAGE_CONTRACT } from '../manifest';

const text = (v: unknown) => (typeof v === 'string' ? v : '');

/**
 * Lists static pages for CMS management.
 * Explicit projection joining draft and published revisions.
 */
export async function listCmsPages(workspace: 'vi' | 'en'): Promise<CmsStaticPageListItem[]> {
  const sql = getPostgresClient();
  const rows = await sql`
    SELECT
      p.id,
      p.workspace,
      p.code,
      p.name,
      p.slug,
      p.page_type,
      p.template_key,
      p.system_defined,
      p.updated_at,
      p.draft_revision_id,
      p.published_revision_id,
      d.version_number AS draft_version,
      d.created_at AS draft_updated_at,
      pub.version_number AS published_version,
      pub.published_at AS published_at,
      COALESCE(sec.section_count, 0)::int AS section_count
    FROM cic_content_pages p
    LEFT JOIN cic_content_page_revisions d ON d.id = p.draft_revision_id
    LEFT JOIN cic_content_page_revisions pub ON pub.id = p.published_revision_id
    LEFT JOIN (
      SELECT revision_id, count(*)::int AS section_count
      FROM cic_content_page_sections
      GROUP BY revision_id
    ) sec ON sec.revision_id = COALESCE(p.draft_revision_id, p.published_revision_id)
    WHERE p.workspace = ${workspace}
    ORDER BY p.system_defined DESC, p.id ASC
  `;

  return rows.map((r) => ({
    id: String(r.id),
    workspace: r.workspace as 'vi' | 'en',
    code: text(r.code),
    name: text(r.name),
    slug: text(r.slug),
    pageType: r.page_type,
    templateKey: r.template_key,
    systemDefined: Boolean(r.system_defined),
    updatedAt: new Date(r.updated_at).toISOString(),
    sectionCount: Number(r.section_count),
    draft: {
      revisionId: r.draft_revision_id ? String(r.draft_revision_id) : null,
      version: Number(r.draft_version ?? 1),
      updatedAt: r.draft_updated_at ? new Date(r.draft_updated_at).toISOString() : null,
      status: 'draft',
    },
    published: {
      revisionId: r.published_revision_id ? String(r.published_revision_id) : null,
      version: Number(r.published_version ?? 0),
      publishedAt: r.published_at ? new Date(r.published_at).toISOString() : null,
      status: 'published',
    },
  }));
}

/**
 * Loads full details for a revision including sections and ordered references.
 */
async function loadRevisionDetail(sql: Sql, revisionId: number): Promise<StaticPageRevisionDetail | null> {
  const [rev] = await sql`
    SELECT id, version_number, state, seo_title, seo_description, created_at, published_at
    FROM cic_content_page_revisions
    WHERE id = ${revisionId}
  `;
  if (!rev) return null;

  const sectionRows = await sql`
    SELECT id, section_key, section_type, position, config
    FROM cic_content_page_sections
    WHERE revision_id = ${revisionId}
    ORDER BY position ASC
  `;

  const sectionIds = sectionRows.map((s) => Number(s.id));
  const refRows = sectionIds.length > 0 ? await sql`
    SELECT id, section_id, entity_type, entity_id, position
    FROM cic_content_page_section_references
    WHERE section_id IN ${sql(sectionIds)}
    ORDER BY section_id, position ASC
  ` : [];

  const refsBySection = new Map<number, StaticPageSectionItem['references']>();
  for (const ref of refRows) {
    const sId = Number(ref.section_id);
    const list = refsBySection.get(sId) ?? [];
    list.push({
      id: String(ref.id),
      entityType: text(ref.entity_type),
      entityId: String(ref.entity_id),
      position: Number(ref.position),
    });
    refsBySection.set(sId, list);
  }

  const sections: StaticPageSectionItem[] = sectionRows.map((s) => ({
    id: String(s.id),
    sectionKey: text(s.section_key),
    sectionType: text(s.section_type),
    position: Number(s.position),
    config: (s.config ?? {}) as Record<string, unknown>,
    references: refsBySection.get(Number(s.id)) ?? [],
  }));

  return {
    id: String(rev.id),
    versionNumber: Number(rev.version_number),
    state: rev.state as 'draft' | 'published',
    seoTitle: text(rev.seo_title),
    seoDescription: text(rev.seo_description),
    createdAt: new Date(rev.created_at).toISOString(),
    publishedAt: rev.published_at ? new Date(rev.published_at).toISOString() : null,
    sections,
  };
}

/**
 * Loads full page detail for CMS editing.
 */
export async function getCmsPageDetail(pageId: string | number): Promise<StaticPageFullDetail | null> {
  const sql = getPostgresClient();
  const numericId = Number(pageId);
  const [page] = await sql`
    SELECT id, workspace, code, name, slug, page_type, template_key, system_defined, updated_at,
           draft_revision_id, published_revision_id
    FROM cic_content_pages
    WHERE id = ${numericId}
  `;
  if (!page) return null;

  const [draftRev, pubRev, historyRows] = await Promise.all([
    page.draft_revision_id ? loadRevisionDetail(sql, Number(page.draft_revision_id)) : null,
    page.published_revision_id ? loadRevisionDetail(sql, Number(page.published_revision_id)) : null,
    sql`
      SELECT id, version_number, state, published_at, created_at
      FROM cic_content_page_revisions
      WHERE page_id = ${numericId}
      ORDER BY version_number DESC
      LIMIT 20
    `,
  ]);

  if (!draftRev) return null;

  return {
    id: String(page.id),
    workspace: page.workspace as 'vi' | 'en',
    code: text(page.code),
    name: text(page.name),
    slug: text(page.slug),
    pageType: page.page_type,
    templateKey: page.template_key,
    systemDefined: Boolean(page.system_defined),
    updatedAt: new Date(page.updated_at).toISOString(),
    draft: draftRev,
    published: pubRev,
    history: historyRows.map((h) => ({
      id: String(h.id),
      versionNumber: Number(h.version_number),
      state: text(h.state),
      publishedAt: h.published_at ? new Date(h.published_at).toISOString() : null,
      createdAt: new Date(h.created_at).toISOString(),
    })),
  };
}

/**
 * Public website query: strictly loads the published revision.
 * Returns null if the page does not exist or has not been published.
 */
export async function getPublicPublishedPage(
  workspace: 'vi' | 'en',
  codeOrSlug: string
): Promise<(StaticPageRevisionDetail & { pageId: string; code: string; name: string; slug: string }) | null> {
  const sql = getPostgresClient();
  const normalizedSlug = codeOrSlug.startsWith('/') ? codeOrSlug : `/${codeOrSlug}`;
  const [page] = await sql`
    SELECT id, code, name, slug, published_revision_id
    FROM cic_content_pages
    WHERE workspace = ${workspace}
      AND (code = ${codeOrSlug} OR slug = ${codeOrSlug} OR slug = ${normalizedSlug})
      AND published_revision_id IS NOT NULL
    LIMIT 1
  `;
  if (!page || !page.published_revision_id) return null;

  const rev = await loadRevisionDetail(sql, Number(page.published_revision_id));
  if (!rev || rev.state !== 'published') return null;

  return {
    ...rev,
    pageId: String(page.id),
    code: text(page.code),
    name: text(page.name),
    slug: text(page.slug),
  };
}

/**
 * Saves page draft in a PostgreSQL transaction.
 */
export async function savePageDraftRecord(
  pageId: number,
  input: SaveDraftInput,
  actor: CmsPrincipal
): Promise<{ revisionId: string; versionNumber: number }> {
  return withTransaction(async (sql) => {
    const [page] = await sql`
      SELECT id, workspace, code, name, slug, draft_revision_id
      FROM cic_content_pages
      WHERE id = ${pageId}
      FOR UPDATE
    `;
    if (!page) throw new Error('Không tìm thấy trang.');

    // Check existing draft revision
    let targetRevId: number;
    let versionNum: number;

    const [existingDraft] = page.draft_revision_id
      ? await sql`
          SELECT id, version_number, state
          FROM cic_content_page_revisions
          WHERE id = ${Number(page.draft_revision_id)}
        `
      : [];

    if (existingDraft && existingDraft.state === 'draft') {
      targetRevId = Number(existingDraft.id);
      versionNum = Number(existingDraft.version_number);
      await sql`
        UPDATE cic_content_page_revisions
        SET seo_title = ${input.seo?.title ?? ''},
            seo_description = ${input.seo?.description ?? ''},
            created_at = now(),
            created_by = ${actor.legacyUserId}
        WHERE id = ${targetRevId}
      `;
    } else {
      // Create new draft revision
      const [{ max_version }] = await sql`
        SELECT COALESCE(MAX(version_number), 0)::int AS max_version
        FROM cic_content_page_revisions
        WHERE page_id = ${pageId}
      `;
      versionNum = Number(max_version) + 1;
      const [newRev] = await sql`
        INSERT INTO cic_content_page_revisions (
          page_id, version_number, state, seo_title, seo_description, created_by
        ) VALUES (
          ${pageId}, ${versionNum}, 'draft', ${input.seo?.title ?? ''}, ${input.seo?.description ?? ''}, ${actor.legacyUserId}
        ) RETURNING id
      `;
      targetRevId = Number(newRev.id);
    }

    // Replace sections for this revision
    await sql`DELETE FROM cic_content_page_sections WHERE revision_id = ${targetRevId}`;

    for (let i = 0; i < input.sections.length; i++) {
      const sec = input.sections[i];
      const position = sec.position > 0 ? sec.position : i + 1;
      const [secRow] = await sql`
        INSERT INTO cic_content_page_sections (
          revision_id, section_key, section_type, position, config
        ) VALUES (
          ${targetRevId}, ${sec.sectionKey}, ${sec.sectionType}, ${position}, ${sql.json((sec.config ?? {}) as never)}
        ) RETURNING id
      `;

      // Insert references if manual
      if (sec.references && sec.references.length > 0) {
        for (let j = 0; j < sec.references.length; j++) {
          const ref = sec.references[j];
          const refPos = ref.position && ref.position > 0 ? ref.position : j + 1;
          await sql`
            INSERT INTO cic_content_page_section_references (
              section_id, entity_type, entity_id, position
            ) VALUES (
              ${secRow.id}, ${ref.entityType}, ${Number(ref.entityId)}, ${refPos}
            )
          `;
        }
      }
    }

    // Update draft_revision_id on page
    await sql`
      UPDATE cic_content_pages
      SET draft_revision_id = ${targetRevId},
          updated_at = now(),
          updated_by = ${actor.legacyUserId}
      WHERE id = ${pageId}
    `;

    // Audit event
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.STATIC_PAGE_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.STATIC_PAGE,
        entityId: String(pageId),
        entityTitle: text(page.name),
        module: 'static_pages',
        workspace: page.workspace as 'vi' | 'en',
        result: 'success',
        after: {
          code: page.code,
          revisionId: targetRevId,
          versionNumber: versionNum,
          sectionsCount: input.sections.length,
        },
      },
      sql
    );

    return { revisionId: String(targetRevId), versionNumber: versionNum };
  });
}

/**
 * Publishes the active draft revision as a new immutable published snapshot.
 */
export async function publishPageRecord(
  pageId: number,
  actor: CmsPrincipal
): Promise<{ revisionId: string; versionNumber: number; slug: string }> {
  return withTransaction(async (sql) => {
    const [page] = await sql`
      SELECT id, workspace, code, name, slug, draft_revision_id, published_revision_id
      FROM cic_content_pages
      WHERE id = ${pageId}
      FOR UPDATE
    `;
    if (!page || !page.draft_revision_id) throw new Error('Không tìm thấy bản nháp để xuất bản.');

    const draftRevId = Number(page.draft_revision_id);
    const [draftRev] = await sql`
      SELECT id, seo_title, seo_description
      FROM cic_content_page_revisions
      WHERE id = ${draftRevId}
    `;
    if (!draftRev) throw new Error('Bản nháp không hợp lệ.');

    const draftSections = await sql`
      SELECT id, section_key, section_type, position, config
      FROM cic_content_page_sections
      WHERE revision_id = ${draftRevId}
      ORDER BY position ASC
    `;

    const draftSectionIds = draftSections.map((s) => Number(s.id));
    const draftRefs = draftSectionIds.length > 0 ? await sql`
      SELECT section_id, entity_type, entity_id, position
      FROM cic_content_page_section_references
      WHERE section_id IN ${sql(draftSectionIds)}
      ORDER BY position ASC
    ` : [];

    // Create a new version for the published snapshot
    const [{ max_version }] = await sql`
      SELECT COALESCE(MAX(version_number), 0)::int AS max_version
      FROM cic_content_page_revisions
      WHERE page_id = ${pageId}
    `;
    const newVersionNumber = Number(max_version) + 1;

    const [publishedRev] = await sql`
      INSERT INTO cic_content_page_revisions (
        page_id, version_number, state, seo_title, seo_description, created_by, published_at, published_by
      ) VALUES (
        ${pageId}, ${newVersionNumber}, 'published', ${draftRev.seo_title}, ${draftRev.seo_description},
        ${actor.legacyUserId}, now(), ${actor.legacyUserId}
      ) RETURNING id
    `;
    const newRevId = Number(publishedRev.id);

    // Copy sections and references
    for (const sec of draftSections) {
      const [newSec] = await sql`
        INSERT INTO cic_content_page_sections (
          revision_id, section_key, section_type, position, config
        ) VALUES (
          ${newRevId}, ${sec.section_key}, ${sec.section_type}, ${sec.position}, ${sql.json((sec.config ?? {}) as never)}
        ) RETURNING id
      `;

      const matchingRefs = draftRefs.filter((r) => Number(r.section_id) === Number(sec.id));
      for (const ref of matchingRefs) {
        await sql`
          INSERT INTO cic_content_page_section_references (
            section_id, entity_type, entity_id, position
          ) VALUES (
            ${newSec.id}, ${ref.entity_type}, ${Number(ref.entity_id)}, ${ref.position}
          )
        `;
      }
    }

    // Update published_revision_id on page
    await sql`
      UPDATE cic_content_pages
      SET published_revision_id = ${newRevId},
          updated_at = now(),
          updated_by = ${actor.legacyUserId}
      WHERE id = ${pageId}
    `;

    // Audit event
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.STATIC_PAGE_STATUS_CHANGED,
        entityType: AUDIT_ENTITY_TYPES.STATIC_PAGE,
        entityId: String(pageId),
        entityTitle: text(page.name),
        module: 'static_pages',
        workspace: page.workspace as 'vi' | 'en',
        result: 'success',
        after: {
          code: page.code,
          publishedRevisionId: newRevId,
          versionNumber: newVersionNumber,
          publishedAt: new Date().toISOString(),
        },
      },
      sql
    );

    return { revisionId: String(newRevId), versionNumber: newVersionNumber, slug: text(page.slug) };
  });
}

/**
 * Creates a custom legal page (template locked to legal_standard).
 */
export async function createLegalPageRecord(
  input: CreateLegalPageInput,
  actor: CmsPrincipal
): Promise<{ id: string; code: string; slug: string }> {
  return withTransaction(async (sql) => {
    const slug = input.slug.startsWith('/') ? input.slug : `/${input.slug}`;
    if (!CUSTOM_LEGAL_PAGE_CONTRACT.slugPolicy.pattern.test(slug)) {
      throw new Error('Đường dẫn không hợp lệ. Chỉ chấp nhận chữ thường không dấu, số và dấu gạch ngang.');
    }

    if (CUSTOM_LEGAL_PAGE_CONTRACT.slugPolicy.reservedSlugs.includes(slug)) {
      throw new Error(`Đường dẫn '${slug}' thuộc danh sách đường dẫn hệ thống được bảo vệ.`);
    }

    const [existingSlug] = await sql`
      SELECT id FROM cic_content_pages
      WHERE workspace = ${input.workspace} AND slug = ${slug}
      LIMIT 1
    `;
    if (existingSlug) throw new Error('Đường dẫn này đã được sử dụng.');

    const slugClean = slug.replace(/^\//, '').replace(/-/g, '_');
    const code = `content_${slugClean.slice(0, 80)}`;

    const [pageRow] = await sql`
      INSERT INTO cic_content_pages (
        workspace, code, name, slug, page_type, template_key, system_defined, created_by, updated_by
      ) VALUES (
        ${input.workspace}, ${code}, ${input.name.trim()}, ${slug}, 'legal', 'legal_standard', false,
        ${actor.legacyUserId}, ${actor.legacyUserId}
      ) RETURNING id
    `;
    const pageId = Number(pageRow.id);

    // Initial draft revision
    const [revRow] = await sql`
      INSERT INTO cic_content_page_revisions (
        page_id, version_number, state, seo_title, seo_description, created_by
      ) VALUES (
        ${pageId}, 1, 'draft', ${input.name.trim()}, '', ${actor.legacyUserId}
      ) RETURNING id
    `;
    const revId = Number(revRow.id);

    // Initial 2 legal sections
    await sql`
      INSERT INTO cic_content_page_sections (revision_id, section_key, section_type, position, config)
      VALUES
        (${revId}, 'legal.header', 'rich_text_header', 1, ${sql.json({ richTextHtml: `<h1>${input.name.trim()}</h1>` } as never)}),
        (${revId}, 'legal.content', 'rich_text', 2, ${sql.json({ richTextHtml: '<p>Nhập nội dung văn bản tại đây.</p>' } as never)})
    `;

    // Update draft pointer
    await sql`
      UPDATE cic_content_pages
      SET draft_revision_id = ${revId}
      WHERE id = ${pageId}
    `;

    // Audit event
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.STATIC_PAGE_CREATED,
        entityType: AUDIT_ENTITY_TYPES.STATIC_PAGE,
        entityId: String(pageId),
        entityTitle: input.name.trim(),
        module: 'static_pages',
        workspace: input.workspace,
        result: 'success',
        after: {
          code,
          slug,
          templateKey: 'legal_standard',
        },
      },
      sql
    );

    return { id: String(pageId), code, slug };
  });
}
