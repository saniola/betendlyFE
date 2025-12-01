<template>
  <div class="pa-4">
    <PeriodNav
      :currentMonth="currentMonth"
      :is-prev-disabled
      @next-month="onNextClick"
      @prev-month="onPrevClick" />

    <v-list
      v-if="filteredAppointments.length"
      lines="two">
      <AppointmentItem
        v-for="appointment in filteredAppointments"
        :appointment="appointment"
        :is-master="mainState.user?.isMaster || false"
        :key="appointment.id"
        @accept="acceptAppointment"
        @add-to-google-calendar="addToGoogleCalendar"
        @cancel="openConfirmModal"
        @reject="openConfirmModal" />

        <v-menu
          v-model="isConfirmVisible"
          location="bottom"
          offset-y
          :activator="actionElement"
          :class="$style.modal"
          @click:outside.stop>
          <v-card class="pa-3" min-width="200">
            <div class="text-subtitle-2 mb-2">Ви впевнені?</div>

            <div class="d-flex justify-end gap-2">
              <v-btn size="small" variant="text" @click="closeModal">
                Ні
              </v-btn>

              <v-btn
                size="small"
                color="primary"
                @click="onConfirmClick">
                Так
              </v-btn>
            </div>
          </v-card>
        </v-menu>
    </v-list>

    <p
      v-else
      :class="$style.empty">
      Немає записів на цей період
    </p>

    <PeriodNav
      :currentMonth="currentMonth"
      :is-prev-disabled
      @next-month="onNextClick"
      @prev-month="onPrevClick" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { acceptAppointment } from '@/actions/accept-appointment';
import { rejectAppointment } from '@/actions/reject-appointment';
import { fetchAppointments } from '@/actions/fetch-appointments';
import AppointmentItem from '@/components/appointment.vue';
import PeriodNav from '@/components/period-nav.vue';
import { mainState } from '@/state';
import type { Appointment } from '@/types/appointment';

const currentMonth = ref(new Date());
const today = new Date();
const periodStart = ref(new Date(today));
const periodEnd = ref(endOfMonth(today));
const isConfirmVisible = ref(false);
const appointmentId = ref<string | null>(null);
const actionElement = ref<HTMLElement | null>(null);
const isPrevDisabled = computed(() => {
  const prevMonth = new Date(periodStart.value);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  return (
    prevMonth.getFullYear() < today.getFullYear() ||
    (prevMonth.getFullYear() === today.getFullYear() &&
      prevMonth.getMonth() < today.getMonth())
  );
});

const filteredAppointments = computed(() => mainState.appointments.filter((item: Appointment) => {
    const start = new Date(item.startUtc);
    return (
      start.getMonth() === currentMonth.value.getMonth() &&
      start.getFullYear() === currentMonth.value.getFullYear()
    );
  }),
);

fetchAppointments(periodStart.value, periodEnd.value);

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function onNextClick() {
  const nextMonth = new Date(periodStart.value);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  periodStart.value = startOfMonth(nextMonth);
  periodEnd.value = endOfMonth(nextMonth);
  fetchAppointments(periodStart.value, periodEnd.value);
}

function onPrevClick() {
  const prevMonth = new Date(periodStart.value);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  const isGoingToCurrentMonth =
    prevMonth.getFullYear() === today.getFullYear() &&
    prevMonth.getMonth() === today.getMonth();

  if (isGoingToCurrentMonth) {
    periodStart.value = today;
    periodEnd.value = endOfMonth(today);
    return;
  }

  const wouldBeBeforeCurrent =
    prevMonth.getFullYear() < today.getFullYear() ||
    (prevMonth.getFullYear() === today.getFullYear() &&
     prevMonth.getMonth() < today.getMonth());

  if (wouldBeBeforeCurrent) return;

  periodStart.value = startOfMonth(prevMonth);
  periodEnd.value = endOfMonth(prevMonth);
  fetchAppointments(periodStart.value, periodEnd.value);
}

function addToGoogleCalendar(appointment: Appointment) {
  const start = new Date(appointment.startUtc);
  const end = new Date(appointment.endUtc);

  const format = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const startStr = format(start);
  const endStr = format(end);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${appointment.serviceName} - ${mainState.user?.isMaster ? appointment.clientName : appointment.masterName}`,
    dates: `${startStr}/${endStr}`,
    details: `Запис на ${appointment.serviceName}`,
  });

  window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
}

function openConfirmModal({ id, event }: { id: string; event: Event }) {
  appointmentId.value = id;
  actionElement.value = event.currentTarget as HTMLElement;
  setTimeout(() => {
    isConfirmVisible.value = true;
  }, 0);
}

function onConfirmClick() {
  rejectAppointment(appointmentId.value!);
  closeModal();
}

function closeModal() {
  isConfirmVisible.value = false;
  setTimeout(() => {
    actionElement.value = null;
  }, 0);
}
</script>

<style module lang="scss">
.empty {
  text-align: center;
  margin: 2rem 0;
}

.modal {
  width: 300px;
}
</style>
