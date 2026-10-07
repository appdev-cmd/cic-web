import { sanitizeHtmlContent } from '../src/shared/lib/sanitize.ts';

const testCases = [
  {
    name: 'Standard script tag',
    input: '<script>alert(1)</script>',
    shouldNotContain: ['<script', 'alert(1)'],
  },
  {
    name: 'Img tag with onerror',
    input: '<img src=x onerror=alert(1)>',
    shouldNotContain: ['onerror', 'alert(1)'],
  },
  {
    name: 'Link with javascript: href',
    input: '<a href="javascript:alert(1)">test</a>',
    shouldNotContain: ['javascript:', 'alert(1)'],
  },
  {
    name: 'SVG with script or onload',
    input: '<svg onload="alert(1)"><circle r="10"/></svg><svg><script>alert(2)</script></svg>',
    shouldNotContain: ['<svg', 'onload', 'alert'],
  },
  {
    name: 'External iframe attack is stripped completely',
    input: '<iframe src="https://evil-attacker.com/malicious"></iframe>',
    shouldNotContain: ['evil-attacker.com', '<iframe'],
  },
  {
    name: 'Iframe with javascript: is stripped completely',
    input: '<iframe src="javascript:alert(1)"></iframe>',
    shouldNotContain: ['javascript', 'alert', '<iframe'],
  },
  {
    name: 'Valid YouTube iframe preserved',
    input: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" allowfullscreen></iframe>',
    shouldContain: ['youtube.com/embed/dQw4w9WgXcQ', '<iframe'],
  },
  {
    name: 'Event handlers: onclick, onmouseover, onload, onfocus',
    input: '<div onclick="alert(1)" onmouseover="alert(2)"><span onfocus="alert(3)">Click me</span></div>',
    shouldNotContain: ['onclick', 'onmouseover', 'onfocus', 'alert'],
  },
  {
    name: 'External link opens with noopener noreferrer',
    input: '<a href="https://google.com" target="_blank">External</a>',
    shouldContain: ['rel="noopener noreferrer"'],
  },
  {
    name: 'External link without target="_blank" gets noopener noreferrer',
    input: '<a href="https://external-site.org/info">External Link</a>',
    shouldContain: ['rel="noopener noreferrer"'],
  },
  {
    name: 'Internal CIC link does not get forced external rel',
    input: '<a href="https://cic.com.vn/san-pham">Sản phẩm</a>',
    shouldNotContain: ['rel="noopener noreferrer"'],
    shouldContain: ['href="https://cic.com.vn/san-pham"'],
  },
  {
    name: 'Malicious data: URI on img (data:text/html or SVG XSS) stripped',
    input: '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">',
    shouldNotContain: ['data:text/html', '<img'],
  },
  {
    name: 'Valid base64 image data URI preserved',
    input: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" alt="dot">',
    shouldContain: ['<img', 'data:image/png;base64,'],
  },
  {
    name: 'Legitimate formatting tags preserved',
    input: '<p><b>Bold</b> <i>Italic</i> <strong>Strong</strong> <em>Em</em> <u>Underline</u></p><ul><li>Item 1</li></ul>',
    shouldContain: ['<p>', '<b>Bold</b>', '<i>Italic</i>', '<strong>Strong</strong>', '<ul><li>Item 1</li></ul>'],
  },
];

console.log('--- RUNNING XSS SANITIZER TESTS ---');
let allPassed = true;

for (const tc of testCases) {
  const output = sanitizeHtmlContent(tc.input);
  let passed = true;

  if (tc.shouldNotContain) {
    for (const forbidden of tc.shouldNotContain) {
      if (output.toLowerCase().includes(forbidden.toLowerCase())) {
        console.error(`[FAIL] ${tc.name}: Output contains forbidden "${forbidden}"`);
        console.error(`  Input:  ${tc.input}`);
        console.error(`  Output: ${output}`);
        passed = false;
        allPassed = false;
      }
    }
  }

  if (tc.shouldContain) {
    for (const required of tc.shouldContain) {
      if (!output.includes(required)) {
        console.error(`[FAIL] ${tc.name}: Output missing required "${required}"`);
        console.error(`  Input:  ${tc.input}`);
        console.error(`  Output: ${output}`);
        passed = false;
        allPassed = false;
      }
    }
  }

  if (passed) {
    console.log(`[PASS] ${tc.name} -> output: ${output}`);
  }
}

if (allPassed) {
  console.log('\n>>> ALL 14/14 XSS TESTS PASSED! <<<');
} else {
  console.error('\n>>> SOME TESTS FAILED! <<<');
  process.exit(1);
}
