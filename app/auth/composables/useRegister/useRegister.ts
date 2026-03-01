import { ref } from 'vue';
import { FetchError } from 'ofetch';
import { useNuxtApp } from 'nuxt/app';
import type { RegisterStartPayload } from './useRegister.types';

export function useRegister() {
  const loading = ref(false);

  const api = useNuxtApp().$api as typeof $fetch;

  async function registerStart(payload: RegisterStartPayload) {
    loading.value = true;

    try {
      const { phone, firstName, lastName, password } = payload;
      const response = await api('/auth/register/start', {
        method: 'POST',
        body: {
          phone,
          firstName,
          lastName,
          password,
        },
        credentials: 'include',
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

  return {
    loading,
    registerStart,
  };
}
