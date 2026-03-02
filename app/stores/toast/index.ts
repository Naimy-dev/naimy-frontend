import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ShowToastPayload, Toast } from './toastStore.types';
import { defaultToastTimeout, getToastId } from './toastStore.config';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function show(payload: ShowToastPayload) {
    const id = getToastId();
    const timeout = payload.timeout === undefined ? defaultToastTimeout : payload.timeout;

    toasts.value.unshift({
      id,
      type: payload.type,
      title: payload.title,
      description: payload.description,
      timeout,
    });

    if (import.meta.client && timeout) {
      const timer = setTimeout(() => {
        close(id);
      }, timeout);

      timers.set(id, timer);
    }

    return id;
  }

  function close(id: string) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

    const toastIndex = toasts.value.findIndex((toast) => toast.id === id);
    if (toastIndex !== -1) {
      toasts.value.splice(toastIndex, 1);
    }
  }

  function closeAll() {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    toasts.value = [];
  }

  return {
    toasts,
    show,
    close,
    closeAll,
  };
});
