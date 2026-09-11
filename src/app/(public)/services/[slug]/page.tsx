import { notFound } from 'next/navigation';
import { getPublishedServiceBySlug,getPublishedServiceProducts,listPublishedServices } from '@/features/services/server/queries';
import { ServicesRuntimeView } from '@/web/features/services/ServicesRuntimeView';
export const dynamic='force-dynamic';
const view=(service:NonNullable<Awaited<ReturnType<typeof getPublishedServiceBySlug>>>)=>({id:service.id,slug:service.slug,title:service.title,tagline:service.summary,shortDesc:service.summary,category:'Dịch vụ CIC',image:service.image,htmlContent:service.content,relatedProductIds:service.relatedProductIds});
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const service=await getPublishedServiceBySlug((await params).slug,'vi');return service?{title:service.seoTitle||service.title,description:service.seoDescription||service.summary,keywords:service.seoKeywords}:{};}
export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const service=await getPublishedServiceBySlug((await params).slug,'vi');if(!service)notFound();const all=await listPublishedServices('vi'),products=await getPublishedServiceProducts('vi',service.relatedProductIds);return <ServicesRuntimeView services={[view(service),...all.filter(item=>item.id!==service.id).map(view)]} products={products} initialServiceId={service.id}/>;}
