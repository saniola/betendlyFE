<template>
  <v-card>
    <v-card-title
      :class="[$style.cardHeader, 'd-flex align-center justify-space-between']"
      role="button"
      tabindex="0"
      @click="emit('view-all')"
      @keydown.enter.prevent="emit('view-all')"
      @keydown.space.prevent="emit('view-all')">
      <span>Активні запити</span>
      <v-icon icon="mdi-arrow-top-right" size="small" />
    </v-card-title>

    <v-card-text>
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular
          color="primary"
          indeterminate
          size="32" />
      </div>

      <div v-else-if="limitedRequests.length === 0" class="text-center text-medium-emphasis">
        <p>Немає активних запитів на запис</p>
      </div>

      <div v-else :class="$style.requestsList">
        <div
          v-for="request in limitedRequests"
          :key="request.id"
          :class="$style.requestItem">
          <div :class="$style.requestHeader">
            <div :class="$style.requestInfo">
              <p :class="$style.requestTime">
                {{ formatRequestDateTime(request.startUtc) }}
              </p>
              <p :class="$style.clientName">
                {{ request.clientName }}
              </p>
              <p :class="$style.serviceName">
                {{ request.serviceName }}
              </p>
            </div>

            <div :class="$style.requestActions">
              <v-btn
                color="success"
                size="small"
                variant="flat"
                :loading="acceptingIds.includes(request.id)"
                :disabled="rejectingIds.includes(request.id)"
                @click="onAccept(request.id)">
                Прийняти
              </v-btn>

              <v-btn
                color="error"
                size="small"
                variant="outlined"
                :loading="rejectingIds.includes(request.id)"
                :disabled="acceptingIds.includes(request.id)"
                @click="onReject(request.id)">
                Відхилити
              </v-btn>
            </div>
          </div>

        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Appointment } from '@/types/appointment';

const props = defineProps<{
  requests: Appointment[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'accept', id: string): void;
  (e: 'reject', id: string): void;
  (e: 'view-all'): void;
}>();

const acceptingIds = ref<string[]>([]);
const rejectingIds = ref<string[]>([]);

const sortedRequests = computed(() => {
  return [...props.requests].sort((a, b) => {
    return new Date(a.startUtc).getTime() - new Date(b.startUtc).getTime();
  });
});

const limitedRequests = computed(() => sortedRequests.value.slice(0, 6));

function formatRequestDateTime(startUtc: string): string {
  const date = new Date(startUtc);
  const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric' as const,
    month: 'long' as const,
    year: 'numeric' as const,
  });
  const timeFormatter = new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
  });

  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}

function onAccept(id: string) {
  acceptingIds.value.push(id);
  emit('accept', id);
}

function onReject(id: string) {
  rejectingIds.value.push(id);
  emit('reject', id);
}

defineExpose({
  clearLoadingStates: () => {
    acceptingIds.value = [];
    rejectingIds.value = [];
  },
});
</script>

<style module lang="scss">
.requestsList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cardHeader {
  cursor: pointer;
  user-select: none;

  &:hover {
    color: var(--color-primary-dark);
  }
}

.requestItem {
  padding: 16px;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--color-primary);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-background-soft);
    box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.1);
  }
}

.requestHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.requestInfo {
  flex: 1;
  min-width: 0;
}

.requestTime {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin: 0 0 4px 0;
}

.clientName {
  font-size: 0.95rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
}

.serviceName {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.requestActions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 400px) {
  .requestHeader {
    flex-direction: column;
  }

  .requestActions {
    width: 100%;
    flex-direction: row;
  }
}
</style>
