<template>
  <q-card
    flat
    bordered
    class="repo-card bg-grey-9 cursor-pointer"
    style="border-color: rgba(255, 255, 255, 0.1)"
    @click="$emit('click')"
  >
    <q-card-section class="q-pa-md">
      <div class="row items-start justify-between q-mb-sm">
        <div class="col">
          <div class="row items-center q-gutter-xs q-mb-xs">
            <q-icon
              :name="repo.isPrivate ? 'lock' : 'source'"
              size="sm"
              :color="repo.isPrivate ? 'orange' : 'grey-6'"
            />
            <span class="text-primary text-body1 text-weight-medium repo-link">
              {{ repo.fullName }}
            </span>
            <q-badge
              v-if="isSubscribed"
              color="positive"
              outline
              label="Subscribed"
              class="q-ml-xs"
            >
              <q-icon name="star" size="xs" class="q-mr-xs" />
            </q-badge>
          </div>

          <div
            v-if="'description' in repo && repo.description"
            class="text-caption text-grey-6 q-mb-sm"
          >
            {{ repo.description }}
          </div>

          <div class="row items-center q-gutter-md text-caption text-grey-7">
            <div class="row items-center q-gutter-xs">
              <q-icon name="mdi-source-branch" size="xs" />
              <span>{{ repo.defaultBranch }}</span>
            </div>
            <div v-if="repo.isPrivate" class="row items-center q-gutter-xs">
              <q-badge color="orange" outline label="Private" />
            </div>
          </div>
        </div>

        <div class="col-auto" @click.stop>
          <slot name="action" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { GitHubRepo, SubscribedRepo } from "@/types";

defineProps<{
  repo: GitHubRepo | SubscribedRepo;
  isSubscribed?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.repo-card {
  transition: all 0.2s ease;
}

.repo-card:hover {
  border-color: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

.repo-link {
  transition: color 0.2s ease;
}

.repo-card:hover .repo-link {
  color: #58a6ff !important;
}
</style>
