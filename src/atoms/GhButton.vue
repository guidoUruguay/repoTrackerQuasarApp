<template>
  <q-btn
    :color="color"
    :size="size"
    :disable="disabled"
    :loading="loading"
    v-bind="$attrs"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string;
    size?: string;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    color: "primary",
    size: "md",
  },
);
</script>
