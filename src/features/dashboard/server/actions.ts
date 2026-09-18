'use server';

import { requireCmsAccess } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import { revalidatePath } from 'next/cache';
import { writeAuditEvent } from '@/server/audit/writer';

export async function updateDashboardItemStatusAction(
  type: 'contact' | 'registration' | 'pending',
  id: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const access = await requireCmsAccess();
    const sql = getPostgresClient();
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return { success: false, error: 'Mã định danh không hợp lệ.' };
    }

    if (type === 'contact') {
      const isCompleted = newStatus === 'completed';
      const [updatedVi] = await sql<Array<{ id: number; fullname: string | null; email: string }>>`
        UPDATE cic_contact 
        SET published = ${isCompleted} 
        WHERE id = ${numericId} 
        RETURNING id, fullname, email
      `;

      let targetTitle = updatedVi?.fullname || updatedVi?.email;
      let workspace: 'vi' | 'en' = 'vi';

      if (!updatedVi) {
        const [updatedEn] = await sql<Array<{ id: number; fullname: string | null; email: string }>>`
          UPDATE cic_contact_en 
          SET published = ${isCompleted} 
          WHERE id = ${numericId} 
          RETURNING id, fullname, email
        `;
        if (updatedEn) {
          targetTitle = updatedEn.fullname || updatedEn.email;
          workspace = 'en';
        }
      }

      await writeAuditEvent(access, {
        action: 'customer_request.status_changed',
        entityType: 'customer_request',
        entityId: String(numericId),
        entityTitle: targetTitle || `Liên hệ #${id}`,
        module: 'dashboard',
        workspace,
        result: 'success',
      });
    } else if (type === 'registration') {
      const isQuoted = newStatus === 'quoted' || newStatus === 'completed';
      const [updated] = await sql<Array<{ id: number; fullname: string | null; products_name: string | null }>>`
        UPDATE cic_product_contact 
        SET published = ${isQuoted} 
        WHERE id = ${numericId} 
        RETURNING id, fullname, products_name
      `;

      await writeAuditEvent(access, {
        action: 'customer_request.status_changed',
        entityType: 'customer_request',
        entityId: String(numericId),
        entityTitle: updated ? `${updated.fullname} (${updated.products_name})` : `Tư vấn SP #${id}`,
        module: 'dashboard',
        workspace: 'vi',
        result: 'success',
      });
    } else if (type === 'pending') {
      // Publish news or product
      const [prod] = await sql<Array<{ id: number; name: string | null }>>`
        UPDATE cic_products 
        SET published = true 
        WHERE id = ${numericId} 
        RETURNING id, name
      `;
      if (prod) {
        await writeAuditEvent(access, {
          action: 'product.status_changed',
          entityType: 'product',
          entityId: String(numericId),
          entityTitle: prod.name || `Sản phẩm #${id}`,
          module: 'dashboard',
          workspace: 'vi',
          result: 'success',
        });
      } else {
        const [news] = await sql<Array<{ id: number; title: string | null }>>`
          UPDATE cic_news 
          SET published = true 
          WHERE id = ${numericId} 
          RETURNING id, title
        `;
        if (news) {
          await writeAuditEvent(access, {
            action: 'news.status_changed',
            entityType: 'news',
            entityId: String(numericId),
            entityTitle: news.title || `Tin tức #${id}`,
            module: 'dashboard',
            workspace: 'vi',
            result: 'success',
          });
        }
      }
    }

    revalidatePath('/cms/dashboard');
    return { success: true };
  } catch (err: unknown) {
    console.error('Failed to update dashboard item status:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật.' };
  }
}
