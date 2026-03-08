import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../pages/DashboardPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/repositories/:id",
    name: "repository",
    component: () => import("../pages/RepositoryDetailPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/prompts",
    name: "prompts",
    component: () => import("../pages/PromptsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/repositories/:repositoryId/requirements",
    name: "requirements",
    component: () => import("../pages/RequirementsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/requirements/:requirementId",
    name: "requirement-detail",
    component: () => import("../pages/RequirementDetailPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth !== false;

  if (!authStore.user) {
    const isAuthenticated = await authStore.checkAuth();

    if (requiresAuth && !isAuthenticated) {
      return { name: "login" };
    }

    if (to.name === "login" && isAuthenticated) {
      return { name: "dashboard" };
    }
  } else {
    if (to.name === "login") {
      return { name: "dashboard" };
    }
  }
});

export default router;
