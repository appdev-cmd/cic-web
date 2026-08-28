import React from 'react';

const controlClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800';

const invalidClass =
  'border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500';

export interface CmsFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function CmsField({ id, label, required = false, hint, error, children, className = '' }: CmsFieldProps) {
  const helpId = hint || error ? `${id}-help` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}{required ? <span className="text-red-600" aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={helpId} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>
      ) : hint ? (
        <p id={helpId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export interface CmsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const CmsInput = React.forwardRef<HTMLInputElement, CmsInputProps>(function CmsInput(
  { className = '', invalid = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${controlClass} ${invalid ? invalidClass : ''} ${className}`.trim()}
      {...props}
    />
  );
});

export interface CmsTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const CmsTextarea = React.forwardRef<HTMLTextAreaElement, CmsTextareaProps>(function CmsTextarea(
  { className = '', invalid = false, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${controlClass} resize-y ${invalid ? invalidClass : ''} ${className}`.trim()}
      {...props}
    />
  );
});

export interface CmsSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const CmsSelect = React.forwardRef<HTMLSelectElement, CmsSelectProps>(function CmsSelect(
  { className = '', invalid = false, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${controlClass} cursor-pointer ${invalid ? invalidClass : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
});

export const cmsFormControlClassName = controlClass;
