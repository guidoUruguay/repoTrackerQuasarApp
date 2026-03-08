<template>
  <q-timeline color="primary">
    <q-timeline-entry
      v-for="progress in sortedProgresses"
      :key="progress.id"
      :title="formatCommitTitle(progress.commit)"
      :subtitle="formatDate(progress.detectedAt)"
      :icon="getIcon(progress.analysisResult)"
      :color="getColor(progress.analysisResult)"
    >
      <div class="q-gutter-sm">
        <div v-if="progress.aiSummary" class="text-body2">
          {{ progress.aiSummary }}
        </div>

        <div class="row items-center q-gutter-xs">
          <q-chip
            size="sm"
            :color="progress.progressDelta > 0 ? 'positive' : 'grey-7'"
            text-color="white"
            dense
          >
            {{ progress.progressDelta > 0 ? "+" : ""
            }}{{ progress.progressDelta }}%
          </q-chip>
          <q-chip
            size="sm"
            color="grey-8"
            text-color="white"
            dense
            icon="percent"
          >
            {{ $t("requirements.confidence") }}:
            {{ Math.round(progress.analysisResult.confidence * 100) }}%
          </q-chip>
        </div>

        <div
          v-if="progress.analysisResult.detectedFeatures?.length"
          class="q-mt-xs"
        >
          <div class="text-caption text-grey-5 q-mb-xs">
            {{ $t("requirements.detectedFeatures") }}:
          </div>
          <div class="q-gutter-xs">
            <q-chip
              v-for="(feature, idx) in progress.analysisResult.detectedFeatures"
              :key="idx"
              size="sm"
              color="grey-8"
              text-color="white"
              dense
            >
              {{ feature }}
            </q-chip>
          </div>
        </div>

        <div v-if="progress.commit" class="q-mt-sm">
          <q-btn
            flat
            dense
            size="sm"
            icon="code"
            :label="$t('requirements.viewCommit')"
            color="primary"
            @click="viewCommit(progress.commit)"
          />
        </div>
      </div>
    </q-timeline-entry>
  </q-timeline>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RequirementProgress, Requirement, Commit } from "@/types";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  progresses: RequirementProgress[];
  requirement: Requirement;
}>();

const { t } = useI18n();
const router = useRouter();

const sortedProgresses = computed(() =>
  [...props.progresses].sort(
    (a, b) =>
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
  ),
);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCommitTitle = (commit?: Commit) => {
  if (!commit) return t("requirements.unknownCommit");
  const shortSha = commit.sha.substring(0, 7);
  const shortMessage =
    commit.message.length > 60
      ? commit.message.substring(0, 60) + "..."
      : commit.message;
  return `${shortSha}: ${shortMessage}`;
};

const getIcon = (analysisResult: {
  isRelevant: boolean;
  progressDelta: number;
}) => {
  if (!analysisResult.isRelevant) return "info";
  if (analysisResult.progressDelta > 0) return "add_circle";
  return "remove_circle";
};

const getColor = (analysisResult: {
  isRelevant: boolean;
  progressDelta: number;
}) => {
  if (!analysisResult.isRelevant) return "grey-7";
  if (analysisResult.progressDelta > 0) return "positive";
  return "orange";
};

const viewCommit = (commit: Commit) => {
  router.push(`/repositories/${commit.repositoryId}/commits/${commit.id}`);
};
</script>
