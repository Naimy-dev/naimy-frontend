<template>
  <section class="auth-mobile-hero" aria-label="Добро пожаловать в Naimy">
    <div class="auth-mobile-hero__inner">
      <NuxtLink class="auth-mobile-hero__logo" to="/">Naimy</NuxtLink>

      <div class="auth-mobile-hero__headline">
        <div class="auth-mobile-hero__title">Добро пожаловать</div>
        <div class="auth-mobile-hero__subtitle">Входите или создавайте аккаунт за минуту</div>
      </div>

      <div class="auth-mobile-hero__stats" aria-label="Статистика платформы" aria-hidden="true">
        <div v-for="stat in authMobileHeroStats" :key="stat.value" class="auth-mobile-hero__stat">
          <div class="auth-mobile-hero__stat-value">{{ stat.value }}</div>
          <div class="auth-mobile-hero__stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="auth-mobile-hero__avatars">
        <span
          v-for="avatar in authMobileHeroAvatars"
          :key="avatar"
          class="auth-mobile-hero__avatar"
        >
          {{ avatar }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { authMobileHeroAvatars, authMobileHeroStats } from './AuthMobileHero.config';
</script>

<style scoped lang="scss">
@use 'AuthMobileHero';
</style>
