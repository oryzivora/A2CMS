// 字典配置文件
// 用于管理游戏中的静态数据

// 职业列表
export const roleList = [
  '守护星',
  '剑星',
  '杀星',
  '弓星',
  '魔道星',
  '精灵星',
  '治愈星',
  '护法星'
] as const

// 种族列表
export const raceList = [
  { value: '天族', label: '天族' },
  { value: '魔族', label: '魔族' }
] as const

// 种族对应的大区/服务器
export const raceServers: Record<string, Array<{ value: string; label: string }>> = {
  '天族': [
    { value: '希埃爾', label: '希埃爾' },
    { value: '奈薩肯', label: '奈薩肯' },
    { value: '白傑爾', label: '白傑爾' },
    { value: '凱西內爾', label: '凱西內爾' },
    { value: '尤斯迪埃', label: '尤斯迪埃' },
    { value: '艾瑞爾', label: '艾瑞爾' },
    { value: '普雷奇翁', label: '普雷奇翁' },
    { value: '梅斯蘭泰達', label: '梅斯蘭泰達' },
    { value: '希塔尼耶', label: '希塔尼耶' },
    { value: '納尼亞', label: '納尼亞' },
    { value: '塔哈巴達', label: '塔哈巴達' },
    { value: '路特斯', label: '路特斯' },
    { value: '菲爾諾斯', label: '菲爾諾斯' },
    { value: '達彌努', label: '達彌努' },
    { value: '卡薩卡', label: '卡薩卡' },
    { value: '巴卡爾摩', label: '巴卡爾摩' },
    { value: '天加隆', label: '天加隆' },
    { value: '科奇隆', label: '科奇隆' },
    { value: '伊斯拉佩爾', label: '伊斯拉佩爾' },
    { value: '達彌努', label: '達彌努' },
    { value: '卡薩卡', label: '卡薩卡' },
    { value: '巴卡爾摩', label: '巴卡爾摩' },
    { value: '天加隆', label: '天加隆' },
    { value: '科奇隆', label: '科奇隆' }
  ],
  '魔族': [
    { value: '伊斯拉佩爾', label: '伊斯拉佩爾' },
    { value: '吉凱爾', label: '吉凱爾' },
    { value: '崔妮爾', label: '崔妮爾' },
    { value: '露梅爾', label: '露梅爾' },
    { value: '瑪爾庫坦', label: '瑪爾庫坦' },
    { value: '阿斯佩爾', label: '阿斯佩爾' },
    { value: '艾萊修奇卡', label: '艾萊修奇卡' },
    { value: '布里特拉', label: '布里特拉' },
    { value: '奈蒙', label: '奈蒙' },
    { value: '哈達爾', label: '哈達爾' },
    { value: '盧德萊', label: '盧德萊' },
    { value: '鄔爾古倫', label: '鄔爾古倫' },
    { value: '默尼', label: '默尼' },
    { value: '奧達爾', label: '奧達爾' },
    { value: '簡卡卡', label: '簡卡卡' },
    { value: '克羅梅德', label: '克羅梅德' },
    { value: '奎靈', label: '奎靈' },
    { value: '巴巴隆', label: '巴巴隆' }
  ]
}

// 默认分组
export const defaultGroups = [
  { id: 'default', name: '默认组', color: '#409EFF' },
  { id: 'main', name: '主力队', color: '#67C23A' },
  { id: 'farm', name: '采集队', color: '#E6A23C' }
]

// 任务列表
export const taskList = [
  { key: 'signin', label: '每日签到' },
  { key: 'abyssCorridor', label: '深渊回廊' },
  { key: 'awakening', label: '觉醒战' },
  { key: 'ludrelle', label: '卢德莱' },
  { key: 'purify', label: '净化所' }
]
