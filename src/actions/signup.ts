import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { setLoadingStatus } from '@/actions/set-loading-status';
import { API_BASE_URL } from '@/config';
import router from '@/router';
import type { SignupData } from '@/types/signup';

export async function signup(data: SignupData) {
  setLoadingStatus(true);
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('tokenExpire', response.data.expire);
    localStorage.setItem('refreshToken', response.data.refreshToken);
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
