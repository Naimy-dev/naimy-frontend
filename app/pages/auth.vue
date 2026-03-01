<template>
  <main class="auth-page">
    <div class="auth-page__layout">
      <AuthLeftPanel />

      <div class="auth-page__main">
        <AuthMobileHero class="auth-page__mobile-hero" />

        <div class="auth-page__main-inner">
          <AuthTabs v-model="activeTab" class="auth-page__tabs" />

          <section :aria-label="activeTab === AuthTab.LOGIN ? 'Вход' : 'Регистрация'">
            <AuthLoginForm
              v-if="activeTab === AuthTab.LOGIN"
              @request-register="activeTab = AuthTab.REGISTER"
            />
            <AuthRegisterForm v-else @request-login="activeTab = AuthTab.LOGIN" />
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { navigateTo, useRoute } from 'nuxt/app';
import { definePageMeta } from '#imports';
import { AuthTab } from '~/auth';
import {
  AuthLeftPanel,
  AuthTabs,
  AuthMobileHero,
  AuthLoginForm,
  AuthRegisterForm,
} from '~/auth/components';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

const route = useRoute();

const activeTab = computed<AuthTab>({
  get() {
    const tab = route.query.tab;
    return tab === AuthTab.REGISTER ? AuthTab.REGISTER : AuthTab.LOGIN;
  },
  set(tab) {
    navigateTo({
      path: '/auth',
      query: { ...route.query, tab },
    });
  },
});
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100dvh;
  background: $color-bg-muted;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;

  @media (min-width: $bp-lg) {
    padding: 28px 0;
    align-items: center;
  }

  .auth-page__layout {
    width: min(1100px, 100%);
    margin: 0 auto;
    display: grid;
    align-items: stretch;

    @media (min-width: $bp-lg) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
    }
  }
}

.auth-page__main {
  display: grid;
  width: 100%;

  @media (min-width: $bp-lg) {
    gap: 12px;
    box-sizing: border-box;
    padding: 64px;
    align-content: center;
  }
}

.auth-page__main-inner {
  padding: 24px 20px;

  @media (min-width: $bp-lg) {
    padding: 0;
  }
}

.auth-page__tabs {
  margin-bottom: 32px;
}
</style>
