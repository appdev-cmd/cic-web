import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Send,
  CheckCircle2,
  Globe,
  Sparkles,
  Layers,
  Palette,
  Calendar,
  Languages,
  ShieldCheck,
  Eye,
  Plus,
  Trash2,
  FolderTree,
  AlertTriangle,
  HelpCircle,
  FileCode,
  Image as ImageIcon,
  Sliders,
  Check,
} from 'lucide-react';
import { BlockItem, BlockType, ScopeRule, WorkflowStatus, TranslationStatus, PlacementZone } from './types';

interface ContentBlockEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  block: BlockItem | null;
  placements: PlacementZone[];
  onSave: (updatedBlock: BlockItem, action: 'draft' | 'submit' | 'publish') => void;
  onOpenScopePicker: (scope: ScopeRule, onSave: (s: ScopeRule) => void) => void;
  onOpenPreview: (block: BlockItem) => void;
}

export const ContentBlockEditorDrawer: React.FC<ContentBlockEditorDrawerProps> = ({
  isOpen,
  onClose,
  block,
  placements,
  onSave,
  onOpenScopePicker,
  onOpenPreview,
}) => {
  const [formData, setFormData] = useState<Partial<BlockItem>>({});
  const [activeTab, setActiveTab] = useState<string>('general');
  const [activeLocale, setActiveLocale] = useState<'vi' | 'en' | 'ja'>('vi');

  useEffect(() => {
    if (block) {
      setFormData(JSON.parse(JSON.stringify(block)));
    } else {
      // Default new block
      setFormData({
        id: `blk_${Date.now()}`,
        title: '',
        code_alias: '',
        type: 'hero_cta',
        description: '',
        tags: [],
        owner_name: 'Nguyễn Văn Minh',
        owner_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        show_title: true,
        layout_variant: 'standard',
        site_id: 'main_site',
        placement_id: placements[0]?.id ?? '',
        placement_name: placements[0]?.name ?? '',
        scope: {
          site_id: 'main_site',
          apply_all_pages: false,
          included_pages: ['/'],
          excluded_pages: [],
        },
        used_by_count: 1,
        used_by_pages: [{ page_id: 'node_home', page_title: 'Trang chủ', page_path: '/' }],
        content: {
          headline: '',
          subtitle: '',
          cta_text: 'Xem Chi Tiết',
          cta_url: '/',
          items_list: [],
        },
        display_order: 1,
        priority_weight: 5,
        start_time: new Date().toISOString(),
        end_time: '2026-12-31T23:59:59Z',
        auto_deactivate: true,
        locale_status: { vi: 'complete', en: 'missing', ja: 'missing' },
        workflow_status: 'draft',
        effective_status: 'inactive',
        live_version: '-',
        draft_version: 'v0.1-draft',
        has_draft_changes: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, [block, isOpen]);

  if (!isOpen) return null;

  const updateContentField = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...(prev.content || {}),
        [key]: value,
      },
      has_draft_changes: true,
    }));
  };

  const updateScope = (newScope: ScopeRule) => {
    setFormData((prev) => ({
      ...prev,
      scope: newScope,
      has_draft_changes: true,
    }));
  };

  const handleAddItem = () => {
    const list = formData.content?.items_list || [];
    const newItem = {
      id: `item_${Date.now()}`,
      title: 'Mục mới',
      description: 'Mô tả ngắn gọn cho mục mới này.',
    };
    updateContentField('items_list', [...list, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    const list = formData.content?.items_list || [];
    updateContentField('items_list', list.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: string, val: string) => {
    const list = formData.content?.items_list || [];
    const updated = list.map((item) => (item.id === id ? { ...item, [field]: val } : item));
    updateContentField('items_list', updated);
  };

  const handlePlacementChange = (plcId: string) => {
    const selectedPlc = placements.find((placement) => placement.id === plcId);
    setFormData((prev) => ({
      ...prev,
      placement_id: plcId,
      placement_name: selectedPlc ? selectedPlc.name : '(Chưa chọn)',
      has_draft_changes: true,
    }));
  };

  const handleAction = (action: 'draft' | 'submit' | 'publish') => {
    let newStatus: WorkflowStatus = formData.workflow_status || 'draft';
    if (action === 'submit') newStatus = 'pending_review';
    if (action === 'publish') newStatus = 'published';

    const finalBlock: BlockItem = {
      ...(formData as BlockItem),
      workflow_status: newStatus,
      effective_status: action === 'publish' ? 'running' : formData.effective_status || 'inactive',
      has_draft_changes: action === 'publish' ? false : true,
      updated_at: new Date().toISOString(),
    };

    onSave(finalBlock, action);
  };

  const blockTypes: Array<{ id: BlockType; label: string; icon: any; desc: string }> = [
    { id: 'hero_cta', label: 'Hero CTA Banner', icon: Sparkles, desc: 'Banner chính trang chủ có tiêu đề, mô tả và nút kêu gọi hành động' },
    { id: 'announcement_bar', label: 'Thanh Thông Báo (Announcement)', icon: MegaphoneIcon, desc: 'Dải thông báo ưu đãi hoặc tin khẩn chạy ngang đầu trang' },
    { id: 'feature_grid', label: 'Lưới Tính Năng (Feature Grid)', icon: Layers, desc: 'Lưới các giá trị cốt lõi, ưu thế sản phẩm hoặc dịch vụ' },
    { id: 'highlight_banner', label: 'Banner Khuyến Mãi', icon: ImageIcon, desc: 'Hình ảnh chiến dịch có nút CTA và liên kết đích' },
    { id: 'testimonial_slider', label: 'Slide Đánh Giá Client', icon: Sliders, desc: 'Trích dẫn nhận xét và logo các đối tác tiêu biểu' },
    { id: 'faq_accordion', label: 'Accordion FAQ', icon: HelpCircle, desc: 'Danh sách câu hỏi thường gặp dạng đóng mở' },
    { id: 'rich_text', label: 'Khối Văn Bản Rich-Text', icon: FileCode, desc: 'Văn bản tùy biến có HTML, nút bấm hoặc form' },
    { id: 'module_embed', label: 'Nguồn Module Nhúng', icon: FileCode, desc: 'Nhúng Widget, Iframe hoặc Form động' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Sticky Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-850 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {formData.title || 'Khối Nội Dung Mới'}
                </h2>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    formData.workflow_status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {formData.workflow_status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {formData.code_alias || 'alias-placeholder'} • Working: {formData.draft_version}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenPreview(formData as BlockItem)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview Context
            </button>
            <button
              type="button"
              onClick={() => handleAction('draft')}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Lưu Draft
            </button>
            <button
              type="button"
              onClick={() => handleAction('submit')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Gửi Duyệt
            </button>
            <button
              type="button"
              onClick={() => handleAction('publish')}
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Xuất Bản Live
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'general', label: '1. Thông Tin Chung' },
            { id: 'type', label: '2. Loại Khối' },
            { id: 'content', label: '3. Nội Dung Core' },
            { id: 'styling', label: '4. Trình Bày' },
            { id: 'placement', label: '5. Vị Trí & Scope' },
            { id: 'schedule', label: '6. Thứ Tự & Lịch' },
            { id: 'translation', label: '7. Bản Dịch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-600 text-orange-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: THÔNG TIN CHUNG */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Tên Nhận Diện Khối <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Khối Hero Banner & Đăng ký Tư vấn 2026"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value, has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Mã Alias (Code Identifier)
                  </label>
                  <input
                    type="text"
                    placeholder="home-hero-cta-2026"
                    value={formData.code_alias || ''}
                    onChange={(e) => setFormData({ ...formData, code_alias: e.target.value, has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Mô Tả Nội Bộ / Ghi Chú Chiến Dịch
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú mục đích sử dụng cho bộ phận biên tập và marketing..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value, has_draft_changes: true })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Người Quản Lý Chịu Trách Nhiệm (Owner)
                  </label>
                  <input
                    type="text"
                    value={formData.owner_name || ''}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value, has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Trang Web Phạm Vi (Site Locale)
                  </label>
                  <select
                    value={formData.site_id || 'main_site'}
                    onChange={(e) => setFormData({ ...formData, site_id: e.target.value as any, has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="main_site">Trang chính Tiếng Việt (VN Main Portal)</option>
                    <option value="en_site">Trang Tiếng Anh (Global EN Portal)</option>
                    <option value="jp_site">Trang Tiếng Nhật (JP Partner Portal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LOẠI KHỐI */}
          {activeTab === 'type' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Chọn Loại Khối Hiển Thị (Block Type)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {blockTypes.map((bt) => {
                  const IconC = bt.icon;
                  const isSelected = formData.type === bt.id;
                  return (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: bt.id, has_draft_changes: true })}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-orange-50/80 border-orange-500 text-orange-950 dark:bg-orange-950/40 dark:border-orange-500 dark:text-orange-100 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <IconC className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block text-slate-900 dark:text-white">
                          {bt.label}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {bt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: NỘI DUNG CORE */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Tiêu Đề Chính (Headline)
                </label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề hấp dẫn thu hút người đọc..."
                  value={formData.content?.headline || ''}
                  onChange={(e) => updateContentField('headline', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Tiêu Đề Phụ / Mô Tả Ngắn (Subtitle)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả bổ trợ làm rõ giá trị cung cấp..."
                  value={formData.content?.subtitle || ''}
                  onChange={(e) => updateContentField('subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Nhãn Nút CTA Chính
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Đăng Ký Khảo Sát Miễn Phí"
                    value={formData.content?.cta_text || ''}
                    onChange={(e) => updateContentField('cta_text', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Đường Dẫn Đích CTA (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="/services/consulting"
                    value={formData.content?.cta_url || ''}
                    onChange={(e) => updateContentField('cta_url', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Đường Dẫn Media Asset / Banner Image
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.content?.media_url || ''}
                  onChange={(e) => updateContentField('media_url', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Items List for Feature Grid & FAQ Accordion */}
              {(formData.type === 'feature_grid' || formData.type === 'faq_accordion' || formData.type === 'testimonial_slider') && (
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Danh Sách Mục Con (Items List)
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Mục
                    </button>
                  </div>

                  {formData.content?.items_list?.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Mục #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Tiêu đề mục..."
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="Mô tả nội dung chi tiết..."
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Module Embed Code Input */}
              {formData.type === 'module_embed' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Mã Nhúng Module (Iframe / Embed Code)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="<iframe src='...' width='100%'></iframe>"
                    value={formData.content?.embed_code || ''}
                    onChange={(e) => updateContentField('embed_code', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 font-mono text-emerald-400 border border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: TRÌNH BÀY (STYLING) */}
          {activeTab === 'styling' && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  checked={formData.show_title ?? true}
                  onChange={(e) => setFormData({ ...formData, show_title: e.target.checked, has_draft_changes: true })}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Hiển Thị Tiêu Đề Khối Công Khai (Show Block Title)
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bật để hiển thị tiêu đề khối trên giao diện người dùng frontend.
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Layout Variant (Kiểu Trình Bày)
                </label>
                <select
                  value={formData.layout_variant || 'standard'}
                  onChange={(e) => setFormData({ ...formData, layout_variant: e.target.value as any, has_draft_changes: true })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="standard">Standard Card (Mặc định)</option>
                  <option value="centered">Centered Title & Layout (Căn giữa)</option>
                  <option value="grid_2col">Grid 2 Cột</option>
                  <option value="grid_3col">Grid 3 Cột</option>
                  <option value="compact_card">Compact Card (Cột bên Sidebar)</option>
                  <option value="fullwidth_dark">Fullwidth Dark Theme (Nền tối rộng toàn màn hình)</option>
                  <option value="light_neutral">Light Neutral Minimalist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Custom CSS Class (Tùy chọn CSS)
                </label>
                <input
                  type="text"
                  placeholder="hero-gradient-orange my-custom-class"
                  value={formData.custom_css_class || ''}
                  onChange={(e) => setFormData({ ...formData, custom_css_class: e.target.value, has_draft_changes: true })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* SECTION 5: VỊ TRÍ & SCOPE */}
          {activeTab === 'placement' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Vị Trí Cấu Hình (Placement Zone) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.placement_id || ''}
                  onChange={(e) => handlePlacementChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold"
                >
                  <option value="">-- Chọn Vị Trí Hiển Thị --</option>
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Box Trigger */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cấu Hình Scope Hiển Thị</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {formData.scope?.apply_all_pages
                        ? 'Toàn bộ website (All Pages)'
                        : `${formData.scope?.included_pages?.length || 0} trang đã chọn`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenScopePicker(formData.scope || { site_id: 'main_site', apply_all_pages: false, included_pages: [], excluded_pages: [] }, updateScope)
                    }
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <FolderTree className="w-3.5 h-3.5" /> Mở Cây Thư Mục Scope
                  </button>
                </div>

                {formData.scope?.excluded_pages && formData.scope.excluded_pages.length > 0 && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    Ngoại lệ ({formData.scope.excluded_pages.length}): {formData.scope.excluded_pages.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SECTION 6: THỨ TỰ & LỊCH HIỆU LỰC */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Thứ Tự Hiển Thị (Display Order #)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.display_order ?? 1}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1, has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Trọng Số Ưu Tiên (Priority Weight 1-10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.priority_weight ?? 5}
                    onChange={(e) => setFormData({ ...formData, priority_weight: parseInt(e.target.value) || 5, has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Thời Gian Bắt Đầu Bật
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, start_time: new Date(e.target.value).toISOString(), has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Thời Gian Kết Thúc Trự Bản
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_time ? new Date(formData.end_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, end_time: new Date(e.target.value).toISOString(), has_draft_changes: true })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: BẢN DỊCH */}
          {activeTab === 'translation' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Languages className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Quản Lý Bản Dịch Đa Ngôn Ngữ (Multi-Locale Editor)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {(['vi', 'en', 'ja'] as const).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setActiveLocale(loc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                      activeLocale === loc
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{loc}</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      ({formData.locale_status?.[loc] || 'missing'})
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">
                  Nội dung bản dịch Tiếng ({activeLocale.toUpperCase()})
                </span>
                <input
                  type="text"
                  placeholder={`Headline (${activeLocale.toUpperCase()})...`}
                  value={formData.content?.headline || ''}
                  onChange={(e) => updateContentField('headline', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function MegaphoneIcon(props: any) {
  return <Sparkles {...props} />;
}
