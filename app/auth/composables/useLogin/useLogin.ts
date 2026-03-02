import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { navigateTo, useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '~/auth/stores';
import { useToast } from '~/composables/useToast';
import type { AuthSuccessResponse, LoginPayload } from './useLogin.types';

export function useLogin() {
  const loading = ref(false);

  const api = useNuxtApp().$api;
  const authStore = useAuthStore();
  const toast = useToast();

  async function login(payload: LoginPayload) {
    loading.value = true;

    try {
      const { accessToken, user } = await api<AuthSuccessResponse>('/auth/login', {
        method: 'POST',
        body: payload,
      });

      authStore.login(accessToken, user);
      await navigateTo('/');
    } catch (error) {
      let message = 'Не удалось войти. Попробуйте позже.';

      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 401) {
          message = 'Неверный телефон или пароль';
        }

        if (status === 429) {
          message = 'Слишком много попыток. Попробуйте позже.';
        }
      }

      toast.error({
        title: 'Ошибка входа',
        description: message,
      });
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    login,
  };
}
