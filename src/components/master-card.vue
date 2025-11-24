<template>
  <li>
    <v-card :class="$style.component">
      <RouterLink
        :class="$style.avatar"
        :to="`/member/${master.userId}`">
        <img
          :alt="master.fullName"
          :src="props.master.avatarUrl || defaultAvatar" />
      </RouterLink>

      <div :class="$style.info">
        <h3 :class="$style.name">
          <RouterLink
            :to="`/member/${master.userId}`"
            v-text="master.fullName" />
        </h3>

        <p 
          v-if="master.about"
          :class="$style.about"
          v-text="master.about" />

        <ul
          v-if="master.skills && master.skills.length"
          :class="$style.skills">
          <li
            v-for="skill in master.skills"
            :key="skill">
            <v-chip
              color="primary"
              flat
              size="small"
              variant="flat"
              :text="skill"/>
          </li>
        </ul>

        <p
          v-if="master.city"
          :class="$style.address">
          <v-icon icon="mdi-map-marker" start />

          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`"
            target="_blank"
            rel="noopener"
            class="text-body-2 d-flex align-center"
            v-text="fullAddress" />
        </p>

        <div :class="$style.rating">
          <v-rating
            :model-value="4.7"
            half-increments
            readonly
            color="amber"
            size="24" />
          
          <span v-text="4.7" />

          <span
            :class="$style.feedbacks"
            v-text="`(12 відгуків)`"/>
        </div>
      </div>
    </v-card>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { defaultAvatar } from '@/config';
import type { Master } from '@/types/master';

const props = defineProps<{
  master: Master;
}>();

const fullAddress = computed(() => `${props.master.city}${props.master.address ? ', ' + props.master.address : ''}`);
</script>

<style module lang="scss">
.component {
  align-items: center;
  display: flex !important; //to override v-card
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px !important; //to override v-card
}

.avatar {
  margin-bottom: 12px;

  img {
    display: block;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    object-fit: cover;
  }
}

.info {
  width: 100%;
}

.name {
  margin-bottom: 8px;

  a {
    color: #000;

    &:hover {
      opacity: 0.6;
    }
  }
}

.about {
  color: gray;
  font-weight: 600;
  margin-bottom: 8px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  list-style: none;
}

.skill {
  background-color: #a0e5fa;
  border-radius: 3px;
  padding: 3px;
}

.address {
  align-items: center;
  display: flex;
  margin-bottom: 8px;

  a {
    color: #000;

    &:hover {
      opacity: 0.8;
    }
  }
}

.rating {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.feedbacks {
  color: gray;
}

@media (min-width: 768px) {
  .component {
    align-items: flex-start;
    flex-direction: row;
    column-gap: 24px;
    margin-bottom: 24px;
  }
}
</style>
