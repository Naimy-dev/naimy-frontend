import type { UserDto } from '#shared/types';
import type { AuthPhoneInput } from '../components';

export type ApiRefreshTokenResponse = {
  accessToken: string;
  user: UserDto;
};

export type AuthPhoneInputRefType = InstanceType<typeof AuthPhoneInput> | null;
