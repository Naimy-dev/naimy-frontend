<template>
  <aside class="user-profile-contacts">
    <h2 class="user-profile-contacts__title">Контакты</h2>

    <div class="user-profile-contacts__card">
      <div
        class="user-profile-contacts__body"
        :class="{ 'user-profile-contacts__body--blurred': isOverlayShown }"
      >
        <ul v-if="contactItems.length" class="user-profile-contacts__list">
          <li v-for="item in contactItems" :key="item.key" class="user-profile-contacts__item">
            <div class="user-profile-contacts__meta">
              <span class="user-profile-contacts__label">{{ item.label }}</span>
              <span class="user-profile-contacts__value">{{ item.value }}</span>
            </div>

            <button
              class="user-profile-contacts__copy-btn"
              type="button"
              :aria-label="`Скопировать ${item.label}`"
              @click="copyContact(item.label, item.value)"
            >
              <CopyIcon />
            </button>
          </li>
        </ul>

        <p v-else class="user-profile-contacts__empty">Контактная информация не указана</p>
      </div>

      <div v-if="isOverlayShown" class="user-profile-contacts__overlay">
        <button
          class="user-profile-contacts__reveal-btn"
          type="button"
          @click="areContactsShown = true"
        >
          <EyeIcon /> Показать контакты
        </button>
      </div>
    </div>

    <div v-if="isOverlayShown" class="user-profile-contacts__info">
      <InfoIcon class="user-profile-contacts__info-icon" />

      <div class="user-profile-contacts__info-content">
        <p class="user-profile-contacts__info-title">Защита контактов</p>
        <p class="user-profile-contacts__info-text">
          Контакты скрыты для защиты от спама. Нажмите "Показать" чтобы увидеть данные
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from '~/composables';
import { CopyIcon, EyeIcon, InfoIcon } from '~/icons';
import type { ContactItem, UserProfileContactsProps } from './UserProfileContacts.types';

const props = defineProps<UserProfileContactsProps>();

const toast = useToast();
const areContactsShown = ref(false);

const contactItems = computed<ContactItem[]>(() => {
  const list = [
    { key: 'phone', label: 'Телефон', value: props.phone },
    { key: 'email', label: 'Email', value: props.contacts.email },
    { key: 'telegram', label: 'Telegram', value: props.contacts.telegram },
    { key: 'viber', label: 'Viber', value: props.contacts.viber },
  ];

  // as ContactItem[] - we know filter guarantees value is string,
  // but TypeScript can't track this logic
  return list.filter((item) => !!item.value) as ContactItem[];
});

const isOverlayShown = computed(() => !props.isOwner && !areContactsShown.value);

async function copyContact(label: string, value: string) {
  if (!value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    toast.success({
      title: `${label} скопирован`,
    });
  } catch {
    toast.error({
      title: 'Не удалось скопировать контакт',
    });
  }
}
</script>

<style scoped lang="scss">
@use 'UserProfileContacts';
</style>
