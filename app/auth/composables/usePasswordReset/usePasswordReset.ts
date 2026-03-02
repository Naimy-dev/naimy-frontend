import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { useNuxtApp } from 'nuxt/app';
import { useToast } from '~/composables/useToast';
import type {
  PasswordResetConfirmPayload,
  PasswordResetStartPayload,
  PasswordResetStep,
  PasswordResetVerifyPayload,
} from './usePasswordReset.types';

export function usePasswordReset() {
  const loading = ref(false);
  const resendLoading = ref(false);
  const step = ref<PasswordResetStep>(1);

  const api = useNuxtApp().$api;
  const toast = useToast();

  function setStep(nextStep: PasswordResetStep) {
    step.value = nextStep;
  }

  async function resetStart(payload: PasswordResetStartPayload) {
    loading.value = true;

    try {
      await api('/auth/password/reset/start', {
        method: 'POST',
        body: payload,
      });

      setStep(2);
    } catch (error) {
      let message = 'Не удалось отправить код. Попробуйте позже.';

      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          message = 'Пользователь с таким номером не найден';
        }

        if (status === 429) {
          message = 'Превышен лимит SMS. Попробуйте позже';
        }
      }

      toast.error({
        title: 'Ошибка сброса пароля',
        description: message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function resetVerify(payload: PasswordResetVerifyPayload) {
    loading.value = true;

    try {
      await api('/auth/password/reset/verify', {
        method: 'POST',
        body: payload,
      });

      setStep(3);
    } catch (error) {
      let message = 'Не удалось проверить код. Попробуйте позже.';

      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          message = 'Неверный или устаревший код';
        }

        if (status === 429) {
          message = 'Превышено число попыток';
        }
      }

      toast.error({
        title: 'Ошибка подтверждения кода',
        description: message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function resetConfirm(payload: PasswordResetConfirmPayload) {
    loading.value = true;

    try {
      await api('/auth/password/reset/confirm', {
        method: 'POST',
        body: payload,
      });
    } catch (error) {
      let message = 'Не удалось обновить пароль. Попробуйте позже.';

      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          message = 'Сброс не подтверждён или пользователь не найден';
        }
      }

      toast.error({
        title: 'Ошибка обновления пароля',
        description: message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function resendResetOtp(payload: PasswordResetStartPayload) {
    resendLoading.value = true;

    try {
      await resetStart(payload);
    } finally {
      resendLoading.value = false;
    }
  }

  return {
    loading,
    resendLoading,
    step,
    setStep,
    resetStart,
    resetVerify,
    resetConfirm,
    resendResetOtp,
  };
}
