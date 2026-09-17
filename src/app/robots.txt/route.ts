import { getPublicSystemSettings } from '@/features/system-settings/server/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getPublicSystemSettings('vi');
    let robotsContent = settings.values.robots_txt?.trim();
    if (robotsContent) {
      if (!robotsContent.toLowerCase().includes('sitemap:')) {
        robotsContent += '\n\nSitemap: https://www.cic.com.vn/sitemap.xml\n';
      }
      return new Response(robotsContent, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }
  } catch (error) {
    console.error('Failed to load robots.txt from system settings:', error);
  }

  const fallbackRobots = `User-agent: *\nAllow: /\nSitemap: https://www.cic.com.vn/sitemap.xml\n`;
  return new Response(fallbackRobots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
