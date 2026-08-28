'use client';
import { useRouter } from 'next/navigation';
import { TermsOfUseView } from '@/web/components/TermsOfUseView';
export function TermsRoute() { const router = useRouter(); return <TermsOfUseView onNavigateHome={() => router.push('/')} />; }
