<template>
  <div :class="$style.component">
    <RouterLink to="/">
      <img
        alt="Loading..."
        height="30"
        src="@/assets/logo.png"
        width="115"
        :class="$style.logo" />
    </RouterLink>

    <div>
      <template v-if="!isLoggedIn">
        <v-btn
          v-if="!['signup'].includes(route.name as string)"
          color="white"
          variant="outlined"
          class="text-none ms-2"
          :to="{ name: 'signup' }"
          @click="onSignup">
          Sign Up
        </v-btn>

        <v-btn
          v-if="!['login'].includes(route.name as string)"
          color="white"
          variant="outlined"
          class="text-none ms-2"
          :to="{ name: 'login' }"
          @click="onLogin">
          Login
        </v-btn>
      </template>

      <template v-else>
        <v-avatar size="36" class="ms-2">
          <v-img :src="user.avatar" alt="User avatar" />
        </v-avatar>

        <span class="ms-2 text-white font-weight-medium">{{ user.name }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const isLoggedIn = ref(false);

const user = ref({
  name: 'Jane Doe',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
});

const onSignup = () => {
  console.log('Navigate to signup');
};

const onLogin = () => {
  console.log('Navigate to login');
};
</script>

<style module lang="scss">
.component {
  align-items: center;
  background-color: #1976d2;
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  width: auto;
}
</style>
