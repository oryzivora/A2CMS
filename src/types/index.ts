// 角色属性
export interface CharacterStats {
  attack: number       // 攻击力
  health: number       // 生命值
  defense: number      // 防御力
  healing: number      // 治愈力
  attackSpeed: number  // 攻速
  critical: number     // 暴击
}

// 任务状态
export interface TaskStatus {
  crusade: boolean      // 讨伐战
  awakening: boolean   // 觉醒战
  shop: boolean        // 商店
  energyExchange: boolean // 奥德兑换
  signin: boolean      // 每日签到
  dailyQuest: boolean  // 每日任务
  abyssCorridor: boolean // 深渊回廊
  abyssOrder: boolean  // 深渊指令书
  localOrder: boolean  // 本地指令书
  sanctuaryReward: boolean // 圣域奖励
  sanctuaryChallenge: boolean // 圣域挑战
  ludrelle: boolean    // 卢德莱
  purify: boolean      // 净化所
}

// 种族类型
export type Race = '天族' | '魔族'

// 角色基础数据
export interface Character {
  id: string
  name: string
  role: string          // 职业
  race: Race            // 种族
  server: string        // 大区/服务器（与种族联动）
  accountId: string     // 所属账号ID
  groupId: string       // 所属组ID
  teamId?: string       // 所属小队ID
  stats: CharacterStats
  energy: number        // 当前基础奥德能量 (上限840)
  maxEnergy: number     // 基础最大能量
  extraEnergy: number   // 附加奥德能量 (上限2000)
  maxExtraEnergy: number // 附加最大能量
  kina: number          // 基纳(货币) - 单位：万
  score: number         // 装分
  combatPower: number   // 战斗力
  // 远征
  runs: number          // 远征当前次数
  maxRuns: number      // 远征基础上限 (默认14)
  extraRuns: number    // 远征补充上限 (默认10)
  finalRuns: number   // 远征最终消灭次数
  extraFinalRuns: number // 远征最终补充次数
  maxFinalRuns: number // 远征最终上限 (默认35)
  // 超越
  transcendRuns: number // 超越当前次数
  maxTranscendRuns: number // 超越基础上限 (默认7)
  extraTranscendRuns: number  // 超越补充上限 (默认10)
  transcendFinalRuns: number // 超越最终消灭次数
  extraTranscendFinalRuns: number // 超越最终补充次数
  maxTranscendFinalRuns: number // 超越最终上限 (默认28)
  // 圣域-卢德莱
  ludrelleRuns: number      // 挑战当前次数
  ludrelleExtra: number     // 挑战补充次数
  ludrelleRewardRuns: number  // 奖励当前次数
  ludrelleRewardExtra: number  // 奖励补充次数
  // 圣域-净化所
  purifyRuns: number        // 挑战当前次数
  purifyExtra: number       // 挑战补充次数
  purifyRewardRuns: number    // 奖励当前次数
  purifyRewardExtra: number    // 奖励补充次数
  // 噩梦挑战
  nightmareRuns: number        // 挑战当前次数
  nightmareExtra: number       // 补充次数
  nightmareMax: number        // 基本上限(14)
  nightmareExtraMax: number    // 补充上限(30)
  notes: string         // 备注
  isLocked: boolean     // 锁定状态
  
  // 任务状态
  tasks: TaskStatus
  
  // 创建/更新时间
  createdAt: number
  updatedAt: number
}

// 组定义
export interface Group {
  id: string
  name: string
  color?: string
}

// 小队定义
export interface Team {
  id: string
  name: string
  characterIds: string[]  // 成员角色ID列表
}

// 账号数据（账号维度）
export interface AccountData {
  // 每日副本
  dailyDungeonRuns: number      // 入场当前次数
  dailyDungeonExtra: number     // 补充次数
  dailyDungeonMax: number      // 基本上限(14)
  dailyDungeonExtraMax: number  // 补充上限(30)
  // 树古庆典
  shugoRuns: number             // 奖励钥匙当前次数
  shugoExtra: number            // 补充次数
  shugoMax: number             // 基本上限(14)
  shugoExtraMax: number        // 补充上限(30)
  // 深渊指令
  abyssOrderCompleted: boolean  // 是否完成深渊指令
  // 噩梦挑战
  nightmareRuns: number        // 挑战当前次数
  nightmareExtra: number       // 补充次数
  nightmareMax: number        // 基本上限(14)
  nightmareExtraMax: number    // 补充上限(30)
  // 每周指令
  weeklyMissionRuns: number    // 当前次数
  weeklyMissionMax: number    // 上限(12)
  // 每日使命
  dailyMissionRuns: number     // 当前次数
  dailyMissionMax: number      // 上限(5)
  // 商店奥德
  shopRuns: number             // 商店奥德当前次数
  shopMax: number             // 上限(1)
  // 转换奥德
  exchangeRuns: number         // 转换奥德当前次数
  exchangeMax: number         // 上限(1)
  // 会员
  isMember: boolean            // 是否会员
  memberExpireTime?: number    // 会员到期时间戳(毫秒)
}

// 账号定义
export interface Account {
  id: string
  name: string                 // 账号名称
  race: Race                   // 种族
  server: string               // 服务器
  data: AccountData            // 账号维度数据
}

// 角色筛选条件
export interface CharacterFilters {
  search: string
  role: string
  race: string
  groupId: string
  teamId: string
  accountId: string            // 账号筛选
}

// 布局模式
export type LayoutMode = '2' | '3' | '4' | '5' | 'table'

// 排序方式
export type SortMode = 'group' | 'runs' | 'energy' | 'normalEnergy' | 'custom'

// UI设置
export interface UISettings {
  layout: LayoutMode
  sortMode: SortMode
  showTasks: boolean      // 显示任务按钮
  showStats: boolean       // 显示统计卡片
  customSortEnabled: boolean
  sortLocked: boolean
  themeMode: 'game' | 'eyeCare'  // 游戏主题 / 护眼模式
  serverRegion: 'cn' | 'kr'  // 服务器大区：国服/韩服
  // 重置追踪
  lastVisitTime: number           // 上次访问时间戳
  lastEnergyRecoveryTime: number  // 上次能量恢复时间戳
  lastDailyResetTime: number      // 上次每日重置时间戳
  lastWeeklyResetTime: number     // 上次每周重置时间戳(周三)
}

// 服务器时区偏移
export const SERVER_TIME_OFFSET: Record<'cn' | 'kr', number> = {
  cn: 0,
  kr: -1 // 韩服比国服早1小时
}

// 重置时间配置(国服时间,韩服自动-1)
export const RESET_CONFIG = {
  dailyHours: [5, 17],        // 每日重置时间(国服)
  weeklyDay: 3,              // 每周重置日(0=周日,3=周三)
  energyIntervalHours: 3,    // 能量恢复间隔
  energyRecoveryMember: 15,  // 会员每3小时恢复量
  energyRecoveryNonMember: 10, // 非会员每3小时恢复量
  energyCap: 840,            // 能量上限
  // 远征/超越/噩梦/树古 上限
  expeditionCap: 14,
  transcendCap: 7,
  nightmareCap: 14,
  shugoCap: 14,
  shugoMemberExtra: 2,      // 会员额外恢复
  shugoNonMemberExtra: 1,   // 非会员额外恢复
  // 商店/转换奥德
  shopExchangeCap: 20
}
