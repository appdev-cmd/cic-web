import type { CmsLocale } from '../../data/CmsDataSource';
import { getProjectsData } from '../../../web/features/projects/projectsData';
import type { CmsProject, ProjectsModuleData } from './types';

const parsePeriod = (value: string) => {
  const years = value.match(/\d{4}/g)?.map(Number) ?? [];
  return {
    start_year: years[0] ?? null,
    end_year: /hiện tại/i.test(value) ? null : years[1] ?? years[0] ?? null,
    is_ongoing: /hiện tại/i.test(value),
  };
};

const toCmsProject = (project: ReturnType<typeof getProjectsData>[number], ordering: number): CmsProject => {
  const period = parsePeriod(project.time);
  return {
    id: project.id,
    title: project.name,
    alias: project.id,
    tagline: project.tagline,
    summary: project.shortDesc,
    content: project.htmlContent ?? '',
    sector: project.sector,
    solution: project.solution,
    customer_name: project.customer,
    location: project.location,
    ...period,
    image: project.img,
    gallery: project.gallery,
    video_title: project.video?.title ?? '',
    video_url: project.video?.embedUrl ?? '',
    video_thumbnail: project.video?.thumbnail ?? '',
    document_title: project.pdf?.title ?? '',
    document_url: project.pdf?.url ?? '',
    document_size: project.pdf?.size ?? '',
    products_related: project.relatedLinks?.filter((item) => item.view === 'products').map((item) => String(item.id)) ?? [],
    services_related: project.relatedLinks?.filter((item) => item.view === 'services').map((item) => String(item.id)) ?? [],
    is_featured: project.featured,
    published: true,
    ordering,
    seo_title: project.name,
    seo_keyword: '',
    seo_description: project.shortDesc,
    created_time: '2026-01-01 08:00:00',
    updated_time: '2026-01-01 08:00:00',
  };
};

export const getCmsProjectsData = (locale: CmsLocale): ProjectsModuleData => ({
  projects: locale === 'vi' ? getProjectsData().map((project, index) => toCmsProject(project, index + 1)) : [],
});
