export type ProjectListItemViewModel = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  image: string | null;
  sector: string | null;
  solution: string | null;
  technologies: string[];
  customerName: string | null;
  location: string | null;
  startYear: number | null;
  endYear: number | null;
  isOngoing: boolean;
  isFeatured: boolean;
  timeDisplay: string;
};

export type ProjectRelationLink = {
  id: string | number;
  label: string;
  view: 'products' | 'services';
  subLabel?: string;
  image?: string;
};

export type ProjectDetailViewModel = ProjectListItemViewModel & {
  content: string | null;
  seoTitle: string | null;
  seoKeyword: string | null;
  seoDescription: string | null;
  relatedLinks: ProjectRelationLink[];
  relatedProjects: ProjectListItemViewModel[];
};

// Legacy compatibility
export type ProjectViewModel = ProjectListItemViewModel;
