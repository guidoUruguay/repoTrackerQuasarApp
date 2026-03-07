import type { GitHubRepo } from "@/types";
import { api } from "@/utils/api";

export const repoController = {
  getGitHubRepos: (page = 1, perPage = 50) =>
    api.repos.getGitHubRepos(page, perPage),

  getSubscribedRepos: (page = 1, perPage = 50) =>
    api.repos.getSubscribed(page, perPage),

  subscribe: (repo: GitHubRepo) => api.repos.subscribe(repo),

  unsubscribe: (repoId: number) => api.repos.unsubscribe(repoId),
};
