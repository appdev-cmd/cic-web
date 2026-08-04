import React from 'react';

export const CmsFooter: React.FC = () => {
  return (
    <footer className="mt-12 py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          CIC CMS
        </span>
      </div>

      <div>
        <span>© 2026 Công ty CP Công nghệ và Tư vấn CIC (CIC Technology & Engineering)</span>
      </div>
    </footer>
  );
};
