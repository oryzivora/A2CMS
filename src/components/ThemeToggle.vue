<template>
  <button
    type="button"
    class="theme-toggle-btn"
    :class="{ 'is-night': isNight }"
    @click="toggle"
    :title="isNight ? '切换到日间模式' : '切换到夜间模式'"
  >
    <span class="theme-icon">{{ isNight ? '🌙' : '☀️' }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores'

const store = useThemeStore()

const isNight = computed(() => store.isNight)

const toggle = () => {
  store.toggleTheme()
}
</script>

<style scoped>
.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 18px;
  line-height: 1;
}

.theme-toggle-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
  transform: scale(1.05);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
