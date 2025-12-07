<template>
  <div>
    <Filters
      :cities
      :filter="filter"
      :skills
      @city-change="onCityChange"
      @skill-change="onSkillChange" />

    <ul
      v-if="masters.length"
      :class="$style.mastersList">
      <MasterCard
        v-for="(master, index) in masters"
        :key="index"
        :master="master" />
    </ul>

    <p v-else class="text-center mt-8">
      Майстрів не знайдено
    </p>

    <v-pagination
      v-if="totalPages > 1"
      :model-value="currentPage"
      color="primary"
      rounded
      :length="totalPages"
      :class="$style.pagination"
      @update:model-value="onPageChange" />
  </div>
</template>

<script setup lang="ts">
import Filters from '@/components/filters.vue';
import MasterCard from '@/components/master-card.vue';
import type { Master } from '@/types/master';
import type { Filter } from '@/types/filter';

defineProps<{
  masters: Master[];
  cities: string[];
  skills: string[];
  filter: Filter;
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'city-change', city: string): void;
  (e: 'skill-change', skill: string): void;
  (e: 'page-change', page: number): void;
}>();

function onCityChange(city: string) {
  emit('city-change', city);
}

function onSkillChange(skill: string) {
  emit('skill-change', skill);
}

function onPageChange(page: number) {
  emit('page-change', page);
}
</script>

<style module lang="scss">
.mastersList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination {
  margin-top: 24px;
}
</style>

