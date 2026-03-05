import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { useAPI } from '~/composables/useApi';
import type { UserPublicProfile } from '~/user/types';

export function useUserProfile(userId: MaybeRefOrGetter<number | string>) {
  const endpoint = computed(() => `/users/${toValue(userId)}`);

  const {
    data: profile,
    pending,
    error,
    refresh,
  } = useAPI<UserPublicProfile>(endpoint.value, {
    key: computed(() => `user-profile-${toValue(userId)}`),
  });

  return {
    profile,
    pending,
    error,
    refresh,
  };
}
