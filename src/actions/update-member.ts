import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import { fetchCurrentUser } from '@/actions/fetch-current-user';
import { fetchMember } from '@/actions/fetch-member';
import { setLoadingStatus } from '@/actions/set-loading-status';
import type { MemberUpdatePayload } from '@/types/member-update';
import { mainState } from '@/state';
import { api } from '@/utils/http';
import { buildAvatarUrl } from '@/helpers/avatar-url';
import { normalizeYearsExperience } from '@/helpers/master-profile';

export async function updateMember(payload: MemberUpdatePayload) {
  setLoadingStatus(true);

  try {
    const { data } = await api.put('/member', payload);
    data.avatarUrl = buildAvatarUrl(data.avatarUrl);
    data.master = normalizeYearsExperience(data.master);

    mainState.user = data;

    if (mainState.currentUser) {
      mainState.currentUser = {
        ...mainState.currentUser,
        firstName: data.firstName ?? mainState.currentUser.firstName,
        lastName: data.lastName ?? mainState.currentUser.lastName,
        email: data.email ?? mainState.currentUser.email,
        avatarUrl: data.avatarUrl ?? mainState.currentUser.avatarUrl,
        isMaster: data.isMaster,
      };
    } else {
      await fetchCurrentUser();
    }

    if (data.id) {
      await fetchMember(data.id);
    }

    createToast('Профіль оновлено', { type: 'success' });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      createToast(error.response.data.detail || 'Не вдалося оновити профіль', { type: 'danger' });
    } else {
      createToast('Не вдалося оновити профіль', { type: 'danger' });
    }
  } finally {
    setLoadingStatus(false);
  }
}
