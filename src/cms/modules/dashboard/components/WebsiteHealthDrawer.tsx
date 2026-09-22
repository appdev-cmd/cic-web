'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Database,
  Search,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Activity,
} from 'lucide-react';
import type { WebsiteHealthSummary, WebsiteHealthCheckItem } from '@/cms/types';
import type { CmsLocale } from '@/cms/data/CmsDataSource';

interface WebsiteHealthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  health?: WebsiteHealthSummary;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const WebsiteHealthDrawer: React.FC<WebsiteHealthDrawerProps> = ({
  isOpen,
  onClose,
  health,
  workspaceLocale,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const isEn = workspaceLocale === 'en';
  const score = health?.score ?? 80;
  const items = health?.items ?? [];

  const highItems = items.filter((i) => i.severity === 'high');
  const mediumItems = items.filter((i) => i.severity === 'medium');
  const lowItems = items.filter((i) => i.severity === 'low');
  const infoPassItems = items.filter((i) => i.severity === 'info' || i.status === 'pass');

  const getScoreBadge = (sc: number) => {
    if (sc >= 90) {
      return {
        label: isEn ? 'Optimal' : 'Rất tốt',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
      };
    }
    if (sc >= 75) {
      return {
        label: isEn ? 'Needs Attention' : 'Cần chú ý',
        bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
      };
    }
    return {
      label: isEn ? 'Action Required' : 'Cần xử lý',
      bg: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60',
    };
  };

  const scoreBadge = getScoreBadge(score);

  const renderCheckItem = (item: WebsiteHealthCheckItem) => {
    return (
      <div
        key={item.id}
        className="p-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-3"
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="mt-0.5 shrink-0">
            {item.status === 'pass' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : item.severity === 'high' ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white text-xs leading-snug truncate">
                {item.title}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                    item.severity === 'high'
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {item.actionPath && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate(item.actionPath!, item.title);
            }}
            className="shrink-0 px-2 py-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 rounded-md transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <span>{item.actionLabel || (isEn ? 'Resolve' : 'Xử lý')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEn ? 'Operational Health Diagnostics' : 'Báo Cáo Kiểm Tra Sức Khỏe'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isEn ? '8 automated operational checks across database' : '8 tiêu chuẩn đo lường trực tiếp từ cơ sở dữ liệu'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Score Header Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {score} <span className="text-xs text-slate-400 font-sans font-normal">/ 100</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {score >= 90 ? (isEn ? 'Healthy System' : 'Hệ thống vận hành tốt') : (isEn ? 'Action needed' : 'Cần tối ưu hóa')}
                </span>
                <p className="text-[11px] text-slate-400">
                  {health?.passedCount ?? 4} đạt chuẩn · {health?.attentionCount ?? 4} cần chú ý
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${scoreBadge.bg}`}>
              {scoreBadge.label}
            </span>
          </div>

          {/* High Severity Items */}
          {highItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {isEn ? 'Action Required (High SLA)' : 'Cần xử lý ngay (Ưu tiên cao)'}
                </span>
                <span className="text-[10px] font-bold font-mono text-red-600 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.2 rounded">
                  {highItems.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                {highItems.map(renderCheckItem)}
              </div>
            </div>
          )}

          {/* Medium Severity Items */}
          {mediumItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" />
                  {isEn ? 'Optimization Needed' : 'Cần tối ưu nội dung & media'}
                </span>
                <span className="text-[10px] font-bold font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">
                  {mediumItems.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                {mediumItems.map(renderCheckItem)}
              </div>
            </div>
          )}

          {/* Pass Items */}
          {infoPassItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  {isEn ? 'System Checks Passed' : 'Kiểm tra hệ thống đạt chuẩn'}
                </span>
                <span className="text-[10px] font-bold font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                  {infoPassItems.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                {infoPassItems.map(renderCheckItem)}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isEn ? 'Deterministic audit engine' : 'Bộ đánh giá vận hành nội bộ'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            {isEn ? 'Close Panel' : 'Đóng bảng'}
          </button>
        </div>
      </div>
    </div>
  );
};
