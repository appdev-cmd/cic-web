import { motion } from 'motion/react';
import { SectionHeader } from '@shared/components/Typography';
import { createElementBinding } from '@shared/visual-editing/elementBindingTypes';
import type { ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import { useI18n } from '@/shared/i18n';
import { bindElement, textFrom } from './aboutUtils';

interface AboutStructureTabProps {
  orgConfig: Record<string, unknown>;
  bindingRegistry: ElementBindingRegistry;
}

export function AboutStructureTab({ orgConfig, bindingRegistry }: AboutStructureTabProps) {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  return (
    <motion.div
      data-page-builder-section-key="about.organization"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 relative overflow-hidden z-10"
    >
      {/* Structural Banner */}
      <div className="relative z-10">
        <SectionHeader
          title={textFrom(orgConfig, 'title', isEn ? 'Organization Structure' : 'Cơ cấu tổ chức')}
          sub={textFrom(orgConfig, 'subtitle', isEn ? 'Professional and efficient organizational structure chart' : 'Sơ đồ cơ cấu tổ chức chuyên nghiệp và hiệu quả')}
          titleProps={
            {
              ...bindElement<HTMLHeadingElement>(
                bindingRegistry,
                createElementBinding({
                  sectionKey: 'about.organization',
                  elementPath: 'title',
                  semantic: 'text',
                  ownership: 'section-config',
                  editable: true,
                })
              ),
              'data-page-builder-config-path': JSON.stringify(['title']),
            } as any
          }
          subProps={
            {
              ...bindElement<HTMLParagraphElement>(
                bindingRegistry,
                createElementBinding({
                  sectionKey: 'about.organization',
                  elementPath: 'subtitle',
                  semantic: 'text',
                  ownership: 'section-config',
                  editable: true,
                })
              ),
              'data-page-builder-config-path': JSON.stringify(['subtitle']),
            } as any
          }
        />
      </div>

      {/* Sơ đồ cơ cấu tổ chức chuẩn xác theo sơ đồ gốc CIC - Tự động co giãn full chiều ngang không kéo scrollbar trên PC */}
      <div className="w-full overflow-x-auto lg:overflow-x-visible py-2 relative z-10">
        <div className="w-full max-w-7xl mx-auto">
          <svg
            viewBox="0 0 1600 560"
            className="w-full h-auto select-none font-sans"
            style={{ textRendering: 'geometricPrecision' }}
          >
            <defs>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#ea580c" floodOpacity="0.15" />
              </filter>
              <style>{`
                .org-node {
                  cursor: pointer;
                  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .org-node:hover {
                  transform: translateY(-3px);
                }
                .org-node:hover rect {
                  fill: #d93800 !important;
                  stroke: #b82d00 !important;
                  stroke-width: 2px !important;
                  filter: drop-shadow(0 6px 14px rgba(252, 81, 21, 0.4));
                }
              `}</style>
            </defs>

            {/* ================= CONNECTING LINES ================= */}
            {/* Vertical Spine: Đại hội đồng cổ đông -> HĐQT -> Tổng Giám Đốc */}
            <line x1="800" y1="65" x2="800" y2="95" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="800" y1="141" x2="800" y2="175" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* HĐQT -> Ban Kiểm Soát */}
            <line x1="950" y1="118" x2="1210" y2="118" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* 1. Branch Sang Trái: TGĐ -> PTGĐ Left */}
            <line x1="650" y1="198" x2="260" y2="198" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="260" y1="221" x2="260" y2="335" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* 2. Branch Sang Phải: TGĐ -> PTGĐ Right */}
            <line x1="950" y1="198" x2="1340" y2="198" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="1340" y1="221" x2="1340" y2="320" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            {/* Fork under PTGĐ Right */}
            <line x1="1220" y1="320" x2="1460" y2="320" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="1220" y1="320" x2="1220" y2="335" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="1460" y1="320" x2="1460" y2="335" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* 3. Branch Xuống Giữa (Ngắn hơn): TGĐ -> P. Tổng hợp & P. Tài chính kế toán */}
            <line x1="800" y1="221" x2="800" y2="248" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="630" y1="248" x2="970" y2="248" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="630" y1="248" x2="630" y2="260" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            <line x1="970" y1="248" x2="970" y2="260" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* 4. Center Main Line straight down to Bottom Row Bus */}
            <line x1="800" y1="221" x2="800" y2="425" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            {/* Horizontal Bus Line spanning bottom row */}
            <line x1="180" y1="425" x2="1420" y2="425" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* Connectors to Bottom Units */}
            {/* Unit 1: CN TP. HCM */}
            <line x1="180" y1="425" x2="180" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            {/* Unit 3: TT Tư vấn Dự án */}
            <line x1="800" y1="425" x2="800" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            {/* Unit 4: TT Phần mềm Xây dựng */}
            <line x1="1110" y1="425" x2="1110" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            {/* Unit 5: TT Tư vấn PTPBV & GP CNKT */}
            <line x1="1420" y1="425" x2="1420" y2="460" stroke="#334155" strokeWidth="1" strokeLinecap="round" />

            {/* ================= BOX NODES (ORANGE THEME) ================= */}
            {/* LEVEL 1: ĐẠI HỘI ĐỒNG CỔ ĐÔNG */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="650" y="20" width="300" height="45" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="800" y="48" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                {isEn ? 'GENERAL MEETING OF SHAREHOLDERS' : 'ĐẠI HỘI ĐỒNG CỔ ĐÔNG'}
              </text>
            </g>

            {/* BAN KIỂM SOÁT */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="1210" y="95" width="260" height="46" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
              <text x="1340" y="123" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                {isEn ? 'SUPERVISORY BOARD' : 'BAN KIỂM SOÁT'}
              </text>
            </g>

            {/* LEVEL 2: HỘI ĐỒNG QUẢN TRỊ */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="650" y="95" width="300" height="46" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="800" y="123" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                {isEn ? 'BOARD OF DIRECTORS' : 'HỘI ĐỒNG QUẢN TRỊ'}
              </text>
            </g>

            {/* LEVEL 3: TỔNG GIÁM ĐỐC */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="650" y="175" width="300" height="46" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="800" y="203" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                {isEn ? 'GENERAL DIRECTOR' : 'TỔNG GIÁM ĐỐC'}
              </text>
            </g>

            {/* LEFT: PHÓ TỔNG GIÁM ĐỐC */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="130" y="177" width="260" height="44" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
              <text x="260" y="204" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                {isEn ? 'DEPUTY GENERAL DIRECTOR' : 'PHÓ TỔNG GIÁM ĐỐC'}
              </text>
            </g>

            {/* RIGHT: PHÓ TỔNG GIÁM ĐỐC */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="1210" y="177" width="260" height="44" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
              <text x="1340" y="204" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                {isEn ? 'DEPUTY GENERAL DIRECTOR' : 'PHÓ TỔNG GIÁM ĐỐC'}
              </text>
            </g>

            {/* MIDDLE LEVEL SUB-UNITS */}
            {/* Middle-Left: P. TỔNG HỢP */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="530" y="260" width="200" height="54" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="630" y="293" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'ADMINISTRATION DEPT' : 'P. TỔNG HỢP'}
              </text>
            </g>

            {/* Middle-Right: P. TÀI CHÍNH KẾ TOÁN */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="870" y="260" width="200" height="54" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="970" y="293" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'FINANCE & ACCOUNTING DEPT' : 'P. TÀI CHÍNH KẾ TOÁN'}
              </text>
            </g>

            {/* Left sub-unit: TT. TƯ VẤN THIẾT KẾ XÂY DỰNG */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="120" y="335" width="280" height="58" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
              <text x="260" y="362" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'CONSTRUCTION DESIGN' : 'TT. TƯ VẤN THIẾT KẾ'}
              </text>
              <text x="260" y="378" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'CONSULTING CENTER' : 'XÂY DỰNG'}
              </text>
            </g>

            {/* Right sub-unit 1: TTGP. PHẦN MỀM NHẬP KHẨU TRONG XD */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="1115" y="335" width="210" height="58" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
              <text x="1220" y="362" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'IMPORTED SOFTWARE' : 'TTGP. PHẦN MỀM NHẬP KHẨU'}
              </text>
              <text x="1220" y="378" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'SOLUTIONS CENTER' : 'TRONG XD'}
              </text>
            </g>

            {/* Right sub-unit 2: TT. TƯ VẤN BIM & SỐ HÓA CÔNG TRÌNH */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="1355" y="335" width="210" height="58" rx="4" fill="#fc6435" stroke="#d93800" strokeWidth="1.5" />
              <text x="1460" y="362" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'BIM & DIGITALIZATION' : 'TT. TƯ VẤN BIM &'}
              </text>
              <text x="1460" y="378" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'CONSULTING CENTER' : 'SỐ HÓA CÔNG TRÌNH'}
              </text>
            </g>

            {/* ================= BOTTOM ROW UNITS ================= */}
            {/* 1. CN. TP HỒ CHÍ MINH */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="70" y="460" width="220" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="180" y="499" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'HO CHI MINH CITY BRANCH' : 'CN. TP HỒ CHÍ MINH'}
              </text>
            </g>

            {/* 2. TTGP. PHẦN MỀM & THIẾT BỊ CÔNG NGHỆ */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="375" y="460" width="230" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="490" y="491" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'SOFTWARE & TECH' : 'TTGP. PHẦN MỀM &'}
              </text>
              <text x="490" y="509" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'EQUIPMENT CENTER' : 'THIẾT BỊ CÔNG NGHỆ'}
              </text>
            </g>

            {/* 3. TT. TƯ VẤN DỰ ÁN */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="690" y="460" width="220" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="800" y="499" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'PROJECT CONSULTING CENTER' : 'TT. TƯ VẤN DỰ ÁN'}
              </text>
            </g>

            {/* 4. TT. PHẦN MỀM XÂY DỰNG */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="1000" y="460" width="220" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="1110" y="499" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
                {isEn ? 'CONSTRUCTION SOFTWARE CENTER' : 'TT. PHẦN MỀM XÂY DỰNG'}
              </text>
            </g>

            {/* 5. TT. TƯ VẤN PTPBV & GIẢI PHÁP CNKT */}
            <g filter="url(#shadow)" className="org-node">
              <rect x="1300" y="460" width="240" height="68" rx="4" fill="#fc5115" stroke="#d93800" strokeWidth="1.5" />
              <text x="1420" y="491" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'SUSTAINABILITY & TECH' : 'TT. TƯ VẤN PTPBV &'}
              </text>
              <text x="1420" y="509" fill="#ffffff" fontSize="11.5" fontWeight="800" textAnchor="middle">
                {isEn ? 'SOLUTIONS CENTER' : 'GIẢI PHÁP CNKT'}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
