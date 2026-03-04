import { computed } from 'vue';
import { useAPI } from '~/composables/useApi';
import type { UserMyProfile } from '~/user/types';

export function useMyProfile() {
  const {
    data: profile,
    pending,
    error,
    refresh,
  } = useAPI<UserMyProfile>('/users/me', {
    key: computed(() => 'user-my-profile'),
  });

  return {
    profile,
    pending,
    error,
    refresh,
  };
}
