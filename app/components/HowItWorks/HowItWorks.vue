<template>
  <section id="how-it-works" class="how-it-works" aria-label="Как это работает">
    <div class="how-it-works__container">
      <header class="how-it-works__header">
        <h2 class="how-it-works__title">Как это работает</h2>
        <p class="how-it-works__subtitle">Простой процесс от поиска до выполнения задачи</p>
      </header>

      <ol class="how-it-works__steps">
        <li class="how-it-works__step">
          <div class="how-it-works__icon" aria-hidden="true">
            <MagnifyingGlassIcon />
          </div>
          <div class="how-it-works__badge" aria-hidden="true">1</div>
          <h3 class="how-it-works__step-title">Опишите задачу</h3>
          <p class="how-it-works__step-text">
            Расскажите, что нужно сделать, укажите бюджет и сроки
          </p>
        </li>

        <li class="how-it-works__step">
          <div class="how-it-works__icon" aria-hidden="true">
            <UsersIcon />
          </div>
          <div class="how-it-works__badge" aria-hidden="true">2</div>
          <h3 class="how-it-works__step-title">Получите отклики</h3>
          <p class="how-it-works__step-text">
            Специалисты откликнутся на ваше задание с предложениями
          </p>
        </li>

        <li class="how-it-works__step">
          <div class="how-it-works__icon" aria-hidden="true">
            <HandshakeIcon />
          </div>
          <div class="how-it-works__badge" aria-hidden="true">3</div>
          <h3 class="how-it-works__step-title">Выберите исполнителя</h3>
          <p class="how-it-works__step-text">Изучите профили, отзывы и выберите лучшего</p>
        </li>

        <li class="how-it-works__step">
          <div class="how-it-works__icon" aria-hidden="true">
            <HowItWorksCheckIcon />
          </div>
          <div class="how-it-works__badge" aria-hidden="true">4</div>
          <h3 class="how-it-works__step-title">Получите результат</h3>
          <p class="how-it-works__step-text">Работа выполнена, оплата защищена сервисом</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  CheckIcon as HowItWorksCheckIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from '~/icons/how-it-works';
</script>

<style scoped lang="scss">
@use 'HowItWorks.scss';
</style>

