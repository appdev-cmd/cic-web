export type ProjectViewModel = {
  id: string;
  title: string;
  slug: string;
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
};
