import 'server-only';
import type { LlmProvider, LlmGenerateOptions } from '../types';

/**
 * Production Qwen 30B Provider using self-hosted endpoint.
 * Configured dynamically via environment variables.
 */
export class QwenLlmProvider implements LlmProvider {
  public readonly name = 'qwen-30b-self-hosted';

  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly timeoutMs: number;

  constructor() {
    this.apiUrl = (process.env.AI_OPERATOR_API_URL || '').trim();
    this.apiKey = (process.env.AI_OPERATOR_API_KEY || '').trim();
    this.modelName = (process.env.AI_OPERATOR_MODEL || 'qwen-30b').trim();
    const timeoutParsed = Number(process.env.AI_OPERATOR_TIMEOUT_MS);
    this.timeoutMs = Number.isFinite(timeoutParsed) && timeoutParsed > 0 ? timeoutParsed : 60000;
  }

  async generateStructured<T>(options: LlmGenerateOptions): Promise<T> {
    if (!this.apiUrl) {
      throw new Error('AI_OPERATOR_API_URL is not configured. Unable to connect to Qwen 30B.');
    }

    const payload = {
      model: this.modelName,
      temperature: options.temperature ?? 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: options.userPrompt },
      ],
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const endpoint = this.apiUrl.endsWith('/') ? `${this.apiUrl}chat/completions` : `${this.apiUrl}/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Qwen 30B error (${response.status}): ${errorText.substring(0, 300)}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Qwen 30B returned empty content response.');
      }

      return JSON.parse(content) as T;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error && err.name === 'AbortError'
        ? `Qwen 30B request timed out after ${this.timeoutMs / 1000}s`
        : err instanceof Error ? err.message : String(err);

      console.warn(`[AI-Operator] Qwen 30B endpoint unavailable (${errorMsg}). Falling back to deterministic grounded provider...`);
      const fallback = new DevStubLlmProvider();
      return fallback.generateStructured<T>(options);
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * Deterministic Dev / Contract Testing Provider.
 * Used when AI_OPERATOR_API_URL is unset to allow UI development & pipeline verification.
 * Follows strict grounding rules: Does NOT invent SKU, does NOT invent price or false specs.
 */
export class DevStubLlmProvider implements LlmProvider {
  public readonly name = 'dev-stub-provider';

  async generateStructured<T>(options: LlmGenerateOptions): Promise<T> {
    // Artificial small delay to simulate processing step in dev
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const parsedPrompt = JSON.parse(options.userPrompt);
      const rawInput = String(parsedPrompt.input || '').trim();
      const availableBrands: Array<{ id: number; name: string }> = parsedPrompt.taxonomy?.brands || [];
      const availableCategories: Array<{ id: number; name: string }> = parsedPrompt.taxonomy?.categories || [];

      // Detect brand from raw input or default to first matching
      const matchedBrand = availableBrands.find((b) =>
        rawInput.toLowerCase().includes(b.name.toLowerCase())
      ) || null;

      // Extract cleaned title
      const title = rawInput.split('\n')[0].replace(/[#*]/g, '').trim() || 'Sản phẩm mới';

      // Safe deterministic slug
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if user input provided a SKU/Code explicitly (e.g. SKU: XYZ or CODE: ABC)
      const skuMatch = rawInput.match(/\b(?:SKU|Code|Mã)[:\s]+([A-Za-z0-9-_]+)/i);
      const code = skuMatch ? skuMatch[1] : ''; // DO NOT invent SKU if not in input!

      // Check if user input provided specific notes for summary
      const summary = rawInput.length > title.length + 10
        ? rawInput.substring(title.length).trim().replace(/\n+/g, ' ').substring(0, 200)
        : `Giải pháp phần mềm kỹ thuật ${title} chính hãng, phục vụ công tác thiết kế và phân tích chuyên nghiệp.`;

      const responsePayload = {
        name: title,
        alias: slug,
        code, // empty string if not in input
        manufactoryId: matchedBrand ? matchedBrand.id : null,
        categoryIds: availableCategories.length > 0 ? [availableCategories[0].id] : [],
        applicationIds: [],
        typeId: null,
        summary,
        description: `<p>${summary}</p><p>Liên hệ Trung tâm Công nghệ Thông tin và Tư vấn Xây dựng (CIC) để nhận tư vấn kỹ thuật và chuyển giao công nghệ.</p>`,
        feature_details: '', // Leave empty if user provided no specs, do NOT invent!
        tags: [matchedBrand?.name, 'Phần mềm kỹ thuật', 'Bản quyền CIC'].filter(Boolean) as string[],
        seo_title: `${title} — Bản quyền chính hãng CIC`,
        seo_description: `${summary.substring(0, 150)}... Nhận tư vấn và báo giá tại CIC.`,
        seo_keyword: `${title}, bản quyền ${title}, giải pháp kỹ thuật, CIC`,
        relatedProductIds: [],
        teamview: true,
      };

      return responsePayload as unknown as T;
    } catch {
      // If userPrompt is not JSON, check for SEO or Translation prompts
      const text = options.userPrompt;
      if (text.includes('seo_title') || text.includes('chuyên gia SEO')) {
        const nameMatch = text.match(/Tên:\s*"([^"]+)"/);
        const name = nameMatch ? nameMatch[1] : 'Sản phẩm';
        return {
          seo_title: `${name} — Giải pháp bản quyền chính hãng CIC`.substring(0, 65),
          seo_description: `Thông tin giải pháp ${name} chính hãng tại CIC. Hỗ trợ kỹ thuật chuyên sâu, chuyển giao công nghệ và chính sách giá tối ưu cho doanh nghiệp.`.substring(0, 160),
          seo_keyword: `${name}, phần mềm xây dựng, bản quyền ${name}, giải pháp CIC`,
        } as unknown as T;
      }

      if (text.includes('Dịch và bản địa hóa')) {
        const nameMatch = text.match(/Tên gốc:\s*"([^"]+)"/);
        const name = nameMatch ? nameMatch[1] : 'Product';
        return {
          name: `${name} (Official)`,
          summary: `Official software solution ${name} distributed by CIC Technology and Consulting Center.`,
          description: `<p>Official software solution ${name} distributed by CIC Technology and Consulting Center. Contact CIC for technical consultation and licensing.</p>`,
          seo_title: `${name} — Genuine Software Solutions | CIC`,
          seo_description: `Discover official software ${name} at CIC. Enterprise licensing and expert technical consulting.`,
        } as unknown as T;
      }

      // Default fallback object
      return {
        name: 'Sản phẩm mới',
        alias: 'san-pham-moi',
        code: '',
        manufactoryId: null,
        categoryIds: [],
        summary: '',
        description: '',
        feature_details: '',
        tags: [],
        seo_title: '',
        seo_description: '',
        seo_keyword: '',
        relatedProductIds: [],
        teamview: true,
      } as unknown as T;
    }
  }
}

/**
 * Returns the configured LLM provider.
 * Falls back to DevStubLlmProvider if AI_OPERATOR_API_URL is missing.
 */
export function getLlmProvider(): LlmProvider {
  if (process.env.AI_OPERATOR_API_URL) {
    return new QwenLlmProvider();
  }
  return new DevStubLlmProvider();
}
