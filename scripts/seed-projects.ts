import { getPostgresClient } from '../src/server/db/postgres.ts';
import { projectsData } from '../src/web/data/projectsData.ts';

function parsePeriod(value: string) {
  const years = value.match(/\d{4}/g)?.map(Number) ?? [];
  return {
    start_year: years[0] ?? null,
    end_year: /hiện tại/i.test(value) ? null : (years[1] ?? years[0] ?? null),
    is_ongoing: /hiện tại/i.test(value),
  };
}

async function seed() {
  const sql = getPostgresClient();

  // Get active admin user for created_by / updated_by
  const [actor] = await sql`
    SELECT id FROM cic_users 
    WHERE account_status = 'active' 
    ORDER BY id ASC LIMIT 1
  `;
  const userId = actor ? Number(actor.id) : null;

  console.log(`Starting seed for ${projectsData.length} projects with user ID: ${userId}`);

  // Fetch available products and services for relational mapping
  const availableProducts = await sql`SELECT id FROM cic_products`;
  const productIdsSet = new Set(availableProducts.map((p: any) => Number(p.id)));

  const availableServices = await sql`SELECT id, alias FROM cic_services`;
  const serviceMap = new Map<string, number>();
  for (const s of availableServices) {
    serviceMap.set(String((s as any).alias).toLowerCase(), Number((s as any).id));
    serviceMap.set(String((s as any).id), Number((s as any).id));
  }

  for (let i = 0; i < projectsData.length; i++) {
    const item = projectsData[i];
    const period = parsePeriod(item.time);

    // Check if project exists by alias
    const [existing] = await sql`SELECT id FROM cic_projects WHERE alias = ${item.id}`;
    let projectId: number;

    if (existing) {
      projectId = Number(existing.id);
      await sql`
        UPDATE cic_projects SET
          title = ${item.name},
          tagline = ${item.tagline || null},
          summary = ${item.shortDesc || null},
          content = ${item.htmlContent || null},
          sector = ${item.sector || null},
          solution = ${item.solution || null},
          technologies = ${item.appliedSolutions || []},
          customer_name = ${item.customer || null},
          location = ${item.location || null},
          start_year = ${period.start_year},
          end_year = ${period.end_year},
          is_ongoing = ${period.is_ongoing},
          image = ${item.img || null},
          is_featured = ${item.featured},
          published = true,
          ordering = ${i + 1},
          seo_title = ${item.name},
          seo_description = ${item.shortDesc || null},
          updated_by = ${userId},
          updated_time = now()
        WHERE id = ${projectId}
      `;
      console.log(`Updated project: ${item.id} (ID: ${projectId})`);
    } else {
      const [inserted] = await sql`
        INSERT INTO cic_projects (
          title, alias, tagline, summary, content, sector, solution,
          technologies, customer_name, location, start_year, end_year,
          is_ongoing, image, is_featured, published, ordering,
          seo_title, seo_description, created_by, updated_by, created_time, updated_time
        ) VALUES (
          ${item.name}, ${item.id}, ${item.tagline || null}, ${item.shortDesc || null},
          ${item.htmlContent || null}, ${item.sector || null}, ${item.solution || null},
          ${item.appliedSolutions || []}, ${item.customer || null}, ${item.location || null},
          ${period.start_year}, ${period.end_year}, ${period.is_ongoing},
          ${item.img || null}, ${item.featured}, true, ${i + 1},
          ${item.name}, ${item.shortDesc || null}, ${userId}, ${userId}, now(), now()
        ) RETURNING id
      `;
      projectId = Number(inserted.id);
      console.log(`Inserted project: ${item.id} (ID: ${projectId})`);
    }

    // Sync product & service relations
    await sql`DELETE FROM cic_projects_products_rel WHERE project_id = ${projectId}`;
    await sql`DELETE FROM cic_projects_services_rel WHERE project_id = ${projectId}`;

    if (item.relatedLinks && item.relatedLinks.length > 0) {
      let prodOrder = 0;
      let srvOrder = 0;
      for (const link of item.relatedLinks) {
        if (link.view === 'products') {
          const numId = Number(link.id);
          if (productIdsSet.has(numId)) {
            await sql`
              INSERT INTO cic_projects_products_rel (project_id, product_id, ordering)
              VALUES (${projectId}, ${numId}, ${prodOrder++})
              ON CONFLICT (project_id, product_id) DO NOTHING
            `;
          }
        } else if (link.view === 'services') {
          const srvId = serviceMap.get(String(link.id).toLowerCase());
          if (srvId) {
            await sql`
              INSERT INTO cic_projects_services_rel (project_id, service_id, ordering)
              VALUES (${projectId}, ${srvId}, ${srvOrder++})
              ON CONFLICT (project_id, service_id) DO NOTHING
            `;
          }
        }
      }
    }
  }

  const [totalProjects] = await sql`SELECT count(*)::int as c FROM cic_projects`;
  console.log(`Finished seed. Total projects in DB: ${totalProjects.c}`);
  await sql.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
