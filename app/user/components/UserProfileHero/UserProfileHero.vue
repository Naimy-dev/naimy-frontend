<template>
  <section class="user-profile-hero">
    <div class="user-profile-hero__banner" />

    <div class="user-profile-hero__content">
      <div class="user-profile-hero__avatar" aria-hidden="true">
        <img v-if="profile.photoUrl" :src="profile.photoUrl" alt="" />
        <span v-else>{{ avatarInitial }}</span>
      </div>

      <div class="user-profile-hero__main">
        <div class="user-profile-hero__title-row">
          <h1 class="user-profile-hero__name">{{ fullName }}</h1>
          <span v-if="profile.isVerified" class="user-profile-hero__verified">Верифицирован</span>
        </div>

        <div class="user-profile-hero__rating">
          <span v-if="stars.length" class="user-profile-hero__stars" aria-hidden="true">
            <span v-for="star in stars" :key="star"><StarIcon /></span>
          </span>
          <span class="user-profile-hero__rating-value">{{ ratingLabel }}</span>
        </div>
      </div>

      <div class="user-profile-hero__actions">
        <NuxtLink v-if="isOwner" class="user-profile-hero__primary-btn" to="/profile/edit">
          <EditPenIcon /> Редактировать профиль
        </NuxtLink>

        <button
          v-else
          class="user-profile-hero__primary-btn"
          type="button"
          disabled
          aria-label="Написать"
        >
          <EnvelopIcon /> Написать
        </button>

        <button
          class="user-profile-hero__share-btn"
          type="button"
          aria-label="Поделиться"
          @click="share"
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToast } from '~/composables';
import type { UserProfileHeroProps } from './UserProfileHero.types';
import { getInitials } from '#shared/utils';
import { EditPenIcon, EnvelopIcon, ShareIcon, StarIcon } from '~/icons';

const props = defineProps<UserProfileHeroProps>();

const toast = useToast();

const fullName = computed(() => `${props.profile.firstName} ${props.profile.lastName}`.trim());

const avatarInitial = computed(() => {
  const { firstName, lastName } = props.profile;
  return getInitials(firstName, lastName);
});

const ratingLabel = computed(() => {
  const rating = props.profile.rating;

  if (rating === null) {
    return 'Нет оценок';
  }

  return rating.toFixed(1);
});

const stars = computed(() => {
  const raw = props.profile.rating ?? 0;
  const value = Math.max(0, Math.min(5, Math.round(raw)));
  return Array.from({ length: value }, (_, index) => index + 1);
});

async function share() {
  if (!import.meta.client) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const url = props.isOwner ? `${currentUrl.origin}/users/${props.profile.id}` : currentUrl.href;

  if (navigator.share) {
    try {
      await navigator.share({ title: fullName.value, url });
      return;
    } catch {
      toast.error({
        title: 'Не удалось поделиться профилем пользователя',
      });
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success({
      title: 'Ссылка скопирована',
    });
  } catch {
    toast.error({
      title: 'Не удалось скопировать ссылку',
    });
  }
}
</script>

<style scoped lang="scss">
@use 'UserProfileHero';
</style>
