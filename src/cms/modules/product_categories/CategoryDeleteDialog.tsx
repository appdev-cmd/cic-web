import type { ProductCategoryItem } from '@/features/product-categories/types';
import { CmsButton } from '../../components/ui/CmsButton';
import { useDialogA11y } from '../activity_logs_trash/useDialogA11y';

type CategoryDeleteDialogProps = {
  item: ProductCategoryItem;
  pending: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onTrash: () => void;
};

export function CategoryDeleteDialog({
  item,
  pending,
  onClose,
  onDeactivate,
  onTrash,
}: CategoryDeleteDialogProps) {
  const dialogRef = useDialogA11y(true, onClose);
  const isTrashBlocked = item.usageCount > 0 || item.childCount > 0;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <h2 className="text-lg font-black">Xóa hoặc ngừng sử dụng</h2>
        <p className="mt-2 text-sm">
          “{item.name}” có {item.usageCount} sản phẩm và {item.childCount} danh mục con.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton>
          <CmsButton variant="secondary" disabled={pending || !item.published} onClick={onDeactivate}>
            Ngừng sử dụng
          </CmsButton>
          <CmsButton variant="danger" disabled={pending || isTrashBlocked} onClick={onTrash}>
            Chuyển vào Thùng rác
          </CmsButton>
        </div>
        {isTrashBlocked && (
          <p className="mt-3 text-xs font-semibold text-amber-700">
            Cần chuyển sản phẩm và danh mục con trước khi xóa.
          </p>
        )}
      </div>
    </div>
  );
}
