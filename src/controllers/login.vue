<template>
  <v-card
    max-width="500"
    :class="[
      'mx-auto mt-10 pa-6',
      $style.card,
    ]">
    <v-card-title class="text-h5 font-weight-bold">
      Login
    </v-card-title>

    <v-form
      v-model="valid"
      @submit.prevent="onSubmit">
      <v-text-field
        v-model="email"
        label="Email"
        prepend-icon="mdi-email"
        variant="outlined"
        :rules="[rules.required, rules.email]" />

      <v-text-field
        v-model="password"
        label="Password"
        prepend-icon="mdi-lock"
        variant="outlined"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        :rules="[rules.required]"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword" />

      <v-btn
        block
        class="mt-4"
        color="primary"
        type="submit"
        :disabled="!valid">
        Log In
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { login } from '@/actions/login';
import { testEmail } from '@/helpers/test-email';
import { ref } from 'vue';

const valid = ref(false);
const showPassword = ref(false);
const email = ref('');
const password = ref('');

const rules = {
  required: (v: string) => !!v || 'Required.',
  email: (v: string) => testEmail(v),
};

function onSubmit() {
  if (!valid.value) return;
  const data = {
    email: email.value,
    password: password.value,
  };

  login(data);
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
