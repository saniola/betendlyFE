<template>
  <v-list-item>
    <v-list-item-title>
      {{ isMaster ? appointment.clientName : appointment.masterName }} — {{ appointment.serviceName }}
    </v-list-item-title>

    <v-list-item-subtitle>
      {{ formatDate(appointment.startUtc) }}

      ({{ formatTime(appointment.startUtc) }} – {{ formatTime(appointment.endUtc) }})
    </v-list-item-subtitle>

    <template #append>
      <div :class="$style.actions">
        <template v-if="isMaster && appointment.status === 0">
          <v-btn
            size="small"
            color="green"
            @click="$emit('accept', appointment.id)">
            Прийняти
          </v-btn>

          <v-btn
            size="small"
            color="red"
            @click="$emit('reject', { id: appointment.id, event: $event })">
            Відхилити
          </v-btn>
        </template>

        <template v-else-if="appointment.status === 1">
          <v-btn
            size="small"
            color="blue"
            @click="$emit('add-to-google-calendar', appointment)">
            Додати в Google Calendar
          </v-btn>

          <v-btn
            size="small"
            color="red"
            @click="$emit('cancel', { id: appointment.id, event: $event })">
            Скасувати
          </v-btn>
        </template>
      </div>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import type { Appointment } from '@/types/appointment';

defineProps<{
  appointment: Appointment;
  isMaster: boolean;
}>();

defineEmits<{
  (e: 'accept', data: string): void;
  (e: 'add-to-google-calendar', data: Appointment): void;
  (e: 'cancel', data: { id: string; event: Event }): void;
  (e: 'reject', data: { id: string; event: Event}): void;
}>();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style module lang="scss">
.actions {
  display: flex;
  gap: 8px;
}
</style>
