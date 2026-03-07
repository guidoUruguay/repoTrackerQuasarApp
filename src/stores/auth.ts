import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/types";
import { authController } from "@/controllers/authController";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  const checkAuth = async () => {
    const result = await authController.checkAuth();
    user.value = result.user;
    return result.isAuthenticated;
  };

  const logout = async () => {
    await authController.logout();
    user.value = null;
  };

  return { user, isAuthenticated, checkAuth, logout };
});
