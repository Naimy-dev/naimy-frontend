import { appendResponseHeader } from 'h3';
import { defineNuxtPlugin, useRequestEvent, useRequestHeaders, useRuntimeConfig } from 'nuxt/app';
import { AuthStatus, useAuthStore } from '~/auth';
import type { ApiRefreshTokenResponse } from '~/auth';

/**
 * Вызывается один раз при старте приложения.
 * Если в куки есть refresh token — восстанавливаем сессию через POST /auth/refresh.
 * Ошибка (нет куки / протух) — молча игнорируется, пользователь остаётся гостем.
 *
 * На SSR: форвардим Set-Cookie из ответа бэка в браузерный ответ, чтобы ротация
 * refresh token работала корректно (новый токен сохранялся в браузере).
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined;

  // После SSR-гидрации стор уже содержит актуальный auth state.
  // Не делаем повторный refresh на клиенте, чтобы не ломать сессию
  // в сценарии с ротацией refresh token.
  if (import.meta.client && authStore.isAuthResolved) {
    return;
  }

  try {
    const response = await $fetch.raw<ApiRefreshTokenResponse>('/auth/refresh', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers,
      credentials: import.meta.client ? 'include' : undefined,
    });

    // Форвардим Set-Cookie из ответа бэка в браузерный ответ.
    // Это критично при ротации refresh token: без этого браузер
    // остаётся со старым токеном и следующий SSR-запрос вернёт 401.
    if (import.meta.server) {
      const event = useRequestEvent();
      const setCookie = response.headers.getSetCookie?.() ?? [];

      if (event && setCookie.length > 0) {
        for (const cookie of setCookie) {
          appendResponseHeader(event, 'set-cookie', cookie);
        }
      }
    }

    if (response._data) {
      authStore.login(response._data.accessToken, response._data.user);
    }
  } catch {
    if (import.meta.server) {
      authStore.setAuthStatus(AuthStatus.UNKNOWN);
      return;
    }

    if (authStore.isAuthenticated) {
      return;
    }

    authStore.clearAuth();
  }
});
