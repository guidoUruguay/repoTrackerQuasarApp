import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export const useLogin = () => {
  const login = () => {
    window.location.href = "/api/github/redirect";
  };
  return { login };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authStore.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
};

export const useAuthCheck = () => {
  const authStore = useAuthStore();
  const checkAuth = () => authStore.checkAuth();
  return { checkAuth };
};
