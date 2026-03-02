export type PasswordResetStep = 1 | 2 | 3;

export type PasswordResetStartPayload = {
  phone: string;
};

export type PasswordResetVerifyPayload = {
  phone: string;
  code: string;
};

export type PasswordResetConfirmPayload = {
  phone: string;
  newPassword: string;
};
