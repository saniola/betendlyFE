<template>
  <div :class="$style.component">
    <Header
      :current-user="mainState.currentUser"
      :is-loading="mainState.isLoading" />

    <div :class="$style.content">
      <div class="container">
        <slot />
      </div>
    </div>

    <div
      v-if="mainState.isLoading"
      :class="$style.loader">
      <img
        alt="Loading..."
        height="110"
        src="@/assets/loader.svg"
        width="110" />

        <p :class="$style.text">
          Please wait. Loading...
        </p>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { mainState } from '@/state';
</script>

<style module lang="scss">
.component {
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 30px;
  padding-top: 52px;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  width: 100%;
  padding-top: 16px;
}

.loader {
  align-items: center;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.text {
  color: var(--color-primary-dark);
  padding-top: 10px;
}
</style>
