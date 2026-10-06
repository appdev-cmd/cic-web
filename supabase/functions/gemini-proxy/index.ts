import { OPERATIONS, type GatewayOperationConfig } from './operations.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GatewayRequest {
  operation?: string;
  input?: Record<string, unknown>;
  // Support direct structured format as well
  systemPrompt?: string;
  userPrompt?: string;
  temperature?: number;
  maxTokens?: number;
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

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
}

/**
 * Validates the caller's JWT token or Service Role Key and confirms CMS Operator role.
 * Returns null if authenticated and authorized, or a Response object if rejected.
 */
async function authenticateAndAuthorize(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
  if (!authHeader) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unauthorized: Missing Authorization header.',
      }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unauthorized: Bearer token is empty.',
      }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  // 1. Approved server-to-server call using Service Role Key
  if (serviceRoleKey && token === serviceRoleKey) {
    return null;
  }

  // 2. Validate User JWT via Supabase Auth
  // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  // @ts-expect-error Deno global is present in Supabase Edge Functions runtime
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

  if (!supabaseUrl) {
    return new Response(
      JSON.stringify({ success: false, error: 'Server configuration error: SUPABASE_URL missing.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const authVerifyUrl = `${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`;
    const verifyRes = await fetch(authVerifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey || token,
      },
    });

    if (!verifyRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized: Invalid or expired authentication token.',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userData = await verifyRes.json();
    if (!userData?.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Identity could not be determined.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Role check: verify user has active CMS profile
    const appMetadata = userData.app_metadata || {};
    const isCmsProfile = appMetadata.cms_profile === true || appMetadata.role === 'admin' || appMetadata.role === 'operator';
    if (!isCmsProfile) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Forbidden: Insufficient privileges. Only verified CMS operators can access the AI Gateway.',
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[AI Gateway Auth Error]', err);
    return new Response(
      JSON.stringify({ success: false, error: `Authentication validation error: ${msg}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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

  // Enforce JWT validation & CMS role check
  const authErrorResponse = await authenticateAndAuthorize(req);
  if (authErrorResponse) {
    return authErrorResponse;
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
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: GatewayRequest = await req.json();
    const opName = payload.operation || 'raw.generate';
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
      // Direct raw generate
      systemInstruction = payload.systemPrompt || (payload.input?.systemPrompt as string) || '';
      userPrompt = payload.userPrompt || (payload.input?.userPrompt as string) || '';
      if (typeof payload.temperature === 'number') temperature = payload.temperature;
      if (typeof payload.maxTokens === 'number') maxOutputTokens = payload.maxTokens;
    }

    if (!userPrompt) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing prompt or input for operation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Primary Model, fallback if failed
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
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Supabase AI Gateway] Error processing request:', err);
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
