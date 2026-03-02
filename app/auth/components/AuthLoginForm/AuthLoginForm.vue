<template>
  <div class="auth-login-form">
    <AuthPasswordResetFlow
      v-if="isResetFlowVisible"
      @close="isResetFlowVisible = false"
      @completed="completeReset"
    />

    <form v-else class="auth-login-form__content" @submit.prevent="onSubmit">
      <header class="auth-login-form__header">
        <h2 class="auth-login-form__title">С возвращением!</h2>
        <p class="auth-login-form__subtitle">Войдите в свой аккаунт, чтобы продолжить</p>
      </header>

      <p v-if="resetSuccessMessage" class="auth-login-form__success" role="status">
        {{ resetSuccessMessage }}
      </p>

      <div class="auth-login-form__fields">
        <AuthPhoneInput ref="phoneInputRef" v-model="normalizedPhone" />

        <div class="auth-login-form__field">
          <label class="auth-login-form__label" :for="passwordId">Пароль</label>

          <div>
            <div class="auth-login-form__input-shell">
              <span class="auth-login-form__icon" aria-hidden="true">
                <LockIcon />
              </span>

              <input
                :id="passwordId"
                v-model="password"
                class="auth-login-form__input"
                :type="passwordVisible ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Введите пароль"
                @input="touched.password = false"
                @blur="touched.password = true"
              />

              <button
                class="auth-login-form__icon-button"
                type="button"
                :aria-label="passwordVisible ? 'Скрыть пароль' : 'Показать пароль'"
                @click="passwordVisible = !passwordVisible"
              >
                <EyeOffIcon v-if="passwordVisible" />
                <EyeIcon v-else />
              </button>
            </div>

            <div v-if="passwordError" class="auth-login-form__error" role="alert">
              {{ passwordError }}
            </div>
          </div>
        </div>
      </div>

      <div class="auth-login-form__row">
        <button class="auth-login-form__link" type="button" @click="onForgotPassword">
          Забыли пароль?
        </button>
      </div>

      <button class="auth-login-form__submit" type="submit" :disabled="loading">
        Войти в аккаунт
      </button>

      <div class="auth-login-form__footer">
        <span>Нет аккаунта?</span>
        <button class="auth-login-form__footer-link" type="button" @click="emit('requestRegister')">
          Зарегистрируйтесь
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EyeIcon, EyeOffIcon, LockIcon } from '~/auth/icons';
import { useLogin } from '~/auth/composables';
import type { AuthPhoneInputRefType } from '~/auth/types';
import AuthPasswordResetFlow from '../AuthPasswordResetFlow';
import AuthPhoneInput from '../AuthPhoneInput';
import type { AuthLoginFormEmits } from './AuthLoginForm.types';

const emit = defineEmits<AuthLoginFormEmits>();

const passwordId = 'auth-login-password';

const phoneInputRef = ref<AuthPhoneInputRefType>(null);
const normalizedPhone = ref('');
const password = ref('');
const isResetFlowVisible = ref(false);
const resetSuccessMessage = ref('');
const passwordVisible = ref(false);

const touched = reactive({
  password: false,
});

const { loading, login } = useLogin();

const passwordError = computed(() => {
  if (!touched.password) {
    return '';
  }

  if (!password.value) {
    return 'Введите пароль';
  }

  return '';
});

async function onSubmit() {
  if (!phoneInputRef.value) {
    return;
  }

  const phoneValid = phoneInputRef.value.validate();
  touched.password = true;

  if (!phoneValid || passwordError.value) {
    return;
  }

  await login({ phone: normalizedPhone.value, password: password.value });
}

function onForgotPassword() {
  isResetFlowVisible.value = true;
  resetSuccessMessage.value = '';
}

function completeReset() {
  isResetFlowVisible.value = false;
  resetSuccessMessage.value = 'Пароль успешно обновлён. Теперь войдите с новым паролем.';
}

defineExpose({ normalizedPhone });
</script>

<style scoped lang="scss">
@use 'AuthLoginForm';
</style>
