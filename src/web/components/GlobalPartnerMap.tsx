/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CountryPartnerNetwork } from './CountryPartnerNetwork';

export const GlobalPartnerMap: React.FC = () => (
  <section className="relative my-8 w-full md:my-10">
    <header className="mb-6 px-4 text-center md:mb-8 md:px-6">
      <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 md:text-4xl">
        Mạng lưới đối tác công nghệ tiêu biểu
      </h2>
      <div aria-hidden="true" className="mx-auto my-3 h-1 w-12 rounded-full bg-orange-500" />
      <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-500 md:text-base md:leading-7">
          Từ Việt Nam, CIC kết nối với các hãng công nghệ hàng đầu trong mạng lưới hợp tác quốc tế.
      </p>
    </header>
    <div className="overflow-hidden rounded-2xl">
      <CountryPartnerNetwork />
    </div>
  </section>
);
