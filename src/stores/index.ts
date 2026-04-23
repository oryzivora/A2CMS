import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { 
  Character, Group, Team, CharacterFilters, TaskStatus,
  UISettings, LayoutMode, SortMode, Race, Account, AccountData
} from '@/types'

// 生成唯一ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// localStorage 键名
const STORAGE_KEY = 'a2cms_data'

// 默认账号数据
const defaultAccountData = (): AccountData => ({
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
})

// 从 localStorage 读取数据
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

// 保存数据到 localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('localStorage 保存失败:', e)
  }
}

// 默认任务状态
const defaultTaskStatus = (): TaskStatus => ({
  crusade: false,
  awakening: false,
  shop: false,
  energyExchange: false,
  signin: false,
  dailyQuest: false,
  abyssCorridor: false,
  abyssOrder: false,
  localOrder: false,
  sanctuaryReward: false,
  sanctuaryChallenge: false,
  ludrelle: false,
  purify: false
})

// 默认角色
const createDefaultCharacter = (overrides?: Partial<Character>): Character => ({
  id: generateId(),
  name: '新角色',
  role: '剑星',
  race: '天族',
  server: 'xx1',
  accountId: 'acc_1',
  groupId: 'default',
  teamId: undefined,
  stats: { attack: 1000, health: 5000, defense: 800, healing: 0, attackSpeed: 1.0, critical: 10 },
  energy: 840,
  maxEnergy: 840,
  extraEnergy: 0,
  maxExtraEnergy: 2000,
  kina: 0,
  score: 0,
  combatPower: 0,
  runs: 7,
  maxRuns: 14,
  extraRuns: 10,
  finalRuns: 0,
  maxFinalRuns: 35,
  transcendRuns: 4,
  maxTranscendRuns: 7,
  extraTranscendRuns: 10,
  transcendFinalRuns: 0,
  maxTranscendFinalRuns: 28,
  // 圣域-卢德莱
  ludrelleRuns: 4,
  ludrelleExtra: 1,
  ludrelleRewardRuns: 2,
  ludrelleRewardExtra: 1,
  // 圣域-净化所
  purifyRuns: 4,
  purifyExtra: 1,
  purifyRewardRuns: 2,
  purifyRewardExtra: 1,
  // 噩梦挑战
  nightmareRuns: 7,
  nightmareExtra: 10,
  nightmareMax: 14,
  nightmareExtraMax: 30,
  notes: '',
  isLocked: false,
  tasks: defaultTaskStatus(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides
})

// ============ Theme Store ============
export const useThemeStore = defineStore('theme', () => {
  const isNight = ref(false)
  const themeMode = ref<'game' | 'eyeCare'>('game')

  const toggleTheme = () => {
    isNight.value = !isNight.value
  }

  const setThemeMode = (mode: 'game' | 'eyeCare') => {
    themeMode.value = mode
    if (mode === 'eyeCare') {
      isNight.value = true
    }
  }

  return { isNight, themeMode, toggleTheme, setThemeMode }
})

// ============ Account Store ============
export const useAccountStore = defineStore('accounts', () => {
  // 账号列表
  const accounts = ref<Account[]>(loadFromStorage(`${STORAGE_KEY}_accounts`, [
    {
      id: 'acc_1',
      name: '账号1',
      race: '天族',
      server: 'xx1',
      data: defaultAccountData()
    },
    {
      id: 'acc_2',
      name: '账号2',
      race: '魔族',
      server: '耙耙龙',
      data: defaultAccountData()
    }
  ]))

  // 当前选中的账号ID
  const currentAccountId = ref<string>(accounts.value[0]?.id || '')

  // 账号筛选ID (空字符串表示全部账号)
  const filterAccountId = ref<string>('')

  // 监听数据变化，自动保存
  watch(accounts, (newVal) => {
    saveToStorage(`${STORAGE_KEY}_accounts`, newVal)
  }, { deep: true })
  
  // 设置当前账号
  const setCurrentAccount = (id: string) => {
    currentAccountId.value = id
  }
  
  // 添加账号
  const addAccount = (data: { name: string, race: Race, server: string }) => {
    const newAccount: Account = {
      id: generateId(),
      name: data.name,
      race: data.race,
      server: data.server,
      data: defaultAccountData()
    }
    accounts.value.push(newAccount)
    currentAccountId.value = newAccount.id
  }
  
  // 更新账号数据
  const updateAccountData = (id: string, updates: Record<string, { runs: number, extra: number }>) => {
    const account = accounts.value.find((a: Account) => a.id === id)
    if (account) {
      Object.keys(updates).forEach(key => {
        const keyName = key as keyof AccountData
        const val = updates[key]
        if (key.includes('Runs')) {
          (account.data as any)[keyName] = val.runs
        } else {
          (account.data as any)[keyName] = val.extra
        }
      })
    }
  }

  // 更新账号基本信息
  const updateAccount = (id: string, updates: { name?: string, race?: Race, server?: string, data?: Partial<AccountData> }) => {
    const account = accounts.value.find((a: Account) => a.id === id)
    if (account) {
      if (updates.name !== undefined) account.name = updates.name
      if (updates.race !== undefined) account.race = updates.race
      if (updates.server !== undefined) account.server = updates.server
      if (updates.data !== undefined) {
        account.data = { ...account.data, ...updates.data }
      }
    }
  }
  
  return {
    accounts,
    currentAccountId,
    filterAccountId,
    setCurrentAccount,
    addAccount,
    updateAccount,
    updateAccountData
  }
})

// ============ Character Store ============
export const useCharacterStore = defineStore('characters', () => {
  // 角色列表 - 从 localStorage 读取
  const characters = ref<Character[]>(loadFromStorage(`${STORAGE_KEY}_characters`, [
    createDefaultCharacter({ name: '角色示例1', role: '剑星', kina: 50000, score: 8500, combatPower: 12000, runs: 10, maxRuns: 14, extraRuns: 10, finalRuns: 19, maxFinalRuns: 35, transcendRuns: 6, maxTranscendRuns: 7, extraTranscendRuns: 10, transcendFinalRuns: 19, maxTranscendFinalRuns: 28, ludrelleRuns: 4, ludrelleExtra: 1, ludrelleRewardRuns: 2, ludrelleRewardExtra: 1, purifyRuns: 4, purifyExtra: 1, purifyRewardRuns: 2, purifyRewardExtra: 1, nightmareRuns: 8, nightmareExtra: 10, nightmareMax: 14, nightmareExtraMax: 30, notes: '主输出角色' }),
    createDefaultCharacter({ name: '角色示例2', role: '杀星', kina: 35000, score: 7800, combatPower: 9500, runs: 8, maxRuns: 14, extraRuns: 10, finalRuns: 12, maxFinalRuns: 35, transcendRuns: 4, maxTranscendRuns: 7, extraTranscendRuns: 10, transcendFinalRuns: 10, maxTranscendFinalRuns: 28, ludrelleRuns: 2, ludrelleExtra: 0, ludrelleRewardRuns: 1, ludrelleRewardExtra: 0, purifyRuns: 3, purifyExtra: 1, purifyRewardRuns: 1, purifyRewardExtra: 0, nightmareRuns: 6, nightmareExtra: 8, nightmareMax: 14, nightmareExtraMax: 30 })
  ]))

  // 筛选条件
  const filters = ref<CharacterFilters>({
    search: '',
    role: '',
    groupId: '',
    teamId: ''
  })

  // 计算属性：筛选后的角色列表
  const filteredCharacters = computed(() => {
    return characters.value.filter((char: Character) => {
      const matchSearch = !filters.value.search ||
        char.name.toLowerCase().includes(filters.value.search.toLowerCase())
      const matchRole = !filters.value.role || char.role === filters.value.role
      const matchGroup = !filters.value.groupId || char.groupId === filters.value.groupId
      const matchTeam = !filters.value.teamId || char.teamId === filters.value.teamId
      const matchAccount = !filters.value.accountId || char.accountId === filters.value.accountId
      return matchSearch && matchRole && matchGroup && matchTeam && matchAccount
    })
  })

  // 获取所有唯一职业列表
  const uniqueRoles = computed(() => {
    return [...new Set(characters.value.map((c: Character) => c.role))]
  })

  // 统计计算
  const totalStats = computed(() => {
    const accounts = useAccountStore().accounts
    // 统计每日使命完成情况
    const completedDailyMissions = characters.value.filter((c: Character) => c.tasks.dailyQuest).length
    const totalDailyMissions = characters.value.length
    // 统计每周指令完成情况（基于账号数据）
    const completedWeeklyMissions = characters.value.filter((c: Character) => c.tasks.localOrder).length
    const totalWeeklyMissions = characters.value.length
    // 统计会员情况
    const activeMembers = accounts.filter((a: Account) => a.data.isMember).length
    const now = Date.now()
    const expiringMembers = accounts.filter((a: Account) => a.data.isMember && a.data.memberExpireTime && a.data.memberExpireTime > now && a.data.memberExpireTime < now + 7 * 24 * 60 * 60 * 1000).length
    // 统计能量满的角色
    const fullEnergyChars = characters.value.filter((c: Character) => c.energy >= c.maxEnergy).length
    // 平均装分
    const avgScore = characters.value.length > 0 ? Math.round(characters.value.reduce((sum: number, c: Character) => sum + c.score, 0) / characters.value.length) : 0

    return {
      totalAccounts: accounts.length,
      totalChars: characters.value.length,
      totalKina: characters.value.reduce((sum: number, c: Character) => sum + c.kina, 0),
      totalEnergy: characters.value.reduce((sum: number, c: Character) => sum + c.energy, 0),
      totalRuns: characters.value.reduce((sum: number, c: Character) => sum + c.runs, 0),
      totalTranscendRuns: characters.value.reduce((sum: number, c: Character) => sum + c.transcendRuns, 0),
      availableRuns: characters.value.reduce((sum: number, c: Character) => sum + Math.max(0, Math.min(21, c.runs)), 0),
      availableTranscendRuns: characters.value.reduce((sum: number, c: Character) => sum + Math.max(0, Math.min(14, c.transcendRuns)), 0),
      totalExtraRuns: characters.value.reduce((sum: number, c: Character) => sum + c.extraRuns, 0),
      totalExtraTranscendRuns: characters.value.reduce((sum: number, c: Character) => sum + c.extraTranscendRuns, 0),
      completedDailyMissions,
      totalDailyMissions,
      completedWeeklyMissions,
      totalWeeklyMissions,
      expiringMembers,
      activeMembers,
      fullEnergyChars,
      avgScore
    }
  })

  // 添加角色
  const addCharacter = (char?: Partial<Character>) => {
    const newChar = createDefaultCharacter(char)
    characters.value.push(newChar)
    return newChar
  }

  // 更新角色
  const updateCharacter = (id: string, updates: Partial<Character>) => {
    const index = characters.value.findIndex((c: Character) => c.id === id)
    if (index !== -1) {
      characters.value[index] = {
        ...characters.value[index],
        ...updates,
        updatedAt: Date.now()
      }
    }
  }

  // 删除角色
  const deleteCharacter = (id: string) => {
    const index = characters.value.findIndex((c: Character) => c.id === id)
    if (index !== -1) {
      characters.value.splice(index, 1)
    }
  }

  // 移动角色到指定组
  const moveToGroup = (charId: string, groupId: string) => {
    const char = characters.value.find((c: Character) => c.id === charId)
    if (char) {
      char.groupId = groupId
      char.updatedAt = Date.now()
    }
  }

  // 移动角色到指定小队
  const moveToTeam = (charId: string, teamId: string | undefined) => {
    const char = characters.value.find((c: Character) => c.id === charId)
    if (char) {
      char.teamId = teamId
      char.updatedAt = Date.now()
    }
  }

  // 切换角色锁定状态
  const toggleLock = (id: string) => {
    const char = characters.value.find((c: Character) => c.id === id)
    if (char) {
      char.isLocked = !char.isLocked
      char.updatedAt = Date.now()
    }
  }

  // 切换任务状态
  const toggleTask = (charId: string, taskKey: keyof TaskStatus) => {
    const char = characters.value.find((c: Character) => c.id === charId)
    if (char) {
      char.tasks[taskKey] = !char.tasks[taskKey]
      char.updatedAt = Date.now()
    }
  }

  // 设置筛选条件
  const setFilters = (newFilters: Partial<CharacterFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // 清空筛选
  const clearFilters = () => {
    filters.value = { search: '', role: '', groupId: '', teamId: '', accountId: '' }
  }

  // 批量清空角色任务状态
  const clearAllTasks = (charIds?: string[]) => {
    const targetIds = charIds || characters.value.map((c: Character) => c.id)
    targetIds.forEach((id: string) => {
      const char = characters.value.find((c: Character) => c.id === id)
      if (char) {
        char.tasks = defaultTaskStatus()
        char.updatedAt = Date.now()
      }
    })
  }

  // 批量清空角色副本次数
  const clearAllRuns = (charIds?: string[]) => {
    const targetIds = charIds || characters.value.map((c: Character) => c.id)
    targetIds.forEach((id: string) => {
      const char = characters.value.find((c: Character) => c.id === id)
      if (char) {
        char.runs = 0
        char.transcendRuns = 0
        char.updatedAt = Date.now()
      }
    })
  }

  // 小队连锁操作 - 清副本
  const teamChainDungeon = (teamId: string, count: number) => {
    const teamChars = characters.value.filter((c: Character) => c.teamId === teamId)
    teamChars.forEach((char: Character) => {
      char.runs = Math.max(0, char.runs - count)
      char.energy = Math.max(0, char.energy - count * 80)
      char.updatedAt = Date.now()
    })
  }

  // 小队连锁操作 - 清小游戏
  const teamChainMinigame = (teamId: string, count: number) => {
    const teamChars = characters.value.filter((c: Character) => c.teamId === teamId)
    teamChars.forEach((char: Character) => {
      char.transcendRuns = Math.max(0, char.transcendRuns - count)
      char.updatedAt = Date.now()
    })
  }

  // 监听数据变化，自动保存到 localStorage
  watch(characters, (newData) => {
    saveToStorage(`${STORAGE_KEY}_characters`, newData)
  }, { deep: true })

  return {
    characters,
    filters,
    filteredCharacters,
    uniqueRoles,
    totalStats,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    moveToGroup,
    moveToTeam,
    toggleLock,
    toggleTask,
    setFilters,
    clearFilters,
    clearAllTasks,
    clearAllRuns,
    teamChainDungeon,
    teamChainMinigame
  }
})

// ============ Group Store ============
export const useGroupStore = defineStore('groups', () => {
  // 用户自定义组 - 从 localStorage 读取
  const groups = ref<Group[]>(loadFromStorage(`${STORAGE_KEY}_groups`, [
    { id: 'default', name: '默认组', color: '#409EFF' },
    { id: 'main', name: '主力队', color: '#67C23A' },
    { id: 'farm', name: '采集队', color: '#E6A23C' }
  ]))

  // 监听数据变化，自动保存到 localStorage
  watch(groups, (newData) => {
    saveToStorage(`${STORAGE_KEY}_groups`, newData)
  }, { deep: true })

  // 添加组
  const addGroup = (name: string, color?: string) => {
    const newGroup: Group = {
      id: generateId(),
      name,
      color: color || '#409EFF'
    }
    groups.value.push(newGroup)
    return newGroup
  }

  // 删除组
  const deleteGroup = (id: string) => {
    const index = groups.value.findIndex((g: Group) => g.id === id)
    if (index !== -1 && id !== 'default') {
      groups.value.splice(index, 1)
    }
  }

  // 更新组
  const updateGroup = (id: string, updates: Partial<Group>) => {
    const group = groups.value.find((g: Group) => g.id === id)
    if (group) {
      Object.assign(group, updates)
    }
  }

  // 获取组颜色
  const getGroupColor = (groupId: string): string => {
    const group = groups.value.find((g: Group) => g.id === groupId)
    return group?.color || '#409EFF'
  }

  // 获取组名称
  const getGroupName = (groupId: string): string => {
    const group = groups.value.find((g: Group) => g.id === groupId)
    return group?.name || '默认组'
  }

  return {
    groups,
    addGroup,
    deleteGroup,
    updateGroup,
    getGroupColor,
    getGroupName
  }
})

// ============ Team Store ============
export const useTeamStore = defineStore('teams', () => {
  // 小队列表 - 从 localStorage 读取
  const teams = ref<Team[]>(loadFromStorage(`${STORAGE_KEY}_teams`, []))

  // 监听数据变化
  watch(teams, (newData) => {
    saveToStorage(`${STORAGE_KEY}_teams`, newData)
  }, { deep: true })

  // 添加小队
  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: generateId(),
      name,
      characterIds: []
    }
    teams.value.push(newTeam)
    return newTeam
  }

  // 删除小队
  const deleteTeam = (id: string) => {
    const index = teams.value.findIndex((t: Team) => t.id === id)
    if (index !== -1) {
      teams.value.splice(index, 1)
    }
  }

  // 更新小队
  const updateTeam = (id: string, updates: Partial<Team>) => {
    const team = teams.value.find((t: Team) => t.id === id)
    if (team) {
      Object.assign(team, updates)
    }
  }

  // 添加成员到小队
  const addMemberToTeam = (teamId: string, charId: string) => {
    const team = teams.value.find((t: Team) => t.id === teamId)
    if (team && !team.characterIds.includes(charId)) {
      team.characterIds.push(charId)
    }
  }

  // 从小队移除成员
  const removeMemberFromTeam = (teamId: string, charId: string) => {
    const team = teams.value.find((t: Team) => t.id === teamId)
    if (team) {
      team.characterIds = team.characterIds.filter((id: string) => id !== charId)
    }
  }

  return {
    teams,
    addTeam,
    deleteTeam,
    updateTeam,
    addMemberToTeam,
    removeMemberFromTeam
  }
})

// ============ UI Store ============
export const useUIStore = defineStore('ui', () => {
  const settings = ref<UISettings>(loadFromStorage(`${STORAGE_KEY}_ui`, {
    layout: '4',
    sortMode: 'group',
    showTasks: true,
    showStats: true,
    customSortEnabled: false,
    sortLocked: false,
    themeMode: 'game'
  }))

  // 监听变化
  watch(settings, (newData) => {
    saveToStorage(`${STORAGE_KEY}_ui`, newData)
  }, { deep: true })

  const setLayout = (layout: LayoutMode) => {
    settings.value.layout = layout
  }

  const setSortMode = (mode: SortMode) => {
    settings.value.sortMode = mode
  }

  const toggleTasks = () => {
    settings.value.showTasks = !settings.value.showTasks
  }

  const toggleStats = () => {
    settings.value.showStats = !settings.value.showStats
  }

  const setThemeMode = (mode: 'game' | 'eyeCare') => {
    settings.value.themeMode = mode
  }

  return {
    settings,
    setLayout,
    setSortMode,
    toggleTasks,
    toggleStats,
    setThemeMode
  }
})

// ============ Backup Store ============
export const useBackupStore = defineStore('backup', () => {
  // 导出数据为JSON
  const exportData = (): string => {
    const charStore = useCharacterStore()
    const groupStore = useGroupStore()
    const teamStore = useTeamStore()
    const uiStore = useUIStore()

    const data = {
      version: '1.0.0',
      timestamp: Date.now(),
      characters: charStore.characters,
      groups: groupStore.groups,
      teams: teamStore.teams,
      uiSettings: uiStore.settings
    }

    return JSON.stringify(data, null, 2)
  }

  // 导入数据
  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr)
      
      const charStore = useCharacterStore()
      const groupStore = useGroupStore()
      const teamStore = useTeamStore()
      const uiStore = useUIStore()

      if (data.characters) charStore.characters = data.characters
      if (data.groups) groupStore.groups = data.groups
      if (data.teams) teamStore.teams = data.teams
      if (data.uiSettings) Object.assign(uiStore.settings, data.uiSettings)

      return true
    } catch (e) {
      console.error('导入失败:', e)
      return false
    }
  }

  return {
    exportData,
    importData
  }
})
