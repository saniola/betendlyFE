<template>
  <v-container
    v-if="user"
    class="py-6">
    <v-card
      class="pa-4"
      elevation="2">
      <v-row
        align="center"
        no-gutters>
        <v-col cols="auto">
          <v-avatar size="96">
            <v-img
              :src="user.avatarUrl || defaultAvatar"
              alt="User avatar" />
          </v-avatar>
        </v-col>

        <v-col class="pl-4">
          <h2
            class="text-h5 mb-1"
            v-text="fullName" />

          <p :class="$style.contact">
            <a
              :href="`mailto:${user.email}`"
              class="text-body-2 text-medium-emphasis mb-0"
              v-text="user.email" />
          </p>
          
          <p
            v-if="user.phone"
            :class="$style.contact">
            <a
              :href="`tel:${user.phone}`"
              class="text-body-2 text-medium-emphasis mb-0"
              v-text="user.phone" />
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <template v-if="user.isMaster && user.master">
        <p
          class="mb-4"
          v-text="user.master.about" />

        <template v-if="user.master.city || user.master.yearsExperience">
          <v-row dense>
            <v-col
              v-if="user.master.city"
              cols="12" md="6"
              class="d-flex">
              <v-icon icon="mdi-map-marker" start />

              <a
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`"
                target="_blank"
                rel="noopener"
                :class="[
                  'text-body-2 d-flex align-center',
                  $style.address,
                ]"
                v-text="fullAddress" />
            </v-col>

            <v-col
              v-if="user.master.yearsExperience"
              cols="12" md="6">
              <v-icon
                icon="mdi-briefcase"
                start />
                
              Досвід: {{ user.master.yearsExperience }} років
            </v-col>
          </v-row>

          <v-divider class="my-4" />
        </template>

        <template v-if="user.master.skills?.length">
          <h3
            class="text-h6 mb-2"
            v-text="'Навички'" />

          <div :class="$style.skills">
            <v-chip
              v-for="(skill, i) in user.master.skills"
              :key="i"
              color="primary"
              flat
              size="small"
              variant="flat"
              :text="skill" />
          </div>

          <v-divider class="my-4" />
        </template>

        <template v-if="user.master.services?.length">
          <h3
            class="text-h6 mb-2"
            v-text="'Послуги'" />

          <v-table>
            <thead>
              <tr>
                <th
                  class="text-left"
                  v-text="'Назва'" />

                <th
                  class="text-left"
                  v-text="'Опис'" />

                <th
                  class="text-left"
                  v-text="'Тривалість'" />

                <th
                  class="text-left"
                  v-text="'Ціна'" />

                <th />
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="service in user.master.services"
                :key="service.id">
                <td v-text="service.name" />

                <td v-text="service.description" />

                <td v-text="`${service.durationMinutes} хв`" />

                <td v-text="`${service.price} грн`" />

                <td>
                  <v-btn
                    color="primary"
                    type="button"
                    @click="bookAppointment"
                    v-text="'Записатись'" />
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>
      </template>

      <template v-if="mainState.currentUser?.id === user.id">
        <v-divider class="my-4" />

        <h2
          class="text-h5 mb-1"
          v-text="'Ваші записи'" />

        <AppointmentsList />
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMember } from '@/actions/fetch-member';
import { defaultAvatar } from '@/config';
import AppointmentsList from '@/controllers/appointments-list.vue';
import router from '@/router';
import { mainState } from '@/state';

const user = computed(() => mainState.user);
const fullName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`);
const route = useRoute();
const fullAddress = computed(() => `${user.value?.master?.city}${user.value?.master?.address ? ', ' + user.value.master.address : ''}`);

fetchMember(route.params.id as string);

function bookAppointment() {
  if (!mainState.currentUser) {
    router.push({ name: 'login' });
    return;
  }

  alert('Booking functionality is not implemented yet.');
}
</script>

<style lang="scss" module>
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.contact {
  margin-bottom: .5rem;

  a {
    &:hover {
      opacity: 0.8;
    }
  }
}

.address {
  color: #000;

  &:hover {
    opacity: 0.8;
  }
}
</style>
