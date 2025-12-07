<template>
  <v-card>
    <v-card-title>
      {{ isMaster ? 'Записи на сьогодні' : 'Мої записи' }}
    </v-card-title>

    <v-card-text>
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32" />
      </div>

      <div v-else-if="appointments.length === 0" class="text-center text-medium-emphasis">
        <p v-if="isMaster">
          На сьогодні немає записів
        </p>
        <p v-else>
          У вас поки немає активних записів
        </p>
      </div>

      <div v-else :class="$style.appointmentsList">
        <div
          v-for="appointment in appointments"
          :key="appointment.id"
          :class="$style.appointmentItem">
          <div :class="$style.appointmentInfo">
            <p :class="$style.appointmentTime">
              {{ formatAppointmentTime(appointment.startUtc) }}
            </p>
            <p :class="$style.appointmentService">
              {{ appointment.serviceName }}
            </p>
          </div>
          <v-chip
            :color="getStatusColor(appointment.status)"
            size="small"
            variant="flat">
            {{ getStatusLabel(appointment.status) }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Appointment } from '@/types/appointment';

defineProps<{
  appointments: Appointment[];
  isMaster?: boolean;
  loading?: boolean;
}>();

function formatAppointmentTime(startUtc: string): string {
  const date = new Date(startUtc);
  const timeFormatter = new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
  });
  const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric' as const,
    month: 'short' as const,
  });

  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}

function getStatusColor(status: number): string {
  switch (status) {
    case 1: // confirmed
      return 'success';
    case 0: // pending
      return 'warning';
    case 2: // cancelled
      return 'error';
    default:
      return 'default';
  }
}

function getStatusLabel(status: number): string {
  switch (status) {
    case 1: // confirmed
      return 'Підтверджено';
    case 0: // pending
      return 'Очікує';
    case 2: // cancelled
      return 'Скасовано';
    default:
      return 'Невідомо';
  }
}
</script>

<style module lang="scss">
.appointmentsList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointmentItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-background-soft);
  }
}

.appointmentInfo {
  flex: 1;
  min-width: 0;
}

.appointmentTime {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin: 0 0 4px 0;
}

.appointmentService {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

