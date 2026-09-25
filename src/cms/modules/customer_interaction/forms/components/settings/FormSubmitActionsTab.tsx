import React, { useState, useEffect } from 'react';
import { Database, FileSpreadsheet, Mail, Eye, Check, Copy, RefreshCw, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { FormFormData } from '../../types';
import { EMAIL_EVENTS, TEMPLATE_STATUSES, type EmailTemplate } from '../../../../email_templates/types';
import { CmsButton } from '../../../../../components/ui/CmsButton';
import type { CmsLocale } from '../../../../../data/CmsDataSource';
import type { GoogleSheetsColumnMapping, GoogleSheetsDestinationConfig, EmailDestinationConfig } from '@/features/forms/types';

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
  // Service Account Email from server
  const [serviceAccountEmail, setServiceAccountEmail] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Google Sheets test connection state
  const [isTestingSheets, setIsTestingSheets] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    title?: string;
    sheets?: string[];
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
    const existing = formData.destinations || [];
    const otherDests = existing.filter((d) => d.destinationType !== 'google_sheets');
    const current = getSheetsDestination();

    const newDest = {
      id: current?.id,
      destinationType: 'google_sheets' as const,
      name: current?.name || 'Google Sheets',
      isEnabled: isEnabled !== undefined ? isEnabled : (current ? current.isEnabled : true),
      config: {
        ...sheetsConfig,
        ...updates,
      },
    };

    setFormData({
      ...formData,
      destinations: [...otherDests, newDest],
    });
  };

  // Helper to update Email destination & sync with submitConfig
  const updateEmailDestination = (updates: Partial<EmailDestinationConfig>, isEnabled?: boolean) => {
    const existing = formData.destinations || [];
    const otherDests = existing.filter((d) => d.destinationType !== 'email');
    const currentEmailDest = existing.find((d) => d.destinationType === 'email');

    const newIsEnabled = isEnabled !== undefined ? isEnabled : (currentEmailDest ? currentEmailDest.isEnabled : true);

    const newConfig: EmailDestinationConfig = {
      sendAdminEmail: updates.sendAdminEmail !== undefined ? updates.sendAdminEmail : formData.submitConfig.sendAdminEmail,
      adminEmails: updates.adminEmails !== undefined ? updates.adminEmails : formData.submitConfig.adminEmails,
      adminEmailTemplateId: updates.adminEmailTemplateId !== undefined ? updates.adminEmailTemplateId : formData.submitConfig.adminEmailTemplate,
      sendConfirmationEmail: updates.sendConfirmationEmail !== undefined ? updates.sendConfirmationEmail : formData.submitConfig.sendConfirmationEmail,
      confirmationEmailTemplateId: updates.confirmationEmailTemplateId !== undefined ? updates.confirmationEmailTemplateId : formData.submitConfig.confirmationEmailTemplate,
    };

    const newDest = {
      id: currentEmailDest?.id,
      destinationType: 'email' as const,
      name: currentEmailDest?.name || 'Thông báo Email',
      isEnabled: newIsEnabled,
      config: newConfig,
    };

    setFormData({
      ...formData,
      submitConfig: {
        ...formData.submitConfig,
        sendAdminEmail: newIsEnabled && newConfig.sendAdminEmail,
        adminEmails: newConfig.adminEmails,
        adminEmailTemplate: newConfig.adminEmailTemplateId || undefined,
        sendConfirmationEmail: newIsEnabled && newConfig.sendConfirmationEmail,
        confirmationEmailTemplate: newConfig.confirmationEmailTemplateId || undefined,
      },
      destinations: [...otherDests, newDest],
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
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setTestResult({
          success: false,
          error: data.error || 'Kiểm tra kết nối thất bại.',
        });
      } else {
        setTestResult({
          success: true,
          title: data.spreadsheetTitle,
          sheets: data.sheets,
          headers: data.headers,
        });

        // If sheet tabs available and current tab is not in list, auto-select first sheet
        if (data.sheets && data.sheets.length > 0 && !data.sheets.includes(sheetsConfig.sheetName)) {
          updateSheetsDestination({ sheetName: data.sheets[0] });
        }

        // If suggestedMapping returned, merge with existing mapping
        if (data.suggestedMapping && data.suggestedMapping.length > 0) {
          updateSheetsDestination({ columnMapping: data.suggestedMapping });
        }
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || 'Lỗi mạng khi kiểm tra kết nối.' });
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

    try {
      const res = await fetch(`/api/cms/forms/${formId || 'new'}/destinations/google-sheets/init-headers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: sheetsConfig.spreadsheetId,
          sheetName: sheetsConfig.sheetName,
          headers: defaultHeaders,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Lỗi khi khởi tạo dòng tiêu đề.');
      } else {
        setInitHeaderSuccess(`Đã tạo thành công ${defaultHeaders.length} cột tiêu đề trên sheet!`);
        // Re-run test connection to reload mapping
        handleTestConnection();
      }
    } catch (err: any) {
      alert(err?.message || 'Lỗi khi khởi tạo tiêu đề.');
    } finally {
      setIsInitializingHeaders(false);
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
                    <input
                      type="text"
                      value={sheetsConfig.sheetName || 'Sheet1'}
                      onChange={(e) => updateSheetsDestination({ sheetName: e.target.value })}
                      placeholder="Sheet1 hoặc Trang tính1"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-mono"
                    />
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
                          <div className="mt-0.5 text-[11px] opacity-90">
                            Tìm thấy {testResult.sheets?.length || 0} trang tính · {testResult.headers?.length || 0} cột ở hàng đầu tiên.
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
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <strong>Bước 3:</strong> Cấu hình ánh xạ cột (Ghép cột Sheet với dữ liệu Form):
                  </div>

                  {(!sheetsConfig.columnMapping || sheetsConfig.columnMapping.length === 0) && (
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
                  )}
                </div>

                {sheetsConfig.columnMapping && sheetsConfig.columnMapping.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-left">
                          <th className="py-2 px-3 w-1/2">Cột trên Google Sheet (Tiêu đề hàng 1)</th>
                          <th className="py-2 px-3 w-1/2">Trường dữ liệu ghi vào</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sheetsConfig.columnMapping.map((col, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                              {col.sheetHeader}
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={col.sourceType === 'system' ? `sys:${col.sourceKey}` : `field:${col.sourceKey}`}
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
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              >
                                <option value="">-- Không ghi vào cột này --</option>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-6 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-xs text-slate-500 mb-2">
                      Chưa có cấu hình ghép cột. Hãy bấm nút <strong>"Kiểm tra kết nối & Tải cột"</strong> để hệ thống tự động đọc hàng 1 từ Google Sheet hoặc bấm <strong>"Khởi tạo tiêu đề mẫu từ Form"</strong>.
                    </p>
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
