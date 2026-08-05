import type { ContactsDataSource } from './ContactsDataSource';
import { INITIAL_CONTACT_REQUESTS, MOCK_STAFF_MEMBERS } from '../modules/contacts/mockData';

export const demoContactsDataSource: ContactsDataSource = {
  operations: {
    contacts: INITIAL_CONTACT_REQUESTS,
    staffMembers: MOCK_STAFF_MEMBERS,
    currentUserId: 'usr_sales_1',
  },
};
