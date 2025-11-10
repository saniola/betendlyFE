import axios from 'axios';
import { setLoadingStatus } from '@/actions/set-loading-status';
import { API_BASE_URL } from '@/config';

export async function fetchCurrentUser() {
  setLoadingStatus(true);
  const response = await axios.post(`${API_BASE_URL}/auth/me`);
  setLoadingStatus(true);
}
