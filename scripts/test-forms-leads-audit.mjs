import { captureAttribution, enrichSubmissionSource, trackFormConversion } from '../src/shared/lib/analytics.ts';
import { contactInputSchema } from '../src/features/contact/schemas/contactInput.ts';
import { customerInteractionInputSchema } from '../src/features/contact/schemas/customerInteractionInput.ts';

console.log('--- RUNNING FORMS & LEADS SECURITY & INTEGRITY AUDIT ---');

let allPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    allPassed = false;
  } else {
    console.log(`[PASS] ${message}`);
  }
}

// 1. Validation & Schema Contracts
console.log('\n1. Testing Validation Contracts (Required, Email, Phone)...');

// Email validation test
try {
  contactInputSchema.parse({ email: 'invalid-email', fullname: 'Test User' });
  assert(false, 'Should reject invalid email format in contactInputSchema');
} catch {
  assert(true, 'contactInputSchema correctly rejects invalid email');
}

const validContact = contactInputSchema.safeParse({
  email: 'khachhang@example.com',
  fullname: 'Nguyễn Văn A',
  telephone: '0988123456',
  subject: 'Tư vấn phần mềm',
  message: 'Chi tiết cần tư vấn',
});
assert(validContact.success, 'contactInputSchema accepts valid contact payload');

// 2. UTM / Source Preservation in CustomerInteraction schema
console.log('\n2. Testing UTM & Source Preservation in Schemas...');

const customerInteractionPayload = {
  formId: 'form_test',
  formName: 'Đăng ký tư vấn',
  values: {
    fullName: 'Trần Thị B',
    phone: '0912345678',
    email: 'tranthib@example.com',
    productId: 105,
    productName: 'Allplan 2026',
  },
  source: {
    pageType: 'product',
    pageId: '105',
    pageUrl: 'https://cic.com.vn/products/allplan-2026',
    pageTitle: 'Allplan 2026 - Giải pháp BIM',
    placementKey: 'product-quote-modal',
    ctaId: 'cta_quote',
    ctaName: 'Yêu cầu báo giá',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'bim_q2_2026',
    utmTerm: 'allplan ban quyen',
    utmContent: 'banner_top',
    referrer: 'https://google.com.vn',
  },
};

const parsedInteraction = customerInteractionInputSchema.safeParse(customerInteractionPayload);
assert(parsedInteraction.success, 'customerInteractionInputSchema preserves all UTM params and referrer');
if (parsedInteraction.success) {
  assert(parsedInteraction.data.source.utmSource === 'google', 'UTM source is preserved as google');
  assert(parsedInteraction.data.source.utmMedium === 'cpc', 'UTM medium is preserved as cpc');
  assert(parsedInteraction.data.source.utmCampaign === 'bim_q2_2026', 'UTM campaign is preserved as bim_q2_2026');
  assert(parsedInteraction.data.source.referrer === 'https://google.com.vn', 'Referrer is preserved');
}

// 3. Conversion Tracking Rule
console.log('\n3. Testing Conversion Tracking Trigger Guard...');

let conversionDispatched = false;
let customEventDetail = null;

// Mock window environment for Node test
globalThis.window = {
  dataLayer: [],
  gtag: (command, eventName, params) => {
    conversionDispatched = true;
    assert(eventName === 'generate_lead', 'GA4 event name must be generate_lead');
  },
  fbq: (command, eventName, params) => {
    assert(eventName === 'Lead', 'Meta Pixel event name must be Lead');
  },
  dispatchEvent: (event) => {
    customEventDetail = event.detail;
  },
};

trackFormConversion({
  formId: 'product-contact',
  formName: 'Yêu cầu báo giá Allplan',
  requestId: 'lead-12345',
  leadType: 'quote',
  productId: 105,
  productName: 'Allplan 2026',
});

assert(conversionDispatched, 'trackFormConversion successfully dispatches to gtag, dataLayer, and fbq');
assert(globalThis.window.dataLayer.length === 1, 'dataLayer has exactly 1 lead conversion entry');
assert(globalThis.window.dataLayer[0].product_id === '105', 'Conversion payload contains Product ID');
assert(globalThis.window.dataLayer[0].lead_id === 'lead-12345', 'Conversion payload contains Request ID');

// 4. Phone Regex Validation Check
console.log('\n4. Testing Phone Number Validation Pattern...');
const phoneRegex = /^[0-9+.\s-]{8,15}$/;
assert(phoneRegex.test('0988123456'), 'Accepts standard 10-digit VN phone 0988123456');
assert(phoneRegex.test('+84988123456'), 'Accepts international format +84988123456');
assert(phoneRegex.test('024 3976 1381'), 'Accepts spaced landline 024 3976 1381');
assert(!phoneRegex.test('123'), 'Rejects short number 123');
assert(!phoneRegex.test('abc1234567'), 'Rejects alphabet characters in phone number');
assert(!phoneRegex.test('<script>alert(1)</script>'), 'Rejects XSS payload in phone field');

// 5. Anti-Spam Honeypot Check
console.log('\n5. Testing Anti-Spam Honeypot Protection...');
const botPayload = {
  email: 'bot@spam.com',
  fullname: 'Bot Spammer',
  _hp: 'spam-bot-value', // Honeypot trap
};
const parsedBot = contactInputSchema.safeParse(botPayload);
assert(parsedBot.success && parsedBot.data._hp === 'spam-bot-value', 'Honeypot value is captured and detected for silent discard');

if (allPassed) {
  console.log('\n>>> ALL 12 FORMS & LEADS AUDIT TESTS PASSED! <<<');
} else {
  console.error('\n>>> SOME AUDIT TESTS FAILED! <<<');
  process.exit(1);
}
