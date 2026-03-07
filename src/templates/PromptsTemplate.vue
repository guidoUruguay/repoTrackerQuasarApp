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
          <q-icon name="auto_awesome" size="md" />
          <div class="text-h6 text-weight-regular">
            {{ $t("prompts.title") }}
          </div>
        </div>

        <q-space />

        <q-btn
          color="primary"
          icon="add"
          :label="$t('prompts.createPrompt')"
          dense
          @click="
            showForm = true;
            editingPrompt = undefined;
          "
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-grey-10">
        <div
          class="constrain-width"
          style="max-width: 1280px; margin: 0 auto; padding: 24px 16px"
        >
          <PromptForm
            v-if="showForm"
            :prompt="editingPrompt"
            :loading="
              createMutation.isPending.value || updateMutation.isPending.value
            "
            class="q-mb-lg"
            @submit="handleSubmit"
            @cancel="showForm = false"
          />

          <div v-if="isPending" class="text-center q-pa-xl">
            <q-spinner size="lg" color="primary" />
            <div class="text-grey-6 q-mt-md">{{ $t("common.loading") }}</div>
          </div>

          <div v-else-if="error" class="text-center q-pa-xl">
            <q-icon name="error" size="xl" color="negative" />
            <div class="text-negative q-mt-md">
              {{ $t("prompts.errors.load") }}
            </div>
          </div>

          <div
            v-else-if="!prompts.length && !showForm"
            class="text-center q-pa-xl"
          >
            <q-icon name="auto_awesome" size="64px" color="grey-7" />
            <div class="text-h6 text-grey-6 q-mt-md">
              {{ $t("prompts.empty") }}
            </div>
            <q-btn
              color="primary"
              :label="$t('prompts.createFirst')"
              class="q-mt-md"
              @click="showForm = true"
            />
          </div>

          <div v-else class="q-gutter-md">
            <PromptCard
              v-for="prompt in prompts"
              :key="prompt.id"
              :prompt="prompt"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>

          <div
            v-if="meta && meta.lastPage > 1"
            class="row justify-center q-mt-lg"
          >
            <q-pagination
              v-model="page"
              :max="meta.lastPage"
              :max-pages="7"
              direction-links
              color="primary"
              active-design="unelevated"
              active-color="primary"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="confirmDelete" persistent>
      <q-card class="bg-grey-9" style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t("prompts.confirmDelete") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-5">
          {{ $t("prompts.confirmDeleteMsg", { name: deletingPrompt?.name }) }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('prompts.cancel')" v-close-popup />
          <q-btn
            flat
            color="negative"
            :label="$t('prompts.delete')"
            :loading="deleteMutation.isPending.value"
            @click="confirmDeleteAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  usePrompts,
  useCreatePrompt,
  useUpdatePrompt,
  useDeletePrompt,
} from "@/hooks/usePrompts";
import PromptForm from "@/molecules/PromptForm.vue";
import PromptCard from "@/molecules/PromptCard.vue";
import type { Prompt } from "@/types";

const router = useRouter();
const page = ref(1);
const showForm = ref(false);
const editingPrompt = ref<Prompt>();
const confirmDelete = ref(false);
const deletingPrompt = ref<Prompt>();

const { data: response, isPending, error } = usePrompts(page.value);

const prompts = computed(() => response.value?.data || []);
const meta = computed(() => response.value?.meta);

const createMutation = useCreatePrompt();
const updateMutation = useUpdatePrompt();
const deleteMutation = useDeletePrompt();

const handleSubmit = (
  data: Omit<Prompt, "id" | "createdAt" | "updatedAt" | "userId">,
) => {
  if (editingPrompt.value) {
    updateMutation.mutate(
      { id: editingPrompt.value.id, data },
      {
        onSuccess: () => {
          showForm.value = false;
          editingPrompt.value = undefined;
        },
      },
    );
    return;
  }
  createMutation.mutate(data, {
    onSuccess: () => {
      showForm.value = false;
    },
  });
};

const handleEdit = (prompt: Prompt) => {
  editingPrompt.value = prompt;
  showForm.value = true;
};

const handleDelete = (prompt: Prompt) => {
  deletingPrompt.value = prompt;
  confirmDelete.value = true;
};

const confirmDeleteAction = () => {
  if (!deletingPrompt.value) return;
  deleteMutation.mutate(deletingPrompt.value.id, {
    onSuccess: () => {
      confirmDelete.value = false;
      deletingPrompt.value = undefined;
    },
  });
};
</script>

<style scoped>
.constrain-width {
  width: 100%;
}
</style>
