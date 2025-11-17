import { api } from "@/utils/http";

export async function updateToken() {
  const expireDate = localStorage.getItem("tokenExpire");

  if (expireDate && new Date(expireDate).getTime() <= Date.now()) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await api.post("/auth/refresh", {
        refreshToken,
      });

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("tokenExpire", response.data.expiresAtUtc);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (err) {
      console.error("Refresh failed", err);
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpire");
      localStorage.removeItem("refreshToken");
      throw err;
    }
  }
}
