import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserMyProfile } from '~/user/types';

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserMyProfile | null>(null);

  const fullName = computed(() => {
    if (!profile.value) {
      return '';
    }

    return `${profile.value.firstName} ${profile.value.lastName}`.trim();
  });

  function setProfile(value: UserMyProfile) {
    profile.value = value;
  }

  function clearProfile() {
    profile.value = null;
  }

  function isOwner(userId: number) {
    if (!profile.value) {
      return false;
    }

    return profile.value.id === userId;
  }

  return {
    profile,
    fullName,
    setProfile,
    clearProfile,
    isOwner,
  };
});
