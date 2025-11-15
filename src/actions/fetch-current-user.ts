import { updateToken } from '@/helpers/update-token';
import { API_BASE_URL } from '@/config';
import { mainState } from '@/state';
import axios from 'axios';

export async function fetchCurrentUser() {
  const token = localStorage.getItem('token');
  if (token) {
    await updateToken();
    const response = await axios.get(
      `${API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    );
    mainState.currentUser = response.data;
  }
}
