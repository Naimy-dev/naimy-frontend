import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { useAuthStore } from '~/auth';
import type { ApiRefreshTokenResponse } from '~/auth';

/**
 * Вызывается один раз при старте приложения на клиенте.
 * Если в куки есть refresh token — восстанавливаем сессию через POST /auth/refresh.
 * Ошибка (нет куки / протух) — молча игнорируется, пользователь остаётся гостем.
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  try {
    const { accessToken, user } = await $fetch<ApiRefreshTokenResponse>('/auth/refresh', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      credentials: 'include',
    });

    authStore.login(accessToken, user);
  } catch {
    // refresh token отсутствует или протух — пользователь не авторизован
  }
});
