import React, { useState, useEffect } from 'react';
import { Database, FileSpreadsheet, Mail, Eye, Check, Copy, RefreshCw, AlertCircle, Sparkles, ExternalLink, Trash2, Plus, Info, Layers } from 'lucide-react';
import { FormFormData, FormField } from '../../types';
import type { FieldType, FieldRoleType } from '../../../shared/constants/fieldTypes';
import { removeVietnameseTones, normalizeText } from '@/lib/integrations/google-sheets/matcher';
import { EMAIL_EVENTS, TEMPLATE_STATUSES, type EmailTemplate } from '../../../../email_templates/types';
import { CmsButton } from '../../../../../components/ui/CmsButton';
import type { CmsLocale } from '../../../../../data/CmsDataSource';
import type { GoogleSheetsColumnMapping, GoogleSheetsDestinationConfig, EmailDestinationConfig } from '@/features/forms/types';
import { useCmsToast } from '@/cms/context/CmsToastContext';

function inferFieldFromHeader(
  header: string,
  index: number,
  existingFieldKeys: Set<string>
): FormField {
  const trimmed = header.trim();
  const normalized = normalizeText(trimmed);

  let baseKey =
    removeVietnameseTones(trimmed)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || `field_${index + 1}`;

  let fieldKey = baseKey;
  let counter = 1;
  while (existingFieldKeys.has(fieldKey.toLowerCase())) {
    fieldKey = `${baseKey}_${counter++}`;
  }
  existingFieldKeys.add(fieldKey.toLowerCase());

  let fieldType: FieldType = 'text';
  let roleType: FieldRoleType = 'other';
  let isRequired = false;
  let placeholder = `Nhập ${trimmed.toLowerCase()}...`;

  if (/^(ho va ten|ho ten|ten khach hang|fullname|full name|name)$/i.test(normalized)) {
    fieldType = 'text';
    roleType = 'customer_name';
    isRequired = true;
    placeholder = 'Nhập họ và tên của bạn...';
  } else if (/^(so dien thoai|dien thoai|sdt|hotline|phone|telephone|mobile)$/i.test(normalized)) {
    fieldType = 'phone';
    roleType = 'phone';
    isRequired = true;
    placeholder = 'Nhập số điện thoại...';
  } else if (/^(email|thu dien tu|dia chi email|mail)$/i.test(normalized)) {
    fieldType = 'email';
    roleType = 'email';
    placeholder = 'Nhập địa chỉ email...';
  } else if (/^(cong ty|to chuc|don vi|doanh nghiep|company|organization)$/i.test(normalized)) {
    fieldType = 'text';
    roleType = 'company';
    placeholder = 'Nhập tên công ty hoặc đơn vị...';
  } else if (/^(noi dung|loi nhan|yeu cau|tin nhan|message|content|nhu cau|ghi chu cua khach)$/i.test(normalized)) {
    fieldType = 'textarea';
    roleType = 'message';
    placeholder = 'Nhập nội dung yêu cầu...';
  } else if (/^(dia chi|address|noi o)$/i.test(normalized)) {
    fieldType = 'text';
    roleType = 'other';
    placeholder = 'Nhập địa chỉ liên hệ...';
  }

  return {
    id: `f_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
    fieldKey,
    label: trimmed,
    fieldType,
    roleType,
    placeholder,
    helpText: '',
    validation: { required: isRequired },
    position: index + 1,
    isRequired,
    isLocked: false,
  };
}

interface FormSubmitActionsTabProps {
  formId?: string;
  formData: FormFormData;
  setFormData: React.Dispatch<React.SetStateAction<FormFormData>>;
  emailTemplates: EmailTemplate[];
  workspaceLocale: CmsLocale;
  onPreviewEmailTemplate: (templateId: string) => void;
}

export const FormSubmitActionsTab: React.FC<FormSubmitActionsTabProps> = ({
  formId,
  formData,
  setFormData,
  emailTemplates,
  workspaceLocale,
  onPreviewEmailTemplate,
}) => {
  const { toast } = useCmsToast();
  // Service Account Email from server
  const [serviceAccountEmail, setServiceAccountEmail] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Google Sheets test connection state
  const [isTestingSheets, setIsTestingSheets] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    title?: string;
    sheets?: string[];
    activeSheet?: string;
    headers?: string[];
    error?: string;
  } | null>(null);

  // Initializing headers state
  const [isInitializingHeaders, setIsInitializingHeaders] = useState(false);
  const [initHeaderSuccess, setInitHeaderSuccess] = useState<string | null>(null);

  // Fetch Service Account email once on mount
  useEffect(() => {
    fetch('/api/cms/forms/service-account')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to fetch service account'))))
      .then((data) => {
        if (data.email) setServiceAccountEmail(data.email);
      })
      .catch((err) => console.warn('[FormSubmitActionsTab] Could not load service account email:', err));
  }, []);

  // Helper to get Google Sheets destination
  const getSheetsDestination = () => {
    return (formData.destinations || []).find((d) => d.destinationType === 'google_sheets');
  };

  const sheetsDest = getSheetsDestination();
  const isSheetsEnabled = Boolean(sheetsDest?.isEnabled);
  const sheetsConfig = (sheetsDest?.config as GoogleSheetsDestinationConfig) || {
    spreadsheetId: '',
    sheetName: 'Sheet1',
    columnMapping: [],
    autoCreateHeaders: true,
  };

  // Helper to update Google Sheets destination
  const updateSheetsDestination = (updates: Partial<GoogleSheetsDestinationConfig>, isEnabled?: boolean) => {
    setFormData((prev) => {
      const existing = prev.destinations || [];
      const otherDests = existing.filter((d) => d.destinationType !== 'google_sheets');
      const current = existing.find((d) => d.destinationType === 'google_sheets');
      const currentConfig = (current?.config as GoogleSheetsDestinationConfig) || {
        spreadsheetId: '',
        sheetName: 'Sheet1',
        columnMapping: [],
        autoCreateHeaders: true,
      };

      const newDest = {
        id: current?.id,
        destinationType: 'google_sheets' as const,
        name: current?.name || 'Google Sheets',
        isEnabled: isEnabled !== undefined ? isEnabled : (current ? current.isEnabled : true),
        config: {
          ...currentConfig,
          ...updates,
        },
      };

      return {
        ...prev,
        destinations: [...otherDests, newDest],
      };
    });
  };

  // Helper to update Email destination & sync with submitConfig
  const updateEmailDestination = (updates: Partial<EmailDestinationConfig>, isEnabled?: boolean) => {
    setFormData((prev) => {
      const existing = prev.destinations || [];
      const otherDests = existing.filter((d) => d.destinationType !== 'email');
      const currentEmailDest = existing.find((d) => d.destinationType === 'email');

      const newIsEnabled = isEnabled !== undefined ? isEnabled : (currentEmailDest ? currentEmailDest.isEnabled : true);

      const newConfig: EmailDestinationConfig = {
        sendAdminEmail: updates.sendAdminEmail !== undefined ? updates.sendAdminEmail : prev.submitConfig.sendAdminEmail,
        adminEmails: updates.adminEmails !== undefined ? updates.adminEmails : prev.submitConfig.adminEmails,
        adminEmailTemplateId: updates.adminEmailTemplateId !== undefined ? updates.adminEmailTemplateId : prev.submitConfig.adminEmailTemplate,
        sendConfirmationEmail: updates.sendConfirmationEmail !== undefined ? updates.sendConfirmationEmail : prev.submitConfig.sendConfirmationEmail,
        confirmationEmailTemplateId: updates.confirmationEmailTemplateId !== undefined ? updates.confirmationEmailTemplateId : prev.submitConfig.confirmationEmailTemplate,
      };

      const newDest = {
        id: currentEmailDest?.id,
        destinationType: 'email' as const,
        name: currentEmailDest?.name || 'Thông báo Email',
        isEnabled: newIsEnabled,
        config: newConfig,
      };

      return {
        ...prev,
        submitConfig: {
          ...prev.submitConfig,
          sendAdminEmail: newIsEnabled && newConfig.sendAdminEmail,
          adminEmails: newConfig.adminEmails,
          adminEmailTemplate: newConfig.adminEmailTemplateId || undefined,
          sendConfirmationEmail: newIsEnabled && newConfig.sendConfirmationEmail,
          confirmationEmailTemplate: newConfig.confirmationEmailTemplateId || undefined,
        },
        destinations: [...otherDests, newDest],
      };
    });
  };

  // Test Google Sheet connection
  const handleTestConnection = async () => {
    if (!sheetsConfig.spreadsheetId) {
      setTestResult({ success: false, error: 'Vui lòng nhập đường dẫn hoặc Spreadsheet ID trước khi kiểm tra.' });
      return;
    }

    setIsTestingSheets(true);
    setTestResult(null);
    setInitHeaderSuccess(null);

    try {
      const res = await fetch(`/api/cms/forms/${formId || 'new'}/destinations/google-sheets/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: sheetsConfig.spreadsheetId,
          sheetName: sheetsConfig.sheetName,
          fields: formData.fields,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setTestResult({
          success: false,
          error: data.error || 'Kiểm tra kết nối thất bại.',
        });
      } else {
        const effectiveSheet = data.activeSheet || (data.sheets && data.sheets.length > 0 ? (data.sheets.includes(sheetsConfig.sheetName) ? sheetsConfig.sheetName : data.sheets[0]) : sheetsConfig.sheetName);

        setTestResult({
          success: true,
          title: data.spreadsheetTitle,
          sheets: data.sheets,
          activeSheet: effectiveSheet,
          headers: data.headers,
        });

        let finalMapping = data.suggestedMapping;
        if ((!finalMapping || finalMapping.length === 0) && data.headers && data.headers.length > 0) {
          finalMapping = data.headers.map((h: string) => {
            const trimmed = h.trim();
            const foundField = formData.fields.find(
              (f) => (f.label && f.label.trim().toLowerCase() === trimmed.toLowerCase()) || f.fieldKey.toLowerCase() === trimmed.toLowerCase()
            );
            if (foundField) {
              return { sheetHeader: trimmed, sourceType: 'field' as const, sourceKey: foundField.fieldKey };
            }
            if (/thoi gian|ngay gui|timestamp/i.test(trimmed)) {
              return { sheetHeader: trimmed, sourceType: 'system' as const, sourceKey: 'submitted_at' };
            }
            if (/ma gui|ma yeu cau|submission/i.test(trimmed)) {
              return { sheetHeader: trimmed, sourceType: 'system' as const, sourceKey: 'submission_id' };
            }
            if (/trang gui|duong dan|url|link/i.test(trimmed)) {
              return { sheetHeader: trimmed, sourceType: 'system' as const, sourceKey: 'source_path' };
            }
            return { sheetHeader: trimmed, sourceType: 'field' as const, sourceKey: '' };
          });
        }

        const nextUpdates: Partial<GoogleSheetsDestinationConfig> = {
          sheetName: effectiveSheet || sheetsConfig.sheetName,
        };

        if (finalMapping && finalMapping.length > 0) {
          nextUpdates.columnMapping = finalMapping;
          toast.success(`Đã kết nối và tự động tải ${finalMapping.length} cột từ Sheet!`);
        } else {
          toast.success('Kết nối Google Sheet thành công!');
        }

        updateSheetsDestination(nextUpdates);
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || 'Lỗi mạng khi kiểm tra kết nối.' });
    } finally {
      setIsTestingSheets(false);
    }
  };

  const handleSheetTabChange = async (newTab: string) => {
    updateSheetsDestination({ sheetName: newTab });
    if (!sheetsConfig.spreadsheetId) return;

    setIsTestingSheets(true);
    setInitHeaderSuccess(null);

    try {
      const res = await fetch(`/api/cms/forms/${formId || 'new'}/destinations/google-sheets/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: sheetsConfig.spreadsheetId,
          sheetName: newTab,
          fields: formData.fields,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          title: data.spreadsheetTitle,
          sheets: data.sheets,
          activeSheet: newTab,
          headers: data.headers,
        });

        const nextUpdates: Partial<GoogleSheetsDestinationConfig> = { sheetName: newTab };
        if (data.suggestedMapping && data.suggestedMapping.length > 0) {
          nextUpdates.columnMapping = data.suggestedMapping;
          toast.success(`Đã chuyển sang tab "${newTab}" và tải ${data.suggestedMapping.length} cột!`);
        }
        updateSheetsDestination(nextUpdates);
      }
    } catch {
      // silent
    } finally {
      setIsTestingSheets(false);
    }
  };

  // Initialize headers on an empty sheet
  const handleInitializeHeaders = async () => {
    if (!sheetsConfig.spreadsheetId) return;

    setIsInitializingHeaders(true);
    setInitHeaderSuccess(null);

    // Build standard header list: system fields + form fields
    const defaultHeaders = [
      'Thời gian gửi',
      'Mã yêu cầu',
      ...formData.fields.map((f) => f.label || f.fieldKey),
      'Trang gửi',
    ];

    const initialMapping: GoogleSheetsColumnMapping[] = [
      { sheetHeader: 'Thời gian gửi', sourceType: 'system', sourceKey: 'submitted_at' },
      { sheetHeader: 'Mã yêu cầu', sourceType: 'system', sourceKey: 'submission_id' },
      ...formData.fields.map((f) => ({
        sheetHeader: f.label || f.fieldKey,
        sourceType: 'field' as const,
        sourceKey: f.fieldKey,
      })),
      { sheetHeader: 'Trang gửi', sourceType: 'system', sourceKey: 'source_path' },
    ];

    try {
      const res = await fetch(`/api/cms/forms/${formId || 'new'}/destinations/google-sheets/init-headers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: sheetsConfig.spreadsheetId,
          sheetName: sheetsConfig.sheetName,
          headers: defaultHeaders,
          fields: formData.fields,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Lỗi khi khởi tạo dòng tiêu đề.');
      } else {
        const msg = `Đã tạo thành công ${defaultHeaders.length} cột tiêu đề trên sheet!`;
        setInitHeaderSuccess(msg);
        toast.success(msg);

        const mappingToApply = data.suggestedMapping && data.suggestedMapping.length > 0
          ? data.suggestedMapping
          : initialMapping;

        updateSheetsDestination({ columnMapping: mappingToApply });
        setTestResult({
          success: true,
          title: sheetsConfig.spreadsheetId,
          sheets: [sheetsConfig.sheetName || 'Sheet1'],
          headers: defaultHeaders,
        });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi khi khởi tạo tiêu đề.');
    } finally {
      setIsInitializingHeaders(false);
    }
  };

  // Synchronize Form Fields (Tab 1: Thành phần & Trường dữ liệu) from Google Sheet headers
  const handleSyncFieldsFromSheet = (targetHeaders?: string[]) => {
    const headers = targetHeaders || sheetsConfig.columnMapping.map((c) => c.sheetHeader);
    if (!headers || headers.length === 0) {
      toast.error('Chưa có danh sách cột từ Sheet để đồng bộ.');
      return;
    }

    const existingFieldKeys = new Set(formData.fields.map((f) => f.fieldKey.toLowerCase()));
    const newFields: FormField[] = [...formData.fields];
    let createdCount = 0;

    const newMapping: GoogleSheetsColumnMapping[] = [];

    headers.forEach((h, idx) => {
      const trimmed = h.trim();
      const normalized = normalizeText(trimmed);

      // 1. System fields
      if (/^(thoi gian|thoi gian gui|ngay gui|timestamp|created at|date|thoi gian tao)$/i.test(normalized)) {
        newMapping.push({ sheetHeader: trimmed, sourceType: 'system', sourceKey: 'submitted_at' });
        return;
      }
      if (/^(ma gui|ma yeu cau|ma submission|submission id|id|ma don|ma)$/i.test(normalized)) {
        newMapping.push({ sheetHeader: trimmed, sourceType: 'system', sourceKey: 'submission_id' });
        return;
      }
      if (/^(duong dan|duong dan trang|trang gui|url|link|source path|trang|link trang)$/i.test(normalized)) {
        newMapping.push({ sheetHeader: trimmed, sourceType: 'system', sourceKey: 'source_path' });
        return;
      }
      if (/^(ten bieu mau|bieu mau|form title|form name|ten form)$/i.test(normalized)) {
        newMapping.push({ sheetHeader: trimmed, sourceType: 'system', sourceKey: 'form_title' });
        return;
      }

      // 2. Check if a form field already matches (by label, normalized label, or fieldKey)
      const existing = newFields.find(
        (f) =>
          f.label.trim().toLowerCase() === trimmed.toLowerCase() ||
          normalizeText(f.label) === normalized ||
          f.fieldKey.toLowerCase() === trimmed.toLowerCase()
      );

      if (existing) {
        newMapping.push({ sheetHeader: trimmed, sourceType: 'field', sourceKey: existing.fieldKey });
      } else {
        // Create new Form Field from this Sheet Column!
        const newField = inferFieldFromHeader(trimmed, newFields.length, existingFieldKeys);
        newFields.push(newField);
        createdCount++;
        newMapping.push({ sheetHeader: trimmed, sourceType: 'field', sourceKey: newField.fieldKey });
      }
    });

    // Update formData with both new fields AND updated column mapping
    setFormData((prev) => {
      const existing = prev.destinations || [];
      const otherDests = existing.filter((d) => d.destinationType !== 'google_sheets');
      const current = existing.find((d) => d.destinationType === 'google_sheets');
      const currentConfig = (current?.config as GoogleSheetsDestinationConfig) || {
        spreadsheetId: '',
        sheetName: 'Sheet1',
        columnMapping: [],
        autoCreateHeaders: true,
      };

      const newDest = {
        id: current?.id,
        destinationType: 'google_sheets' as const,
        name: current?.name || 'Google Sheets',
        isEnabled: current ? current.isEnabled : true,
        config: {
          ...currentConfig,
          columnMapping: newMapping,
        },
      };

      return {
        ...prev,
        fields: newFields,
        destinations: [...otherDests, newDest],
      };
    });

    if (createdCount > 0) {
      toast.success(`Đã tự động tạo ${createdCount} trường dữ liệu vào tab "Thành phần & Trường dữ liệu"!`);
    } else {
      toast.info('Tất cả các cột trên Sheet đều đã khớp với các trường hiện có trong Form.');
    }
  };

  const handleCopyEmail = () => {
    if (!serviceAccountEmail) return;
    navigator.clipboard.writeText(serviceAccountEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-3xl space-y-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-orange-500" />
          Nơi nhận dữ liệu biểu mẫu (Submission Destinations)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hệ thống luôn lưu trữ an toàn vào CSDL. Bạn có thể bật thêm các điểm đến ngoại vi như Google Sheets và Email.
        </p>
      </div>

      <div className="space-y-5">
        {/* DESTINATION 1: CMS DATABASE (ALWAYS ON) */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Cơ sở dữ liệu biểu mẫu (Form Submissions)</span>
                <p className="text-[11px] text-slate-500">Mọi câu trả lời gửi lên đều được lưu trữ vĩnh viễn và bảo vệ toàn vẹn dữ liệu trong biểu mẫu này.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
              Bắt buộc · Luôn bật
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.submitConfig.createCustomerRequest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: { ...formData.submitConfig, createCustomerRequest: e.target.checked },
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-medium block">
                    Tùy chọn nghiệp vụ CRM: Tự động tạo bản ghi <strong>Yêu cầu khách hàng mới (Leads)</strong>
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Đồng thời chuyển đổi lượt gửi thành một yêu cầu mới trong mục <em>Yêu cầu khách hàng</em> để nhân viên kinh doanh / tư vấn phân công xử lý.
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    (Bỏ chọn nếu đây là form khảo sát ý kiến, đánh giá nội bộ hoặc biểu mẫu không cần đội ngũ Sales theo dõi xử lý)
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* DESTINATION 2: GOOGLE SHEETS */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Đồng bộ Google Sheets</span>
                <p className="text-[11px] text-slate-500">Tự động ghi thêm dòng mới vào bảng tính Google Drive khi có lượt gửi.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSheetsEnabled}
                onChange={(e) => updateSheetsDestination({}, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {isSheetsEnabled && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
              {/* Service Account Instruction Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  <strong>Bước 1:</strong> Mở file Google Sheet và bấm <strong>Chia sẻ (Share)</strong> cho email Service Account sau với quyền <strong>Người chỉnh sửa (Editor)</strong>:
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={serviceAccountEmail || 'Đang tải thông tin tài khoản...'}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 select-all"
                  />
                  <CmsButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleCopyEmail}
                    disabled={!serviceAccountEmail}
                    leadingIcon={copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedEmail ? 'Đã sao chép' : 'Sao chép'}
                  </CmsButton>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  Hệ thống dùng Service Account server-side an toàn, không bao giờ yêu cầu bạn đăng nhập mật khẩu hay cấp quyền cá nhân.
                </p>
              </div>

              {/* Step 2: Spreadsheet URL & Tab */}
              <div className="space-y-3">
                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  <strong>Bước 2:</strong> Dán đường dẫn file Google Sheet và chọn Trang tính (Tab):
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Đường dẫn (URL) hoặc Spreadsheet ID
                    </label>
                    <input
                      type="text"
                      value={sheetsConfig.spreadsheetId || ''}
                      onChange={(e) => updateSheetsDestination({ spreadsheetId: e.target.value })}
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvB.../edit"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tên Trang tính (Sheet Tab)
                    </label>
                    {testResult?.sheets && testResult.sheets.length > 0 ? (
                      <select
                        value={sheetsConfig.sheetName || testResult.activeSheet || testResult.sheets[0]}
                        onChange={(e) => handleSheetTabChange(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200"
                      >
                        {testResult.sheets.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={sheetsConfig.sheetName || 'Sheet1'}
                        onChange={(e) => updateSheetsDestination({ sheetName: e.target.value })}
                        placeholder="Sheet1 hoặc Trang tính 1"
                        className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-mono"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <CmsButton
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={handleTestConnection}
                    disabled={isTestingSheets || !sheetsConfig.spreadsheetId}
                    leadingIcon={<RefreshCw className={`w-3.5 h-3.5 ${isTestingSheets ? 'animate-spin' : ''}`} />}
                  >
                    {isTestingSheets ? 'Đang kiểm tra kết nối...' : 'Kiểm tra kết nối & Tải cột'}
                  </CmsButton>

                  {sheetsConfig.spreadsheetId && (
                    <a
                      href={sheetsConfig.spreadsheetId.startsWith('http') ? sheetsConfig.spreadsheetId : `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium"
                    >
                      Mở bảng tính trên Google <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Test Connection Alert Results */}
                {testResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      testResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                    }`}
                  >
                    {testResult.success ? (
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      {testResult.success ? (
                        <>
                          <div className="font-bold">Kết nối thành công tới: "{testResult.title}"</div>
                          <div className="mt-1 text-[11px] opacity-90 space-y-0.5">
                            <div>
                              Đang đọc từ trang tính: <strong>"{sheetsConfig.sheetName || testResult.activeSheet || 'Trang tính 1'}"</strong> (file có {testResult.sheets?.length || 1} trang tính).
                            </div>
                            <div>
                              Đã quét và tìm thấy: <strong>{testResult.headers?.length || 0} cột dữ liệu</strong>.
                              {testResult.sheets && testResult.sheets.length > 1 && (
                                <span className="text-emerald-700 dark:text-emerald-300 ml-1">
                                  (Nếu dữ liệu nằm ở trang tính khác, hãy đổi ở mục "Tên Trang tính" bên trên).
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-bold">Kết nối không thành công</div>
                          <div className="mt-0.5 text-[11px] opacity-90">{testResult.error}</div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {initHeaderSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{initHeaderSuccess}</span>
                  </div>
                )}
              </div>

              {/* Step 3: Column Mapping Section */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <strong>Bước 3:</strong> Cấu hình ánh xạ cột (Ghép cột Sheet với dữ liệu Form):
                  </div>

                  {sheetsConfig.columnMapping && sheetsConfig.columnMapping.length > 0 && (
                    <div className="flex items-center gap-2">
                      <CmsButton
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => handleSyncFieldsFromSheet()}
                        leadingIcon={<Layers className="w-3.5 h-3.5" />}
                        title="Tự động đồng bộ và tạo các trường dữ liệu ở tab Thành phần & Trường dữ liệu theo các cột Sheet"
                      >
                        Đồng bộ trường vào Form
                      </CmsButton>

                      <CmsButton
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleInitializeHeaders}
                        disabled={isInitializingHeaders || !sheetsConfig.spreadsheetId}
                        leadingIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                        title="Đặt lại các cột tiêu đề theo trường của Form"
                      >
                        {isInitializingHeaders ? 'Đang tạo...' : 'Tạo lại tiêu đề từ Form'}
                      </CmsButton>
                    </div>
                  )}
                </div>

                {sheetsConfig.columnMapping && sheetsConfig.columnMapping.length > 0 ? (
                  <div className="space-y-2.5">
                    {(() => {
                      const unmapped = sheetsConfig.columnMapping.filter((c) => !c.sourceKey && c.sourceType !== 'system');
                      if (unmapped.length === 0) return null;
                      return (
                        <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>
                              Có <strong>{unmapped.length} cột trên Sheet</strong> chưa có trong Form (<em>{unmapped.slice(0, 3).map((c) => c.sheetHeader).join(', ')}{unmapped.length > 3 ? '...' : ''}</em>).
                            </span>
                          </div>
                          <CmsButton
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => handleSyncFieldsFromSheet()}
                            leadingIcon={<Layers className="w-3.5 h-3.5" />}
                          >
                            Tự động tạo các trường này vào Form
                          </CmsButton>
                        </div>
                      );
                    })()}

                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <div className="font-semibold text-[11.5px]">Cách xử lý các cột trên Google Sheet:</div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-blue-800/90 dark:text-blue-300/90">
                          <li>Nếu bảng tính có <strong>cột nội bộ</strong> (như <em>Trạng thái xử lý, Nhân viên phụ trách, Ghi chú</em>) mà không cần Form điền, hãy chọn <strong>"-- Để trống cột này (không ghi dữ liệu) --"</strong>. Hệ thống sẽ giữ nguyên ô trống mà không làm xô lệch thứ tự cột.</li>
                          <li>Bạn có thể bấm <strong>"Đồng bộ trường vào Form"</strong> để hệ thống tự tạo các trường dữ liệu ở tab <em>"Thành phần & Trường dữ liệu"</em> cho khớp 100% với Sheet.</li>
                          <li>Bạn có thể bấm biểu tượng <strong>thùng rác</strong> để xóa bớt cột không dùng, hoặc bấm <strong>"+ Thêm cột ghép mới"</strong> để tự tạo thêm cột theo ý muốn.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-left">
                            <th className="py-2.5 px-3 w-[45%]">Cột trên Google Sheet</th>
                            <th className="py-2.5 px-3 w-[45%]">Trường dữ liệu ghi vào</th>
                            <th className="py-2.5 px-3 w-[10%] text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {sheetsConfig.columnMapping.map((col, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={col.sheetHeader}
                                  onChange={(e) => {
                                    const newMapping = [...sheetsConfig.columnMapping];
                                    newMapping[idx] = { ...newMapping[idx], sheetHeader: e.target.value };
                                    updateSheetsDestination({ columnMapping: newMapping });
                                  }}
                                  placeholder={`Cột ${idx + 1}`}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <select
                                  value={col.sourceType === 'system' ? `sys:${col.sourceKey}` : (col.sourceKey ? `field:${col.sourceKey}` : '')}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const newMapping = [...sheetsConfig.columnMapping];
                                    if (val.startsWith('sys:')) {
                                      newMapping[idx] = {
                                        sheetHeader: col.sheetHeader,
                                        sourceType: 'system',
                                        sourceKey: val.replace('sys:', ''),
                                      };
                                    } else if (val.startsWith('field:')) {
                                      newMapping[idx] = {
                                        sheetHeader: col.sheetHeader,
                                        sourceType: 'field',
                                        sourceKey: val.replace('field:', ''),
                                      };
                                    } else {
                                      newMapping[idx] = {
                                        sheetHeader: col.sheetHeader,
                                        sourceType: 'field',
                                        sourceKey: '',
                                      };
                                    }
                                    updateSheetsDestination({ columnMapping: newMapping });
                                  }}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${
                                    !col.sourceKey
                                      ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300'
                                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  <option value="">-- Để trống cột này (không ghi dữ liệu) --</option>
                                  <optgroup label="Dữ liệu hệ thống">
                                    <option value="sys:submitted_at">Ngày giờ gửi (submitted_at)</option>
                                    <option value="sys:submission_id">Mã lượt gửi (submission_id)</option>
                                    <option value="sys:source_path">Đường dẫn trang gửi (source_path)</option>
                                    <option value="sys:form_title">Tiêu đề biểu mẫu (form_title)</option>
                                  </optgroup>
                                  <optgroup label="Các trường của biểu mẫu này">
                                    {formData.fields.map((f) => (
                                      <option key={f.fieldKey} value={`field:${f.fieldKey}`}>
                                        {f.label} ({f.fieldKey})
                                      </option>
                                    ))}
                                  </optgroup>
                                </select>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMapping = sheetsConfig.columnMapping.filter((_, i) => i !== idx);
                                    updateSheetsDestination({ columnMapping: newMapping });
                                  }}
                                  title="Xóa cột này"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const newMapping = [
                            ...sheetsConfig.columnMapping,
                            { sheetHeader: `Cột ${sheetsConfig.columnMapping.length + 1}`, sourceType: 'field' as const, sourceKey: '' },
                          ];
                          updateSheetsDestination({ columnMapping: newMapping });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm cột ghép mới
                      </button>

                      <span className="text-[11px] text-slate-400">
                        {sheetsConfig.columnMapping.length} cột ({sheetsConfig.columnMapping.filter((c) => c.sourceKey).length} cột nhận dữ liệu, {sheetsConfig.columnMapping.filter((c) => !c.sourceKey).length} cột để trống)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-7 px-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3.5">
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Chưa có cấu hình ghép cột. Hãy chọn một trong hai cách dưới đây:
                    </p>
                    <div className="flex items-center justify-center flex-wrap gap-2.5">
                      <CmsButton
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={handleTestConnection}
                        disabled={isTestingSheets || !sheetsConfig.spreadsheetId}
                        leadingIcon={<RefreshCw className={`w-3.5 h-3.5 ${isTestingSheets ? 'animate-spin' : ''}`} />}
                      >
                        {isTestingSheets ? 'Đang tải cột...' : 'Tải cột từ Google Sheet'}
                      </CmsButton>

                      <CmsButton
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleInitializeHeaders}
                        disabled={isInitializingHeaders || !sheetsConfig.spreadsheetId}
                        leadingIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                      >
                        {isInitializingHeaders ? 'Đang tạo...' : 'Khởi tạo tiêu đề mẫu từ Form'}
                      </CmsButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DESTINATION 3: EMAIL NOTIFICATIONS */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Thông báo qua Email</span>
                <p className="text-[11px] text-slate-500">Gửi email thông báo cho quản trị viên và thư xác nhận cho người gửi.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.submitConfig.sendAdminEmail || formData.submitConfig.sendConfirmationEmail}
                onChange={(e) => {
                  const on = e.target.checked;
                  updateEmailDestination(
                    {
                      sendAdminEmail: on,
                      sendConfirmationEmail: on ? formData.submitConfig.sendConfirmationEmail : false,
                    },
                    on
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {(formData.submitConfig.sendAdminEmail || formData.submitConfig.sendConfirmationEmail) && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
              {/* Admin Email Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.submitConfig.sendAdminEmail}
                    onChange={(e) => updateEmailDestination({ sendAdminEmail: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Gửi email thông báo cho Quản trị viên / Kinh doanh
                  </span>
                </label>

                {formData.submitConfig.sendAdminEmail && (
                  <div className="grid gap-3 md:grid-cols-2 pt-1 pl-6">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Danh sách Email nhận thông báo (phân cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={(formData.submitConfig.adminEmails || []).join(', ')}
                        onChange={(e) =>
                          updateEmailDestination({
                            adminEmails: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="sales@cic.com.vn, cskh@cic.com.vn"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        Mẫu thông báo quản trị
                      </label>
                      <select
                        value={formData.submitConfig.adminEmailTemplate || ''}
                        onChange={(e) => updateEmailDestination({ adminEmailTemplateId: e.target.value || null })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      >
                        <option value="">Gửi bảng dữ liệu mặc định</option>
                        {emailTemplates
                          .filter((template) => template.workspace === workspaceLocale && template.audience === 'internal')
                          .map((template) => {
                            const eventName = EMAIL_EVENTS.find((item: { value: string; label: string }) => item.value === template.event)?.label;
                            return (
                              <option key={template.id} value={template.id}>
                                {template.name} · {eventName} · {TEMPLATE_STATUSES[template.status].label}
                              </option>
                            );
                          })}
                      </select>
                      <CmsButton
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="mt-2"
                        leadingIcon={<Eye className="size-3.5" />}
                        disabled={!formData.submitConfig.adminEmailTemplate}
                        onClick={() => onPreviewEmailTemplate(formData.submitConfig.adminEmailTemplate || '')}
                      >
                        Xem trước email
                      </CmsButton>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation Email to Customer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.submitConfig.sendConfirmationEmail}
                    onChange={(e) => updateEmailDestination({ sendConfirmationEmail: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Gửi thư xác nhận cho người điền biểu mẫu (Auto-responder)
                  </span>
                </label>

                {formData.submitConfig.sendConfirmationEmail && (
                  <div className="pt-1 pl-6">
                    <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      Mẫu thư cảm ơn / xác nhận
                    </label>
                    <select
                      value={formData.submitConfig.confirmationEmailTemplate || ''}
                      onChange={(e) => updateEmailDestination({ confirmationEmailTemplateId: e.target.value || null })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="">Gửi thư xác nhận mặc định của CIC</option>
                      {emailTemplates
                        .filter((template) => template.workspace === workspaceLocale && template.audience === 'customer')
                        .map((template) => {
                          const eventName = EMAIL_EVENTS.find((item: { value: string; label: string }) => item.value === template.event)?.label;
                          return (
                            <option key={template.id} value={template.id}>
                              {template.name} · {eventName} · {TEMPLATE_STATUSES[template.status].label}
                            </option>
                          );
                        })}
                    </select>
                    <CmsButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                      leadingIcon={<Eye className="size-3.5" />}
                      disabled={!formData.submitConfig.confirmationEmailTemplate}
                      onClick={() => onPreviewEmailTemplate(formData.submitConfig.confirmationEmailTemplate || '')}
                    >
                      Xem trước thư gửi khách hàng
                    </CmsButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SCREEN RESPONSE AFTER SUBMISSION */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Phản hồi trên Màn hình sau khi gửi thành công
          </h4>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Chữ trên nút gửi biểu mẫu
            </label>
            <input
              type="text"
              value={formData.submitConfig.submitButtonText || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submitConfig: { ...formData.submitConfig, submitButtonText: e.target.value },
                })
              }
              placeholder="Ví dụ: Gửi yêu cầu, Nhận báo giá, Đăng ký ngay"
              maxLength={60}
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Câu thông báo thành công (Success Message)
            </label>
            <input
              type="text"
              value={formData.submitConfig.successMessage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submitConfig: { ...formData.submitConfig, successMessage: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Chuyển hướng URL / Trang Cảm ơn (Redirect URL - Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.submitConfig.redirectUrl || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submitConfig: { ...formData.submitConfig, redirectUrl: e.target.value },
                })
              }
              placeholder="/cam-on-dang-ky"
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
