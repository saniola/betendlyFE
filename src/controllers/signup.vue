<template>
  <v-card
    max-width="500"
    :class="[
      'mx-auto mt-10 pa-6',
      $style.card,
    ]">
    <v-card-title class="text-h5 font-weight-bold">
      Sign Up
    </v-card-title>

    <v-form
      v-model="valid"
      @submit.prevent="onSubmit">
      <v-text-field
        v-model="firstName"
        label="First Name"
        variant="outlined"
        :rules="[rules.required]" />

      <v-text-field
        v-model="lastName"
        label="Last Name"
        variant="outlined"
        :rules="[rules.required]" />

      <v-text-field
        v-model="email"
        label="Email"
        variant="outlined"
        :rules="[rules.required, rules.email]" />

      <v-text-field
        v-model="password"
        label="Password"
        variant="outlined"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        :rules="[rules.required, rules.min(6)]"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword" />

      <v-checkbox
        v-model="isMaster"
        color="primary"
        label="Is master?" />

      <v-btn
        block
        class="mt-4"
        color="primary"
        type="submit"
        :disabled="!valid">
        Sign Up
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signup } from '@/actions/signup';
import { testEmail } from '@/helpers/test-email';
import router from '@/router';

if (localStorage.getItem('token')) {
  router.push({ name: 'home' });
}

const valid = ref(false);
const showPassword = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isMaster = ref(false);

const rules = {
  required: (v: string) => !!v || 'Required.',
  email: (v: string) => testEmail(v),
  min: (min: number) => (v: string) =>
    (v && v.length >= min) || `Min ${min} characters.`,
};

function onSubmit() {
  if (!valid.value) return;
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    isMaster: isMaster.value,
  };

  signup(data);
}
</script>

<style module lang="scss">
.card {
  width: 300px;
}

@media (min-width: 1024px) {
  .card {
    width: 500px;
  }
}
</style>
