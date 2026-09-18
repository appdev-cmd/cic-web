import { renderCmsFoundationRoute } from '../CmsFoundationRoute';

export default async function CmsDashboardPage() {
  return renderCmsFoundationRoute('dashboard', '/cms/dashboard');
}
