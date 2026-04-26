# A2CMS - AI Assistant Guidance

## 项目概述

A2CMS (Aion2 Character Management System) 是《永恒之塔》游戏的多账号、多角色管理平台。

## 技术栈
- Vue 3.4+ + TypeScript 5.3+
- Vite 5.1+ 构建
- Pinia 2.1+ 状态管理
- Element Plus 2.5+ UI 组件库

## 目录结构
```
src/
├── main.ts              # 应用入口
├── App.vue              # 根组件
├── router/index.ts      # 路由配置
├── stores/index.ts      # Pinia stores (accounts, characters, groups, teams, ui, backup)
├── types/index.ts       # TypeScript 类型定义
├── components/         # Vue 组件
├── views/Characters.vue # 角色管理主页
├── styles/variables.css # CSS 变量和主题
└── dict/index.ts        # 静态数据字典
```

## 数据存储
- localStorage，键名 `a2cms_v2_*`
- 自动保存（deep watch）

## 关键类型
- `Character` - 角色，包含能量、副本计数、任务状态
- `Account` - 账号，包含账号维度数据（每日副本、噩梦、商店奥德等）
- `Group` - 分组
- `Team` - 小队
- `UISettings` - UI 设置

## 定时任务系统
- On-Open Delta Calculation（打开应用时按需计算）
- 能量恢复：每3小时（会员+15，非会员+10）
- 每日重置：5:00 和 17:00（国服）
- 每周重置：周三 5:00（深渊指令、圣域、商店/转换奥德等）

## 开发规范
- 使用 `<script setup>` + Composition API
- 优先使用 Element Plus 组件
- 使用 CSS 变量管理主题
- 遵循 8px 网格设计系统

## 代码提交
- 使用 conventional commits 格式
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式调整
- refactor: 重构
