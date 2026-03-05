import type { UserContacts } from '~/user/types';

export type UserProfileContactsProps = {
  isOwner: boolean;
  phone?: string | null;
  contacts: UserContacts;
};

export type ContactItem = {
  key: string;
  label: string;
  value: string;
};
