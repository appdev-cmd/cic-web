import type { ReactNode } from 'react';

export type ApplicationStateTone = 'neutral' | 'warning' | 'danger';

export interface ApplicationStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  tone?: ApplicationStateTone;
  compact?: boolean;
  className?: string;
}

const toneClasses: Record<ApplicationStateTone, string> = {
  neutral: 'border-slate-200 bg-white text-slate-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  danger: 'border-red-200 bg-red-50 text-red-950',
};

/**
 * Server-compatible application state shell.
 * Domains own their copy, actions, illustrations and layout when this shell is not sufficient.
 */
export function ApplicationState({
  title,
  description,
  action,
  icon,
  tone = 'neutral',
  compact = false,
  className = '',
}: Readonly<ApplicationStateProps>) {
  return (
    <section
      className={`${compact ? 'p-5' : 'p-7 sm:p-8'} rounded-2xl border text-center shadow-xs ${toneClasses[tone]} ${className}`.trim()}
    >
      {icon ? <div className="mx-auto mb-4 flex w-fit justify-center" aria-hidden="true">{icon}</div> : null}
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
      {description ? <p className="mx-auto mt-2 max-w-xl text-sm leading-6 opacity-75 sm:text-base">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );
}
