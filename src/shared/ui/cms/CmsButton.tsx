import React from 'react';

type CmsButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type CmsButtonSize = 'sm' | 'md';

interface CmsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CmsButtonVariant;
  size?: CmsButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const variantClasses: Record<CmsButtonVariant, string> = {
  primary: 'border-orange-600 bg-orange-600 text-white hover:border-orange-700 hover:bg-orange-700 shadow-sm',
  secondary: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  danger: 'border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700',
  ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
};

const sizeClasses: Record<CmsButtonSize, string> = {
  sm: 'min-h-8 px-3 text-[13px] rounded-lg gap-1.5',
  md: 'min-h-10 px-4 text-sm rounded-xl gap-2',
};

export const CmsButton = React.forwardRef<HTMLButtonElement, CmsButtonProps>(function CmsButton(
  {
    variant = 'secondary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    className = '',
    children,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {leadingIcon && <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">{leadingIcon}</span>}
      {children && <span className="inline-flex min-w-0 items-center">{children}</span>}
      {trailingIcon && <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">{trailingIcon}</span>}
    </button>
  );
});

interface CmsIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  'aria-label': string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger';
  size?: 'sm' | 'md';
}

export const CmsIconButton = React.forwardRef<HTMLButtonElement, CmsIconButtonProps>(function CmsIconButton(
  { icon, variant = 'default', size = 'md', className = '', type = 'button', ...props },
  ref
) {
  const color = variant === 'danger'
    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white';

  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 ${size === 'sm' ? 'size-8' : 'size-9'} ${color} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
});
