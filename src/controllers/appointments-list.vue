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
        @cancel="rejectAppointment"
        @reject="rejectAppointment" />
    </v-list>

    <p
      v-else
      :class="$style.empty"
      v-text="'Немає записів на цей період'" />

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
</script>

<style module lang="scss">
.empty {
  text-align: center;
  margin: 2rem 0;
}
</style>
