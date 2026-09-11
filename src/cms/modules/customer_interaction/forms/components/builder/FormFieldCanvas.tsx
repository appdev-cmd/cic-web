import React from 'react';
import { Layers, FileText, ChevronUp, ChevronDown, GripVertical, Trash2, Lock } from 'lucide-react';
import { FormField } from '../../types';
import { FIELD_ROLE_TYPES } from '../../../shared/constants/fieldTypes';

interface FormFieldCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onMoveField: (fieldId: string, direction: 'up' | 'down') => void;
  onDeleteField: (fieldId: string) => void;
}

export const FormFieldCanvas: React.FC<FormFieldCanvasProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onMoveField,
  onDeleteField,
}) => {
  return (
    <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4 flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-500" />
          Danh sách trường ({fields.length})
        </h3>
        <span className="text-[11px] text-slate-400">Kéo/Di chuyển thứ tự</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar max-h-[500px] pr-1">
        {fields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Chưa có trường dữ liệu nào
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Nhấn chọn các mục ở cột bên trái để thêm vào biểu mẫu.
            </p>
          </div>
        ) : (
          fields.map((field, idx) => {
            const isSelected = selectedFieldId === field.id;
            const roleObj = FIELD_ROLE_TYPES.find((r) => r.value === field.roleType);

            return (
              <div
                key={field.id}
                onClick={() => onSelectField(field.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveField(field.id, 'up');
                      }}
                      disabled={idx === 0}
                      className="p-0.5 text-slate-400 hover:text-orange-600 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveField(field.id, 'down');
                      }}
                      disabled={idx === fields.length - 1}
                      className="p-0.5 text-slate-400 hover:text-orange-600 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Drag Handle Icon */}
                  <GripVertical className="w-4 h-4 text-slate-300 mt-1 shrink-0" />

                  {/* Field info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {field.label || 'Chưa đặt tiêu đề'}
                      </span>
                      {field.isRequired && <span className="text-red-500 font-bold">*</span>}
                      {field.isLocked && (
                        <span title="Đã khóa"><Lock className="w-3 h-3 text-amber-500" /></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded-md">
                        {field.fieldKey}
                      </span>
                      {roleObj && (
                        <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 dark:bg-orange-950 dark:text-orange-300 px-1.5 py-0.5 rounded-md">
                          {roleObj.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteField(field.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Xóa trường"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
