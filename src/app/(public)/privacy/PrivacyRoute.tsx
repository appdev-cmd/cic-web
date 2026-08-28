'use client';

import { useRouter } from 'next/navigation';
import { PrivacyPolicyView } from '@/web/components/PrivacyPolicyView';

export function PrivacyRoute() {
  const router = useRouter();
  return <PrivacyPolicyView onNavigateHome={() => router.push('/')} />;
}
