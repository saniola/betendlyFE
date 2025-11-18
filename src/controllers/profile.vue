<template>
  <v-container
    v-if="user"
    class="py-6">
    <v-card class="pa-4" elevation="2">
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <v-avatar size="96">
            <v-img
              :src="user.avatarUrl || defaultAvatar"
              alt="User avatar" />
          </v-avatar>
        </v-col>

        <v-col class="pl-4">
          <h2 class="text-h5 mb-1">{{ fullName }}</h2>

          <p :class="$style.contact">
            <a :href="`mailto:${user.email}`" class="text-body-2 text-medium-emphasis mb-0">{{ user.email }}</a>
          </p>
          
          <p
            v-if="user.phone"
            :class="$style.contact">
            <a :href="`tel:${user.phone}`" class="text-body-2 text-medium-emphasis mb-0">{{ user.phone }}</a>
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <template v-if="user.isMaster && user.master">
        <p class="mb-4">{{ user.master.about }}</p>

        <template v-if="user.master.address || user.master.yearsExperience">
          <v-row dense>
            <v-col
              v-if="user.master.address"
              cols="12" md="6"
              class="d-flex">
              <v-icon icon="mdi-map-marker" start />

              <a
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.master.address)}`"
                target="_blank"
                rel="noopener"
                :class="[
                  'text-body-2 d-flex align-center',
                  $style.address,
                ]"
                v-text="user.master.address" />
            </v-col>

            <v-col
              v-if="user.master.yearsExperience"
              cols="12" md="6">
              <v-icon icon="mdi-briefcase" start /> Досвід: {{ user.master.yearsExperience }} років
            </v-col>
          </v-row>

          <v-divider class="my-4" />
        </template>

        <template v-if="user.master.skills?.length">
          <h3 class="text-h6 mb-2">Навички</h3>

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
          <h3 class="text-h6 mb-2">Послуги</h3>

          <v-table>
            <thead>
              <tr>
                <th class="text-left">Назва</th>

                <th class="text-left">Опис</th>

                <th class="text-left">Тривалість</th>

                <th class="text-left">Ціна</th>

                <th />
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="service in user.master.services"
                :key="service.id">
                <td>{{ service.name }}</td>

                <td>{{ service.description }}</td>

                <td>{{ service.durationMinutes }} хв</td>

                <td>{{ service.price }} грн</td>

                <td>
                  <v-btn
                    color="primary"
                    type="button">
                    Записатись
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMember } from '@/actions/fetch-member';
import { defaultAvatar } from '@/config';
import { mainState } from '@/state';

const user = computed(() => mainState.user);
const fullName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`);
const route = useRoute();

fetchMember(route.params.id as string);
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
