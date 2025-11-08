<template>
  <router-view />

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
</template>

<script setup lang="ts">
import { setLoadingStatus } from '@/actions/set-loading-status';
import { mainState } from '@/state';

setTimeout(() => setLoadingStatus(false), 2000);
</script>

<style module lang="scss">
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
