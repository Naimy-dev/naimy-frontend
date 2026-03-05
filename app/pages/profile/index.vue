<template>
  <main class="profile-page">
    <div class="profile-page__container">
      <div v-if="pending" class="profile-page__state">Загружаем профиль...</div>

      <div v-else-if="error" class="profile-page__state profile-page__state--error">
        Не удалось загрузить профиль
      </div>

      <div v-else-if="profile">
        <section class="profile-page__hero">
          <UserProfileHero :profile="profile" :is-owner="true" />
        </section>

        <div class="profile-page__layout">
          <section class="profile-page__main">
            <UserProfileAbout :description="profile.description" :is-owner="true" />
            <UserProfileRating
              :rating="profile.rating"
              :quality-rating="profile.qualityRating"
              :politeness-rating="profile.politenessRating"
              :timeliness-rating="profile.timelinessRating"
            />
            <UserProfileTasks />
            <UserProfileOffers />
            <UserProfileReviews />
          </section>

          <section class="profile-page__sidebar">
            <UserProfileContacts
              :is-owner="true"
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
import { computed, watch } from 'vue';
import { useSeoMeta } from '#imports';
import { useMyProfile } from '~/user/composables';
import { useUserStore } from '~/user/stores';
import {
  UserProfileAbout,
  UserProfileContacts,
  UserProfileHero,
  UserProfileOffers,
  UserProfileRating,
  UserProfileReviews,
  UserProfileTasks,
} from '~/user/components';

const { profile, pending, error } = useMyProfile();
const userStore = useUserStore();

const seoTitle = computed(() => {
  if (!profile.value) {
    return 'Мой профиль | Naimy';
  }

  const fullName = `${profile.value.firstName} ${profile.value.lastName}`.trim();
  return fullName ? `${fullName} | Naimy` : 'Мой профиль | Naimy';
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

watch(
  profile,
  (value) => {
    if (!value) {
      return;
    }

    userStore.setProfile(value);
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@use 'index';
</style>
