<template>
  <Filters
    :cities
    :filter="mainState.filter"
    :skills
    @city-change="onCityChange"
    @skill-change="onSkillChange" />

  <ul
    v-if="mainState.masters.length"
    :class="$style.component">
    <MasterCard
      v-for="(master, index) in mainState.masters"
      :key="index"
      :master="master" />

    <v-pagination
      v-if="mainState.totalPages > 1"
      v-model="mainState.currentPage"
      color="primary"
      rounded
      :length="mainState.totalPages"
      @update:model-value="onPageChange" />
  </ul>

  <p v-else class="text-center mt-8">
    Майстрів не знайдено
  </p>
</template>

<script setup lang="ts">
import { fetchMasters } from '@/actions/fetch-masters';
import { setCurrentPage } from '@/actions/set-current-page';
import { setFilterValue } from '@/actions/set-filter-value';
import Filters from '@/components/filters.vue';
import MasterCard from '@/components/master-card.vue';
import { mainState } from '@/state';
import type { Master } from '@/types/master';
import { onBeforeUnmount, ref, watch } from 'vue';

fetchMasters();
const cities = ref(['Всі міста']);
const skills = ref(['Всі навички']);

watch(() => mainState.masters, () => {
  mainState.masters.forEach((item: Master) => {
    if (item.city && !cities.value.includes(item.city)) {
      cities.value.push(item.city);
    }

    item.skills.forEach((skill: string) => {
      if (!skills.value.includes(skill)) {
        skills.value.push(skill);
      }
    });
  });
});

onBeforeUnmount(() => {
  setFilterValue('city', null);
  setFilterValue('skill', null);
  setCurrentPage(1);
});

function onPageChange(page: number) {
  setCurrentPage(page);
  fetchMasters();
}

function onCityChange(city: string) {
  setFilterValue('city', city === 'Всі міста' ? null : city);
  fetchMasters();
}

function onSkillChange(skill: string) {
  setFilterValue('skill', skill === 'Всі навички' ? null : skill);
  fetchMasters();
}
</script>

<style module lang="scss">
.component {
  padding-top: 24px;
}
</style>
