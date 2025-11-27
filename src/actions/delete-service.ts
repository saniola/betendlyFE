import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { api } from '@/utils/http';

export async function deleteService(serviceId: string) {
  try {
    await api.delete(`/services/${serviceId}`);
    createToast('Послугу видалено', { type: 'success' });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося видалити послугу', { type: 'danger' });
    } else {
      createToast('Не вдалося видалити послугу', { type: 'danger' });
    }
    throw error;
  }
}
