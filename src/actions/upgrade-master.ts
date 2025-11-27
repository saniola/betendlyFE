import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { fetchCurrentUser } from '@/actions/fetch-current-user';
import { setLoadingStatus } from '@/actions/set-loading-status';
import { api } from '@/utils/http';

export async function upgradeToMaster() {
  setLoadingStatus(true);

  try {
    await api.post('/masters/upgrade');
    await fetchCurrentUser();
    createToast('Статус майстра активовано', { type: 'success' });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося оновити статус', { type: 'danger' });
    } else {
      createToast('Не вдалося оновити статус', { type: 'danger' });
    }
  } finally {
    setLoadingStatus(false);
  }
}
