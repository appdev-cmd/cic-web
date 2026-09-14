'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { CtaManager } from './CtaManager';
import type { CtaItem } from './types';
import type { FormItem } from '../forms/types';
import type { EmailTemplate } from '../../email_templates/types';
import type { CtaDownloadFileOption } from '@/cms/data/CustomerInteractionDataSource';
import { Loader2 } from 'lucide-react';

interface Props {
  initialCtas: Record<'vi' | 'en', CtaItem[]>;
  forms: Record<'vi' | 'en', FormItem[]>;
  emailTemplates: Record<'vi' | 'en', EmailTemplate[]>;
  downloadFiles: Record<'vi' | 'en', CtaDownloadFileOption[]>;
  capabilities?: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export function CtaScreen({
  initialCtas,
  forms,
  emailTemplates,
  downloadFiles,
  capabilities,
}: Props) {
  const router = useRouter();
  const locale = useCmsWorkspaceLocale();
  const [isPending, startTransition] = useTransition();

  const ctasForLocale = initialCtas[locale] || [];
  const formsForLocale = forms[locale] || [];
  const emailTemplatesForLocale = emailTemplates[locale] || [];
  const downloadFilesForLocale = downloadFiles[locale] || [];

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const version = ctasForLocale.map((c) => `${c.id}:${c.updatedAt}:${c.status}`).join('|') || 'empty';

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
          <Loader2 className="size-3.5 animate-spin text-orange-600" />
          <span>Đang đồng bộ...</span>
        </div>
      )}

      <CtaManager
        key={`${locale}:${version}`}
        workspaceLocale={locale}
        data={{
          ctas: ctasForLocale,
          forms: formsForLocale,
          emailTemplates: emailTemplatesForLocale,
          downloadFiles: downloadFilesForLocale,
        }}
        onRefresh={handleRefresh}
        capabilities={capabilities}
      />
    </div>
  );
}
