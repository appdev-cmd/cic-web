/**
 * Analytics, UTM Preservation, and Conversion Tracking Engine
 *
 * Guarantees:
 * 1. UTM parameters (source, medium, campaign, term, content) and referrer are captured
 *    on initial entry and preserved across multi-page navigation in sessionStorage.
 * 2. Conversions (GA4, GTM, Meta Pixel) ONLY fire upon confirmed successful submission.
 *    Never on form open, modal open, or initial incomplete steps.
 */

import type { CustomerInteractionSubmissionSource } from '../customerInteractionContract';

export interface StoredUtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
}

export interface FormConversionDetail {
  formId: string;
  formName: string;
  requestId?: string;
  leadType?: 'consultation' | 'contact' | 'quote' | 'download' | 'newsletter' | 'event';
  productId?: string | number;
  productName?: string;
  value?: number;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'cic_marketing_attribution';

/**
 * Captures UTM parameters from URL and referrer into sessionStorage.
 * Safe to call repeatedly on route change or initial page render.
 */
export function captureAttribution(): StoredUtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const urlUtmSource = searchParams.get('utm_source');
    const urlUtmMedium = searchParams.get('utm_medium');
    const urlUtmCampaign = searchParams.get('utm_campaign');
    const urlUtmTerm = searchParams.get('utm_term');
    const urlUtmContent = searchParams.get('utm_content');

    // Retrieve existing stored attribution
    let stored: StoredUtmParams = {};
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      try {
        stored = JSON.parse(existingRaw);
      } catch {
        stored = {};
      }
    }

    // Capture referrer on first entry if external
    if (!stored.referrer && document.referrer && !document.referrer.includes(window.location.host)) {
      stored.referrer = document.referrer;
    }

    // Overwrite UTM params if new ones exist in current URL
    if (urlUtmSource || urlUtmMedium || urlUtmCampaign || urlUtmTerm || urlUtmContent) {
      if (urlUtmSource) stored.utmSource = urlUtmSource;
      if (urlUtmMedium) stored.utmMedium = urlUtmMedium;
      if (urlUtmCampaign) stored.utmCampaign = urlUtmCampaign;
      if (urlUtmTerm) stored.utmTerm = urlUtmTerm;
      if (urlUtmContent) stored.utmContent = urlUtmContent;

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } else if (!existingRaw && Object.keys(stored).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }

    return stored;
  } catch {
    return {};
  }
}

/**
 * Returns stored UTM parameters and referrer from session or active URL.
 */
export function getAttribution(): StoredUtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // fallback to immediate URL parse
  }

  return captureAttribution();
}

/**
 * Builds an enriched submission source object with full UTM attribution and page metadata.
 */
export function enrichSubmissionSource(
  baseSource: Partial<CustomerInteractionSubmissionSource>
): CustomerInteractionSubmissionSource {
  const attribution = getAttribution();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const currentTitle = typeof document !== 'undefined' ? document.title : 'CIC Technology';

  return {
    pageType: baseSource.pageType || 'website',
    pageId: baseSource.pageId || 'global',
    pageUrl: baseSource.pageUrl || currentPath,
    pageTitle: baseSource.pageTitle || currentTitle,
    placementKey: baseSource.placementKey,
    ctaId: baseSource.ctaId,
    ctaName: baseSource.ctaName,
    utmSource: baseSource.utmSource || attribution.utmSource,
    utmMedium: baseSource.utmMedium || attribution.utmMedium,
    utmCampaign: baseSource.utmCampaign || attribution.utmCampaign,
    utmTerm: baseSource.utmTerm || attribution.utmTerm,
    utmContent: baseSource.utmContent || attribution.utmContent,
    referrer: baseSource.referrer || attribution.referrer,
  };
}

/**
 * Tracks a completed lead conversion across all active tracking pipelines.
 * CRITICAL RULE: ONLY call this after the server has successfully confirmed the submission.
 * Never call on form open, modal open, or initial validation step.
 */
export function trackFormConversion(detail: FormConversionDetail): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Google Tag Manager dataLayer push
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'form_submission_success',
        form_id: detail.formId,
        form_name: detail.formName,
        lead_id: detail.requestId || null,
        lead_type: detail.leadType || 'lead',
        product_id: detail.productId ? String(detail.productId) : null,
        product_name: detail.productName || null,
        value: detail.value || 1,
        currency: 'VND',
      });
    }

    // 2. Google Analytics 4 (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'lead',
        event_label: detail.formName,
        form_id: detail.formId,
        form_name: detail.formName,
        lead_id: detail.requestId || undefined,
        lead_type: detail.leadType || 'lead',
        value: detail.value || 1,
        currency: 'VND',
      });
    }

    // 3. Meta Pixel (fbq)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: detail.formName,
        content_category: detail.leadType || 'lead',
        value: detail.value || 1,
        currency: 'VND',
      });
    }

    // 4. Custom DOM Event for custom hooks or extensions
    window.dispatchEvent(
      new CustomEvent('cic:lead_converted', {
        detail,
      })
    );
  } catch (err) {
    console.warn('[trackFormConversion] Error dispatching conversion event:', err);
  }
}
