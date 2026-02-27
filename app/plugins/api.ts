import { FetchError } from 'ofetch';
import { defineNuxtPlugin, useRuntimeConfig, navigateTo } from 'nuxt/app';
import { AuthTab, useAuthStore } from '~/auth';
import type { ApiRefreshTokenResponse } from '~/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers.set('Authorization', `Bearer ${authStore.accessToken}`);
      }
    },
  });

  const api = async <T>(
    request: Parameters<typeof $fetch>[0],
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> => {
    try {
      return await apiFetch<T>(request, options);
    } catch (error) {
      if (!(error instanceof FetchError) || error.response?.status !== 401) throw error;

      try {
        const { accessToken } = await apiFetch<ApiRefreshTokenResponse>('/auth/refresh', {
          method: 'POST',
        });

        authStore.setAccessToken(accessToken);
      } catch {
        authStore.clearAuth();
        await nuxtApp.runWithContext(() => navigateTo(`/auth?tab=${AuthTab.LOGIN}`));
        throw error;
      }

      return apiFetch<T>(request, options);
    }
  };

  return {
    provide: { api },
  };
});
