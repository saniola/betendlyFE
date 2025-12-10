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

      <div class="d-flex flex-column gap-4">
        <v-btn
          block
          class="mt-4"
          color="primary"
          type="submit"
          :disabled="!valid">
          Log In
        </v-btn>

        <v-btn
          class="text-none"
          color="primary"
          variant="text"
          @click="onForgotPassword">
          Забули пароль?
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { login } from '@/actions/login';
import { forgotPassword } from '@/actions/forgot-password';
import { testEmail } from '@/helpers/test-email';
import router from '@/router';
import { ref } from 'vue';
import { createToast } from 'mosha-vue-toastify';

if (localStorage.getItem('token')) {
  router.push({ name: 'home' });
}

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

function onForgotPassword() {
  if (!email.value) {
    createToast('Будь ласка, введіть email', { type: 'warning' });
    return;
  }

  const validationResult = rules.email(email.value);
  if (validationResult !== true) {
    createToast(typeof validationResult === 'string' ? validationResult : 'Некоректний email', { type: 'warning' });
    return;
  }

  forgotPassword(email.value);
}
</script>

<style module lang="scss">
.card {
  width: 100%;
  max-width: 360px;
}

@media (min-width: 600px) {
  .card {
    max-width: 420px;
  }
}

@media (min-width: 1024px) {
  .card {
    max-width: 500px;
  }
}
</style>
