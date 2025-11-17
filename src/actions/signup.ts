import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { fetchCurrentUser } from '@/actions/fetch-current-user';
import { setLoadingStatus } from '@/actions/set-loading-status';
import router from '@/router';
import type { SignupData } from '@/types/signup';
import { api } from '@/utils/http';

export async function signup(data: SignupData) {
  setLoadingStatus(true);
  try {
    const response = await api.post(`/auth/register`, data);
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
