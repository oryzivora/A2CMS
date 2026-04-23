<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="isEdit ? '编辑角色' : '新增角色'"
    width="500px"
    @closed="handleClosed"
  >
    <el-form :model="form" label-width="80px" class="character-form">
      <el-form-item label="角色名称" required>
        <el-input v-model="form.name" placeholder="请输入角色名称" />
      </el-form-item>
      
      <el-form-item label="种族" required>
        <el-radio-group v-model="form.race" @change="handleRaceChange">
          <el-radio value="天族">天族</el-radio>
          <el-radio value="魔族">魔族</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="大区" required>
        <el-select v-model="form.server" placeholder="请先选择种族" style="width: 100%">
          <el-option
            v-for="server in currentServers"
            :key="server.value"
            :label="server.label"
            :value="server.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="职业" required>
        <el-select v-model="form.role" placeholder="请选择职业" style="width: 100%">
          <el-option
            v-for="role in roleList"
            :key="role"
            :label="role"
            :value="role"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="账号" required>
        <el-select v-model="form.accountId" placeholder="请选择账号" style="width: 100%">
          <el-option
            v-for="account in accountStore.accounts"
            :key="account.id"
            :label="account.name"
            :value="account.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="分组">
        <el-select v-model="form.groupId" placeholder="请选择分组" style="width: 100%">
          <el-option
            v-for="group in groupStore.groups"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          >
            <span :style="{ color: group.color }">●</span> {{ group.name }}
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="基础能量">
        <el-input-number v-model="form.energy" :min="0" :max="form.maxEnergy" />
        <span class="energy-unit">/ {{ form.maxEnergy }}</span>
      </el-form-item>
      
      <el-form-item label="附加能量">
        <el-input-number v-model="form.extraEnergy" :min="0" :max="form.maxExtraEnergy" />
        <span class="energy-unit">/ {{ form.maxExtraEnergy }}</span>
      </el-form-item>
      
      <el-form-item label="基纳(万)">
        <el-input-number v-model="form.kina" :min="0" />
      </el-form-item>
      
      <el-form-item label="装备评分">
        <el-input-number v-model="form.score" :min="0" />
      </el-form-item>
      
      <el-form-item label="战斗力">
        <el-input-number v-model="form.combatPower" :min="0" />
      </el-form-item>
      
      <!-- 远征 -->
      <el-divider>远征副本次数</el-divider>
      <el-form-item label="远征当前">
        <el-input-number v-model="form.runs" :min="0" :max="form.maxRuns" controls-position="right" />
        <span class="energy-unit"> / {{ form.maxRuns }}</span>
      </el-form-item>
      <el-form-item label="远征补充">
        <el-input-number v-model="form.extraRuns" :min="0" :max="10" controls-position="right" />
        <span class="energy-unit"> / 10</span>
      </el-form-item>
      <el-form-item label="远征最终">
        <el-input-number v-model="form.finalRuns" :min="0" :max="form.maxFinalRuns" controls-position="right" />
        <span class="energy-unit"> / {{ form.maxFinalRuns }}</span>
      </el-form-item>
      
      <!-- 超越 -->
      <el-divider>超越副本次数</el-divider>
      <el-form-item label="超越当前">
        <el-input-number v-model="form.transcendRuns" :min="0" :max="form.maxTranscendRuns" controls-position="right" />
        <span class="energy-unit"> / {{ form.maxTranscendRuns }}</span>
      </el-form-item>
      <el-form-item label="超越补充">
        <el-input-number v-model="form.extraTranscendRuns" :min="0" :max="10" controls-position="right" />
        <span class="energy-unit"> / 10</span>
      </el-form-item>
      <el-form-item label="超越最终">
        <el-input-number v-model="form.transcendFinalRuns" :min="0" :max="form.maxTranscendFinalRuns" controls-position="right" />
        <span class="energy-unit"> / {{ form.maxTranscendFinalRuns }}</span>
      </el-form-item>
      
      <!-- 圣域-卢德莱 -->
      <el-divider>深渊重铸:卢德莱</el-divider>
      <el-form-item label="挑战次数">
        <el-input-number v-model="form.ludrelleRuns" :min="0" :max="4" controls-position="right" />
        <span class="energy-unit"> / 4</span>
      </el-form-item>
      <el-form-item label="补充次数">
        <el-input-number v-model="form.ludrelleExtra" :min="0" :max="10" controls-position="right" />
        <span class="energy-unit"> / 10</span>
      </el-form-item>
      <el-form-item label="奖励次数">
        <el-input-number v-model="form.ludrelleRewardRuns" :min="0" :max="2" controls-position="right" />
        <span class="energy-unit"> / 2</span>
      </el-form-item>
      <el-form-item label="补充次数">
        <el-input-number v-model="form.ludrelleRewardExtra" :min="0" :max="10" controls-position="right" />
        <span class="energy-unit"> / 10</span>
      </el-form-item>
      
      <!-- 圣域-净化所 -->
      <el-divider>侵蚀净化所</el-divider>
      <el-form-item label="挑战次数">
        <el-input-number v-model="form.purifyRuns" :min="0" :max="4" controls-position="right" />
        <span class="energy-unit"> / 4</span>
      </el-form-item>
      <el-form-item label="补充次数">
        <el-input-number v-model="form.purifyExtra" :min="0" :max="10" controls-position="right" />
        <span class="energy-unit"> / 10</span>
      </el-form-item>
      <el-form-item label="奖励次数">
        <el-input-number v-model="form.purifyRewardRuns" :min="0" :max="2" controls-position="right" />
        <span class="energy-unit"> / 2</span>
      </el-form-item>
      <el-form-item label="补充次数">
        <el-input-number v-model="form.purifyRewardExtra" :min="0" :max="10" controls-position="right" />
        <span class="energy-unit"> / 10</span>
      </el-form-item>
      
      <el-form-item label="备注">
        <el-input
          v-model="form.notes"
          type="textarea"
          :rows="3"
          placeholder="添加备注..."
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ isEdit ? '保存' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useGroupStore, useAccountStore } from '@/stores'
import { roleList, raceList, raceServers } from '@/dict'
import type { Character, Race } from '@/types'

const props = defineProps<{
  modelValue: boolean
  character?: Character | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Partial<Character>): void
}>()

const groupStore = useGroupStore()
const accountStore = useAccountStore()

const isEdit = computed(() => !!props.character)

// 默认表单数据
const defaultForm = {
  name: '',
  role: '剑星',
  race: '天族' as Race,
  server: 'xx1',
  accountId: 'acc_1',
  groupId: 'default',
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
  notes: '',
}

const form = ref({ ...defaultForm })

// 根据种族获取大区列表
const currentServers = computed(() => {
  return raceServers[form.value.race] || []
})

// 种族变更时重置大区
const handleRaceChange = () => {
  const servers = raceServers[form.value.race]
  if (servers && servers.length > 0) {
    form.value.server = servers[0].value
  }
}

const resetForm = () => {
  form.value = { ...defaultForm }
  // 设置默认大区
  const servers = raceServers[form.value.race]
  if (servers && servers.length > 0) {
    form.value.server = servers[0].value
  }
}

watch(() => props.character, (char) => {
  if (char) {
    form.value = {
      name: char.name,
      role: char.role,
      race: char.race,
      server: char.server,
      accountId: char.accountId || 'acc_1',
      groupId: char.groupId,
      energy: char.energy,
      maxEnergy: char.maxEnergy,
      extraEnergy: char.extraEnergy || 0,
      maxExtraEnergy: char.maxExtraEnergy || 2000,
      kina: char.kina,
      score: char.score,
      combatPower: char.combatPower || 0,
      runs: char.runs || 0,
      maxRuns: char.maxRuns || 14,
      extraRuns: char.extraRuns || 10,
      finalRuns: char.finalRuns || 0,
      maxFinalRuns: char.maxFinalRuns || 35,
      transcendRuns: char.transcendRuns || 0,
      maxTranscendRuns: char.maxTranscendRuns || 7,
      extraTranscendRuns: char.extraTranscendRuns || 10,
      transcendFinalRuns: char.transcendFinalRuns || 0,
      maxTranscendFinalRuns: char.maxTranscendFinalRuns || 28,
      // 圣域-卢德莱
      ludrelleRuns: char.ludrelleRuns || 4,
      ludrelleExtra: char.ludrelleExtra || 1,
      ludrelleRewardRuns: char.ludrelleRewardRuns || 2,
      ludrelleRewardExtra: char.ludrelleRewardExtra || 1,
      // 圣域-净化所
      purifyRuns: char.purifyRuns || 4,
      purifyExtra: char.purifyExtra || 1,
      purifyRewardRuns: char.purifyRewardRuns || 2,
      purifyRewardExtra: char.purifyRewardExtra || 1,
      notes: char.notes,
    }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (val) => {
  if (!val) {
    resetForm()
  }
})

const handleSubmit = () => {
  if (!form.value.name.trim()) {
    ElMessage.warning('请输入角色名称')
    return
  }
  if (!form.value.accountId) {
    ElMessage.warning('请选择账号')
    return
  }
  emit('submit', { ...form.value })
  emit('update:modelValue', false)
}

const handleClosed = () => {
  resetForm()
}
</script>

<style scoped>
.character-form {
  padding: 10px 0;
}

.energy-unit {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}
</style>
