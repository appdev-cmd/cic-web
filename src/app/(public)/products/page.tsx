import { ProductsView } from '@/web/components/ProductsView';
import { listPublishedProductsForReference } from '@/features/products/server/queries';
export const dynamic='force-dynamic';
export default async function ProductsPage(){
  const products=await listPublishedProductsForReference();
  return <ProductsView products={products}/>;
}
