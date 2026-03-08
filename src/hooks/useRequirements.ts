import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/utils/api";
import type { Requirement } from "@/types";

export const useRequirements = (repositoryId: number, page = 1) =>
  useQuery({
    queryKey: ["requirements", repositoryId, page],
    queryFn: () => api.requirements.getByRepository(repositoryId, page),
    enabled: !!repositoryId,
  });

export const useRequirement = (requirementId: number) =>
  useQuery({
    queryKey: ["requirement", requirementId],
    queryFn: () => api.requirements.getById(requirementId),
    enabled: !!requirementId,
  });

export const useCreateRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      repositoryId,
      data,
    }: {
      repositoryId: number;
      data: { title: string; description?: string };
    }) => api.requirements.create(repositoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requirements", variables.repositoryId],
      });
    },
  });
};

export const useUpdateRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requirementId,
      data,
    }: {
      requirementId: number;
      data: Partial<{
        title: string;
        description: string | null;
        status: "pending" | "in_progress" | "completed" | "blocked";
        progress: number;
      }>;
    }) => api.requirements.update(requirementId, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["requirements", result.repositoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requirement", result.id],
      });
    },
  });
};

export const useDeleteRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requirementId,
      repositoryId,
    }: {
      requirementId: number;
      repositoryId: number;
    }) => api.requirements.delete(requirementId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requirements", variables.repositoryId],
      });
    },
  });
};
