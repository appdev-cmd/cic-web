'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/shared/i18n';

export interface EcosystemSolutionItem {
  id: string;
  title: string;
  titleEn: string;
  badge: string;
  badgeEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  href: string;
  hrefEn: string;
}

export const ECOSYSTEM_SOLUTIONS: EcosystemSolutionItem[] = [
  {
    id: 'software-dev',
    title: 'Phát triển phần mềm xây dựng',
    titleEn: 'Construction Software Development',
    badge: 'Phần mềm kỹ thuật',
    badgeEn: 'Engineering Software',
    description:
      'Phát triển các phần mềm chuyên ngành xây dựng, quản lý, quy hoạch làm nên thương hiệu CIC (KPW, Escon, RDW, VinaSAS…) và enjiCAD – phần mềm vẽ kỹ thuật chất lượng cao, giá cạnh tranh hơn nhiều so với CAD ngoại nhập.',
    descriptionEn:
      'Developing specialized software for structural engineering, project management, and planning that established the CIC brand (KPW, Escon, RDW, VinaSAS…) and enjiCAD – high-performance engineering CAD at competitive pricing.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
    href: '/products',
    hrefEn: '/en/products',
  },
  {
    id: 'software-distribution',
    title: 'Phân phối phần mềm nhập khẩu chính hãng',
    titleEn: 'Official Imported Software Distribution',
    badge: 'Phân phối bản quyền',
    badgeEn: 'Official Distribution',
    description:
      'Phân phối phần mềm bản quyền từ các hãng công nghệ hàng đầu thế giới như Microsoft, Autodesk, CSI, Cubicost, ANSYS, Bentley, DHI, Hexagon, DNV GL, Prokon, Risa…',
    descriptionEn:
      'Authorized distribution of genuine licensed software from world-leading tech corporations including Microsoft, Autodesk, CSI, Cubicost, ANSYS, Bentley, DHI, Hexagon, DNV GL, Prokon, Risa…',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200',
    href: '/products',
    hrefEn: '/en/products',
  },
  {
    id: 'tech-hardware',
    title: 'Thiết bị công nghệ',
    titleEn: 'High-Tech Equipment & Surveying',
    badge: 'Thiết bị kiểm định & đo đạc',
    badgeEn: 'Testing & Surveying Hardware',
    description:
      'Phân phối các thiết bị công nghệ hàm lượng khoa học cao từ những hãng uy tín thế giới như Piletest, Tecknotrove, ZXLidars, A.P. van den Berg, AQ System, Sewer Robotics, Radiodetection, Pearpoint, DJI…',
    descriptionEn:
      'Supplying high-tech scientific and inspection equipment from renowned global brands like Piletest, Tecknotrove, ZXLidars, A.P. van den Berg, AQ System, Sewer Robotics, Radiodetection, Pearpoint, DJI…',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
    href: '/products',
    hrefEn: '/en/products',
  },
  {
    id: 'construction-consulting',
    title: 'Tư vấn Xây dựng',
    titleEn: 'Construction & Engineering Consulting',
    badge: 'Tư vấn & Thẩm tra',
    badgeEn: 'Consulting & Supervision',
    description:
      'Tư vấn thiết kế, thẩm tra, giám sát, quản lý dự án công trình xây dựng, đảm bảo chất lượng, tiến độ và an toàn bền vững cho các công trình hạ tầng và dân dụng.',
    descriptionEn:
      'Consulting in architectural and engineering design, peer review, project supervision, and construction management, ensuring the highest standards of safety and quality.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&q=80&w=1200',
    href: '/services',
    hrefEn: '/en/services',
  },
  {
    id: 'bim-digital-twins',
    title: 'BIM & Digital Twins',
    titleEn: 'BIM & Digital Twins Solutions',
    badge: 'Chuyển đổi số công trình',
    badgeEn: 'Digital Transformation',
    description:
      'Đồng hành chuyển đổi số toàn diện, triển khai mô hình thông tin công trình BIM chuyên sâu, xây dựng bản sao số (Digital Twins) và môi trường dữ liệu chung CDE cho công trình.',
    descriptionEn:
      'Accompanying comprehensive digital transformation, in-depth BIM implementation, Digital Twins modeling, and Common Data Environment (CDE) deployment for infrastructure assets.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    href: '/services',
    hrefEn: '/en/services',
  },
  {
    id: 'smart-technology',
    title: 'Giải pháp Công nghệ thông minh',
    titleEn: 'Smart Technology & AI Solutions',
    badge: 'AI • Big Data • IoT',
    badgeEn: 'AI • Big Data • IoT',
    description:
      'Cung cấp và tư vấn ứng dụng các giải pháp công nghệ thông minh, trí tuệ nhân tạo (AI), dữ liệu lớn (Big Data) và Internet vạn vật (IoT) vào quản lý vận hành hạ tầng đô thị thông minh.',
    descriptionEn:
      'Providing and advising on the implementation of smart technology solutions, Artificial Intelligence (AI), Big Data, and Internet of Things (IoT) in smart city and asset management.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    href: '/services',
    hrefEn: '/en/services',
  },
  {
    id: 'sustainable-solutions',
    title: 'Giải pháp phát triển bền vững',
    titleEn: 'Sustainable Development & ESG',
    badge: 'Net Zero • ESG • Xanh',
    badgeEn: 'Net Zero • ESG • Green Future',
    description:
      'Tư vấn phát triển bền vững, chiến lược Net Zero, chứng chỉ xanh EPD, tiêu chuẩn ESG cho các doanh nghiệp xây dựng hướng tới tương lai trung hòa carbon và phát triển bền vững.',
    descriptionEn:
      'Advising on sustainable development strategies, Net Zero roadmaps, EPD environmental declarations, and ESG compliance for construction enterprises aiming for a green future.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200',
    href: '/services',
    hrefEn: '/en/services',
  },
];

interface AboutEcosystemTabProps {
  onNavigateToContact?: () => void;
}

export function AboutEcosystemTab({ onNavigateToContact }: AboutEcosystemTabProps) {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  return (
    <motion.div
      key="ecosystem-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-12 sm:space-y-16"
    >
      {/* SECTION HEADER: Bố cục chuẩn Hệ sinh thái */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Layers size={14} className="text-orange-600" />
          <span>{isEn ? 'SOLUTIONS ECOSYSTEM' : 'HỆ SINH THÁI GIẢI PHÁP'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 uppercase tracking-tight leading-[1.12]">
          {isEn ? 'PRODUCTS AND SERVICES OFFERED' : 'SẢN PHẨM VÀ DỊCH VỤ CUNG CẤP'}
        </h2>

        <div aria-hidden="true" className="mx-auto h-1 w-16 rounded-full bg-orange-600" />

        <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
          {isEn
            ? 'Affirming technological capability through comprehensive core solutions – specialized software, testing hardware, BIM/Digital Twins, AI, smart tech, and sustainability consulting.'
            : 'Khẳng định năng lực qua các giải pháp công nghệ cốt lõi – Phần mềm, thiết bị, BIM, Digital Twins, AI, công nghệ thông minh cùng năng lực tư vấn chuyên sâu.'}
        </p>
      </div>

      {/* GRID CARDS: Thiết kế card Hệ sinh thái cao cấp với ảnh lớn, badge, mô tả trên gradient & link */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {ECOSYSTEM_SOLUTIONS.map((item, index) => {
          const title = isEn ? item.titleEn : item.title;
          const badge = isEn ? item.badgeEn : item.badge;
          const description = isEn ? item.descriptionEn : item.description;
          const href = isEn ? item.hrefEn : item.href;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group"
            >
              <Link
                href={href}
                className="group relative flex flex-col h-full rounded-[14px] border border-slate-200/90 bg-white p-2.5 sm:p-3 text-left shadow-sm hover:shadow-xl hover:border-orange-500/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Image Frame with Badge & Overlay */}
                <div className="relative block h-[260px] sm:h-[300px] w-full overflow-hidden rounded-[10px] bg-slate-900">
                  <img
                    src={item.image}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Dark Gradient for readability */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Badge in Top-Left */}
                  <div className="absolute left-3.5 top-3.5 z-10">
                    <span className="inline-block rounded-full bg-orange-600 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                      {badge}
                    </span>
                  </div>

                  {/* Description on Bottom Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10">
                    <p className="line-clamp-4 text-xs sm:text-[13px] leading-relaxed text-slate-100 font-normal drop-shadow-sm">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Bottom Header Row */}
                <div className="flex min-h-[72px] items-center justify-between gap-3 px-3 py-3.5 sm:px-4">
                  <h3 className="text-base sm:text-lg font-black leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-orange-600">
                    {title}
                  </h3>

                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-xs transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white"
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER CALL-TO-ACTION */}
      <section className="bg-slate-900 text-white rounded-[16px] p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-lg">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
            <Sparkles size={13} />
            <span>{isEn ? 'Consultation & Partnership' : 'Đồng hành cùng phát triển'}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {isEn
              ? 'Looking for tailored solutions for your enterprise?'
              : 'Bạn đang tìm kiếm giải pháp công nghệ phù hợp với doanh nghiệp?'}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? 'CIC Tech experts are ready to advise on optimal software licensing, hardware equipment, and digital transformation roadmaps tailored to your project scale and goals.'
              : 'Đội ngũ chuyên gia CIC sẵn sàng tư vấn giải pháp bản quyền phần mềm, thiết bị đo đạc và lộ trình chuyển đổi số tối ưu theo quy mô và mục tiêu dự án của bạn.'}
          </p>

          <div className="pt-2 flex justify-center">
            {onNavigateToContact ? (
              <button
                type="button"
                onClick={onNavigateToContact}
                className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-orange-600/30 flex items-center justify-center gap-2 rounded-[8px] cursor-pointer"
              >
                <span>{isEn ? 'REQUEST A CONSULTATION' : 'LIÊN HỆ TƯ VẤN NGAY'}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <Link
                href={isEn ? '/en/contact' : '/contact'}
                className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-orange-600/30 flex items-center justify-center gap-2 rounded-[8px] cursor-pointer"
              >
                <span>{isEn ? 'REQUEST A CONSULTATION' : 'LIÊN HỆ TƯ VẤN NGAY'}</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
