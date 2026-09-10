import { isNewsCategoryCmsPath, isProductApplicationCmsPath, isProductBrandCmsPath, isProductCategoryCmsPath, isProductTypeCmsPath, isSalesOwnerCmsPath, resolveCmsModule } from '@/cms/routing';
import { NewsCategoriesRoute } from '@/cms/modules/news_categories/NewsCategoriesRoute';
import { ProductApplicationsRoute } from '@/cms/modules/product_applications/ProductApplicationsRoute';
import { ProductBrandsRoute } from '@/cms/modules/product_brands/ProductBrandsRoute';
import { ProductCategoriesRoute } from '@/cms/modules/product_categories/ProductCategoriesRoute';
import { ProductTypesRoute } from '@/cms/modules/product_types/ProductTypesRoute';
import { SalesOwnersRoute } from '@/cms/modules/sales_owners/SalesOwnersRoute';
import { ProductsRoute } from '@/cms/modules/products/ProductsRoute';
import { NewsRoute } from '@/cms/modules/news/NewsRoute';
import { renderCmsFoundationRoute } from '../CmsFoundationRoute';

export default async function CmsCatchAllPage({ params }: PageProps<'/cms/[...path]'>) {
  const { path } = await params;
  const cmsPath = `/cms/${path.join('/')}`;
  const moduleContent = isNewsCategoryCmsPath(cmsPath)
    ? <NewsCategoriesRoute />
    : (cmsPath==='/cms/articles'||cmsPath==='/cms/news'||cmsPath.startsWith('/cms/news/'))
    ? <NewsRoute />
    : ['/cms/products', '/cms/products/catalog', '/cms/catalog'].includes(cmsPath)
    ? <ProductsRoute />
    : isProductCategoryCmsPath(cmsPath)
    ? <ProductCategoriesRoute />
    : isProductBrandCmsPath(cmsPath)
      ? <ProductBrandsRoute />
      : isProductApplicationCmsPath(cmsPath)
        ? <ProductApplicationsRoute />
        : isProductTypeCmsPath(cmsPath)
          ? <ProductTypesRoute />
        : isSalesOwnerCmsPath(cmsPath)
          ? <SalesOwnersRoute />
        : undefined;
  return renderCmsFoundationRoute(resolveCmsModule(cmsPath), cmsPath, moduleContent);
}
