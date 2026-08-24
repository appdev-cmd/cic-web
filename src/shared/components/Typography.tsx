/**
 * CIC Typography — semantic type roles wired to design tokens.
 * Use these classes instead of one-off font-black / text-[10px] combinations.
 */

type Tone = 'default' | 'inverse' | 'muted' | 'brand';

const toneText: Record<Tone, string> = {
  default: 'text-slate-950',
  inverse: 'text-white',
  muted: 'text-slate-500',
  brand: 'text-orange-600',
};

/** Responsive display scale for hero headlines */
export const typeHero =
  'font-display text-[length:clamp(1.875rem,calc(2.5vw+1.25rem),4.5rem)] font-black leading-[1.1] tracking-[-0.03em] text-balance';

/** Page & section headings */
export const typeH1 =
  'font-display text-3xl sm:text-4xl md:text-5xl font-black leading-[1.12] tracking-[-0.03em] text-balance uppercase';

export const typeH2 =
  'font-display text-2xl sm:text-3xl md:text-4xl font-black leading-[1.18] tracking-[-0.02em] text-balance uppercase';

export const typeH3 =
  'font-display text-xl md:text-2xl font-bold leading-[1.25] tracking-[-0.02em] text-balance';

export const typeH4 =
  'font-display text-lg font-bold leading-[1.3] tracking-[-0.01em]';

/** Body copy */
export const typeBody =
  'text-base leading-[1.65] font-normal';

export const typeBodyLead =
  'text-lg leading-[1.6] font-medium';

export const typeBodySmall =
  'text-sm leading-[1.5] font-medium';

/** UI roles */
export const typeNav =
  'text-sm font-semibold tracking-normal';

export const typeLabel =
  'text-xs font-semibold uppercase tracking-wider';

export const typeBadge =
  'text-[0.6875rem] font-bold uppercase tracking-widest leading-none';

export const typeButton =
  'text-sm font-bold uppercase tracking-wider';

export const typeCaption =
  'text-sm font-medium leading-normal';

export const typeMeta =
  'text-xs font-semibold uppercase tracking-wide text-slate-500';

export const typeStat =
  'text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] tabular-nums leading-none';

/** Comfortable reading measure for long prose */
export const typeProse =
  `${typeBody} max-w-[68ch]`;

export const typeProseLead =
  `${typeBodyLead} max-w-[68ch]`;

interface SectionHeaderProps {
  title: string;
  sub?: string;
  dark?: boolean;
  className?: string;
  as?: 'h1' | 'h2';
  titleProps?: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement>; 'data-ve-section'?: string; 'data-ve-element'?: string; 'data-ve-editable'?: 'true'; 'data-ve-semantic'?: string };
  subProps?: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement>; 'data-ve-section'?: string; 'data-ve-element'?: string; 'data-ve-editable'?: 'true'; 'data-ve-semantic'?: string };
}

export const SectionHeader = ({
  title,
  sub,
  dark = false,
  className = '',
  as: Tag = 'h2',
  titleProps,
  subProps,
}: SectionHeaderProps) => {
  const titleColor = dark ? toneText.inverse : toneText.default;
  const subColor = dark ? 'text-slate-400' : toneText.muted;

  return (
    <div className={`text-center mb-6 ${className}`.trim()}>
      <Tag {...titleProps} className={`${typeH2} mb-3 ${titleColor} ${titleProps?.className ?? ''}`.trim()}>{title}</Tag>
      <div className="w-16 h-1 bg-orange-600 mx-auto mb-4" aria-hidden="true" />
      {sub ? (
        <p {...subProps} className={`${typeCaption} ${subColor} max-w-[52ch] mx-auto ${subProps?.className ?? ''}`.trim()}>{sub}</p>
      ) : null}
    </div>
  );
};

export const toneClass = toneText;
