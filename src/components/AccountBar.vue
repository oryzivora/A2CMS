<template>
  <div class="account-bar">
    <!-- 展开/收起按钮 -->
    <div class="account-bar-header">
      <el-button
        size="small"
        :icon="isExpanded ? 'ArrowUp' : 'ArrowDown'"
        @click="isExpanded = !isExpanded"
        class="expand-btn"
      >
        {{ isExpanded ? '收起' : '展开' }}账号管理
      </el-button>

      <!-- 账号筛选 -->
      <el-select
        v-model="accountStore.filterAccountId"
        placeholder="筛选账号"
        size="small"
        class="account-filter"
        clearable
      >
        <el-option label="全部账号" value="" />
        <el-option
          v-for="account in accountStore.accounts"
          :key="account.id"
          :label="account.name"
          :value="account.id"
        >
          <span>{{ account.name }}</span>
          <span class="account-race">{{ account.race }}</span>
          <span class="account-server">{{ account.server }}</span>
        </el-option>
      </el-select>

      <!-- 新增账号按钮 -->
      <el-button size="small" type="success" @click="showAddDialog = true">+ 新增账号</el-button>
    </div>

    <!-- 展开的内容 -->
    <div v-show="isExpanded" class="account-bar-content">
      <!-- 全部账号视图 (始终显示所有账号，选择后不切换视图) -->
      <div class="all-accounts-view">
        <div
          v-for="account in accountStore.accounts"
          :key="account.id"
          class="account-row"
          :class="{ 'is-selected': account.id === currentAccountId }"
          @click="selectAccount(account.id)"
        >
          <div class="account-row-info">
            <span class="account-row-name">{{ account.name }}</span>
            <el-tag size="small" :type="account.race === '天族' ? 'primary' : 'danger'">
              {{ account.race }}
            </el-tag>
            <span class="account-row-server">{{ account.server }}</span>
            <el-tag v-if="account.data.isMember" size="small" type="warning">
              会员
            </el-tag>
            <span v-if="account.data.isMember && account.data.memberExpireTime" class="member-countdown">
              {{ formatMemberCountdown(account.data.memberExpireTime) }}
            </span>
            <el-button
              size="small"
              link
              type="primary"
              @click.stop="handleAccountEdit(account.id)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              link
              type="danger"
              @click.stop="handleAccountDelete(account.id)"
            >
              删除
            </el-button>
          </div>
          <div class="account-row-data">
            <!-- 每日使命 -->
            <div
              class="data-cell mini mission-cell"
              :class="{ 'is-cleared': (account.data.dailyMissionRuns ?? 0) === 0 }"
              @click.stop="toggleMissionComplete(account.id, 'dailyMission')"
            >
              <span class="data-label">每日使命</span>
              <span class="data-value">
                <el-icon v-if="(account.data.dailyMissionRuns ?? 0) === 0" class="check-icon"><CircleCheck /></el-icon>
                <span v-else class="uncompleted">未完成</span>
              </span>
            </div>
            <!-- 本地指令 -->
            <div
              class="data-cell mini mission-cell"
              :class="{ 'is-cleared': (account.data.weeklyMissionRuns ?? 0) === 0 }"
              @click.stop="toggleMissionComplete(account.id, 'weeklyMission')"
            >
              <span class="data-label">本地指令</span>
              <span class="data-value">
                <el-icon v-if="(account.data.weeklyMissionRuns ?? 0) === 0" class="check-icon"><CircleCheck /></el-icon>
                <span v-else class="uncompleted">未完成</span>
              </span>
            </div>
            <!-- 深渊指令 -->
            <div
              class="data-cell mini mission-cell"
              :class="{ 'is-cleared': account.data.abyssOrderCompleted }"
              @click.stop="toggleAbyssOrder(account.id)"
            >
              <span class="data-label">深渊指令</span>
              <span class="data-value">
                <el-icon v-if="account.data.abyssOrderCompleted" class="check-icon"><CircleCheck /></el-icon>
                <span v-else class="uncompleted">未完成</span>
              </span>
            </div>
            <!-- 商店奥德 -->
            <div
              class="data-cell mini"
              :class="{ 'is-cleared': (account.data.shopRuns ?? 0) === 0 }"
              @click.stop="openAccountEditDialog(account.id, 'shop')"
            >
              <el-button
                v-if="(account.data.shopRuns ?? 0) > 0"
                size="small"
                class="clear-btn"
                @click.stop="clearAccountData(account.id, 'shop')"
              >清</el-button>
              <span class="data-label">商店奥德</span>
              <span class="data-value">
                {{ account.data.shopRuns ?? 0 }}/{{ account.data.shopMax ?? 20 }}
              </span>
            </div>
            <!-- 转换奥德 -->
            <div
              class="data-cell mini"
              :class="{ 'is-cleared': (account.data.exchangeRuns ?? 0) === 0 }"
              @click.stop="openAccountEditDialog(account.id, 'exchange')"
            >
              <el-button
                v-if="(account.data.exchangeRuns ?? 0) > 0"
                size="small"
                class="clear-btn"
                @click.stop="clearAccountData(account.id, 'exchange')"
              >清</el-button>
              <span class="data-label">转换奥德</span>
              <span class="data-value">
                {{ account.data.exchangeRuns ?? 0 }}/{{ account.data.exchangeMax ?? 20 }}
              </span>
            </div>
            <!-- 每日副本 -->
            <div
              class="data-cell mini"
              :class="{ 'is-cleared': (account.data.dailyDungeonRuns ?? 0) === 0 && (account.data.dailyDungeonExtra ?? 0) === 0 }"
              @click.stop="openAccountEditDialog(account.id, 'dailyDungeon')"
            >
              <el-button
                v-if="(account.data.dailyDungeonRuns ?? 0) > 0 || (account.data.dailyDungeonExtra ?? 0) > 0"
                size="small"
                class="clear-btn"
                @click.stop="clearAccountData(account.id, 'dailyDungeon')"
              >清</el-button>
              <span class="data-label">每日副本</span>
              <span class="data-value">
                {{ account.data.dailyDungeonRuns ?? 0 }}
                <span class="data-plus">(+{{ account.data.dailyDungeonExtra ?? 0 }})</span>
                /{{ account.data.dailyDungeonMax ?? 14 }}
              </span>
            </div>
            <!-- 树古庆典 -->
            <div
              class="data-cell mini"
              :class="{ 'is-cleared': (account.data.shugoRuns ?? 0) === 0 && (account.data.shugoExtra ?? 0) === 0 }"
              @click.stop="openAccountEditDialog(account.id, 'shugo')"
            >
              <el-button
                v-if="(account.data.shugoRuns ?? 0) > 0 || (account.data.shugoExtra ?? 0) > 0"
                size="small"
                class="clear-btn"
                @click.stop="clearAccountData(account.id, 'shugo')"
              >清</el-button>
              <span class="data-label">树古庆典</span>
              <span class="data-value">
                {{ account.data.shugoRuns ?? 0 }}
                <span class="data-plus">(+{{ account.data.shugoExtra ?? 0 }})</span>
                /{{ account.data.shugoMax ?? 14 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="showEditDialog"
      :title="editDialogTitle"
      width="320px"
    >
      <el-form label-width="90px">
        <el-form-item label="当前次数">
          <el-input-number
            v-model="editForm.current"
            :min="0"
            :max="editMax"
            controls-position="right"
          />
          <span class="form-unit"> / {{ editMax }}</span>
        </el-form-item>
        <el-form-item v-if="extraMax > 0" label="补充次数">
          <el-input-number
            v-model="editForm.extra"
            :min="0"
            :max="extraMax"
            controls-position="right"
          />
          <span class="form-unit"> / {{ extraMax }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 新增账号弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      title="新增账号"
      width="320px"
    >
      <el-form label-width="80px">
        <el-form-item label="账号名称">
          <el-input v-model="newAccountForm.name" placeholder="如: 账号1" />
        </el-form-item>
        <el-form-item label="种族" required>
          <el-select v-model="newAccountForm.race" placeholder="请选择种族" style="width: 100%" @change="handleRaceChange">
            <el-option
              v-for="race in raceList"
              :key="race.value"
              :label="race.label"
              :value="race.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务器">
          <el-select v-model="newAccountForm.server" placeholder="请先选择种族" style="width: 100%">
            <el-option
              v-for="server in currentServers"
              :key="server.value"
              :label="server.label"
              :value="server.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addAccount">确认</el-button>
      </template>
    </el-dialog>

    <!-- 编辑账号弹窗 -->
    <el-dialog
      v-model="showEditAccountDialog"
      title="编辑账号"
      width="320px"
    >
      <el-form label-width="80px">
        <el-form-item label="账号名称">
          <el-input v-model="editAccountForm.name" placeholder="如: 账号1" />
        </el-form-item>
        <el-form-item label="种族" required>
          <el-select v-model="editAccountForm.race" placeholder="请选择种族" style="width: 100%" @change="handleEditRaceChange">
            <el-option
              v-for="race in raceList"
              :key="race.value"
              :label="race.label"
              :value="race.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务器">
          <el-select v-model="editAccountForm.server" placeholder="请先选择种族" style="width: 100%">
            <el-option
              v-for="server in editCurrentServers"
              :key="server.value"
              :label="server.label"
              :value="server.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会员">
          <el-switch v-model="editAccountForm.isMember" />
        </el-form-item>
        <el-form-item v-if="editAccountForm.isMember" label="到期时间">
          <el-date-picker
            v-model="editAccountForm.memberExpireTime"
            type="datetime"
            placeholder="选择会员到期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="x"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditAccountDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEditAccount">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useAccountStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'
import { raceList, raceServers } from '@/dict'
import type { Race } from '@/types'

const accountStore = useAccountStore()

// 格式化会员到期时间
const formatExpireTime = (timestamp: number | undefined) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}:${seconds}`
}

// 格式化会员到期倒计时
const formatMemberCountdown = (timestamp: number | undefined) => {
  if (!timestamp) return ''
  const now = Date.now()
  const diff = timestamp - now
  if (diff <= 0) return '已到期'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) {
    return `还剩${days}天${hours}时`
  }
  if (hours > 0) {
    return `还剩${hours}时${minutes}分`
  }
  return `还剩${minutes}分`
}

// 使用computed保持与store同步
const currentAccountId = computed(() => accountStore.currentAccountId)
const showEditDialog = ref(false)
const showAddDialog = ref(false)
const showEditAccountDialog = ref(false)
const editType = ref<'dailyDungeon' | 'shugo' | 'nightmare' | 'weeklyMission' | 'dailyMission' | 'shop' | 'exchange'>('dailyDungeon')

// 当前正在编辑的账号ID (用于全部账号视图下的编辑)
const editingAccountId = ref('')

// 展开/收起状态
const isExpanded = ref(true)

// 监听筛选账号变化，同步到当前账号
watch(() => accountStore.filterAccountId, (newFilterId) => {
  if (newFilterId) {
    // 筛选特定账号时，切换到该账号
    accountStore.setCurrentAccount(newFilterId)
  } else {
    // 选择全部账号时，取消选择状态
    accountStore.setCurrentAccount('')
  }
}, { immediate: true })

// 选择账号 (同时更新账号筛选，过滤角色卡片)
const selectAccount = (accountId: string) => {
  accountStore.setCurrentAccount(accountId)
  accountStore.filterAccountId = accountId
}

// 打开指定账号的数据编辑弹窗 (用于全部账号视图)
const openAccountEditDialog = (accountId: string, type: 'dailyDungeon' | 'shugo' | 'nightmare' | 'weeklyMission' | 'dailyMission' | 'shop' | 'exchange') => {
  editingAccountId.value = accountId
  editType.value = type
  const account = accountStore.accounts.find(a => a.id === accountId)
  if (account) {
    switch (type) {
      case 'dailyDungeon':
        editForm.value = { current: account.data.dailyDungeonRuns ?? 0, extra: account.data.dailyDungeonExtra ?? 0 }
        break
      case 'shugo':
        editForm.value = { current: account.data.shugoRuns ?? 0, extra: account.data.shugoExtra ?? 0 }
        break
      case 'nightmare':
        editForm.value = { current: account.data.nightmareRuns ?? 0, extra: account.data.nightmareExtra ?? 0 }
        break
      case 'weeklyMission':
        editForm.value = { current: account.data.weeklyMissionRuns ?? 0, extra: 0 }
        break
      case 'dailyMission':
        editForm.value = { current: account.data.dailyMissionRuns ?? 0, extra: 0 }
        break
      case 'shop':
        editForm.value = { current: account.data.shopRuns ?? 0, extra: 0 }
        break
      case 'exchange':
        editForm.value = { current: account.data.exchangeRuns ?? 0, extra: 0 }
        break
    }
  }
  showEditDialog.value = true
}

const editForm = ref({
  current: 0,
  extra: 0
})

const newAccountForm = ref({
  name: '',
  race: '天族' as Race,
  server: 'xx1'
})

// 编辑账号表单
const editAccountForm = ref({
  name: '',
  race: '天族' as Race,
  server: 'xx1',
  isMember: false,
  memberExpireTime: 0
})

// 当前账号信息
const currentAccountInfo = computed(() => {
  const account = accountStore.accounts.find(a => a.id === currentAccountId.value)
  return account || null
})

// 根据种族获取服务器列表
const currentServers = computed(() => {
  return raceServers[newAccountForm.value.race] || []
})

// 种族变更时重置服务器
const handleRaceChange = () => {
  const servers = raceServers[newAccountForm.value.race]
  if (servers && servers.length > 0) {
    newAccountForm.value.server = servers[0].value
  }
}

// 编辑账号时根据种族获取服务器列表
const editCurrentServers = computed(() => {
  return raceServers[editAccountForm.value.race] || []
})

// 编辑账号时种族变更重置服务器
const handleEditRaceChange = () => {
  const servers = raceServers[editAccountForm.value.race]
  if (servers && servers.length > 0) {
    editAccountForm.value.server = servers[0].value
  }
}

const currentData = computed(() => {
  const account = accountStore.accounts.find(a => a.id === currentAccountId.value)
  return account?.data || {
    dailyDungeonRuns: 14,
    dailyDungeonExtra: 29,
    dailyDungeonMax: 14,
    dailyDungeonExtraMax: 30,
    shugoRuns: 14,
    shugoExtra: 29,
    shugoMax: 14,
    shugoExtraMax: 30,
    nightmareRuns: 14,
    nightmareExtra: 29,
    nightmareMax: 14,
    nightmareExtraMax: 30,
    weeklyMissionRuns: 12,
    weeklyMissionMax: 12,
    dailyMissionRuns: 5,
    dailyMissionMax: 5
  }
})

const editDialogTitle = computed(() => {
  const titles = {
    dailyDungeon: '每日副本',
    shugo: '树古庆典',
    nightmare: '噩梦挑战',
    weeklyMission: '每周指令',
    dailyMission: '每日使命',
    shop: '商店奥德',
    exchange: '转换奥德'
  }
  return `编辑 ${titles[editType.value]}`
})

// 获取当前编辑类型的上限值 (支持全部账号视图)
const editMax = computed(() => {
  const accountId = editingAccountId.value || currentAccountId.value
  const account = accountStore.accounts.find(a => a.id === accountId)
  const data = account?.data
  if (!data) return 14
  switch (editType.value) {
    case 'dailyDungeon': return data.dailyDungeonMax ?? 14
    case 'shugo': return data.shugoMax ?? 14
    case 'nightmare': return data.nightmareMax ?? 14
    case 'weeklyMission': return data.weeklyMissionMax ?? 12
    case 'dailyMission': return data.dailyMissionMax ?? 5
    case 'shop': return data.shopMax ?? 20
    case 'exchange': return data.exchangeMax ?? 20
    default: return 14
  }
})

const extraMax = computed(() => {
  const accountId = editingAccountId.value || currentAccountId.value
  const account = accountStore.accounts.find(a => a.id === accountId)
  const data = account?.data
  if (!data) return 30
  switch (editType.value) {
    case 'dailyDungeon': return data.dailyDungeonExtraMax ?? 30
    case 'shugo': return data.shugoExtraMax ?? 30
    case 'nightmare': return data.nightmareExtraMax ?? 30
    case 'weeklyMission': return 0
    case 'dailyMission': return 0
    case 'shop': return 0
    case 'exchange': return 0
    default: return 30
  }
})

watch(currentAccountId, (newId) => {
  accountStore.setCurrentAccount(newId)
})

const handleAccountChange = (id: string) => {
  accountStore.setCurrentAccount(id)
}

// 打开编辑账号弹窗
const openEditAccountDialog = (accountId?: string) => {
  const targetId = accountId || currentAccountId.value
  const account = accountStore.accounts.find(a => a.id === targetId)
  if (account) {
    editingAccountId.value = targetId
    editAccountForm.value = {
      name: account.name,
      race: account.race,
      server: account.server,
      isMember: account.data.isMember || false,
      memberExpireTime: account.data.memberExpireTime || 0
    }
    showEditAccountDialog.value = true
  }
}

// 编辑指定账号
const handleAccountEdit = (accountId: string) => {
  openEditAccountDialog(accountId)
}

// 删除指定账号
const handleAccountDelete = (accountId: string) => {
  ElMessageBox.confirm('确定要删除该账号吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    accountStore.deleteAccount(accountId)
    ElMessage.success('账号已删除')
  }).catch(() => {
    // 取消删除
  })
}

// 确认编辑账号
const confirmEditAccount = () => {
  if (!editAccountForm.value.name.trim()) {
    ElMessage.warning('请输入账号名称')
    return
  }
  const targetId = editingAccountId.value || currentAccountId.value
  accountStore.updateAccount(targetId, {
    name: editAccountForm.value.name,
    race: editAccountForm.value.race,
    server: editAccountForm.value.server,
    data: {
      ...accountStore.accounts.find(a => a.id === targetId)?.data,
      isMember: editAccountForm.value.isMember,
      memberExpireTime: editAccountForm.value.isMember ? editAccountForm.value.memberExpireTime : 0
    }
  })
  showEditAccountDialog.value = false
  ElMessage.success('账号已更新')
}

const openEditDialog = (type: 'dailyDungeon' | 'shugo' | 'nightmare' | 'weeklyMission' | 'dailyMission') => {
  editType.value = type
  const data = currentData.value
  switch (type) {
    case 'dailyDungeon':
      editForm.value = { current: data.dailyDungeonRuns ?? 0, extra: data.dailyDungeonExtra ?? 0 }
      break
    case 'shugo':
      editForm.value = { current: data.shugoRuns ?? 0, extra: data.shugoExtra ?? 0 }
      break
    case 'nightmare':
      editForm.value = { current: data.nightmareRuns ?? 0, extra: data.nightmareExtra ?? 0 }
      break
    case 'weeklyMission':
      editForm.value = { current: data.weeklyMissionRuns ?? 0, extra: 0 }
      break
    case 'dailyMission':
      editForm.value = { current: data.dailyMissionRuns ?? 0, extra: 0 }
      break
  }
  showEditDialog.value = true
}

const confirmEdit = () => {
  const updates: Record<string, { runs: number, extra: number }> = {}
  switch (editType.value) {
    case 'dailyDungeon':
      updates.dailyDungeonRuns = { runs: editForm.value.current, extra: 0 }
      updates.dailyDungeonExtra = { runs: 0, extra: editForm.value.extra }
      break
    case 'shugo':
      updates.shugoRuns = { runs: editForm.value.current, extra: 0 }
      updates.shugoExtra = { runs: 0, extra: editForm.value.extra }
      break
    case 'nightmare':
      updates.nightmareRuns = { runs: editForm.value.current, extra: 0 }
      updates.nightmareExtra = { runs: 0, extra: editForm.value.extra }
      break
    case 'weeklyMission':
      updates.weeklyMissionRuns = { runs: editForm.value.current, extra: 0 }
      break
    case 'dailyMission':
      updates.dailyMissionRuns = { runs: editForm.value.current, extra: 0 }
      break
    case 'shop':
      updates.shopRuns = { runs: editForm.value.current, extra: 0 }
      break
    case 'exchange':
      updates.exchangeRuns = { runs: editForm.value.current, extra: 0 }
      break
  }
  // 使用正在编辑的账号ID，如果没有则使用当前账号ID
  const targetAccountId = editingAccountId.value || currentAccountId.value
  accountStore.updateAccountData(targetAccountId, updates)
  editingAccountId.value = '' // 重置编辑账号ID
  showEditDialog.value = false
  ElMessage.success('已更新')
}

const clearData = (type: 'dailyDungeon' | 'shugo' | 'nightmare' | 'weeklyMission' | 'dailyMission') => {
  const updates: Record<string, { runs: number, extra: number }> = {}
  switch (type) {
    case 'dailyDungeon':
      updates.dailyDungeonRuns = { runs: 0, extra: 0 }
      updates.dailyDungeonExtra = { runs: 0, extra: 0 }
      break
    case 'shugo':
      updates.shugoRuns = { runs: 0, extra: 0 }
      updates.shugoExtra = { runs: 0, extra: 0 }
      break
    case 'nightmare':
      updates.nightmareRuns = { runs: 0, extra: 0 }
      updates.nightmareExtra = { runs: 0, extra: 0 }
      break
    case 'weeklyMission':
      updates.weeklyMissionRuns = { runs: 0, extra: 0 }
      break
    case 'dailyMission':
      updates.dailyMissionRuns = { runs: 0, extra: 0 }
      break
  }
  accountStore.updateAccountData(currentAccountId.value, updates)
  ElMessage.success('已清空')
}

// 全部账号视图中清空指定账号数据
const clearAccountData = (accountId: string, type: 'dailyDungeon' | 'shugo' | 'nightmare' | 'weeklyMission' | 'dailyMission' | 'shop' | 'exchange') => {
  const updates: Record<string, { runs: number, extra: number }> = {}
  switch (type) {
    case 'dailyDungeon':
      updates.dailyDungeonRuns = { runs: 0, extra: 0 }
      updates.dailyDungeonExtra = { runs: 0, extra: 0 }
      break
    case 'shugo':
      updates.shugoRuns = { runs: 0, extra: 0 }
      updates.shugoExtra = { runs: 0, extra: 0 }
      break
    case 'nightmare':
      updates.nightmareRuns = { runs: 0, extra: 0 }
      updates.nightmareExtra = { runs: 0, extra: 0 }
      break
    case 'weeklyMission':
      updates.weeklyMissionRuns = { runs: 0, extra: 0 }
      break
    case 'dailyMission':
      updates.dailyMissionRuns = { runs: 0, extra: 0 }
      break
    case 'shop':
      updates.shopRuns = { runs: 0, extra: 0 }
      break
    case 'exchange':
      updates.exchangeRuns = { runs: 0, extra: 0 }
      break
  }
  accountStore.updateAccountData(accountId, updates)
  ElMessage.success('已清空')
}

// 切换深渊指令完成状态
const toggleAbyssOrder = (accountId: string) => {
  const account = accountStore.accounts.find(a => a.id === accountId)
  if (account) {
    accountStore.updateAccountData(accountId, {
      abyssOrderCompleted: { runs: account.data.abyssOrderCompleted ? 0 : 1, extra: 0 }
    })
  }
}

// 切换每日使命/本地指令/商店奥德/转换奥德完成状态
const toggleMissionComplete = (accountId: string, type: 'dailyMission' | 'weeklyMission' | 'shop' | 'exchange') => {
  const account = accountStore.accounts.find(a => a.id === accountId)
  if (account) {
    let currentRuns: number
    let maxRuns: number
    switch (type) {
      case 'dailyMission':
        currentRuns = account.data.dailyMissionRuns
        maxRuns = account.data.dailyMissionMax ?? 5
        break
      case 'weeklyMission':
        currentRuns = account.data.weeklyMissionRuns
        maxRuns = account.data.weeklyMissionMax ?? 12
        break
      case 'shop':
        currentRuns = account.data.shopRuns
        maxRuns = account.data.shopMax ?? 20
        break
      case 'exchange':
        currentRuns = account.data.exchangeRuns
        maxRuns = account.data.exchangeMax ?? 20
        break
    }
    // 如果当前是完成状态(0)，则设为未完成(max)；如果当前是未完成状态(max)，则设为完成(0)
    const newRuns = currentRuns === 0 ? maxRuns : 0
    if (type === 'dailyMission') {
      accountStore.updateAccountData(accountId, { dailyMissionRuns: { runs: newRuns, extra: 0 } })
    } else if (type === 'weeklyMission') {
      accountStore.updateAccountData(accountId, { weeklyMissionRuns: { runs: newRuns, extra: 0 } })
    } else if (type === 'shop') {
      accountStore.updateAccountData(accountId, { shopRuns: { runs: newRuns, extra: 0 } })
    } else if (type === 'exchange') {
      accountStore.updateAccountData(accountId, { exchangeRuns: { runs: newRuns, extra: 0 } })
    }
  }
}

// 快速完成深渊指令
const completeAbyssOrder = (accountId: string) => {
  accountStore.updateAccountData(accountId, {
    abyssOrderCompleted: { runs: 1, extra: 0 }
  })
  ElMessage.success('深渊指令已完成')
}

const addAccount = () => {
  if (!newAccountForm.value.name.trim()) {
    ElMessage.warning('请输入账号名称')
    return
  }
  accountStore.addAccount({
    name: newAccountForm.value.name,
    race: newAccountForm.value.race,
    server: newAccountForm.value.server || 'xx1'
  })
  newAccountForm.value = { name: '', race: '天族', server: 'xx1' }
  showAddDialog.value = false
  ElMessage.success('账号已添加')
}
</script>

<style scoped>
.account-bar {
  padding: 8px 20px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.05));
  border-bottom: 1px solid rgba(64, 158, 255, 0.2);
}

.account-bar-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.expand-btn {
  font-weight: 500;
}

.account-filter {
  width: 140px;
}

.account-bar-content {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 12px;
}

.account-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-select {
  width: 160px;
}

.current-account-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 0 8px;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.account-info-server {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.account-server {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

.account-race {
  color: #409eff;
  font-size: 12px;
  margin-left: 8px;
}

.account-data {
  display: flex;
  gap: 16px;
  flex: 1;
  justify-content: center;
}

.data-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  min-width: 120px;
}

.data-cell:hover {
  background: var(--el-fill-color);
  transform: translateY(-2px);
}

.data-cell.is-cleared {
  background: var(--success-light);
  border: 1px solid var(--success);
}

.data-cell.is-cleared .data-value {
  color: var(--success);
}

.data-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}

.data-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--primary);
}

.data-plus {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.clear-btn {
  margin-top: var(--space-1);
  padding: 2px var(--space-2);
  font-size: var(--font-size-xs);
}

.form-unit {
  margin-left: var(--space-2);
  color: var(--text-secondary);
}

/* 全部账号视图 */
.all-accounts-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.account-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.account-row:hover {
  background: var(--bg-hover);
}

.account-row.is-selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.account-row-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 320px;
  flex-shrink: 0;
}

.account-row-name {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.account-row-server {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

.account-row-data {
  display: flex;
  gap: var(--space-3);
  flex: 1;
}

.data-cell.mini {
  padding: var(--space-2) var(--space-3);
  min-width: 100px;
  position: relative;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.data-cell.mini .data-label {
  font-size: var(--font-size-xs);
  margin-bottom: var(--space-1);
}

.data-cell.mini .data-value {
  font-size: var(--font-size-sm);
}

.data-cell.mini .data-plus {
  font-size: 10px;
}

.data-cell.mini .clear-btn {
  position: absolute;
  top: var(--space-1);
  right: var(--space-1);
  padding: 0 var(--space-1);
  font-size: 10px;
  height: 16px;
  line-height: 1;
}

.member-countdown {
  font-size: var(--font-size-xs);
  color: var(--warning);
  font-weight: var(--font-weight-medium);
}

.abyss-order {
  min-width: 90px;
}

.mission-cell {
  min-width: 90px;
  cursor: pointer;
}

.mission-cell .data-value {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: var(--success);
  font-size: 18px;
}

.uncompleted {
  color: var(--text-secondary);
}
</style>
