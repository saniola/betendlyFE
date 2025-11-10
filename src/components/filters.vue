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
          label="Всі теги"
          variant="outlined"
          :items="tags"
          @update:model-value="$emit('tag-change', $event)" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.alphabet"
          density="comfortable"
          hide-details
          label="Алфавіт"
          variant="outlined"
          :items="alphabetOptions"
          @update:model-value="$emit('alphabet-change', $event)" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="filters.rating"
          density="comfortable"
          hide-details
          label="Рейтинг"
          variant="outlined"
          :items="ratingOptions"
          @update:model-value="$emit('rating-change', $event)" />
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
import { ref } from 'vue';

const props = defineProps<{
  cities: string[];
  tags: string[];
}>();

const tags = ['Всі теги', ...props.tags];
const alphabetOptions = ['A→Я', 'Я→A']
const ratingOptions = ['Рейтинг ⬆️', 'Рейтинг ⬇️']
const cities = ['Всі міста', ...props.cities];
const filters = ref({
  tag: tags[0],
  alphabet: alphabetOptions[0],
  rating: ratingOptions[0],
  city: cities[0],
});
</script>
