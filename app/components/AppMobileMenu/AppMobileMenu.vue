<template>
  <Teleport to="body">
    <transition name="mobile-menu-fade">
      <div v-if="isOpen" class="mobile-menu__overlay" @click="close" />
    </transition>

    <transition name="mobile-menu-slide">
      <aside
        v-if="isOpen"
        class="mobile-menu__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        @click.stop
      >
        <div class="mobile-menu__layout">
          <header class="mobile-menu__header">
            <div class="mobile-menu__header-top">
              <button
                class="mobile-menu__close"
                type="button"
                aria-label="Закрыть меню"
                @click="close"
              >
                <CloseIcon />
              </button>
            </div>

            <div v-if="isAuthenticated && user" class="mobile-menu__user">
              <div class="mobile-menu__avatar">
                <img v-if="user.photoUrl" :src="user.photoUrl" alt="" />
                <span v-else class="mobile-menu__avatar-fallback" aria-hidden="true">
                  {{ userInitial }}
                </span>
              </div>
              <div class="mobile-menu__user-meta">
                <div class="mobile-menu__user-name">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="mobile-menu__user-phone">{{ user.phone }}</div>
              </div>
            </div>

            <div v-else class="mobile-menu__auth-actions">
              <NuxtLink
                class="mobile-menu__auth-btn mobile-menu__auth-btn--login"
                :to="`/auth?tab=${AuthTab.LOGIN}`"
                @click="close"
              >
                Войти
              </NuxtLink>
            </div>
          </header>

          <div class="mobile-menu__content">
            <template v-if="isAuthenticated">
              <nav class="mobile-menu__section">
                <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <HomeIcon />
                  </span>
                  <span class="mobile-menu__item-label">Главная</span>
                </NuxtLink>
              </nav>

              <!-- <div class="mobile-menu__divider" /> -->

              <nav class="mobile-menu__section">
                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/my/tasks"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <ListIcon />
                  </span>
                  <span class="mobile-menu__item-label">Мои задания</span>
                </NuxtLink> -->

                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/my/services"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <BriefcaseIcon />
                  </span>
                  <span class="mobile-menu__item-label">Мои объявления</span>
                </NuxtLink> -->

                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/messages"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <MessageIcon />
                  </span>
                  <span class="mobile-menu__item-label mobile-menu__item-label--stretch"
                    >Сообщения</span
                  >
                  <span class="mobile-menu__badge" aria-label="3 новых">3</span>
                </NuxtLink> -->

                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/notifications"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <BellIcon />
                  </span>
                  <span class="mobile-menu__item-label mobile-menu__item-label--stretch"
                    >Уведомления</span
                  >
                  <span class="mobile-menu__badge" aria-label="5 новых">5</span>
                </NuxtLink> -->

                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/favorites"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <HeartIcon />
                  </span>
                  <span class="mobile-menu__item-label">Избранное</span>
                </NuxtLink> -->
              </nav>

              <!-- <div class="mobile-menu__divider" /> -->

              <nav class="mobile-menu__section">
                <!-- <NuxtLink class="mobile-menu__item" to="/settings" @click="close">
                  <span class="mobile-menu__item-icon">
                    <SettingsIcon />
                  </span>
                  <span class="mobile-menu__item-label">Настройки</span>
                </NuxtLink> -->
              </nav>

              <div class="mobile-menu__divider" />

              <nav class="mobile-menu__section">
                <!-- <NuxtLink class="mobile-menu__item" to="/help" @click="close">
                  <span class="mobile-menu__item-icon">
                    <QuestionIcon />
                  </span>
                  <span class="mobile-menu__item-label">Помощь</span>
                </NuxtLink> -->
              </nav>
            </template>

            <template v-else>
              <nav class="mobile-menu__section">
                <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <HomeIcon />
                  </span>
                  <span class="mobile-menu__item-label">Главная</span>
                </NuxtLink>
                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/tasks"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <ListIcon />
                  </span>
                  <span class="mobile-menu__item-label">Задания</span>
                </NuxtLink> -->
                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/ads"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <BriefcaseIcon />
                  </span>
                  <span class="mobile-menu__item-label">Объявления</span>
                </NuxtLink> -->
                <!-- <NuxtLink
                  class="mobile-menu__item mobile-menu__item--primary"
                  to="/categories"
                  @click="close"
                >
                  <span class="mobile-menu__item-icon mobile-menu__item-icon--primary">
                    <TableCellsIcon />
                  </span>
                  <span class="mobile-menu__item-label">Категории</span>
                </NuxtLink> -->
              </nav>

              <!-- <div class="mobile-menu__divider" /> -->

              <nav class="mobile-menu__section">
                <!-- <NuxtLink class="mobile-menu__item" to="/about" @click="close">
                  <span class="mobile-menu__item-icon">
                    <InfoIcon />
                  </span>
                  <span class="mobile-menu__item-label">О сервисе</span>
                </NuxtLink> -->
                <!-- <NuxtLink class="mobile-menu__item" to="/help" @click="close">
                  <span class="mobile-menu__item-icon">
                    <QuestionIcon />
                  </span>
                  <span class="mobile-menu__item-label">Помощь</span>
                </NuxtLink> -->
                <!-- <NuxtLink class="mobile-menu__item" to="/contacts" @click="close">
                  <span class="mobile-menu__item-icon">
                    <PhoneIcon />
                  </span>
                  <span class="mobile-menu__item-label">Контакты</span>
                </NuxtLink> -->
              </nav>

              <div class="mobile-menu__divider" />

              <div class="mobile-menu__section mobile-menu__settings">
                <div class="mobile-menu__settings-title">Язык</div>
                <select v-model="language" class="mobile-menu__select" aria-label="Язык">
                  <option>Русский</option>
                </select>
              </div>
            </template>
          </div>

          <footer v-if="isAuthenticated" class="mobile-menu__footer">
            <button
              class="mobile-menu__logout"
              type="button"
              :disabled="logoutLoading"
              @click="handleLogout"
            >
              <span class="mobile-menu__logout-icon">
                <LogoutIcon />
              </span>
              <span class="mobile-menu__logout-text">Выйти</span>
            </button>
          </footer>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { AuthTab, useAuthStore, useLogout } from '~/auth';
import {
  CloseIcon,
  LogoutIcon,
  HomeIcon,
  ListIcon,
  BriefcaseIcon,
  TableCellsIcon,
  PhoneIcon,
  InfoIcon,
  QuestionIcon,
  MessageIcon,
  BellIcon,
  HeartIcon,
  SettingsIcon,
} from '~/icons';

const isOpen = defineModel<boolean>();

const authStore = useAuthStore();
const { isAuthenticated, user, userInitial } = storeToRefs(authStore);

const { logout, loading: logoutLoading } = useLogout();

const language = ref('Русский');

function close() {
  isOpen.value = false;
}

async function handleLogout() {
  close();
  await logout();
}
</script>

<style scoped lang="scss">
@use 'AppMobileMenu.scss';
</style>
