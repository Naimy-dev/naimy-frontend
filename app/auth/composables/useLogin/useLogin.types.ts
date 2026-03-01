import type { UserDto } from '#shared/types';

export type LoginPayload = {
  phone: string;
  password: string;
};

export type AuthSuccessResponse = {
  user: UserDto;
  accessToken: string;
};
