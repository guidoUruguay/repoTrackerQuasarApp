// Response from /github/repositories - enriched GitHub repos
export interface GitHubRepo {
  githubId: number;
  name: string;
  fullName: string;
  ownerLogin: string;
  ownerType: string;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  isPrivate: boolean;
  isSubscribed: boolean;
  subscribedRepoId: number | null;
  commitsCount: number;
  codeAnalysesCount: number;
}

// Response from /repositories - subscribed repos from database
export interface SubscribedRepo {
  id: number;
  githubId: number;
  name: string;
  fullName: string;
  ownerLogin: string;
  ownerType: string;
  defaultBranch: string;
  isPrivate: boolean;
  htmlUrl: string;
  cloneUrl: string;
  description?: string;
  commitsCount?: number;
  codeAnalysesCount?: number;
  isSubscribed: true; // Always true for subscribed repos
  subscribedRepoId: number; // Same as id
}

export interface User {
  id: number;
  email: string;
  fullName?: string;
}

export interface Author {
  name: string;
  email: string;
}

export interface Commit {
  id: number;
  sha: string;
  message: string;
  authorDate: string;
  addedFiles: string[];
  modifiedFiles: string[];
  removedFiles: string[];
  author: Author;
  repositoryId: number;
}

export interface Issue {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  file: string;
  line: number;
  description: string;
  suggestion: string;
}

export interface AnalysisMetrics {
  maxNestingDepth?: number;
  totalNestedIfs?: number;
  totalNestedLoops?: number;
  linesOfCode?: number;
  filesAnalyzed?: number;
  problematicFiles?: string[];
  cyclomaticComplexity?: number;
}

export interface CodeAnalysis {
  id: number;
  analysisStatus: "pending" | "completed" | "failed";
  overallQualityScore: number;
  complexityScore: number;
  issuesFound: Issue[];
  suggestions: string[];
  metrics: AnalysisMetrics;
  aiModelUsed?: string;
  createdAt: string;
  commitId: number;
  repositoryId: number;
}

export interface Prompt {
  id: number;
  name: string;
  content: string;
  description: string;
  isActive: boolean;
  type: "ai" | "static";
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface StatsAuthor {
  id: number | null;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  commitCount: number;
  analyzedCommitCount: number;
  firstCommitDate: string | null;
  lastCommitDate: string | null;
}

export interface RepositoryStats {
  repository: {
    id: number;
    name: string;
    fullName: string;
    ownerLogin: string;
    htmlUrl: string;
    defaultBranch: string;
  };
  statistics: {
    totalCommitsInGitHub: number;
    analyzedCommits: number;
    analyzedPercentage: number;
    totalAuthors: number;
    totalAnalyses: number;
    totalFiles: {
      added: number;
      modified: number;
      removed: number;
    };
    dateRange: {
      firstCommit: string | null;
      lastCommit: string | null;
    };
  };
  authors: StatsAuthor[];
}

export interface RequirementAnalysisResult {
  isRelevant: boolean;
  progressDelta: number;
  summary: string;
  detectedFeatures: string[];
  confidence: number;
}

export interface RequirementProgress {
  id: number;
  requirementId: number;
  commitId: number;
  analysisResult: RequirementAnalysisResult;
  progressDelta: number;
  aiSummary: string;
  detectedAt: string;
  commit?: Commit;
}

export interface Requirement {
  id: number;
  repositoryId: number;
  userId: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "blocked";
  progress: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  repository?: SubscribedRepo;
  progresses?: RequirementProgress[];
}
