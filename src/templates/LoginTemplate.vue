<template>
  <div class="flex flex-center" style="min-height: 100vh">
    <q-card class="q-pa-lg" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <q-icon name="mdi-github" size="64px" color="white" class="q-mb-md" />
        <div class="text-h5 q-mb-xs">{{ $t("login.title") }}</div>
        <div class="text-body2 text-grey-6">{{ $t("login.subtitle") }}</div>
      </q-card-section>

      <q-card-actions class="q-px-md q-pb-md">
        <q-btn
          unelevated
          color="positive"
          class="full-width"
          icon="mdi-github"
          :label="$t('login.loginButton')"
          @click="login"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from "@/hooks/useAuth";

const { login } = useLogin();
</script>
