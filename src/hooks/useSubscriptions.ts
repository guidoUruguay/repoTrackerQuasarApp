import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { repoController } from "@/controllers/repoController";
import type { GitHubRepo } from "@/types";

export const useSubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repo: GitHubRepo) => repoController.subscribe(repo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
      queryClient.invalidateQueries({ queryKey: ["subscribed-repos"] });
    },
  });
};

export const useUnsubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoId: number) => repoController.unsubscribe(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
      queryClient.invalidateQueries({ queryKey: ["subscribed-repos"] });
    },
  });
};
