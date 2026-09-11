import React from 'react';
import { Plus } from 'lucide-react';
import { FIELD_TYPES, FieldType } from '../../../shared/constants/fieldTypes';

interface FormFieldPaletteProps {
  onAddField: (fieldType: FieldType) => void;
}

export const FormFieldPalette: React.FC<FormFieldPaletteProps> = ({ onAddField }) => {
  return (
    <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Thêm loại trường</span>
        <Plus className="w-3.5 h-3.5 text-orange-500" />
      </h3>

      <div className="space-y-1.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
        {FIELD_TYPES.map((ft) => (
          <button
            key={ft.value}
            type="button"
            onClick={() => onAddField(ft.value as FieldType)}
            className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-orange-600 dark:group-hover:text-orange-400">
                {ft.label}
              </span>
            </div>
            <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};
