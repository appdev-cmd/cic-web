import React from 'react';
import { LayoutDashboard, FileText, Package, Calendar, Settings, Users, ArrowUpRight } from 'lucide-react';
import { designTokens } from '@shared/tokens';

export const CmsDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-orange-500" />
              Hệ thống Quản trị Content (CMS) - CIC Technology
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Khu vực quản trị nội dung website, bài viết, sản phẩm và dịch vụ.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold rounded-full">
              Chế độ chuẩn bị cấu trúc
            </span>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tổng bài viết & tin tức', count: '128', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Sản phẩm phần mềm', count: '45', icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'Sự kiện & Hội thảo', count: '18', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Yêu cầu tư vấn mới', count: '24', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">{stat.count}</span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                    +12% <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice Placeholder */}
        <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-8 text-center space-y-3">
          <Settings className="w-10 h-10 text-orange-500/80 mx-auto animate-spin-slow" />
          <h3 className="text-lg font-semibold text-white">Khung giao diện CMS đã sẵn sàng</h3>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Cấu trúc thư mục đã được tách bạch độc lập giữa <code className="text-orange-400 bg-slate-900 px-1.5 py-0.5 rounded">src/web</code> và <code className="text-orange-400 bg-slate-900 px-1.5 py-0.5 rounded">src/cms</code>, sử dụng chung Bộ Design Tokens tại <code className="text-orange-400 bg-slate-900 px-1.5 py-0.5 rounded">src/shared/tokens</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
