'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Counter } from '@shared/components/Counter';
import { typeMeta, typeStat } from '@shared/components/Typography';
import { bindElement } from '@shared/visual-editing/bindElement';
import { elementBindingRegistry, type ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import { createCollectionItemPath, createElementBinding } from '@shared/visual-editing/elementBindingTypes';
import type { HomeStatModel, PageRenderPolicy } from '@shared/page-content/models';
import { productionRenderPolicy } from '@shared/page-content/models';

export interface HomeStatsSectionProps {
  homeStats: readonly HomeStatModel[];
  renderPolicy?: PageRenderPolicy;
  bindingRegistry?: ElementBindingRegistry;
}

export const HomeStatsSection: React.FC<HomeStatsSectionProps> = ({
  homeStats,
  renderPolicy = productionRenderPolicy,
  bindingRegistry = elementBindingRegistry,
}) => {
  return (
    <section data-page-builder-section-key="home.stats" className="py-20 bg-slate-50/30 relative overflow-hidden border-y border-slate-200 z-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          {...bindElement<HTMLDivElement>(createElementBinding({
            sectionKey: 'home.stats',
            elementPath: 'items',
            semantic: 'collection',
            ownership: 'embedded',
            editable: false,
            collectionPath: 'items',
          }), bindingRegistry)}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:divide-x divide-slate-200"
        >
          {homeStats.map((stat, i) => {
            const itemPath = createCollectionItemPath('items', stat.id);
            const valueBinding = createElementBinding({
              sectionKey: 'home.stats',
              elementPath: `${itemPath}.value`,
              semantic: 'text',
              ownership: 'embedded',
              editable: true,
              itemId: stat.id,
              collectionPath: 'items',
            });
            const suffixBinding = createElementBinding({
              sectionKey: 'home.stats',
              elementPath: `${itemPath}.suffix`,
              semantic: 'text',
              ownership: 'embedded',
              editable: true,
              itemId: stat.id,
              collectionPath: 'items',
            });

            return (
              <motion.div
                key={stat.id}
                {...bindElement<HTMLDivElement>(createElementBinding({
                  sectionKey: 'home.stats',
                  elementPath: itemPath,
                  semantic: 'embedded-item',
                  ownership: 'embedded',
                  editable: false,
                  itemId: stat.id,
                  collectionPath: 'items',
                }), bindingRegistry)}
                {...(renderPolicy.motionEnabled ? {
                  initial: { opacity: 0, y: 40 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-100px" },
                  transition: { delay: i * 0.1, duration: 0.8 },
                } : { initial: false })}
                className="text-center group"
              >
                <div className={`${typeStat} text-slate-800 mb-4 flex items-center justify-center h-16 ${renderPolicy.motionEnabled ? 'group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500' : ''}`}>
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    motionEnabled={renderPolicy.motionEnabled}
                    elementProps={{
                      ...bindElement<HTMLSpanElement>([valueBinding, suffixBinding], bindingRegistry),
                      'data-page-builder-config-path': JSON.stringify(['items', i, 'value']),
                    } as any}
                  />
                </div>
                <div
                  {...bindElement<HTMLDivElement>(createElementBinding({
                    sectionKey: 'home.stats',
                    elementPath: `${itemPath}.label`,
                    semantic: 'text',
                    ownership: 'embedded',
                    editable: true,
                    itemId: stat.id,
                    collectionPath: 'items',
                  }), bindingRegistry)}
                  data-page-builder-config-path={JSON.stringify(['items', i, 'label'])}
                  className={`${typeMeta} text-slate-500`}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
