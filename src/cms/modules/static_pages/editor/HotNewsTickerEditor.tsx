import React, { useMemo, useState } from 'react';
import {
  Bell,
  Check,
  Flame,
  ListFilter,
  MoveDown,
  MoveUp,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { PageBuilderConfigValue, PageBuilderEntityOption } from '../pageBuilderTypes';
import { mockArticles } from '../../news/mockData';

interface HotNewsTickerEditorProps {
  items: string[];
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void;
  entityOptions?: PageBuilderEntityOption[];
}

export function HotNewsTickerEditor({
  items,
  path,
  onChange,
  entityOptions = [],
}: HotNewsTickerEditorProps) {
  const [mode, setMode] = useState<'auto_hot' | 'manual_news' | 'custom_text'>('auto_hot');
  const [autoLimit, setAutoLimit] = useState(4);
  const [onlyPublished, setOnlyPublished] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Consolidate available news from mockArticles and entityOptions
  const allNews = useMemo(() => {
    const list: Array<{ id: string; title: string; is_hot: boolean; published: boolean; date?: string; category?: string }> = [];
    const seen = new Set<string>();

    mockArticles.forEach((art) => {
      seen.add(art.id);
      list.push({
        id: art.id,
        title: art.title,
        is_hot: Boolean(art.is_hot),
        published: Boolean(art.published),
        date: art.created_time?.split(' ')[0] || '2026-08-01',
        category: art.category_id,
      });
    });

    entityOptions
      .filter((opt) => opt.entityType === 'news')
      .forEach((opt) => {
        if (!seen.has(opt.id)) {
          seen.add(opt.id);
          list.push({
            id: opt.id,
            title: opt.label,
            is_hot: true,
            published: true,
            date: '2026-08-01',
            category: opt.description,
          });
        }
      });

    return list;
  }, [entityOptions]);

  // Compute hot news items based on filters
  const hotNewsArticles = useMemo(() => {
    return allNews
      .filter((n) => n.is_hot && (!onlyPublished || n.published))
      .slice(0, autoLimit);
  }, [allNews, onlyPublished, autoLimit]);

  // Auto-sync titles when in auto_hot mode if items differ
  const handleApplyAutoHot = () => {
    const titles = hotNewsArticles.map((n) => n.title);
    onChange(path, titles as any);
  };

  // Toggle selection for manual news mode
  const handleToggleNewsId = (id: string) => {
    let nextIds: string[];
    if (selectedIds.includes(id)) {
      nextIds = selectedIds.filter((item) => item !== id);
    } else {
      nextIds = [...selectedIds, id];
    }
    setSelectedIds(nextIds);
    const titles = nextIds
      .map((nid) => allNews.find((n) => n.id === nid)?.title)
      .filter((t): t is string => Boolean(t));
    onChange(path, titles as any);
  };

  const handleMoveSelected = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= selectedIds.length) return;
    const nextIds = [...selectedIds];
    const item = nextIds[idx];
    nextIds[idx] = nextIds[targetIdx];
    nextIds[targetIdx] = item;
    setSelectedIds(nextIds);
    const titles = nextIds
      .map((nid) => allNews.find((n) => n.id === nid)?.title)
      .filter((t): t is string => Boolean(t));
    onChange(path, titles as any);
  };

  // Custom text handlers
  const handleAddCustom = () => {
    if (!newItem.trim()) return;
    onChange(path, [...items, newItem.trim()] as any);
    setNewItem('');
  };

  const handleRemoveCustom = (idx: number) => {
    onChange(path, items.filter((_, i) => i !== idx) as any);
  };

  const handleUpdateCustom = (idx: number, val: string) => {
    onChange(path, items.map((it, i) => (i === idx ? val : it)) as any);
  };

  const filteredNewsForPicker = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allNews;
    return allNews.filter((n) => n.title.toLowerCase().includes(q));
  }, [allNews, searchQuery]);

  return (
    <div className="space-y-4 rounded-2xl border border-orange-200 bg-gradient-to-b from-orange-50/40 via-white to-slate-50/50 p-4 shadow-xs dark:border-orange-900/40 dark:from-slate-900/80 dark:to-slate-950 md:col-span-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white shadow-xs">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Dải tin chạy chân Hero (Hot News Ticker)
              </h3>
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-black text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                HOT NEWS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cấu hình nội dung chữ chạy ngang chân Banner trang chủ ({items.length} tin đang hiển thị)
            </p>
          </div>
        </div>
      </div>

      {/* Live Marquee Preview */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2.5 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-orange-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xs">
            <Bell className="h-3 w-3 animate-bounce" />
            HOT NEWS
          </span>
          <div className="flex-1 overflow-hidden whitespace-nowrap text-xs font-medium text-slate-200">
            {items.length > 0 ? (
              <span className="inline-block animate-pulse">
                {items.join('  •  ')}
              </span>
            ) : (
              <span className="italic text-slate-500">Chưa có tin nào trong dải chữ chạy...</span>
            )}
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 gap-2 rounded-xl bg-slate-100 p-1 sm:grid-cols-3 dark:bg-slate-800/80">
        <button
          type="button"
          onClick={() => {
            setMode('auto_hot');
            handleApplyAutoHot();
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
            mode === 'auto_hot'
              ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-900 dark:text-orange-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tự động từ Tin HOT</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('manual_news')}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
            mode === 'manual_news'
              ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-900 dark:text-orange-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ListFilter className="h-3.5 w-3.5" />
          <span>Tự chọn bài viết Tin tức</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('custom_text')}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
            mode === 'custom_text'
              ? 'bg-white text-orange-600 shadow-xs dark:bg-slate-900 dark:text-orange-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Nhập tin vắn tùy chỉnh</span>
        </button>
      </div>

      {/* Mode 1: Auto Hot News */}
      {mode === 'auto_hot' && (
        <div className="space-y-3 rounded-xl border border-orange-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lấy tối đa:</span>
              <select
                value={autoLimit}
                onChange={(e) => {
                  const lim = Number(e.target.value);
                  setAutoLimit(lim);
                  const titles = allNews
                    .filter((n) => n.is_hot && (!onlyPublished || n.published))
                    .slice(0, lim)
                    .map((n) => n.title);
                  onChange(path, titles as any);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value={3}>Top 3 tin Hot nhất</option>
                <option value={4}>Top 4 tin Hot nhất</option>
                <option value={5}>Top 5 tin Hot nhất</option>
                <option value={8}>Top 8 tin Hot nhất</option>
                <option value={20}>Tất cả tin đánh dấu Hot</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyPublished}
                onChange={(e) => {
                  const val = e.target.checked;
                  setOnlyPublished(val);
                  const titles = allNews
                    .filter((n) => n.is_hot && (!val || n.published))
                    .slice(0, autoLimit)
                    .map((n) => n.title);
                  onChange(path, titles as any);
                }}
                className="h-4 w-4 rounded accent-orange-600"
              />
              <span>Chỉ lấy bài đã Publish</span>
            </label>

            <button
              type="button"
              onClick={handleApplyAutoHot}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Đồng bộ ngay ({hotNewsArticles.length} bài)
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Các bài viết Tin tức đánh dấu HOT đang được hệ thống tự động đưa vào dải chữ chạy:
            </p>
            {hotNewsArticles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                Không tìm thấy bài viết nào được đánh dấu Hot và xuất bản. Bạn có thể chuyển sang chế độ Tự chọn bài viết hoặc Tùy chỉnh tin vắn.
              </div>
            ) : (
              <div className="space-y-1.5">
                {hotNewsArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-orange-100 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                      {idx + 1}
                    </span>
                    <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                      🔥 HOT
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{article.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">ID: {article.id} · Ngày đăng: {article.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Manual News Selection */}
      {mode === 'manual_news' && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết theo tiêu đề..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Selected items order */}
          {selectedIds.length > 0 && (
            <div className="space-y-2 rounded-xl bg-orange-50/50 p-3 dark:bg-orange-950/20">
              <span className="text-xs font-bold text-orange-800 dark:text-orange-300">
                Thứ tự các bài viết đã chọn ({selectedIds.length}):
              </span>
              <div className="space-y-1.5">
                {selectedIds.map((sid, idx) => {
                  const art = allNews.find((n) => n.id === sid);
                  return (
                    <div
                      key={sid}
                      className="flex items-center justify-between gap-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs shadow-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-orange-100 text-[10px] font-bold text-orange-700">
                          {idx + 1}
                        </span>
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                          {art?.title ?? sid}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSelected(idx, 'up')}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                          title="Lên trước"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selectedIds.length - 1}
                          onClick={() => handleMoveSelected(idx, 'down')}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                          title="Xuống sau"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleNewsId(sid)}
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                          title="Bỏ chọn"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* List of articles to choose from */}
          <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Chọn các bài viết từ kho Tin tức:
            </span>
            {filteredNewsForPicker.map((article) => {
              const isSelected = selectedIds.includes(article.id);
              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => handleToggleNewsId(article.id)}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 text-orange-950 dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? 'border-orange-600 bg-orange-600 text-white'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {article.is_hot && (
                        <span className="rounded bg-red-100 px-1.5 py-0.2 text-[9px] font-black text-red-700 dark:bg-red-950 dark:text-red-300">
                          🔥 HOT
                        </span>
                      )}
                      <span className="font-semibold">{article.title}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-400">{article.date} · ID: {article.id}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Custom Text */}
      {mode === 'custom_text' && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Nhập trực tiếp các dòng tin vắn tùy chỉnh ({items.length} dòng):
          </span>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateCustom(idx, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(idx)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
              placeholder="Nhập nội dung tin vắn / thông báo mới..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-2 text-xs font-bold text-white hover:bg-orange-700"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
