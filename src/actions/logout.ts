import { api } from "@/utils/http";
import { mainState } from "@/state";

export async function logout() {
  try {
    await api.post("/auth/logout", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

  } catch (err) {
    console.warn("Logout error:", err);
  }

  // У будь-якому випадку чистимо все
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpire");
  localStorage.removeItem("refreshToken");

  mainState.currentUser = null;
}
