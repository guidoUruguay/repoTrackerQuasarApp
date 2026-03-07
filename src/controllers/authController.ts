import { api } from "@/utils/api";

export const authController = {
  checkAuth: async () => {
    try {
      const user = await api.auth.me();
      return { user, isAuthenticated: true };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  },

  logout: () => api.auth.logout(),

  getLoginUrl: () => "/api/github/redirect",
};
