export interface MenuItem {
  id: string;
  group_id: string;
  parent_id: string | null;
  depth: number; // 0 (root level 1), 1 (level 2), 2 (level 3)
  display_order: number;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  icon_name?: string;
  is_visible: boolean;
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  name: string;
  published: boolean;
  ordering: number;
}
