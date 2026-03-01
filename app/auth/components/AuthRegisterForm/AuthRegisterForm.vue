<template>
  <form class="auth-register-form" @submit.prevent="onSubmit">
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

      <div class="auth-register-form__field">
        <label class="auth-register-form__label" :for="phoneId">Номер телефона</label>

        <div>
          <div class="auth-register-form__input-shell">
            <span class="auth-register-form__icon" aria-hidden="true">
              <UserIcon />
            </span>

            <input
              :id="phoneId"
              v-model="maskedPhone"
              v-maska="phoneMask"
              class="auth-register-form__input"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="+375 (XX) XXX-XX-XX"
              @input="onFieldInput(AuthRegisterFormField.PHONE)"
              @blur="touched.phone = true"
            />
          </div>

          <div v-if="phoneError" class="auth-register-form__error" role="alert">
            {{ phoneError }}
          </div>
        </div>
      </div>

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

    <div v-if="successMessage" class="auth-register-form__success" role="status">
      {{ successMessage }}
    </div>

    <button class="auth-register-form__submit" type="submit" :disabled="loading">
      {{ loading ? 'Отправка...' : 'Создать аккаунт' }}
    </button>

    <div class="auth-register-form__footer">
      <span>Уже есть аккаунт?</span>
      <button class="auth-register-form__footer-link" type="button" @click="emit('requestLogin')">
        Войдите
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { vMaska } from 'maska/vue';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '~/auth/icons';
import { useRegister } from '~/auth/composables';
import type { AuthRegisterFormEmits } from './AuthRegisterForm.types';
import { AuthRegisterFormField } from './AuthRegisterForm.enums';

const emit = defineEmits<AuthRegisterFormEmits>();

const firstNameId = 'auth-register-first-name';
const lastNameId = 'auth-register-last-name';
const phoneId = 'auth-register-phone';
const passwordId = 'auth-register-password';
const phoneMask = '+375 (##) ###-##-##';

const firstName = ref('');
const lastName = ref('');
const maskedPhone = ref('');
const password = ref('');
const consentAccepted = ref(false);
const marketingAccepted = ref(false);
const passwordVisible = ref(false);
const successMessage = ref('');

const touched = reactive({
  firstName: false,
  lastName: false,
  phone: false,
  password: false,
  consent: false,
});

const { registerStart, loading } = useRegister();

const phoneDigits = computed(() => maskedPhone.value.replace(/\D/g, ''));

const localPhone = computed(() => {
  if (!phoneDigits.value) {
    return '';
  }

  if (phoneDigits.value.startsWith('375')) {
    return phoneDigits.value.slice(3);
  }

  return phoneDigits.value;
});

const normalizedPhone = computed(() => {
  if (!localPhone.value) {
    return '';
  }

  return `+375${localPhone.value}`;
});

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

const phoneError = computed(() => {
  if (!touched.phone) {
    return '';
  }

  if (!localPhone.value) {
    return 'Введите номер телефона';
  }

  if (localPhone.value.length !== 9) {
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
  touched.firstName = true;
  touched.lastName = true;
  touched.phone = true;
  touched.password = true;
  touched.consent = true;

  if (
    firstNameError.value ||
    lastNameError.value ||
    phoneError.value ||
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
  } catch (error) {
    // TODO integrate toast message
    console.error(error);
    return;
  }

  successMessage.value = 'Код подтверждения отправлен в SMS.';
  emit('registerStarted', normalizedPhone.value);
}
</script>

<style scoped lang="scss">
@use 'AuthRegisterForm';
</style>
