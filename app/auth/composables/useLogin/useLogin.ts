import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { navigateTo, useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '~/auth/stores';
import type { AuthSuccessResponse, LoginPayload } from './useLogin.types';

export function useLogin() {
  const loading = ref(false);

  const api = useNuxtApp().$api;
  const authStore = useAuthStore();

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
      if (error instanceof FetchError) {
        const status = error.response?.status;

        if (status === 401) {
          throw new Error('Неверный телефон или пароль');
        }

        if (status === 429) {
          throw new Error('Слишком много попыток. Попробуйте позже.');
        }
      }

      throw new Error('Не удалось войти. Попробуйте позже.');
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    login,
  };
}
