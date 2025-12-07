<template>
  <v-card>
    <v-card-title>Мій профіль</v-card-title>

    <v-card-text>
      <div :class="$style.userInfo">
        <v-avatar size="64">
          <v-img :src="user.avatarUrl || defaultAvatar" />
        </v-avatar>

        <h4 :class="$style.userName">
          {{ fullName }}
        </h4>

        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          :to="{ name: 'profile', params: { id: user.id } }"
          :class="$style.profileButton">
          Переглянути профіль
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defaultAvatar } from '@/config';
import type { CurrentUser } from '@/types/current-user';

const props = defineProps<{
  user: CurrentUser;
}>();

const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`);
</script>

<style module lang="scss">
.userInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.userName {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin: 0;
}

.profileButton {
  width: 100%;
  border-color: var(--color-primary) !important;
  color: var(--color-primary-dark) !important;
}
</style>

