import { getPublicSystemSettings } from '@/features/system-settings/server/queries';
import { ContactView } from '@/web/components/ContactView';
import { getPublicContactContentFromConfiguration } from '@/shared/configuration/publicWebsiteConfiguration';
import type { ContactPageModel } from '@/shared/page-content/models';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên hệ | CIC Technology',
  description: 'Thông tin liên hệ, trụ sở chính và các chi nhánh của CIC Technology.',
};

export default async function ContactPage() {
  const settings = await getPublicSystemSettings('vi');

  const publishedBranches = settings.branches
    .filter((b) => b.published)
    .sort((a, b) => a.ordering - b.ordering);

  let contactContent: ContactPageModel;

  if (publishedBranches.length > 0) {
    contactContent = {
      branches: {
        title: 'Bản đồ & Chi nhánh',
        branches: publishedBranches.map((b) => {
          const searchQuery = b.mapSearchQuery || b.address;
          return {
            id: b.id,
            name: b.name,
            address: b.address,
            phone: b.phone,
            email: b.email,
            fax: b.fax || undefined,
            workingHours: b.workingHours,
            mapUrl:
              b.mapEmbedUrl ||
              `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`,
            searchQuery,
          };
        }),
      },
    };
  } else {
    contactContent = getPublicContactContentFromConfiguration('vi');
  }

  return <ContactView content={contactContent} />;
}
