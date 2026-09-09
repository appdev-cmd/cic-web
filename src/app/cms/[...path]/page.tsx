import { isProductApplicationCmsPath, isProductBrandCmsPath, isProductCategoryCmsPath, isProductTypeCmsPath, resolveCmsModule } from '@/cms/routing';
import { ProductApplicationsRoute } from '@/cms/modules/product_applications/ProductApplicationsRoute';
import { ProductBrandsRoute } from '@/cms/modules/product_brands/ProductBrandsRoute';
import { ProductCategoriesRoute } from '@/cms/modules/product_categories/ProductCategoriesRoute';
import { ProductTypesRoute } from '@/cms/modules/product_types/ProductTypesRoute';
import { renderCmsFoundationRoute } from '../CmsFoundationRoute';

export default async function CmsCatchAllPage({ params }: PageProps<'/cms/[...path]'>) {
  const { path } = await params;
  const cmsPath = `/cms/${path.join('/')}`;
  const moduleContent = isProductCategoryCmsPath(cmsPath)
    ? <ProductCategoriesRoute />
    : isProductBrandCmsPath(cmsPath)
      ? <ProductBrandsRoute />
      : isProductApplicationCmsPath(cmsPath)
        ? <ProductApplicationsRoute />
        : isProductTypeCmsPath(cmsPath)
          ? <ProductTypesRoute />
        : undefined;
  return renderCmsFoundationRoute(resolveCmsModule(cmsPath), cmsPath, moduleContent);
}
