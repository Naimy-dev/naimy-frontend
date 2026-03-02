import { useToastStore } from '~/stores/toast/';
import { ToastType } from '~/stores/toast/toastStore.enums';
import type { NotifyPayload } from './useToast.types';

export function useToast() {
  const toastStore = useToastStore();

  function byType(type: ToastType, payload: NotifyPayload) {
    return toastStore.show({
      type,
      title: payload.title,
      description: payload.description,
      timeout: payload.timeout,
    });
  }

  return {
    show: toastStore.show,
    close: toastStore.close,
    closeAll: toastStore.closeAll,
    success: (payload: NotifyPayload) => byType(ToastType.SUCCESS, payload),
    info: (payload: NotifyPayload) => byType(ToastType.INFO, payload),
    warning: (payload: NotifyPayload) => byType(ToastType.WARNING, payload),
    error: (payload: NotifyPayload) => byType(ToastType.ERROR, payload),
    neutral: (payload: NotifyPayload) => byType(ToastType.NEUTRAL, payload),
  };
}
