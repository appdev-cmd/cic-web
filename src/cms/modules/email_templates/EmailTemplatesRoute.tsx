'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { EmailTemplatesManager } from './EmailTemplatesManager';
import type { EmailTemplate, EmailWorkspace } from '@/features/email-templates/types';
import { Loader2 } from 'lucide-react';

export function EmailTemplatesRoute() {
  const [workspace, setWorkspace] = useState<EmailWorkspace>('vi');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (ws: EmailWorkspace) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cms/email-templates?workspace=${ws}`);
      if (!res.ok) {
        throw new Error(`Failed to load email templates (${res.status})`);
      }
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err: any) {
      console.error('Error fetching email templates:', err);
      setError(err?.message || 'Không thể tải danh sách mẫu email.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates(workspace);
  }, [workspace, fetchTemplates]);

  if (loading && templates.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-slate-500">
        <Loader2 className="size-6 animate-spin text-orange-600" />
        <span className="text-sm font-medium">Đang tải dữ liệu mẫu email...</span>
      </div>
    );
  }

  if (error && templates.length === 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <p className="font-semibold">{error}</p>
        <button
          onClick={() => fetchTemplates(workspace)}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workspace Locale Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Không gian làm việc:</span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setWorkspace('vi')}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                workspace === 'vi'
                  ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-700 dark:text-orange-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Tiếng Việt (VI)
            </button>
            <button
              onClick={() => setWorkspace('en')}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                workspace === 'en'
                  ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-700 dark:text-orange-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Đang đồng bộ...</span>
          </div>
        )}
      </div>

      <EmailTemplatesManager
        workspaceLocale={workspace}
        initialTemplates={templates}
        onRefresh={() => fetchTemplates(workspace)}
      />
    </div>
  );
}
