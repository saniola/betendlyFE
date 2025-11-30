<template>
  <v-container class="py-6">
    <v-card
      max-width="500"
      class="mx-auto pa-6">
      <h1 class="text-h5 font-weight-bold mb-4">
        Відновлення паролю
      </h1>

      <v-form v-model="formValid" @submit.prevent="onSubmit">
        <v-alert
          v-if="!token"
          type="error"
          variant="tonal"
          class="mb-4">
          Посилання недійсне або відсутній токен.
        </v-alert>

        <v-text-field
          v-model="passwords.newPassword"
          label="Новий пароль"
          variant="outlined"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.minLength]"
          @click:append="showPassword = !showPassword" />

        <v-text-field
          v-model="passwords.confirmPassword"
          label="Підтвердіть пароль"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, matchPassword]"
        />

        <v-btn
          block
          color="primary"
          class="mt-4"
          type="submit"
          :disabled="!formValid || !token">
          Змінити пароль
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { resetPassword } from '@/actions/reset-password';
import { setLoadingStatus } from '@/actions/set-loading-status';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const token = route.query.token?.toString() ?? '';
const formValid = ref(false);
const showPassword = ref(false);

const passwords = ref({
  newPassword: '',
  confirmPassword: '',
});

const rules = {
  required: (value: string) => !!value || 'Обовʼязкове поле',
  minLength: (value: string) => value.length >= 8 || 'Мінімум 8 символів',
};

const matchPassword = (value: string) =>
  value === passwords.value.newPassword || 'Паролі мають співпадати';

async function onSubmit() {
  if (!formValid.value || !token) return;

  try {
    await resetPassword({
      token,
      newPassword: passwords.value.newPassword,
    });
    router.push({ name: 'login' });
  } catch {
    // handled inside action
  }
}

onMounted(() => {
  setLoadingStatus(false);
});
</script>

