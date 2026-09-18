import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { WebsiteShell } from './WebsiteShell';
import { getPublicSystemSettings } from '@/features/system-settings/server/queries';
import { getNavigationDataFromDb } from '@/features/menu/server/queries';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSystemSettings('vi');
  const values = settings.values;

  const siteName = values.site_name || 'CIC Technology';
  const suffix = values.main_title || 'CIC';
  const metaTitle = values.title || `${siteName} — Đối tác công nghệ chiến lược`;
  const metaDes = values.meta_des || 'Sản phẩm, dịch vụ tư vấn và dự án công nghệ của CIC Technology.';
  const ogImage = values.og_image || '/og-image.png';
  const favicon = values.favicon || '/favicon.ico';

  return {
    title: {
      default: metaTitle,
      template: `%s | ${suffix}`,
    },
    description: metaDes,
    keywords: values.meta_key ? values.meta_key.split(',').map((s) => s.trim()) : undefined,
    icons: {
      icon: favicon,
    },
    openGraph: {
      title: metaTitle,
      description: metaDes,
      siteName,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [settingsVi, settingsEn, navigationVi, navigationEn] = await Promise.all([
    getPublicSystemSettings('vi'),
    getPublicSystemSettings('en'),
    getNavigationDataFromDb('vi'),
    getNavigationDataFromDb('en'),
  ]);
  const values = settingsVi.values;
  const gaId = values.google_analytics;
  const gtmId = values.gtm_id;
  const metaPixelId = values.meta_pixel_id;

  return (
    <>
      {/* Google Analytics GA4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager GTM */}
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="fb-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      <WebsiteShell
        settingsMap={{ vi: settingsVi, en: settingsEn }}
        navigationMap={{ vi: navigationVi, en: navigationEn }}
      >
        {children}
      </WebsiteShell>
    </>
  );
}
