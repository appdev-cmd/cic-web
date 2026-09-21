'use client';

import React, { useState, useEffect } from 'react';
import type { CtaEntity } from '../types';
import * as Icons from 'lucide-react';

interface RuntimeCtaButtonProps {
  cta?: CtaEntity;
  code?: string;
  workspace?: 'vi' | 'en';
  className?: string;
}

export const RuntimeCtaButton: React.FC<RuntimeCtaButtonProps> = ({
  cta: initialCta,
  code,
  workspace = 'vi',
  className = '',
}) => {
  const [cta, setCta] = useState<CtaEntity | null>(initialCta || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cta && code) {
      setLoading(true);
      fetch(`/api/cta/${encodeURIComponent(code)}?workspace=${workspace}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setCta(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [code, workspace, cta]);

  if (loading) {
    return <span className="inline-block animate-pulse h-10 w-32 bg-slate-200 rounded-lg" />;
  }

  if (!cta) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const config = cta.actionConfig || {};

    switch (cta.actionType) {
      case 'open_form':
        window.dispatchEvent(
          new CustomEvent('open-cta-form', {
            detail: { formId: config.formId || cta.formId, title: cta.displayText },
          })
        );
        break;

      case 'redirect_internal': {
        const path = config.url || '/';
        if (config.openInNewTab) {
          window.open(path, '_blank');
        } else {
          window.location.href = path;
        }
        break;
      }

      case 'redirect_external': {
        const url = config.url || '#';
        window.open(url, config.openInNewTab ? '_blank' : '_self');
        break;
      }

      case 'scroll_to_section': {
        const secId = (config.sectionId || '').replace(/^#/, '');
        const elem = document.getElementById(secId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }

      case 'download_file': {
        const fileId = config.fileId || cta.mediaAssetId;
        if (fileId) {
          window.open(`/api/media/${fileId}`, '_blank');
        }
        break;
      }

      case 'call_phone': {
        const phone = config.phoneNumber || '';
        if (phone) window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
        break;
      }

      case 'send_email': {
        const email = config.emailAddress || '';
        if (email) window.location.href = `mailto:${email}`;
        break;
      }

      default:
        break;
    }
  };

  // Resolve Icon
  const IconComponent = cta.icon && (Icons as any)[cta.icon] ? (Icons as any)[cta.icon] : null;

  // Variants
  const variantStyles = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
    gradient: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md',
  }[cta.styleVariant] || 'bg-orange-600 text-white';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${variantStyles} ${className}`}
    >
      {IconComponent && <IconComponent size={16} />}
      <span>{cta.displayText}</span>
    </button>
  );
};
