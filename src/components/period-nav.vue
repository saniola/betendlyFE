<template>
  <div :class="[$style.component, 'mb-4']">
    <v-btn
      :class="$style.button"
      color="primary"
      variant="outlined"
      :disabled="isPrevDisabled"
      @click="$emit('prev-month')">
      Попередній
    </v-btn>

    <strong :class="$style.period">
      {{ formattedPeriod }}
    </strong>

    <v-btn
      :class="$style.button"
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

<style module lang="scss">
.component {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.period {
  text-transform: capitalize;
}

.button {
  min-width: 160px;
}

@media (max-width: 768px) {
  .component {
    flex-direction: column;
    align-items: stretch;
  }

  .button {
    width: 100%;
  }

  .period {
    text-align: center;
  }
}
</style>
