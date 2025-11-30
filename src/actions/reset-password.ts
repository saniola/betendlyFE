import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { api } from '@/utils/http';
import { setLoadingStatus } from '@/actions/set-loading-status';

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  setLoadingStatus(true);

  try {
    await api.post('/auth/password/reset', payload);
    createToast('Пароль успішно змінено', { type: 'success' });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      createToast(error.response.data.detail, { type: 'danger' });
    } else {
      createToast('Не вдалося змінити пароль', { type: 'danger' });
    }
    throw error;
  } finally {
    setLoadingStatus(false);
  }
}

