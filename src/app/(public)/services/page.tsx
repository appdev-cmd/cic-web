import type { Metadata } from 'next';
import { getPublishedServiceProducts,listPublishedServices } from '@/features/services/server/queries';
import { ServicesRuntimeView } from '@/web/features/services/ServicesRuntimeView';
export const dynamic='force-dynamic';

export const metadata: Metadata = {
  title: 'Dịch Vụ Kỹ Thuật & Tư Vấn Chuyển Giao',
  description:
    'Dịch vụ tư vấn giải pháp, đào tạo chuyển giao công nghệ và hỗ trợ kỹ thuật chuyên sâu trong lĩnh vực xây dựng và hạ tầng từ CIC Technology.',
  alternates: {
    canonical: '/services',
  },
};
const view=(service:Awaited<ReturnType<typeof listPublishedServices>>[number])=>({id:service.id,slug:service.slug,title:service.title,tagline:service.summary,shortDesc:service.summary,category:'Dịch vụ CIC',image:service.image,htmlContent:service.content,relatedProductIds:service.relatedProductIds});
export default async function ServicesPage(){const services=await listPublishedServices('vi'),ids=[...new Set(services.flatMap(item=>item.relatedProductIds))],products=await getPublishedServiceProducts('vi',ids);return <ServicesRuntimeView services={services.map(view)} products={products}/>;}
