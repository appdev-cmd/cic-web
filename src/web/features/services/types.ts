export interface ServiceDetail {
  id: string;
  title: string;
  tagline?: string;
  shortDesc: string;
  /** Presentation grouping used by the current mockup; not a Service DB relation. */
  category: string;
  image: string;
  htmlContent: string;
  relatedProductIds?: number[];
  whyNeedTitle?: string;
  whyNeed?: string[];
  scopeTitle?: string;
  scope?: { title: string; desc?: string; list?: string[]; img?: string }[];
  process?: { step: string; title: string; desc: string }[];
  benefits?: string[];
  media?: {
    type?: 'image' | 'text_block';
    url?: string;
    title?: string;
    content?: string;
    caption?: string;
  }[];
  stateCollaboration?: {
    title: string;
    items: { title: string; desc: string; img?: string }[];
  };
  intlCollaboration?: { title: string; desc: string; img?: string };
}
