<template>
  <v-container
    class="py-4"
    fluid>
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <v-select
          active
          density="comfortable"
          hide-details
          item-title="value"
          item-value="key"
          label="Навички"
          variant="outlined"
          :items="skills"
          :value ="filter.skill"
          @update:model-value="$emit('skill-change', $event)" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          active
          density="comfortable"
          hide-details
          label="Міста"
          variant="outlined"
          :items="cities"
          :value="filter.city"
          @update:model-value="$emit('city-change', $event)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Filter } from '@/types/filter';

defineProps<{
  cities: string[];
  filter: Filter;
  skills: string[];
}>();

defineEmits<{
  (e: 'skill-change', value: string): void;
  (e: 'city-change', value: string): void;
}>();
</script>
