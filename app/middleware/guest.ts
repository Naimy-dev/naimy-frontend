import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAuthStore } from '~/auth/stores';

export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return navigateTo('/');
  }
});
