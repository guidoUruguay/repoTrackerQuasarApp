<template>
  <q-card
    flat
    bordered
    class="bg-grey-9"
    style="border-color: rgba(255, 255, 255, 0.1)"
  >
    <q-card-section>
      <div class="text-h6 q-mb-md">
        {{ editing ? $t("prompts.editPrompt") : $t("prompts.createPrompt") }}
      </div>
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="form.name"
          :label="$t('prompts.name')"
          standout="bg-grey-8"
          dense
          :rules="[(v: string) => !!v || $t('prompts.nameRequired')]"
        />

        <q-input
          v-model="form.content"
          :label="$t('prompts.content')"
          standout="bg-grey-8"
          type="textarea"
          autogrow
          :rules="[(v: string) => !!v || $t('prompts.contentRequired')]"
        />

        <q-input
          v-model="form.description"
          :label="$t('prompts.description')"
          standout="bg-grey-8"
          dense
        />

        <div class="row items-center q-gutter-md">
          <q-option-group
            v-model="form.type"
            :options="typeOptions"
            inline
            color="primary"
          />
          <q-toggle
            v-model="form.isActive"
            :label="$t('prompts.active')"
            color="positive"
          />
        </div>

        <div class="row justify-end q-gutter-sm">
          <q-btn flat :label="$t('prompts.cancel')" @click="emit('cancel')" />
          <q-btn
            type="submit"
            color="primary"
            :label="editing ? $t('prompts.save') : $t('prompts.create')"
            :loading="loading"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { Prompt } from "@/types";

const { t } = useI18n();

const props = defineProps<{
  prompt?: Prompt;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Omit<Prompt, "id" | "createdAt" | "updatedAt" | "userId">];
  cancel: [];
}>();

const editing = !!props.prompt;

const form = reactive({
  name: props.prompt?.name || "",
  content: props.prompt?.content || "",
  description: props.prompt?.description || "",
  type: (props.prompt?.type || "ai") as "ai" | "static",
  isActive: props.prompt?.isActive ?? true,
});

const typeOptions = [
  { label: t("prompts.typeAI"), value: "ai" },
  { label: t("prompts.typeStatic"), value: "static" },
];

watch(
  () => props.prompt,
  (p) => {
    if (!p) return;
    form.name = p.name;
    form.content = p.content;
    form.description = p.description || "";
    form.type = p.type;
    form.isActive = p.isActive;
  },
);

const handleSubmit = () => {
  emit("submit", { ...form });
};
</script>
