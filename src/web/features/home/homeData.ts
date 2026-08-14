import {
  heroSlides,
  marqueeTexts,
  newsItems,
  partners,
  projects,
} from '../../data/mockData';
import {
  homeAwards,
  homeSolutionsList,
  homeStats,
  pastHomeEvents,
  upcomingHomeEvents,
} from '../../data/homeData';

/**
 * Public Home read model for the React mockup. The fixture imports stay private to
 * this boundary so a future Next.js page can replace them with server-side queries.
 */
export const getHomeData = () => ({
  heroSlides,
  projects,
  newsItems,
  partners,
  marqueeTexts,
  upcomingHomeEvents,
  pastHomeEvents,
  homeStats,
  homeAwards,
  homeSolutionsList,
});

export const getHomeAwards = () => homeAwards;

export const getHomePartners = () => partners;
