'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { FormManager } from './FormManager';
import type { FormItem } from './types';
import type { EmailTemplate } from '../../email_templates/types';
import { Loader2 } from 'lucide-react';

interface Props {
  initialForms: Record<'vi' | 'en', FormItem[]>;
  emailTemplates: Record<'vi' | 'en', EmailTemplate[]>;
  capabilities?: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export function FormsScreen({ initialForms, emailTemplates, capabilities }: Props) {
  const router = useRouter();
  const locale = useCmsWorkspaceLocale();
  const [isPending, startTransition] = useTransition();

  const formsForLocale = initialForms[locale] || [];
  const emailTemplatesForLocale = emailTemplates[locale] || [];

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const version = formsForLocale.map((f) => `${f.id}:${f.updatedAt}:${f.status}`).join('|') || 'empty';

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
          <Loader2 className="size-3.5 animate-spin text-orange-600" />
          <span>Đang đồng bộ...</span>
        </div>
      )}

      <FormManager
        key={`${locale}:${version}`}
        workspaceLocale={locale}
        data={{
          forms: formsForLocale,
          emailTemplates: emailTemplatesForLocale,
        }}
        onRefresh={handleRefresh}
        capabilities={capabilities}
      />
    </div>
  );
}
