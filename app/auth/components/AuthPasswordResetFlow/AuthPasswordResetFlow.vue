<template>
  <section class="auth-password-reset-flow" aria-label="Сброс пароля">
    <header v-if="step !== 2" class="auth-password-reset-flow__header">
      <h2 class="auth-password-reset-flow__title">{{ title }}</h2>
      <p class="auth-password-reset-flow__subtitle">{{ subtitle }}</p>
      <p v-if="step > 1" class="auth-password-reset-flow__phone">{{ formattedFlowPhone }}</p>
    </header>

    <form
      v-if="step === 1"
      class="auth-password-reset-flow__form"
      @submit.prevent="submitPhoneStep"
    >
      <AuthPhoneInput ref="phoneInputRef" v-model="normalizedPhone" />

      <button class="auth-password-reset-flow__submit" type="submit" :disabled="loading">
        Отправить код
      </button>
    </form>

    <AuthOtpStep
      v-else-if="step === 2"
      :phone="flowPhone"
      :loading="loading"
      :resend-loading="resendLoading"
      :initial-resend-seconds="initialResendSeconds"
      @submit="submitOtpStep"
      @resend="resendCode"
      @back="setStep(1)"
    />

    <form v-else class="auth-password-reset-flow__form" @submit.prevent="submitPasswordStep">
      <div class="auth-password-reset-flow__field">
        <label class="auth-password-reset-flow__label" for="auth-reset-password"
          >Новый пароль</label
        >

        <div class="auth-password-reset-flow__input-shell">
          <span class="auth-password-reset-flow__icon" aria-hidden="true">
            <LockIcon />
          </span>

          <input
            id="auth-reset-password"
            v-model="newPassword"
            class="auth-password-reset-flow__input"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Минимум 8 символов"
            @input="touchedPassword = false"
            @blur="touchedPassword = true"
          />

          <button
            class="auth-password-reset-flow__icon-button"
            type="button"
            :aria-label="passwordVisible ? 'Скрыть пароль' : 'Показать пароль'"
            @click="passwordVisible = !passwordVisible"
          >
            <EyeOffIcon v-if="passwordVisible" />
            <EyeIcon v-else />
          </button>
        </div>

        <p v-if="passwordError" class="auth-password-reset-flow__error" role="alert">
          {{ passwordError }}
        </p>
      </div>

      <div class="auth-password-reset-flow__field">
        <label class="auth-password-reset-flow__label" for="auth-reset-confirm-password">
          Подтверждение пароля
        </label>

        <div class="auth-password-reset-flow__input-shell">
          <span class="auth-password-reset-flow__icon" aria-hidden="true">
            <LockIcon />
          </span>

          <input
            id="auth-reset-confirm-password"
            v-model="confirmPassword"
            class="auth-password-reset-flow__input"
            :type="confirmPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Повторите пароль"
            @input="touchedConfirmPassword = false"
            @blur="touchedConfirmPassword = true"
          />

          <button
            class="auth-password-reset-flow__icon-button"
            type="button"
            :aria-label="confirmPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
            @click="confirmPasswordVisible = !confirmPasswordVisible"
          >
            <EyeOffIcon v-if="confirmPasswordVisible" />
            <EyeIcon v-else />
          </button>
        </div>

        <p v-if="confirmPasswordError" class="auth-password-reset-flow__error" role="alert">
          {{ confirmPasswordError }}
        </p>
      </div>

      <button class="auth-password-reset-flow__submit" type="submit" :disabled="loading">
        Сохранить новый пароль
      </button>
    </form>

    <div class="auth-password-reset-flow__footer">
      <button class="auth-password-reset-flow__back" type="button" @click="emit('close')">
        Вернуться ко входу
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { navigateTo } from 'nuxt/app';
import { EyeIcon, EyeOffIcon, LockIcon } from '~/auth/icons';
import { usePasswordReset } from '~/auth/composables';
import { getFormattedPhone } from '~/auth/utils';
import type { AuthPhoneInputRefType } from '~/auth/types';
import AuthOtpStep from '../AuthOtpStep';
import AuthPhoneInput from '../AuthPhoneInput';
import type { AuthPasswordResetFlowEmits } from './AuthPasswordResetFlow.types';
import { initialResendSeconds } from './AuthPasswordResetFlow.config';
import { AuthTab } from '~/auth/enums';

const emit = defineEmits<AuthPasswordResetFlowEmits>();

const phoneInputRef = ref<AuthPhoneInputRefType>(null);
const normalizedPhone = ref('');
const flowPhone = ref('');

const newPassword = ref('');
const confirmPassword = ref('');
const touchedPassword = ref(false);
const touchedConfirmPassword = ref(false);
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const {
  step,
  setStep,
  loading,
  resendLoading,
  resetStart,
  resetVerify,
  resetConfirm,
  resendResetOtp,
} = usePasswordReset();

const title = computed(() => {
  if (step.value === 1) {
    return 'Восстановление пароля';
  }

  return 'Создайте новый пароль';
});

const subtitle = computed(() => {
  if (step.value === 1) {
    return 'Укажите номер, на который зарегистрирован аккаунт';
  }

  return 'Пароль должен содержать не менее 8 символов';
});

const formattedFlowPhone = computed(() => getFormattedPhone(flowPhone.value));

const passwordError = computed(() => {
  if (!touchedPassword.value) {
    return '';
  }

  if (!newPassword.value) {
    return 'Введите новый пароль';
  }

  if (newPassword.value.length < 8) {
    return 'Пароль должен содержать минимум 8 символов';
  }

  return '';
});

const confirmPasswordError = computed(() => {
  if (!touchedConfirmPassword.value) {
    return '';
  }

  if (!confirmPassword.value) {
    return 'Подтвердите пароль';
  }

  if (confirmPassword.value !== newPassword.value) {
    return 'Пароли не совпадают';
  }

  return '';
});

async function submitPhoneStep() {
  if (!phoneInputRef.value?.validate()) {
    return;
  }

  await resetStart({ phone: normalizedPhone.value });
  flowPhone.value = normalizedPhone.value;
}

async function submitOtpStep(code: string) {
  await resetVerify({
    phone: flowPhone.value,
    code,
  });
}

async function resendCode() {
  await resendResetOtp({ phone: flowPhone.value });
}

async function submitPasswordStep() {
  touchedPassword.value = true;
  touchedConfirmPassword.value = true;

  if (passwordError.value || confirmPasswordError.value) {
    return;
  }

  await resetConfirm({
    phone: flowPhone.value,
    newPassword: newPassword.value,
  });

  emit('completed');
  await navigateTo(`/auth?tab=${AuthTab.LOGIN}`);
}
</script>

<style scoped lang="scss">
@use 'AuthPasswordResetFlow';
</style>
