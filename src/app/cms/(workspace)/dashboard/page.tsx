import { renderCmsModuleContent } from '../../CmsFoundationRoute';

export default async function CmsDashboardPage() {
  return renderCmsModuleContent('dashboard', '/cms/dashboard');
}
