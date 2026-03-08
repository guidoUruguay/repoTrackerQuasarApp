import type {
  GitHubRepo,
  SubscribedRepo,
  User,
  Commit,
  CodeAnalysis,
  Prompt,
  PaginatedResponse,
  RepositoryStats,
  Requirement,
} from "@/types";

const BASE_URL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL;

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
};

export const api = {
  auth: {
    me: () => request<User>("/me"),
    logout: () =>
      fetch(`${BASE_URL}/logout`, { method: "POST", credentials: "include" }),
  },

  repos: {
    getGitHubRepos: (page = 1, perPage = 50) =>
      request<PaginatedResponse<GitHubRepo>>(
        `/github/repositories?page=${page}&perPage=${perPage}`,
      ),

    getSubscribed: (page = 1, perPage = 50) =>
      request<PaginatedResponse<SubscribedRepo>>(
        `/repositories?page=${page}&perPage=${perPage}`,
      ),

    getById: (id: number) => request<SubscribedRepo>(`/repositories/${id}`),

    getStats: (id: number) =>
      request<RepositoryStats>(`/repositories/${id}/stats`),

    subscribe: (repo: GitHubRepo) =>
      request("/me/repositories/subscribe", {
        method: "POST",
        body: JSON.stringify({
          githubRepoId: repo.githubId,
          name: repo.name,
          fullName: repo.fullName,
          ownerLogin: repo.ownerLogin,
          ownerType: repo.ownerType,
          defaultBranch: repo.defaultBranch,
          isPrivate: repo.isPrivate,
          htmlUrl: repo.htmlUrl,
          cloneUrl: repo.cloneUrl,
        }),
      }),

    unsubscribe: (repoId: number) =>
      request(`/me/repositories/${repoId}/unsubscribe`, {
        method: "DELETE",
      }),
  },

  commits: {
    getByRepository: (repositoryId: number, page = 1, perPage = 20) =>
      request<PaginatedResponse<Commit>>(
        `/repositories/${repositoryId}/commits?page=${page}&perPage=${perPage}`,
      ),
    getById: (repositoryId: number, commitId: number) =>
      request<Commit>(`/repositories/${repositoryId}/commits/${commitId}`),
  },

  analyses: {
    getByRepository: (repositoryId: number, page = 1, perPage = 20) =>
      request<PaginatedResponse<CodeAnalysis>>(
        `/repositories/${repositoryId}/analyses?page=${page}&perPage=${perPage}`,
      ),
    getById: (repositoryId: number, analysisId: number) =>
      request<CodeAnalysis>(
        `/repositories/${repositoryId}/analyses/${analysisId}`,
      ),
    trigger: (repositoryId: number, commitIds: number[]) =>
      request<CodeAnalysis[]>(`/repositories/${repositoryId}/analyze`, {
        method: "POST",
        body: JSON.stringify({ commitIds }),
      }),
  },

  prompts: {
    getAll: (page = 1, perPage = 50) =>
      request<PaginatedResponse<Prompt>>(
        `/prompts?page=${page}&perPage=${perPage}`,
      ),
    getById: (id: number) => request<Prompt>(`/prompts/${id}`),
    create: (data: Omit<Prompt, "id" | "createdAt" | "updatedAt" | "userId">) =>
      request<Prompt>("/prompts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Prompt>) =>
      request<Prompt>(`/prompts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request(`/prompts/${id}`, {
        method: "DELETE",
      }),
  },

  requirements: {
    getByRepository: (repositoryId: number, page = 1, perPage = 20) =>
      request<PaginatedResponse<Requirement>>(
        `/repositories/${repositoryId}/requirements?page=${page}&perPage=${perPage}`,
      ),
    getById: (requirementId: number) =>
      request<Requirement>(`/requirements/${requirementId}`),
    create: (
      repositoryId: number,
      data: { title: string; description?: string },
    ) =>
      request<Requirement>(`/repositories/${repositoryId}/requirements`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      requirementId: number,
      data: Partial<{
        title: string;
        description: string | null;
        status: "pending" | "in_progress" | "completed" | "blocked";
        progress: number;
      }>,
    ) =>
      request<Requirement>(`/requirements/${requirementId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (requirementId: number) =>
      request(`/requirements/${requirementId}`, {
        method: "DELETE",
      }),
  },
};

export const getAuthUrl = () => `${BASE_URL}/github/redirect`;

export const getReauthorizeUrl = () => `${BASE_URL}/github/reauthorize`;
