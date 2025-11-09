<template>
  <ul :class="$style.component">
    <MasterCard
      v-for="(master, index) in mainState.masters"
      :key="index"
      :master="master" />

    <v-pagination
      v-if="mainState.totalPages > 1"
      v-model="mainState.currentPage"
      color="#1976d2"
      rounded
      :length="mainState.totalPages"
      @update:model-value="onPageChange" />
  </ul>
</template>

<script setup lang="ts">
import { fetchMasters } from '@/actions/fetch-masters';
import { setCurrentPage } from '@/actions/set-current-page';
import MasterCard from '@/components/master-card.vue';
import { mainState } from '@/state';

fetchMasters();

function onPageChange(page: number) {
  setCurrentPage(page);
  fetchMasters();
}
</script>

<style module lang="scss">
.component {
  padding-top: 24px;
}
</style>
