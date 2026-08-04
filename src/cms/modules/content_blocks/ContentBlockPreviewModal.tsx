import React, { useState } from 'react';
import { X, Monitor, Laptop, Tablet, Smartphone, Globe, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
import { BlockItem } from './types';

interface ContentBlockPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: BlockItem | null;
  initialPagePath?: string;
}

export const ContentBlockPreviewModal: React.FC<ContentBlockPreviewModalProps> = ({
  isOpen,
  onClose,
  block,
  initialPagePath = '/',
}) => {
  const [device, setDevice] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  const [selectedPath, setSelectedPath] = useState(initialPagePath);
  const [selectedLocale, setSelectedLocale] = useState<'vi' | 'en' | 'ja'>('vi');

  if (!isOpen || !block) return null;

  const deviceWidths = {
    desktop: 'w-full max-w-5xl',
    laptop: 'w-[880px]',
    tablet: 'w-[640px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      {/* Modal Card */}
      <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white flex-wrap gap-2">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-md border border-orange-800/50 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Context Preview
            </span>
            <div className="hidden sm:block">
              <h3 className="text-sm font-bold truncate max-w-xs">{block.title}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {block.code_alias} • {block.type}
              </p>
            </div>
          </div>

          {/* Center Device Toggles */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop (1280px)' },
              { id: 'laptop', icon: Laptop, label: 'Laptop (1024px)' },
              { id: 'tablet', icon: Tablet, label: 'Tablet (768px)' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile (375px)' },
            ].map((d) => {
              const IconComp = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id as any)}
                  title={d.label}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    device === d.id
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="hidden md:inline">{d.id}</span>
                </button>
              );
            })}
          </div>

          {/* Right Selector Controls */}
          <div className="flex items-center gap-3">
            {/* Locale switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              {(['vi', 'en', 'ja'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocale(loc)}
                  className={`px-2 py-1 rounded uppercase font-bold transition-colors ${
                    selectedLocale === loc
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Page context switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300">
              <Globe className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <select
                value={selectedPath}
                onChange={(e) => setSelectedPath(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none"
              >
                <option value="/" className="bg-slate-900">Trang chủ (/)</option>
                <option value="/products" className="bg-slate-900">Danh mục Sản phẩm (/products)</option>
                <option value="/products/industrial" className="bg-slate-900">Sản phẩm Chi tiết (/products/*)</option>
                <option value="/services" className="bg-slate-900">Dịch vụ (/services)</option>
                <option value="/about-us" className="bg-slate-900">Giới thiệu (/about-us)</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Render Frame */}
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto flex justify-center items-start">
          <div
            className={`${deviceWidths[device]} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden min-h-[500px] flex flex-col`}
          >
            {/* Mock Web Browser Bar */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-md px-3 py-1 font-mono text-[11px] text-slate-300 flex items-center gap-2 max-w-md w-full justify-center">
                <span>https://mycompany.com{selectedPath}</span>
              </div>
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Simulated Live Web Page Body */}
            <div className="flex-1 bg-slate-900 text-slate-100 p-6 space-y-6">
              {/* Header Placeholder */}
              <div className="border border-dashed border-slate-800 rounded-xl p-3 text-center text-xs text-slate-500 uppercase tracking-widest font-mono">
                [ Header & Top Navigation Bar ]
              </div>

              {/* RENDER THE ACTUAL BLOCK STYLING */}
              <div className="my-4">
                <div className="text-[10px] uppercase font-bold text-orange-400 tracking-wider mb-2 flex items-center justify-between">
                  <span>Khối đang Preview: {block.placement_name}</span>
                  <span className="bg-orange-950/80 border border-orange-800 text-orange-300 px-2 py-0.5 rounded font-mono">
                    {block.layout_variant}
                  </span>
                </div>

                {/* Block Card Container */}
                <div
                  className={`rounded-2xl p-6 shadow-xl border transition-all ${
                    block.layout_variant === 'fullwidth_dark'
                      ? 'bg-slate-950 border-orange-500/40 text-white'
                      : block.layout_variant === 'light_neutral'
                      ? 'bg-slate-100 text-slate-900 border-slate-300'
                      : 'bg-slate-800 border-slate-700 text-slate-100'
                  }`}
                >
                  {/* Headline & Subtitle */}
                  {block.show_title && (
                    <div className="mb-4">
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                        {block.content.headline || block.title}
                      </h2>
                      {block.content.subtitle && (
                        <p className="text-sm mt-1 opacity-80 leading-relaxed">
                          {block.content.subtitle}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Body Content depending on Type */}
                  {block.type === 'hero_cta' && (
                    <div className="grid md:grid-cols-2 gap-6 items-center mt-4">
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed opacity-90">
                          Giải pháp tự động hóa giúp nâng cao hiệu suất vận hành nhà máy tối ưu 45%.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                          {block.content.cta_text && (
                            <button className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm shadow-lg transition-colors">
                              {block.content.cta_text}
                            </button>
                          )}
                          {block.content.secondary_cta_text && (
                            <button className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl text-sm transition-colors">
                              {block.content.secondary_cta_text}
                            </button>
                          )}
                        </div>
                      </div>
                      {block.content.media_url && (
                        <img
                          src={block.content.media_url}
                          alt="Hero media"
                          className="w-full h-48 object-cover rounded-xl border border-slate-700/50 shadow-md"
                        />
                      )}
                    </div>
                  )}

                  {block.type === 'announcement_bar' && (
                    <div className="flex items-center justify-between gap-4 py-2 px-3 bg-orange-600/20 border border-orange-500/30 rounded-xl">
                      <p className="text-sm font-medium">{block.content.headline}</p>
                      {block.content.cta_text && (
                        <button className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shrink-0">
                          {block.content.cta_text}
                        </button>
                      )}
                    </div>
                  )}

                  {block.type === 'feature_grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {block.content.items_list?.map((item) => (
                        <div key={item.id} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                          <h4 className="font-bold text-sm text-orange-400">{item.title}</h4>
                          <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {block.type === 'faq_accordion' && (
                    <div className="space-y-3 mt-4">
                      {block.content.items_list?.map((item) => (
                        <details key={item.id} className="bg-slate-800/80 rounded-xl border border-slate-700 p-3 text-xs">
                          <summary className="font-bold text-slate-200 cursor-pointer">{item.title}</summary>
                          <p className="text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                        </details>
                      ))}
                    </div>
                  )}

                  {block.type === 'module_embed' && (
                    <div className="p-4 bg-slate-950 rounded-xl border border-dashed border-slate-700 text-center text-xs text-slate-400 font-mono my-2">
                      [ Module Embed Container: {block.content.embed_code ? 'HTML/Iframe Loaded' : 'Empty'} ]
                    </div>
                  )}
                </div>
              </div>

              {/* Page Content Placeholder */}
              <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-xs text-slate-600">
                [ Nội dung mặc định của trang web - Section Body ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
