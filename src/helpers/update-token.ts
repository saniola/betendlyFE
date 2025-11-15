import axios from 'axios';
import { API_BASE_URL } from '@/config';

export async function updateToken(){
  const expireDate = localStorage.getItem('tokenExpire');
  if (expireDate && new Date(expireDate).getTime() <= new Date().getTime()) {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: localStorage.getItem('refreshToken'),
    });
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('tokenExpire', response.data.expiresAtUtc);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
}
