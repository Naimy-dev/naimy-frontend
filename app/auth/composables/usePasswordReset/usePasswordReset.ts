import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { useNuxtApp } from 'nuxt/app';
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
      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          throw new Error('Пользователь с таким номером не найден');
        }

        if (status === 429) {
          throw new Error('Превышен лимит SMS. Попробуйте позже');
        }
      }

      throw new Error('Не удалось отправить код. Попробуйте позже.');
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
      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          throw new Error('Неверный или устаревший код');
        }

        if (status === 429) {
          throw new Error('Превышено число попыток');
        }
      }

      throw new Error('Не удалось проверить код. Попробуйте позже.');
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
      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          throw new Error('Сброс не подтверждён или пользователь не найден');
        }
      }

      throw new Error('Не удалось обновить пароль. Попробуйте позже.');
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
