import assert from 'node:assert/strict';

// Test 1: Verify Activity Logs CSV logic
{
  const csv = (value) => {
    let serialized;
    if (value instanceof Date) {
      serialized = value.toISOString();
    } else if (value && typeof value === 'object') {
      serialized = JSON.stringify(value);
    } else {
      serialized = String(value ?? '');
    }
    const singleLine = serialized.replace(/[\r\n]+/g, ' ');
    const safe = /^[=+\-@\t\r]/.test(singleLine) ? `'${singleLine}` : singleLine;
    return `"${safe.replaceAll('"', '""')}"`;
  };

  const testDate = new Date('2026-09-28T09:00:00.000Z');
  const renderedDate = csv(testDate);
  assert.equal(renderedDate, '"2026-09-28T09:00:00.000Z"', 'Date should be single-quoted ISO string, not triple-quoted JSON');

  const formulaPayload = '=cmd|\' /C calc\'!A0';
  const renderedFormula = csv(formulaPayload);
  assert.equal(renderedFormula, '"\'=cmd|\' /C calc\'!A0"', 'Formula prefix = must be neutralized with leading apostrophe');

  const plusFormula = '+12345';
  assert.equal(csv(plusFormula), '"\'+12345"', 'Formula prefix + must be neutralized');

  const atFormula = '@SUM(A1:A10)';
  assert.equal(csv(atFormula), '"\'@SUM(A1:A10)"', 'Formula prefix @ must be neutralized');

  const tabFormula = '\t=1+1';
  assert.equal(csv(tabFormula), '"\'\t=1+1"', 'Tab prefix must be neutralized');

  const quotesValue = 'Kỹ sư "Hạ tầng" CIC';
  assert.equal(csv(quotesValue), '"Kỹ sư ""Hạ tầng"" CIC"', 'Internal quotes must be escaped with double quotes per RFC 4180');

  const multiline = 'Dòng 1\r\nDòng 2\nDòng 3';
  assert.equal(csv(multiline), '"Dòng 1 Dòng 2 Dòng 3"', 'Newlines should be normalized to spaces');

  const headers = ['occurred_at', 'actor_label', 'action_code', 'entity_title'];
  const rows = [
    {
      occurred_at: testDate,
      actor_label: 'Nguyễn Văn A (Admin)',
      action_code: 'customer_request.exported',
      entity_title: 'Xuất dữ liệu tiếng Việt có dấu'
    }
  ];

  const content = '\uFEFF' + [headers.map(csv).join(','), ...rows.map((row) => headers.map((key) => csv(row[key])).join(','))].join('\r\n');

  assert.ok(content.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM \\uFEFF for Excel Windows compatibility');
  const lines = content.slice(1).split('\r\n');
  assert.equal(lines.length, 2, 'Should have header line and 1 data row line with CRLF');
  assert.equal(lines[0].split(',').length, headers.length, 'Header count must match');
  assert.equal(lines[1].split(',').length, headers.length, 'Row count must match');

  console.log('✅ Activity Logs CSV export formatting test passed!');
}

// Test 2: Verify Customer Requests CSV logic
{
  const REQUEST_STATUS_LABELS = {
    new: 'Mới nhận',
    processing: 'Đang xử lý',
    contacted: 'Đã liên hệ',
    completed: 'Đã hoàn tất',
    cancelled: 'Đã hủy',
  };
  const PRIORITY_LABELS = {
    low: 'Thấp',
    medium: 'Bình thường',
    high: 'Ưu tiên cao',
    urgent: 'Khẩn cấp',
  };

  const sanitizeCsvCell = (val) => {
    const serialized = (val ?? '').toString().replace(/[\r\n]+/g, ' ').trim();
    const safe = /^[=+\-@\t\r]/.test(serialized) ? `'${serialized}` : serialized;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const headers = [
    'Mã Yêu cầu',
    'Thời gian gửi',
    'Họ và tên',
    'Email',
    'Số điện thoại',
    'Công ty',
    'Biểu mẫu',
    'CTA',
    'Trang gửi',
    'Trạng thái',
    'Người phụ trách',
    'Độ ưu tiên',
    'Thẻ (Tags)',
    'Nội dung / Nhu cầu',
  ];

  const sampleRequests = [
    {
      id: 'req_001',
      createdAt: '2026-09-28T08:30:00.000Z',
      sourceConfig: {
        submittedAt: '2026-09-28T08:30:00.000Z',
        formName: 'Đăng ký tư vấn giải pháp BIM',
        ctaName: 'Nhận báo giá ngay',
        pageTitle: 'Giải pháp Autodesk cho Doanh nghiệp',
      },
      status: 'new',
      priority: 'high',
      assignedUserName: 'Trần Thị B',
      tags: ['BIM', 'Khách hàng VIP', 'Khu vực Miền Bắc'],
      submissionValues: [
        { fieldKey: 'full_name', fieldType: 'text', valueText: 'Lê Hoàng Long' },
        { fieldKey: 'email', fieldType: 'email', valueText: 'long.lh@company.vn' },
        { fieldKey: 'phone', fieldType: 'phone', valueText: '0912345678' },
        { fieldKey: 'company', fieldType: 'text', valueText: 'Tổng Công ty Tư vấn Xây dựng Việt Nam (VNCC)' },
        { fieldKey: 'message', fieldType: 'textarea', valueText: 'Chúng tôi cần tư vấn triển khai Revit & Civil 3D.\nYêu cầu liên hệ trong giờ hành chính.' },
      ],
    },
    {
      id: 'req_002',
      createdAt: '2026-09-28T09:00:00.000Z',
      sourceConfig: null, // Test edge case where sourceConfig is null
      status: 'processing',
      priority: 'urgent',
      assignedUserName: null,
      tags: null,
      submissionValues: [
        { fieldKey: 'name', fieldType: 'text', valueText: '=2+5' }, // CSV formula injection attempt
        { fieldKey: 'email', fieldType: 'email', valueText: 'test@example.com' },
      ],
    }
  ];

  const rows = sampleRequests.map((r) => {
    const getVal = (keys, types) => {
      const found = r.submissionValues?.find(
        (v) => keys.includes(v.fieldKey.toLowerCase()) || types.includes(v.fieldType)
      );
      return found?.valueText || '';
    };

    const name = getVal(['full_name', 'name', 'ho_ten'], ['text']);
    const email = getVal(['email'], ['email']);
    const phone = getVal(['phone', 'sdt', 'dien_thoai'], ['phone']);
    const company = getVal(['company', 'cong_ty'], []);
    const message = getVal(['message', 'noi_dung', 'note'], ['textarea']);

    const statusLabel = REQUEST_STATUS_LABELS[r.status] || r.status;
    const priorityLabel = PRIORITY_LABELS[r.priority] || r.priority;
    const tagsStr = (r.tags || []).join('; ');
    const rawDate = r.sourceConfig?.submittedAt || r.createdAt;
    const dateStr = rawDate && !isNaN(new Date(rawDate).getTime())
      ? new Date(rawDate).toLocaleString('vi-VN')
      : '';

    return [
      r.id,
      dateStr,
      name,
      email,
      phone,
      company,
      r.sourceConfig?.formName || '',
      r.sourceConfig?.ctaName || '',
      r.sourceConfig?.pageTitle || '',
      statusLabel,
      r.assignedUserName || 'Chưa phân công',
      priorityLabel,
      tagsStr,
      message,
    ].map(sanitizeCsvCell);
  });

  const csvContent =
    '\uFEFF' +
    [
      headers.map(sanitizeCsvCell).join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\r\n');

  assert.ok(csvContent.startsWith('\uFEFF'), 'Customer Requests CSV must start with UTF-8 BOM');
  const lines = csvContent.slice(1).split('\r\n');
  assert.equal(lines.length, 3, 'Must have 1 header row + 2 data rows with CRLF');
  
  for (let i = 0; i < lines.length; i++) {
    // Note: each field is quoted with double quotes
    assert.ok(lines[i].length > 0, `Line ${i} should not be empty`);
  }

  // Row 2 test: formula was '=2+5', should become '"\'=2+5"'
  assert.ok(lines[2].includes('"\'=2+5"'), 'CSV formula injection in customer request was neutralized');

  // Row 1 test: null company and multiline message
  assert.ok(lines[1].includes('"Tổng Công ty Tư vấn Xây dựng Việt Nam (VNCC)"'), 'Vietnamese accents preserved cleanly');
  assert.ok(!lines[1].includes('\n'), 'Embedded newlines in textarea were normalized');

  console.log('✅ Customer Requests CSV export formatting test passed!');
}

console.log('🎉 All CSV export formatting tests completed successfully!');
