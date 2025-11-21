<template>
  <div class="d-flex justify-space-between align-center mb-4">
    <v-btn
      variant="outlined"
      :disabled="isPrevDisabled"
      v-text="'Попередній'"
      @click="$emit('prev-month')" />

    <strong v-text="formattedPeriod" />

    <v-btn
      variant="outlined"
      v-text="'Наступний'"
      @click="$emit('next-month')" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  currentMonth: Date;
  isPrevDisabled: boolean;
}>();

defineEmits<{
  (e: 'next-month'): void;
  (e: 'prev-month'): void;
}>();

const formattedPeriod = computed(() =>
  props.currentMonth.toLocaleDateString("uk-UA", {
    month: "long",
    year: "numeric",
  })
);
</script>
