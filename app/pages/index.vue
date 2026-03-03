<template>
  <main class="home-page">
    <div class="home-page__container">
      <div class="home-page__alert" role="alert">
        <span class="home-page__alert-icon" aria-hidden="true">
          <WarningIcon />
        </span>
        <div class="home-page__alert-content">
          <p class="home-page__alert-title">Сервис находится на стадии разработки</p>
          <p class="home-page__alert-text">
            Некоторые функции могут работать нестабильно, а интерфейс — меняться.
          </p>
        </div>
      </div>
    </div>

    <HowItWorks />
  </main>
</template>

<script setup lang="ts">
import { HowItWorks } from '~/components';
import { WarningIcon } from '~/icons/toast';
</script>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as *;
@use '~/assets/styles/_mixins.scss' as *;

.home-page {
  padding: 16px 0 32px;
  background: $color-bg;
}

.home-page__container {
  @include container();
}

.home-page__alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: $radius-xl;
  border: 1px solid rgba($color-danger, 0.25);
  border-left: 4px solid $color-danger;
  background: $color-danger-soft;

  @media (min-width: $bp-lg) {
    padding: 16px 18px;
  }
}

.home-page__alert-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: rgba($color-danger, 0.16);
  color: $color-danger;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }
}

.home-page__alert-content {
  min-width: 0;
}

.home-page__alert-title {
  margin: 0 0 2px;
  font-weight: 800;
  color: $color-danger;
  font-size: 14px;
}

.home-page__alert-text {
  margin: 0;
  color: rgba($text-color-primary, 0.9);
  font-size: 13px;
  line-height: 1.35;
}
</style>
