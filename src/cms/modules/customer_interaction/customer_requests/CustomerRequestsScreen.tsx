'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { CustomerRequestManager } from './CustomerRequestManager';
import type { CustomerRequestListResponse } from '@/features/customer-requests/types';
import { Loader2 } from 'lucide-react';

interface Props {
  initialData: Record<'vi' | 'en', CustomerRequestListResponse>;
  capabilities?: {
    edit: boolean;
    delete: boolean;
  };
}

export function CustomerRequestsScreen({ initialData, capabilities }: Props) {
  const router = useRouter();
  const locale = useCmsWorkspaceLocale();
  const [isPending, startTransition] = useTransition();

  const currentData = initialData[locale];
  const version = currentData?.requests.map((r) => `${r.id}:${r.updatedAt}`).join('|') || 'empty';

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

      <CustomerRequestManager
        key={`${locale}:${version}`}
        workspaceLocale={locale}
        serverData={currentData}
        onRefresh={handleRefresh}
        capabilities={capabilities}
      />
    </div>
  );
}
