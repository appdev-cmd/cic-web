/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '@shared/components/Typography';
import type { PageRenderPolicy } from '@shared/page-content/models';

interface HomePartnersSectionProps {
  title?: string;
  subtitle?: string;
  partners: Array<{ name: string; logo?: string }>;
  renderPolicy: PageRenderPolicy;
}

export const HomePartnersSection: React.FC<HomePartnersSectionProps> = ({
  title,
  subtitle,
  partners,
  renderPolicy,
}) => {
  return (
    <section data-page-builder-section-key="home.partners" className="py-10 bg-white/40 border-t border-slate-100 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-6 relative z-10">
        <SectionHeader 
          title={title || "Đối tác chiến lược"} 
          sub={subtitle || "Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới"} 
          titleProps={{ 'data-page-builder-config-path': JSON.stringify(['title']) } as any}
          subProps={{ 'data-page-builder-config-path': JSON.stringify(['subtitle']) } as any}
        />
      </div>
      
      <div className="relative group z-10">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          data-page-collection="partner"
          {...(renderPolicy.motionEnabled ? { animate: { x: ["0%", "-50%"] }, transition: { repeat: Infinity, duration: 40, ease: "linear" } } : { initial: false })}
          className={renderPolicy.motionEnabled ? 'flex gap-4 whitespace-nowrap' : 'mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4'}
        >
          {(renderPolicy.motionEnabled ? [...partners, ...partners] : partners).map((partner, i) => (
            <motion.div 
              key={i}
              {...(renderPolicy.motionEnabled ? { whileHover: { scale: 1.05, y: -5 } } : {})}
              className="flex-shrink-0 flex items-center justify-center p-4 md:p-6 rounded-[10px] bg-white border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer h-20 md:h-24 w-44 md:w-48 group"
            >
              {partner.logo ? (
                <img
                  src={partner.logo} 
                  alt={partner.name} 
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
  );
};
