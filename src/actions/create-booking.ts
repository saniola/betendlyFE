import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import type { CreateBookingPayload } from '@/types/booking';
import { api } from '@/utils/http';

export async function createBooking(payload: CreateBookingPayload) {
  try {
    const { data } = await api.post('/bookings', payload);
    createToast('Запис створено', { type: 'success' });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося створити запис', { type: 'danger' });
    } else {
      createToast('Не вдалося створити запис', { type: 'danger' });
    }
    throw error;
  }
}

