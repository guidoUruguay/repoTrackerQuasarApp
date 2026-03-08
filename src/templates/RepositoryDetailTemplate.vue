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
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          class="q-mr-sm"
          @click="router.push({ name: 'dashboard' })"
        >
          <q-tooltip>{{ $t("common.appName") }}</q-tooltip>
        </q-btn>

        <div class="row items-center q-gutter-sm">
          <q-icon name="mdi-github" size="md" />
          <div class="text-h6 text-weight-regular">
            {{
              stats?.repository.fullName ||
              repo?.fullName ||
              $t("common.loading")
            }}
          </div>
          <q-badge
            v-if="repo?.isPrivate"
            color="orange"
            outline
            label="Private"
          />
        </div>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <q-btn
            v-if="repo"
            color="primary"
            dense
            icon="play_arrow"
            :label="$t('repoDetail.runAnalysis')"
            size="sm"
            @click="showAnalyzeDialog = true"
          />
          <q-btn
            v-if="repo"
            flat
            dense
            icon="open_in_new"
            size="sm"
            :href="repo.htmlUrl"
            target="_blank"
            tag="a"
          >
            <q-tooltip>{{ $t("repoDetail.viewOnGitHub") }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="repo"
            flat
            dense
            color="amber"
            icon="star"
            size="sm"
            :loading="unsubscribeMutation.isPending.value"
            @click="handleUnsubscribe"
          >
            <q-tooltip>{{ $t("dashboard.unsubscribe") }}</q-tooltip>
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
          <div v-if="repoPending && statsPending" class="text-center q-pa-xl">
            <q-spinner size="lg" color="primary" />
            <div class="text-grey-6 q-mt-md">{{ $t("common.loading") }}</div>
          </div>

          <div v-else-if="repoError" class="text-center q-pa-xl">
            <q-icon name="error" size="xl" color="negative" />
            <div class="text-negative q-mt-md">
              {{ $t("repoDetail.errors.loadRepo") }}
            </div>
          </div>

          <template v-else-if="repo">
            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-6 col-sm-3">
                <q-card
                  flat
                  bordered
                  class="bg-grey-9"
                  style="border-color: rgba(255, 255, 255, 0.1)"
                >
                  <q-card-section>
                    <div class="text-caption text-grey-6">
                      {{ $t("repoDetail.defaultBranch") }}
                    </div>
                    <div class="row items-center q-gutter-xs q-mt-xs">
                      <q-icon
                        name="mdi-source-branch"
                        size="sm"
                        color="primary"
                      />
                      <span class="text-body1">{{ repo.defaultBranch }}</span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-6 col-sm-3">
                <q-card
                  flat
                  bordered
                  class="bg-grey-9"
                  style="border-color: rgba(255, 255, 255, 0.1)"
                >
                  <q-card-section>
                    <div class="text-caption text-grey-6">
                      {{ $t("repoDetail.totalCommits") }}
                    </div>
                    <div class="row items-center q-gutter-xs q-mt-xs">
                      <q-icon
                        name="mdi-source-commit"
                        size="sm"
                        color="positive"
                      />
                      <span class="text-body1 text-weight-bold">
                        {{
                          stats?.statistics.totalCommitsInGitHub ??
                          repo.commitsCount ??
                          0
                        }}
                      </span>
                    </div>
                    <div v-if="stats" class="text-caption text-grey-7 q-mt-xs">
                      {{ stats.statistics.analyzedCommits }}
                      {{ $t("repoDetail.analyzed") }} ({{
                        stats.statistics.analyzedPercentage
                      }}%)
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-6 col-sm-3">
                <q-card
                  flat
                  bordered
                  class="bg-grey-9"
                  style="border-color: rgba(255, 255, 255, 0.1)"
                >
                  <q-card-section>
                    <div class="text-caption text-grey-6">
                      {{ $t("repoDetail.totalAuthors") }}
                    </div>
                    <div class="row items-center q-gutter-xs q-mt-xs">
                      <q-icon name="people" size="sm" color="info" />
                      <span class="text-body1 text-weight-bold">
                        {{ stats?.statistics.totalAuthors ?? 0 }}
                      </span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-6 col-sm-3">
                <q-card
                  flat
                  bordered
                  class="bg-grey-9"
                  style="border-color: rgba(255, 255, 255, 0.1)"
                >
                  <q-card-section>
                    <div class="text-caption text-grey-6">
                      {{ $t("repoDetail.analyses") }}
                    </div>
                    <div class="row items-center q-gutter-xs q-mt-xs">
                      <q-icon name="mdi-chart-box" size="sm" color="warning" />
                      <span class="text-body1 text-weight-bold">
                        {{
                          stats?.statistics.totalAnalyses ??
                          repo.codeAnalysesCount ??
                          0
                        }}
                      </span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div v-if="stats" class="row q-col-gutter-md q-mb-lg">
              <div class="col-12 col-sm-6">
                <q-card
                  flat
                  bordered
                  class="bg-grey-9"
                  style="border-color: rgba(255, 255, 255, 0.1)"
                >
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-sm">
                      {{ $t("repoDetail.fileActivity") }}
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-4 text-center">
                        <div class="text-h5 text-positive text-weight-bold">
                          {{ stats.statistics.totalFiles.added }}
                        </div>
                        <div class="text-caption text-grey-6">
                          {{ $t("repoDetail.filesAdded") }}
                        </div>
                      </div>
                      <div class="col-4 text-center">
                        <div class="text-h5 text-warning text-weight-bold">
                          {{ stats.statistics.totalFiles.modified }}
                        </div>
                        <div class="text-caption text-grey-6">
                          {{ $t("repoDetail.filesModified") }}
                        </div>
                      </div>
                      <div class="col-4 text-center">
                        <div class="text-h5 text-negative text-weight-bold">
                          {{ stats.statistics.totalFiles.removed }}
                        </div>
                        <div class="text-caption text-grey-6">
                          {{ $t("repoDetail.filesRemoved") }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-sm-6">
                <q-card
                  flat
                  bordered
                  class="bg-grey-9"
                  style="border-color: rgba(255, 255, 255, 0.1)"
                >
                  <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-sm">
                      {{ $t("repoDetail.dateRange") }}
                    </div>
                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <div class="text-caption text-grey-6">
                          {{ $t("repoDetail.firstCommit") }}
                        </div>
                        <div class="text-body2">
                          {{
                            formatFullDate(
                              stats.statistics.dateRange.firstCommit,
                            )
                          }}
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="text-caption text-grey-6">
                          {{ $t("repoDetail.lastCommit") }}
                        </div>
                        <div class="text-body2">
                          {{
                            formatFullDate(
                              stats.statistics.dateRange.lastCommit,
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <q-card
              v-if="stats?.authors.length"
              flat
              bordered
              class="bg-grey-9 q-mb-lg"
              style="border-color: rgba(255, 255, 255, 0.1)"
            >
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  {{ $t("repoDetail.contributors") }}
                </div>
                <q-list separator class="rounded-borders">
                  <q-item
                    v-for="(author, index) in stats.authors"
                    :key="author.id ?? index"
                    class="q-pa-sm"
                  >
                    <q-item-section avatar>
                      <q-avatar size="32px">
                        <img
                          v-if="author.avatarUrl"
                          :src="author.avatarUrl"
                          :alt="author.name"
                        />
                        <span
                          v-else
                          class="text-white bg-primary full-width full-height flex flex-center"
                        >
                          {{ author.name.charAt(0).toUpperCase() }}
                        </span>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-grey-3">
                        {{ author.name }}
                        <span
                          v-if="author.username"
                          class="text-grey-6 text-caption q-ml-xs"
                        >
                          @{{ author.username }}
                        </span>
                      </q-item-label>
                      <q-item-label caption class="text-grey-6">
                        {{ author.email }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="row items-center q-gutter-sm">
                        <q-badge
                          color="primary"
                          :label="`${author.commitCount} commits`"
                        />
                        <q-badge
                          v-if="author.analyzedCommitCount > 0"
                          color="positive"
                          outline
                          :label="`${author.analyzedCommitCount} analyzed`"
                        />
                        <span
                          v-if="author.lastCommitDate"
                          class="text-caption text-grey-6"
                        >
                          {{ formatDate(author.lastCommitDate) }}
                        </span>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="bg-grey-9 q-mb-lg"
              style="border-color: rgba(255, 255, 255, 0.1)"
            >
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6">
                    {{ $t("requirements.title") }}
                  </div>
                  <q-btn
                    flat
                    dense
                    icon="arrow_forward"
                    :label="$t('requirements.viewAll')"
                    color="primary"
                    @click="
                      router.push(`/repositories/${props.id}/requirements`)
                    "
                  />
                </div>

                <div v-if="requirementsPending" class="text-center q-pa-md">
                  <q-spinner size="md" color="primary" />
                </div>

                <div
                  v-else-if="!requirements?.data.length"
                  class="text-grey-6 text-center q-pa-md"
                >
                  {{ $t("requirements.noRequirements") }}
                </div>

                <div v-else class="q-gutter-sm">
                  <requirement-card
                    v-for="req in requirements.data.slice(0, 3)"
                    :key="req.id"
                    :requirement="req"
                    @click="router.push(`/requirements/${req.id}`)"
                  />
                </div>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="bg-grey-9 q-mb-lg"
              style="border-color: rgba(255, 255, 255, 0.1)"
            >
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  {{ $t("repoDetail.recentCommits") }}
                </div>

                <div v-if="commitsPending" class="text-center q-pa-md">
                  <q-spinner size="md" color="primary" />
                </div>

                <div
                  v-else-if="commitsError"
                  class="text-negative text-center q-pa-md"
                >
                  {{ $t("repoDetail.errors.loadCommits") }}
                </div>

                <div
                  v-else-if="!commits?.length"
                  class="text-grey-6 text-center q-pa-md"
                >
                  {{ $t("repoDetail.noCommits") }}
                </div>

                <q-list v-else separator class="rounded-borders">
                  <q-item
                    v-for="commit in commits"
                    :key="commit.id"
                    class="q-pa-sm"
                  >
                    <q-item-section avatar>
                      <q-avatar size="32px" color="grey-8" text-color="grey-4">
                        <q-icon name="mdi-source-commit" size="xs" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-grey-3">
                        {{ commit.message.split("\n")[0] }}
                      </q-item-label>
                      <q-item-label caption class="text-grey-6">
                        <span class="text-primary">{{
                          commit.sha.substring(0, 7)
                        }}</span>
                        <span class="q-mx-xs">&middot;</span>
                        {{ commit.author.name }}
                        <span class="q-mx-xs">&middot;</span>
                        {{ formatDate(commit.authorDate) }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="row q-gutter-xs">
                        <q-badge
                          v-if="commit.addedFiles.length"
                          color="positive"
                          :label="`+${commit.addedFiles.length}`"
                        />
                        <q-badge
                          v-if="commit.modifiedFiles.length"
                          color="warning"
                          :label="`~${commit.modifiedFiles.length}`"
                        />
                        <q-badge
                          v-if="commit.removedFiles.length"
                          color="negative"
                          :label="`-${commit.removedFiles.length}`"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div
                  v-if="commitsMeta && commitsMeta.lastPage > 1"
                  class="row justify-center q-mt-md"
                >
                  <q-pagination
                    v-model="commitsPage"
                    :max="commitsMeta.lastPage"
                    :max-pages="7"
                    direction-links
                    color="primary"
                    active-design="unelevated"
                    active-color="primary"
                  />
                </div>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="bg-grey-9"
              style="border-color: rgba(255, 255, 255, 0.1)"
            >
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  {{ $t("repoDetail.codeAnalyses") }}
                </div>

                <div v-if="analysesPending" class="text-center q-pa-md">
                  <q-spinner size="md" color="primary" />
                </div>

                <div
                  v-else-if="analysesError"
                  class="text-negative text-center q-pa-md"
                >
                  {{ $t("repoDetail.errors.loadAnalyses") }}
                </div>

                <div
                  v-else-if="!analyses?.length"
                  class="text-grey-6 text-center q-pa-md"
                >
                  {{ $t("repoDetail.noAnalyses") }}
                </div>

                <q-list v-else separator class="rounded-borders">
                  <q-item
                    v-for="analysis in analyses"
                    :key="analysis.id"
                    class="q-pa-sm"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        size="32px"
                        :color="scoreColor(analysis.overallQualityScore)"
                        text-color="white"
                      >
                        {{ analysis.overallQualityScore }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-grey-3">
                        {{ $t("repoDetail.qualityScore") }}:
                        {{ analysis.overallQualityScore }}/100
                      </q-item-label>
                      <q-item-label caption class="text-grey-6">
                        {{ $t("repoDetail.complexity") }}:
                        {{ analysis.complexityScore }}
                        <span class="q-mx-xs">&middot;</span>
                        {{ analysis.issuesFound.length }}
                        {{ $t("repoDetail.issues") }}
                        <span class="q-mx-xs">&middot;</span>
                        {{ formatDate(analysis.createdAt) }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge
                        :color="statusColor(analysis.analysisStatus)"
                        :label="analysis.analysisStatus"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>

                <div
                  v-if="analysesMeta && analysesMeta.lastPage > 1"
                  class="row justify-center q-mt-md"
                >
                  <q-pagination
                    v-model="analysesPage"
                    :max="analysesMeta.lastPage"
                    :max-pages="7"
                    direction-links
                    color="primary"
                    active-design="unelevated"
                    active-color="primary"
                  />
                </div>
              </q-card-section>
            </q-card>
          </template>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="showAnalyzeDialog">
      <q-card class="bg-grey-9" style="min-width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">{{ $t("repoDetail.selectCommits") }}</div>
          <div class="text-caption text-grey-6">
            {{ $t("repoDetail.selectCommitsHint") }}
          </div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          style="max-height: 400px; overflow-y: auto"
        >
          <q-list v-if="commits.length" dense separator>
            <q-item
              v-for="commit in commits"
              :key="commit.id"
              tag="label"
              class="q-pa-sm"
            >
              <q-item-section avatar>
                <q-checkbox
                  v-model="selectedCommitIds"
                  :val="commit.id"
                  color="primary"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-grey-3">
                  {{ commit.message.split("\n")[0] }}
                </q-item-label>
                <q-item-label caption class="text-grey-6">
                  <span class="text-primary">{{
                    commit.sha.substring(0, 7)
                  }}</span>
                  <span class="q-mx-xs">&middot;</span>
                  {{ commit.author.name }}
                  <span class="q-mx-xs">&middot;</span>
                  {{ formatDate(commit.authorDate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey-6 text-center q-pa-md">
            {{ $t("repoDetail.noCommits") }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('prompts.cancel')" v-close-popup />
          <q-btn
            color="primary"
            :label="$t('repoDetail.runAnalysis')"
            :loading="analyzeMutation.isPending.value"
            :disable="!selectedCommitIds.length"
            @click="handleAnalyze"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useRepository, useRepositoryStats } from "@/hooks/useRepos";
import { useRepositoryCommits } from "@/hooks/useCommits";
import { useRepositoryAnalyses, useTriggerAnalysis } from "@/hooks/useAnalyses";
import { useUnsubscribe } from "@/hooks/useSubscriptions";
import { useRequirements } from "@/hooks/useRequirements";
import RequirementCard from "@/molecules/RequirementCard.vue";

const props = defineProps<{
  id: number;
}>();

const router = useRouter();
const commitsPage = ref(1);
const analysesPage = ref(1);
const showAnalyzeDialog = ref(false);
const selectedCommitIds = ref<number[]>([]);

const {
  data: repo,
  isPending: repoPending,
  error: repoError,
} = useRepository(props.id);

const { data: stats, isPending: statsPending } = useRepositoryStats(props.id);

const { data: requirements, isPending: requirementsPending } = useRequirements(
  props.id,
  1,
);

const {
  data: commitsResponse,
  isPending: commitsPending,
  error: commitsError,
} = useRepositoryCommits(props.id, commitsPage.value);

const {
  data: analysesResponse,
  isPending: analysesPending,
  error: analysesError,
} = useRepositoryAnalyses(props.id, analysesPage.value);

const commits = computed(() => commitsResponse.value?.data || []);
const commitsMeta = computed(() => commitsResponse.value?.meta);
const analyses = computed(() => analysesResponse.value?.data || []);
const analysesMeta = computed(() => analysesResponse.value?.meta);

const unsubscribeMutation = useUnsubscribe();
const analyzeMutation = useTriggerAnalysis();

const handleUnsubscribe = () => {
  unsubscribeMutation.mutate(props.id, {
    onSuccess: () => {
      router.push({ name: "dashboard" });
    },
  });
};

const handleAnalyze = () => {
  analyzeMutation.mutate(
    { repositoryId: props.id, commitIds: selectedCommitIds.value },
    {
      onSuccess: () => {
        showAnalyzeDialog.value = false;
        selectedCommitIds.value = [];
      },
    },
  );
};

watch(showAnalyzeDialog, (open) => {
  if (open && commits.value.length) {
    selectedCommitIds.value = [commits.value[0].id];
  }
});

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const formatFullDate = (dateStr: string | null): string => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const scoreColor = (score: number): string => {
  if (score >= 80) return "positive";
  if (score >= 60) return "warning";
  return "negative";
};

const statusColor = (status: string): string => {
  if (status === "completed") return "positive";
  if (status === "pending") return "warning";
  return "negative";
};
</script>

<style scoped>
.constrain-width {
  width: 100%;
}
</style>
