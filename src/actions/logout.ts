import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { API_BASE_URL } from '@/config';
import { updateToken } from '@/helpers/update-token';
import { mainState } from '@/state';

export async function logout() {
  try {
    await updateToken();
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {
        refreshToken: localStorage.getItem('refreshToken')
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpire');
    localStorage.removeItem('refreshToken');
    mainState.currentUser = null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        createToast(error.response.data.detail || 'Something went wrong', { type: 'danger' });
      }
    }
  }
}
