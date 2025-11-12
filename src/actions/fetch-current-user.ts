import { setLoadingStatus } from '@/actions/set-loading-status';
import { updateToken } from '@/actions/update-token';
import { API_BASE_URL } from '@/config';
import { mainState } from '@/state';
import { http } from '@/utils/http';

export async function fetchCurrentUser() {
  setLoadingStatus(true);
  await updateToken();
  const response = await http.get(`${API_BASE_URL}/auth/me`);
  mainState.currentUser = response.data;
  setLoadingStatus(true);
}
