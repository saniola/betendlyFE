import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import type { ServiceFormPayload } from '@/types/service-form';
import { api } from '@/utils/http';

export async function createService(payload: ServiceFormPayload) {
  try {
    const { data } = await api.post('/services', payload);
    createToast('Послугу створено', { type: 'success' });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося створити послугу', { type: 'danger' });
    } else {
      createToast('Не вдалося створити послугу', { type: 'danger' });
    }
    throw error;
  }
}
