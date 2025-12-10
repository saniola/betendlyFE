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

.component::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
  pointer-events: none;
}

.navbar {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap;
}

.logo {
  display: block;
  width: 115px;
  max-width: 115px;
  height: auto;
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
  flex-wrap: nowrap;
  justify-content: flex-end;
  width: auto;
}

.user {
  gap: .4rem;
}

.username {
  color: var(--color-primary-dark);
  white-space: nowrap;
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

@media (max-width: 900px) {
  .actions {
    gap: 0.5rem;
  }

  .user {
    gap: 0.25rem;
  }

  .username {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .component {
    padding: 10px 0;
  }

  .actions {
    flex-shrink: 0;
  }
}

@media (max-width: 600px) {
  .logo {
    height: auto;
    max-width: 150px;
  }

  .actions {
    gap: 8px;
  }

  .outlineButton {
    padding-inline: 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 520px) {
  .navbar {
    align-items: flex-start;
    gap: 10px;
  }

  .actions {
    justify-content: stretch;
    flex-wrap: wrap;
  }

  .outlineButton {
    width: fit-content;
  }

  .username {
    display: none;
  }
}
</style>
