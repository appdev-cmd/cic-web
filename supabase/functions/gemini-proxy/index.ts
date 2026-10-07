import { OPERATIONS, type GatewayOperationConfig } from './operations.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Security Constraints & Limits
const MAX_PAYLOAD_BYTES = 500 * 1024; // 500 KB max request body
const MAX_USER_PROMPT_LENGTH = 12000; // ~3,000 tokens input
const MAX_SYSTEM_PROMPT_LENGTH = 4000; // ~1,000 tokens instruction
const MAX_OUTPUT_TOKENS_CAP = 4096; // Hard cap on generation length
const AUTH_TIMEOUT_MS = 10000; // 10s timeout for Supabase Auth
const GEMINI_TIMEOUT_MS = 25000; // 25s timeout for Google Gemini API

// In-Memory Sliding Window Rate Limiter
interface RateLimitEntry {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_USER = 30; // 30 req/min for verified CMS users
const MAX_REQUESTS_SERVICE = 120; // 120 req/min for internal server DAL

function checkRateLimit(key: string, isServiceRole: boolean): {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  const maxReqs = isServiceRole ? MAX_REQUESTS_SERVICE : MAX_REQUESTS_USER;
  let entry = rateLimitMap.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(key, entry);
  }

  // Filter timestamps within the current sliding window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (entry.timestamps.length >= maxReqs) {
    const oldest = entry.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      limit: maxReqs,
      remaining: 0,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    limit: maxReqs,
    remaining: maxReqs - entry.timestamps.length,
    retryAfterSec: 0,
  };
}

// Periodic cleanup to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface GatewayRequest {
  operation?: string;
  input?: Record<string, unknown>;
  systemPrompt?: string;
  userPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

interface CallerIdentity {
  isServiceRole: boolean;
  userId: string;
}

function cleanJsonText(rawText: string): string {
  let text = rawText.trim();
  if (text.startsWith('```json')) {
    text = text.substring(7);
  } else if (text.startsWith('```')) {
    text = text.substring(3);
  }
  if (text.endsWith('```')) {
    text = text.substring(0, text.length - 3);
  }
  return text.trim();
}

async function callGoogleGeminiApi(
  apiKey: string,
  model: string,
  systemInstruction: string,
  userPrompt: string,
  temperature: number,
  maxOutputTokens: number
): Promise<unknown> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseMimeType: 'application/json',
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Gemini API (${model}) returned HTTP ${response.status}: ${errorText.substring(0, 300)}`);
    }

    const data = await response.json();
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error(`Gemini API (${model}) returned empty candidates.`);
    }

    const cleaned = cleanJsonText(textContent);
    return JSON.parse(cleaned);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Gemini API (${model}) timed out after ${GEMINI_TIMEOUT_MS / 1000} seconds.`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Validates the caller's JWT token or Service Role Key and confirms CMS Operator role.
 * Returns { identity } if authenticated and authorized, or a Response object if rejected.
 */
async function authenticateAndAuthorize(req: Request): Promise<{ identity: CallerIdentity } | { errorResponse: Response }> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
  if (!authHeader) {
    return {
      errorResponse: new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized: Missing Authorization header.',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return {
      errorResponse: new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized: Bearer token is empty.',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  }

  // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  // 1. Approved server-to-server call using Service Role Key
  if (serviceRoleKey && token === serviceRoleKey) {
    return {
      identity: {
        isServiceRole: true,
        userId: 'service_role_internal',
      },
    };
  }

  // 2. Validate User JWT via Supabase Auth
  // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

  if (!supabaseUrl) {
    return {
      errorResponse: new Response(
        JSON.stringify({ success: false, error: 'Server configuration error: SUPABASE_URL missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  }

  const authController = new AbortController();
  const authTimer = setTimeout(() => authController.abort(), AUTH_TIMEOUT_MS);

  try {
    const authVerifyUrl = `${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`;
    const verifyRes = await fetch(authVerifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey || token,
      },
      signal: authController.signal,
    });

    if (!verifyRes.ok) {
      return {
        errorResponse: new Response(
          JSON.stringify({
            success: false,
            error: 'Unauthorized: Invalid or expired authentication token.',
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        ),
      };
    }

    const userData = await verifyRes.json();
    if (!userData?.id) {
      return {
        errorResponse: new Response(
          JSON.stringify({ success: false, error: 'Unauthorized: Identity could not be determined.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        ),
      };
    }

    // Role check: verify user has active CMS profile
    const appMetadata = userData.app_metadata || {};
    const isCmsProfile = appMetadata.cms_profile === true || appMetadata.role === 'admin' || appMetadata.role === 'operator';
    if (!isCmsProfile) {
      return {
        errorResponse: new Response(
          JSON.stringify({
            success: false,
            error: 'Forbidden: Insufficient privileges. Only verified CMS operators can access the AI Gateway.',
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        ),
      };
    }

    return {
      identity: {
        isServiceRole: false,
        userId: userData.id,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        errorResponse: new Response(
          JSON.stringify({ success: false, error: 'Gateway Timeout: Auth provider verification timed out.' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        ),
      };
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[AI Gateway Auth Error]', err);
    return {
      errorResponse: new Response(
        JSON.stringify({ success: false, error: `Authentication validation error: ${msg}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
    };
  } finally {
    clearTimeout(authTimer);
  }
}

// @ts-expect-error Deno global is present in Supabase Edge Functions runtime
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 1. Content-Length Header Guard
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Payload Too Large: Request exceeds maximum allowed size of ${MAX_PAYLOAD_BYTES / 1024} KB.`,
      }),
      { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 2. Enforce JWT validation & CMS role check
  const authResult = await authenticateAndAuthorize(req);
  if ('errorResponse' in authResult) {
    return authResult.errorResponse;
  }
  const caller = authResult.identity;

  // 3. Sliding-Window Rate Limit Enforcement
  const rateLimit = checkRateLimit(caller.userId, caller.isServiceRole);
  const rateLimitHeaders = {
    'X-RateLimit-Limit': String(rateLimit.limit),
    'X-RateLimit-Remaining': String(rateLimit.remaining),
  };

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Too Many Requests: Rate limit exceeded. Please wait ${rateLimit.retryAfterSec} seconds before retrying.`,
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          ...rateLimitHeaders,
          'Retry-After': String(rateLimit.retryAfterSec),
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
    const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY') || '';
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'GEMINI_API_KEY is not configured in Supabase Secrets',
        }),
        { status: 500, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: GatewayRequest = await req.json();
    const opName = payload.operation || 'raw.generate';

    // 4. Operation Guardrail: Browser clients (User JWT) MUST NOT execute raw arbitrary prompts
    if (!caller.isServiceRole && opName === 'raw.generate') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Forbidden: Direct raw prompt execution is restricted to internal server calls. Browser callers must use pre-approved operations (e.g. product.prefill, field.enrich).',
        }),
        { status: 403, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const opConfig: GatewayOperationConfig | undefined = OPERATIONS[opName];

    let systemInstruction = '';
    let userPrompt = '';
    let temperature = 0.2;
    let maxOutputTokens = 2048;
    let model = 'gemini-2.5-flash';
    let fallbackModel = 'gemini-flash-lite-latest';

    if (opConfig && opName !== 'raw.generate') {
      model = opConfig.model;
      fallbackModel = opConfig.fallbackModel;
      temperature = opConfig.temperature;
      maxOutputTokens = opConfig.maxOutputTokens;
      systemInstruction = opConfig.systemInstruction;
      userPrompt = opConfig.buildPrompt(payload.input || {});
    } else {
      // Direct raw generate (internal trusted calls only)
      systemInstruction = payload.systemPrompt || (payload.input?.systemPrompt as string) || '';
      userPrompt = payload.userPrompt || (payload.input?.userPrompt as string) || '';
      if (typeof payload.temperature === 'number') temperature = Math.min(Math.max(0, payload.temperature), 1.0);
      if (typeof payload.maxTokens === 'number') maxOutputTokens = payload.maxTokens;
    }

    // 5. Output Tokens Cap Protection
    maxOutputTokens = Math.min(Math.max(1, maxOutputTokens), MAX_OUTPUT_TOKENS_CAP);

    // 6. Input Size Validation
    if (!userPrompt || !userPrompt.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing prompt or input for operation' }),
        { status: 400, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (userPrompt.length > MAX_USER_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Payload Too Large: User prompt exceeds limit (${userPrompt.length}/${MAX_USER_PROMPT_LENGTH} characters).`,
        }),
        { status: 413, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (systemInstruction.length > MAX_SYSTEM_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Payload Too Large: System instruction exceeds limit (${systemInstruction.length}/${MAX_SYSTEM_PROMPT_LENGTH} characters).`,
        }),
        { status: 413, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 7. Call Primary Model, fallback if failed
    let result: unknown;
    let usedModel = model;

    try {
      result = await callGoogleGeminiApi(apiKey, model, systemInstruction, userPrompt, temperature, maxOutputTokens);
    } catch (primaryErr: unknown) {
      console.warn(`[Supabase AI Gateway] Primary model ${model} failed, attempting fallback ${fallbackModel}...`, primaryErr);
      usedModel = fallbackModel;
      result = await callGoogleGeminiApi(apiKey, fallbackModel, systemInstruction, userPrompt, temperature, maxOutputTokens);
    }

    return new Response(
      JSON.stringify({
        success: true,
        operation: opName,
        data: result,
        meta: {
          model: usedModel,
          timestamp: new Date().toISOString(),
        },
      }),
      { status: 200, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Supabase AI Gateway] Error processing request:', err);
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
