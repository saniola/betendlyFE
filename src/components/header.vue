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

        <div
          v-if="!isLoading"
          :class="$style.actions">
          <template v-if="currentUser">
            <div :class="$style.user">
              <img
                height="30"
                width="30"
                :alt="`${currentUser?.firstName} ${currentUser?.lastName}`"
                :class="$style.avatar"
                :src="currentUser.avatarUrl || defaultAvatar" />

              <RouterLink
                :class="[
                  'font-weight-medium',
                  $style.username,
                ]"
                :to="`/member/${currentUser.id}`">
                {{ `${currentUser?.firstName} ${currentUser?.lastName}` }}
              </RouterLink>
            </div>

            <v-btn
              color="primary"
              variant="outlined"
              :class="[$style.outlineButton, 'text-none', 'ms-2']"
              @click="logout">
              Log out
            </v-btn>
          </template>

          <template v-else>
            <v-btn
              v-if="!['signup'].includes(route.name as string)"
              color="primary"
              variant="outlined"
              :class="[$style.outlineButton, 'text-none', 'ms-2']"
              :to="{ name: 'signup' }">
              Sign Up
            </v-btn>

            <v-btn
              v-if="!['login'].includes(route.name as string)"
              color="primary"
              variant="outlined"
              :class="[$style.outlineButton, 'text-none', 'ms-2']"
              :to="{ name: 'login' }">
              Log in
            </v-btn>
          </template>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { logout } from '@/actions/logout';
import { defaultAvatar } from '@/config';
import type { CurrentUser } from '@/types/current-user';

defineProps<{
  currentUser: CurrentUser | null,
  isLoading: boolean,
}>();

const route = useRoute();
</script>

<style module lang="scss">
.component {
  background-color: var(--color-background-soft);
  padding: 8px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(var(--color-primary-rgb), 0.18);
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

.avatar {
  border-radius: var(--radius-full);
  object-fit: cover;
}

.actions,
.user {
  display: flex;
  align-items: center;
}

.actions {
  gap: .8rem;
}

.user {
  gap: .4rem;
}

.username {
  color: var(--color-primary-dark);
  &:hover {
    opacity: .8;
  }
}

.outlineButton {
  border-color: var(--color-primary) !important;
  color: var(--color-primary-dark) !important;

  :global(.v-btn__content) {
    color: var(--color-primary-dark) !important;
  }
}
</style>
