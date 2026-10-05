/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { getHomeAwards, getHomePartners } from '../features/home/homeData';
import type { AboutCapacityModel, AboutPageModel, PageRenderPolicy } from '@shared/page-content/models';
import { productionRenderPolicy } from '@shared/page-content/models';
import { getLegacyAboutCapacityContent, getLegacyAboutPageContent } from '@shared/page-content/legacyPageContent';
import { elementBindingRegistry, type ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import type { StoredPartnerMapLayout } from './CountryPartnerNetwork';
import {
  AboutHeroBanner,
  AboutOverviewTab,
  AboutStructureTab,
  AboutExperienceTab,
  type AboutTabKey,
} from './about';

export interface AboutViewProps {
  activeTab: AboutTabKey;
  setActiveTab: (tab: AboutTabKey) => void;
  onNavigateToContact?: () => void;
  capacityContent?: AboutCapacityModel;
  aboutContent?: AboutPageModel;
  renderPolicy?: PageRenderPolicy;
  bindingRegistry?: ElementBindingRegistry;
  pageSections?: readonly {
    id?: string;
    sectionKey: string;
    config: Record<string, unknown>;
    references?: readonly { entityType: string; entityIds: readonly string[] }[];
  }[];
  resolveMediaUrl?: (id: string) => string;
  editMode?: boolean;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: any) => void;
}

export const AboutView = ({
  activeTab,
  setActiveTab,
  capacityContent = getLegacyAboutCapacityContent(),
  aboutContent = getLegacyAboutPageContent(),
  renderPolicy = productionRenderPolicy,
  bindingRegistry = elementBindingRegistry,
  pageSections,
  resolveMediaUrl = (id) => id,
  editMode = false,
  onConfigValueChange,
}: AboutViewProps) => {
  const homeAwards = useMemo(getHomeAwards, []);
  const partners = useMemo(getHomePartners, []);

  const configFor = (sectionKey: string) =>
    pageSections?.find((section) => section.sectionKey === sectionKey)?.config ?? {};

  const heroConfig = configFor('about.hero');
  const overviewConfig = configFor('about.overview');
  const timelineConfig = configFor('about.timeline');
  const strategyConfig = configFor('about.strategy');
  const offeringsConfig = configFor('about.offerings');
  const awardsConfig = configFor('about.awards');
  const partnersConfig = configFor('about.partners');
  const orgConfig = configFor('about.organization');
  const capacityConfig = configFor('about.capacity');
  const experienceConfig = configFor('about.experience');
  const ctaConfig = configFor('about.contact_cta');

  const targetMapSection =
    pageSections?.find((section) => section.sectionKey === 'about.experience') ??
    pageSections?.find((section) => section.sectionKey === 'about.capacity');
  const savedMapLayout = (experienceConfig.partnerMapLayout ??
    capacityConfig.partnerMapLayout) as StoredPartnerMapLayout | undefined;

  const [localTab, setLocalTab] = useState<AboutTabKey>(activeTab);
  useEffect(() => {
    setLocalTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: AboutTabKey) => {
    setLocalTab(tab);
    setActiveTab(tab);
  };

  // Overview Data Resolvers
  const overviewParagraphs = Array.isArray(overviewConfig.paragraphs) ? overviewConfig.paragraphs : [];
  const defaultOverviewParagraphs = [
    'Công ty Cổ phần Công nghệ và Tư vấn CIC tiền thân là Trung tâm tin học thuộc Bộ Xây dựng thành lập vào ngày 27/11/1990, bắt đầu hoạt động với chức năng là cơ quan tham mưu tin học thuộc Bộ Xây dựng nhằm phục vụ yêu cầu ứng dụng và phát triển Công nghệ thông tin trong ngành.',
    'Hiện nay, chúng tôi là thành viên của VC Group, tổ hợp hàng đầu về tư vấn xây dựng, thiết bị và công nghệ tại Việt Nam.',
    'Sau hơn 35 năm phát triển, CIC đã xây dựng được đội ngũ quản lý vững vàng cùng tập thể nhân viên có trình độ chuyên môn cao, sáng tạo và tận tâm; cung cấp sản phẩm phần mềm, thiết bị và dịch vụ công nghệ có tính ứng dụng cao cho ngành Xây dựng.',
  ];
  const displayedOverviewParagraphs =
    overviewParagraphs.length > 0 ? overviewParagraphs.map(String) : defaultOverviewParagraphs;

  const defaultOfferingsItems = [
    { title: 'Phát triển phần mềm xây dựng', desc: 'Phát triển các phần mềm chuyên ngành xây dựng, quản lý, quy hoạch làm nên thương hiệu CIC (KPW, Escon, RDW, VinaSAS…) và enjiCAD – phần mềm vẽ kỹ thuật chất lượng cao, giá cạnh tranh hơn nhiều so với CAD ngoại nhập.' },
    { title: 'Phân phối phần mềm nhập khẩu chính hãng', desc: 'Phân phối phần mềm bản quyền từ các hãng công nghệ hàng đầu thế giới như Microsoft, Autodesk, CSI, Cubicost, ANSYS, Bentley, DHI, Hexagon, DNV GL, Prokon, Risa…' },
    { title: 'Thiết bị công nghệ', desc: 'Phân phối các thiết bị công nghệ hàm lượng khoa học cao từ những hãng uy tín thế giới như Piletest, Tecknotrove, ZXLidars, A.P. van den Berg, AQ System, Sewer Robotics, Radiodetection, Pearpoint, DJI…' },
    { title: 'Tư vấn Xây dựng', desc: 'Tư vấn thiết kế, thẩm tra, giám sát, quản lý dự án công trình xây dựng, đảm bảo chất lượng và an toàn.' },
    { title: 'BIM & Digital Twins', desc: 'Đồng hành chuyển đổi số, triển khai BIM chuyên sâu, xây dựng bản sao số (Digital Twins) cho công trình.' },
    { title: 'Giải pháp Công nghệ thông minh', desc: 'Cung cấp và tư vấn ứng dụng các giải pháp công nghệ thông minh, AI, Big Data, IoT vào quản lý vận hành.' },
    { title: 'Giải pháp phát triển bền vững', desc: 'Tư vấn phát triển bền vững, Net Zero, EPD, ESG cho các doanh nghiệp xây dựng hướng tới tương lai xanh.' },
  ];
  const displayedOfferingsItems =
    Array.isArray(offeringsConfig.items) && offeringsConfig.items.length > 0
      ? (offeringsConfig.items as Array<Record<string, unknown>>).map((it, idx) => ({
          title: typeof it?.title === 'string' ? it.title : (defaultOfferingsItems[idx]?.title ?? ''),
          desc: typeof it?.desc === 'string' ? it.desc : (typeof it?.description === 'string' ? it.description : (defaultOfferingsItems[idx]?.desc ?? '')),
        }))
      : defaultOfferingsItems;

  const defaultGalleryImages = [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80',
  ];
  const displayedGalleryImages =
    Array.isArray(partnersConfig.galleryImages) && partnersConfig.galleryImages.length === 4
      ? partnersConfig.galleryImages.map(String)
      : defaultGalleryImages;

  const defaultMilestones = aboutContent?.timeline?.milestones || [];
  const timelineMilestones = Array.isArray(timelineConfig.milestones)
    ? (timelineConfig.milestones as Array<{ id?: string; year?: string; description?: string; title?: string } | null | undefined>)
    : [];
  const displayedMilestones = useMemo(() => {
    if (timelineMilestones.length === 0) return defaultMilestones;
    const validConfigItems = timelineMilestones.filter((m): m is { id?: string; year?: string; description?: string; title?: string } => m != null && typeof m === 'object');
    if (validConfigItems.length === 0) return defaultMilestones;
    return validConfigItems.map((item, idx) => {
      const fallback = defaultMilestones[idx];
      return {
        id: item.id || fallback?.id || `ms-${idx}`,
        year: item.year !== undefined && item.year !== null && String(item.year).trim() !== '' ? String(item.year) : (fallback?.year ?? ''),
        description: item.description !== undefined && item.description !== null && String(item.description).trim() !== '' ? String(item.description) : (fallback?.description ?? ''),
        title: item.title || (fallback as { title?: string })?.title || '',
      };
    });
  }, [timelineMilestones, defaultMilestones]);

  const defaultCoreValues = aboutContent?.strategy?.coreValues || [];
  const strategyCoreValues = Array.isArray(strategyConfig.coreValues)
    ? (strategyConfig.coreValues as Array<{ id?: string; value?: string } | string | null | undefined>)
    : [];
  const displayedCoreValues = useMemo(() => {
    if (strategyCoreValues.length === 0) return defaultCoreValues;
    const valid = strategyCoreValues.filter((it): it is { id?: string; value?: string } | string => it != null && (typeof it === 'string' || typeof it === 'object'));
    return valid.length > 0 ? valid : defaultCoreValues;
  }, [strategyCoreValues, defaultCoreValues]);

  const displayedPartners = useMemo(() => {
    const syncWithHome = partnersConfig.syncWithHome !== false;
    if (syncWithHome) {
      return partners.map((partner, index) => ({ ...partner, entityId: `legacy-partner-${index + 1}`, link: '' }));
    }
    const items = Array.isArray(partnersConfig.items) ? partnersConfig.items : [];
    if (!items.length) {
      return partners.map((partner, index) => ({ ...partner, entityId: `legacy-partner-${index + 1}`, link: '' }));
    }
    return items.flatMap((item, index) =>
      item && typeof item === 'object' && !Array.isArray(item)
        ? [{
            entityId: typeof item.id === 'string' ? item.id : `partner-${index + 1}`,
            name: typeof item.name === 'string' ? item.name : '',
            logo: typeof item.imageId === 'string' ? resolveMediaUrl(item.imageId) : (typeof item.logo === 'string' ? item.logo : ''),
            link: typeof item.link === 'string' ? item.link : '',
          }]
        : []
    );
  }, [partners, partnersConfig.items, partnersConfig.syncWithHome, resolveMediaUrl]);

  const displayedAwards = useMemo(() => {
    const syncWithHome = awardsConfig.syncWithHome !== false;
    if (syncWithHome) return homeAwards;
    const items = Array.isArray(awardsConfig.items) ? awardsConfig.items : [];
    if (!items.length) return homeAwards;
    return items.flatMap((item) =>
      item && typeof item === 'object' && !Array.isArray(item) && typeof item.name === 'string'
        ? [{ name: item.name, img: resolveMediaUrl((item.imageId || item.img || '') as string) }]
        : []
    );
  }, [awardsConfig.items, awardsConfig.syncWithHome, homeAwards, resolveMediaUrl]);

  // Experience Data Resolvers
  const defaultExperienceItems = [
    {
      title: 'Phát triển nguồn nhân lực chất lượng cao',
      description: 'Chú trọng đào tạo, phát triển nguồn nhân sự chất lượng cao, thu hút nhân sự trẻ, chất lượng, nhiệt huyết và sẵn sàng học hỏi, tiếp cận công nghệ mới.',
      imageId: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    },
    {
      title: 'Đối tác chiến lược với các hãng công nghệ danh tiếng',
      description: 'Hợp tác sâu rộng với hơn 100 hãng công nghệ, sản xuất phần mềm, thiết bị danh tiếng trên thế giới. Là partner chính thức tại Việt Nam.',
      imageId: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80',
    },
    {
      title: 'Cập nhật xu hướng công nghệ hàng đầu',
      description: 'Đa dạng sản phẩm, dịch vụ về các giải pháp phần mềm, khoa học công nghệ hàng đầu trong các ngành kỹ thuật.',
      imageId: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    },
  ];
  const displayedExperienceItems =
    Array.isArray(experienceConfig.items) && experienceConfig.items.length > 0
      ? (experienceConfig.items as Array<Record<string, unknown>>)
          .filter((it) => it != null && typeof it === 'object')
          .map((it, idx) => ({
            title: typeof it?.title === 'string' ? it.title : (defaultExperienceItems[idx]?.title ?? ''),
            description: typeof it?.description === 'string' ? it.description : (typeof it?.desc === 'string' ? it.desc : (defaultExperienceItems[idx]?.description ?? '')),
            imageId: typeof it?.imageId === 'string' ? it.imageId : (defaultExperienceItems[idx]?.imageId ?? ''),
          }))
      : defaultExperienceItems;

  const defaultMetrics = capacityContent?.metrics || [];
  const capacityMetrics = Array.isArray(capacityConfig.metrics)
    ? (capacityConfig.metrics as Array<{ id?: string; value?: string; label?: string } | null | undefined>)
    : [];
  const displayedMetrics = useMemo(() => {
    if (capacityMetrics.length === 0) return defaultMetrics;
    return capacityMetrics
      .filter((it): it is NonNullable<typeof it> => it != null && typeof it === 'object')
      .map((it) => ({
        id: it.id,
        value: typeof it.value === 'string' ? it.value : (it.value != null ? String(it.value) : ''),
        label: typeof it.label === 'string' ? it.label : (it.label != null ? String(it.label) : ''),
      }))
      .filter((it) => it.value.length > 0 || it.label.length > 0);
  }, [capacityMetrics, defaultMetrics]);

  return (
    <div className="bg-transparent min-h-screen relative pt-0">
      {/* Visual Top Hero Banner */}
      <AboutHeroBanner
        heroConfig={heroConfig}
        activeTab={localTab}
        onTabChange={handleTabChange}
        bindingRegistry={bindingRegistry}
        renderPolicy={renderPolicy}
        resolveMediaUrl={resolveMediaUrl}
      />

      {/* Main Dynamic View Content Container */}
      <div className="relative min-h-[600px]">
        {/* Contained Brand Watermark */}
        {localTab === 'structure' ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 pt-16" aria-hidden="true">
            <div className="w-[240px] sm:w-[340px] md:w-[420px] lg:w-[480px] max-w-[70vw] aspect-square opacity-[0.04]">
              <img
                src="/logo CIC-12.png"
                alt="Watermark CIC Technology"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain filter grayscale contrast-125"
              />
            </div>
          </div>
        ) : (
          <div className="absolute top-24 right-4 lg:right-10 w-[300px] md:w-[450px] lg:w-[500px] aspect-square pointer-events-none select-none opacity-[0.035] overflow-hidden z-0" aria-hidden="true">
            <img
              src="/logo CIC-12.png"
              alt="Background Ambient Watermark CIC"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain filter grayscale contrast-125"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 relative z-10">
          <AnimatePresence mode="wait">
            {localTab === 'overview' && (
              <AboutOverviewTab
                overviewConfig={overviewConfig}
                timelineConfig={timelineConfig}
                strategyConfig={strategyConfig}
                offeringsConfig={offeringsConfig}
                awardsConfig={awardsConfig}
                partnersConfig={partnersConfig}
                aboutContent={aboutContent}
                displayedOverviewParagraphs={displayedOverviewParagraphs}
                displayedMilestones={displayedMilestones}
                displayedCoreValues={displayedCoreValues}
                displayedOfferingsItems={displayedOfferingsItems}
                displayedGalleryImages={displayedGalleryImages}
                displayedAwards={displayedAwards}
                displayedPartners={displayedPartners}
                bindingRegistry={bindingRegistry}
                renderPolicy={renderPolicy}
                resolveMediaUrl={resolveMediaUrl}
              />
            )}

            {localTab === 'structure' && (
              <AboutStructureTab
                orgConfig={orgConfig}
                bindingRegistry={bindingRegistry}
              />
            )}

            {localTab === 'experience' && (
              <AboutExperienceTab
                capacityConfig={capacityConfig}
                experienceConfig={experienceConfig}
                ctaConfig={ctaConfig}
                capacityContent={capacityContent}
                displayedMetrics={displayedMetrics}
                displayedExperienceItems={displayedExperienceItems}
                savedMapLayout={savedMapLayout}
                targetMapSection={targetMapSection}
                bindingRegistry={bindingRegistry}
                renderPolicy={renderPolicy}
                resolveMediaUrl={resolveMediaUrl}
                editMode={editMode}
                onConfigValueChange={onConfigValueChange}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
