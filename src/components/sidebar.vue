<template>
  <div
    :class="$style.host"
    :data-compact="isCompactView">
    <template v-if="currentUser">
      <aside
        v-if="!isCompactView"
        :class="$style.sidebar">
        <div :class="$style.sections">
          <UserAppointmentsSidebar
            :appointments="todayConfirmedAppointments"
            :is-master="currentUser.isMaster"
            :loading="loading"
            @view-all="onViewAllAppointments" />

          <MasterPendingRequests
            v-if="currentUser.isMaster"
            :requests="pendingRequests"
            :loading="loading"
            @accept="onAcceptRequest"
            @reject="onRejectRequest"
            @view-all="goToAppointments" />

          <UserProfileSidebar :user="currentUser" />
        </div>
      </aside>

      <template v-else>
        <div
          :class="$style.drawerBackdrop"
          :data-open="mobilePanelOpen"
          @click="mobilePanelOpen = false" />

        <aside
          :class="$style.mobileDrawer"
          :data-open="mobilePanelOpen">
          <div :class="$style.drawerHeader">
            <div>
              <p :class="$style.drawerTitle">
                Мій профіль та записи
              </p>
              <p :class="$style.drawerHint">
                Швидкий доступ до профілю, записів і запитів
              </p>
            </div>
            <v-btn
              icon
              variant="text"
              density="comfortable"
              @click="mobilePanelOpen = false">
              <v-icon icon="mdi-close" />
            </v-btn>
          </div>

          <div :class="$style.sections">
            <UserAppointmentsSidebar
              :appointments="todayConfirmedAppointments"
              :is-master="currentUser.isMaster"
              :loading="loading"
              @view-all="onViewAllAppointments" />

            <MasterPendingRequests
              v-if="currentUser.isMaster"
              :requests="pendingRequests"
              :loading="loading"
              @accept="onAcceptRequest"
              @reject="onRejectRequest"
              @view-all="goToAppointments" />

            <UserProfileSidebar :user="currentUser" />
          </div>
        </aside>

        <v-btn
          color="primary"
          rounded="pill"
          size="large"
          class="text-none"
          :class="$style.fab"
          @click="mobilePanelOpen = !mobilePanelOpen">
          <v-icon
            :icon="mobilePanelOpen ? 'mdi-chevron-down' : 'mdi-account-clock'"
            start />
          {{ mobilePanelOpen ? 'Сховати панель' : 'Профіль і записи' }}
        </v-btn>
      </template>
    </template>

    <AppointmentsCalendarModal
      v-if="currentUser?.isMaster"
      v-model="appointmentsModalOpen"
      :initial-appointments="mainState.appointments"
      :master-id="currentUser.id"
      :is-master="currentUser.isMaster" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAppointments } from '@/actions/fetch-appointments';
import { acceptAppointment } from '@/actions/accept-appointment';
import { rejectAppointment } from '@/actions/reject-appointment';
import { mainState } from '@/state';
import UserProfileSidebar from '@/components/user-profile-sidebar.vue';
import UserAppointmentsSidebar from '@/components/user-appointments-sidebar.vue';
import MasterPendingRequests from '@/components/master-pending-requests.vue';
import AppointmentsCalendarModal from '@/components/appointments-calendar-modal.vue';
import type { CurrentUser } from '@/types/current-user';

defineProps<{
  currentUser: CurrentUser | null;
}>();

const loading = ref(false);
const router = useRouter();
const appointmentsModalOpen = ref(false);
const isCompactView = ref(false);
const mobilePanelOpen = ref(false);
let mediaQuery: MediaQueryList | null = null;
const updateView = () => {
  isCompactView.value = mediaQuery?.matches ?? false;
  if (!isCompactView.value) {
    mobilePanelOpen.value = false;
  }
};

onMounted(() => {
  if (typeof window === 'undefined') return;
  mediaQuery = window.matchMedia('(max-width: 1024px)');
  updateView();
  mediaQuery.addEventListener('change', updateView);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateView);
});

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

function onViewAllAppointments() {
  if (!mainState.currentUser?.isMaster) return;
  appointmentsModalOpen.value = true;
  mobilePanelOpen.value = false;
}

async function goToAppointments() {
  if (!mainState.currentUser) return;

  await router.push({
    name: 'profile',
    params: { id: mainState.currentUser.id },
    hash: '#appointments-section',
  });
  mobilePanelOpen.value = false;
}
</script>

<style module lang="scss">
.host {
  flex: 0 0 320px;
  display: block;
}

.host[data-compact="true"] {
  flex: 0 0 auto;
  display: contents;
}

.sidebar {
  flex-shrink: 0;
  width: 320px;
  position: sticky;
  top: 80px;
  padding-top: 24px;
}

@media (max-width: 1280px) {
  .sidebar {
    width: 280px;
  }
}

@media (max-width: 1024px) {
  .host[data-compact="true"] {
    display: contents;
  }

  .sidebar {
    position: static;
    width: 100%;
    padding-top: 16px;
  }
}

@media (max-width: 600px) {
  .sidebar {
    padding-top: 12px;
  }
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobileDrawer {
  background-color: #fff;
  border-radius: var(--radius-lg);
  bottom: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  left: 16px;
  max-height: 75vh;
  overflow-y: auto;
  padding: 8px 16px 16px;
  position: fixed;
  right: 16px;
  z-index: 950;
  transform: translateY(calc(100% + 24px));
  opacity: 0;
  pointer-events: none;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.mobileDrawer[data-open="true"] {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.drawerHeader {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0 12px;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
}

.drawerTitle {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-primary-dark);
}

.drawerHint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.drawerBackdrop {
  background-color: rgba(0, 0, 0, 0.35);
  inset: 0;
  position: fixed;
  z-index: 900;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.drawerBackdrop[data-open="true"] {
  opacity: 1;
  pointer-events: auto;
}

.fab {
  box-shadow: 0 10px 25px rgba(var(--color-primary-rgb), 0.4);
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 960;
}

@media (min-width: 1025px) {
  .mobileDrawer,
  .drawerBackdrop,
  .fab {
    display: none;
  }
}
</style>
