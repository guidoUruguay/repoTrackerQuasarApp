import { useQuery } from "@tanstack/vue-query";
import { api } from "@/utils/api";

export const useRepositoryCommits = (
  repositoryId: number,
  page = 1,
  perPage = 20,
) =>
  useQuery({
    queryKey: ["commits", repositoryId, page, perPage],
    queryFn: () => api.commits.getByRepository(repositoryId, page, perPage),
    enabled: !!repositoryId,
  });

export const useCommit = (repositoryId: number, commitId: number) =>
  useQuery({
    queryKey: ["commit", repositoryId, commitId],
    queryFn: () => api.commits.getById(repositoryId, commitId),
    enabled: !!repositoryId && !!commitId,
  });
