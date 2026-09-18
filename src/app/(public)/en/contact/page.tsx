import type { Metadata } from 'next';
import { getPublicSystemSettings } from '@/features/system-settings/server/queries';
import { ContactView } from '@/web/components/ContactView';
import { getPublicContactContentFromConfiguration } from '@/shared/configuration/publicWebsiteConfiguration';
import type { ContactPageModel } from '@/shared/page-content/models';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact CIC | 24/7 Enterprise Consultation',
  description: 'Headquarters, branch locations, and inquiry submission channels for CIC engineering technologies and services.',
  alternates: {
    canonical: '/en/contact',
  },
};

export default async function EnContactPage() {
  const settings = await getPublicSystemSettings('en');
  const publishedBranches = settings.branches
    .filter((b) => b.published)
    .sort((a, b) => a.ordering - b.ordering);

  let contactContent: ContactPageModel;

  if (publishedBranches.length > 0) {
    contactContent = {
      branches: {
        title: 'Office Locations & Map',
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
    contactContent = getPublicContactContentFromConfiguration('en');
  }

  return <ContactView content={contactContent} />;
}
