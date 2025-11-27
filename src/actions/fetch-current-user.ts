import { setLoadingStatus } from '@/actions/set-loading-status';
import { updateToken } from "@/helpers/update-token";
import { mainState } from "@/state";
import { api } from "@/utils/http";
import { buildAvatarUrl } from '@/helpers/avatar-url';

export async function fetchCurrentUser() {
  setLoadingStatus(true);
  const token = localStorage.getItem("token");
  if (!token) return;

  await updateToken();

  const response = await api.get("/auth/me");
  const user = response.data;
  user.avatarUrl = buildAvatarUrl(user.avatarUrl);
  mainState.currentUser = user;
  setLoadingStatus(false);
}
