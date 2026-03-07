<template>
  <RepositoryDetailTemplate :id="repoId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import RepositoryDetailTemplate from "@/templates/RepositoryDetailTemplate.vue";

const route = useRoute();
const repoId = computed(() => Number(route.params.id));
</script>
