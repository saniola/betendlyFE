<template>
  <Layout>
    <router-view :key="$route.fullPath" />
  </Layout>
</template>

<script setup lang="ts">
import { fetchCurrentUser } from '@/actions/fetch-current-user';
import Layout from '@/controllers/layout.vue';

fetchCurrentUser();
</script>

<style>
body {
  background-color: var(--color-surface-alt);
  min-height: 100vh;
}
</style>
