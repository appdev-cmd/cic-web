import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { GlobalPartnerMap } from '../GlobalPartnerMap';
import type { StoredPartnerMapLayout } from '../CountryPartnerNetwork';
import { createElementBinding, createCollectionItemPath } from '@shared/visual-editing/elementBindingTypes';
import { bindElement as bindElementRuntime } from '@shared/visual-editing/bindElement';
import type { ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import type { AboutCapacityModel, PageRenderPolicy } from '@shared/page-content/models';
import { textFrom } from './aboutUtils';

interface AboutExperienceTabProps {
  capacityConfig: Record<string, unknown>;
  experienceConfig: Record<string, unknown>;
  ctaConfig: Record<string, unknown>;
  capacityContent: AboutCapacityModel;
  displayedMetrics: readonly { id?: string; value: string; label: string }[];
  displayedExperienceItems: Array<{ title: string; description: string; imageId: string }>;
  savedMapLayout?: StoredPartnerMapLayout;
  targetMapSection?: { id?: string };
  bindingRegistry: ElementBindingRegistry;
  renderPolicy: PageRenderPolicy;
  resolveMediaUrl: (id: string) => string;
  editMode?: boolean;
  onConfigValueChange?: (sectionId: string, path: Array<string | number>, value: any) => void;
}

export function AboutExperienceTab({
  capacityConfig,
  experienceConfig,
  ctaConfig,
  capacityContent,
  displayedMetrics,
  displayedExperienceItems,
  savedMapLayout,
  targetMapSection,
  bindingRegistry,
  renderPolicy,
  resolveMediaUrl,
  editMode = false,
  onConfigValueChange,
}: AboutExperienceTabProps) {
  return (
    <motion.div
      key="capacity"
      {...(renderPolicy.motionEnabled
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.4 },
          }
        : { initial: false })}
      className="relative z-10 w-full space-y-16"
    >
      {/* Top Capacity & Scale Overview */}
      <div data-page-builder-section-key="about.capacity" className="w-full bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center pt-2">
            <h2
              {...bindElementRuntime<HTMLHeadingElement>(
                createElementBinding({
                  sectionKey: 'about.capacity',
                  elementPath: 'title',
                  semantic: 'text',
                  ownership: 'section-config',
                  editable: true,
                }),
                bindingRegistry
              )}
              data-page-builder-config-path={JSON.stringify(['title'])}
              className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight"
            >
              {(() => {
                const rawTitle = textFrom(capacityConfig, 'title', 'Tiềm lực vững vàng, vươn tầm quốc tế');
                if (rawTitle.includes(',')) {
                  const [part1, ...rest] = rawTitle.split(',');
                  return (
                    <>
                      <span className="text-slate-900">{part1.trim()},</span>
                      <br />
                      <span className="text-orange-600">{rest.join(',').trim()}</span>
                    </>
                  );
                }
                if (rawTitle.includes('\n')) {
                  const [part1, ...rest] = rawTitle.split('\n');
                  return (
                    <>
                      <span className="text-slate-900">{part1.trim()}</span>
                      <br />
                      <span className="text-orange-600">{rest.join('\n').trim()}</span>
                    </>
                  );
                }
                const words = rawTitle.trim().split(/\s+/);
                if (words.length >= 4) {
                  const mid = Math.ceil(words.length / 2);
                  return (
                    <>
                      <span className="text-slate-900">{words.slice(0, mid).join(' ')}</span>
                      <br />
                      <span className="text-orange-600">{words.slice(mid).join(' ')}</span>
                    </>
                  );
                }
                return <span className="text-slate-900">{rawTitle}</span>;
              })()}
            </h2>
            <div className="w-16 h-1 bg-orange-600 mx-auto mt-3 mb-6"></div>
            <p
              {...bindElementRuntime<HTMLParagraphElement>(
                createElementBinding({
                  sectionKey: 'about.capacity',
                  elementPath: 'description',
                  semantic: 'text',
                  ownership: 'embedded',
                  editable: true,
                }),
                bindingRegistry
              )}
              data-page-builder-config-path={JSON.stringify(['description'])}
              className="text-slate-600 text-base md:text-lg leading-relaxed mb-10 max-w-3xl"
            >
              {textFrom(
                capacityConfig,
                'description',
                capacityContent.description ||
                  'Trải qua 35 năm hình thành và phát triển, CIC đã xây dựng được một đội ngũ nhân sự chất lượng cao, mạng lưới đối tác toàn cầu và danh mục khách hàng rộng khắp, khẳng định vị thế vững chắc trong lĩnh vực công nghệ và xây dựng.'
              )}
            </p>

            <div
              {...bindElementRuntime<HTMLDivElement>(
                createElementBinding({
                  sectionKey: 'about.capacity',
                  elementPath: 'metrics',
                  semantic: 'collection',
                  ownership: 'embedded',
                  editable: false,
                  collectionPath: 'metrics',
                }),
                bindingRegistry
              )}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 w-full"
            >
              {displayedMetrics.map((metric, index) => {
                if (!metric || typeof metric !== 'object') return null;
                const metricId = metric.id ?? `cap-${index}`;
                const itemPath = createCollectionItemPath('metrics', metricId);
                return (
                  <div
                    key={metric.id ? `cap-metric-${metric.id}-${index}` : `cap-metric-${index}`}
                    {...bindElementRuntime<HTMLDivElement>(
                      createElementBinding({
                        sectionKey: 'about.capacity',
                        elementPath: itemPath,
                        semantic: 'embedded-item',
                        ownership: 'embedded',
                        editable: false,
                        itemId: metric.id ?? `cap-${index}`,
                        collectionPath: 'metrics',
                      }),
                      bindingRegistry
                    )}
                    className={`bg-slate-50 p-6 rounded-[10px] border border-slate-200 flex flex-col items-center text-center ${
                      renderPolicy.motionEnabled ? 'hover:border-orange-500 hover:shadow-md transition-all' : ''
                    }`}
                  >
                    <div
                      {...bindElementRuntime<HTMLDivElement>(
                        createElementBinding({
                          sectionKey: 'about.capacity',
                          elementPath: `${itemPath}.value`,
                          semantic: 'text',
                          ownership: 'embedded',
                          editable: true,
                          itemId: metric.id ?? `cap-${index}`,
                          collectionPath: 'metrics',
                        }),
                        bindingRegistry
                      )}
                      data-page-builder-config-path={JSON.stringify(['metrics', index, 'value'])}
                      className="text-3xl md:text-4xl font-black text-orange-600 mb-2"
                    >
                      {metric.value}
                    </div>
                    <div
                      {...bindElementRuntime<HTMLDivElement>(
                        createElementBinding({
                          sectionKey: 'about.capacity',
                          elementPath: `${itemPath}.label`,
                          semantic: 'text',
                          ownership: 'embedded',
                          editable: true,
                          itemId: metric.id ?? `cap-${index}`,
                          collectionPath: 'metrics',
                        }),
                        bindingRegistry
                      )}
                      data-page-builder-config-path={JSON.stringify(['metrics', index, 'label'])}
                      className="text-xs md:text-sm font-bold text-slate-600 uppercase"
                    >
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div data-page-builder-section-key="about.experience" className="flex flex-col gap-12 lg:gap-16 text-left w-full mb-12">
              {displayedExperienceItems.map((item, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div key={idx} className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div
                      data-page-builder-media-path={JSON.stringify(['items', idx, 'imageId'])}
                      data-page-builder-media-id={item.imageId}
                      className={`${isEven ? 'order-1 md:order-2' : ''} rounded-[10px] overflow-hidden shadow-md group relative cursor-pointer`}
                    >
                      <img
                        data-page-builder-media-path={JSON.stringify(['items', idx, 'imageId'])}
                        data-page-builder-media-id={item.imageId}
                        src={resolveMediaUrl(item.imageId)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-[260px] md:h-[320px] object-cover rounded-[10px] ${
                          renderPolicy.motionEnabled ? 'group-hover:scale-105 transition-transform duration-500' : ''
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <div className={isEven ? 'order-2 md:order-1' : ''}>
                      <h3 data-page-builder-config-path={JSON.stringify(['items', idx, 'title'])} className="text-xl md:text-2xl font-black text-slate-900 mb-4">
                        {item.title}
                      </h3>
                      <p data-page-builder-config-path={JSON.stringify(['items', idx, 'description'])} className="text-slate-600 text-base md:text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global Technology Partner Network Map Component */}
            <div className="mx-auto mb-6 w-full md:mb-8">
              <GlobalPartnerMap
                title={textFrom(
                  experienceConfig,
                  'partnerMapTitle',
                  textFrom(capacityConfig, 'partnerMapTitle', 'Mạng lưới đối tác công nghệ tiêu biểu')
                )}
                subtitle={textFrom(
                  experienceConfig,
                  'partnerMapSubtitle',
                  textFrom(
                    capacityConfig,
                    'partnerMapSubtitle',
                    'Từ Việt Nam, CIC kết nối với các hãng công nghệ hàng đầu trong mạng lưới hợp tác quốc tế.'
                  )
                )}
                editMode={editMode}
                layoutData={savedMapLayout}
                onLayoutChange={(nextLayout) => {
                  if (targetMapSection?.id) {
                    onConfigValueChange?.(targetMapSection.id, ['partnerMapLayout'], nextLayout);
                  }
                }}
                titleProps={
                  {
                    'data-page-builder-config-path': JSON.stringify(['partnerMapTitle']),
                    ...bindElementRuntime<HTMLHeadingElement>(
                      createElementBinding({
                        sectionKey: 'about.experience',
                        elementPath: 'partnerMapTitle',
                        semantic: 'text',
                        ownership: 'section-config',
                        editable: true,
                      }),
                      bindingRegistry
                    ),
                  } as any
                }
                subProps={
                  {
                    'data-page-builder-config-path': JSON.stringify(['partnerMapSubtitle']),
                    ...bindElementRuntime<HTMLParagraphElement>(
                      createElementBinding({
                        sectionKey: 'about.experience',
                        elementPath: 'partnerMapSubtitle',
                        semantic: 'text',
                        ownership: 'section-config',
                        editable: true,
                      }),
                      bindingRegistry
                    ),
                  } as any
                }
              />
            </div>

            <a
              data-page-builder-section-key="about.contact_cta"
              data-page-builder-cta-key={JSON.stringify(['ctaLabel'])}
              href={textFrom(ctaConfig, 'ctaUrl', 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-colors inline-flex items-center gap-3 rounded-[8px] shadow-lg shadow-orange-600/30 cursor-pointer"
            >
              <ArrowUpRight size={20} />
              <span data-page-builder-config-path={JSON.stringify(['ctaLabel'])}>
                {textFrom(ctaConfig, 'ctaLabel', textFrom(ctaConfig, 'title', 'Hồ sơ năng lực (Profile)'))}
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
