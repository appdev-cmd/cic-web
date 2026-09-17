import type { MenuItemDto, MenuTreeItemDto } from './types';

export function buildMenuTree(items: MenuItemDto[]): MenuTreeItemDto[] {
  const map = new Map<string, MenuTreeItemDto>();
  const roots: MenuTreeItemDto[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      const parent = map.get(item.parent_id)!;
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function flattenMenuTree(nodes: MenuTreeItemDto[]): MenuItemDto[] {
  const result: MenuItemDto[] = [];
  function traverse(list: MenuTreeItemDto[]) {
    for (const node of list) {
      const { children, ...rest } = node;
      result.push(rest);
      if (children && children.length > 0) {
        traverse(children);
      }
    }
  }
  traverse(nodes);
  return result;
}
