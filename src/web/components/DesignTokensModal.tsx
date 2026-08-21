/**
 * CIC Design Tokens Inspector & Viewer Modal
 * 
 * Interactive visual documentation of Design Tokens:
 * Colors, Spacing, Radius, Shadow, Typography, and CSS/JSON exports.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Palette, Maximize2, CircleCheck, Sparkles, Layers, Type, Code } from 'lucide-react';
import { designTokens, generateCssVariables } from '@shared/tokens';

interface DesignTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignTokensModal: React.FC<DesignTokensModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'spacing' | 'radius' | 'shadow' | 'typography' | 'code'>('colors');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[10px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-orange-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Hệ Thống Design Tokens (CIC System)
              </h2>
              <p className="text-xs text-slate-400">
                Phân tích & Chuẩn hóa Design System theo Tokens Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[8px] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {[
            { id: 'colors', label: '1. Colors', icon: <Palette size={16} /> },
            { id: 'spacing', label: '2. Spacing', icon: <Maximize2 size={16} /> },
            { id: 'radius', label: '3. Radius', icon: <CircleCheck size={16} /> },
            { id: 'shadow', label: '4. Shadows', icon: <Layers size={16} /> },
            { id: 'typography', label: '5. Typography', icon: <Type size={16} /> },
            { id: 'code', label: 'Export (CSS/JSON)', icon: <Code size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase rounded-[8px] transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50 custom-scrollbar">

          {/* TAB 1: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-8">
              {/* Brand Orange Palette */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                  Brand Orange Scale (Primary Token Palette)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {Object.entries(designTokens.colors.primitive.orange).map(([shade, hex]) => (
                    <div
                      key={shade}
                      onClick={() => handleCopy(hex, `orange-${shade}`)}
                      className="bg-white p-3 rounded-[10px] border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div
                        className="h-14 rounded-[8px] mb-2 flex items-center justify-center relative border border-black/5"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-[4px] flex items-center gap-1">
                          {copiedCode === `orange-${shade}` ? <Check size={12} /> : <Copy size={12} />} Copy
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">orange-{shade}</div>
                      <div className="text-[11px] font-mono text-slate-500 uppercase">{hex}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slate Neutrals */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                  Slate Neutrals (Surface & Typography)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {Object.entries(designTokens.colors.primitive.slate).map(([shade, hex]) => (
                    <div
                      key={shade}
                      onClick={() => handleCopy(hex, `slate-${shade}`)}
                      className="bg-white p-3 rounded-[10px] border border-slate-200 shadow-sm hover:border-slate-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div
                        className="h-14 rounded-[8px] mb-2 flex items-center justify-center border border-black/5"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-[4px] flex items-center gap-1">
                          {copiedCode === `slate-${shade}` ? <Check size={12} /> : <Copy size={12} />} Copy
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">slate-{shade}</div>
                      <div className="text-[11px] font-mono text-slate-500 uppercase">{hex}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Color Tokens Table */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Semantic Color Tokens (Functional Roles)
                </h3>
                <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-xs font-black uppercase border-b border-slate-200">
                        <th className="p-3">Category</th>
                        <th className="p-3">Token Name</th>
                        <th className="p-3">Value</th>
                        <th className="p-3">Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-bold">
                      <tr>
                        <td className="p-3 text-slate-500">Brand</td>
                        <td className="p-3 text-orange-600 font-mono">semanticColors.brand.primary</td>
                        <td className="p-3 font-mono">{designTokens.colors.semantic.brand.primary}</td>
                        <td className="p-3"><div className="w-8 h-6 rounded-[6px] bg-orange-600 border"></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-500">Brand Navy</td>
                        <td className="p-3 text-slate-900 font-mono">semanticColors.brand.navy</td>
                        <td className="p-3 font-mono">{designTokens.colors.semantic.brand.navy}</td>
                        <td className="p-3"><div className="w-8 h-6 rounded-[6px] bg-[#0b1b36] border"></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-500">Text Primary</td>
                        <td className="p-3 text-slate-900 font-mono">semanticColors.text.primary</td>
                        <td className="p-3 font-mono">{designTokens.colors.semantic.text.primary}</td>
                        <td className="p-3"><div className="w-8 h-6 rounded-[6px] bg-slate-900 border"></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-500">Text Secondary</td>
                        <td className="p-3 text-slate-600 font-mono">semanticColors.text.secondary</td>
                        <td className="p-3 font-mono">{designTokens.colors.semantic.text.secondary}</td>
                        <td className="p-3"><div className="w-8 h-6 rounded-[6px] bg-slate-600 border"></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-500">Border Default</td>
                        <td className="p-3 text-slate-700 font-mono">semanticColors.border.default</td>
                        <td className="p-3 font-mono">{designTokens.colors.semantic.border.default}</td>
                        <td className="p-3"><div className="w-8 h-6 rounded-[6px] bg-slate-200 border"></div></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-500">Feedback Success</td>
                        <td className="p-3 text-green-600 font-mono">semanticColors.feedback.success</td>
                        <td className="p-3 font-mono">{designTokens.colors.semantic.feedback.success}</td>
                        <td className="p-3"><div className="w-8 h-6 rounded-[6px] bg-green-600 border"></div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPACING */}
          {activeTab === 'spacing' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Spacing Scale (Pixel & Rem Metric System)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(designTokens.spacing.scale).map(([key, px]) => (
                    <div key={key} className="bg-white p-4 rounded-[10px] border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="w-12 text-xs font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-[6px] text-center">
                          {key}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">{px}</span>
                      </div>
                      <div className="h-4 bg-orange-600/30 rounded-[4px] border border-orange-600" style={{ width: px === '0px' ? '2px' : px }}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Padding & Section Rhythm */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Semantic Layout & Section Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase mb-2">Section Rhythm</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Standard Section: 48px (py-12)</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Spacious Section: 64px (py-16)</div>
                    <div className="text-sm font-bold text-slate-900">Hero Section: 96px (py-24)</div>
                  </div>
                  <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase mb-2">Container Padding</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Mobile: 16px (px-4)</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Tablet: 24px (px-6)</div>
                    <div className="text-sm font-bold text-slate-900">Desktop: 32px (px-8)</div>
                  </div>
                  <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-sm">
                    <div className="text-xs font-black text-slate-400 uppercase mb-2">Grid & Flex Gaps</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Tight: 8px (gap-2)</div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Standard: 16px (gap-4)</div>
                    <div className="text-sm font-bold text-slate-900">Wide: 24px (gap-6)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RADIUS */}
          {activeTab === 'radius' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Border Radius Tokens (Corner Rules)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { key: 'md (8px)', val: '8px', usage: 'Buttons, Inputs, Selects, Tags', bg: 'bg-orange-600 text-white' },
                    { key: 'lg (10px)', val: '10px', usage: 'Cards, Containers, Modals, Images', bg: 'bg-slate-900 text-white' },
                    { key: 'full (9999px)', val: '9999px', usage: 'Status Dots, Avatars, Pill Tags', bg: 'bg-green-600 text-white' },
                    { key: 'sm (4px)', val: '4px', usage: 'Checkboxes, Micro Badges', bg: 'bg-slate-200 text-slate-800' },
                    { key: 'xl (12px)', val: '12px', usage: 'Floating Drawers', bg: 'bg-blue-600 text-white' },
                    { key: '2xl (16px)', val: '16px', usage: 'Large Backdrop Windows', bg: 'bg-amber-600 text-white' },
                  ].map((item) => (
                    <div key={item.key} className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="mb-4">
                        <div className="text-xs font-black uppercase text-orange-600 mb-1">{item.key}</div>
                        <div className="text-xs text-slate-600 font-medium">{item.usage}</div>
                      </div>
                      <div className={`p-4 text-center font-bold text-xs shadow-sm ${item.bg}`} style={{ borderRadius: item.val }}>
                        Radius: {item.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula & Rule */}
              <div className="bg-orange-50 p-6 rounded-[10px] border border-orange-200">
                <h4 className="text-sm font-black uppercase tracking-wider text-orange-900 mb-2">
                  Quy Tắc Lồng Nhau (Nested Radius Metric Rule)
                </h4>
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                  Bán kính góc bên trong = Bán kính góc bên ngoài - Khoảng cách padding.<br />
                  <span className="font-mono font-bold mt-1 inline-block">Inner Radius = Outer Radius - Padding</span>
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SHADOWS */}
          {activeTab === 'shadow' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Elevation & Shadow Scale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(designTokens.shadow.scale).map(([key, value]) => (
                    <div key={key} className="bg-white p-6 rounded-[10px] border border-slate-200 flex flex-col justify-between" style={{ boxShadow: value }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase text-orange-600">shadow-{key}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 bg-slate-100 p-2 rounded-[6px] overflow-x-auto">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  High-Tech Brand Glow Shadows
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 p-6 rounded-[10px] border border-orange-600/30 text-white" style={{ boxShadow: designTokens.shadow.brand.buttonGlow }}>
                    <div className="text-xs font-black uppercase text-orange-400 mb-2">Brand Button Glow</div>
                    <div className="text-[11px] font-mono text-slate-300">0 20px 50px rgba(234, 88, 12, 0.3)</div>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-[10px] border border-orange-600/30 text-white" style={{ boxShadow: designTokens.shadow.brand.cardGlowHeavy }}>
                    <div className="text-xs font-black uppercase text-orange-400 mb-2">Brand Card Glow Heavy</div>
                    <div className="text-[11px] font-mono text-slate-300">0 0 30px rgba(234, 88, 12, 0.35)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Font Family & Scale (Roboto)
                </h3>
                <div className="space-y-4">
                  {(Object.entries(designTokens.typography.fontSizes) as [string, { fontSize: string; lineHeight: string }][]).map(([name, conf]) => (
                    <div key={name} className="bg-white p-4 rounded-[10px] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="w-16 text-xs font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-[6px] text-center">
                          {name}
                        </span>
                        <div>
                          <span className="text-xs font-mono font-bold text-slate-500 mr-3">{conf.fontSize}</span>
                          <span className="text-xs text-slate-400 font-mono">lh: {conf.lineHeight}</span>
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 truncate" style={{ fontSize: conf.fontSize, lineHeight: conf.lineHeight }}>
                        Cung cấp giải pháp công nghệ kỹ thuật CIC
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
                  Font Weights
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(designTokens.typography.fontWeights).map(([weightName, weightVal]) => (
                    <div key={weightName} className="bg-white p-4 rounded-[10px] border border-slate-200 text-center">
                      <div className="text-xs font-mono text-slate-400 mb-1">{weightName} ({weightVal})</div>
                      <div className="text-base text-slate-900" style={{ fontWeight: weightVal }}>CIC Technology</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CODE EXPORT */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Generated CSS Root Custom Properties
                  </h3>
                  <button
                    onClick={() => handleCopy(generateCssVariables(), 'css-vars')}
                    className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase rounded-[6px] flex items-center gap-1.5 hover:bg-orange-700 transition-all"
                  >
                    {copiedCode === 'css-vars' ? <Check size={14} /> : <Copy size={14} />} Copy CSS
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-[10px] text-xs font-mono overflow-x-auto max-h-60 custom-scrollbar">
                  {generateCssVariables()}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    JSON Tokens Structure
                  </h3>
                  <button
                    onClick={() => handleCopy(JSON.stringify(designTokens, null, 2), 'json-tokens')}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold uppercase rounded-[6px] flex items-center gap-1.5 hover:bg-slate-800 transition-all"
                  >
                    {copiedCode === 'json-tokens' ? <Check size={14} /> : <Copy size={14} />} Copy JSON
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-[10px] text-xs font-mono overflow-x-auto max-h-64 custom-scrollbar">
                  {JSON.stringify(designTokens, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Design Token System v1.0 • CIC Corporate UI Standard</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-[8px] font-black uppercase hover:bg-slate-800 transition-all"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
