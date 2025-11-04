<template>
  <h1>{{ mainState.title }}</h1>
</template>

<script setup lang="ts">
import { mainState } from '@/state';

defineProps<{ msg: string }>()
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
