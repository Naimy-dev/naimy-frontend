export type AuthOtpStepProps = {
  phone: string;
  loading: boolean;
  resendLoading: boolean;
  initialResendSeconds: number;
};

export type AuthOtpStepEmits = {
  submit: [code: string];
  resend: [];
  back: [];
};
