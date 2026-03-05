import type { Language, UserContactVisibility, UserSex, UserStatus } from '~~/shared/enums';

export type UserContacts = {
  email?: string | null;
  telegram: string | null;
  viber: string | null;
};

export type UserSettings = {
  language: Language;
  phoneVisibility: UserContactVisibility;
  emailVisibility: UserContactVisibility;
};

export type UserPublicProfile = {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  dob: string | null;
  description: string | null;
  sex: UserSex;
  status: UserStatus;
  rating: number | null;
  qualityRating: number | null;
  politenessRating: number | null;
  timelinessRating: number | null;
  createdAt: string;
  isVerified: boolean;
  phone?: string;
  contacts: UserContacts;
};

export type UserMyProfile = UserPublicProfile & {
  settings: UserSettings;
};

export type UpdateProfileDto = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  description?: string;
  sex?: UserSex;
};

export type UpdateContactsDto = {
  email?: string;
  telegram?: string;
  viber?: string;
};

export type UpdateSettingsDto = {
  language?: Language;
  phoneVisibility?: UserContactVisibility;
  emailVisibility?: UserContactVisibility;
};
