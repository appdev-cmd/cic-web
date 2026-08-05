import type { ContactRequest, StaffMember } from '../modules/contacts/types';

/** Contacts are global operational records. source_locale records where each request originated. */
export interface ContactsModuleData {
  contacts: ContactRequest[];
  staffMembers: StaffMember[];
  currentUserId?: string;
}

export interface ContactsDataSource {
  operations: ContactsModuleData;
}
