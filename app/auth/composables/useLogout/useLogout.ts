import { ref } from 'vue';
import { navigateTo, useNuxtApp } from 'nuxt/app';
import { AuthTab } from '~/auth/enums';
import { useAuthStore } from '~/auth/stores';

export function useLogout() {
  const loading = ref(false);
  const api = useNuxtApp().$api;
  const authStore = useAuthStore();

  async function logout() {
    loading.value = true;

    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      authStore.clearAuth();
      loading.value = false;
    }
  }

  return { logout, loading };
}
