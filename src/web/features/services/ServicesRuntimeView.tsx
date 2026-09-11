'use client';
import { useRouter } from 'next/navigation';
import type { Product } from '@/shared/types';
import { ServicesView } from '@/web/components/ServicesView';
import type { ServiceDetail } from './types';
export function ServicesRuntimeView({services,products,initialServiceId}:{services:ServiceDetail[];products:Product[];initialServiceId?:string|null}){const router=useRouter();return <ServicesView services={services} products={products} initialServiceId={initialServiceId??null} onNavigateHome={()=>router.push('/')} onNavigateToList={()=>router.push('/services')} onNavigateToService={(id)=>{const service=services.find(item=>item.id===id);if(service)router.push(`/services/${service.slug??service.id}`);}}/>;}
