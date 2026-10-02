import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/shared/components/Typography';

export interface HomeEcosystemItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  image: string;
  view: 'products' | 'services';
  activeLink: 'Sản phẩm' | 'Dịch vụ';
  serviceId?: string | null;
}

interface HomeEcosystemSectionProps {
  title?: string;
  subtitle?: string;
  items: readonly HomeEcosystemItem[];
  editMode?: boolean;
  onSelect: (item: HomeEcosystemItem) => void;
}

export const HomeEcosystemSection: React.FC<HomeEcosystemSectionProps> = ({
  title = 'Hệ sinh thái Công nghệ CIC',
  subtitle = 'Phần mềm, thiết bị, AI, BIM, Digital Twins cùng năng lực tư vấn và đào tạo chuyên sâu trong một hệ sinh thái công nghệ thống nhất.',
  items,
  editMode = false,
  onSelect,
}) => {
  // Hiển thị đầy đủ 3 ảnh/trụ cột chính của Hệ sinh thái không bị ẩn hay cắt
  const displayItems = items.slice(0, 3);

  return (
    <section
      data-page-builder-section-key="home.ecosystem"
      id="solutions"
      className="relative scroll-mt-24 bg-white py-14 text-slate-950 sm:py-16 lg:scroll-mt-28 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* Header đồng bộ chuẩn nhận diện trang chủ */}
        <SectionHeader
          title={title || 'Hệ sinh thái Công nghệ CIC'}
          sub={
            subtitle ||
            'Phần mềm, thiết bị, AI, BIM, Digital Twins cùng năng lực tư vấn và đào tạo chuyên sâu trong một hệ sinh thái công nghệ thống nhất.'
          }
          titleProps={{ 'data-page-builder-config-path': JSON.stringify(['title']) } as any}
          subProps={{ 'data-page-builder-config-path': JSON.stringify(['subtitle']) } as any}
          className="mb-10 sm:mb-12"
        />

        {/* 3 Cột ảnh đầy đủ, khoáng đạt, không bị viền lồng viền bó cứng */}
        <div
          data-page-collection="ecosystem"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full"
        >
          {displayItems.map((item) => (
            <button
              key={item.id}
              type="button"
              data-ecosystem-card
              onClick={() => {
                if (!editMode) onSelect(item);
              }}
              aria-label={`Xem ${item.title}`}
              aria-disabled={editMode}
              className="group text-left cursor-pointer flex flex-col transition-all duration-300 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl"
            >
              {/* Khung ảnh tự nhiên, không viền xám dày bọc ngoài */}
              <div className="relative w-full h-[360px] sm:h-[400px] lg:h-[430px] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-500 bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent"
                  aria-hidden="true"
                />

                {/* Badge nhận diện */}
                <span className="absolute left-4 top-4 rounded-full bg-orange-600/90 backdrop-blur-xs px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {item.badge}
                </span>

                {/* Đoạn mô tả tự nhiên trên gradient */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="line-clamp-3 text-sm text-slate-200 leading-relaxed font-normal drop-shadow-xs">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Tiêu đề và nút điều hướng thoáng mắt, hiện đại */}
              <div className="flex items-center justify-between gap-3 pt-4 px-1">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </span>
                <span
                  className="size-10 shrink-0 rounded-full bg-slate-100 group-hover:bg-orange-600 group-hover:text-white text-slate-700 flex items-center justify-center transition-all duration-300 shadow-xs"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
