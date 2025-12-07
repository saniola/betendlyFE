<template>
  <v-dialog
    v-model="dialog"
    max-width="960"
    scrollable>
    <v-card :class="$style.bookingCard">
      <v-card-title class="d-flex justify-space-between align-start">
        <div>
          <p class="text-overline text-medium-emphasis mb-1">
            {{ isMaster ? 'Записи майстра' : 'Мої записи' }}
          </p>

          <h3 class="text-h6 mb-1">
            Перегляд за датою
          </h3>
        </div>

        <v-btn
          icon="mdi-close"
          color="primary"
          variant="text"
          @click="close" />
      </v-card-title>

      <v-card-text>
        <div :class="$style.bookingLayout">
          <div :class="$style.calendarWrapper">
            <v-date-picker
              v-model="selectedDate"
              color="primary"
              first-day-of-week="1"
              show-adjacent-months />
          </div>

          <div :class="$style.slotsWrapper">
            <div :class="$style.slotsHeader">
              <div>
                <p class="text-body-2 text-medium-emphasis mb-1">
                  Обрана дата
                </p>

                <p class="text-h6 mb-0">
                  {{ selectedDateLabel }}
                </p>
              </div>

              <span :class="$style.timezone">
                {{ timezoneLabel }}
              </span>
            </div>

            <div
              v-if="monthLoading"
              class="d-flex justify-center py-6">
              <v-progress-circular
                color="primary"
                indeterminate />
            </div>

            <v-alert
              v-else-if="loadError"
              type="error"
              variant="tonal">
              {{ loadError }}
            </v-alert>

            <div v-else-if="appointmentsForDate.length === 0" class="py-6">
              <v-alert type="info" variant="tonal">
                На цю дату немає записів
              </v-alert>
            </div>

            <div v-else :class="$style.appointmentsList">
              <div
                v-for="appointment in appointmentsForDate"
                :key="appointment.id"
                :class="$style.appointmentItem">
                <div>
                  <p :class="$style.appointmentTime">
                    {{ formatAppointmentTime(appointment.startUtc) }} —
                    {{ formatAppointmentTime(appointment.endUtc) }}
                  </p>

                  <p :class="$style.appointmentService">
                    {{ appointment.serviceName }}
                  </p>

                  <p :class="$style.appointmentClient">
                    {{ appointment.clientName }}
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
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Appointment } from '@/types/appointment';
import { api } from '@/utils/http';

const props = defineProps<{
  modelValue: boolean;
  initialAppointments?: Appointment[];
  isMaster?: boolean;
  masterId?: string;
  clientId?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const selectedDate = ref<string | Date>(new Date());
const timezoneLabel = `Часовий пояс: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
const appointmentsByDate = ref<Record<string, Appointment[]>>({});
const monthLoading = ref(false);
const loadError = ref<string | null>(null);
const loadedMonths = new Set<string>();

const selectedDateKey = computed(() =>
  typeof selectedDate.value === 'string'
    ? selectedDate.value
    : formatDateKey(selectedDate.value),
);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedDate.value = new Date();
      mergeAppointments(props.initialAppointments ?? []);
      void ensureMonthLoaded(parseDate(selectedDateKey.value));
    }
  },
);

watch(
  () => props.initialAppointments,
  (appointments) => {
    if (appointments?.length) {
      mergeAppointments(appointments);
    }
  },
);

watch(selectedDateKey, (value) => {
  if (!dialog.value) return;
  void ensureMonthLoaded(parseDate(value));
});

const selectedDateLabel = computed(() => {
  const date = parseDate(selectedDateKey.value);
  return new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
});

const appointmentsForDate = computed(() => {
  const list = appointmentsByDate.value[selectedDateKey.value] ?? [];
  return [...list].sort(
    (a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime(),
  );
});

function close() {
  dialog.value = false;
}

async function ensureMonthLoaded(date: Date) {
  const key = monthKey(date);
  if (loadedMonths.has(key)) return;

  await fetchMonth(date, key);
}

async function fetchMonth(date: Date, monthKeyValue: string) {
  if (!props.masterId && !props.clientId) return;

  monthLoading.value = true;
  loadError.value = null;

  try {
    const params = {
      masterId: props.masterId,
      clientId: props.clientId,
      fromUtc: startOfMonth(date).toISOString(),
      toUtc: endOfMonth(date).toISOString(),
    };

    const { data } = await api.get<Appointment[]>('/bookings', { params });
    mergeAppointments(data);
    loadedMonths.add(monthKeyValue);
  } catch (error) {
    console.error('Failed to load appointments by month', error);
    loadError.value = 'Не вдалося завантажити записи';
  } finally {
    monthLoading.value = false;
  }
}

function mergeAppointments(appointments: Appointment[]) {
  if (!appointments?.length) return;

  const updated = { ...appointmentsByDate.value };

  appointments.forEach(appointment => {
    const dateKey = formatDateKey(new Date(appointment.startUtc));
    const list = updated[dateKey] ? [...updated[dateKey]] : [];
    const existingIndex = list.findIndex(item => item.id === appointment.id);

    if (existingIndex >= 0) {
      list[existingIndex] = appointment;
    } else {
      list.push(appointment);
    }

    list.sort((a, b) => new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime());
    updated[dateKey] = list;
  });

  appointmentsByDate.value = updated;
}

function parseDate(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if ([year, month, day].some(part => Number.isNaN(part))) {
    return new Date(value);
  }

  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function formatAppointmentTime(dateString: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getStatusColor(status: number): string {
  switch (status) {
    case 1:
      return 'success';
    case 0:
      return 'warning';
    case 2:
      return 'error';
    default:
      return 'default';
  }
}

function getStatusLabel(status: number): string {
  switch (status) {
    case 1:
      return 'Підтверджено';
    case 0:
      return 'Очікує';
    case 2:
      return 'Скасовано';
    default:
      return 'Невідомо';
  }
}
</script>

<style module lang="scss">
.bookingCard {
  min-height: 520px;
}

.bookingLayout {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.calendarWrapper {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background-color: var(--color-surface);
  display: flex;
}

.calendarWrapper :global(.v-date-picker) {
  width: 100%;
}

.slotsWrapper {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 420px;
}

.slotsHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.timezone {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 4px 12px;
}

.appointmentsList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointmentItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background-color: var(--color-background-soft);
}

.appointmentTime {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--color-primary-dark);
}

.appointmentService {
  margin: 0;
  color: #000;
  font-weight: 500;
}

.appointmentClient {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
