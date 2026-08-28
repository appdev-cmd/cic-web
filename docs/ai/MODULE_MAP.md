# Module Map

> Function SEO now reads and updates locale-specific SEO values from `cic_config_modules` and `cic_config_modules_en`; facet and redirect UI metadata has no approved persistence table.

> Homepage now owns the real Next `/` route and reuses `HomeView` as its presentation/interaction authority.

> CMS Dashboard now receives its initial business aggregates from a server-only PostgreSQL read model; empty unmapped workflows remain explicit empty datasets instead of fixture fallbacks.

> CMS Global Search and its command palette now receive a serializable PostgreSQL index from the authenticated `/cms` server boundary; role-restricted user records are omitted before client serialization for non-admin roles.

> Người dùng CIC now receives authenticated PostgreSQL read models and persists profile, role/scope, lifecycle and credential operations through server-only actions; Supabase Auth owns credentials while `cic_users` remains the CMS profile/authorization identity bridge.

> Phân quyền now receives its role matrix and active assignments from PostgreSQL and persists role, permission and assignment changes through validated, permission-checked transactions.

> Cấu hình hệ thống now receives workspace settings and branch records from PostgreSQL and writes validated settings/branch changes through a transaction; sensitive values remain server-controlled and masked in the UI.

> The global Next not-found boundary now uses the React `NotFoundView` UI authority for all unmatched routes.

> Terms of use now has the real Next route `/terms`, reusing `TermsOfUseView` and `LegalArticleLayout` as the UI authority.

> Privacy policy now has the real Next route `/privacy`, reusing `PrivacyPolicyView` and `LegalArticleLayout` as the UI authority.

> Public Search now aggregates the migrated PostgreSQL published read models instead of importing public fixtures.

> Projects (7.x-A) and Products (7.x-B) now have PostgreSQL-backed published public read boundaries.

## Website public

> Route trong bảng phản ánh code hiện tại: các view public đều hiển thị dưới URL `/`; “logical view” là state nội bộ, không phải deep-link.

| Module | Website/CMS | Routes | Main files | Data source hiện tại | Liên quan |
|---|---|---|---|---|---|
| Trang chủ | Website | `/` (`home`) | `App.tsx`, `HomeView.tsx`, `HomeEcosystemSection.tsx`, `AwardsSlider.tsx` | `shared/page-content/legacyPageContent.ts`, `resolvePageContent.ts`, `web/data/homeData.ts`, `mockData.ts`, feature home adapter | sản phẩm, dịch vụ, dự án, tin tức, sự kiện, giới thiệu |
| Sản phẩm | Website | `/` (`products`, detail local state) | `ProductsView.tsx`, `ProductDetailView.tsx` | `web/features/products/productsData.ts` -> `web/data/mockData.ts`; shared Product type | CMS products, product settings, consultation |
| Giới thiệu | Website | `/` (`about`; overview/structure/experience) | `AboutView.tsx`, `AwardsSlider.tsx`, `CountryPartnerNetwork.tsx`, `GlobalPartnerMap.tsx` | `web/data/aboutData.ts`, country/map/partner fixtures, shared page-content fallback | home, contact, partner network |
| Dịch vụ | Website | `/` (`services`, detail local state) | `ServicesView.tsx` | `web/features/services/servicesData.ts` -> `web/data/servicesData.ts` | projects, products, CMS services, consultation |
| Dự án | Website | `/` (`projects`, detail local state) | `ProjectsView.tsx` | `web/features/projects/projectsData.ts` -> `web/data/projectsData.ts`; Next `features/projects/server/queries.ts` (7.x-A published read) | services, products, CMS projects, consultation |
| Tin tức | Website | `/` (`news`, category/detail local state) | `NewsView.tsx` | `web/features/news/newsData.ts` -> `web/data/newsData.ts`; legacy news in `mockData.ts` | events, projects, services, products, privacy, CMS news |
| Sự kiện | Website | `/` (`events`, detail/registration local state) | `EventsView.tsx` | `web/features/events/eventsData.ts` -> `web/data/eventsData.ts` | products, services, news, forms/customer requests, CMS events |
| Liên hệ | Website | `/` (`contact`) | `ContactView.tsx` | shared page-content/contact config; `publicWebsiteConfiguration.ts`; local form state | CMS contacts/customer requests, global consultation |
| Tìm kiếm | Website | `/` (`search`) | `SearchView.tsx`, `Header.tsx` | imported public product/project/service/news/event fixtures | tất cả content modules |
| Chính sách bảo mật | Website | `/` (`privacy`) | `PrivacyPolicyView.tsx`, `LegalArticleLayout.tsx` | hard-coded legal content trong component | footer, news |
| Điều khoản sử dụng | Website | `/` (`terms`) | `TermsOfUseView.tsx`, `LegalArticleLayout.tsx` | hard-coded legal content trong component | footer |
| Global interaction/widgets | Website | mọi public view | `ConsultationModal.tsx`, `ChatbotWidget.tsx`, floating bar trong `App.tsx` | hard-coded contacts; `customerInteractionSubmission.ts`; localStorage chatbot config | CTA/forms/customer requests, contacts |
| 404 | Website | mọi path không phải `/` hoặc `/cms...` | `NotFoundView.tsx` | UI config/hard-coded copy | home, search, history back |

## CMS

| Module | Website/CMS | Routes | Main files | Data source hiện tại | Liên quan |
|---|---|---|---|---|---|
| Dashboard | CMS | `/cms`, `/cms/dashboard` | `app/cms/page.tsx`, `features/dashboard/server/queries.ts`, `CmsDashboard.tsx`, `dashboard/DashboardOverview.tsx` | authenticated server read model over `cic_products`, `cic_news`, `cic_content_pages`, `cic_event`, `cic_contact` | contacts, registrations, pending content, audit; Recharts |
| Global Search | CMS | `/cms/search`, alias `/cms/global-search`, nested | `features/cms-search/server/queries.ts`, `services/globalSearchRuntime.tsx`, `search/CmsGlobalSearchPage.tsx`, command palette | authenticated PostgreSQL aggregate over content, contacts, media, forms/CTA and role-filtered users | products, news, services, events, pages, users |
| Người dùng CIC `[x]` | CMS | `/cms/users`; aliases `/cms/accounts`, `/cms/user-management`; nested | `app/cms/page.tsx`, `features/users/server/{queries,repository,actions}.ts`, `cic_users/CicUsersManager.tsx`, `CicUserFormModal.tsx` | PostgreSQL `cic_users`, roles/scopes/status/security relations + server-only Supabase Auth admin operations | roles, permissions, agencies, product/news categories |
| Phân quyền `[x]` | CMS | `/cms/permissions`, nested | `features/permissions/server/{queries,repository,actions}.ts`, `permission_management/PermissionManagement.tsx`, `RolesOverviewTab.tsx`, `RoleEditorModal.tsx` | PostgreSQL `cic_roles`, `cic_role_permissions`, `cic_user_roles`, `cic_permission_tasks`, `cic_users` | users, permission catalog, active assignments |
| Cấu hình hệ thống `[x]` | CMS | `/cms/settings`, alias `/cms/system-settings`, nested | `features/system-settings/server/{queries,repository,actions}.ts`, `system_configuration/SystemConfiguration.tsx`, editor/branch/version/audit components | PostgreSQL `cic_config`, `cic_config_en`, `cic_config_enjicad`, `cic_branches` | media assets, website config, secrets, versions/audit |
| Function SEO | CMS | `/cms/function-seo`, alias `/cms/seo-modules`, nested | `function_seo/FunctionSeoManager.tsx` | `getDemoFunctionSeoData`/`FunctionSeoDataSource.ts` + mock | public routes/functions, global search |
| Nhật ký hoạt động | CMS | `/cms/activity-logs`; aliases `/cms/history`, `/cms/logs`, `/cms/audit`; nested | `activity_logs_trash/ActivityLogsManager.tsx`, `AuditTab.tsx`, detail/export drawers | `demoGovernanceDataSource.audit` -> module mock | users, all governed content, exports |
| Thùng rác | CMS | `/cms/trash`, alias `/cms/recycle-bin`, nested | `activity_logs_trash/TrashManager.tsx`, `TrashTab.tsx`, restore/delete/detail modals | `demoGovernanceDataSource.trash` -> module mock | all deletable CMS entities, audit |
| Trang tĩnh & Page Builder | CMS | `/cms/static-pages`, alias `/cms/pages`, nested editor/preview | `StaticPagesManager.tsx`, `PageBuilderEditor.tsx`, `PageBuilderVisualCanvas.tsx`, `RichTextEditor.tsx` | `staticPagesData.ts`, `pageBuilderData.ts`, `pageBuilderMockData.json`, shared page-content | public home/about/contact, media, products/news references, CTA/forms; CKEditor |
| Tin tức | CMS | `/cms/news`, alias `/cms/articles`, nested form/categories | `NewsModulePage.tsx`, `NewsManager.tsx`, `NewsFormView.tsx`, `NewsCategoryManager.tsx` | `demoEditorialContentDataSource.newsByLocale` -> `news/mockData.ts` | products, categories, media, public news, versions/activity |
| Sự kiện | CMS | `/cms/events`, nested form | `events/EventsManager.tsx`, `EventsFormView.tsx`, preview/delete modal | `events/eventsData.ts` -> `events/mockData.ts` + news/products relations | public events, news, products, media, registrations |
| Dự án | CMS | `/cms/projects`, nested form | `projects/ProjectsManager.tsx`, `ProjectFormView.tsx`, preview modal | `projects/projectsData.ts` (CMS wrapper/fixture) | public projects, services, products, media |
| Email Templates | CMS | `/cms/email-templates`, nested form | `email_templates/EmailTemplatesManager.tsx`, `EmailTemplatesFormView.tsx` | `demoCustomerInteractionDataSource` -> module mock | forms, CTA, customer requests |
| Product Settings/Taxonomy | CMS | `/cms/product-settings`; product settings/category/brand/application/type/sales aliases; query `tab` | `product_settings/ProductSettingsManager.tsx`, master-data drawer/impact/column/delete modals | `demoCatalogDataSource` -> `product_settings/mockData.ts` + product mock | products, owners/sales staff, usage impact |
| Sản phẩm | CMS | `/cms/products`; aliases `/cms/products/catalog`, `/cms/catalog`; nested form | `products/ProductsManager.tsx`, `ProductsFormView.tsx`, preview/duplicate/activity/file/column/delete components | `demoCatalogDataSource.productsByLocale` -> `products/mockData.ts` | public products, product taxonomy, media, related content |
| Dịch vụ | CMS | `/cms/services`, nested form | `services/ServicesManager.tsx`, `ServiceFormView.tsx`, preview/version/activity/used-by/contact drawers | `demoEditorialContentDataSource.servicesByLocale` -> `services/mockData.ts` | public services, pages/menu, contacts, projects |
| Menu website | CMS | `/cms/frontend-menus`; aliases `/cms/menu`, `/cms/navigation`; nested | `menu/MenuManager.tsx`, tree/table/item/group editors, preview | `demoPresentationDataSource` -> `menu/mockData.ts` | public Header/Footer/navigation, pages/content entities |
| Media | CMS | `/cms/media`; aliases `/cms/media-library`, `/cms/albums`; nested | `media/MediaManager.tsx`, grid/list/albums, asset/upload/replace/archive drawers/modals | `demoMediaDataSource` -> `media/mockData.ts` | all content forms, page builder, system config |
| Liên hệ/CRM inbox | CMS | `/cms/contact-requests`; contact/product-registration/customer aliases; nested | `contacts/ContactsManager.tsx`, list/detail/reassign/PII/spam modals | `demoContactsDataSource` -> `contacts/mockData.ts` | public contact/consultation, staff, services, audit |
| Localization | CMS | `/cms/translation-strings`; translation-progress/localization aliases; nested | `localization/LocalizationManager.tsx`, `uiDictionaryData.ts` | `getDemoLocalizationData()`/`LocalizationDataSource.ts` | CMS workspace locale, public/localized content |
| CTA | CMS | `/cms/cta`, nested form | `customer_interaction/cta/CtaManager.tsx`, `CtaFormView.tsx`, list/preview/used-by | `demoCustomerInteractionDataSource` -> CTA mock + forms/templates/media docs | page builder, forms, email templates, public CTAs |
| Forms | CMS | `/cms/forms`, nested builder | `customer_interaction/forms/FormManager.tsx`, `FormBuilderView.tsx`, list/preview/submissions | `demoCustomerInteractionDataSource` -> forms mock + email templates | CTA, customer requests, public submissions |
| Customer Requests | CMS | `/cms/customer-requests`, alias `/cms/requests`, nested `/detail/:id` | `CustomerRequestManager.tsx`, list/detail page/modal/drawer, notes/reassign | `demoCustomerInteractionDataSource` -> request mock; staff from contacts mock | forms, contacts, CTA/source attribution, email |

## Ghi chú coverage

- `activity_logs_trash` là một folder code nhưng có hai route/module độc lập.
- `customer_interaction` là group code với ba route/module độc lập: CTA, Forms, Customer Requests.
- News Categories và product taxonomies là nested screen/submodule trong module cha, không có outlet top-level riêng ngoài aliases/nested routes đã ghi.
