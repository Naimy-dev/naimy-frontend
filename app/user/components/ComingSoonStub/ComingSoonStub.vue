<template>
  <section class="coming-soon-stub">
    <div class="coming-soon-stub__illustration" aria-hidden="true">
      <span class="coming-soon-stub__spark">✦</span>
    </div>

    <h2 class="coming-soon-stub__title">{{ label }}</h2>
    <p class="coming-soon-stub__text">Раздел в разработке</p>
    <p class="coming-soon-stub__hint">Скоро здесь появятся {{ normalizedLabel }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComingSoonStubProps } from './ComingSoonStub.types';

const props = defineProps<ComingSoonStubProps>();

const normalizedLabel = computed(() => props.label.trim().toLowerCase());
</script>

<style scoped lang="scss">
@use 'ComingSoonStub';
</style>
