<template>
  <q-card
    flat
    bordered
    class="bg-grey-9"
    style="border-color: rgba(255, 255, 255, 0.1)"
  >
    <q-card-section>
      <div class="text-h6 q-mb-md">
        {{
          editing
            ? $t("requirements.editRequirement")
            : $t("requirements.createRequirement")
        }}
      </div>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="form.title"
          :label="$t('requirements.title')"
          standout="bg-grey-8"
          dense
          :rules="[(v: string) => !!v || $t('requirements.titleRequired')]"
        />

        <q-input
          v-model="form.description"
          :label="$t('requirements.description')"
          standout="bg-grey-8"
          type="textarea"
          autogrow
          :hint="$t('requirements.descriptionHint')"
        />

        <div v-if="editing" class="row items-center q-gutter-md">
          <q-select
            v-model="form.status"
            :options="statusOptions"
            :label="$t('requirements.status.label')"
            standout="bg-grey-8"
            dense
            class="col"
          />
          <q-input
            v-model.number="form.progress"
            :label="$t('requirements.progress')"
            type="number"
            min="0"
            max="100"
            standout="bg-grey-8"
            dense
            suffix="%"
            class="col"
          />
        </div>

        <div class="row justify-end q-gutter-sm">
          <q-btn
            flat
            :label="$t('common.cancel')"
            color="grey-6"
            @click="emit('cancel')"
          />
          <q-btn type="submit" :label="$t('common.save')" color="primary" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Requirement } from "@/types";
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  requirement?: Requirement;
  editing?: boolean;
}>();

const emit = defineEmits<{
  submit: [
    data: {
      title: string;
      description?: string;
      status?: "pending" | "in_progress" | "completed" | "blocked";
      progress?: number;
    },
  ];
  cancel: [];
}>();

const { t } = useI18n();

const form = ref({
  title: props.requirement?.title || "",
  description: props.requirement?.description || "",
  status: props.requirement?.status || "pending",
  progress: props.requirement?.progress || 0,
});

const statusOptions = computed(() => [
  {
    label: t("requirements.status.pending"),
    value: "pending",
  },
  {
    label: t("requirements.status.in_progress"),
    value: "in_progress",
  },
  {
    label: t("requirements.status.completed"),
    value: "completed",
  },
  {
    label: t("requirements.status.blocked"),
    value: "blocked",
  },
]);

watch(
  () => props.requirement,
  (newRequirement) => {
    if (newRequirement) {
      form.value = {
        title: newRequirement.title,
        description: newRequirement.description || "",
        status: newRequirement.status,
        progress: newRequirement.progress,
      };
    }
  },
);

const handleSubmit = () => {
  const data: {
    title: string;
    description?: string;
    status?: "pending" | "in_progress" | "completed" | "blocked";
    progress?: number;
  } = {
    title: form.value.title,
    description: form.value.description || undefined,
  };

  if (props.editing) {
    data.status = form.value.status as
      | "pending"
      | "in_progress"
      | "completed"
      | "blocked";
    data.progress = form.value.progress;
  }

  emit("submit", data);
};
</script>
