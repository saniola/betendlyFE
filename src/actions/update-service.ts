import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import type { ServiceFormPayload } from '@/types/service-form';
import { api } from '@/utils/http';

export async function updateService(serviceId: string, payload: ServiceFormPayload) {
  try {
    const { data } = await api.put(`/services/${serviceId}`, payload);
    createToast('Послугу оновлено', { type: 'success' });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося оновити послугу', { type: 'danger' });
    } else {
      createToast('Не вдалося оновити послугу', { type: 'danger' });
    }
    throw error;
  }
}
