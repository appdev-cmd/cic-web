import { motion } from 'motion/react';
import {
  Building2,
  Award,
  ShieldCheck,
  Globe,
  Cpu,
  Box,
  Lightbulb,
  Leaf,
} from 'lucide-react';
import { SectionHeader } from '@shared/components/Typography';
import { BIMIcon } from '@shared/components/Icons';
import { AwardsSlider } from '../AwardsSlider';
import { createElementBinding, createCollectionItemPath } from '@shared/visual-editing/elementBindingTypes';
import type { ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import type { AboutPageModel, PageRenderPolicy } from '@shared/page-content/models';
import { useI18n } from '@/shared/i18n';
import { bindElement, getYoutubeEmbedUrl, textFrom } from './aboutUtils';

interface AboutOverviewTabProps {
  overviewConfig: Record<string, unknown>;
  timelineConfig: Record<string, unknown>;
  strategyConfig: Record<string, unknown>;
  offeringsConfig: Record<string, unknown>;
  awardsConfig: Record<string, unknown>;
  partnersConfig: Record<string, unknown>;
  aboutContent: AboutPageModel;
  displayedOverviewParagraphs: string[];
  displayedMilestones: readonly { id?: string; year?: string; description?: string; title?: string }[];
  displayedCoreValues: readonly ({ id?: string; value?: string } | string)[];
  displayedOfferingsItems: Array<{ title: string; desc: string }>;
  displayedGalleryImages: string[];
  displayedAwards: Array<{ name: string; img: string }>;
  displayedPartners: Array<{ entityId: string; name: string; logo: string; link: string }>;
  bindingRegistry: ElementBindingRegistry;
  renderPolicy: PageRenderPolicy;
  resolveMediaUrl: (id: string) => string;
}

export function AboutOverviewTab({
  overviewConfig,
  timelineConfig,
  strategyConfig,
  offeringsConfig,
  awardsConfig,
  partnersConfig,
  aboutContent,
  displayedOverviewParagraphs,
  displayedMilestones,
  displayedCoreValues,
  displayedOfferingsItems,
  displayedGalleryImages,
  displayedAwards,
  displayedPartners,
  bindingRegistry,
  renderPolicy,
  resolveMediaUrl,
}: AboutOverviewTabProps) {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  return (
    <motion.div
      key="overview"
      {...(renderPolicy.motionEnabled
        ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.4 } }
        : { initial: false })}
      className="w-full space-y-6 lg:space-y-8"
    >
      {/* 0. Giới Thiệu & Video */}
      <section data-page-builder-section-key="about.overview" className="pb-4 lg:pb-6 bg-transparent relative overflow-hidden z-10 border-b border-slate-100">
        <div className="w-full relative z-10">
          <SectionHeader
            title={textFrom(overviewConfig, 'title', isEn ? 'Corporate Overview' : 'Tổng quan doanh nghiệp')}
            className="!mb-4"
            titleProps={
              {
                ...bindElement<HTMLHeadingElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.overview', elementPath: 'title', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['title']),
              } as any
            }
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3.5">
              {displayedOverviewParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  data-page-builder-config-path={JSON.stringify(['paragraphs', index])}
                  className="text-sm md:text-base text-slate-600 leading-relaxed font-normal text-justify"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div
              {...bindElement<HTMLDivElement>(
                bindingRegistry,
                createElementBinding({ sectionKey: 'about.overview', elementPath: 'videoUrl', semantic: 'text', ownership: 'section-config', editable: true })
              )}
              data-page-builder-video-path={JSON.stringify(['videoUrl'])}
              data-page-builder-video-url={textFrom(overviewConfig, 'videoUrl', 'https://www.youtube.com/watch?v=hdLFK_09-tU?start=448')}
              className="relative aspect-video rounded-[10px] overflow-hidden shadow-xl border-4 border-slate-100 bg-black self-start"
            >
              <iframe
                className="w-full h-full scale-[1.03] origin-center"
                src={getYoutubeEmbedUrl(textFrom(overviewConfig, 'videoUrl', 'https://www.youtube.com/embed/hdLFK_09-tU?start=448'))}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tiến Trình Phát Triển (Timeline) */}
      <section data-page-builder-section-key="about.timeline" className="py-6 md:py-8 bg-transparent relative overflow-hidden border-b border-slate-100 z-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-[8px] mb-2">
              <span className={`w-2 h-2 rounded-full bg-orange-600 ${renderPolicy.motionEnabled ? 'animate-pulse' : ''}`}></span>
              <span
                {...bindElement(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.timeline', elementPath: 'badge', semantic: 'text', ownership: 'section-config', editable: true })
                )}
                data-page-builder-config-path={JSON.stringify(['badge'])}
                className="text-[10px] font-black uppercase tracking-widest"
              >
                {textFrom(timelineConfig, 'badge', isEn ? '35-Year Journey' : 'Hành trình 35 năm')}
              </span>
            </div>
            <h2
              {...bindElement(
                bindingRegistry,
                createElementBinding({ sectionKey: 'about.timeline', elementPath: 'title', semantic: 'text', ownership: 'section-config', editable: true })
              )}
              data-page-builder-config-path={JSON.stringify(['title'])}
              className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2"
            >
              {(() => {
                const t = textFrom(timelineConfig, 'title', isEn ? '35-Year Journey' : (aboutContent.timeline.title || 'Hành trình 35 năm'));
                if (t.toLowerCase().includes('35 năm')) {
                  const [p1] = t.split(/35\s*năm/i);
                  return (
                    <>
                      <span className="text-slate-900">{p1 || 'Hành trình '}</span>
                      <span className="text-orange-600">35 năm</span>
                    </>
                  );
                }
                if (t.toLowerCase().includes('35-year') || t.toLowerCase().includes('35 year')) {
                  return (
                    <>
                      <span className="text-orange-600">35-Year</span>{' '}
                      <span className="text-slate-900">Journey</span>
                    </>
                  );
                }
                return <span className="text-slate-900">{t}</span>;
              })()}
            </h2>
            <p
              {...bindElement(
                bindingRegistry,
                createElementBinding({ sectionKey: 'about.timeline', elementPath: 'description', semantic: 'text', ownership: 'section-config', editable: true })
              )}
              data-page-builder-config-path={JSON.stringify(['description'])}
              className="text-slate-500 max-w-2xl mx-auto text-sm"
            >
              {textFrom(
                timelineConfig,
                'description',
                isEn
                  ? 'The journey of rising to become one of the pioneers in technology and construction consulting in Vietnam.'
                  : 'Chặng đường vươn lên trở thành một trong những đơn vị tiên phong trong lĩnh vực công nghệ và tư vấn xây dựng tại Việt Nam.'
              )}
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 mt-4 md:mt-6">
            {/* Horizontal Line - Thin */}
            <div className="absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-slate-300 hidden md:block"></div>

            <div
              {...bindElement(
                bindingRegistry,
                createElementBinding({ sectionKey: 'about.timeline', elementPath: 'milestones', semantic: 'collection', ownership: 'embedded', editable: false, collectionPath: 'milestones' })
              )}
              className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 relative z-10"
            >
              {displayedMilestones.map((item, index) => {
                if (!item || typeof item !== 'object') return null;
                const itemId = item.id ?? `ms-${index}`;
                const itemPath = createCollectionItemPath('milestones', itemId);
                return (
                  <div
                    key={`timeline-item-${itemId}-${index}`}
                    {...bindElement(
                      bindingRegistry,
                      createElementBinding({ sectionKey: 'about.timeline', elementPath: itemPath, semantic: 'embedded-item', ownership: 'embedded', editable: false, itemId, collectionPath: 'milestones' })
                    )}
                    className="relative flex flex-col items-center text-center group"
                  >
                    {/* Dot */}
                    <div
                      className={`hidden md:flex w-3 h-3 rounded-full bg-orange-500 ring-[6px] ring-white mb-6 relative z-10 items-center justify-center -translate-y-1/2 mt-[28px] ${
                        renderPolicy.motionEnabled ? 'group-hover:scale-150 group-hover:bg-orange-600 transition-all duration-300' : ''
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full bg-orange-500 opacity-50 ${renderPolicy.motionEnabled ? 'animate-ping' : ''}`}></div>
                    </div>

                    {/* Content */}
                    <div className="w-full flex flex-col items-center md:-mt-4">
                      <h3
                        {...bindElement(
                          bindingRegistry,
                          createElementBinding({ sectionKey: 'about.timeline', elementPath: `${itemPath}.year`, semantic: 'text', ownership: 'embedded', editable: true, itemId, collectionPath: 'milestones' })
                        )}
                        data-page-builder-config-path={JSON.stringify(['milestones', index, 'year'])}
                        className="text-3xl font-black text-slate-900 tracking-tighter mb-2"
                      >
                        {item.year ?? ''}
                      </h3>
                      <p
                        {...bindElement(
                          bindingRegistry,
                          createElementBinding({ sectionKey: 'about.timeline', elementPath: `${itemPath}.description`, semantic: 'text', ownership: 'embedded', editable: true, itemId, collectionPath: 'milestones' })
                        )}
                        data-page-builder-config-path={JSON.stringify(['milestones', index, 'description'])}
                        className="text-slate-600 text-sm leading-relaxed"
                      >
                        {item.description ?? ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Định Hướng Chiến Lược */}
      <section data-page-builder-section-key="about.strategy" className="py-10 bg-slate-50 border-b border-slate-100 z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title={textFrom(strategyConfig, 'title', isEn ? 'Strategic Direction' : (aboutContent.strategy.title || 'Định hướng chiến lược'))}
            sub={textFrom(strategyConfig, 'subtitle', isEn ? 'Vision for creating sustainable technology value' : (aboutContent.strategy.subtitle || 'Tầm nhìn kiến tạo giá trị công nghệ bền vững'))}
            titleProps={
              {
                ...bindElement<HTMLHeadingElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.strategy', elementPath: 'title', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['title']),
              } as any
            }
            subProps={
              {
                ...bindElement<HTMLParagraphElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.strategy', elementPath: 'subtitle', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['subtitle']),
              } as any
            }
          />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Illustration */}
            <div className="relative aspect-[4/5] rounded-[10px] overflow-hidden shadow-sm group hidden lg:block">
              <img
                data-page-builder-media-path={JSON.stringify(['imageId'])}
                data-page-builder-media-id={textFrom(strategyConfig, 'imageId', '')}
                src={resolveMediaUrl(textFrom(strategyConfig, 'imageId', '/35nam_cic_1.JPG'))}
                alt={isEn ? 'Strategic Direction' : 'Định hướng chiến lược'}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover rounded-[10px] ${
                  renderPolicy.motionEnabled ? 'group-hover:scale-105 transition-transform duration-500' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Right: Content Blocks */}
            <div className="flex flex-col gap-6">
              {/* Sứ mệnh */}
              <div className="p-8 bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-orange-200 transition-colors">
                <div className="w-14 h-14 shrink-0 rounded-[8px] bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">{isEn ? 'Mission' : 'Sứ mệnh'}</h3>
                  <p
                    {...bindElement(
                      bindingRegistry,
                      createElementBinding({ sectionKey: 'about.strategy', elementPath: 'mission', semantic: 'text', ownership: 'section-config', editable: true })
                    )}
                    data-page-builder-config-path={JSON.stringify(['mission'])}
                    className="text-slate-600 leading-relaxed text-sm md:text-base"
                  >
                    {textFrom(strategyConfig, 'mission', isEn ? 'Bringing advanced technology into the practice of the construction industry.' : (aboutContent.strategy.mission || 'Đưa công nghệ tiên tiến vào thực tiễn ngành xây dựng.'))}
                  </p>
                </div>
              </div>

              {/* Tầm nhìn */}
              <div className="p-8 bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-blue-200 transition-colors">
                <div className="w-14 h-14 shrink-0 rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Globe size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">{isEn ? 'Vision' : 'Tầm nhìn'}</h3>
                  <p
                    {...bindElement(
                      bindingRegistry,
                      createElementBinding({ sectionKey: 'about.strategy', elementPath: 'vision', semantic: 'text', ownership: 'section-config', editable: true })
                    )}
                    data-page-builder-config-path={JSON.stringify(['vision'])}
                    className="text-slate-600 leading-relaxed text-sm md:text-base"
                  >
                    {textFrom(strategyConfig, 'vision', isEn ? 'To become a leading specialized technology enterprise in the region.' : (aboutContent.strategy.vision || 'Trở thành doanh nghiệp công nghệ chuyên sâu hàng đầu.'))}
                  </p>
                </div>
              </div>

              {/* Giá trị cốt lõi */}
              <div className="p-8 bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start hover:border-orange-200 transition-colors">
                <div className="w-14 h-14 shrink-0 rounded-[8px] bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                  <Award size={28} />
                </div>
                <div className="relative z-10 w-full">
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-4">{isEn ? 'Core Values' : 'Giá trị cốt lõi'}</h3>
                  <div
                    {...bindElement(
                      bindingRegistry,
                      createElementBinding({ sectionKey: 'about.strategy', elementPath: 'coreValues', semantic: 'collection', ownership: 'embedded', editable: false, collectionPath: 'coreValues' })
                    )}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 w-full"
                  >
                    {displayedCoreValues.map((item, index) => {
                      if (!item) return null;
                      const itemId = typeof item === 'object' && item?.id ? item.id : `cv-${index}`;
                      const itemPath = createCollectionItemPath('coreValues', itemId);
                      const valueText = typeof item === 'string' ? item : item?.value ?? '';
                      return (
                        <div
                          key={`core-val-${itemId}-${index}`}
                          {...bindElement(
                            bindingRegistry,
                            createElementBinding({ sectionKey: 'about.strategy', elementPath: itemPath, semantic: 'embedded-item', ownership: 'embedded', editable: false, itemId, collectionPath: 'coreValues' })
                          )}
                          className="flex items-center gap-3"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                          <span
                            {...bindElement(
                              bindingRegistry,
                              createElementBinding({ sectionKey: 'about.strategy', elementPath: `${itemPath}.value`, semantic: 'text', ownership: 'embedded', editable: true, itemId, collectionPath: 'coreValues' })
                            )}
                            data-page-builder-config-path={JSON.stringify(['coreValues', index, 'value'])}
                            className="text-slate-600 leading-relaxed text-sm md:text-base"
                          >
                            {valueText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section data-page-builder-section-key="about.awards" className="py-16 bg-slate-50/60 relative overflow-hidden z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title={textFrom(awardsConfig, 'title', isEn ? 'Achievements & Awards' : 'Thành tựu & Giải thưởng')}
            sub={textFrom(awardsConfig, 'subtitle', isEn ? 'Testament to relentless efforts' : 'Minh chứng cho nỗ lực không ngừng nghỉ')}
            titleProps={
              {
                ...bindElement<HTMLHeadingElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.awards', elementPath: 'title', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['title']),
              } as any
            }
            subProps={
              {
                ...bindElement<HTMLParagraphElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.awards', elementPath: 'subtitle', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['subtitle']),
              } as any
            }
          />
          <div className="text-center mt-6 mb-12">
            <p
              {...bindElement(
                bindingRegistry,
                createElementBinding({ sectionKey: 'about.awards', elementPath: 'description', semantic: 'text', ownership: 'section-config', editable: true })
              )}
              data-page-builder-config-path={JSON.stringify(['description'])}
              className="text-sm md:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed font-normal text-justify"
            >
              {textFrom(
                awardsConfig,
                'description',
                isEn
                  ? 'Over 35 years of growth, CIC has been honored with numerous certificates of merit, cups, and prestigious awards from state authorities and professional associations - notably the Third-class Labor Order, Prime Minister Certificate of Merit, and prestigious tech awards such as Sao Khue, Vietnam Gold Star, and Vifotec. This is a testament to the product quality and brand reputation that CIC has consistently built throughout its journey with Vietnam construction industry.'
                  : 'Hơn 35 năm phát triển, CIC vinh dự nhận nhiều bằng khen, cúp và giải thưởng uy tín từ các cơ quan Nhà nước và hiệp hội chuyên ngành – tiêu biểu như Huân chương Lao động hạng Ba, Bằng khen của Thủ tướng Chính phủ, cùng các giải thưởng công nghệ danh giá như Sao Khuê, Sao Vàng Đất Việt và Vifotec. Đây là minh chứng cho chất lượng sản phẩm và uy tín thương hiệu mà CIC đã bền bỉ xây dựng trong suốt hành trình đồng hành cùng ngành Xây dựng Việt Nam.'
              )}
            </p>
          </div>
          <div className="mt-8">
            <AwardsSlider paused={!renderPolicy.motionEnabled} awards={displayedAwards} />
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section data-page-builder-section-key="about.partners" className="py-10 bg-transparent border-b border-slate-100 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
          <SectionHeader
            title={textFrom(partnersConfig, 'title', isEn ? 'Strategic Partners & Key Clients' : 'Đối tác chiến lược & Khách hàng tiêu biểu')}
            sub={textFrom(partnersConfig, 'subtitle', isEn ? 'Cooperating with leading global tech corporations' : 'Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới')}
            titleProps={
              {
                ...bindElement<HTMLHeadingElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.partners', elementPath: 'title', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['title']),
              } as any
            }
            subProps={
              {
                ...bindElement<HTMLParagraphElement>(
                  bindingRegistry,
                  createElementBinding({ sectionKey: 'about.partners', elementPath: 'subtitle', semantic: 'text', ownership: 'section-config', editable: true })
                ),
                'data-page-builder-config-path': JSON.stringify(['subtitle']),
              } as any
            }
          />

          <div className="text-center mt-6 mb-12">
            <p
              {...bindElement(
                bindingRegistry,
                createElementBinding({ sectionKey: 'about.partners', elementPath: 'description', semantic: 'text', ownership: 'section-config', editable: true })
              )}
              data-page-builder-config-path={JSON.stringify(['description'])}
              className="text-sm md:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed font-normal text-justify"
            >
              {textFrom(
                partnersConfig,
                'description',
                isEn
                  ? 'With a nationwide network, CIC is currently a trusted partner of more than 1,000 customers in Vietnam and an official partner of many world-leading technology companies.'
                  : 'Với mạng lưới khách hàng rộng khắp trên cả nước, CIC hiện là đối tác tin cậy của hơn 1.000 khách hàng tại Việt Nam và là đối tác chính thức của nhiều hãng công nghệ hàng đầu thế giới.'
              )}
            </p>
          </div>

          {/* Modern Photo Album (Bento Grid) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[250px] mb-12">
            <div
              data-page-builder-media-path={JSON.stringify(['galleryImages', 0])}
              data-page-builder-media-id={displayedGalleryImages[0]}
              className="md:col-span-8 rounded-[10px] overflow-hidden shadow-sm relative group cursor-pointer"
            >
              <img
                data-page-builder-media-path={JSON.stringify(['galleryImages', 0])}
                data-page-builder-media-id={displayedGalleryImages[0]}
                src={resolveMediaUrl(displayedGalleryImages[0])}
                alt="Hoạt động đối tác"
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover rounded-[10px] ${
                  renderPolicy.motionEnabled ? 'group-hover:scale-105 transition-transform duration-500' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <div
              data-page-builder-media-path={JSON.stringify(['galleryImages', 1])}
              data-page-builder-media-id={displayedGalleryImages[1]}
              className="md:col-span-4 rounded-[10px] overflow-hidden shadow-sm relative group cursor-pointer"
            >
              <img
                data-page-builder-media-path={JSON.stringify(['galleryImages', 1])}
                data-page-builder-media-id={displayedGalleryImages[1]}
                src={resolveMediaUrl(displayedGalleryImages[1])}
                alt="Hoạt động đối tác"
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover rounded-[10px] ${
                  renderPolicy.motionEnabled ? 'group-hover:scale-105 transition-transform duration-500' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <div
              data-page-builder-media-path={JSON.stringify(['galleryImages', 2])}
              data-page-builder-media-id={displayedGalleryImages[2]}
              className="md:col-span-4 rounded-[10px] overflow-hidden shadow-sm relative group cursor-pointer"
            >
              <img
                data-page-builder-media-path={JSON.stringify(['galleryImages', 2])}
                data-page-builder-media-id={displayedGalleryImages[2]}
                src={resolveMediaUrl(displayedGalleryImages[2])}
                alt="Hoạt động đối tác"
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover rounded-[10px] ${
                  renderPolicy.motionEnabled ? 'group-hover:scale-105 transition-transform duration-500' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <div
              data-page-builder-media-path={JSON.stringify(['galleryImages', 3])}
              data-page-builder-media-id={displayedGalleryImages[3]}
              className="md:col-span-8 rounded-[10px] overflow-hidden shadow-sm relative group cursor-pointer"
            >
              <img
                data-page-builder-media-path={JSON.stringify(['galleryImages', 3])}
                data-page-builder-media-id={displayedGalleryImages[3]}
                src={resolveMediaUrl(displayedGalleryImages[3])}
                alt="Hoạt động đối tác"
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover rounded-[10px] ${
                  renderPolicy.motionEnabled ? 'group-hover:scale-105 transition-transform duration-500' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Slider Partners */}
        <div className="relative group z-10">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <motion.div
            data-page-collection="partner"
            {...(renderPolicy.motionEnabled ? { animate: { x: ['0%', '-50%'] }, transition: { repeat: Infinity, duration: 40, ease: 'linear' } } : { initial: false })}
            className={renderPolicy.motionEnabled ? 'flex gap-6 whitespace-nowrap' : 'mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4'}
          >
            {(renderPolicy.motionEnabled ? [...displayedPartners, ...displayedPartners] : displayedPartners).map((partner, i) => (
              <motion.div
                key={`${partner.entityId}-${i}`}
                {...bindElement<HTMLDivElement>(
                  bindingRegistry,
                  createElementBinding({
                    sectionKey: 'about.partners',
                    elementPath: createCollectionItemPath('items', partner.entityId),
                    semantic: 'embedded-item',
                    ownership: 'embedded',
                    editable: false,
                    itemId: partner.entityId,
                    collectionPath: 'items',
                  })
                )}
                {...(renderPolicy.motionEnabled ? { whileHover: { scale: 1.05, y: -5 } } : {})}
                className="flex-shrink-0 flex items-center justify-center p-4 md:p-6 rounded-[10px] bg-white border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer h-20 md:h-24 w-44 md:w-48 group"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 md:max-h-14 w-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <span className="whitespace-normal text-center text-sm font-bold capitalize text-slate-700">{partner.name}</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
