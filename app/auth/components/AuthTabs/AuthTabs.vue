<template>
  <div class="auth-tabs" role="tablist" aria-label="Авторизация">
    <button
      v-for="tab in authTabs"
      :key="tab.id"
      class="auth-tabs__tab"
      type="button"
      role="tab"
      :aria-selected="model === tab.id"
      :tabindex="model === tab.id ? 0 : -1"
      @click="model = tab.id"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { AuthTab } from '~/auth';
import { authTabs } from './AuthTabs.config';

const model = defineModel<AuthTab>();
</script>

<style scoped lang="scss">
@use 'AuthTabs';
</style>
