import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserDto } from '#shared/types';
import { AuthStatus } from '~/auth/enums';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<UserDto | null>(null);
  const authStatus = ref<AuthStatus>(AuthStatus.UNKNOWN);

  const isAuthenticated = computed(() => authStatus.value === AuthStatus.AUTHENTICATED);
  const isAuthResolved = computed(() => authStatus.value !== AuthStatus.UNKNOWN);

  const userInitial = computed(() => {
    if (!user.value) {
      return '';
    }

    const { firstName, lastName } = user.value;
    return `${firstName.slice(0, 1).toUpperCase()} ${lastName.slice(0, 1).toUpperCase()}`;
  });

  function setAccessToken(token: string) {
    accessToken.value = token;
    authStatus.value = AuthStatus.AUTHENTICATED;
  }

  function login(token: string, u: UserDto) {
    accessToken.value = token;
    user.value = u;
    authStatus.value = AuthStatus.AUTHENTICATED;
  }

  function clearAuth() {
    accessToken.value = null;
    user.value = null;
    authStatus.value = AuthStatus.GUEST;
  }

  function setAuthStatus(status: AuthStatus) {
    authStatus.value = status;
  }

  return {
    accessToken,
    user,
    authStatus,
    isAuthenticated,
    isAuthResolved,
    setAccessToken,
    login,
    clearAuth,
    setAuthStatus,
    userInitial,
  };
});
