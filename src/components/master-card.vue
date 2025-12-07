<template>
  <li>
    <RouterLink
      :to="`/member/${master.userId}`"
      :class="$style.cardLink">
      <v-card :class="$style.component">
        <div :class="$style.avatar">
          <img
            :alt="master.fullName"
            :src="props.master.avatarUrl || defaultAvatar" />
        </div>

        <div :class="$style.info">
          <h3 :class="$style.name">
            {{ master.fullName }}
          </h3>

          <p
            v-if="master.about"
            :class="$style.about">
            {{ master.about }}
          </p>

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
            <span class="text-body-2">
              {{ fullAddress }}
            </span>
          </p>

          <div :class="$style.rating">
            <v-rating
              :model-value="4.7"
              half-increments
              readonly
              color="amber"
              size="24" />

            <span>4.7</span>

            <span
              :class="$style.feedbacks">
              (12 відгуків)
            </span>
          </div>
        </div>
      </v-card>
    </RouterLink>
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
.cardLink {
  display: block;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.component {
  align-items: center;
  display: flex !important; //to override v-card
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px !important; //to override v-card
  transition: box-shadow 0.2s ease;

  .cardLink:hover & {
    box-shadow: 0 4px 20px rgba(var(--color-primary-rgb), 0.15);
  }
}

.avatar {
  margin-bottom: 12px;

  img {
    display: block;
    border-radius: var(--radius-full);
    height: 100px;
    width: 100px;
    object-fit: cover;
  }
}

.info {
  width: 100%;
}

.name {
  color: #000;
  margin-bottom: 8px;
  font-size: 1.25rem;
  font-weight: 600;

  .cardLink:hover & {
    color: var(--color-primary);
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
  background-color: var(--color-chip);
  color: var(--color-white);
  border-radius: var(--radius-xxs);
  padding: 3px;
}

.address {
  align-items: center;
  display: flex;
  margin-bottom: 8px;
  color: #000;

  span {
    color: inherit;
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
