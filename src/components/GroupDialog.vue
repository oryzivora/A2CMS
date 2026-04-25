<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="分组管理"
    width="500px"
  >
    <el-scrollbar height="300px">
      <div class="group-list">
        <div 
          v-for="group in groupStore.groups" 
          :key="group.id" 
          class="group-item"
        >
          <div class="group-info">
            <el-tag :color="group.color" effect="dark">{{ group.name }}</el-tag>
          </div>
          <el-button 
            v-if="group.id !== 'default'"
            size="small" 
            type="danger"
            @click="handleDelete(group.id)"
          >
            删除
          </el-button>
        </div>
      </div>
    </el-scrollbar>
    
    <div class="add-group-form">
      <el-input 
        v-model="newGroupName" 
        placeholder="新分组名称" 
        style="width: 200px;" 
      />
      <el-color-picker v-if="false" v-model="newGroupColor" />
      <div class="color-picker">
        <span
          v-for="color in basicColors"
          :key="color"
          class="color-option"
          :class="{ 'is-selected': newGroupColor === color }"
          :style="{ backgroundColor: color }"
          @click="newGroupColor = color"
        />
      </div>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useGroupStore } from '@/stores'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'add', name: string, color: string): void
  (e: 'delete', id: string): void
}>()

const groupStore = useGroupStore()
const newGroupName = ref('')
const newGroupColor = ref('#409EFF')

// 基础颜色选项
const basicColors = [
  '#409EFF', // 蓝色
  '#67C23A', // 绿色
  '#E6A23C', // 黄色
  '#F56C6C', // 红色
  '#909399', // 灰色
  '#B37FEB', // 紫色
  '#36D7B7', // 青色
  '#FF9F43', // 橙色
]

const handleAdd = () => {
  if (newGroupName.value.trim()) {
    emit('add', newGroupName.value.trim(), newGroupColor.value)
    newGroupName.value = ''
  }
}

const handleDelete = (id: string) => {
  emit('delete', id)
}
</script>

<style scoped>
.group-list {
  margin-bottom: 20px;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.group-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-info :deep(.el-tag) {
  color: #fff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.add-group-form {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.color-picker {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.is-selected {
  border-color: var(--el-text-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-white);
}
</style>
