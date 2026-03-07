<template>
  <div class="row items-center q-gutter-sm text-body2">
    <q-icon name="book" size="xs" />
    <span class="text-weight-medium">{{ name }}</span>
    <q-badge v-if="isPrivate" color="orange" label="Private" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  isPrivate?: boolean;
}>();
</script>
