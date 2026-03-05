import type { UserPublicProfile } from '~/user/types';

export type UserProfileHeroProps = {
  profile: UserPublicProfile;
  isOwner: boolean;
};
