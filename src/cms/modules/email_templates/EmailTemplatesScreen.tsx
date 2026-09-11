'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { EmailTemplatesManager } from './EmailTemplatesManager';
import type { EmailTemplate } from '@/features/email-templates/types';
import { Loader2 } from 'lucide-react';

interface Props {
  initialData: Record<'vi' | 'en', EmailTemplate[]>;
  capabilities?: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export function EmailTemplatesScreen({ initialData, capabilities }: Props) {
  const router = useRouter();
  const locale = useCmsWorkspaceLocale();
  const [isPending, startTransition] = useTransition();

  const currentTemplates = initialData[locale] || [];
  const version = currentTemplates.map((t) => `${t.id}:${t.updatedAt}`).join('|');

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
          <Loader2 className="size-3.5 animate-spin text-orange-600" />
          <span>Đang đồng bộ...</span>
        </div>
      )}

      <EmailTemplatesManager
        key={`${locale}:${version}`}
        workspaceLocale={locale}
        initialTemplates={currentTemplates}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
