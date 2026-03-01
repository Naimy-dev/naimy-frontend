export type AuthOtpStepProps = {
  phone: string;
  loading: boolean;
  resendLoading: boolean;
  initialResendSeconds: number;
  error: string;
};

export type AuthOtpStepEmits = {
  submit: [code: string];
  resend: [];
  back: [];
};
