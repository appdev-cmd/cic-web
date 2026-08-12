import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QualityCheck { label: string; passed: boolean }

export const ContentQualityPanel: React.FC<{ title?: string; checks: QualityCheck[] }> = ({ title = 'Chất lượng dữ liệu', checks }) => {
  const passed = checks.filter((item) => item.passed).length;
  const score = checks.length ? Math.round((passed / checks.length) * 100) : 0;
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">{title}</h3><p className="mt-1 text-[11px] text-slate-500">Kiểm tra trực tiếp, không lưu thêm field vào dữ liệu.</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${score === 100 ? 'bg-emerald-100 text-emerald-700' : score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{score}/100</span></div>
    <div className="space-y-2 p-4">{checks.map((item) => <div key={item.label} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs dark:bg-slate-800/70">{item.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}<span className={item.passed ? 'text-slate-700 dark:text-slate-200' : 'font-semibold text-amber-700 dark:text-amber-400'}>{item.label}</span></div>)}</div>
  </section>;
};
