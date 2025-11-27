<template>
  <footer :class="$style.component">
    <div class="container" :class="$style.wrapper">
      <div :class="$style.brand">
        <RouterLink
          to="/"
          :class="$style.logoLink">
          <img
            alt="BeTendly"
            height="32"
            src="@/assets/logo.png"
            width="120" />
        </RouterLink>

        <p :class="$style.copy">
          © 2025 BeTendly. Всі права захищено.
        </p>
      </div>

      <div :class="$style.contacts">
        <p :class="$style.title">
          Контакти
        </p>

        <ul :class="$style.contactList">
          <li
            v-for="contact in contacts"
            :key="contact.value"
            :class="$style.contactItem">
            <span :class="$style.label">
              {{ `${contact.label}:` }}
            </span>

            <a
              v-if="contact.href"
              :href="contact.href"
              :class="$style.valueLink"
              rel="noopener"
              target="_blank">
              {{ contact.value }}
            </a>

            <span
              v-else
              :class="$style.value">
              {{ contact.value }}
            </span>
          </li>
        </ul>
      </div>

      <div :class="$style.socials">
        <a
          v-for="social in socialLinks"
          :key="social.icon"
          :href="social.href"
          :class="$style.socialIcon"
          rel="noopener"
          target="_blank">
          <v-icon
            :icon="social.icon"
            color="#6c7480"
            size="28" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

const contacts: ContactItem[] = [
  {
    label: 'Email',
    value: 'info@betendly.com',
    href: 'mailto:info@betendly.com',
  },
  {
    label: 'Телефон',
    value: '+380 44 123 4567',
    href: 'tel:+380441234567',
  },
  {
    label: 'Адреса',
    value: 'вул. Прикладна, 1, Київ',
    href: 'https://maps.google.com/?q=вул.+Прикладна,+1,+Київ',
  },
];

const socialLinks = [
  {
    icon: 'mdi-facebook',
    href: 'https://facebook.com/betendly',
  },
  {
    icon: 'mdi-instagram',
    href: 'https://instagram.com/betendly',
  },
  {
    icon: 'mdi-linkedin',
    href: 'https://linkedin.com/company/betendly',
  },
];
</script>

<style module lang="scss">
.component {
  background-color: #fff;
  border-top: 1px solid #e4e9f2;
  margin-top: 48px;
  padding: 48px 0;
}

.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 32px;
  text-align: center;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logoLink {
  align-items: center;
  display: inline-flex;
}

.copy {
  color: #6c7480;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.contacts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  color: #111a2c;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.contactList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
}

.contactItem {
  color: #4c5566;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  color: #111a2c;
  font-weight: 600;
}

.value,
.valueLink {
  color: #4c5566;
  font-size: 1.05rem;
  line-height: 1.4;
}

.valueLink {
  &:hover {
    color: #1976d2;
  }
}

.socials {
  display: flex;
  gap: 20px;
}

.socialIcon {
  align-items: center;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  width: 40px;

  &:hover {
    opacity: 0.7;
  }
}

@media (min-width: 960px) {
  .wrapper {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .contactItem {
    flex-direction: row;
    gap: 8px;
  }
}
</style>
