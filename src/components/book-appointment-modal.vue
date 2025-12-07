<template>
  <v-dialog
    v-model="dialog"
    max-width="960"
    scrollable>
    <v-card
      v-if="service"
      :class="$style.bookingCard">
      <v-card-title class="d-flex justify-space-between align-start">
        <div>
          <p class="text-overline text-medium-emphasis mb-1">
            Послуга
          </p>

          <h3 class="text-h6 mb-1">
            {{ service?.name }}
          </h3>

          <div :class="$style.serviceSummary">
            <span v-if="service?.durationMinutes">
              {{ service?.durationMinutes }} хв
            </span>

            <span v-if="service?.price">
              {{ service?.price }} грн
            </span>
          </div>
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
              :min="minBookingDate"
              :max="maxBookingDate"
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
              v-if="slotsLoading"
              class="d-flex justify-center py-6">
              <v-progress-circular
                color="primary"
                indeterminate />
            </div>

            <v-alert
              v-else-if="slotsError"
              type="error"
              variant="tonal">
              {{ slotsError }}
            </v-alert>

            <v-alert
              v-else-if="!slotSections.length"
              type="info"
              variant="tonal">
              Немає вільних слотів на цю дату
            </v-alert>

            <v-expansion-panels
              v-else
              v-model="expandedSections"
              multiple
              :class="$style.slotPanels">
              <v-expansion-panel
                v-for="section in slotSections"
                :key="section.key"
                :value="section.key">
                <v-expansion-panel-title>
                  {{ section.label }}
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <div :class="$style.slotList">
                    <v-btn
                      v-for="slot in section.slots"
                      :key="slot.startUtc"
                      :class="$style.slotButton"
                      :color="slot.startUtc === selectedSlotStartUtc ? 'primary' : undefined"
                      :variant="slot.startUtc === selectedSlotStartUtc ? 'flat' : 'tonal'"
                      :disabled="slot.isPast || bookingSubmitting"
                      rounded="pill"
                      @click="selectedSlotStartUtc = slot.startUtc">
                      {{ formatSlotLabel(slot.startUtc) }}
                    </v-btn>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn
          color="primary"
          variant="text"
          @click="close">
          Скасувати
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!selectedSlotStartUtc"
          :loading="bookingSubmitting"
          @click="submitBooking">
          Записатись
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { createBooking } from '@/actions/create-booking';
import { fetchAvailabilitySlots } from '@/actions/fetch-availability-slots';
import type { Slot } from '@/types/slot';
import type { ProfileService } from '@/types/user';

type SlotGroupKey = 'morning' | 'day' | 'evening';

interface SlotSection {
  key: SlotGroupKey;
  label: string;
  slots: Slot[];
}

const props = defineProps<{
  modelValue: boolean;
  service: ProfileService | null;
  masterId: string;
  clientId: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'booked'): void;
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const today = new Date();
const minBookingDate = formatDate(today);
const maxBookingDate = formatDate(addDays(today, 30));
const selectedDate = ref<string | Date>(minBookingDate);
const slots = ref<Slot[]>([]);
const slotsError = ref<string | null>(null);
const slotsLoading = ref(false);
const selectedSlotStartUtc = ref<string | null>(null);
const bookingSubmitting = ref(false);
const expandedSections = ref<string[]>([]);
const timezoneLabel = `Часовий пояс: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const timeFormatter = new Intl.DateTimeFormat('uk-UA', {
  hour: '2-digit',
  minute: '2-digit',
});

const resolvedMasterId = computed(() => props.service?.masterId ?? props.masterId);

const slotSections = computed<SlotSection[]>(() => {
  const groups: Record<SlotGroupKey, SlotSection> = {
    morning: { key: 'morning', label: 'Ранок', slots: [] },
    day: { key: 'day', label: 'День', slots: [] },
    evening: { key: 'evening', label: 'Вечір', slots: [] },
  };

  slots.value.forEach((slot) => {
    const groupKey = getSlotGroup(slot.startUtc);
    groups[groupKey].slots.push(slot);
  });

  return ['morning', 'day', 'evening']
    .map((key) => groups[key as SlotGroupKey])
    .filter((section) => section.slots.length > 0);
});

const selectedDateLabel = computed(() => (selectedDate.value ? dateFormatter.format(parseDate(selectedDate.value)) : ''));

watch(
  () => slotSections.value,
  (sections) => {
    expandedSections.value = sections.map((section) => section.key);
  },
  { immediate: true },
);

watch(
  () => [dialog.value, selectedDate.value, props.service?.id, resolvedMasterId.value],
  async ([isOpen]) => {
    if (!isOpen || !props.service || !resolvedMasterId.value) return;
    await loadSlots();
  },
);

watch(
  () => props.service?.id,
  () => {
    resetSelections();
  },
);

watch(
  () => dialog.value,
  (isOpen) => {
    if (!isOpen) {
      resetState();
    }
  },
);

onMounted(() => {
  resetSelections();
});

function resetSelections() {
  selectedSlotStartUtc.value = null;
  selectedDate.value = minBookingDate;
  slots.value = [];
  slotsError.value = null;
}

function resetState() {
  resetSelections();
  slotsLoading.value = false;
  bookingSubmitting.value = false;
}

function close() {
  dialog.value = false;
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0] ?? '';
}

function addDays(date: Date, days: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function parseDate(date: string | Date) {
  if (date instanceof Date) {
    return date;
  }

  const [yearStr, monthStr, dayStr] = date.split('-');
  const year = Number(yearStr ?? new Date().getFullYear());
  const month = Number(monthStr ?? 1);
  const day = Number(dayStr ?? 1);
  return new Date(year, month - 1, day);
}

function getSlotGroup(startUtc: string): SlotGroupKey {
  const hour = new Date(startUtc).getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'day';
  return 'evening';
}

function formatSlotLabel(startUtc: string) {
  return timeFormatter.format(new Date(startUtc));
}

function getSelectedDateString() {
  const value = selectedDate.value;
  if (value instanceof Date) {
    return formatDate(value);
  }

  return value;
}

async function loadSlots() {
  if (!props.service || !resolvedMasterId.value) return;
  slotsLoading.value = true;
  slotsError.value = null;

  try {
    const data = await fetchAvailabilitySlots(
      resolvedMasterId.value,
      props.service.id,
      getSelectedDateString(),
    );
    slots.value = data;

    if (!data.some((slot) => slot.startUtc === selectedSlotStartUtc.value)) {
      selectedSlotStartUtc.value = null;
    }
  } catch {
    slotsError.value = 'Не вдалося отримати вільні слоти. Спробуйте іншу дату.';
  } finally {
    slotsLoading.value = false;
  }
}

async function submitBooking() {
  if (!props.service || !selectedSlotStartUtc.value || !props.clientId || !resolvedMasterId.value) {
    return;
  }

  bookingSubmitting.value = true;

  try {
    await createBooking({
      masterId: resolvedMasterId.value,
      clientId: props.clientId,
      serviceId: props.service.id,
      startUtc: selectedSlotStartUtc.value,
      idempotencyKey: generateIdempotencyKey(),
    });

    emit('booked');
    close();
  } finally {
    bookingSubmitting.value = false;
  }
}

function generateIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
</script>

<style lang="scss" module>
.bookingCard {
  border-radius: var(--radius-xl);
}

.bookingLayout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.calendarWrapper,
.slotsWrapper {
  flex: 1 1 320px;
}

.slotsWrapper {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slotsHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.timezone {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-weight: 600;
}

.slotPanels {
  flex: 1;
}

.slotList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slotButton {
  min-width: 90px;
  justify-content: center;
  font-weight: 600;
}

.serviceSummary {
  display: flex;
  gap: 12px;
  font-weight: 500;
  color: #111;
}

.bookingCard :global(.v-date-picker) {
  width: 100%;
}

.slotPanels :global(.v-expansion-panel-title__overlay) {
  border-radius: var(--radius-pill);
}

@media (max-width: 600px) {
  .bookingLayout {
    flex-direction: column;
  }
}
</style>

