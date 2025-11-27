<template>
  <v-container
    v-if="user"
    class="py-6">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="goBack">
      Назад до профілю
    </v-btn>

    <v-card class="pa-4">
      <h1 class="text-h5 mb-4">
        Редагування профілю
      </h1>

      <v-form ref="mainFormRef" v-model="mainFormValid" lazy-validation>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.user.firstName"
              label="Імʼя"
              variant="outlined"
              :rules="[rules.required]" />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.user.lastName"
              label="Прізвище"
              variant="outlined"
              :rules="[rules.required]" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.user.email"
              label="Email"
              variant="outlined"
              disabled />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.user.phone"
              label="Телефон"
              variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-file-input
              accept="image/*"
              label="Оновити аватар"
              prepend-icon="mdi-camera"
              variant="outlined"
              @change="onAvatarSelected" />
          </v-col>

          <v-col
            cols="12" md="6"
            class="d-flex align-center">
            <v-avatar size="72">
              <v-img :src="avatarPreviewUrl || form.user.avatarUrl || defaultAvatar" />
            </v-avatar>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-card class="pa-4 mt-4">
      <template v-if="!isMaster">
        <h2 class="text-h6 mb-2">
          Хочете стати майстром?
        </h2>

        <p class="text-body-2 text-medium-emphasis mb-4">
          Після активації ви зможете додавати послуги та отримувати бронювання.
          Повернутися до звичайного профілю наразі неможливо.
        </p>

        <v-btn
          color="primary"
          :loading="isActivatingMaster"
          @click="onBecomeMaster">
          Стати майстром
        </v-btn>
      </template>

      <template v-else>
        <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center gap-4">
          <div>
            <h2 class="text-h6 mb-1">
              Статус майстра активовано
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Ви можете редагувати профіль майстра та керувати послугами. Вимкнення статусу поки недоступне.
            </p>
          </div>
        </div>
      </template>
    </v-card>

    <v-card
      v-if="isMaster"
      class="pa-4 mt-4">
      <h2 class="text-h6 mb-4">
        Профіль майстра
      </h2>

      <v-form ref="masterFormRef" v-model="masterFormValid" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="form.master.about"
              label="Опис"
              rows="3"
              auto-grow
              variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.master.city"
              label="Місто"
              variant="outlined" />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.master.address"
              label="Адреса"
              variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.master.experienceYears"
              type="number"
              min="0"
              label="Досвід (років)"
              variant="outlined" />
          </v-col>

          <v-col cols="12" md="6">
            <v-combobox
              v-model="form.master.skills"
              label="Навички"
              multiple
              chips
              hide-selected
              variant="outlined"
              hint="Введіть навичку та натисніть Enter"
              persistent-hint />
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-card
      v-if="isMaster"
      class="pa-4 mt-4">
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h2 class="text-h6 mb-1">
            Послуги
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Додайте послуги, щоб клієнти могли бронювати час.
          </p>
        </div>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openServiceDialog()">
          Додати послугу
        </v-btn>
      </div>

      <v-table v-if="services.length">
        <thead>
          <tr>
            <th class="text-left">Назва</th>
            <th class="text-left">Тривалість</th>
            <th class="text-left">Ціна</th>
            <th class="text-left">Опис</th>
            <th class="text-left">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="service in services"
            :key="service.id">
            <td>{{ service.name }}</td>
            <td>{{ service.durationMinutes }} хв</td>
            <td>{{ service.price }} грн</td>
            <td>{{ service.description }}</td>
            <td>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="openServiceDialog(service)">
                <v-icon icon="mdi-pencil" />
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                @click="removeService(service.id)">
                <v-icon icon="mdi-delete" />
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-alert
        v-else
        type="info"
        variant="tonal">
        Послуг поки немає. Додайте першу, щоб почати отримувати бронювання.
      </v-alert>
    </v-card>

    <div class="d-flex flex-column flex-md-row gap-4 mt-6">
      <v-btn
        color="primary"
        :loading="isSaving"
        @click="submitForm">
        Зберегти зміни
      </v-btn>

      <v-btn
        variant="outlined"
        :to="{ name: 'profile', params: { id: user?.id } }">
        Скасувати
      </v-btn>
    </div>

    <v-dialog
      v-model="serviceDialog"
      max-width="540">
      <v-card>
        <v-card-title class="text-h6">
          {{ editingService ? 'Редагування послуги' : 'Нова послуга' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="serviceFormRef" v-model="serviceFormValid">
            <v-text-field
              v-model="serviceForm.name"
              label="Назва"
              variant="outlined"
              :rules="[rules.required]" />

            <v-text-field
              v-model.number="serviceForm.durationMinutes"
              type="number"
              min="0"
              label="Тривалість (хв)"
              variant="outlined"
              :rules="[rules.required]" />

            <v-text-field
              v-model.number="serviceForm.price"
              type="number"
              min="0"
              label="Ціна (грн)"
              variant="outlined"
              :rules="[rules.required]" />

            <v-textarea
              v-model="serviceForm.description"
              label="Опис"
              rows="3"
              auto-grow
              variant="outlined" />
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            @click="closeServiceDialog">
            Скасувати
          </v-btn>

          <v-btn
            color="primary"
            :loading="isServiceSaving"
            @click="saveService">
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container
    v-else
    class="py-6 text-center">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { createService } from '@/actions/create-service';
import { deleteService } from '@/actions/delete-service';
import { fetchMember } from '@/actions/fetch-member';
import { updateMember } from '@/actions/update-member';
import { updateService } from '@/actions/update-service';
import { uploadAvatar } from '@/actions/upload-avatar';
import { upgradeToMaster } from '@/actions/upgrade-master';
import { defaultAvatar } from '@/config';
import router from '@/router';
import { mainState } from '@/state';
import { buildAvatarUrl, extractAvatarPath } from '@/helpers/avatar-url';
import { withExperienceYearsPayload } from '@/helpers/master-profile';
import type { MemberUpdatePayload } from '@/types/member-update';
import type { ServiceFormPayload } from '@/types/service-form';
import type { ProfileService } from '@/types/user';
import { useRoute } from 'vue-router';

const route = useRoute();
const user = computed(() => mainState.user);
const mainFormRef = ref();
const masterFormRef = ref();
const serviceFormRef = ref();
const mainFormValid = ref(false);
const masterFormValid = ref(false);
const serviceFormValid = ref(false);
const isSaving = ref(false);
const isActivatingMaster = ref(false);
const serviceDialog = ref(false);
const isServiceSaving = ref(false);
const editingService = ref<ProfileService | null>(null);
const avatarPreviewUrl = ref<string | null>(null);

const form = reactive({
  user: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: '',
  },
  master: {
    about: '',
    city: '',
    address: '',
    experienceYears: null as number | null,
    skills: [] as string[],
  },
});

const serviceForm = reactive({
  name: '',
  price: null as number | null,
  durationMinutes: null as number | null,
  description: '',
});

const services = computed(() => user.value?.master?.services ?? []);
const isMaster = computed(() => user.value?.isMaster ?? false);

const rules = {
  required: (value: string | number | null) => !!value || 'Обовʼязкове поле',
};

watch(user, (value, previous) => {
  if (!value) return;

  form.user.firstName = value.firstName ?? '';
  form.user.lastName = value.lastName ?? '';
  form.user.email = value.email ?? '';
  form.user.phone = value.phone ?? '';

  if (!avatarPreviewUrl.value || value.id !== previous?.id) {
    form.user.avatarUrl = buildAvatarUrl(value.avatarUrl) ?? '';
  }

  form.master.about = value.master?.about ?? '';
  form.master.city = value.master?.city ?? '';
  form.master.address = value.master?.address ?? '';
  form.master.experienceYears = value.master?.yearsExperience ?? null;
  form.master.skills = value.master?.skills ? [...value.master.skills] : [];

  if (avatarPreviewUrl.value && value.id !== previous?.id) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
    avatarPreviewUrl.value = null;
  }
}, { immediate: true });

onMounted(async () => {
  const userId = route.params.id as string;

  if (mainState.currentUser && mainState.currentUser.id !== userId) {
    router.push({ name: 'profile', params: { id: userId } });
    return;
  }

  await fetchProfile();
});

async function fetchProfile() {
  const userId = route.params.id as string;
  if (!userId) return;
  await fetchMember(userId);
}

async function submitForm() {
  if (!mainFormRef.value) return;

  const mainValid = await mainFormRef.value.validate();
  if (!mainValid.valid) return;

  if (isMaster.value && masterFormRef.value) {
    const masterValid = await masterFormRef.value.validate();
    if (!masterValid.valid) return;
  }

  isSaving.value = true;

  const payload: MemberUpdatePayload = {
    user: {
      firstName: form.user.firstName,
      lastName: form.user.lastName,
      phone: form.user.phone || null,
      avatarUrl: extractAvatarPath(form.user.avatarUrl) || null,
    },
  };

  if (isMaster.value) {
    payload.master = withExperienceYearsPayload({
      about: form.master.about || null,
      city: form.master.city || null,
      address: form.master.address || null,
      yearsExperience: form.master.experienceYears ?? null,
      skills: form.master.skills?.length ? form.master.skills : null,
    });
  }

  await updateMember(payload);
  await fetchProfile();
  isSaving.value = false;
}

function goBack() {
  if (user.value?.id) {
    router.push({ name: 'profile', params: { id: user.value.id } });
  } else {
    router.push({ name: 'home' });
  }
}

async function onAvatarSelected(files?: File[] | File | FileList) {
  const file = normalizeFileInput(files);
  if (!file) return;

  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }

  avatarPreviewUrl.value = URL.createObjectURL(file);

  const uploadedPath = await uploadAvatar(file);
  if (uploadedPath) {
    const normalized = buildAvatarUrl(uploadedPath) ?? uploadedPath;
    form.user.avatarUrl = normalized;

    if (mainState.currentUser && user.value && mainState.currentUser.id === user.value.id) {
      mainState.currentUser.avatarUrl = normalized;
    }

    if (mainState.user) {
      mainState.user.avatarUrl = normalized;
    }

    URL.revokeObjectURL(avatarPreviewUrl.value);
    avatarPreviewUrl.value = null;
  }
}

function openServiceDialog(service?: ProfileService) {
  serviceDialog.value = true;
  editingService.value = service ?? null;

  if (service) {
    serviceForm.name = service.name;
    serviceForm.price = service.price;
    serviceForm.durationMinutes = service.durationMinutes;
    serviceForm.description = service.description ?? '';
  } else {
    resetServiceForm();
  }
}

function closeServiceDialog() {
  serviceDialog.value = false;
  editingService.value = null;
  resetServiceForm();
}

function resetServiceForm() {
  serviceForm.name = '';
  serviceForm.price = null;
  serviceForm.durationMinutes = null;
  serviceForm.description = '';
}

async function saveService() {
  if (!serviceFormRef.value) return;
  const validation = await serviceFormRef.value.validate();
  if (!validation.valid) return;

  if (serviceForm.price === null || serviceForm.durationMinutes === null) return;

  const payload: ServiceFormPayload = {
    name: serviceForm.name,
    price: serviceForm.price,
    durationMinutes: serviceForm.durationMinutes,
    description: serviceForm.description,
  };

  isServiceSaving.value = true;

  try {
    if (editingService.value) {
      await updateService(editingService.value.id, payload);
    } else {
      await createService(payload);
    }

    await fetchProfile();
    closeServiceDialog();
  } finally {
    isServiceSaving.value = false;
  }
}

async function removeService(serviceId: string) {
  if (!serviceId) return;
  await deleteService(serviceId);
  await fetchProfile();
}

async function onBecomeMaster() {
  if (isActivatingMaster.value) return;
  isActivatingMaster.value = true;
  await upgradeToMaster();
  await fetchProfile();
  isActivatingMaster.value = false;
}

onBeforeUnmount(() => {
  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }
});

function normalizeFileInput(input?: File[] | File | FileList) {
  if (!input) return undefined;
  if (input instanceof File) return input;
  if (input instanceof FileList) return input.item(0) ?? undefined;
  if (Array.isArray(input)) return input[0];
  return undefined;
}
</script>

