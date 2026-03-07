<template>
  <div class="search-container">
    <q-input
      v-model="searchText"
      :placeholder="placeholder"
      dense
      standout="bg-grey-9"
      class="search-input"
      @update:model-value="handleSearch"
    >
      <template #prepend>
        <q-icon name="search" size="sm" />
      </template>
      <template #append>
        <q-btn
          v-if="searchText"
          flat
          dense
          round
          size="sm"
          icon="close"
          @click="clearSearch"
        />
      </template>
    </q-input>

    <div v-if="showSuggestions" class="suggestions-hints q-mt-sm">
      <div class="text-caption text-grey-6 q-mb-xs">Available filters:</div>
      <div class="row q-gutter-xs">
        <q-chip
          v-for="suggestion in suggestions"
          :key="suggestion"
          size="sm"
          outline
          color="grey-6"
          clickable
          @click="addFilter(suggestion)"
        >
          {{ suggestion }}
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { buildSearchSuggestions } from "@/utils/searchFilters";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  showSuggestions?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const searchText = ref(props.modelValue);
const suggestions = buildSearchSuggestions();

watch(
  () => props.modelValue,
  (val) => {
    searchText.value = val;
  },
);

const handleSearch = (value: string | number | null) => {
  emit("update:modelValue", String(value || ""));
};

const clearSearch = () => {
  searchText.value = "";
  emit("update:modelValue", "");
};

const addFilter = (filter: string) => {
  const current = searchText.value.trim();
  searchText.value = current ? `${current} ${filter}` : filter;
  emit("update:modelValue", searchText.value);
};
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 800px;
}

.search-input {
  font-size: 14px;
}

.suggestions-hints {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
