<template>
  <section v-if="hasDescription || isOwner" class="user-profile-about">
    <h2 class="user-profile-about__title">О себе</h2>

    <p v-if="hasDescription" class="user-profile-about__text">
      {{ description }}
    </p>

    <div v-else>
      <p class="user-profile-about__empty-text">Расскажите о себе</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserProfileAboutProps } from './UserProfileAbout.types';

const props = defineProps<UserProfileAboutProps>();

const hasDescription = computed(() => !!props.description?.trim());
</script>

<style scoped lang="scss">
@use 'UserProfileAbout';
</style>
