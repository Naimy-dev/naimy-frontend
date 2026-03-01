import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserDto } from '#shared/types';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<UserDto | null>(null);

  const isAuthenticated = computed(() => accessToken.value !== null);

  const userInitial = computed(() => {
    if (!user.value) {
      return '';
    }

    const { firstName, lastName } = user.value;
    return `${firstName.slice(0, 1).toUpperCase()} ${lastName.slice(0, 1).toUpperCase()}`;
  });

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  function login(token: string, u: UserDto) {
    accessToken.value = token;
    user.value = u;
  }

  function clearAuth() {
    accessToken.value = null;
    user.value = null;
  }

  return { accessToken, user, isAuthenticated, setAccessToken, login, clearAuth, userInitial };
});
