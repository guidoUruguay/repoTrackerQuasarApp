<template>
  <q-card
    flat
    bordered
    class="bg-grey-9 cursor-pointer hover-card"
    style="border-color: rgba(255, 255, 255, 0.1)"
    @click="emit('click', requirement)"
  >
    <q-card-section>
      <div class="row items-start no-wrap">
        <div class="col">
          <div class="row items-center q-gutter-sm q-mb-xs">
            <span class="text-subtitle1 text-weight-medium">
              {{ requirement.title }}
            </span>
            <q-badge :color="statusColor" :label="statusLabel" />
          </div>
          <div
            v-if="requirement.description"
            class="text-caption text-grey-6 q-mb-sm"
          >
            {{ requirement.description }}
          </div>
          <div class="q-mt-sm">
            <div class="row items-center q-gutter-xs q-mb-xs">
              <span class="text-caption text-grey-5">Progress:</span>
              <span class="text-body2 text-weight-medium">
                {{ requirement.progress }}%
              </span>
            </div>
            <q-linear-progress
              :value="requirement.progress / 100"
              :color="progressColor"
              size="8px"
              rounded
              class="q-mb-xs"
            />
            <div
              v-if="requirement.progresses?.length"
              class="text-caption text-grey-6"
            >
              {{ requirement.progresses.length }} commit{{
                requirement.progresses.length !== 1 ? "s" : ""
              }}
              contributed
            </div>
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            round
            icon="edit"
            size="sm"
            @click.stop="emit('edit', requirement)"
          >
            <q-tooltip>{{ $t("requirements.edit") }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="delete"
            size="sm"
            color="negative"
            @click.stop="emit('delete', requirement)"
          >
            <q-tooltip>{{ $t("requirements.delete") }}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Requirement } from "@/types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  requirement: Requirement;
}>();

const emit = defineEmits<{
  click: [requirement: Requirement];
  edit: [requirement: Requirement];
  delete: [requirement: Requirement];
}>();

const { t } = useI18n();

const statusColor = computed(() => {
  switch (props.requirement.status) {
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
  return t(`requirements.status.${props.requirement.status}`);
});

const progressColor = computed(() => {
  if (props.requirement.progress === 100) return "positive";
  if (props.requirement.progress >= 50) return "primary";
  return "orange";
});
</script>

<style scoped>
.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-2px);
}
</style>
