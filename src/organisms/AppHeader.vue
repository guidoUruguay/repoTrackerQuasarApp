<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon name="mdi-github" size="sm" class="q-mr-sm" />
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <slot name="actions" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
