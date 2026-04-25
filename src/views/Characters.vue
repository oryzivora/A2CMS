<template>
  <div class="characters-view">
    <!-- 统计面板 - 待办风格 -->
    <stats-panel
      v-if="uiStore.settings.showStats"
      :stats="stats"
    />

    <!-- 账号数据栏 -->
    <account-bar />

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">角色管理</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddCharacter">
          新增角色
        </el-button>
      </div>
    </div>

    <!-- 筛选和操作栏 -->
    <filter-bar>
      <template #filters>
        <el-input
          v-model="filters.search"
          placeholder="搜索角色名称..."
          clearable
          :prefix-icon="Search"
          style="width: 180px;"
          @input="handleSearch"
        />
        <el-select
          v-model="filters.role"
          placeholder="职业筛选"
          clearable
          style="width: 140px;"
          @change="handleFilterChange"
        >
          <el-option
            v-for="role in characterStore.uniqueRoles"
            :key="role"
            :label="role"
            :value="role"
          />
        </el-select>
        <el-select
          v-model="filters.groupId"
          placeholder="分组筛选"
          clearable
          style="width: 140px;"
          @change="handleFilterChange"
        >
          <el-option
            v-for="group in groupStore.groups"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          >
            <span :style="{ color: group.color }">●</span> {{ group.name }}
          </el-option>
        </el-select>
        <el-button @click="handleClearFilters">清空筛选</el-button>
        <el-button @click="showGroupDialog = true">分组管理</el-button>
        <el-button @click="showTeamDialog = true">小队管理</el-button>
      </template>
      
      <template #actions>
        <el-button-group>
          <el-button 
            v-for="n in [2, 3, 4, 5]" 
            :key="n"
            :type="uiStore.settings.layout === String(n) ? 'primary' : 'default'"
            @click="uiStore.setLayout(String(n) as LayoutMode)"
          >
            {{ n }}格
          </el-button>
          <el-button 
            :type="uiStore.settings.layout === 'table' ? 'primary' : 'default'"
            @click="uiStore.setLayout('table')"
          >
            表格
          </el-button>
        </el-button-group>
        
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button>
            更多 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="clearTasks">重置所有任务</el-dropdown-item>
              <el-dropdown-item command="clearRuns">清空所有副本次数</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </filter-bar>

    <!-- 排序按钮 -->
    <sort-bar>
      <template #left>
        <span class="sort-label">排序:</span>
        <el-radio-group v-model="currentSort" @change="handleSort">
          <el-radio-button value="group">按分组</el-radio-button>
          <el-radio-button value="runs">按副本</el-radio-button>
          <el-radio-button value="energy">按能量</el-radio-button>
        </el-radio-group>
      </template>
      <template #right>
        <el-text type="info">共 {{ characterStore.filteredCharacters.length }} 个角色</el-text>
      </template>
    </sort-bar>

    <!-- 角色列表 -->
    <div v-if="characterStore.filteredCharacters.length > 0">
      <!-- 卡片视图 -->
      <div 
        v-if="uiStore.settings.layout !== 'table'" 
        class="characters-grid"
        :class="`grid-${uiStore.settings.layout}`"
      >
        <character-card
          v-for="char in sortedCharacters"
          :key="char.id"
          :character="char"
          @edit="handleEdit"
        />
      </div>

      <!-- 表格视图 -->
      <div v-else class="characters-table">
        <el-table :data="sortedCharacters" stripe highlight-current-row :max-height="600">
          <el-table-column prop="name" label="角色" min-width="120" fixed>
            <template #default="{ row }">
              <div class="table-name">
                {{ row.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="race" label="种族" min-width="80">
            <template #default="{ row }">
              <el-tag size="small" :type="row.race === '天族' ? 'primary' : 'danger'">
                {{ row.race }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="server" label="大区" min-width="80" />
          <el-table-column prop="role" label="职业" min-width="100" />
          <el-table-column label="分组" min-width="120">
            <template #default="{ row }">
              <el-tag :color="groupStore.getGroupColor(row.groupId)" effect="dark" size="small">
                {{ groupStore.getGroupName(row.groupId) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="基纳(万)" min-width="100">
            <template #default="{ row }">{{ row.kina }}</template>
          </el-table-column>
          <el-table-column prop="score" label="装分" min-width="80" sortable />
          <el-table-column label="能量" min-width="140">
            <template #default="{ row }">
              <el-progress
                :percentage="Math.round((row.energy / row.maxEnergy) * 100)"
                :color="energyColor(row.energy, row.maxEnergy)"
                :stroke-width="10"
              />
              <el-text type="info" size="small">{{ row.energy }}/{{ row.maxEnergy }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="远征/超越" min-width="140">
            <template #default="{ row }">
              <el-text type="warning">
                {{ row.runs }}(+{{ row.extraRuns }}) / {{ row.transcendRuns }}(+{{ row.extraTranscendRuns }})
              </el-text>
            </template>
          </el-table-column>
          <el-table-column label="任务" min-width="200">
            <template #default="{ row }">
              <div class="table-tasks">
                <el-tag
                  v-for="task in allTableTasks"
                  :key="task.key"
                  size="small"
                  :type="row.tasks[task.key] ? 'success' : 'info'"
                  class="task-tag"
                >
                  {{ task.short }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="暂无角色，请点击上方按钮添加"
    >
      <el-button type="primary" @click="handleAddCharacter">
        新增角色
      </el-button>
    </el-empty>

    <!-- 角色编辑弹窗 -->
    <character-dialog 
      v-model="showCharacterDialog" 
      :character="selectedCharacter"
      @submit="handleSubmitCharacter"
    />

    <!-- 分组管理弹窗 -->
    <group-dialog 
      v-model="showGroupDialog" 
      @add="handleAddGroup"
      @delete="handleDeleteGroup"
    />

    <!-- 小队管理弹窗 -->
    <team-dialog 
      v-model="showTeamDialog"
      @add="handleAddTeam"
      @delete="handleDeleteTeam"
    />

    <!-- 导入弹窗 -->
    <el-dialog v-model="showImportDialog" title="导入数据" width="500px">
      <el-input
        v-model="importData"
        type="textarea"
        :rows="10"
        placeholder="粘贴导出的JSON数据..."
      />
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="handleImport">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { useCharacterStore, useGroupStore, useTeamStore, useUIStore, useBackupStore, useAccountStore } from '@/stores'
import { taskList } from '@/dict'
import type { Character, TaskStatus, LayoutMode } from '@/types'

// 子组件
import StatsPanel from '@/components/StatsPanel.vue'
import FilterBar from '@/components/FilterBar.vue'
import SortBar from '@/components/SortBar.vue'
import GroupDialog from '@/components/GroupDialog.vue'
import TeamDialog from '@/components/TeamDialog.vue'
import CharacterDialog from '@/components/CharacterDialog.vue'
import AccountBar from '@/components/AccountBar.vue'

// Stores
const characterStore = useCharacterStore()
const groupStore = useGroupStore()
const teamStore = useTeamStore()
const uiStore = useUIStore()
const backupStore = useBackupStore()
const accountStore = useAccountStore()

// 筛选状态
const filters = reactive({
  search: '',
  role: '',
  groupId: ''
})

// 排序状态
const currentSort = ref<string>('group')

// 弹窗状态
const showCharacterDialog = ref(false)
const showGroupDialog = ref(false)
const showTeamDialog = ref(false)
const showImportDialog = ref(false)
const importData = ref('')
const selectedCharacter = ref<Character | null>(null)

// 统计数据
const stats = computed(() => characterStore.totalStats)

// 监听账号筛选变化，自动筛选角色
watch(() => accountStore.filterAccountId, (newFilterId) => {
  characterStore.setFilters({ accountId: newFilterId })
}, { immediate: true })

// 表格模式显示的所有任务（与角色卡片任务同步，过滤掉卢德莱和净化所）
const allTableTasks = taskList.filter((t: any) => t.key !== 'ludrelle' && t.key !== 'purify').map((t: any) => ({
  key: t.key,
  short: t.label.substring(0, 1)
}))

// 排序后的角色
const sortedCharacters = computed(() => {
  const chars = [...characterStore.filteredCharacters]
  
  switch (currentSort.value) {
    case 'group':
      return chars.sort((a, b) => a.groupId.localeCompare(b.groupId))
    case 'runs':
      return chars.sort((a, b) => b.runs - a.runs)
    case 'energy':
      return chars.sort((a, b) => b.energy - a.energy)
    default:
      return chars
  }
})

// 工具函数
const energyColor = (current: number, max: number): string => {
  const pct = (current / max) * 100
  if (pct >= 70) return '#67c23a'
  if (pct >= 30) return '#e6a23c'
  return '#f56c6c'
}

// 防抖搜索
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    characterStore.setFilters({ search: filters.search })
  }, 300)
}

const handleFilterChange = () => {
  characterStore.setFilters({
    search: filters.search,
    role: filters.role,
    groupId: filters.groupId
  })
}

const handleClearFilters = () => {
  filters.search = ''
  filters.role = ''
  filters.groupId = ''
  characterStore.clearFilters()
}

const handleSort = (mode: string) => {
  uiStore.setSortMode(mode as any)
}

// 角色操作
const handleAddCharacter = () => {
  selectedCharacter.value = null
  showCharacterDialog.value = true
}

const handleEdit = (char: Character) => {
  selectedCharacter.value = char
  showCharacterDialog.value = true
}

const handleSubmitCharacter = (data: Partial<Character>) => {
  if (selectedCharacter.value) {
    characterStore.updateCharacter(selectedCharacter.value.id, data)
    ElMessage.success('角色已更新')
  } else {
    characterStore.addCharacter(data)
    ElMessage.success('角色已创建')
  }
  selectedCharacter.value = null
}

// 命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'group':
      showGroupDialog.value = true
      break
    case 'team':
      showTeamDialog.value = true
      break
    case 'clearTasks':
      characterStore.clearAllTasks()
      ElMessage.success('已清空所有任务')
      break
    case 'clearRuns':
      characterStore.clearAllRuns()
      ElMessage.success('已清空所有副本')
      break
  }
}

// 分组管理
const handleAddGroup = (name: string, color: string) => {
  groupStore.addGroup(name, color)
  ElMessage.success('分组已添加')
}

const handleDeleteGroup = (id: string) => {
  groupStore.deleteGroup(id)
  ElMessage.success('分组已删除')
}

// 小队管理
const handleAddTeam = (name: string) => {
  teamStore.addTeam(name)
  ElMessage.success('小队已添加')
}

const handleDeleteTeam = (id: string) => {
  teamStore.deleteTeam(id)
  ElMessage.success('小队已删除')
}

// 导入数据
const handleImport = () => {
  if (!importData.value.trim()) {
    ElMessage.warning('请输入要导入的数据')
    return
  }
  const success = backupStore.importData(importData.value)
  if (success) {
    ElMessage.success('数据导入成功')
    showImportDialog.value = false
    importData.value = ''
  } else {
    ElMessage.error('数据导入失败，请检查格式')
  }
}
</script>

<style scoped>
.characters-view {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.sort-label {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  font-weight: var(--font-weight-semibold);
}

/* 角色网格 */
.characters-grid {
  display: grid;
  gap: var(--space-4);
}

.characters-grid.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.characters-grid.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.characters-grid.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.characters-grid.grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

/* 表格视图 */
.characters-table {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: auto;
  width: 100%;
}

.table-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.task-tag {
  margin-right: 4px;
}

.table-tasks {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.table-tasks .task-tag {
  margin-right: 0;
  padding: 0 4px;
  height: 20px;
  line-height: 18px;
}

/* 响应式 */
@media (max-width: 768px) {
  .characters-grid.grid-4,
  .characters-grid.grid-5 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .characters-grid.grid-3 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .characters-grid.grid-2,
  .characters-grid.grid-4,
  .characters-grid.grid-5 {
    grid-template-columns: 1fr;
  }
}
</style>
