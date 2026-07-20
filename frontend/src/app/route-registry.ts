export interface AppRouteDefinition {
  path: string;
  module?: string;
  feature?: string;
  permission?: string;
}

export const routeRegistry: AppRouteDefinition[] = [
  { path: "/admin/dashboard", module: "system", permission: "system.configure" },
  { path: "/admin/products", module: "products", permission: "product.view" },
  { path: "/admin/categories", module: "categories", feature: "category_management", permission: "category.view" },
  { path: "/admin/documents", module: "documents", permission: "document.view" },
  { path: "/admin/chat", module: "chat", permission: "chat.use" },
  { path: "/admin/operations/conversations", module: "system", permission: "system.configure" },
  { path: "/admin/operations/leads", module: "system", permission: "system.configure" },
  { path: "/admin/operations/quotations", module: "system", permission: "system.configure" },
  { path: "/admin/operations/appointments", module: "system", permission: "system.configure" },
  { path: "/admin/operations/feedback", module: "system", permission: "system.configure" },
  { path: "/admin/features", module: "system", permission: "system.configure" },
];
