# A2CMS 功能文档

> Aion2 Character Management System - 永恒之塔角色管理系统

## 📝 文档说明
此文档用于记录 A2CMS 项目的所有功能需求、设计决策和实现细节。
最后更新：2026-04-17 (账号系统更新)

---

## 一、项目概述

### 1.1 项目名称
**A2CMS** (Aion2 Character Management System)

### 1.2 项目目标
为《永恒之塔》(Aion2) 游戏玩家提供**多账号、多角色**的集中管理平台，跟踪游戏资源、优化游戏体验。

### 1.3 目标用户
- 多账号搬砖玩家
- 公会管理人员
- 资源规划者

### 1.4 当前版本
- 版本号：0.2.0
- 开发阶段：Beta
- 作者：老登怎么办
- 联系方式：https://space.bilibili.com/2492373

---

## 二、技术架构

### 2.1 技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| TypeScript | 5.3+ | 类型安全 |
| Vite | 5.1+ | 构建工具 |
| Vue Router | 4.2+ | 路由管理 |
| Pinia | 2.1+ | 状态管理 |
| Element Plus | 2.5+ | UI组件库 |
| @element-plus/icons-vue | 2.3+ | 图标库 |
| unplugin-auto-import | 0.17+ | 自动导入 |
| unplugin-vue-components | 0.26+ | 组件自动注册 |

### 2.2 数据存储
- **存储方式**：localStorage
- **存储键名**：`a2cms_data_*`
- **数据格式**：JSON
- **自动同步**：数据变更时自动保存

### 2.3 目录结构
```
A2CMS/
├── index.html                 # HTML入口
├── package.json              # 依赖配置
├── vite.config.ts            # Vite配置
├── tsconfig.json             # TypeScript配置
├── tsconfig.node.json        # Node TS配置
└── src/
    ├── main.ts               # 应用入口
    ├── App.vue               # 根组件
    ├── router/
    │   └── index.ts          # 路由配置
    ├── stores/
    │   └── index.ts          # Pinia状态管理
    ├── types/
    │   └── index.ts          # TypeScript类型定义
    ├── components/
    │   ├── AppHeader.vue     # 顶部导航栏
    │   ├── CharacterCard.vue # 角色卡片组件 ⭐
    │   └── ThemeToggle.vue   # 主题切换
    ├── views/
    │   └── Characters.vue    # 角色管理主页 ⭐
    ├── styles/
    │   └── variables.css     # CSS变量和主题
    └── assets/
        └── .gitkeep
```

---

## 三、现有功能模块

### 3.1 角色管理模块 ⭐
**状态**：✅ 已完成（已优化）  
**文件**：`src/views/Characters.vue`, `src/components/CharacterCard.vue`

#### 3.1.1 功能列表
| 功能点 | 描述 | 优先级 | 状态 | 优化说明 |
|--------|------|--------|------|----------|
| 角色列表展示 | 卡片/表格双视图支持 | P0 | ✅ | 使用 el-card 和 el-table 组件 |
| 角色CRUD | 新增、编辑、删除角色 | P0 | ✅ | 使用 Element Plus 图标按钮 |
| 角色锁定 | 防止误删重要角色 | P0 | ✅ | 使用 Lock/Unlock 图标 |
| 能量跟踪 | 奥德能量（上限840点） | P0 | ✅ | 使用 el-progress 条纹进度条 |
| 副本计数 | 远征/超越副本次数 | P0 | ✅ | 使用 el-input-number 快速调整 |
| 任务状态 | 9种任务完成状态 | P1 | ✅ | 使用 el-tag 可点击标签 |
| 分组管理 | 自定义分组及颜色 | P1 | ✅ | 使用 el-dialog 子组件 |
| 小队管理 | 批量操作支持 | P1 | ⚠️ | 功能简化，待完善 |
| 数据导入/导出 | JSON格式备份 | P1 | ✅ | 优化导入弹窗 |
| 筛选与排序 | 多条件筛选、多种排序 | P1 | ✅ | 使用 el-radio-group 排序 |
| 统计面板 | 总览所有角色数据 | P1 | ✅ | 使用 el-statistic 统计组件 |
| 布局切换 | 2/3/4/5网格及表格 | P2 | ✅ | 使用 el-button-group |

#### 3.1.2 Element Plus 最佳实践优化
✅ **已完成以下优化**：

1. **组件替换**
   - 原生 `<button>` → `el-button`
   - 原生 `<input>` → `el-input`, `el-input-number`
   - 原生 `<select>` → `el-select`
   - 原生 `<div>` 分组 → `el-card`, `el-tag`

2. **图标使用**
   - 使用 `@element-plus/icons-vue` 官方图标库
   - 使用 `Plus`, `Search`, `ArrowDown`, `Lock`, `Edit`, `Delete` 等图标

3. **布局组件**
   - 使用 `el-row`, `el-col` 进行响应式网格布局
   - 使用 `el-card` 封装卡片组件
   - 使用 `el-statistic` 显示统计数据

4. **表单组件**
   - 使用 `el-input-number` 进行数字输入
   - 使用 `el-select` 下拉选择
   - 使用 `el-color-picker` 颜色选择

5. **反馈组件**
   - 使用 `el-message` 成功/警告提示
   - 使用 `el-empty` 空状态展示

6. **子组件拆分**
   - `StatsPanel` - 统计面板子组件
   - `FilterBar` - 筛选栏子组件
   - `SortBar` - 排序栏子组件
   - `GroupDialog` - 分组管理弹窗
   - `TeamDialog` - 小队管理弹窗

#### 3.1.3 角色数据模型
```typescript
interface Character {
  id: string                                    // 唯一ID
  name: string                                  // 角色名称
  role: string                                  // 职业 (剑星/杀星/魔道星等)
  groupId: string                               // 所属分组ID
  teamId?: string                               // 所属小队ID
  stats: CharacterStats                         // 战斗属性
  energy: number                                 // 当前奥德能量
  maxEnergy: number                             // 最大能量 (默认840)
  kina: number                                   // 基纳数量 (单位：万)
  score: number                                  // 装备评分
  runs: number                                   // 远征副本次数
  transcendRuns: number                          // 超越副本次数
  notes: string                                  // 备注信息
  isLocked: boolean                              // 锁定状态
  tasks: TaskStatus                              // 任务完成状态
  serverType: 'tw' | 'kr'                        // 服务器类型
  createdAt: number                              // 创建时间戳
  updatedAt: number                              // 更新时间戳
}

interface CharacterStats {
  attack: number        // 攻击力
  health: number        // 生命值
  defense: number       // 防御力
  healing: number       // 治愈力
  attackSpeed: number  // 攻速
  critical: number     // 暴击
}

interface TaskStatus {
  crusade: boolean           // 讨伐战
  awakening: boolean         // 觉醒战
  shop: boolean              // 商店
  energyExchange: boolean    // 奥德兑换
  signin: boolean            // 每日签到
  abyssOrder: boolean        // 深渊指令书
  localOrder: boolean        // 本地指令书
  sanctuaryReward: boolean   // 圣域奖励
  sanctuaryChallenge: boolean // 圣域挑战
}
```

#### 3.1.4 支持的职业
- 守护星
- 剑星
- 杀星
- 弓星
- 魔道星
- 精灵星
- 治愈星
- 护法星

#### 3.1.5 默认分组
| ID | 名称 | 颜色 |
|----|------|------|
| default | 默认组 | #409EFF (蓝色) |
| main | 主力队 | #67C23A (绿色) |
| farm | 采集队 | #E6A23C (橙色) |

#### 3.1.6 角色卡片UI (CharacterCard.vue)
角色卡片是系统的核心显示组件，包含以下模块：

**布局结构**：
```
┌─────────────────────────────────────┐
│ [装备评分]    [战斗力]              │  ← 顶部双列模块
├─────────────────────────────────────┤
│ 奥德能量 (编辑)                     │  ← 能量模块
│ ████████ 60/840+1000               │
├─────────────────────────────────────┤
│ 基纳(万)              50000          │  ← 金色独立模块
├─────────────────────────────────────┤
│ [远征]          [超越]              │  ← 并列模块
│ 10(+10)/14     6(+10)/7            │
│ 最终: 19/35    最终: 19/28         │
├─────────────────────────────────────┤
│ [深渊重铸:卢德莱]  [侵蚀净化所]      │  ← 圣域副本模块
│ 挑战:4(+1)/4     挑战:4(+1)/4       │
│ 奖励:2(+1)/2     奖励:2(+1)/2       │
├─────────────────────────────────────┤
│ 任务: 每日签到 觉醒战 卢德莱 净化所...│
└─────────────────────────────────────┘
```

**模块特性**：
- 装备评分/战斗力：顶部并排小模块，浮雕效果
- 奥德能量：可双击或点击编辑图标进入编辑弹窗
- 基纳：金色渐变独立模块
- 远征/超越：并排显示，各有当前次数+补充次数+最终消灭
- 圣域副本：卢德莱/净化所，可点击任务按钮重置
- 任务栏：点击卢德莱/净化所同时重置对应副本数据

#### 3.1.7 账号系统 ⭐NEW

**概述**：噩梦挑战、树古庆典、每日副本是账号维度数据，所有角色共享。

**数据模型**：
```typescript
interface AccountData {
  // 每日副本
  dailyDungeonRuns: number      // 入场当前次数
  dailyDungeonExtra: number     // 补充次数
  dailyDungeonMax: number      // 基本上限(14)
  dailyDungeonExtraMax: number  // 补充上限(30)
  // 树古庆典
  shugoRuns: number             // 奖励钥匙当前次数
  shugoExtra: number           // 补充次数
  shugoMax: number             // 基本上限(14)
  shugoExtraMax: number        // 补充上限(30)
  // 噩梦挑战
  nightmareRuns: number       // 挑战当前次数
  nightmareExtra: number      // 补充次数
  nightmareMax: number       // 基本上限(14)
  nightmareExtraMax: number   // 补充上限(30)
}

interface Account {
  id: string
  name: string                 // 账号名称
  server: string              // 服务器
  data: AccountData           // 账号维度数据
}
```

**账号数据栏 (AccountBar.vue)**：
- 位置：页面顶部，账号数据栏独立一行
- 功能：
  - 账号选择下拉框
  - 新增账号按钮
  - 三个账号维度数据并排显示
  - 点击数据格可编辑
  - 一键清空按钮
  - 清空后模块变为浅绿色

**显示格式**：
- `14(+29)/14` = 当前次数(+补充次数)/基本上限

**账号切换**：
- 切换账号后，角色列表自动筛选为该账号的角色
- 新增角色时自动分配当前选中的账号

---

## 四、路由设计

### 4.1 路由配置
**文件**：`src/router/index.ts`

| 路径 | 组件 | 描述 | 状态 |
|------|------|------|------|
| `/` | Characters.vue | 角色管理主页 | ✅ |

### 4.2 导航菜单
- 👥 角色管理 → `/`

---

## 五、状态管理 (Pinia Stores)

### 5.1 Store 列表
| Store | 文件位置 | 功能 | 数据键 |
|-------|----------|------|--------|
| useThemeStore | stores/index.ts | 主题模式 | - |
| useAccountStore | stores/index.ts | 账号管理、数据 | a2cms_data_accounts |
| useCharacterStore | stores/index.ts | 角色CRUD、筛选、统计 | a2cms_data_characters |
| useGroupStore | stores/index.ts | 分组管理 | a2cms_data_groups |
| useTeamStore | stores/index.ts | 小队管理 | a2cms_data_teams |
| useUIStore | stores/index.ts | UI偏好设置 | a2cms_data_ui |
| useBackupStore | stores/index.ts | 数据备份与恢复 | - |

### 5.2 UI设置模型
```typescript
interface UISettings {
  layout: LayoutMode              // 布局模式 '2' | '3' | '4' | '5' | 'table'
  sortMode: SortMode              // 排序方式 'group' | 'runs' | 'energy' | 'normalEnergy' | 'custom'
  showTasks: boolean              // 显示任务按钮
  showStats: boolean              // 显示统计卡片
  customSortEnabled: boolean       // 自定义排序启用
  sortLocked: boolean             // 锁定排序
  themeMode: 'game' | 'eyeCare'    // 游戏主题 / 护眼模式
}

type LayoutMode = '2' | '3' | '4' | '5' | 'table'
type SortMode = 'group' | 'runs' | 'energy' | 'normalEnergy' | 'custom'
```

---

## 六、数据备份方案

### 6.1 备份数据模型
```typescript
interface BackupData {
  version: string              // 版本号
  timestamp: number            // 时间戳
  characters: Character[]       // 角色数据
  groups: Group[]              // 分组数据
  teams: Team[]                // 小队数据
  uiSettings: UISettings      // UI设置
}
```

### 6.2 备份策略
- **自动保存**：数据变更时自动同步到 localStorage（deep watch）
- **手动导出**：用户可导出 JSON 文件
- **导入恢复**：支持导入备份文件恢复数据

---

## 七、主题系统

### 7.1 主题模式
| 模式 | 描述 | 切换方式 |
|------|------|----------|
| 日间模式 (day) | 浅色背景，蓝色主题 | 默认 |
| 夜间模式 (night) | 深色背景，护眼设计 | 主题开关 |

### 7.2 CSS变量
**文件**：`src/styles/variables.css`

使用 Element Plus CSS 变量，支持自动主题切换。

### 7.3 设计系统 (Design System)

#### 7.3.1 设计原则
- **8px 网格系统**：所有间距基于 8px
- **CSS 变量优先**：使用 CSS 变量而非硬编码颜色
- **Element Plus 集成**：与 Element Plus 主题系统无缝集成
- **响应式优先**：移动端优先的设计

#### 7.3.2 间距系统
| 变量 | 值 | 用途 |
|------|-----|------|
| `--space-1` | 4px | 紧凑间距 |
| `--space-2` | 8px | 小间距 |
| `--space-3` | 12px | 中等间距 |
| `--space-4` | 16px | 标准间距 |
| `--space-6` | 24px | 大间距 |
| `--space-8` | 32px | 超大间距 |

#### 7.3.3 字体系统
| 变量 | 值 | 用途 |
|------|-----|------|
| `--font-size-xs` | 11px | 辅助文字 |
| `--font-size-sm` | 12px | 次要文字 |
| `--font-size-base` | 14px | 正文文字 |
| `--font-size-md` | 14px | 中等文字 |
| `--font-size-lg` | 16px | 标题文字 |
| `--font-size-xl` | 18px | 大标题 |
| `--font-size-2xl` | 20px | 页面标题 |

#### 7.3.4 颜色语义化
- `--text-primary`: 主要文字
- `--text-regular`: 正文文字
- `--text-secondary`: 次要文字
- `--text-placeholder`: 占位符
- `--bg-primary`: 主背景
- `--bg-secondary`: 次要背景
- `--bg-card`: 卡片背景
- `--border-base`: 边框颜色

#### 7.3.5 阴影系统
| 变量 | 用途 |
|------|------|
| `--shadow-xs` | 轻微阴影 |
| `--shadow-sm` | 小阴影 |
| `--shadow-md` | 中等阴影 |
| `--shadow-lg` | 大阴影 |

#### 7.3.6 圆角系统
| 变量 | 值 | 用途 |
|------|-----|------|
| `--radius-sm` | 4px | 小圆角 |
| `--radius-md` | 6px | 中圆角 |
| `--radius-lg` | 8px | 大圆角 |
| `--radius-xl` | 12px | 超大圆角 |
| `--radius-full` | 9999px | 圆形/药丸形 |

#### 7.3.7 过渡动画
| 变量 | 值 | 用途 |
|------|-----|------|
| `--transition-fast` | 150ms | 快速过渡 |
| `--transition-normal` | 250ms | 标准过渡 |
| `--transition-slow` | 350ms | 慢速过渡 |

#### 7.3.8 组件标准化
- **按钮高度**：28px (small) / 32px (base) / 36px (large)
- **头部高度**：56px
- **卡片圆角**：8px
- **输入框圆角**：6px

---

## 八、响应式设计

### 8.1 断点设置
| 设备 | 断点 | 布局调整 |
|------|------|----------|
| 手机 | ≤480px | 单列网格 |
| 平板 | ≤768px | 2列网格，隐藏导航 |
| 桌面 | >768px | 标准布局 |
| 大屏 | ≥1920px | 更大的内边距 |

### 8.2 网格布局
- 角色卡片：2/3/4/5列可选，使用 `el-row`, `el-col` 响应式
- 统计卡片：`xs`, `sm`, `md` 断点自动调整

---

## 九、待开发功能

### 9.1 功能增强
| 功能 | 描述 | 优先级 | 复杂度 |
|------|------|--------|--------|
| 通知系统 | 能量满了等提醒 | P2 | 中 |
| 数据图表 | 资源变化图 | P3 | 高 |
| 自动化脚本 | 定时任务记录 | P3 | 高 |
| 多语言支持 | 中文/英文切换 | P3 | 中 |
| 云端同步 | 数据备份到服务器 | P3 | 高 |
| 团队协作 | 多人管理同一批角色 | P3 | 高 |

### 9.2 UI/UX改进
| 改进点 | 描述 | 优先级 |
|--------|------|--------|
| 移动端优化 | 更好的触屏操作 | P2 |
| 快捷键支持 | 提高操作效率 | P3 |
| 批量编辑 | 一次性修改多个角色 | P2 |
| 角色对比 | 并排比较两个角色 | P3 |
| 小队管理完善 | 成员分配与批量操作 | P2 |

---

## 十、已知问题

| 问题 | 描述 | 状态 | 修复方案 |
|------|------|------|----------|
| 小队功能简化 | 成员管理功能简化 | ⚠️ | 待完善成员分配功能 |
| 能量同步 | 未与实际游戏数据同步 | ⚠️ | 考虑API集成 |

---

## 十一、设计决策记录

| 日期 | 决策 | 原因 | 影响 |
|------|------|------|------|
| 2026-01 | 使用 localStorage | 简单、无需后端，保护隐私 | 数据局限于浏览器 |
| 2026-01 | 采用 Pinia | Vue 3 官方推荐、TypeScript友好 | 替代 Vuex |
| 2026-01 | Element Plus | 组件丰富、主题友好 | UI一致性 |
| 2026-01 | 卡片+表格双视图 | 满足不同使用习惯 | 增加代码复杂度 |
| 2026-01 | 自动保存 | 用户体验优化 | 频繁写入可能影响性能 |
| 2026-04-16 | Element Plus 最佳实践优化 | 统一UI风格，提高可维护性 | 代码重构，更规范 |

---

## 十二、贡献指南

### 12.1 开发环境
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 12.2 代码规范
- 使用 TypeScript 严格模式
- 组件采用 Composition API + `<script setup>`
- 样式使用 scoped + CSS 变量 + Element Plus 变量
- 遵循 Vue 3 最佳实践
- **优先使用 Element Plus 组件**，避免原生 HTML 元素

### 12.3 Element Plus 使用规范
✅ **推荐做法**：
- 使用官方图标库 `@element-plus/icons-vue`
- 使用 `el-button` 替代原生 `<button>`
- 使用 `el-input`, `el-select` 替代原生表单
- 使用 `el-card` 封装卡片组件
- 使用 `el-message` 进行提示反馈
- 使用 `el-dialog` 创建弹窗
- 使用 `el-row`, `el-col` 进行响应式布局

❌ **避免做法**：
- 避免在模板中使用原生 `<button>`，使用 `el-button`
- 避免使用自定义 CSS 实现 Element Plus 已有的组件
- 避免硬编码颜色，使用 CSS 变量

---

## 十三、更新日志

### v0.2.0 (2026-04-22) - UI Redesign
- **整体UI重构**
  - 建立完整的设计系统 (8px 网格)
  - CSS 变量标准化
  - Element Plus 主题深度集成
- **组件优化**
  - AppHeader.vue 现代化设计
  - StatsPanel.vue 改为待办风格
  - AccountBar.vue 样式一致性
  - FilterBar/SortBar 响应式优化
- **设置系统**
  - 齿轮设置按钮
  - 功能菜单重组

### v0.1.0 (2026-04-16)
- 初始版本发布
- 实现角色管理基础功能
- 实现分组小队管理
- 实现主题切换系统
- 实现数据导入/导出
- **Element Plus 最佳实践优化**：
  - CharacterCard.vue 完全重构
  - Characters.vue 完全重构
  - 使用官方组件和图标
  - 拆分子组件提高可维护性

---

**📌 本文档将随项目更新持续维护**
