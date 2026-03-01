import type { UserDto } from '#shared/types';

export type ApiRefreshTokenResponse = {
  accessToken: string;
  user: UserDto;
};
