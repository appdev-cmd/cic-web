'use client';

import React from 'react';
import { SectionHeader } from '@shared/components/Typography';
import { AwardsSlider } from '../AwardsSlider';
import type { HomeAwardItemModel } from '@shared/page-content/models';

export interface HomeAwardsSectionProps {
  title?: string;
  subtitle?: string;
  awards: HomeAwardItemModel[];
  editMode?: boolean;
}

export const HomeAwardsSection: React.FC<HomeAwardsSectionProps> = ({
  title,
  subtitle,
  awards,
  editMode = false,
}) => {
  return (
    <section data-page-builder-section-key="home.awards" className="py-16 bg-white/40 relative overflow-hidden z-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          title={title || "Thành tựu & Giải thưởng"} 
          sub={subtitle || "Minh chứng cho nỗ lực không ngừng nghỉ"} 
          titleProps={{ 'data-page-builder-config-path': JSON.stringify(['title']) } as any}
          subProps={{ 'data-page-builder-config-path': JSON.stringify(['subtitle']) } as any}
        />
        <div className="mt-6">
          <AwardsSlider awards={awards} paused={editMode} />
        </div>
      </div>
    </section>
  );
};
