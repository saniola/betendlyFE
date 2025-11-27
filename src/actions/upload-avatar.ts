import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { api } from '@/utils/http';
import { buildAvatarUrl } from '@/helpers/avatar-url';

export async function uploadAvatar(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await api.post('/member/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    createToast('Аватар оновлено', { type: 'success' });
    return buildAvatarUrl(data) ?? data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося оновити аватар', { type: 'danger' });
    } else {
      createToast('Не вдалося оновити аватар', { type: 'danger' });
    }
    return null;
  }
}
