<template>
  <div :class="$style.pageLayout">
    <!-- Main content -->
    <div :class="$style.mainContent">
      <MastersList
        :masters="mainState.masters"
        :cities="cities"
        :skills="skills"
        :filter="mainState.filter"
        :current-page="mainState.currentPage"
        :total-pages="mainState.totalPages"
        @city-change="onCityChange"
        @skill-change="onSkillChange"
        @page-change="onPageChange" />
    </div>

    <!-- Sidebar -->
    <Sidebar :current-user="mainState.currentUser" />
  </div>
</template>

<script setup lang="ts">
import { fetchMasters } from '@/actions/fetch-masters';
import { setCurrentPage } from '@/actions/set-current-page';
import { setFilterValue } from '@/actions/set-filter-value';
import MastersList from '@/components/masters-list.vue';
import Sidebar from '@/components/sidebar.vue';
import { defaultSkill, defaultCity } from '@/config';
import { mainState } from '@/state';
import type { Master } from '@/types/master';
import { onBeforeUnmount, ref, watch } from 'vue';

fetchMasters();
const cities = ref([defaultCity]);
const skills = ref([defaultSkill]);

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
  setFilterValue('city', defaultCity);
  setFilterValue('skill', defaultSkill);
  setCurrentPage(1);
});

function onPageChange(page: number) {
  setCurrentPage(page);
  fetchMasters();
}

function onCityChange(city: string) {
  setFilterValue('city', city);
  fetchMasters();
}

function onSkillChange(skill: string) {
  setFilterValue('skill', skill);
  fetchMasters();
}
</script>

<style module lang="scss">
.pageLayout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  width: 100%;
}

.mainContent {
  flex: 1;
  min-width: 0; // Important for flex child to shrink properly
  width: 100%;
  padding-top: 12px;
}

@media (max-width: 1024px) {
  .pageLayout {
    flex-direction: column;
    gap: 16px;
  }

  .mainContent {
    max-width: 100%;
  }
}
</style>
