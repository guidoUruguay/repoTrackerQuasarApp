<template>
  <q-dialog v-model="isOpen" @keydown.esc="close">
    <q-card
      class="command-palette bg-grey-9"
      style="width: 600px; max-width: 90vw"
    >
      <q-card-section class="q-pa-sm">
        <q-input
          ref="searchInputRef"
          v-model="searchText"
          dense
          standout="bg-grey-8"
          placeholder="Type a command or search..."
          autofocus
          @keydown.down.prevent="selectNext"
          @keydown.up.prevent="selectPrev"
          @keydown.enter.prevent="executeSelected"
        >
          <template #prepend>
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator color="grey-8" />

      <q-card-section class="q-pa-none command-list">
        <q-list dense>
          <q-item
            v-for="(item, index) in filteredItems"
            :key="index"
            clickable
            :active="selectedIndex === index"
            active-class="bg-primary text-white"
            @click="execute(item)"
            class="command-item"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
              <q-item-label v-if="item.description" caption>
                {{ item.description }}
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="item.shortcut" side>
              <q-badge outline color="grey-6" :label="item.shortcut" />
            </q-item-section>
          </q-item>

          <q-item
            v-if="filteredItems.length === 0"
            class="text-center text-grey-6"
          >
            <q-item-section>
              <q-item-label>No results found</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useGitHubRepos } from "@/hooks/useRepos";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  keywords?: string[];
}

const router = useRouter();
const isOpen = ref(false);
const searchText = ref("");
const selectedIndex = ref(0);
const searchInputRef = ref();

const { data: reposResponse } = useGitHubRepos();

const repos = computed(() => reposResponse.value?.data || []);

const staticCommands = computed<CommandItem[]>(() => [
  {
    id: "home",
    label: "Go to Dashboard",
    description: "View all repositories",
    icon: "home",
    action: () => router.push("/dashboard"),
    keywords: ["home", "dashboard", "repos"],
  },
  {
    id: "subscribed",
    label: "Show Subscribed Repos",
    description: "Filter subscribed repositories",
    icon: "star",
    action: () => router.push("/dashboard"),
    keywords: ["subscribed", "starred", "watching"],
  },
]);

const repoCommands = computed<CommandItem[]>(() => {
  if (!repos.value.length) return [];

  return repos.value.map((repo) => ({
    id: `repo-${repo.githubId}`,
    label: `Open ${repo.fullName}`,
    description: repo.ownerLogin,
    icon: repo.isPrivate ? "lock" : "source",
    action: () => {
      if (repo.subscribedRepoId) {
        router.push(`/repositories/${repo.subscribedRepoId}`);
      } else {
        window.open(repo.htmlUrl, "_blank");
      }
    },
    keywords: [repo.fullName, repo.name, repo.ownerLogin],
  }));
});

const allCommands = computed(() => [
  ...staticCommands.value,
  ...repoCommands.value,
]);

const filteredItems = computed(() => {
  if (!searchText.value.trim()) {
    return allCommands.value.slice(0, 10);
  }

  const query = searchText.value.toLowerCase();

  return allCommands.value
    .filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchDescription = item.description?.toLowerCase().includes(query);
      const matchKeywords = item.keywords?.some((k) =>
        k.toLowerCase().includes(query),
      );
      return matchLabel || matchDescription || matchKeywords;
    })
    .slice(0, 10);
});

watch(filteredItems, () => {
  selectedIndex.value = 0;
});

watch(isOpen, (val) => {
  if (val) {
    searchText.value = "";
    selectedIndex.value = 0;
  }
});

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

const selectNext = () => {
  if (selectedIndex.value < filteredItems.value.length - 1) {
    selectedIndex.value++;
  }
};

const selectPrev = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const executeSelected = () => {
  const item = filteredItems.value[selectedIndex.value];
  if (item) {
    execute(item);
  }
};

const execute = (item: CommandItem) => {
  item.action();
  close();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "k") {
    event.preventDefault();
    isOpen.value = !isOpen.value;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

defineExpose({ open, close });
</script>

<style scoped>
.command-palette {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.command-list {
  max-height: 400px;
  overflow-y: auto;
}

.command-item {
  transition: background-color 0.1s ease;
}

.command-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
