import { History, Home, Search, ShieldQuestion } from 'lucide-react';

export interface NotFoundContent {
  title: string;
  description: string;
  image?: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const defaultNotFoundContent: NotFoundContent = {
  title: 'Không tìm thấy trang',
  description: 'Đường dẫn bạn truy cập không tồn tại, đã được thay đổi hoặc tạm thời không khả dụng.',
  ctaLabel: 'Về trang chủ',
  ctaUrl: '/',
};

interface NotFoundViewProps {
  content?: Partial<NotFoundContent>;
  onNavigateHome?: () => void;
  onGoBack?: () => void;
  embedded?: boolean;
}

export function NotFoundView({ content, onNavigateHome, onGoBack, embedded = false }: NotFoundViewProps) {
  const value = { ...defaultNotFoundContent, ...content };

  const handlePrimaryAction = () => {
    if (embedded) return;
    if (value.ctaUrl === '/' && onNavigateHome) {
      onNavigateHome();
      return;
    }
    window.location.assign(value.ctaUrl);
  };

  return (
    <section
      className={`relative isolate overflow-hidden bg-white ${
        embedded ? 'min-h-[430px]' : 'min-h-screen'
      }`}
      aria-labelledby="not-found-title"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(15,23,42,0.08),transparent_32%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className={`mx-auto flex max-w-7xl items-center px-5 sm:px-8 ${embedded ? 'min-h-[430px] py-10' : 'min-h-screen py-12 lg:py-20'}`}>
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-700">
              <ShieldQuestion className="h-4 w-4" />
              Lỗi 404
            </div>

            <h1 id="not-found-title" className={`${embedded ? 'text-3xl' : 'text-4xl sm:text-5xl lg:text-6xl'} font-black tracking-[-0.04em] text-slate-950`}>
              {value.title}
            </h1>
            <p className={`mx-auto mt-5 max-w-xl whitespace-pre-line text-slate-600 lg:mx-0 ${embedded ? 'text-sm leading-6' : 'text-base leading-7 sm:text-lg'}`}>
              {value.description}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                <Home className="h-4 w-4" />
                {value.ctaLabel}
              </button>
              {!embedded && (
                <button
                  type="button"
                  onClick={onGoBack || (() => window.history.back())}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  <History className="h-4 w-4" />
                  Quay lại trang trước
                </button>
              )}
            </div>

            {!embedded && (
              <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 lg:justify-start">
                <Search className="h-3.5 w-3.5" />
                Bạn có thể kiểm tra lại đường dẫn hoặc trở về Trang chủ để tiếp tục.
              </p>
            )}
          </div>

          <div className="order-1 flex items-center justify-center lg:order-2" aria-hidden="true">
            {value.image ? (
              <img src={value.image} alt="" className={`${embedded ? 'max-h-52' : 'max-h-[430px]'} w-full max-w-xl object-contain`} />
            ) : (
              <div className="relative flex aspect-square w-full max-w-[430px] items-center justify-center">
                <div className="absolute inset-[8%] rounded-full border border-orange-200 bg-orange-50/70" />
                <div className="absolute inset-[20%] rounded-full border border-dashed border-orange-300 motion-safe:animate-[spin_24s_linear_infinite]" />
                <div className="absolute left-[10%] top-[22%] h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.65)]" />
                <div className="absolute bottom-[18%] right-[13%] h-2.5 w-2.5 rounded-full bg-slate-800" />
                <div className="relative select-none text-[clamp(6rem,20vw,11rem)] font-black leading-none tracking-[-0.1em] text-slate-950">
                  4<span className="text-orange-600">0</span>4
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
