import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { api } from '@/utils/http';
import { setLoadingStatus } from '@/actions/set-loading-status';

export async function forgotPassword(email: string) {
  if (!email) {
    createToast('Введіть email', { type: 'warning' });
    return;
  }

  setLoadingStatus(true);

  try {
    await api.post('/auth/password/forgot', { email });
    createToast('Перевірте пошту для відновлення паролю', { type: 'success' });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      createToast(error.response.data.detail, { type: 'danger' });
    } else {
      createToast('Не вдалося надіслати лист', { type: 'danger' });
    }
  } finally {
    setLoadingStatus(false);
  }
}

