<template>
  <div class="auth-phone-input">
    <label class="auth-phone-input__label" :for="inputId">Номер телефона</label>

    <div class="auth-phone-input__shell">
      <span class="auth-phone-input__icon" aria-hidden="true">
        <UserIcon />
      </span>

      <input
        :id="inputId"
        v-model="maskedPhone"
        v-maska="PHONE_MASK"
        class="auth-phone-input__input"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        placeholder="+375 (XX) XXX-XX-XX"
        @input="touched = false"
        @blur="touched = true"
      />
    </div>

    <p v-if="phoneError" class="auth-phone-input__error" role="alert">{{ phoneError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { vMaska } from 'maska/vue';
import { UserIcon } from '~/auth/icons';

const PHONE_MASK = '+375 (##) ###-##-##';
const inputId = 'auth-phone-input';

const model = defineModel<string>({ default: '' });

const maskedPhone = ref('');
const touched = ref(false);

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

const phoneError = computed(() => {
  if (!touched.value) {
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

watch(localPhone, (value) => {
  model.value = value ? `+375${value}` : '';
});

function validate() {
  touched.value = true;
  return !phoneError.value;
}

defineExpose({ validate });
</script>

<style scoped lang="scss">
@use 'AuthPhoneInput';
</style>
