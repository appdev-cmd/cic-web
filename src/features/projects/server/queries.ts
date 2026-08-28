import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { ProjectViewModel } from '../types';

type ProjectRow = {
  id: number | string; title: string; alias: string; summary: string | null;
  image: string | null; sector: string | null; solution: string | null;
  technologies: string[] | null; customer_name: string | null; location: string | null;
  start_year: number | null; end_year: number | null; is_ongoing: boolean;
  is_featured: boolean;
};

export function mapProject(row: ProjectRow): ProjectViewModel {
  return { id: String(row.id), title: row.title, slug: row.alias, summary: row.summary, image: row.image, sector: row.sector, solution: row.solution, technologies: row.technologies ?? [], customerName: row.customer_name, location: row.location, startYear: row.start_year, endYear: row.end_year, isOngoing: row.is_ongoing, isFeatured: row.is_featured };
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectViewModel | null> {
  const client = await getDatabaseClient();
  const { data, error } = await client.from('cic_projects').select('id,title,alias,summary,image,sector,solution,technologies,customer_name,location,start_year,end_year,is_ongoing,is_featured').eq('published', true).eq('alias', slug).maybeSingle();
  if (error) throw new Error('Unable to load project.');
  return data ? mapProject(data as unknown as ProjectRow) : null;
}

export async function listPublishedProjects(): Promise<ProjectViewModel[]> {
  const client = await getDatabaseClient();
  const { data, error } = await client.from('cic_projects').select('id,title,alias,summary,image,sector,solution,technologies,customer_name,location,start_year,end_year,is_ongoing,is_featured').eq('published', true).order('ordering', { ascending: true }).order('id', { ascending: true });
  if (error) throw new Error('Unable to load projects.');
  return ((data ?? []) as unknown as ProjectRow[]).map(mapProject);
}
