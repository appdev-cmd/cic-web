/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Download,
  Search,
  ExternalLink,
  MapPin,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  Box,
  Leaf,
  ShieldCheck,
  Building2
} from 'lucide-react';

import { partnerBranches, PartnerBranch } from '../data/partnerBranchesData';
import { worldMapPaths } from '../data/worldMapPaths';

// Categories config
const CATEGORIES = [
  { id: 'all', label: 'Tất cả lĩnh vực (77)', icon: Globe, color: 'text-orange-500' },
  { id: 'bim', label: 'BIM & Số hóa Kiến trúc', match: 'BIM', icon: Box, color: 'text-cyan-400' },
  { id: 'structure', label: 'Kết cấu & Cơ khí', match: 'Kết cấu', icon: Cpu, color: 'text-blue-400' },
  { id: 'transport', label: 'Giao thông & Thủy lợi', match: 'Giao thông', icon: Activity, color: 'text-purple-400' },
  { id: 'geo', label: 'Địa kỹ thuật & Mỏ', match: 'Địa kỹ thuật', icon: Layers, color: 'text-amber-400' },
  { id: 'equipment', label: 'Thiết bị, Robot & Drone', match: 'Thiết bị', icon: ShieldCheck, color: 'text-emerald-400' },
  { id: 'netzero', label: 'Net Zero & Bền vững', match: 'Net Zero', icon: Leaf, color: 'text-teal-400' }
];

// Region Tabs
const REGIONS = [
  { id: 'all', label: 'Toàn cầu (20 Quốc gia)', flag: '🌐' },
  { id: 'na', label: 'Bắc Mỹ (22)', match: ['Hoa Kỳ', 'Canada'], flag: '🇺🇸 🇨🇦' },
  { id: 'eu', label: 'Châu Âu (35)', match: ['Đức', 'Vương Quốc Anh', 'Hà Lan', 'Pháp', 'Tây Ban Nha', 'Italia', 'Thụy Sĩ', 'Thụy Điển', 'Na Uy', 'Đan Mạch', 'Séc', 'Ireland', 'Thổ Nhĩ Kỳ'], flag: '🇪🇺' },
  { id: 'ap', label: 'Châu Á & Úc (20)', match: ['Trung Quốc', 'Hàn Quốc', 'Singapore', 'Australia', 'Israel'], flag: '🌏' }
];

// Epicenter Vietnam coordinates in SVG (1000 x 550 viewBox)
const VN_POINT = { x: 795, y: 310 };

export const GlobalPartnerMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredPartner, setHoveredPartner] = useState<PartnerBranch | null>(null);
  const [activePartnerModal, setActivePartnerModal] = useState<PartnerBranch | null>(null);

  // Filtered partners
  const filteredBranches = useMemo(() => {
    return partnerBranches.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (selectedRegion !== 'all') {
        const regObj = REGIONS.find((r) => r.id === selectedRegion);
        if (regObj?.match && !regObj.match.includes(p.country)) {
          return false;
        }
      }

      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj?.match && !p.category.toLowerCase().includes(catObj.match.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  // Unique country pins from filtered branches
  const activeCountryPins = useMemo(() => {
    const pinsMap = new Map<string, { country: string; flag: string; pinX: number; pinY: number; count: number }>();
    filteredBranches.forEach((b) => {
      if (!pinsMap.has(b.country)) {
        pinsMap.set(b.country, {
          country: b.country,
          flag: b.flag,
          pinX: b.pinX,
          pinY: b.pinY,
          count: 0
        });
      }
      pinsMap.get(b.country)!.count += 1;
    });
    return Array.from(pinsMap.values());
  }, [filteredBranches]);

  const handleDownload4K = () => {
    const link = document.createElement('a');
    link.href = '/CIC_Global_Partner_Network_Map_CyberDark_4K.png';
    link.download = 'CIC_Global_Technology_Partner_Network_Map_4K.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl my-8 text-white">
      {/* Background Radiant Tech Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-950 to-slate-950"></div>
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px]"></div>
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Bản đồ Mạng lưới Đối tác Toàn cầu</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              77+ Hãng Công nghệ <span className="text-orange-500">kết nối trực tiếp</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
              Hơn 70 hãng công nghệ đối tác phân bố tại 20 quốc gia, kết nối trực tiếp về Hub Việt Nam (CIC).
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl px-5 py-3 text-center backdrop-blur-md shadow-lg">
              <div className="text-2xl md:text-3xl font-black text-cyan-400">77+</div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Hãng đối tác</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl px-5 py-3 text-center backdrop-blur-md shadow-lg">
              <div className="text-2xl md:text-3xl font-black text-orange-500">20</div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Quốc gia</div>
            </div>
            <button
              onClick={handleDownload4K}
              className="px-4 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-orange-600/25 cursor-pointer shrink-0"
              title="Tải ảnh bản đồ độ phân giải 4K"
            >
              <Download size={16} />
              <span>Tải ảnh 4K</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="py-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-800/80">
          {/* Region Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            {REGIONS.map((r) => {
              const active = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{r.flag}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm nhanh hãng, quốc gia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                  active
                    ? 'bg-slate-800 text-orange-400 border-orange-500/60 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={13} className={active ? 'text-orange-400' : 'text-slate-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== HIGH CONTRAST MAP: LOGO + CLEAR TEXT ==================== */}
        <div className="relative w-full aspect-[16/9] min-h-[600px] md:min-h-[760px] bg-slate-900/95 rounded-2xl border border-slate-700/80 overflow-hidden my-4 shadow-2xl">
          <svg
            viewBox="0 0 1000 550"
            className="w-full h-full object-cover select-none"
          >
            <defs>
              {/* High Contrast Logo Halo Filter (Makes every dark logo pop with crisp white aura) */}
              <filter id="logoHalo" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#ffffff" floodOpacity="0.85" />
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="0.5" />
              </filter>

              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="vnBeam" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff5722" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id="vnBeamActive" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff5722" stopOpacity="1" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* World Landmasses */}
            <g fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" opacity="0.95">
              {worldMapPaths.map((p, idx) => (
                <path key={idx} d={p.d} />
              ))}
            </g>

            {/* 1. Glowing Parabolic Arcs from Vietnam Hub to Country Pins */}
            {activeCountryPins.map((c) => {
              const isHovered = hoveredPartner?.country === c.country;
              const midX = (VN_POINT.x + c.pinX) / 2;
              const midY = Math.min(VN_POINT.y, c.pinY) - Math.abs(VN_POINT.x - c.pinX) * 0.16;

              return (
                <g key={`arc-${c.country}`}>
                  <path
                    d={`M ${VN_POINT.x} ${VN_POINT.y} Q ${midX} ${midY} ${c.pinX} ${c.pinY}`}
                    fill="none"
                    stroke={isHovered ? 'url(#vnBeamActive)' : 'url(#vnBeam)'}
                    strokeWidth={isHovered ? '2.2' : '0.9'}
                    strokeDasharray={isHovered ? '4 2' : '3 3'}
                    opacity={isHovered ? 1 : 0.45}
                    filter={isHovered ? 'url(#laserGlow)' : undefined}
                    className="transition-all duration-300 pointer-events-none"
                  />
                </g>
              );
            })}

            {/* 2. Individual Branch Pointer Lines from Country Pin directly to Logo */}
            {filteredBranches.map((p) => {
              const isHovered = hoveredPartner?.stt === p.stt;
              return (
                <g key={`branch-g-${p.stt}`}>
                  <line
                    x1={p.pinX}
                    y1={p.pinY}
                    x2={p.badgeX}
                    y2={p.badgeY - 3}
                    stroke={isHovered ? '#ff5722' : '#38bdf8'}
                    strokeWidth={isHovered ? '1.8' : '0.7'}
                    strokeDasharray={isHovered ? 'none' : '2 2'}
                    opacity={isHovered ? 1 : 0.55}
                    className="transition-all duration-300 pointer-events-none"
                  />
                  {/* Small Branch End Dot */}
                  <circle
                    cx={p.badgeX}
                    cy={p.badgeY - 3}
                    r={isHovered ? 3 : 1.8}
                    fill={isHovered ? '#ff5722' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}

            {/* 3. Country Pins with Flags */}
            {activeCountryPins.map((c) => (
              <g key={`cpin-${c.country}`} transform={`translate(${c.pinX}, ${c.pinY})`}>
                <circle r="9" fill="#0284c7" opacity="0.35" className="animate-ping" />
                <circle r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
                {/* Small Country Tag */}
                <rect x="-20" y="-14" width="40" height="12" rx="3.5" fill="rgba(15, 23, 42, 0.95)" stroke="#38bdf8" strokeWidth="0.8" />
                <text x="0" y="-5.5" fill="#ffffff" fontSize="7" fontWeight="900" textAnchor="middle">
                  {c.flag} {c.country.substring(0, 5)}
                </text>
              </g>
            ))}

            {/* 4. Partner Logos + High Contrast Names (No Background Box) */}
            {filteredBranches.map((p) => {
              const isHovered = hoveredPartner?.stt === p.stt;
              const w = 34;
              const h = 19;

              return (
                <g
                  key={`partner-logo-${p.stt}`}
                  transform={`translate(${p.badgeX}, ${p.badgeY})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPartner(p)}
                  onMouseLeave={() => setHoveredPartner(null)}
                  onClick={() => setActivePartnerModal(p)}
                >
                  {/* Subtle Soft Glow Behind Logo to make black/dark logos pop */}
                  <circle
                    r="14"
                    fill={isHovered ? 'rgba(255, 87, 34, 0.25)' : 'rgba(255, 255, 255, 0.18)'}
                    filter="blur(3px)"
                  />

                  {/* Logo Image with White Halo filter */}
                  <image
                    href={p.logo}
                    x={-w / 2}
                    y={-h / 2}
                    width={w}
                    height={h}
                    preserveAspectRatio="xMidYMid meet"
                    filter="url(#logoHalo)"
                    style={{
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />

                  {/* High Contrast Name Text (Cartographic Black Stroke + Pure White Fill) */}
                  <text
                    x="0"
                    y={h / 2 + 7.5}
                    fontSize="7.5"
                    fontWeight="900"
                    textAnchor="middle"
                    fill={isHovered ? '#ffedd5' : '#ffffff'}
                    stroke="#020617"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                    style={{
                      paintOrder: 'stroke fill',
                      letterSpacing: '0.3px',
                      textShadow: '0 0 5px rgba(0, 0, 0, 0.9)'
                    }}
                  >
                    {p.shortName}
                  </text>
                </g>
              );
            })}

            {/* 5. VIETNAM EPICENTER HUB (Pulsing Radar) */}
            <g transform={`translate(${VN_POINT.x}, ${VN_POINT.y})`}>
              <circle r="26" fill="none" stroke="#ff5722" strokeWidth="1.2" opacity="0.3" className="animate-ping" />
              <circle r="16" fill="none" stroke="#ff5722" strokeWidth="1.8" opacity="0.6" />
              <circle r="7" fill="#ff5722" stroke="#ffffff" strokeWidth="2" />
              
              {/* Hub Badge */}
              <rect x="-48" y="14" width="96" height="22" rx="7" fill="#ea580c" stroke="#ffffff" strokeWidth="1.2" />
              <text x="0" y="29" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                🇻🇳 VIETNAM (CIC HUB)
              </text>
            </g>
          </svg>

          {/* Live Floating Hologram Tooltip on Hover */}
          <AnimatePresence>
            {hoveredPartner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="absolute bottom-6 left-6 z-30 max-w-sm p-4 rounded-2xl bg-slate-900/95 text-white border-2 border-orange-500 backdrop-blur-xl shadow-2xl flex items-center gap-4 cursor-pointer"
                onClick={() => setActivePartnerModal(hoveredPartner)}
              >
                <div className="w-16 h-12 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0">
                  <img src={hoveredPartner.logo} alt={hoveredPartner.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <span>{hoveredPartner.flag}</span>
                    <span>{hoveredPartner.city} ({hoveredPartner.country})</span>
                  </div>
                  <div className="text-sm font-black text-white truncate">{hoveredPartner.name}</div>
                  <div className="text-[11px] font-semibold text-slate-400 truncate">{hoveredPartner.category}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Detailed Modal on Click */}
        <AnimatePresence>
          {activePartnerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative text-white"
              >
                <button
                  onClick={() => setActivePartnerModal(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-16 rounded-2xl bg-white/10 border border-white/20 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    <img src={activePartnerModal.logo} alt={activePartnerModal.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                      Đối tác công nghệ #{activePartnerModal.stt}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white">{activePartnerModal.name}</h3>
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-orange-500" />
                      <span>{activePartnerModal.flag} {activePartnerModal.city} ({activePartnerModal.country})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-1">Lĩnh vực chuyên môn:</div>
                    <div className="font-bold text-cyan-400">{activePartnerModal.category}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-1">Quan hệ hợp tác với CIC:</div>
                    <div className="text-xs leading-relaxed text-slate-300">
                      CIC là đại diện phân phối chính hãng được ủy quyền, chuyển giao công nghệ, đào tạo và cung cấp dịch vụ kỹ thuật chuyên sâu cho <strong>{activePartnerModal.name}</strong> tại thị trường Việt Nam.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800">
                  {activePartnerModal.url && (
                    <a
                      href={activePartnerModal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-orange-600/20"
                    >
                      <ExternalLink size={14} />
                      <span>Truy cập Website Hãng</span>
                    </a>
                  )}
                  <button
                    onClick={() => setActivePartnerModal(null)}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
