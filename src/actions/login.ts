import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { fetchCurrentUser } from '@/actions/fetch-current-user';
import { setLoadingStatus } from '@/actions/set-loading-status';
import { API_BASE_URL } from '@/config';
import router from '@/router';
import type { LoginData } from '@/types/login';
import { http } from '@/utils/http';

export async function login(data: LoginData) {
  setLoadingStatus(true);
  try {
    const response = await http.post(`${API_BASE_URL}/auth/login`, data);
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('tokenExpire', response.data.expiresAtUtc);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    await fetchCurrentUser();
    router.push({ name: 'home' });
    setLoadingStatus(false);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        createToast(error.response.data.detail || 'Something went wrong', { type: 'danger' });
        setLoadingStatus(false);
      }
    }
  }
}
