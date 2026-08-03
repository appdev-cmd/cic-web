import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  id: string;
  name?: string;
  label?: string;
  code?: string;
  category?: string;
  subLabel?: string;
  image?: string;
}

interface SearchableSelectProps {
  label?: string;
  options: SelectOption[];
  selectedId: string;
  onChange: (selectedId: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  selectedId,
  onChange,
  placeholder = 'Chọn một mục...',
  searchPlaceholder = 'Gõ để tìm kiếm...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getOptionLabel = (opt: SelectOption) => opt.name || opt.label || '';

  const filteredOptions = options.filter((opt) => {
    const labelText = getOptionLabel(opt).toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      labelText.includes(query) ||
      (opt.code && opt.code.toLowerCase().includes(query)) ||
      (opt.subLabel && opt.subLabel.toLowerCase().includes(query)) ||
      (opt.category && opt.category.toLowerCase().includes(query))
    );
  });

  const selectedOption = options.find((opt) => opt.id === selectedId);

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer hover:border-orange-500 transition-colors text-xs font-semibold"
      >
        <span className={selectedOption ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-150">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                Không tìm thấy kết quả phù hợp
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === selectedId;
                const optLabel = getOptionLabel(opt);
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.image && (
                        <img src={opt.image} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                      )}
                      <span className="truncate">{optLabel}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface SearchableMultiSelectProps {
  label?: string;
  options: SelectOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = 'Tìm kiếm và chọn...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getOptionLabel = (opt: SelectOption) => opt.name || opt.label || '';

  const filteredOptions = options.filter((opt) => {
    const labelText = getOptionLabel(opt).toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      labelText.includes(query) ||
      (opt.code && opt.code.toLowerCase().includes(query)) ||
      (opt.subLabel && opt.subLabel.toLowerCase().includes(query)) ||
      (opt.category && opt.category.toLowerCase().includes(query))
    );
  });

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((item) => item !== id));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[11px] font-normal text-slate-400 font-mono">
            Đã chọn: {selectedIds.length}
          </span>
        </label>
      )}

      {/* Main Trigger Box */}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[42px] p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-orange-500 transition-colors"
        >
          {selectedIds.length === 0 ? (
            <span className="text-xs text-slate-400 px-2">{placeholder}</span>
          ) : (
            selectedIds.map((id) => {
              const item = options.find((opt) => opt.id === id);
              if (!item) return null;
              return (
                <span
                  key={id}
                  className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {item.image && (
                    <img src={item.image} alt="" className="w-4 h-4 rounded object-cover" />
                  )}
                  <span className="truncate max-w-[150px]">{getOptionLabel(item)}</span>
                  <button
                    type="button"
                    onClick={(e) => removeOption(id, e)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })
          )}

          <div className="ml-auto flex items-center gap-1 text-slate-400">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="p-1 hover:text-red-500 transition-colors text-xs font-bold"
                title="Bỏ chọn tất cả"
              >
                Bỏ chọn
              </button>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-150">
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Gõ để tìm kiếm..."
                className="w-full bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không tìm thấy kết quả nào phù hợp
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        {opt.image && (
                          <img
                            src={opt.image}
                            alt=""
                            className="w-7 h-7 rounded-md object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <p className="truncate font-medium">{getOptionLabel(opt)}</p>
                          {(opt.code || opt.category || opt.subLabel) && (
                            <p className="text-[10px] text-slate-400 truncate">
                              {opt.code ? `Mã: ${opt.code}` : ''} {opt.subLabel ? opt.subLabel : ''} {opt.category ? `• ${opt.category}` : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
