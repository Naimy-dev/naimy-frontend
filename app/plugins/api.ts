import { FetchError } from 'ofetch';
import {
  createError,
  defineNuxtPlugin,
  useRuntimeConfig,
  navigateTo,
  useRequestHeaders,
} from 'nuxt/app';
import { AuthTab, useAuthStore } from '~/auth';
import type { ApiRefreshTokenResponse } from '~/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : undefined;

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    credentials: 'include',
    onRequest({ options }) {
      const headers = new Headers(options.headers);

      if (import.meta.server && requestHeaders?.cookie) {
        headers.set('cookie', requestHeaders.cookie);
      }

      if (authStore.accessToken) {
        headers.set('Authorization', `Bearer ${authStore.accessToken}`);
      }

      options.headers = headers;
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

        if (import.meta.server) {
          throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
        }

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
