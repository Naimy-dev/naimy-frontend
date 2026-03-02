import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { navigateTo, useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '~/auth/stores';
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
      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 409) {
          throw new Error('Пользователь уже существует');
        }

        if (status === 429) {
          throw new Error('Превышен лимит SMS');
        }
      }

      throw new Error('Не удалось создать аккаунт. Попробуйте позже.');
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
      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 400) {
          throw new Error('Неверный или устаревший код');
        }

        if (status === 429) {
          throw new Error('Превышено число попыток');
        }
      }

      throw new Error('Не удалось подтвердить код. Попробуйте позже.');
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
