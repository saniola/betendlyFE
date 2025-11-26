<template>
  <div :class="$style.component">
    <Header
      :current-user="mainState.currentUser"
      :is-loading="mainState.isLoading" />

    <div class="container">
      <slot />
    </div>

    <div
      v-if="mainState.isLoading"
      :class="$style.loader">
      <img
        alt="Loading..."
        height="50"
        src="@/assets/loader.gif"
        width="50" />

        <p
          :class="$style.text"
          v-text="'Please wait. Loading...'" />
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
  height: 100%;
  padding-bottom: 30px;
  padding-top: 52px;
}

.loader {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}

.text {
  color: #000;
  padding-top: 10px;
}
</style>
