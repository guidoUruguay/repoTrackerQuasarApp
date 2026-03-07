<template>
  <div>
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner color="primary" size="3em" />
      <p class="text-grey-6 q-mt-md">Loading repositories...</p>
    </div>
    <div v-else-if="error" class="text-center q-py-xl">
      <q-icon
        name="error_outline"
        size="4em"
        color="negative"
        class="q-mb-md"
      />
      <p class="text-negative text-body1">
        {{ errorMessage || error.message }}
      </p>
    </div>
    <div v-else-if="empty" class="text-center q-py-xl">
      <q-icon name="inbox" size="4em" color="grey-6" class="q-mb-md" />
      <p class="text-grey-6 text-body1">
        <slot name="empty">{{ emptyMessage }}</slot>
      </p>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  error?: Error | null;
  errorMessage?: string;
  empty?: boolean;
  emptyMessage?: string;
}>();
</script>
