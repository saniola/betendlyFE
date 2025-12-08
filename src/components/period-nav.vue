<template>
  <div class="d-flex justify-space-between align-center mb-4">
    <v-btn
      color="primary"
      variant="outlined"
      :disabled="isPrevDisabled"
      @click="$emit('prev-month')">
      Попередній
    </v-btn>

    <strong>{{ formattedPeriod }}</strong>

    <v-btn
      color="primary"
      variant="outlined"
      @click="$emit('next-month')">
      Наступний
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  currentMonth: Date;
  isMaster: boolean;
  isPrevDisabled: boolean;
}>();

defineEmits<{
  (e: 'next-month'): void;
  (e: 'prev-month'): void;
}>();

const formattedPeriod = computed(() =>
  props.currentMonth.toLocaleDateString('uk-UA',
    props.isMaster
      ? { day: 'numeric', month: 'long', year: 'numeric' }
      : { month: 'long', year: 'numeric' }
  )
);
</script>
