<template>
  <el-header class="app-header">
    <div class="header-left">
      <router-link to="/" class="header-logo">
        <span class="logo-icon">🛡️</span>
        <span class="logo-text">A2CMS</span>
      </router-link>
      <nav class="header-nav">
        <router-link to="/" class="nav-item" :class="{ active: currentRoute === '/' }">
          <span class="nav-icon">👥</span>
          角色管理
        </router-link>
      </nav>
    </div>
    <div class="header-right">
      <span class="header-version">2026 v1.0</span>

      <el-dropdown trigger="click" @command="handleSettingsCommand">
        <el-button size="default" circle class="settings-btn">
          <el-icon :size="16"><Setting /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="toggleTasks">
              {{ uiStore.settings.showTasks ? '隐藏任务按钮' : '显示任务按钮' }}
            </el-dropdown-item>
            <el-dropdown-item command="toggleStats">
              {{ uiStore.settings.showStats ? '隐藏统计面板' : '显示统计面板' }}
            </el-dropdown-item>
            <el-dropdown-item command="export" divided>导出数据</el-dropdown-item>
            <el-dropdown-item command="import">导入数据</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <span class="header-author">
        作者: <a href="https://space.bilibili.com/2492373" target="_blank" rel="noopener">老登怎么办</a>
      </span>
      <ThemeToggle />
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUIStore, useBackupStore } from '@/stores'
import ThemeToggle from './ThemeToggle.vue'

const uiStore = useUIStore()
const backupStore = useBackupStore()
const route = useRoute()
const currentRoute = computed(() => route.path)

const handleSettingsCommand = (command: string) => {
  switch (command) {
    case 'toggleTasks':
      uiStore.toggleTasks()
      ElMessage.success(uiStore.settings.showTasks ? '已显示任务按钮' : '已隐藏任务按钮')
      break
    case 'toggleStats':
      uiStore.toggleStats()
      ElMessage.success(uiStore.settings.showStats ? '已显示统计面板' : '已隐藏统计面板')
      break
    case 'export':
      const data = backupStore.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `a2cms-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      ElMessage.success('数据已导出')
      break
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  height: var(--header-height);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-base);
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.header-logo:hover {
  opacity: 0.85;
}

.logo-icon {
  font-size: var(--font-size-xl);
}

.logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--accent);
  letter-spacing: 0.5px;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 40px;
  padding: 0 var(--space-4);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-item.active {
  color: var(--primary);
  background: var(--primary-light);
}

.nav-icon {
  font-size: var(--font-size-md);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-version {
  font-size: var(--font-size-xs);
  color: var(--text-placeholder);
  padding: var(--space-1) var(--space-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
}

.settings-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-base);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.settings-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.header-author {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.header-author a {
  color: var(--primary);
  text-decoration: none;
  margin-left: var(--space-1);
  transition: color var(--transition-fast);
}

.header-author a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 var(--space-4);
  }

  .header-version,
  .header-author {
    display: none;
  }

  .logo-text {
    display: none;
  }
}
</style>
