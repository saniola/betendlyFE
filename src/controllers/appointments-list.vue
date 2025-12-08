<template>
  <div class="pa-4">
    <PeriodNav
      :currentMonth="displayDate"
      :is-master
      :is-prev-disabled
      @next-month="onNextClick"
      @prev-month="onPrevClick" />

    <v-list
      v-if="mainState.appointments.length"
      lines="two">
      <AppointmentItem
        v-for="appointment in mainState.appointments"
        :appointment="appointment"
        :is-master
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
      :currentMonth="displayDate"
      :is-master
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
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
} from '@/helpers/dates';

const isMaster = computed(() => mainState.user?.isMaster ?? false);
const today = new Date();
const periodStart = ref(isMaster.value ? startOfDay(today) : new Date(today));
const periodEnd = ref(isMaster.value ? endOfDay(today) : endOfMonth(today));
const displayDate = computed(() => (isMaster.value ? periodStart.value : new Date(periodStart.value)));
const isConfirmVisible = ref(false);
const appointmentId = ref<string | null>(null);
const actionElement = ref<HTMLElement | null>(null);
const isPrevDisabled = computed(() => {
  if (isMaster.value) {
    return periodStart.value.toDateString() === today.toDateString();
  }

  const prevMonth = new Date(periodStart.value);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  return (
    prevMonth.getFullYear() < today.getFullYear() ||
    (prevMonth.getFullYear() === today.getFullYear() &&
    prevMonth.getMonth() < today.getMonth())
  );
});

fetchAppointments(periodStart.value, periodEnd.value);

function onNextClick() {
  if (isMaster.value) {
    const next = new Date(periodStart.value);
    next.setDate(next.getDate() + 1);
    periodStart.value = startOfDay(next);
    periodEnd.value = endOfDay(next);
    fetchAppointments(periodStart.value, periodEnd.value);
    return;
  }

  const nextMonth = new Date(periodStart.value);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  periodStart.value = startOfMonth(nextMonth);
  periodEnd.value = endOfMonth(nextMonth);
  fetchAppointments(periodStart.value, periodEnd.value);
}

function onPrevClick() {
  if (isMaster.value) {
    const prev = new Date(periodStart.value);
    prev.setDate(prev.getDate() - 1);

    periodStart.value = startOfDay(prev);
    periodEnd.value = endOfDay(prev);
    fetchAppointments(periodStart.value, periodEnd.value);
    return;
  }

  const prevMonth = new Date(periodStart.value);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  const invalidPrev =
    prevMonth.getFullYear() < today.getFullYear() ||
    (prevMonth.getFullYear() === today.getFullYear() &&
    prevMonth.getMonth() < today.getMonth());

  if (invalidPrev) return;

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
    text: `${appointment.serviceName} - ${isMaster.value ? appointment.clientName : appointment.masterName}`,
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
