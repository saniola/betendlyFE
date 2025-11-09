<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup lang="ts">
import { setLoadingStatus } from '@/actions/set-loading-status';
import Layout from '@/controllers/layout.vue';

setTimeout(() => setLoadingStatus(false), 2000);
</script>
