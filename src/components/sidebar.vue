<template>
  <aside
    v-if="currentUser"
    :class="$style.sidebar">
    <UserProfileSidebar :user="currentUser" />

    <UserAppointmentsSidebar
      :appointments="appointments || []"
      :is-master="currentUser.isMaster"
      :loading="appointmentsLoading"
      class="mt-4" />
  </aside>
</template>

<script setup lang="ts">
import UserProfileSidebar from '@/components/user-profile-sidebar.vue';
import UserAppointmentsSidebar from '@/components/user-appointments-sidebar.vue';
import type { CurrentUser } from '@/types/current-user';
import type { Appointment } from '@/types/appointment';

defineProps<{
  currentUser: CurrentUser | null;
  appointments?: Appointment[];
  appointmentsLoading?: boolean;
}>();
</script>

<style module lang="scss">
.sidebar {
  flex-shrink: 0;
  width: 320px;
  position: sticky;
  top: 80px; // Account for header height
  padding-top: 24px;
}

// Hide sidebar on small screens
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>

