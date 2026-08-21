import React from 'react';
import { CalendarDays, MapPin, X } from 'lucide-react';
import type { CmsProject } from './types';

interface Props {
  project: CmsProject | null;
  onClose: () => void;
}

export const ProjectPreviewModal: React.FC<Props> = ({ project, onClose }) => {
  if (!project) return null;

  const period = project.start_year
    ? project.is_ongoing
      ? `${project.start_year} - Hiện tại`
      : project.end_year && project.end_year !== project.start_year
        ? `${project.start_year} - ${project.end_year}`
        : String(project.start_year)
    : 'Chưa cập nhật';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-label="Xem trước dự án">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600">Xem trước dự án</p>
            <h2 className="mt-1 font-black text-slate-900 dark:text-white">{project.title || 'Chưa có tiêu đề'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button>
        </header>
        <article>
          {project.image && <img src={project.image} alt="" className="aspect-[16/7] w-full object-cover" />}
          <div className="space-y-5 p-6">
            {project.tagline && <p className="text-lg font-semibold text-orange-600">{project.tagline}</p>}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
              {project.location && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{project.location}</span>}
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />{period}</span>
            </div>
            {project.summary && <p className="leading-7 text-slate-600 dark:text-slate-300">{project.summary}</p>}
            <div className="ck-content" dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>
        </article>
      </div>
    </div>
  );
};
