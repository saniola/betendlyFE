<template>
  <v-card
    max-width="500"
    :class="[
      'mx-auto mt-10 pa-6',
      $style.card,
    ]">
    <v-card-title class="text-h5 font-weight-bold">Sign Up</v-card-title>

    <v-form
      v-model="valid"
      @submit.prevent="onSubmit">
      <v-text-field
        v-model="firstName"
        label="First Name"
        :rules="[rules.required]"
        variant="outlined" />

      <v-text-field
        v-model="lastName"
        label="Last Name"
        :rules="[rules.required]"
        variant="outlined" />

      <v-text-field
        v-model="email"
        label="Email"
        :rules="[rules.required, rules.email]"
        variant="outlined" />

      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="showPassword = !showPassword"
        :rules="[rules.required, rules.min(6)]"
        variant="outlined" />

      <v-checkbox
        v-model="isMaster"
        label="Is master?"
        color="primary" />

      <v-btn
        class="mt-4"
        type="submit"
        color="primary"
        block
        :disabled="!valid">
        Sign Up
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const valid = ref(false);
const showPassword = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isMaster = ref(false);

const rules = {
  required: (v: string) => !!v || 'Required.',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
  min: (min: number) => (v: string) =>
    (v && v.length >= min) || `Min ${min} characters.`,
};

const onSubmit = () => {
  if (!valid.value) return;
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    isMaster: isMaster.value,
  };

  alert(`✅ Signed up as ${data.firstName} ${data.lastName}`);
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
