<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="小队管理"
    width="500px"
  >
    <el-scrollbar height="300px">
      <div v-if="teamStore.teams.length > 0" class="team-list">
        <div 
          v-for="team in teamStore.teams" 
          :key="team.id" 
          class="team-item"
        >
          <div class="team-info">
            <el-text>{{ team.name }}</el-text>
            <el-tag size="small" type="info">{{ team.characterIds.length }}人</el-tag>
          </div>
          <el-button 
            size="small" 
            type="danger"
            @click="handleDelete(team.id)"
          >
            删除
          </el-button>
        </div>
      </div>
      <el-empty v-else description="暂无小队" />
    </el-scrollbar>
    
    <div class="add-team-form">
      <el-input 
        v-model="newTeamName" 
        placeholder="新小队名称" 
        style="width: 200px;" 
      />
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTeamStore } from '@/stores'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'add', name: string): void
  (e: 'delete', id: string): void
}>()

const teamStore = useTeamStore()
const newTeamName = ref('')

const handleAdd = () => {
  if (newTeamName.value.trim()) {
    emit('add', newTeamName.value.trim())
    newTeamName.value = ''
  }
}

const handleDelete = (id: string) => {
  emit('delete', id)
}
</script>

<style scoped>
.team-list {
  margin-bottom: 20px;
}

.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.team-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-team-form {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}
</style>
