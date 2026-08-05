import type { ContactsDataSource } from './ContactsDataSource';
import { INITIAL_CONTACT_REQUESTS, MOCK_STAFF_MEMBERS } from '../modules/contacts/mockData';

export const demoContactsDataSource: ContactsDataSource = {
  contactsByLocale: {
    vi: {
      contacts: INITIAL_CONTACT_REQUESTS.filter((contact) => contact.source_locale === 'vi'),
    },
    en: {
      contacts: INITIAL_CONTACT_REQUESTS.filter((contact) => contact.source_locale === 'en'),
    },
  },
  staffMembers: MOCK_STAFF_MEMBERS,
  currentUserId: 'usr_sales_1',
};
