import type { TranslationDictionary } from '../../types';
import { viCommon } from './common';
import { viHeader } from './header';
import { viFooter } from './footer';
import { viHome } from './home';
import { viProducts } from './products';
import { viServices } from './services';
import { viProjects } from './projects';
import { viNews } from './news';
import { viContact } from './contact';
import { viAbout } from './about';
import { viLegal } from './legal';
import { viErrors } from './errors';
import { viSeo } from './seo';

export const viDictionary: TranslationDictionary = {
  locale: 'vi',
  common: viCommon,
  header: viHeader,
  footer: viFooter,
  home: viHome,
  products: viProducts,
  services: viServices,
  projects: viProjects,
  news: viNews,
  contact: viContact,
  about: viAbout,
  legal: viLegal,
  errors: viErrors,
  seo: viSeo,
};
