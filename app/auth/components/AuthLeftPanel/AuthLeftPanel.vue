<template>
  <aside class="auth-left-panel" aria-label="О сервисе Naimy">
    <NuxtLink class="auth-left-panel__logo" to="/">Naimy</NuxtLink>

    <div class="auth-left-panel__headline">
      <h1 class="auth-left-panel__title">Добро пожаловать в мир возможностей</h1>
      <p class="auth-left-panel__subtitle">
        Ищите исполнителей, публикуйте задания и находите клиентов — быстро, удобно и безопасно.
      </p>
    </div>

    <div class="auth-left-panel__stats" aria-label="Статистика платформы">
      <div v-for="stat in authLeftPanelStats" :key="stat.value" class="auth-left-panel__stat">
        <div class="auth-left-panel__stat-value">{{ stat.value }}</div>
        <div class="auth-left-panel__stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="auth-left-panel__community" aria-label="Сообщество пользователей">
      <div class="auth-left-panel__avatars" aria-hidden="true">
        <span v-for="avatar in authLeftPanelAvatars" :key="avatar" class="auth-left-panel__avatar">
          {{ avatar }}
        </span>
      </div>
      <div class="auth-left-panel__community-text">
        Присоединяйтесь к тысячам специалистов и клиентов
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { authLeftPanelStats, authLeftPanelAvatars } from './AuthLeftPanel.config';
</script>

<style scoped lang="scss">
@use 'AuthLeftPanel';
</style>
