import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from 'nuxt/app';
import { AuthStatus, useAuthStore } from '~/auth';
import type { ApiRefreshTokenResponse } from '~/auth';

/**
 * Вызывается один раз при старте приложения.
 * Если в куки есть refresh token — восстанавливаем сессию через POST /auth/refresh.
 * Ошибка (нет куки / протух) — молча игнорируется, пользователь остаётся гостем.
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined;

  try {
    const { accessToken, user } = await $fetch<ApiRefreshTokenResponse>('/auth/refresh', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers,
      credentials: import.meta.client ? 'include' : undefined,
    });

    authStore.login(accessToken, user);
  } catch {
    if (import.meta.server) {
      authStore.setAuthStatus(AuthStatus.UNKNOWN);
      return;
    }

    authStore.clearAuth();
  }
});
