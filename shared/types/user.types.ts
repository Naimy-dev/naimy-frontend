import type { UserAccountState, UserSex, UserStatus } from '../enums';

export type UserDto = {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  phoneVerified: boolean;
  photoUrl: string | null;
  dob: string | null;
  description: string | null;
  sex: UserSex;
  status: UserStatus;
  accountState: UserAccountState;
  rating: string | null;
  qualityRating: string | null;
  politenessRating: string | null;
  timelinessRating: string | null;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string | null;
  contacts: UserContacts;
};

type UserContacts = {
  email: string | null;
  telegram: string | null;
  viber: string | null;
};
