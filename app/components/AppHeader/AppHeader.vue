<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="app-header__mobile-left">
        <button
          class="app-header__icon-btn"
          type="button"
          aria-label="Открыть меню"
          @click="toggleMenu"
        >
          <BurgerIcon />
        </button>
      </div>

      <NuxtLink class="app-header__logo app-header__mobile-center" to="/">Naimy</NuxtLink>

      <div class="app-header__mobile-right">
        <button
          v-if="isAuthenticated"
          class="app-header__avatar-btn app-header__mobile-right"
          type="button"
          aria-label="Профиль"
        >
          <span class="app-header__avatar">
            <img v-if="user?.photoUrl" :src="user.photoUrl" alt="" />
            <span v-else aria-hidden="true">{{ userInitial }}</span>
          </span>
        </button>
      </div>
    </div>

    <div class="app-header__desktop">
      <div class="app-header__desktop-inner">
        <div class="app-header__desktop-left">
          <NuxtLink class="app-header__logo" to="/">Naimy</NuxtLink>

          <nav class="app-header__nav" aria-label="Основная навигация">
            <!-- <NuxtLink class="app-header__nav-link" to="/tasks">Задания</NuxtLink> -->
            <!-- <NuxtLink class="app-header__nav-link" to="/ads">Объявления</NuxtLink> -->
            <!-- <NuxtLink class="app-header__nav-link" to="/categories">Категории</NuxtLink> -->
            <!-- <NuxtLink class="app-header__nav-link" to="/how-it-works">Как это работает</NuxtLink> -->
          </nav>
        </div>

        <div v-if="isAuthenticated" class="app-header__desktop-right">
          <!-- <button class="app-header__icon-btn" type="button" aria-label="Уведомления">
            <BellIcon />
          </button> -->
          <!-- <button class="app-header__icon-btn" type="button" aria-label="Избранное">
            <HeartIcon />
          </button> -->
          <!-- <button class="app-header__icon-btn" type="button" aria-label="Сообщения">
            <MessageIcon />
          </button> -->

          <!-- <div class="app-header__divider" aria-hidden="true" /> -->

          <button class="app-header__profile" type="button" aria-label="Профиль">
            <span class="app-header__avatar">
              <img v-if="user?.photoUrl" :src="user.photoUrl" alt="" />
              <span v-else aria-hidden="true">{{ userInitial }}</span>
            </span>
            <span class="app-header__profile-name">{{ userShortName }}</span>
          </button>
        </div>

        <NuxtLink
          v-else-if="isAuthResolved"
          class="app-header__btn app-header__btn--login"
          :to="`/auth?tab=${AuthTab.LOGIN}`"
          >Войти</NuxtLink
        >
      </div>
    </div>
  </header>

  <AppMobileMenu v-model="menuOpen" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { AuthTab, useAuthStore } from '~/auth';
import { BellIcon, BurgerIcon, HeartIcon, MessageIcon } from '~/icons';
import AppMobileMenu from '~/components/AppMobileMenu';

const { isAuthenticated, isAuthResolved, user, userInitial } = storeToRefs(useAuthStore());

const menuOpen = ref(false);

const userShortName = computed(() => {
  if (!user.value) {
    return '';
  }

  return user.value.firstName;
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<style scoped lang="scss">
@use 'AppHeader';
</style>
