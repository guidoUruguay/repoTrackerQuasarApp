<template>
  <q-card
    flat
    bordered
    class="bg-grey-9"
    style="border-color: rgba(255, 255, 255, 0.1)"
  >
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="row items-center q-gutter-sm">
            <span class="text-subtitle1 text-weight-medium">
              {{ prompt.name }}
            </span>
            <q-badge
              :color="prompt.type === 'ai' ? 'primary' : 'teal'"
              :label="
                prompt.type === 'ai'
                  ? $t('prompts.typeAI')
                  : $t('prompts.typeStatic')
              "
            />
            <q-badge
              :color="prompt.isActive ? 'positive' : 'grey-7'"
              :label="
                prompt.isActive ? $t('prompts.active') : $t('prompts.inactive')
              "
            />
          </div>
          <div
            v-if="prompt.description"
            class="text-caption text-grey-6 q-mt-xs"
          >
            {{ prompt.description }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            round
            icon="edit"
            size="sm"
            @click="emit('edit', prompt)"
          >
            <q-tooltip>{{ $t("prompts.edit") }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="delete"
            size="sm"
            color="negative"
            @click="emit('delete', prompt)"
          >
            <q-tooltip>{{ $t("prompts.delete") }}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div
        class="text-body2 text-grey-5"
        style="white-space: pre-wrap; max-height: 100px; overflow: hidden"
      >
        {{ prompt.content }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Prompt } from "@/types";

defineProps<{
  prompt: Prompt;
}>();

const emit = defineEmits<{
  edit: [prompt: Prompt];
  delete: [prompt: Prompt];
}>();
</script>
