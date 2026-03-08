<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">{{ $t("requirements.title") }}</div>
      <q-btn
        color="primary"
        icon="add"
        :label="$t('requirements.createRequirement')"
        @click="showCreateDialog = true"
      />
    </div>

    <div v-if="isLoading" class="text-center q-pa-lg">
      <q-spinner size="lg" color="primary" />
    </div>

    <div
      v-else-if="requirements?.data.length === 0"
      class="text-center q-pa-lg text-grey-6"
    >
      {{ $t("requirements.noRequirements") }}
    </div>

    <div v-else class="q-gutter-md">
      <requirement-card
        v-for="req in requirements?.data"
        :key="req.id"
        :requirement="req"
        @click="handleViewRequirement(req)"
        @edit="handleEditRequirement(req)"
        @delete="handleDeleteRequirement(req)"
      />
    </div>

    <q-dialog v-model="showCreateDialog">
      <requirement-form
        @submit="handleCreateSubmit"
        @cancel="showCreateDialog = false"
      />
    </q-dialog>

    <q-dialog v-model="showEditDialog">
      <requirement-form
        v-if="selectedRequirement"
        :requirement="selectedRequirement"
        editing
        @submit="handleEditSubmit"
        @cancel="showEditDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useRequirements,
  useCreateRequirement,
  useUpdateRequirement,
  useDeleteRequirement,
} from "@/hooks/useRequirements";
import RequirementCard from "@/molecules/RequirementCard.vue";
import RequirementForm from "@/molecules/RequirementForm.vue";
import type { Requirement } from "@/types";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n();

const repositoryId = Number(route.params.repositoryId);
const { data: requirements, isLoading } = useRequirements(repositoryId);
const createMutation = useCreateRequirement();
const updateMutation = useUpdateRequirement();
const deleteMutation = useDeleteRequirement();

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const selectedRequirement = ref<Requirement | null>(null);

const handleViewRequirement = (requirement: Requirement) => {
  router.push(`/requirements/${requirement.id}`);
};

const handleEditRequirement = (requirement: Requirement) => {
  selectedRequirement.value = requirement;
  showEditDialog.value = true;
};

const handleDeleteRequirement = (requirement: Requirement) => {
  $q.dialog({
    title: t("requirements.confirmDelete"),
    message: t("requirements.confirmDeleteMessage", {
      title: requirement.title,
    }),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteMutation.mutate({
      requirementId: requirement.id,
      repositoryId: requirement.repositoryId,
    });
  });
};

const handleCreateSubmit = (data: { title: string; description?: string }) => {
  createMutation.mutate(
    { repositoryId, data },
    {
      onSuccess: () => {
        showCreateDialog.value = false;
        $q.notify({
          type: "positive",
          message: t("requirements.createSuccess"),
        });
      },
    },
  );
};

const handleEditSubmit = (data: any) => {
  if (!selectedRequirement.value) return;

  updateMutation.mutate(
    { requirementId: selectedRequirement.value.id, data },
    {
      onSuccess: () => {
        showEditDialog.value = false;
        selectedRequirement.value = null;
        $q.notify({
          type: "positive",
          message: t("requirements.updateSuccess"),
        });
      },
    },
  );
};
</script>
