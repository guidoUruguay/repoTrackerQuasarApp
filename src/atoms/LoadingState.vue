<template>
  <q-spinner v-if="loading" :size="size" />
  <div v-else-if="error" class="text-negative">
    {{ errorMessage }}
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  error?: Error | null;
  errorMessage?: string;
  size?: string;
}>();
</script>
