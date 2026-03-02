<template>
  <div class="auth-register-form">
    <AuthOtpStep
      v-if="otpStepVisible"
      :phone="otpPhone"
      :loading="loading"
      :resend-loading="resendLoading"
      :error="otpError"
      :initial-resend-seconds="60"
      @submit="submitOtp"
      @resend="resendOtp"
      @back="closeOtpModal"
    />

    <form v-else class="auth-register-form__content" @submit.prevent="onSubmit">
      <header class="auth-register-form__header">
        <h2 class="auth-register-form__title">Создание аккаунта</h2>
        <p class="auth-register-form__subtitle">Заполните форму, чтобы продолжить</p>
      </header>

      <div class="auth-register-form__fields">
        <div class="auth-register-form__field">
          <label class="auth-register-form__label" :for="firstNameId">Имя</label>

          <div>
            <div class="auth-register-form__input-shell">
              <span class="auth-register-form__icon" aria-hidden="true">
                <UserIcon />
              </span>

              <input
                :id="firstNameId"
                v-model.trim="firstName"
                class="auth-register-form__input"
                type="text"
                autocomplete="given-name"
                placeholder="Введите имя"
                @input="onFieldInput(AuthRegisterFormField.FIRST_NAME)"
                @blur="touched.firstName = true"
              />
            </div>

            <div v-if="firstNameError" class="auth-register-form__error" role="alert">
              {{ firstNameError }}
            </div>
          </div>
        </div>

        <div class="auth-register-form__field">
          <label class="auth-register-form__label" :for="lastNameId">Фамилия</label>

          <div>
            <div class="auth-register-form__input-shell">
              <span class="auth-register-form__icon" aria-hidden="true">
                <UserIcon />
              </span>

              <input
                :id="lastNameId"
                v-model.trim="lastName"
                class="auth-register-form__input"
                type="text"
                autocomplete="family-name"
                placeholder="Введите фамилию"
                @input="onFieldInput(AuthRegisterFormField.LAST_NAME)"
                @blur="touched.lastName = true"
              />
            </div>

            <div v-if="lastNameError" class="auth-register-form__error" role="alert">
              {{ lastNameError }}
            </div>
          </div>
        </div>

        <AuthPhoneInput ref="phoneInputRef" v-model="normalizedPhone" />

        <div class="auth-register-form__field">
          <label class="auth-register-form__label" :for="passwordId">Пароль</label>

          <div>
            <div class="auth-register-form__input-shell">
              <span class="auth-register-form__icon" aria-hidden="true">
                <LockIcon />
              </span>

              <input
                :id="passwordId"
                v-model="password"
                class="auth-register-form__input"
                :type="passwordVisible ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Введите пароль"
                @input="onFieldInput(AuthRegisterFormField.PASSWORD)"
                @blur="touched.password = true"
              />

              <button
                class="auth-register-form__icon-button"
                type="button"
                :aria-label="passwordVisible ? 'Скрыть пароль' : 'Показать пароль'"
                @click="passwordVisible = !passwordVisible"
              >
                <EyeOffIcon v-if="passwordVisible" />
                <EyeIcon v-else />
              </button>
            </div>

            <p class="auth-register-form__hint">Минимум 8 символов</p>

            <div v-if="passwordError" class="auth-register-form__error" role="alert">
              {{ passwordError }}
            </div>
          </div>
        </div>
      </div>

      <div class="auth-register-form__checks">
        <label class="auth-register-form__checkbox">
          <input
            v-model="consentAccepted"
            class="auth-register-form__checkbox-input"
            type="checkbox"
            @change="touched.consent = false"
          />

          <span class="auth-register-form__checkbox-text">
            Я согласен с
            <NuxtLink class="auth-register-form__checkbox-link" to="/terms">
              условиями использования
            </NuxtLink>
            и
            <NuxtLink class="auth-register-form__checkbox-link" to="/privacy">
              политикой конфиденциальности
            </NuxtLink>
          </span>
        </label>

        <div v-if="consentError" class="auth-register-form__error" role="alert">
          {{ consentError }}
        </div>

        <label class="auth-register-form__checkbox">
          <input
            v-model="marketingAccepted"
            class="auth-register-form__checkbox-input"
            type="checkbox"
          />
          <span class="auth-register-form__checkbox-text">Получать новости и предложения</span>
        </label>
      </div>

      <button class="auth-register-form__submit" type="submit" :disabled="loading">
        Создать аккаунт
      </button>

      <div class="auth-register-form__footer">
        <span>Уже есть аккаунт?</span>
        <button class="auth-register-form__footer-link" type="button" @click="emit('requestLogin')">
          Войдите
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '~/auth/icons';
import { useRegister } from '~/auth/composables';
import type { AuthPhoneInputRefType } from '~/auth/types';
import AuthOtpStep from '../AuthOtpStep';
import AuthPhoneInput from '../AuthPhoneInput';
import type { AuthRegisterFormEmits } from './AuthRegisterForm.types';
import { AuthRegisterFormField } from './AuthRegisterForm.enums';

const emit = defineEmits<AuthRegisterFormEmits>();

const firstNameId = 'auth-register-first-name';
const lastNameId = 'auth-register-last-name';
const passwordId = 'auth-register-password';

const phoneInputRef = ref<AuthPhoneInputRefType>(null);
const normalizedPhone = ref('');

const firstName = ref('');
const lastName = ref('');
const password = ref('');
const consentAccepted = ref(false);
const marketingAccepted = ref(false);
const passwordVisible = ref(false);

const otpStepVisible = ref(false);
const otpPhone = ref('');
const otpError = ref('');

const touched = reactive({
  firstName: false,
  lastName: false,
  password: false,
  consent: false,
});

const { registerStart, registerConfirm, resendRegisterOtp, loading, resendLoading } = useRegister();

const firstNameError = computed(() => {
  if (!touched.firstName) {
    return '';
  }

  if (!firstName.value) {
    return 'Введите имя';
  }

  return '';
});

const lastNameError = computed(() => {
  if (!touched.lastName) {
    return '';
  }

  if (!lastName.value) {
    return 'Введите фамилию';
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

  if (password.value.length < 8) {
    return 'Пароль должен содержать минимум 8 символов';
  }

  return '';
});

const consentError = computed(() => {
  if (!touched.consent) {
    return '';
  }

  if (!consentAccepted.value) {
    return 'Необходимо согласие с условиями и политикой конфиденциальности';
  }

  return '';
});

function onFieldInput(field: AuthRegisterFormField) {
  touched[field] = false;
}

async function onSubmit() {
  if (!phoneInputRef.value) {
    return;
  }

  const phoneValid = phoneInputRef.value.validate();
  touched.firstName = true;
  touched.lastName = true;
  touched.password = true;
  touched.consent = true;

  if (
    !phoneValid ||
    firstNameError.value ||
    lastNameError.value ||
    passwordError.value ||
    consentError.value
  ) {
    return;
  }

  try {
    await registerStart({
      phone: normalizedPhone.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
    });

    otpPhone.value = normalizedPhone.value;
    otpError.value = '';
    otpStepVisible.value = true;
    emit('registerStarted', normalizedPhone.value);
  } catch (error) {
    // TODO: интегрировать toast-слой проекта.
    console.error(error);
    return;
  }
}

async function submitOtp(code: string) {
  otpError.value = '';

  try {
    await registerConfirm({
      phone: otpPhone.value,
      code,
    });
  } catch (error) {
    otpError.value = error instanceof Error ? error.message : 'Ошибка подтверждения кода';
  }
}

async function resendOtp() {
  otpError.value = '';

  try {
    await resendRegisterOtp({
      phone: otpPhone.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
    });
  } catch (error) {
    otpError.value = error instanceof Error ? error.message : 'Не удалось отправить код повторно';
  }
}

function closeOtpModal() {
  otpStepVisible.value = false;
  otpError.value = '';
}
</script>

<style scoped lang="scss">
@use 'AuthRegisterForm';
</style>
