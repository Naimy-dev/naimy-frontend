<template>
  <section class="auth-otp-step" aria-label="Подтверждение телефона">
    <header class="auth-otp-step__header">
      <h2 class="auth-otp-step__title">Введите код из SMS</h2>
      <p class="auth-otp-step__subtitle">Мы отправили код подтверждения на номер</p>
      <p class="auth-otp-step__phone">{{ formattedPhone }}</p>
    </header>

    <form class="auth-otp-step__form" @submit.prevent="submit">
      <label class="auth-otp-step__label" for="auth-otp-input-0">Введите 6-значный код</label>

      <div class="auth-otp-step__inputs" @paste="handlePaste">
        <input
          v-for="(_, index) in otpLength"
          :id="`auth-otp-input-${index}`"
          :key="index"
          :ref="(element) => setInputRef(element, index)"
          v-model="digits[index]"
          class="auth-otp-step__input"
          type="text"
          inputmode="numeric"
          maxlength="1"
          :aria-label="`Цифра ${index + 1}`"
          @input="handleDigitInput(index, $event)"
          @keydown="handleDigitKeydown(index, $event)"
          @focus="handleDigitFocus($event)"
        />
      </div>

      <p v-if="displayError" class="auth-otp-step__error" role="alert">
        {{ displayError }}
      </p>

      <button class="auth-otp-step__submit" type="submit" :disabled="loading">Подтвердить</button>
    </form>

    <div class="auth-otp-step__resend">
      <p class="auth-otp-step__resend-label">Не получили код?</p>

      <button
        class="auth-otp-step__resend-button"
        type="button"
        :disabled="!canResend || resendLoading"
        @click="onResend"
      >
        Отправить повторно
      </button>

      <p v-if="remainingSeconds > 0" class="auth-otp-step__timer">
        Повторная отправка через {{ remainingSeconds }} сек
      </p>
    </div>

    <div class="auth-otp-step__footer">
      <button class="auth-otp-step__back" type="button" @click="emit('back')">Назад</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { getFormattedPhone } from '~/auth/utils';
import type { AuthOtpStepEmits, AuthOtpStepProps } from './AuthOtpStep.types';
import { otpLength } from './AuthOtpStep.config';

const props = defineProps<AuthOtpStepProps>();
const emit = defineEmits<AuthOtpStepEmits>();

const digits = ref<string[]>(new Array(otpLength).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);
const validationError = ref('');
const remainingSeconds = ref(props.initialResendSeconds);
const timerId = ref<ReturnType<typeof setInterval> | null>(null);

const code = computed(() => digits.value.join(''));
const canResend = computed(() => remainingSeconds.value === 0);
const displayError = computed(() => props.error || validationError.value);
const formattedPhone = computed(() => getFormattedPhone(props.phone));

watch(code, () => {
  validationError.value = '';
});

onMounted(() => {
  startTimer();
  focusInput(0);
});

onBeforeUnmount(() => {
  stopTimer();
});

function setInputRef(element: Element | ComponentPublicInstance | null, index: number) {
  if (!(element instanceof HTMLInputElement)) {
    return;
  }

  inputRefs.value[index] = element;
}

function focusInput(index: number) {
  const target = inputRefs.value[index];

  if (!target) {
    return;
  }

  target.focus();
  target.select();
}

function handleDigitInput(index: number, event: Event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const onlyDigits = target.value.replace(/\D/g, '').slice(0, 1);
  digits.value[index] = onlyDigits;
  target.value = onlyDigits;

  if (onlyDigits && index < otpLength - 1) {
    focusInput(index + 1);
  }
}

function handleDigitKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    focusInput(index - 1);
    return;
  }

  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    focusInput(index - 1);
    return;
  }

  if (event.key === 'ArrowRight' && index < otpLength - 1) {
    event.preventDefault();
    focusInput(index + 1);
  }
}

function handleDigitFocus(event: FocusEvent) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  target.select();
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();

  const pastedValue = event.clipboardData?.getData('text') ?? '';
  const digitsOnly = pastedValue.replace(/\D/g, '').slice(0, otpLength);

  if (!digitsOnly) {
    return;
  }

  clearDigits();

  digitsOnly.split('').forEach((digit, index) => {
    digits.value[index] = digit;
  });

  const focusIndex = Math.min(digitsOnly.length, otpLength) - 1;
  focusInput(focusIndex);
}

function submit() {
  if (code.value.length !== otpLength) {
    validationError.value = 'Пожалуйста, введите все 6 цифр';
    focusInput(0);
    return;
  }

  emit('submit', code.value);
}

function onResend() {
  if (!canResend.value || props.resendLoading) {
    return;
  }

  clearDigits();
  validationError.value = '';
  emit('resend');
  startTimer();
  focusInput(0);
}

function clearDigits() {
  digits.value = new Array(otpLength).fill('');
}

function startTimer() {
  stopTimer();
  remainingSeconds.value = props.initialResendSeconds;

  if (remainingSeconds.value <= 0) {
    return;
  }

  timerId.value = setInterval(() => {
    if (remainingSeconds.value <= 1) {
      stopTimer();
      remainingSeconds.value = 0;
      return;
    }

    remainingSeconds.value -= 1;
  }, 1000);
}

function stopTimer() {
  if (!timerId.value) {
    return;
  }

  clearInterval(timerId.value);
  timerId.value = null;
}
</script>

<style scoped lang="scss">
@use 'AuthOtpStep';
</style>
