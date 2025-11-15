<template>
  <div :class="$style.component">
    <div class="container">
      <nav :class="$style.navbar">
        <RouterLink to="/">
          <img
            alt="BeTendly"
            height="30"
            src="@/assets/logo.png"
            width="115"
            :class="$style.logo" />
        </RouterLink>

        <div v-if="!isLoading">
          <RouterLink
            v-if="currentUser"
            class="ms-2 text-white font-weight-medium"
            :to="`/member/${currentUser.id}`"
            v-text="`${props.currentUser?.firstName} ${props.currentUser?.lastName}`" />

          <template v-else>
            <v-btn
              v-if="!['signup'].includes(route.name as string)"
              color="white"
              variant="outlined"
              class="text-none ms-2"
              :to="{ name: 'signup' }">
              Sign Up
            </v-btn>

            <v-btn
              v-if="!['login'].includes(route.name as string)"
              color="white"
              variant="outlined"
              class="text-none ms-2"
              :to="{ name: 'login' }">
              Login
            </v-btn>
          </template>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import type { CurrentUser } from '@/types/current-user';

const props = defineProps<{
  currentUser: CurrentUser | null,
  isLoading: boolean,
}>();

const route = useRoute();
</script>

<style module lang="scss">
.component {
  background-color: #1976d2;
  padding: 8px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.logo {
  display: block;
  width: auto;
}
</style>
