<template>
  <Filters
    :cities
    :tags
    @city-change="onCityChange"
    @tag-change="onTagChange"
    @alphabet-change="onAlphabetChange"
    @rating-change="onRatingChange" />

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
import Filters from '@/components/filters.vue';
import MasterCard from '@/components/master-card.vue';
import { mainState } from '@/state';
import type { Master } from '@/types/master';
import { computed } from 'vue';

fetchMasters();

const cities = computed(() => {
  const arr: string[] = [];

  mainState.masters.forEach((item: Master) => {
    if (item.address && !arr.includes(item.address)) {
      arr.push(item.address);
    }
  });

  return arr;
});

const tags = computed(() => {
  const arr: string[] = [];

  mainState.masters.forEach((item: Master) => {
    item.skills.forEach((skill: string) => {
      if (!arr.includes(skill)) {
        arr.push(skill);
      }
    });
  });

  return arr;
});

function onPageChange(page: number) {
  setCurrentPage(page);
  fetchMasters();
}

function onCityChange(city: string) {}

function onTagChange(tag: string) {}

function onAlphabetChange(alphabet: string) {}

function onRatingChange(rating: string) {}

</script>

<style module lang="scss">
.component {
  padding-top: 24px;
}
</style>
