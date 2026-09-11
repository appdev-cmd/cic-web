import { getPublishedServiceProducts,listPublishedServices } from '@/features/services/server/queries';
import { ServicesRuntimeView } from '@/web/features/services/ServicesRuntimeView';
export const dynamic='force-dynamic';
const view=(service:Awaited<ReturnType<typeof listPublishedServices>>[number])=>({id:service.id,slug:service.slug,title:service.title,tagline:service.summary,shortDesc:service.summary,category:'Dịch vụ CIC',image:service.image,htmlContent:service.content,relatedProductIds:service.relatedProductIds});
export default async function ServicesPage(){const services=await listPublishedServices('vi'),ids=[...new Set(services.flatMap(item=>item.relatedProductIds))],products=await getPublishedServiceProducts('vi',ids);return <ServicesRuntimeView services={services.map(view)} products={products}/>;}
