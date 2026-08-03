import React from 'react';

export const CmsFooter: React.FC = () => {
  return (
    <footer className="mt-12 py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          CIC CMS v2.4.0-build.882
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Status: </span>
          <strong className="text-emerald-600 dark:text-emerald-400">Online (24ms)</strong>
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span>
          Môi trường: <strong className="text-slate-700 dark:text-slate-200">PRODUCTION</strong>
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span>
          Đồng bộ: <strong className="text-slate-700 dark:text-slate-200">Vừa xong</strong>
        </span>
      </div>

      <div>
        <span>© 2026 Công ty CP Công nghệ và Tư vấn CIC (CIC Technology & Engineering)</span>
      </div>
    </footer>
  );
};
