'use server';

import { revalidatePath } from 'next/cache';
import { getPostgresClient, withTransaction } from '@/server/db/postgres';
import { requireMenuPermission } from '../permissions';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type { MenuGroupDto, MenuItemDto, ReorderMenuItemInput, SaveMenuGroupInput, SaveMenuItemInput } from '../domain/types';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Creates or updates a menu item.
 */
export async function saveMenuItemAction(
  input: SaveMenuItemInput,
  workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<MenuItemDto>> {
  try {
    const isEn = workspace === 'en';
    const isCreate = !input.id || input.id.startsWith('item_') || isNaN(Number(input.id));
    const actor = await requireMenuPermission(isCreate ? 'create' : 'edit');
    const sql = getPostgresClient();

    const groupId = Number(input.group_id);
    const parentId = input.parent_id ? Number(input.parent_id) : null;
    const target = input.open_in_new_tab ? '_blank' : '_self';
    const ordering = Number(input.display_order || 1);
    const level = Number(input.depth || 0);
    const published = input.is_visible !== false;
    const icon = input.icon_name || null;
    const name = input.label.trim();
    const link = input.url.trim();

    let resultItem: MenuItemDto;

    if (isCreate) {
      const rows = isEn
        ? await sql`
            INSERT INTO cic_menus_items_en (
              group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin, is_rewrite, created_time, updated_time
            ) VALUES (
              ${groupId}, ${parentId}, ${name}, ${link}, ${target}, ${ordering}, ${level}, ${published}, ${icon}, true, true, now(), now()
            ) RETURNING id
          `
        : await sql`
            INSERT INTO cic_menus_items (
              group_id, parent_id, name, link, target, ordering, level, published, icon, show_admin, is_rewrite, created_time, updated_time
            ) VALUES (
              ${groupId}, ${parentId}, ${name}, ${link}, ${target}, ${ordering}, ${level}, ${published}, ${icon}, true, true, now(), now()
            ) RETURNING id
          `;

      const newId = String(rows[0].id);
      resultItem = {
        id: newId,
        group_id: String(groupId),
        parent_id: parentId != null ? String(parentId) : null,
        depth: level,
        display_order: ordering,
        label: name,
        url: link,
        open_in_new_tab: input.open_in_new_tab,
        icon_name: icon || undefined,
        is_visible: published,
      };

      await writeAuditEvent(actor, {
        action: AUDIT_ACTIONS.MENU_CREATED,
        entityType: AUDIT_ENTITY_TYPES.MENU,
        entityId: newId,
        entityTitle: name,
        module: 'menu',
        workspace,
        result: 'success',
        after: resultItem,
      });
    } else {
      const itemId = Number(input.id);
      if (isEn) {
        await sql`
          UPDATE cic_menus_items_en
          SET group_id = ${groupId},
              parent_id = ${parentId},
              name = ${name},
              link = ${link},
              target = ${target},
              ordering = ${ordering},
              level = ${level},
              published = ${published},
              icon = ${icon},
              updated_time = now()
          WHERE id = ${itemId}
        `;
      } else {
        await sql`
          UPDATE cic_menus_items
          SET group_id = ${groupId},
              parent_id = ${parentId},
              name = ${name},
              link = ${link},
              target = ${target},
              ordering = ${ordering},
              level = ${level},
              published = ${published},
              icon = ${icon},
              updated_time = now()
          WHERE id = ${itemId}
        `;
      }

      resultItem = {
        id: String(itemId),
        group_id: String(groupId),
        parent_id: parentId != null ? String(parentId) : null,
        depth: level,
        display_order: ordering,
        label: name,
        url: link,
        open_in_new_tab: input.open_in_new_tab,
        icon_name: icon || undefined,
        is_visible: published,
      };

      await writeAuditEvent(actor, {
        action: AUDIT_ACTIONS.MENU_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.MENU,
        entityId: String(itemId),
        entityTitle: name,
        module: 'menu',
        workspace,
        result: 'success',
        after: resultItem,
      });
    }

    revalidatePath('/cms/frontend-menus');
    revalidatePath('/cms/menu');
    revalidatePath('/');
    return { success: true, data: resultItem };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể lưu mục menu.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Deletes a menu item.
 */
export async function deleteMenuItemAction(
  itemId: string,
  workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<void>> {
  try {
    const actor = await requireMenuPermission('delete');
    const sql = getPostgresClient();
    const id = Number(itemId);
    const isEn = workspace === 'en';

    if (isEn) {
      await sql`DELETE FROM cic_menus_items_en WHERE id = ${id}`;
    } else {
      await sql`DELETE FROM cic_menus_items WHERE id = ${id}`;
    }

    await writeAuditEvent(actor, {
      action: AUDIT_ACTIONS.MENU_DELETED,
      entityType: AUDIT_ENTITY_TYPES.MENU,
      entityId: itemId,
      entityTitle: `Mục menu #${itemId}`,
      module: 'menu',
      workspace,
      result: 'success',
    });

    revalidatePath('/cms/frontend-menus');
    revalidatePath('/cms/menu');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xóa mục menu.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Batch reorders menu items.
 */
export async function reorderMenuItemsAction(
  items: ReorderMenuItemInput[],
  workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<void>> {
  try {
    const actor = await requireMenuPermission('reorder');
    const isEn = workspace === 'en';

    await withTransaction(async (sql) => {
      for (const item of items) {
        const id = Number(item.id);
        if (isNaN(id)) continue;
        const parentId = item.parent_id ? Number(item.parent_id) : null;
        const ordering = Number(item.display_order);
        const depth = Number(item.depth);

        if (isEn) {
          await sql`
            UPDATE cic_menus_items_en
            SET parent_id = ${parentId},
                ordering = ${ordering},
                level = ${depth},
                updated_time = now()
            WHERE id = ${id}
          `;
        } else {
          await sql`
            UPDATE cic_menus_items
            SET parent_id = ${parentId},
                ordering = ${ordering},
                level = ${depth},
                updated_time = now()
            WHERE id = ${id}
          `;
        }
      }

      await writeAuditEvent(
        actor,
        {
          action: AUDIT_ACTIONS.MENU_REORDERED,
          entityType: AUDIT_ENTITY_TYPES.MENU,
          entityId: 'batch',
          entityTitle: `Sắp xếp ${items.length} mục menu`,
          module: 'menu',
          workspace,
          result: 'success',
          after: { count: items.length },
        },
        sql
      );
    });

    revalidatePath('/cms/frontend-menus');
    revalidatePath('/cms/menu');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể sắp xếp menu.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Toggles menu item visibility.
 */
export async function toggleMenuItemVisibilityAction(
  itemId: string,
  isVisible: boolean,
  workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<void>> {
  try {
    const actor = await requireMenuPermission('publish');
    const sql = getPostgresClient();
    const id = Number(itemId);
    const isEn = workspace === 'en';

    if (isEn) {
      await sql`UPDATE cic_menus_items_en SET published = ${isVisible}, updated_time = now() WHERE id = ${id}`;
    } else {
      await sql`UPDATE cic_menus_items SET published = ${isVisible}, updated_time = now() WHERE id = ${id}`;
    }

    await writeAuditEvent(actor, {
      action: AUDIT_ACTIONS.MENU_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.MENU,
      entityId: itemId,
      entityTitle: `Mục menu #${itemId}`,
      module: 'menu',
      workspace,
      result: 'success',
      after: { published: isVisible },
    });

    revalidatePath('/cms/frontend-menus');
    revalidatePath('/cms/menu');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể đổi trạng thái hiển thị.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Creates or updates a menu group.
 */
export async function saveMenuGroupAction(
  input: SaveMenuGroupInput,
  workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<MenuGroupDto>> {
  try {
    const isCreate = !input.id || input.id.startsWith('grp_') || isNaN(Number(input.id));
    const actor = await requireMenuPermission(isCreate ? 'create' : 'edit');
    const sql = getPostgresClient();
    const isEn = workspace === 'en';
    const name = input.name.trim();
    const ordering = Number(input.ordering || 1);
    const published = input.published !== false;

    let resultGroup: MenuGroupDto;

    if (isCreate) {
      const rows = isEn
        ? await sql`
            INSERT INTO cic_menus_groups_en (group_name, published, ordering)
            VALUES (${name}, ${published}, ${ordering})
            RETURNING id
          `
        : await sql`
            INSERT INTO cic_menus_groups (group_name, published, ordering)
            VALUES (${name}, ${published}, ${ordering})
            RETURNING id
          `;

      const newId = String(rows[0].id);
      resultGroup = { id: newId, name, published, ordering };

      await writeAuditEvent(actor, {
        action: AUDIT_ACTIONS.MENU_CREATED,
        entityType: AUDIT_ENTITY_TYPES.MENU,
        entityId: newId,
        entityTitle: `Nhóm menu: ${name}`,
        module: 'menu',
        workspace,
        result: 'success',
        after: resultGroup,
      });
    } else {
      const id = Number(input.id);
      if (isEn) {
        await sql`
          UPDATE cic_menus_groups_en
          SET group_name = ${name}, published = ${published}, ordering = ${ordering}
          WHERE id = ${id}
        `;
      } else {
        await sql`
          UPDATE cic_menus_groups
          SET group_name = ${name}, published = ${published}, ordering = ${ordering}
          WHERE id = ${id}
        `;
      }

      resultGroup = { id: String(id), name, published, ordering };

      await writeAuditEvent(actor, {
        action: AUDIT_ACTIONS.MENU_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.MENU,
        entityId: String(id),
        entityTitle: `Nhóm menu: ${name}`,
        module: 'menu',
        workspace,
        result: 'success',
        after: resultGroup,
      });
    }

    revalidatePath('/cms/frontend-menus');
    revalidatePath('/cms/menu');
    return { success: true, data: resultGroup };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể lưu nhóm menu.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Deletes a menu group and all its items.
 */
export async function deleteMenuGroupAction(
  groupId: string,
  workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<void>> {
  try {
    const actor = await requireMenuPermission('delete');
    const sql = getPostgresClient();
    const id = Number(groupId);
    const isEn = workspace === 'en';

    await withTransaction(async (tx) => {
      if (isEn) {
        await tx`DELETE FROM cic_menus_items_en WHERE group_id = ${id}`;
        await tx`DELETE FROM cic_menus_groups_en WHERE id = ${id}`;
      } else {
        await tx`DELETE FROM cic_menus_items WHERE group_id = ${id}`;
        await tx`DELETE FROM cic_menus_groups WHERE id = ${id}`;
      }

      await writeAuditEvent(
        actor,
        {
          action: AUDIT_ACTIONS.MENU_DELETED,
          entityType: AUDIT_ENTITY_TYPES.MENU,
          entityId: groupId,
          entityTitle: `Nhóm menu #${groupId}`,
          module: 'menu',
          workspace,
          result: 'success',
        },
        tx
      );
    });

    revalidatePath('/cms/frontend-menus');
    revalidatePath('/cms/menu');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xóa nhóm menu.';
    return { success: false, error: message };
  }
}
