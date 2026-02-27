<template>
  <form class="auth-login-form" @submit.prevent="onSubmit">
    <header class="auth-login-form__header">
      <h2 class="auth-login-form__title">С возвращением!</h2>
      <p class="auth-login-form__subtitle">Войдите в свой аккаунт, чтобы продолжить</p>
    </header>

    <div class="auth-login-form__fields">
      <div class="auth-login-form__field">
        <label class="auth-login-form__label" :for="phoneId">Номер телефона</label>

        <div>
          <div class="auth-login-form__input-shell">
            <span class="auth-login-form__icon" aria-hidden="true">
              <UserIcon />
            </span>

            <input
              :id="phoneId"
              v-model="maskedPhone"
              v-maska:phone.unmasked="phoneMask"
              class="auth-login-form__input"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="+375 (XX) XXX-XX-XX"
              @input="touched.phone = false"
              @blur="touched.phone = true"
            />
          </div>

          <div v-if="phoneError" class="auth-login-form__error" role="alert">
            {{ phoneError }}
          </div>
        </div>
      </div>

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

    <div v-if="forgotPasswordStubVisible" role="status">Сброс пароля будет доступен позже.</div>

    <button class="auth-login-form__submit" type="submit">Войти в аккаунт</button>

    <div class="auth-login-form__footer">
      <span>Нет аккаунта?</span>
      <button class="auth-login-form__footer-link" type="button" @click="emit('requestRegister')">
        Зарегистрируйтесь
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { vMaska } from 'maska/vue';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '~/auth/icons';
import type { AuthLoginFormEmits } from './AuthLoginForm.types';

const emit = defineEmits<AuthLoginFormEmits>();

const phoneId = 'auth-login-phone';
const passwordId = 'auth-login-password';
const phoneMask = '+375 (##) ###-##-##';

const maskedPhone = ref('');
const phone = ref('');
const password = ref('');
const forgotPasswordStubVisible = ref(false);
const passwordVisible = ref(false);

const touched = reactive({
  phone: false,
  password: false,
});

const normalizedPhone = computed(() => {
  if (!phone.value) {
    return '';
  }

  return `+375${phone.value}`;
});

const phoneError = computed(() => {
  if (!touched.phone) {
    return '';
  }

  if (!phone.value) {
    return 'Введите номер телефона';
  }

  if (phone.value.length !== 9) {
    return 'Номер должен содержать 9 цифр после +375';
  }

  return '';
});

const passwordError = computed(() => {
  if (!touched.password) {
    return '';
  }

  if (!password.value) {
    return 'Введите пароль';
  }

  return '';
});

function onSubmit() {
  touched.phone = true;
  touched.password = true;

  if (phoneError.value || passwordError.value) {
    return;
  }

  console.log(normalizedPhone.value);
  console.log(password.value);
  // TODO api call
}

function onForgotPassword() {
  forgotPasswordStubVisible.value = true;
}

defineExpose({ phone });
</script>

<style scoped lang="scss">
@use 'AuthLoginForm';
</style>
