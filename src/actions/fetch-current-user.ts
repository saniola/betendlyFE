import { api } from "@/utils/http";
import { updateToken } from "@/helpers/update-token";
import { mainState } from "@/state";

export async function fetchCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  await updateToken();

  const response = await api.get("/auth/me");
  mainState.currentUser = response.data;
}
