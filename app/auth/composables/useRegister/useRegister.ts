import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { navigateTo, useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '~/auth/stores';
import { useToast } from '~/composables/useToast';
import type {
  AuthSuccessResponse,
  RegisterConfirmPayload,
  RegisterStartPayload,
} from './useRegister.types';

export function useRegister() {
  const loading = ref(false);
  const resendLoading = ref(false);

  const api = useNuxtApp().$api as typeof $fetch;
  const authStore = useAuthStore();
  const toast = useToast();

  async function registerStart(payload: RegisterStartPayload) {
    loading.value = true;

    try {
      const { phone, firstName, lastName, password } = payload;
      await api('/auth/register/start', {
        method: 'POST',
        body: {
          phone,
          firstName,
          lastName,
          password,
        },
      });
    } catch (error) {
      let message = 'Не удалось создать аккаунт. Попробуйте позже.';

      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 409) {
          message = 'Пользователь уже существует';
        }

        if (status === 429) {
          message = 'Превышен лимит SMS';
        }
      }

      toast.error({
        title: 'Ошибка регистрации',
        description: message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function registerConfirm(payload: RegisterConfirmPayload) {
    loading.value = true;

    try {
      const { accessToken, user } = await api<AuthSuccessResponse>('/auth/register/confirm', {
        method: 'POST',
        body: payload,
      });
      authStore.login(accessToken, user);
      await navigateTo('/');
    } catch (error) {
      let message = 'Не удалось подтвердить код. Попробуйте позже.';

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
        title: 'Ошибка подтверждения регистрации',
        description: message,
      });
    } finally {
      loading.value = false;
    }
  }

  async function resendRegisterOtp(payload: RegisterStartPayload) {
    resendLoading.value = true;

    try {
      await registerStart(payload);
    } finally {
      resendLoading.value = false;
    }
  }

  return {
    loading,
    resendLoading,
    registerStart,
    registerConfirm,
    resendRegisterOtp,
  };
}
