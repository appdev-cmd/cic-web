import type { TranslationDictionary } from '../../types';
import { enCommon } from './common';
import { enHeader } from './header';
import { enFooter } from './footer';
import { enHome } from './home';
import { enProducts } from './products';
import { enServices } from './services';
import { enProjects } from './projects';
import { enNews } from './news';
import { enContact } from './contact';
import { enAbout } from './about';
import { enLegal } from './legal';
import { enErrors } from './errors';
import { enSeo } from './seo';

export const enDictionary: TranslationDictionary = {
  locale: 'en',
  common: enCommon,
  header: enHeader,
  footer: enFooter,
  home: enHome,
  products: enProducts,
  services: enServices,
  projects: enProjects,
  news: enNews,
  contact: enContact,
  about: enAbout,
  legal: enLegal,
  errors: enErrors,
  seo: enSeo,
};
