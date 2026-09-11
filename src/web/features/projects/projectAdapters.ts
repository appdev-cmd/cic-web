import type { DetailedProject } from './projectsData';
import type { ProjectListItemViewModel, ProjectDetailViewModel } from '@/features/projects/types';

export function detailedProjectToListItem(p: DetailedProject): ProjectListItemViewModel {
  return {
    id: p.id,
    title: p.name,
    slug: p.id,
    tagline: p.tagline || null,
    summary: p.shortDesc || null,
    image: p.img || null,
    sector: p.sector || null,
    solution: p.solution || null,
    technologies: p.appliedSolutions || [],
    customerName: p.customer || null,
    location: p.location || null,
    startYear: null,
    endYear: null,
    isOngoing: false,
    isFeatured: Boolean(p.featured),
    timeDisplay: p.time || '',
  };
}

export function detailedProjectToDetail(
  p: DetailedProject,
  allProjects: DetailedProject[] = []
): ProjectDetailViewModel {
  const base = detailedProjectToListItem(p);
  const relatedProjects = allProjects
    .filter((item) => item.id !== p.id && item.sector === p.sector)
    .slice(0, 3)
    .map(detailedProjectToListItem);

  const fallbackRelated =
    relatedProjects.length < 3
      ? [
          ...relatedProjects,
          ...allProjects
            .filter((item) => item.id !== p.id && !relatedProjects.some((r) => r.id === item.id))
            .slice(0, 3 - relatedProjects.length)
            .map(detailedProjectToListItem),
        ]
      : relatedProjects;

  return {
    ...base,
    content: p.htmlContent || null,
    seoTitle: p.name,
    seoKeyword: null,
    seoDescription: p.shortDesc || null,
    relatedLinks: (p.appliedSolutions || []).map((tech, idx) => ({
      id: idx + 1,
      label: tech,
      view: 'products' as const,
      subLabel: 'Giải pháp ứng dụng',
    })),
    relatedProjects: fallbackRelated,
  };
}
