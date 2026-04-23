<template>
  <el-config-provider :theme="themeStore.isNight ? 'dark' : 'light'">
    <div class="app-wrapper">
      <AppHeader />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useThemeStore } from '@/stores'
import AppHeader from './components/AppHeader.vue'

const themeStore = useThemeStore()

// 同步主题到 document
watch(() => themeStore.isNight, (isNight) => {
  document.documentElement.setAttribute('data-theme', isNight ? 'night' : 'day')
}, { immediate: true })
</script>

<style>
@import './styles/variables.css';

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app-wrapper {
  min-height: 100vh;
  background: var(--bg-primary);
}

.main-content {
  padding: var(--space-6);
  background: var(--bg-primary);
  min-height: calc(100vh - var(--header-height));
  max-width: 1800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--space-4);
  }
}

@media (min-width: 1920px) {
  .main-content {
    padding: var(--space-8) var(--space-12);
  }
}
</style>
