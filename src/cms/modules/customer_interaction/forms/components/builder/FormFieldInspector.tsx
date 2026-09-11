import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { FormField, FieldOption } from '../../types';
import { FIELD_ROLE_TYPES, FieldRoleType } from '../../../shared/constants/fieldTypes';

interface FormFieldInspectorProps {
  selectedField: FormField | undefined;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

export const FormFieldInspector: React.FC<FormFieldInspectorProps> = ({
  selectedField,
  onUpdateField,
}) => {
  return (
    <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
        <Settings className="w-4 h-4 text-orange-500" />
        Chỉnh sửa thuộc tính trường
      </h3>

      {selectedField ? (
        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nhãn hiển thị (Label) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={selectedField.label}
              onChange={(e) => onUpdateField(selectedField.id, { label: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mã trường (Field Key) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={selectedField.fieldKey}
              readOnly
              aria-readonly="true"
              title="Mã trường do hệ thống tự sinh và không thể chỉnh sửa"
              className="w-full cursor-not-allowed px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono text-xs focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              Mã trường được hệ thống tự sinh khi thêm trường và không thể chỉnh sửa.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Vai trò nhận diện khách hàng (Role Type)
            </label>
            <select
              value={selectedField.roleType || 'other'}
              onChange={(e) => onUpdateField(selectedField.id, { roleType: e.target.value as FieldRoleType })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {FIELD_ROLE_TYPES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gợi ý nhập (Placeholder)
            </label>
            <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => onUpdateField(selectedField.id, { placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú hướng dẫn (Help Text)
            </label>
            <input
              type="text"
              value={selectedField.helpText || ''}
              onChange={(e) => onUpdateField(selectedField.id, { helpText: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={selectedField.isRequired}
                onChange={(e) =>
                  onUpdateField(selectedField.id, {
                    isRequired: e.target.checked,
                    validation: { ...selectedField.validation, required: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              Bắt buộc nhập dữ liệu (*)
            </label>
          </div>

          {/* Options Manager if field is select/radio/checkbox */}
          {['select', 'radio', 'checkbox'].includes(selectedField.fieldType) && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Danh sách Lựa chọn (Options)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentOpts = selectedField.options || [];
                    const newOpt: FieldOption = {
                      value: `opt_${Date.now()}`,
                      label: `Tùy chọn ${currentOpts.length + 1}`,
                      order: currentOpts.length + 1,
                    };
                    onUpdateField(selectedField.id, { options: [...currentOpts, newOpt] });
                  }}
                  className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  + Thêm lựa chọn
                </button>
              </div>

              <div className="space-y-2">
                {(selectedField.options || []).map((opt, oIdx) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const updatedOpts = [...(selectedField.options || [])];
                        updatedOpts[oIdx] = { ...opt, label: e.target.value };
                        onUpdateField(selectedField.id, { options: updatedOpts });
                      }}
                      className="flex-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedOpts = (selectedField.options || []).filter((_, i) => i !== oIdx);
                        onUpdateField(selectedField.id, { options: updatedOpts });
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <p className="text-xs">Chọn 1 trường ở giữa để chỉnh sửa thuộc tính.</p>
        </div>
      )}
    </div>
  );
};
