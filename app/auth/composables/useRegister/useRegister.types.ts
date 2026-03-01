import type { UserDto } from '#shared/types';

export type RegisterStartPayload = {
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type RegisterConfirmPayload = {
  phone: string;
  code: string;
};

export type AuthSuccessResponse = {
  user: UserDto;
  accessToken: string;
};
