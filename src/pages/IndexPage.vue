<template>
  <q-page class="flex flex-center column q-gutter-md">
    <div class="text-h4">Repo Tracker</div>
    <div>Pinia count: {{ store.count }}</div>
    <q-btn color="primary" label="Increment" @click="store.increment" />

    <div v-if="isPending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>Data: {{ data }}</div>
    <q-btn
      color="secondary"
      label="Refetch"
      @click="() => refetch()"
      :loading="isFetching"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useExampleStore } from "@/stores/example";

const store = useExampleStore();

const { isPending, error, data, refetch, isFetching } = useQuery({
  queryKey: ["test"],
  queryFn: async () => {
    await new Promise((r) => setTimeout(r, 1000));
    return "Hello from TanStack Query!";
  },
});
</script>
