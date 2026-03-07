<template>
  <main class="profile-page">
    <div class="profile-page__container">
      <div v-if="pending" class="profile-page__state">Загружаем профиль...</div>

      <div v-else-if="error" class="profile-page__state profile-page__state--error">
        Не удалось загрузить профиль
      </div>

      <div v-else-if="profile">
        <section class="profile-page__hero">
          <UserProfileHero :profile="profile" :is-owner="false" />
        </section>

        <div class="profile-page__layout">
          <section class="profile-page__main">
            <UserProfileAbout :description="profile.description" :is-owner="false" />
            <UserProfileOffers />
            <UserProfileReviews />
          </section>

          <section class="profile-page__sidebar">
            <UserProfileContacts
              :is-owner="false"
              :phone="profile.phone"
              :contacts="profile.contacts"
            />
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { navigateTo, useRoute } from 'nuxt/app';
import { useSeoMeta } from '#imports';
import { useAuthStore } from '~/auth';
import { useUserProfile } from '~/user/composables';
import {
  UserProfileAbout,
  UserProfileContacts,
  UserProfileHero,
  UserProfileOffers,
  UserProfileReviews,
} from '~/user/components';

const route = useRoute();
const authStore = useAuthStore();

const userId = computed(() => String(route.params.id ?? ''));
const routeUserId = computed(() => Number(userId.value));

const { profile, pending, error } = useUserProfile(userId);

watchEffect(() => {
  if (!authStore.user || Number.isNaN(routeUserId.value)) {
    return;
  }

  if (authStore.user.id === routeUserId.value) {
    navigateTo('/profile', { replace: true });
  }
});

const seoTitle = computed(() => {
  if (!profile.value) {
    return 'Профиль пользователя | Naimy';
  }

  const fullName = `${profile.value.firstName} ${profile.value.lastName}`.trim();
  return fullName ? `${fullName} | Naimy` : 'Профиль пользователя | Naimy';
});

const seoDescription = computed(() => {
  const description = profile.value?.description?.trim();
  if (description) {
    return description;
  }

  return 'Профиль пользователя Naimy.';
});

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
});
</script>

<style scoped lang="scss">
@use '../profile/index';
</style>
