import { useNuxtApp, useFetch } from 'nuxt/app';
import type { UseFetchOptions } from 'nuxt/app';

// source: https://nuxt.com/docs/4.x/guide/recipes/custom-usefetch#custom-usefetchuseasyncdata
export function useAPI<T>(url: string | (() => string), options?: UseFetchOptions<T>) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  });
}
