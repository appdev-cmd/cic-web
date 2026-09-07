import { isProductBrandCmsPath, isProductCategoryCmsPath, resolveCmsModule } from '@/cms/routing';
import { ProductBrandsRoute } from '@/cms/modules/product_brands/ProductBrandsRoute';
import { ProductCategoriesRoute } from '@/cms/modules/product_categories/ProductCategoriesRoute';
import { renderCmsFoundationRoute } from '../CmsFoundationRoute';

export default async function CmsCatchAllPage({ params }: PageProps<'/cms/[...path]'>) {
  const { path } = await params;
  const cmsPath = `/cms/${path.join('/')}`;
  const moduleContent = isProductCategoryCmsPath(cmsPath)
    ? <ProductCategoriesRoute />
    : isProductBrandCmsPath(cmsPath)
      ? <ProductBrandsRoute />
      : undefined;
  return renderCmsFoundationRoute(resolveCmsModule(cmsPath), cmsPath, moduleContent);
}
