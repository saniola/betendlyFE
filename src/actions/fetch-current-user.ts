import { setLoadingStatus } from '@/actions/set-loading-status';
import { API_BASE_URL } from '@/config';
import { http } from '@/utils/http';

export async function fetchCurrentUser() {
  setLoadingStatus(true);
  const response = await http.post(`${API_BASE_URL}/auth/me`);
  setLoadingStatus(true);
}
