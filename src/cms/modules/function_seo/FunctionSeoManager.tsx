'use client';

import React from 'react';
import {
  FileText,
  Link2,
  ListChecks,
  SearchCheck,
} from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';
import type { FunctionSeoRecord, RedirectRule, SeoHealthMetrics } from '@/features/function-seo/types';
import { useFunctionSeoManager } from './useFunctionSeoManager';
import { SeoOverviewTab } from './components/SeoOverviewTab';
import { RedirectWorkspaceTab } from './components/RedirectWorkspaceTab';
import { SeoTemplatesTab } from './components/SeoTemplatesTab';
import { SeoEditor, FacetSeoEditor } from './components/SeoEditorModals';

interface Props {
  workspaceLocale?: CmsLocale;
  data?: FunctionSeoRecord[];
  initialData?: Record<'vi' | 'en', FunctionSeoRecord[]>;
  initialRedirects?: RedirectRule[];
  healthMetrics?: SeoHealthMetrics;
  capabilities?: {
    canEdit?: boolean;
  };
}

export const FunctionSeoManager: React.FC<Props> = ({
  workspaceLocale: propLocale,
  data,
  initialData,
  initialRedirects = [],
  healthMetrics,
  capabilities = { canEdit: true },
}) => {
  const {
    activeLocale,
    dict,
    records,
    query,
    setQuery,
    editingMain,
    setEditingMain,
    editingFacet,
    setEditingFacet,
    expandedIds,
    toggleExpanded,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    activeSection,
    setActiveSection,
    healthFilter,
    setHealthFilter,
    filtered,
    paginatedRecords,
    saveMainSeo,
    toggleIndexable,
    saveFacetSeo,
    handleEditWarningDirect,
    navigateTo,
    notify,
  } = useFunctionSeoManager({
    workspaceLocale: propLocale,
    data,
    initialData,
  });

  return (
    <div className="space-y-4">
      <CmsPageHeader
        icon={<SearchCheck />}
        title={dict.modules.system.seo.title}
        description={dict.modules.system.seo.description}
        meta={
          <span className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {activeLocale.toUpperCase()} · {records.length} {dict.modules.system.seo.itemUnit}
          </span>
        }
      />

      <CmsTabs
        ariaLabel="Khu vực SEO và URL"
        value={activeSection}
        onChange={(value) => setActiveSection(value as typeof activeSection)}
        items={[
          { id: 'overview', label: dict.modules.system.seo.tabs.overview, icon: ListChecks },
          { id: 'templates', label: dict.modules.system.seo.tabs.templates, icon: FileText },
          { id: 'redirects', label: dict.modules.system.seo.tabs.redirects, icon: Link2 },
        ]}
      />

      {activeSection === 'overview' && (
        <SeoOverviewTab
          records={records}
          metrics={healthMetrics}
          onOpenTemplates={(filter = 'all') => {
            setHealthFilter(filter);
            setActiveSection('templates');
          }}
          onOpenRedirects={() => setActiveSection('redirects')}
          onNavigate={navigateTo}
          onEditDirect={handleEditWarningDirect}
        />
      )}

      {activeSection === 'redirects' && (
        <RedirectWorkspaceTab
          records={records}
          initialRedirects={initialRedirects}
          canEdit={capabilities.canEdit}
          onNotify={notify}
        />
      )}

      {activeSection === 'templates' && (
        <SeoTemplatesTab
          filtered={filtered}
          paginatedRecords={paginatedRecords}
          query={query}
          setQuery={setQuery}
          healthFilter={healthFilter}
          setHealthFilter={setHealthFilter}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          canEdit={capabilities.canEdit}
          onEditMain={(item) => setEditingMain({ ...item })}
          onEditFacet={setEditingFacet}
          onToggleIndexable={toggleIndexable}
          onNavigate={navigateTo}
        />
      )}

      {/* Main Page SEO Editor Modal */}
      {editingMain && (
        <SeoEditor
          value={editingMain}
          onChange={setEditingMain}
          onClose={() => setEditingMain(null)}
          onSave={saveMainSeo}
        />
      )}

      {/* Facet Filter SEO Editor Modal */}
      {editingFacet && (
        <FacetSeoEditor
          moduleLabel={editingFacet.recordLabel}
          facet={editingFacet.facet}
          onClose={() => setEditingFacet(null)}
          onSave={saveFacetSeo}
        />
      )}
    </div>
  );
};
