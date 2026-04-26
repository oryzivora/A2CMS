# A2CMS - 永恒之塔角色管理系统

> Aion2 Character Management System

[![Vue](https://img.shields.io/badge/Vue-3.4+-success.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1+-646CFF.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.5+-409EFF.svg)](https://element-plus.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 项目简介

A2CMS 是一个为《永恒之塔》(Aion2) 游戏玩家打造的多账号、多角色集中管理平台。

### 目标用户
- 多账号搬砖玩家
- 公会管理人员
- 资源规划者

## ✨ 核心功能

### 角色管理
- 卡片视图 / 表格视图 双模式切换
- 角色 CRUD 操作（新增、编辑、删除）
- 角色锁定功能，防止误删
- 能量跟踪（奥德能量系统，含基础能量+附加能量，上限840+2000）
- 副本计数（远征/超越，含最终首领统计）
- 5种任务完成状态跟踪（每日签到、深渊回廊、觉醒战、卢德莱、净化所）
- 自定义分组与颜色标签
- 装备评分、战斗力、基纳跟踪
- 圣域副本追踪（卢德莱/净化所，含挑战+奖励次数）

### 账号系统
- 多账号管理（支持CN/KR服务器）
- 账号维度数据共享
  - 每日副本（入场+补充次数）
  - 树古庆典（奖励钥匙+补充次数）
  - 噩梦挑战（挑战+补充次数）
  - 深渊指令书（完成状态）
  - 本地指令书（本周次数/上限）
  - 每日使命（今日次数/上限）
  - 商店奥德（完成次数）
  - 转换奥德（完成次数）
- 会员管理（到期提醒，中文日历）
- 一键清空账号数据

### 数据管理
- 本地存储（localStorage），保护隐私
- 数据导入/导出（JSON格式）
- 自动保存

### UI/UX
- 🌙 日间 / 🌙 夜间主题切换
- 响应式设计，支持移动端
- 统计面板（待办风格）
- 快速编辑弹窗

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| TypeScript | 5.3+ | 类型安全 |
| Vite | 5.1+ | 构建工具 |
| Vue Router | 4.2+ | 路由管理 |
| Pinia | 2.1+ | 状态管理 |
| Element Plus | 2.5+ | UI组件库 |

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📁 项目结构

```
A2CMS/
├── index.html              # HTML入口
├── package.json           # 依赖配置
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
├── .gitignore           # Git忽略配置
└── src/
    ├── main.ts          # 应用入口
    ├── App.vue          # 根组件
    ├── router/
    │   └── index.ts     # 路由配置
    ├── stores/
    │   └── index.ts     # Pinia状态管理
    ├── types/
    │   └── index.ts     # TypeScript类型定义
    ├── components/
    │   ├── AppHeader.vue      # 顶部导航栏
    │   ├── CharacterCard.vue  # 角色卡片组件
    │   ├── CharacterDialog.vue # 角色编辑弹窗
    │   ├── StatsPanel.vue     # 统计面板
    │   ├── AccountBar.vue    # 账号管理栏
    │   ├── FilterBar.vue     # 筛选栏
    │   ├── SortBar.vue       # 排序栏
    │   ├── GroupDialog.vue   # 分组管理弹窗
    │   ├── TeamDialog.vue    # 小队管理弹窗
    │   └── ThemeToggle.vue  # 主题切换
    ├── views/
    │   └── Characters.vue   # 角色管理主页
    ├── styles/
    │   └── variables.css   # CSS变量和主题
    └── dict/
        └── index.ts        # 静态数据字典
```

## 🎨 设计系统

项目采用 8px 网格设计系统，确保间距和布局的一致性。

### 间距
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-6`: 24px

### 字体
- 主字体：`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei'`

### 主题
支持日间和夜间模式，通过 CSS 变量实现无缝切换。

## 📄 许可证

本项目仅供学习交流使用。

## 👤 作者

**老登怎么办**

- B站：https://space.bilibili.com/2492373

---

*最后更新：2026-04-25*

---

## 📋 更新日志

### v0.3.0 (2026-04-25)
- 新增商店奥德/转换奥德账号维度追踪
- 统计面板新增商店奥德/转换奥德统计卡片
- 统计面板响应式布局优化
- 夜间模式CSS变量优化
- 服务器选择CN/KR独立控件
- localStorage键名更新为a2cms_v2