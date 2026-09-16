/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import type { HomePageModel, PageRenderPolicy } from '@shared/page-content/models';
import { productionRenderPolicy } from '@shared/page-content/models';
import { elementBindingRegistry, type ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import { getHomeData } from '../features/home/homeData';

import { HomeHeroSection, formatHeroHeading } from './home/HomeHeroSection';
import { HomeIntroSection } from './home/HomeIntroSection';
import { HomeStatsSection } from './home/HomeStatsSection';
import { HomeAwardsSection } from './home/HomeAwardsSection';
import { HomeEcosystemSection, type HomeEcosystemItem } from './HomeEcosystemSection';
import { HomeProjectsSection } from './home/HomeProjectsSection';
import { HomeEventsSection } from './home/HomeEventsSection';
import { HomeNewsSection } from './home/HomeNewsSection';
import { HomePartnersSection } from './home/HomePartnersSection';
import { HomeContactSection } from './home/HomeContactSection';

export { formatHeroHeading };

export interface HomeViewProps {
  content: HomePageModel;
  renderPolicy?: PageRenderPolicy;
  setCurrentView: (view: 'home' | 'products' | 'about' | 'services' | 'projects' | 'news' | 'events' | 'contact' | 'privacy' | 'terms' | 'search') => void;
  setActiveLink: (link: string) => void;
  setActiveServiceId: (id: string | null) => void;
  setActiveProjectId: (id: string | null) => void;
  setPreSelectedNewsCategory: (category: string | null) => void;
  setAboutSubTab: (tab: 'overview' | 'structure' | 'experience') => void;
  setActiveEventId?: (id: string | null) => void;
  setIsRegisteringEvent?: (isReg: boolean) => void;
  previewSlideIndex?: number;
  editMode?: boolean;
  bindingRegistry?: ElementBindingRegistry;
}

export const HomeView: React.FC<HomeViewProps> = ({
  content,
  renderPolicy = productionRenderPolicy,
  setCurrentView,
  setActiveLink,
  setActiveServiceId,
  setActiveProjectId,
  setPreSelectedNewsCategory,
  setAboutSubTab,
  setActiveEventId,
  setIsRegisteringEvent,
  previewSlideIndex,
  editMode = false,
  bindingRegistry = elementBindingRegistry,
}) => {
  const {
    heroSlides: defaultHeroSlides,
    newsItems: defaultNewsItems,
    partners: defaultPartners,
    marqueeTexts: defaultMarqueeTexts,
    upcomingHomeEvents: defaultUpcomingHomeEvents,
    pastHomeEvents: defaultPastHomeEvents,
    homeAwards: defaultHomeAwards,
  } = useMemo(getHomeData, []);

  const heroSlides = useMemo(() => {
    const rawList = (content.hero?.slides && content.hero.slides.length > 0) ? content.hero.slides : defaultHeroSlides;
    return rawList.map((slide, idx) => {
      const fallbackImg = defaultHeroSlides[idx % defaultHeroSlides.length]?.img || '/banner_hero/doi_tac_cong_nghe_chien_luoc.png';
      const img = typeof slide?.img === 'string' && slide.img.trim() ? slide.img.trim() : fallbackImg;
      return {
        ...slide,
        img,
      };
    });
  }, [content.hero?.slides, defaultHeroSlides]);

  const marqueeTexts = useMemo(() => {
    return (content.hero?.marqueeTexts && content.hero.marqueeTexts.length > 0)
      ? Array.from(content.hero.marqueeTexts)
      : defaultMarqueeTexts;
  }, [content.hero?.marqueeTexts, defaultMarqueeTexts]);

  const heroBadge = content.hero?.badge || 'Leading Innovation since 1990';
  const homeStats = content.stats.items;
  const homeAwards = (content.awards?.items && content.awards.items.length > 0) ? Array.from(content.awards.items) : defaultHomeAwards;
  const projects = Array.from(content.projects.items);
  const upcomingHomeEvents = (content.events?.upcomingEvents && content.events.upcomingEvents.length > 0)
    ? Array.from(content.events.upcomingEvents)
    : defaultUpcomingHomeEvents;
  const pastHomeEvents = (content.events?.pastEvents && content.events.pastEvents.length > 0)
    ? Array.from(content.events.pastEvents)
    : defaultPastHomeEvents;
  const newsItems = (content.news?.items && content.news.items.length > 0) ? Array.from(content.news.items) : defaultNewsItems;
  const partners = (content.partners?.items && content.partners.items.length > 0) ? Array.from(content.partners.items) : defaultPartners;
  const introData = content.intro;
  const contactCta = content.contactCta;

  return (
    <>
      <HomeHeroSection
        heroSlides={heroSlides}
        marqueeTexts={marqueeTexts}
        heroBadge={heroBadge}
        defaultHeroSlide={defaultHeroSlides[0]}
        previewSlideIndex={previewSlideIndex}
        editMode={editMode}
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
        setAboutSubTab={setAboutSubTab}
      />

      <HomeIntroSection
        introData={introData}
        editMode={editMode}
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
        setAboutSubTab={setAboutSubTab}
      />

      <HomeStatsSection
        homeStats={homeStats}
        renderPolicy={renderPolicy}
        bindingRegistry={bindingRegistry}
      />

      <HomeAwardsSection
        awards={homeAwards}
        title={content.awards?.title}
        subtitle={content.awards?.subtitle}
        editMode={editMode}
      />

      <HomeEcosystemSection
        editMode={editMode}
        items={[
          {
            id: 'ai-smart-tech',
            title: 'AI & Công nghệ thông minh',
            description: 'Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.',
            badge: 'Advanced Technology',
            image: heroSlides[2]?.img ?? heroSlides[1]?.img,
            view: 'products',
            activeLink: 'Sản phẩm',
          },
          {
            id: 'bim-digital-twins',
            title: 'BIM & Digital Twins',
            description: 'Đào tạo, tạo lập và thẩm tra mô hình BIM, số hóa công trình từ thiết kế đến vận hành.',
            badge: 'BIM & Digital Twins',
            image: projects[0]?.img ?? heroSlides[1]?.img,
            view: 'services',
            activeLink: 'Dịch vụ',
            serviceId: 'tu-van-bim',
          },
          {
            id: 'licensed-software',
            title: 'Phần mềm kỹ thuật bản quyền',
            description: 'Hệ sinh thái CAD, BIM, kết cấu, hạ tầng và năng lượng do CIC phát triển và phân phối.',
            badge: 'Phần mềm',
            image: heroSlides[3]?.img ?? heroSlides[1]?.img,
            view: 'products',
            activeLink: 'Sản phẩm',
          },
          {
            id: 'technology-equipment',
            title: 'Thiết bị công nghệ',
            description: 'Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR và GPR phục vụ ngành kỹ thuật.',
            badge: 'Thiết bị & IoT',
            image: projects.find((project) => project.type === 'equipment')?.img ?? heroSlides[1]?.img,
            view: 'products',
            activeLink: 'Sản phẩm',
          },
          {
            id: 'net-zero',
            title: 'Net Zero và phát triển bền vững',
            description: 'Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và xây dựng lộ trình Net Zero.',
            badge: 'Sustainability',
            image: newsItems.find((item) => item.category === 'specialty')?.img ?? heroSlides[1]?.img,
            view: 'services',
            activeLink: 'Dịch vụ',
            serviceId: 'tu-van-kiem-ke-khi-nha-kinh',
          },
          {
            id: 'consulting-training',
            title: 'Tư vấn & Đào tạo',
            description: 'Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.',
            badge: 'Tư vấn chuyên sâu',
            image: newsItems.find((item) => item.category === 'international')?.img ?? heroSlides[1]?.img,
            view: 'services',
            activeLink: 'Dịch vụ',
            serviceId: null,
          },
        ] satisfies readonly HomeEcosystemItem[]}
        onSelect={(item) => {
          setCurrentView(item.view);
          setActiveLink(item.activeLink);
          if (item.view === 'services' && setActiveServiceId) setActiveServiceId(item.serviceId ?? null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <HomeProjectsSection
        projects={projects}
        title={content.projects?.title}
        subtitle={content.projects?.subtitle}
        ctaLabel={content.projects?.ctaLabel}
        ctaUrl={content.projects?.ctaUrl}
        editMode={editMode}
        bindingRegistry={bindingRegistry}
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
        setActiveProjectId={setActiveProjectId}
      />

      <HomeEventsSection
        upcomingEvents={upcomingHomeEvents}
        pastEvents={pastHomeEvents}
        title={content.events?.title}
        subtitle={content.events?.subtitle}
        ctaLabel={content.events?.ctaLabel}
        ctaUrl={content.events?.ctaUrl}
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
        setActiveEventId={setActiveEventId}
        setIsRegisteringEvent={setIsRegisteringEvent}
      />

      <HomeNewsSection
        newsItems={newsItems}
        title={content.news?.title}
        subtitle={content.news?.subtitle}
        ctaLabel={content.news?.ctaLabel}
        ctaUrl={content.news?.ctaUrl}
        setCurrentView={setCurrentView}
        setActiveLink={setActiveLink}
        setPreSelectedNewsCategory={setPreSelectedNewsCategory}
      />

      <HomePartnersSection
        partners={partners}
        title={content.partners?.title}
        subtitle={content.partners?.subtitle}
        renderPolicy={renderPolicy}
      />

      <HomeContactSection
        contactCta={contactCta}
      />
    </>
  );
};
