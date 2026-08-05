import type { ContactRequest, StaffMember } from '../modules/contacts/types';
import type { CmsLocale } from './CmsDataSource';

export interface ContactsModuleData {
  contacts: ContactRequest[];
}

export interface ContactsDataSource {
  contactsByLocale: Partial<Record<CmsLocale, ContactsModuleData>>;
  staffMembers: StaffMember[];
  currentUserId?: string;
}
