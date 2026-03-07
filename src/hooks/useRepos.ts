import { useQuery } from "@tanstack/vue-query";
import { repoController } from "@/controllers/repoController";
import { api } from "@/utils/api";
import type { Ref } from "vue";

export const useGitHubRepos = (
  page: Ref<number> | number = 1,
  perPage = 50,
) => {
  return useQuery({
    queryKey: ["github-repos", page, perPage],
    queryFn: () => {
      const p = typeof page === "number" ? page : page.value;
      return repoController.getGitHubRepos(p, perPage);
    },
  });
};

export const useSubscribedRepos = (
  page: Ref<number> | number = 1,
  perPage = 50,
) => {
  return useQuery({
    queryKey: ["subscribed-repos", page, perPage],
    queryFn: () => {
      const p = typeof page === "number" ? page : page.value;
      return repoController.getSubscribedRepos(p, perPage);
    },
  });
};

export const useRepository = (id: number) => {
  return useQuery({
    queryKey: ["repository", id],
    queryFn: () => api.repos.getById(id),
    enabled: !!id,
  });
};

export const useRepositoryStats = (id: number) =>
  useQuery({
    queryKey: ["repository-stats", id],
    queryFn: () => api.repos.getStats(id),
    enabled: !!id,
  });
