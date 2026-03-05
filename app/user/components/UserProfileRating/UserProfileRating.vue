<template>
  <section v-if="props.rating" class="user-profile-rating">
    <h2 class="user-profile-rating__title">Рейтинг</h2>

    <div class="user-profile-rating__list">
      <article
        v-for="item in ratingItems"
        :key="item.key"
        class="user-profile-rating__item"
        :class="`user-profile-rating__item--${item.key}`"
      >
        <div class="user-profile-rating__head">
          <span>{{ item.label }}</span>
          <span class="user-profile-rating__value">
            <span class="user-profile-rating__stars" aria-hidden="true">
              <component
                :is="index <= getFilledStars(item.value) ? StarIcon : EmptyStarIcon"
                v-for="index in 5"
                :key="`${item.key}-${index}`"
              />
            </span>
            {{ formatValue(item.value) }}
          </span>
        </div>

        <div class="user-profile-rating__track" role="presentation">
          <div class="user-profile-rating__fill" :style="{ width: `${toPercent(item.value)}%` }" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StarIcon, EmptyStarIcon } from '~/icons';
import type { RatingValue, UserProfileRatingProps } from './UserProfileRating.types';

const props = defineProps<UserProfileRatingProps>();

const ratingItems = computed(() => [
  { key: 'overall', label: 'Общий', value: props.rating },
  { key: 'politeness', label: 'Вежливость', value: props.politenessRating },
  { key: 'timeliness', label: 'Скорость', value: props.timelinessRating },
  { key: 'quality', label: 'Качество', value: props.qualityRating },
]);

function toPercent(value: RatingValue) {
  if (value === null) {
    return 0;
  }

  const normalized = Math.max(0, Math.min(5, value));
  return Math.round((normalized / 5) * 100);
}

function formatValue(value: RatingValue) {
  if (value === null) {
    return '—';
  }

  return value.toFixed(1);
}

function getFilledStars(value: RatingValue) {
  if (value === null) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(value)));
}
</script>

<style scoped lang="scss">
@use 'UserProfileRating';
</style>
