<template>
  <div class="stats-panel">
    <!-- 统计面板标题栏 -->
    <div class="stats-panel-header">
      <div class="header-left">
        <el-icon class="header-icon"><DataAnalysis /></el-icon>
        <span class="header-title">📊 统计面板</span>
      </div>
      <el-button
        size="small"
        text
        type="info"
        @click="uiStore.toggleStats()"
      >
        隐藏
      </el-button>
    </div>

    <!-- 第一行：待办卡片 -->
    <el-row :gutter="12" class="stats-row">
      <!-- 每日使命 -->
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="todo-card" body-class="card-body">
          <template #header>
            <div class="card-header-content">
              <span class="card-icon">📋</span>
              <span class="card-title">每日使命</span>
              <el-tag size="small" :type="dailyProgress >= 100 ? 'success' : 'warning'" effect="plain">
                {{ stats.completedDailyMissions }}/{{ stats.totalDailyMissions }}
              </el-tag>
            </div>
          </template>
          <div class="card-body-content">
            <el-progress
              :percentage="dailyProgress"
              :stroke-width="6"
              :color="progressColor(dailyProgress)"
              :show-text="false"
            />
            <div class="progress-hint">
              <span v-if="dailyProgress < 100" class="hint-text warning">
                还有 {{ stats.totalDailyMissions - stats.completedDailyMissions }} 项待完成
              </span>
              <span v-else class="hint-text success">
                ✓ 今日已完成
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 每周指令 -->
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="todo-card" body-class="card-body">
          <template #header>
            <div class="card-header-content">
              <span class="card-icon">📜</span>
              <span class="card-title">每周指令</span>
              <el-tag size="small" :type="weeklyProgress >= 100 ? 'success' : 'info'" effect="plain">
                {{ stats.completedWeeklyMissions }}/{{ stats.totalWeeklyMissions }}
              </el-tag>
            </div>
          </template>
          <div class="card-body-content">
            <el-progress
              :percentage="weeklyProgress"
              :stroke-width="6"
              :color="progressColor(weeklyProgress)"
              :show-text="false"
            />
            <div class="progress-hint">
              <span v-if="weeklyProgress < 100" class="hint-text warning">
                还有 {{ stats.totalWeeklyMissions - stats.completedWeeklyMissions }} 项待完成
              </span>
              <span v-else class="hint-text success">
                ✓ 本周已完成
              </span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 远征可刷 -->
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="todo-card runs-card" body-class="card-body">
          <template #header>
            <div class="card-header-content">
              <span class="card-icon">⚔️</span>
              <span class="card-title">远征副本</span>
              <el-tag size="small" :type="stats.availableRuns > 0 ? 'danger' : 'success'" effect="plain">
                {{ stats.availableRuns > 0 ? `${stats.availableRuns} 可刷` : '已刷完' }}
              </el-tag>
            </div>
          </template>
          <div class="card-body-content">
            <div class="stat-rows">
              <div class="stat-row">
                <span class="stat-label">总剩余</span>
                <span class="stat-value">{{ stats.totalRuns }} 次</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">可补充</span>
                <span class="stat-value warning">{{ stats.totalExtraRuns }} 次</span>
              </div>
            </div>
            <div class="action-hint">
              <span class="hint-text info">点击账号管理快速编辑</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 超越可刷 -->
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="todo-card transcend-card" body-class="card-body">
          <template #header>
            <div class="card-header-content">
              <span class="card-icon">🚀</span>
              <span class="card-title">超越副本</span>
              <el-tag size="small" :type="stats.availableTranscendRuns > 0 ? 'danger' : 'success'" effect="plain">
                {{ stats.availableTranscendRuns > 0 ? `${stats.availableTranscendRuns} 可刷` : '已刷完' }}
              </el-tag>
            </div>
          </template>
          <div class="card-body-content">
            <div class="stat-rows">
              <div class="stat-row">
                <span class="stat-label">总剩余</span>
                <span class="stat-value">{{ stats.totalTranscendRuns }} 次</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">可补充</span>
                <span class="stat-value warning">{{ stats.totalExtraTranscendRuns }} 次</span>
              </div>
            </div>
            <div class="action-hint">
              <span class="hint-text info">点击账号管理快速编辑</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：快捷概览 -->
    <el-row :gutter="8" class="stats-row quick-row">
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat">
          <span class="quick-value">{{ stats.totalAccounts }}</span>
          <span class="quick-label">账号</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat">
          <span class="quick-value">{{ stats.totalChars }}</span>
          <span class="quick-label">总角色</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat gold">
          <span class="quick-value">{{ formatKina(stats.totalKina) }}</span>
          <span class="quick-label">基纳(万)</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat">
          <span class="quick-value">{{ formatEnergy(stats.totalEnergy) }}</span>
          <span class="quick-label">总能量</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat" :class="{ 'warning-stat': stats.expiringMembers > 0 }">
          <span class="quick-value">{{ stats.expiringMembers }}</span>
          <span class="quick-label">即将到期</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat">
          <span class="quick-value">{{ stats.activeMembers }}</span>
          <span class="quick-label">有效会员</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat" :class="{ 'success-stat': stats.fullEnergyChars > 0 }">
          <span class="quick-value">{{ stats.fullEnergyChars }}/{{ stats.totalChars }}</span>
          <span class="quick-label">能量满</span>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="3">
        <div class="quick-stat">
          <span class="quick-value">{{ formatScore(stats.avgScore) }}</span>
          <span class="quick-label">平均装分</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { DataAnalysis } from '@element-plus/icons-vue'
import { useUIStore } from '@/stores'

interface Stats {
  totalChars: number
  totalAccounts: number
  totalKina: number
  totalEnergy: number
  totalRuns: number
  totalTranscendRuns: number
  availableRuns: number
  availableTranscendRuns: number
  totalExtraRuns: number
  totalExtraTranscendRuns: number
  completedDailyMissions: number
  totalDailyMissions: number
  completedWeeklyMissions: number
  totalWeeklyMissions: number
  expiringMembers: number
  activeMembers: number
  fullEnergyChars: number
  avgScore: number
}

const props = defineProps<{
  stats: Stats
}>()

const uiStore = useUIStore()

const var_ = (n: number) => `${n}px`

const dailyProgress = computed(() => {
  if (props.stats.totalDailyMissions === 0) return 0
  return Math.round((props.stats.completedDailyMissions / props.stats.totalDailyMissions) * 100)
})

const weeklyProgress = computed(() => {
  if (props.stats.totalWeeklyMissions === 0) return 0
  return Math.round((props.stats.completedWeeklyMissions / props.stats.totalWeeklyMissions) * 100)
})

const formatKina = (num: number) => {
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString()
}

const formatEnergy = (num: number) => {
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString()
}

const formatScore = (num: number) => {
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num.toString()
}

const progressColor = (percentage: number) => {
  if (percentage >= 100) return 'var(--success)'
  if (percentage >= 50) return 'var(--warning)'
  return 'var(--danger)'
}
</script>

<style scoped>
.stats-panel {
  margin-bottom: var(--space-5);
}

/* 标题栏 */
.stats-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding: 0 var(--space-2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header-icon {
  font-size: var(--font-size-lg);
  color: var(--primary);
}

.header-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

/* 卡片行 */
.stats-row {
  margin-bottom: var(--space-4);
}

/* 卡片样式 */
:deep(.el-card) {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  transition: all var(--transition-fast);
}

:deep(.el-card:hover) {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
}

:deep(.el-card__header) {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-lighter);
}

:deep(.card-body) {
  padding: var(--space-4);
}

.card-header-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card-icon {
  font-size: var(--font-size-md);
}

.card-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  flex: 1;
}

.card-body-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.progress-hint,
.action-hint {
  text-align: center;
}

.hint-text {
  font-size: var(--font-size-xs);
}

.hint-text.success {
  color: var(--success);
}

.hint-text.warning {
  color: var(--warning);
}

.hint-text.info {
  color: var(--text-placeholder);
}

/* 远征/超越卡片 */
.stat-rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.stat-value.warning {
  color: var(--warning);
}

/* 快捷统计 */
.quick-row {
  margin-bottom: 0;
}

.quick-stat {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.quick-stat:hover {
  background: var(--bg-hover);
  border-color: var(--border-light);
}

.quick-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}

.quick-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.quick-stat.gold .quick-value {
  color: var(--warning);
}

.quick-stat.warning-stat .quick-value {
  color: var(--danger);
}

.quick-stat.success-stat .quick-value {
  color: var(--success);
}
</style>
