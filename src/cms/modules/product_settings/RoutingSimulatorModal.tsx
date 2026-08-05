import React, { useState } from 'react';
import {
  X,
  Play,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Send,
  Building,
  Tag,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { MasterRoutingRuleItem, MasterCategoryItem, MasterBrandItem, MasterSalesStaffItem } from './types';

interface RoutingSimulatorModalProps {
  isOpen: boolean;
  rules: MasterRoutingRuleItem[];
  categories: MasterCategoryItem[];
  brands: MasterBrandItem[];
  staff: MasterSalesStaffItem[];
  onClose: () => void;
}

export const RoutingSimulatorModal: React.FC<RoutingSimulatorModalProps> = ({
  isOpen,
  rules,
  categories,
  brands,
  staff,
  onClose,
}) => {
  if (!isOpen) return null;

  // Test Simulation Input State
  const [testSubject, setTestSubject] = useState('Yêu cầu báo giá phần mềm ETABS V21 cho 20 chỗ');
  const [testCategoryId, setTestCategoryId] = useState('cat_001');
  const [testBrandId, setTestBrandId] = useState('brd_001');
  const [testKeyword, setTestKeyword] = useState('etabs');
  const [customerEmail, setCustomerEmail] = useState('khachhang@vinaconex.vn');

  // Simulation Result State
  const [hasRun, setHasRun] = useState(false);
  const [matchedRule, setMatchedRule] = useState<MasterRoutingRuleItem | null>(null);
  const [assignedSales, setAssignedSales] = useState<MasterSalesStaffItem | null>(null);

  const handleRunSimulation = () => {
    // Evaluation Logic: Match priority order (lower priority number = higher precedence)
    const sortedActiveRules = [...rules]
      .filter((r) => r.status === 'active')
      .sort((a, b) => a.priority - b.priority);

    let match: MasterRoutingRuleItem | null = null;

    for (const r of sortedActiveRules) {
      // 1. Check Category scope
      const matchCat = r.scope_category_ids.length === 0 || r.scope_category_ids.includes(testCategoryId);
      
      // 2. Check Brand scope
      const matchBrd = r.scope_brand_ids.length === 0 || r.scope_brand_ids.includes(testBrandId);

      // 3. Check Keyword triggers in subject or keyword input
      const kwInput = (testSubject + ' ' + testKeyword).toLowerCase();
      const matchKw =
        r.trigger_keywords.includes('*') ||
        r.trigger_keywords.some((kw) => kwInput.includes(kw.toLowerCase()));

      if (matchCat && matchBrd && matchKw) {
        match = r;
        break;
      }
    }

    if (!match) {
      // Fallback rule
      match = rules.find((r) => r.code === 'RULE-DEFAULT-FALLBACK') || sortedActiveRules[sortedActiveRules.length - 1];
    }

    const assigned = staff.find((s) => s.id === match?.primary_sales_id) || staff[0];

    setMatchedRule(match);
    setAssignedSales(assigned);
    setHasRun(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 text-white rounded-xl shadow-md shadow-orange-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Kiểm tra nơi nhận liên hệ và email
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhập kịch bản khách hàng gửi liên hệ để kiểm tra quy tắc nhận mail nào sẽ kích hoạt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Input Fields Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px] flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-orange-600" />
                <span>Giả lập Thông tin Yêu cầu Liên hệ</span>
              </span>
              <span className="text-[10px] text-orange-600 font-bold bg-orange-500/10 px-2 py-0.5 rounded">
                Test Case Sandbox
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Email Khách hàng:
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Từ khóa chính (Keyword):
                </label>
                <input
                  type="text"
                  value={testKeyword}
                  onChange={(e) => setTestKeyword(e.target.value)}
                  placeholder="Ví dụ: ETABS, PLAXIS, ESCON"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Tiêu đề & Nội dung liên hệ:
              </label>
              <input
                type="text"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Danh mục Sản phẩm chọn:
                </label>
                <select
                  value={testCategoryId}
                  onChange={(e) => setTestCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="">-- Tất cả danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Hãng sản xuất chọn:
                </label>
                <select
                  value={testBrandId}
                  onChange={(e) => setTestBrandId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="">-- Tất cả hãng --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Chạy thử Kiểm tra Phân luồng (Run Test)</span>
            </button>
          </div>

          {/* Result Output Card */}
          {hasRun && matchedRule && assignedSales && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>KẾT QUẢ PHÂN LUỒNG MÔ PHỎNG THÀNH CÔNG</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded">
                  Priority #{matchedRule.priority}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Matched Rule Info */}
                <div className="space-y-1.5">
                  <div className="text-slate-500 text-[11px] font-medium">Quy tắc khớp (Matched Rule):</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {matchedRule.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Mã quy tắc: <code className="font-mono text-orange-600">{matchedRule.code}</code>
                  </div>
                </div>

                {/* Assigned Sales Staff */}
                <div className="space-y-1.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/20">
                  <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span>Người phụ trách nhận Email:</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {assignedSales.avatar ? (
                      <img src={assignedSales.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">
                        {assignedSales.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {assignedSales.name}
                      </div>
                      <div className="text-[11px] text-orange-600 font-mono">
                        {assignedSales.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CC Notification Emails */}
              <div className="text-xs pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-slate-500">Email CC gửi đồng thời:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {matchedRule.notify_cc_emails.join(', ') || 'Không có'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
