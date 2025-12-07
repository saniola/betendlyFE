<template>
  <aside
    v-if="currentUser"
    :class="$style.sidebar">
    <UserProfileSidebar :user="currentUser" />

    <UserAppointmentsSidebar
      :appointments="todayConfirmedAppointments"
      :is-master="currentUser.isMaster"
      :loading="loading"
      class="mt-4" />

    <MasterPendingRequests
      v-if="currentUser.isMaster"
      :requests="pendingRequests"
      :loading="loading"
      class="mt-4"
      @accept="onAcceptRequest"
      @reject="onRejectRequest"
      @view-all="goToAppointments" />
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAppointments } from '@/actions/fetch-appointments';
import { acceptAppointment } from '@/actions/accept-appointment';
import { rejectAppointment } from '@/actions/reject-appointment';
import { mainState } from '@/state';
import UserProfileSidebar from '@/components/user-profile-sidebar.vue';
import UserAppointmentsSidebar from '@/components/user-appointments-sidebar.vue';
import MasterPendingRequests from '@/components/master-pending-requests.vue';
import type { CurrentUser } from '@/types/current-user';

defineProps<{
  currentUser: CurrentUser | null;
}>();

const loading = ref(false);
const router = useRouter();

const todayConfirmedAppointments = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return mainState.appointments.filter(apt => {
    if (apt.status !== 1) return false;
    const aptDate = new Date(apt.startUtc);
    return aptDate >= today && aptDate < tomorrow;
  });
});

const pendingRequests = computed(() => {
  return mainState.appointments
    .filter(req => req.status === 0)
    .sort((a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime());
});

watch(
  () => mainState.currentUser?.id,
  async (userId) => {
    if (!userId) return;
    await refreshAppointments();
  },
  { immediate: true },
);

async function refreshAppointments() {
  if (!mainState.currentUser) return;
  loading.value = true;
  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 1);
    await fetchAppointments(today, endDate);
  } finally {
    loading.value = false;
  }
}

async function onAcceptRequest(id: string) {
  await acceptAppointment(id);
  await refreshAppointments();
}

async function onRejectRequest(id: string) {
  await rejectAppointment(id);
  await refreshAppointments();
}

async function goToAppointments() {
  if (!mainState.currentUser) return;

  await router.push({
    name: 'profile',
    params: { id: mainState.currentUser.id },
    hash: '#appointments-section',
  });
}
</script>

<style module lang="scss">
.sidebar {
  flex-shrink: 0;
  width: 320px;
  position: sticky;
  top: 80px;
  padding-top: 24px;
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>
