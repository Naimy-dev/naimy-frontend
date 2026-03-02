<template>
  <Teleport to="body">
    <div class="toast-provider" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast-list">
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-provider__item"
          :class="`toast-provider__item--${toast.type}`"
        >
          <div
            class="toast-provider__icon"
            :class="`toast-provider__icon--${toast.type}`"
            aria-hidden="true"
          >
            <component :is="getToastIcon(toast.type)" />
          </div>

          <div class="toast-provider__content">
            <h4 class="toast-provider__title">{{ toast.title }}</h4>
            <p v-if="toast.description" class="toast-provider__description">
              {{ toast.description }}
            </p>
          </div>

          <button
            class="toast-provider__close"
            type="button"
            aria-label="Закрыть уведомление"
            @click="toastStore.close(toast.id)"
          >
            <CloseIcon />
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CloseIcon } from '~/icons';
import { CheckIcon, ErrorIcon, InfoIcon, NeutralIcon, WarningIcon } from '~/icons/toast';
import { useToastStore } from '~/stores/toast';
import { ToastType } from '~/stores/toast/toastStore.enums';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

function getToastIcon(type: ToastType) {
  switch (type) {
    case ToastType.SUCCESS:
      return CheckIcon;
    case ToastType.INFO:
      return InfoIcon;
    case ToastType.WARNING:
      return WarningIcon;
    case ToastType.ERROR:
      return ErrorIcon;
    case ToastType.NEUTRAL:
      return NeutralIcon;
    default:
      return NeutralIcon;
  }
}
</script>

<style scoped lang="scss">
@use 'ToastProvider';
</style>
