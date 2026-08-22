import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { ProjectsView } from '../../../web/components/ProjectsView';
import type { DetailedProject } from '../../../web/features/projects/projectsData';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../components/ResponsiveWebsitePreviewFrame';
import type { CmsProject } from './types';

interface Props { project: CmsProject | null; onClose: () => void }

export const ProjectPreviewModal: React.FC<Props> = ({ project, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!project) return null;
  const period = project.start_year ? (project.is_ongoing ? `${project.start_year} - Hiện tại` : project.end_year && project.end_year !== project.start_year ? `${project.start_year} - ${project.end_year}` : String(project.start_year)) : 'Chưa cập nhật';
  const previewProject: DetailedProject = {
    id: `cms-preview-${project.id}`, name: project.title || 'Chưa có tiêu đề', tagline: project.tagline,
    shortDesc: project.summary, htmlContent: project.content, sector: project.sector || 'Dự án CIC',
    solution: project.solution || 'Đang cập nhật', customer: project.customer_name || 'Đang cập nhật',
    location: project.location || 'Đang cập nhật', time: period, img: project.image, featured: project.is_featured,
    scope: [], appliedSolutions: project.technologies, results: [], gallery: project.image ? [project.image] : [],
  };
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950/85" role="dialog" aria-modal="true" aria-label="Xem trước dự án">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-5 text-white">
        <div><p className="text-xs font-bold">Xem trước trên Website</p><p className="text-[10px] text-slate-400">/du-an/{project.alias}</p></div>
        <div className="flex items-center gap-3"><div className="flex rounded-lg bg-slate-800 p-1">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setDevice(value)} className={`rounded-md p-1.5 ${device === value ? 'bg-orange-600' : 'text-slate-400'}`} aria-label={`Xem ${value}`}><Icon className="size-4" /></button>)}</div><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button></div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-800 p-5">
        <ResponsiveWebsitePreviewFrame device={device}>
          <PublicSitePreviewHeader view="projects" />
          <ProjectsView initialProjectId={previewProject.id} previewProject={previewProject} onNavigateToService={() => undefined} onNavigateToProduct={() => undefined} onNavigateHome={() => undefined} />
          <PublicSitePreviewFooter />
        </ResponsiveWebsitePreviewFrame>
      </div>
    </div>
  );
};
