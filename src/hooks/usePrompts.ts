import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/utils/api";
import type { Prompt } from "@/types";

export const usePrompts = (page = 1) =>
  useQuery({
    queryKey: ["prompts", page],
    queryFn: () => api.prompts.getAll(page),
  });

export const usePrompt = (id: number) =>
  useQuery({
    queryKey: ["prompt", id],
    queryFn: () => api.prompts.getById(id),
    enabled: !!id,
  });

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Prompt, "id" | "createdAt" | "updatedAt" | "userId">,
    ) => api.prompts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Prompt> }) =>
      api.prompts.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompt", variables.id] });
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.prompts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
};
