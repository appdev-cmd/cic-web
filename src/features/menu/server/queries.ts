import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { MenuGroupDto, MenuItemDto, MenuTreeItemDto } from '../domain/types';
import type { NavLink } from '@/shared/types';
import type { FooterNavigationItem, NavigationDataResult, PublicNavigationView } from '@/web/features/navigation/navigationData';

function resolveViewFromHref(href: string): PublicNavigationView {
  const clean = href.replace(/^\/en/, '').replace(/^\/+/, '').split('?')[0].split('/')[0];
  if (!clean) return 'home';
  if (clean === 'products' || clean === 'san-pham') return 'products';
  if (clean === 'services' || clean === 'dich-vu') return 'services';
  if (clean === 'projects' || clean === 'du-an') return 'projects';
  if (clean === 'news' || clean === 'tin-tuc') return 'news';
  if (clean === 'events' || clean === 'su-kien') return 'events';
  if (clean === 'contact' || clean === 'lien-he') return 'contact';
  if (clean === 'about' || clean === 'gioi-thieu') return 'about';
  if (clean === 'privacy' || clean === 'chinh-sach-bao-mat') return 'privacy';
  if (clean === 'terms' || clean === 'dieu-khoan-su-dung') return 'terms';
  return 'home';
}

export { buildMenuTree } from '../domain/tree';

export async function getMenuGroups(workspace: 'vi' | 'en' = 'vi'): Promise<MenuGroupDto[]> {
  const sql = getPostgresClient();
  const rows = workspace === 'en'
    ? await sql`SELECT id, group_name, published, ordering FROM cic_menus_groups_en ORDER BY ordering ASC, id ASC`
    : await sql`SELECT id, group_name, published, ordering FROM cic_menus_groups ORDER BY ordering ASC, id ASC`;

  return rows.map((r) => ({
    id: String(r.id),
    name: String(r.group_name || ''),
    published: Boolean(r.published),
    ordering: Number(r.ordering || 1),
  }));
}

export async function getAllMenuItems(workspace: 'vi' | 'en' = 'vi'): Promise<MenuItemDto[]> {
  const sql = getPostgresClient();
  const rows = workspace === 'en'
    ? await sql`SELECT id, group_id, parent_id, name, link, target, ordering, level, published, icon FROM cic_menus_items_en ORDER BY group_id ASC, ordering ASC, id ASC`
    : await sql`SELECT id, group_id, parent_id, name, link, target, ordering, level, published, icon FROM cic_menus_items ORDER BY group_id ASC, ordering ASC, id ASC`;

  return rows.map((r) => ({
    id: String(r.id),
    group_id: String(r.group_id),
    parent_id: r.parent_id != null ? String(r.parent_id) : null,
    depth: Number(r.level || 0),
    display_order: Number(r.ordering || 1),
    label: String(r.name || ''),
    url: String(r.link || '/'),
    open_in_new_tab: r.target === '_blank',
    icon_name: r.icon ? String(r.icon) : undefined,
    is_visible: Boolean(r.published),
  }));
}

export async function getMenuItemsByGroup(groupId: number | string, workspace: 'vi' | 'en' = 'vi'): Promise<MenuItemDto[]> {
  const sql = getPostgresClient();
  const gId = Number(groupId);
  const rows = workspace === 'en'
    ? await sql`SELECT id, group_id, parent_id, name, link, target, ordering, level, published, icon FROM cic_menus_items_en WHERE group_id = ${gId} ORDER BY ordering ASC, id ASC`
    : await sql`SELECT id, group_id, parent_id, name, link, target, ordering, level, published, icon FROM cic_menus_items WHERE group_id = ${gId} ORDER BY ordering ASC, id ASC`;

  return rows.map((r) => ({
    id: String(r.id),
    group_id: String(r.group_id),
    parent_id: r.parent_id != null ? String(r.parent_id) : null,
    depth: Number(r.level || 0),
    display_order: Number(r.ordering || 1),
    label: String(r.name || ''),
    url: String(r.link || '/'),
    open_in_new_tab: r.target === '_blank',
    icon_name: r.icon ? String(r.icon) : undefined,
    is_visible: Boolean(r.published),
  }));
}

export async function getNavigationDataFromDb(workspace: 'vi' | 'en' = 'vi'): Promise<NavigationDataResult> {
  const sql = getPostgresClient();
  const isEn = workspace === 'en';

  const groups = await getMenuGroups(workspace);
  // Group 1: Header, Group 2: Footer quick links, Group 3: Solutions, Group 4: Services
  const headerGroup = groups.find((g) => g.ordering === 1) || groups[0];
  const footerPrimaryGroup = groups.find((g) => g.ordering === 2) || groups[1];
  const footerSolutionGroup = groups.find((g) => g.ordering === 3) || groups[2];
  const footerServiceGroup = groups.find((g) => g.ordering === 4) || groups[3];

  const allItems = isEn
    ? await sql`SELECT id, group_id, parent_id, name, link, target, ordering, level, icon FROM cic_menus_items_en WHERE published = true ORDER BY ordering ASC, id ASC`
    : await sql`SELECT id, group_id, parent_id, name, link, target, ordering, level, icon FROM cic_menus_items WHERE published = true ORDER BY ordering ASC, id ASC`;

  // Header NavLinks
  const headerItems = allItems.filter((i) => String(i.group_id) === String(headerGroup?.id));
  const headerRoots = headerItems.filter((i) => i.parent_id == null);
  const headerLinks: NavLink[] = headerRoots.map((root) => {
    const children = headerItems.filter((i) => String(i.parent_id) === String(root.id));
    return {
      name: String(root.name || ''),
      href: String(root.link || '/'),
      dropdown: children.length > 0
        ? children.map((c) => ({ name: String(c.name || ''), href: String(c.link || '/') }))
        : undefined,
    };
  });

  // Footer Links
  const mapToFooterItem = (item: any): FooterNavigationItem => {
    const href = String(item.link || '/');
    const label = String(item.name || '');
    const view = resolveViewFromHref(href);
    return {
      label,
      href,
      view,
      activeLabel: label,
      reset: ['products', 'services', 'projects', 'news', 'events'].includes(view),
    };
  };

  const footerPrimaryItems = allItems
    .filter((i) => String(i.group_id) === String(footerPrimaryGroup?.id))
    .map(mapToFooterItem);

  const footerSolutionItems = allItems
    .filter((i) => String(i.group_id) === String(footerSolutionGroup?.id))
    .map(mapToFooterItem);

  const footerServiceItems = allItems
    .filter((i) => String(i.group_id) === String(footerServiceGroup?.id))
    .map(mapToFooterItem);

  return {
    headerLinks,
    footerPrimaryLinks: footerPrimaryItems,
    footerSolutionLinks: footerSolutionItems,
    footerServiceLinks: footerServiceItems,
  };
}
