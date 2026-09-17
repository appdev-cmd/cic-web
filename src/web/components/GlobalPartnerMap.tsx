/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CountryPartnerNetwork } from './CountryPartnerNetwork';

export interface GlobalPartnerMapProps {
  title?: string;
  subtitle?: string;
  editMode?: boolean;
  titleProps?: React.HTMLAttributes<HTMLHeadingElement>;
  subProps?: React.HTMLAttributes<HTMLParagraphElement>;
}

export const GlobalPartnerMap: React.FC<GlobalPartnerMapProps> = ({
  title = 'Mạng lưới đối tác công nghệ tiêu biểu',
  subtitle = 'Từ Việt Nam, CIC kết nối với các hãng công nghệ hàng đầu trong mạng lưới hợp tác quốc tế.',
  editMode = false,
  titleProps,
  subProps,
}) => (
  <section className="relative my-6 w-full min-w-0 md:my-10">
    <header className="mb-4 px-3 text-center sm:mb-6 sm:px-4 md:mb-8 md:px-6">
      <h2
        className="text-2xl font-black uppercase tracking-tighter text-slate-900 sm:text-3xl md:text-4xl"
        {...titleProps}
      >
        {title}
      </h2>
      <div aria-hidden="true" className="mx-auto my-2.5 h-1 w-10 rounded-full bg-orange-500 sm:my-3 sm:w-12" />
      <p
        className="mx-auto max-w-2xl text-sm leading-6 text-slate-500 md:text-base md:leading-7"
        {...subProps}
      >
        {subtitle}
      </p>
    </header>
    <div className="w-full min-w-0 overflow-hidden rounded-xl md:rounded-2xl">
      <CountryPartnerNetwork isEditable={editMode} />
    </div>
  </section>
);
