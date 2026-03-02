import type { ToastType } from './toastStore.enums';

export type Toast = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  timeout: number | null;
};

export type ShowToastPayload = {
  type: ToastType;
  title: string;
  description?: string;
  timeout?: number | null;
};
