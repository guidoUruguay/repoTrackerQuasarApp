<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-dark"
      style="border-bottom: 1px solid rgba(255, 255, 255, 0.1)"
    >
      <q-toolbar
        class="constrain-width"
        style="max-width: 1280px; margin: 0 auto"
      >
        <div class="row items-center q-gutter-md">
          <q-icon name="mdi-github" size="md" />
          <div class="text-h6 text-weight-regular">
            {{ $t("common.appName") }}
          </div>
          <q-separator vertical inset spaced color="grey-8" />
          <div class="text-body1 text-grey-5">
            {{ $t("dashboard.title") }}
          </div>
        </div>

        <q-space />

        <div class="row items-center q-gutter-md">
          <div v-if="user" class="text-body2 text-grey-6">
            {{ user.fullName || user.email }}
          </div>
          <q-btn
            flat
            dense
            round
            icon="vpn_key"
            size="sm"
            @click="handleReauthorize"
          >
            <q-tooltip>{{ $t("dashboard.manageAccessTooltip") }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="logout"
            size="sm"
            :loading="logoutMutation.isPending.value"
            @click="handleLogout"
          >
            <q-tooltip>{{ $t("common.logout") }}</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-grey-10">
        <div
          class="constrain-width"
          style="max-width: 1280px; margin: 0 auto; padding: 24px 16px"
        >
          <SearchBar
            v-model="searchQuery"
            :placeholder="$t('dashboard.searchPlaceholder')"
            :show-suggestions="!searchQuery"
            class="q-mb-lg"
          />

          <div v-if="activeFilters.length > 0" class="q-mb-md">
            <div class="row q-gutter-xs items-center">
              <span class="text-caption text-grey-6">Active filters:</span>
              <q-chip
                v-for="(filter, index) in activeFilters"
                :key="index"
                size="sm"
                color="primary"
                outline
                removable
                @remove="removeFilter(filter)"
              >
                {{ filter }}
              </q-chip>
              <q-btn
                flat
                dense
                size="sm"
                label="Clear all"
                color="grey-6"
                @click="clearAllFilters"
              />
            </div>
          </div>

          <RepoList
            :loading="reposPending"
            :error="reposError"
            :error-message="$t('dashboard.errors.loadRepos')"
            :empty="!filteredRepos?.length"
            :empty-message="emptyMessage"
          >
            <div class="repo-grid">
              <RepoCard
                v-for="repo in filteredRepos"
                :key="getRepoKey(repo)"
                :repo="repo"
                :is-subscribed="repo.isSubscribed"
                @click="handleRepoClick(repo)"
              >
                <template #action>
                  <q-btn
                    v-if="repo.isSubscribed"
                    flat
                    dense
                    round
                    color="amber"
                    size="sm"
                    icon="star"
                    :loading="unsubscribingId === getRepoDbId(repo)"
                    @click="handleUnsubscribe(getRepoDbId(repo)!)"
                  >
                    <q-tooltip>{{ $t("dashboard.unsubscribe") }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else
                    outline
                    color="grey-6"
                    size="sm"
                    icon="star_outline"
                    :loading="subscribingId === getRepoKey(repo)"
                    @click="handleSubscribe(repo)"
                    class="text-capitalize"
                  >
                    {{ $t("dashboard.subscribe") }}
                  </q-btn>
                </template>
              </RepoCard>
            </div>
          </RepoList>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import RepoList from "@/molecules/RepoList.vue";
import RepoCard from "@/molecules/RepoCard.vue";
import SearchBar from "@/molecules/SearchBar.vue";
import { useGitHubRepos, useSubscribedRepos } from "@/hooks/useRepos";
import { useSubscribe, useUnsubscribe } from "@/hooks/useSubscriptions";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth";
import { parseSearchQuery } from "@/utils/searchFilters";
import { getReauthorizeUrl } from "@/utils/api";
import type { GitHubRepo, SubscribedRepo } from "@/types";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const searchQuery = ref("is:subscribed");
const subscribingId = ref<number | null>(null);
const unsubscribingId = ref<number | null>(null);

const showSubscribedOnly = computed(() => {
  const filters = parseSearchQuery(searchQuery.value);
  return filters.isSubscribed;
});

const {
  data: subscribedReposResponse,
  isPending: subscribedPending,
  error: subscribedError,
} = useSubscribedRepos(1, 50);

const {
  data: githubReposResponse,
  isPending: githubPending,
  error: githubError,
} = useGitHubRepos(1, 50);

const repos = computed(() => {
  if (showSubscribedOnly.value) {
    return subscribedReposResponse.value?.data || [];
  }
  return githubReposResponse.value?.data || [];
});

const reposPending = computed(() => {
  if (showSubscribedOnly.value) {
    return subscribedPending.value;
  }
  return githubPending.value;
});

const reposError = computed(() => {
  if (showSubscribedOnly.value) {
    return subscribedError.value;
  }
  return githubError.value;
});

const subscribeMutation = useSubscribe();
const unsubscribeMutation = useUnsubscribe();
const logoutMutation = useLogout();

const activeFilters = computed(() => {
  const filters = parseSearchQuery(searchQuery.value);
  const active: string[] = [];

  if (filters.isSubscribed) active.push("is:subscribed");
  if (filters.isPrivate) active.push("is:private");
  if (filters.isPublic) active.push("is:public");
  if (filters.org) active.push(`org:${filters.org}`);
  if (filters.user) active.push(`user:${filters.user}`);
  if (filters.language) active.push(`language:${filters.language}`);
  if (filters.topic) active.push(`topic:${filters.topic}`);

  return active;
});

const filteredRepos = computed<(GitHubRepo | SubscribedRepo)[]>(() => {
  if (!repos.value.length) return [];

  const filters = parseSearchQuery(searchQuery.value);

  return repos.value.filter((repo) => {
    if (filters.isPrivate && !repo.isPrivate) return false;
    if (filters.isPublic && repo.isPrivate) return false;

    if (filters.org) {
      const owner = repo.ownerLogin.toLowerCase();
      const filterOrg = filters.org.toLowerCase();
      if (!owner.includes(filterOrg)) return false;
    }

    if (filters.user) {
      const owner = repo.ownerLogin.toLowerCase();
      const filterUser = filters.user.toLowerCase();
      if (!owner.includes(filterUser)) return false;
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      const fullName = repo.fullName.toLowerCase();
      const owner = repo.ownerLogin.toLowerCase();

      if (!fullName.includes(query) && !owner.includes(query)) {
        return false;
      }
    }

    return true;
  });
});

const emptyMessage = computed(() => {
  const filters = parseSearchQuery(searchQuery.value);
  if (filters.isSubscribed) return t("dashboard.noSubscribed");
  if (searchQuery.value) return t("dashboard.noResults");
  return t("dashboard.noRepos");
});

const removeFilter = (filter: string) => {
  const current = searchQuery.value;
  searchQuery.value = current.replace(filter, "").trim().replace(/\s+/g, " ");
};

const clearAllFilters = () => {
  const filters = parseSearchQuery(searchQuery.value);
  searchQuery.value = filters.query;
};

const getRepoKey = (repo: GitHubRepo | SubscribedRepo): number => {
  if ("id" in repo) return repo.id;
  return repo.githubId;
};

const getRepoDbId = (repo: GitHubRepo | SubscribedRepo): number | null => {
  if ("id" in repo) return repo.id;
  return repo.subscribedRepoId;
};

const handleRepoClick = (repo: GitHubRepo | SubscribedRepo) => {
  const dbId = getRepoDbId(repo);
  if (!dbId) return;
  router.push({ name: "repository", params: { id: dbId } });
};

const handleSubscribe = (repo: GitHubRepo | SubscribedRepo) => {
  subscribingId.value = repo.githubId;
  subscribeMutation.mutate(repo as GitHubRepo, {
    onSettled: () => {
      subscribingId.value = null;
    },
  });
};

const handleUnsubscribe = (repoId: number) => {
  unsubscribingId.value = repoId;
  unsubscribeMutation.mutate(repoId, {
    onSettled: () => {
      unsubscribingId.value = null;
    },
  });
};

const handleLogout = () => {
  logoutMutation.mutate();
};

const handleReauthorize = () => {
  window.location.href = getReauthorizeUrl();
};
</script>

<style scoped>
.constrain-width {
  width: 100%;
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

@media (max-width: 600px) {
  .repo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
