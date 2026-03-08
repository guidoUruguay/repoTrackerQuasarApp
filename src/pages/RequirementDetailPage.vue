<template>
  <div class="q-pa-md">
    <div v-if="isLoading" class="text-center q-pa-lg">
      <q-spinner size="lg" color="primary" />
    </div>

    <div v-else-if="requirement" class="q-gutter-md">
      <q-btn
        flat
        icon="arrow_back"
        :label="$t('requirements.backToList')"
        @click="router.back()"
      />

      <q-card
        flat
        bordered
        class="bg-grey-9"
        style="border-color: rgba(255, 255, 255, 0.1)"
      >
        <q-card-section>
          <div class="row items-start justify-between q-mb-sm">
            <div class="col">
              <div class="row items-center q-gutter-sm q-mb-xs">
                <span class="text-h5 text-weight-medium">
                  {{ requirement.title }}
                </span>
                <q-badge :color="statusColor" :label="statusLabel" />
              </div>
              <div
                v-if="requirement.description"
                class="text-body2 text-grey-6 q-mt-sm"
              >
                {{ requirement.description }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn
                flat
                icon="edit"
                :label="$t('requirements.edit')"
                @click="showEditDialog = true"
              />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row q-gutter-md">
            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-5 q-mb-xs">
                {{ $t("requirements.progress") }}
              </div>
              <div class="text-h6 text-weight-bold">
                {{ requirement.progress }}%
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-5 q-mb-xs">
                {{ $t("requirements.status.label") }}
              </div>
              <div class="text-body1">{{ statusLabel }}</div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-5 q-mb-xs">
                {{ $t("requirements.createdAt") }}
              </div>
              <div class="text-body2">
                {{ formatDate(requirement.createdAt) }}
              </div>
            </div>
            <div v-if="requirement.completedAt" class="col-12 col-md-3">
              <div class="text-caption text-grey-5 q-mb-xs">
                {{ $t("requirements.completedAt") }}
              </div>
              <div class="text-body2">
                {{ formatDate(requirement.completedAt) }}
              </div>
            </div>
          </div>

          <div class="q-mt-md">
            <q-linear-progress
              :value="requirement.progress / 100"
              :color="progressColor"
              size="12px"
              rounded
            />
          </div>
        </q-card-section>
      </q-card>

      <div class="text-h6 q-mt-lg q-mb-md">
        {{ $t("requirements.progressTimeline") }}
      </div>

      <div
        v-if="!requirement.progresses?.length"
        class="text-center text-grey-6 q-pa-lg"
      >
        {{ $t("requirements.noProgress") }}
      </div>

      <requirement-progress-timeline
        v-else
        :progresses="requirement.progresses"
        :requirement="requirement"
      />
    </div>

    <q-dialog v-model="showEditDialog">
      <requirement-form
        :requirement="requirement"
        editing
        @submit="handleEditSubmit"
        @cancel="showEditDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRequirement, useUpdateRequirement } from "@/hooks/useRequirements";
import RequirementProgressTimeline from "@/molecules/RequirementProgressTimeline.vue";
import RequirementForm from "@/molecules/RequirementForm.vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();

const requirementId = Number(route.params.requirementId);
const { data: requirement, isLoading } = useRequirement(requirementId);
const updateMutation = useUpdateRequirement();

const showEditDialog = ref(false);

const statusColor = computed(() => {
  if (!requirement.value) return "grey-7";
  switch (requirement.value.status) {
    case "completed":
      return "positive";
    case "in_progress":
      return "primary";
    case "blocked":
      return "negative";
    default:
      return "grey-7";
  }
});

const statusLabel = computed(() => {
  if (!requirement.value) return "";
  return t(`requirements.status.${requirement.value.status}`);
});

const progressColor = computed(() => {
  if (!requirement.value) return "grey";
  if (requirement.value.progress === 100) return "positive";
  if (requirement.value.progress >= 50) return "primary";
  return "orange";
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleEditSubmit = (data: any) => {
  if (!requirement.value) return;

  updateMutation.mutate(
    { requirementId: requirement.value.id, data },
    {
      onSuccess: () => {
        showEditDialog.value = false;
        $q.notify({
          type: "positive",
          message: t("requirements.updateSuccess"),
        });
      },
    },
  );
};
</script>
