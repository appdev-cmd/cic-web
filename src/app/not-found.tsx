'use client';
import { useRouter } from 'next/navigation';
import { NotFoundView } from '@/web/components/NotFoundView';
export default function NotFoundPage() { const router = useRouter(); return <NotFoundView onNavigateHome={() => router.push('/')} onGoBack={() => router.back()} />; }
