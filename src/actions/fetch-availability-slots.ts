import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import type { Slot } from '@/types/slot';
import { api } from '@/utils/http';

export async function fetchAvailabilitySlots(masterId: string, serviceId: string, date: string) {
  try {
    const { data } = await api.get<Slot[]>('/availability/slots', {
      params: {
        master_id: masterId,
        service_id: serviceId,
        date,
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося завантажити вільні слоти', { type: 'danger' });
    } else {
      createToast('Не вдалося завантажити вільні слоти', { type: 'danger' });
    }
    throw error;
  }
}

