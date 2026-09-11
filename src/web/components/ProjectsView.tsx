'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { getProjectsData, type DetailedProject } from '../features/projects/projectsData';
import { ProjectsRuntimeView } from '../features/projects/ProjectsRuntimeView';
import { ProjectDetailRuntimeView } from '../features/projects/ProjectDetailRuntimeView';
import {
  detailedProjectToListItem,
  detailedProjectToDetail,
} from '../features/projects/projectAdapters';

interface ProjectsViewProps {
  key?: string | number;
  initialProjectId: string | null;
  onNavigateToService: (serviceId: string) => void;
  onNavigateToProduct: (productId: number) => void;
  onNavigateHome: () => void;
  onOpenConsultation?: () => void;
  previewProject?: DetailedProject;
}

export function ProjectsView({
  initialProjectId,
  onNavigateToService,
  onNavigateToProduct,
  onNavigateHome,
  onOpenConsultation,
  previewProject,
}: ProjectsViewProps) {
  const projectsData = useMemo(() => {
    const projects = getProjectsData();
    return previewProject ? [previewProject, ...projects.filter((item) => item.id !== previewProject.id)] : projects;
  }, [previewProject]);

  const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProjectId);

  // Sync with initial project ID from parent
  useEffect(() => {
    setActiveProjectId(initialProjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialProjectId]);

  const activeProject = useMemo(() => {
    if (!activeProjectId) return null;
    return (
      projectsData.find(
        (p) =>
          p.id === activeProjectId ||
          (activeProjectId === '1' && p.id === 'landmark-81-bim') ||
          (activeProjectId === '2' && p.id === 'cao-toc-bac-nam-twin') ||
          (activeProjectId === '3' && p.id === 'dien-gio-mui-dinh') ||
          (activeProjectId === '4' &&
            (p.id === 'ham-duong-bo-deo-ca-pro' || p.id === 'nha-may-thep-hoa-phat-bim'))
      ) || null
    );
  }, [activeProjectId, projectsData]);

  // Convert to ViewModels
  const listItems = useMemo(
    () => projectsData.map(detailedProjectToListItem),
    [projectsData]
  );

  const activeDetailViewModel = useMemo(() => {
    if (!activeProject) return null;
    return detailedProjectToDetail(activeProject, projectsData);
  }, [activeProject, projectsData]);

  if (activeDetailViewModel) {
    return (
      <ProjectDetailRuntimeView
        project={activeDetailViewModel}
        onBack={() => {
          setActiveProjectId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={onNavigateHome}
        onNavigateToProduct={(id) => onNavigateToProduct(Number(id))}
        onNavigateToService={onNavigateToService}
        onOpenConsultation={onOpenConsultation}
      />
    );
  }

  return (
    <ProjectsRuntimeView
      projects={listItems}
      onSelectProject={(id) => {
        setActiveProjectId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}
