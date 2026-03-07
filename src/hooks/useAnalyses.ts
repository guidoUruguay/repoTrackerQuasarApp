import { useQuery } from "@tanstack/vue-query";
import { api } from "@/utils/api";

export const useRepositoryAnalyses = (
  repositoryId: number,
  page = 1,
  perPage = 20,
) =>
  useQuery({
    queryKey: ["analyses", repositoryId, page, perPage],
    queryFn: () => api.analyses.getByRepository(repositoryId, page, perPage),
    enabled: !!repositoryId,
  });

export const useAnalysis = (repositoryId: number, analysisId: number) =>
  useQuery({
    queryKey: ["analysis", repositoryId, analysisId],
    queryFn: () => api.analyses.getById(repositoryId, analysisId),
    enabled: !!repositoryId && !!analysisId,
  });
