export interface MenuGroupDto {
  id: string;
  name: string;
  published: boolean;
  ordering: number;
}

export interface MenuItemDto {
  id: string;
  group_id: string;
  parent_id: string | null;
  depth: number;
  display_order: number;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  icon_name?: string;
  is_visible: boolean;
}

export interface MenuTreeItemDto extends MenuItemDto {
  children?: MenuTreeItemDto[];
}

export interface SaveMenuItemInput {
  id?: string; // If absent or starts with temp_, perform insert
  group_id: string;
  parent_id: string | null;
  depth: number;
  display_order: number;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  icon_name?: string;
  is_visible: boolean;
}

export interface SaveMenuGroupInput {
  id?: string; // If absent or starts with grp_temp, perform insert
  name: string;
  published: boolean;
  ordering: number;
}

export interface ReorderMenuItemInput {
  id: string;
  parent_id: string | null;
  depth: number;
  display_order: number;
}
