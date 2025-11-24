<template>
  <v-container
    class="py-4"
    fluid>
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.tag"
          density="comfortable"
          hide-details
          item-title="value"
          item-value="key"
          label="Всі навички"
          variant="outlined"
          :items="skills"
          @update:model-value="$emit('skill-change', $event)" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.city"
          density="comfortable"
          hide-details
          label="Місто"
          variant="outlined"
          :items="cities"
          @update:model-value="$emit('city-change', $event)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  cities: string[];
  skills: string[];
}>();

defineEmits<{
  (e: 'tag-change', value: string): void;
  (e: 'city-change', value: string): void;
}>();
</script>
