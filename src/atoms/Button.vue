<template>
  <q-btn
    :color="color"
    :size="size"
    :label="label"
    :icon="icon"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  icon?: string;
  color?: string;
  size?: string;
}>();
</script>
