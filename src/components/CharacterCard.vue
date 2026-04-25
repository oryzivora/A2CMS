<template>
  <el-card 
    class="character-card" 
    :style="{ '--group-color': groupColor }"
    shadow="hover"
  >
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <div class="header-row-1">
            <span class="char-name">{{ character.name }}</span>

            <!-- 分组和小队标签 -->
            <div class="char-tags">
              <el-tag :color="groupColor" effect="dark" size="small">
                {{ groupName }}
              </el-tag>
              <el-tag v-if="teamName" effect="dark" size="small" type="warning">
                {{ teamName }}
              </el-tag>
            </div>

            <el-tag size="small" type="info">{{ character.role }}</el-tag>

            <el-tag
              size="small"
              :type="character.race === '天族' ? 'primary' : 'danger'"
            >
              {{ character.race }}
            </el-tag>

            <el-tag size="small" type="success">
              {{ character.server }}
            </el-tag>
          </div>

          <div class="header-row-2">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit"
            >
              编辑
            </el-button>

            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete"
            >
              删除
            </el-button>

            <el-tooltip content="开发中..." placement="top">
              <el-button
                type="info"
                size="small"
                link
                disabled
              >
                拉取
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 装备评分+战斗力容器 -->
    <div class="top-stats-container">
      <!-- 装备评分 -->
      <div class="score-section" @dblclick="openScoreEditDialog">
        <div class="stat-cell-box">
          <span class="stat-label">装备评分</span>
          <span class="stat-value">{{ character.score }}</span>
        </div>
      </div>

      <!-- 战斗力 -->
      <div class="combat-power-section" @dblclick="openCombatPowerEditDialog">
        <div class="stat-cell-box">
          <span class="stat-label">战斗力</span>
          <span class="stat-value">{{ character.combatPower || 0 }}</span>
        </div>
      </div>
    </div>
    
    <!-- 能量进度 -->
    <div class="energy-section" @dblclick="openEnergyEditDialog" title="双击进入编辑">
      <div class="energy-header">
        <span class="energy-label">奥德能量
          <el-tooltip content="编辑能量" placement="top">
            <el-button type="primary" link :icon="Edit" size="small" @click.stop="openEnergyEditDialog" />
          </el-tooltip>
        </span>
        <span class="energy-value">
          {{ character.energy }} / {{ character.maxEnergy }}+{{ character.extraEnergy }}
        </span>
      </div>
      <el-progress 
        :percentage="energyPercentage" 
        :color="energyColor"
        :stroke-width="8"
      />
      <div class="energy-details">
        <span class="energy-part">基础: {{ character.energy }}/{{ character.maxEnergy }}</span>
        <span class="energy-part">补充: {{ character.extraEnergy }}/{{ character.maxExtraEnergy }}</span>
      </div>
      <div class="energy-controls">
        <el-button-group>
          <el-button size="small" @click="adjustEnergy(-40)">-40</el-button>
          <el-button size="small" @click="adjustEnergy(-80)">-80</el-button>
          <el-button size="small" @click="adjustExtraEnergy(10)">+10</el-button>
          <el-button size="small" @click="adjustExtraEnergy(40)">+40</el-button>
        </el-button-group>
      </div>
    </div>
    
    <!-- 基纳模块 -->
    <div class="kina-section" @dblclick="openKinaEditDialog">
      <span class="stat-label">基纳(万)</span>
      <span class="stat-value gold">{{ character.kina }}</span>
    </div>
    
    <!-- 远征+超越模块 -->
    <div class="runs-container">
      <!-- 远征模块 -->
      <div class="runs-section" @dblclick="openRunsEditDialog">
        <div class="runs-header">远征</div>
        <div class="runs-row">
          <span class="runs-current">{{ character.runs }}</span>
          <span class="runs-plus">(+{{ character.extraRuns }})</span>
          <span class="runs-sep">/</span>
          <span class="runs-max">{{ character.maxRuns }}</span>
        </div>
        <div class="runs-final">
          最终首领: {{ character.finalRuns }}<span class="runs-plus">(+{{ character.extraFinalRuns }})</span>/{{ character.maxFinalRuns }}
        </div>
      </div>

      <!-- 超越模块 -->
      <div class="runs-section transcend" @dblclick="openTranscendEditDialog">
        <div class="runs-header">超越</div>
        <div class="runs-row">
          <span class="runs-current">{{ character.transcendRuns }}</span>
          <span class="runs-plus">(+{{ character.extraTranscendRuns }})</span>
          <span class="runs-sep">/</span>
          <span class="runs-max">{{ character.maxTranscendRuns }}</span>
        </div>
        <div class="runs-final">
          最终首领: {{ character.transcendFinalRuns }}<span class="runs-plus">(+{{ character.extraTranscendFinalRuns }})</span>/{{ character.maxTranscendFinalRuns }}
        </div>
      </div>
    </div>
    
    <!-- 圣域副本模块 -->
    <div class="sanctuary-container">
      <!-- 卢德莱 -->
      <div class="sanctuary-section" @dblclick="openLudrelleEditDialog">
        <div class="sanctuary-header">深渊重铸:卢德莱</div>
        <div class="sanctuary-row">
          <span class="sanctuary-label">挑战:</span>
          <span class="sanctuary-current">{{ character.ludrelleRuns }}</span>
          <span class="sanctuary-plus">(+{{ character.ludrelleExtra }})</span>
          <span class="sanctuary-sep">/</span>
          <span class="sanctuary-fixed">4</span>
        </div>
        <div class="sanctuary-row">
          <span class="sanctuary-label">奖励:</span>
          <span class="sanctuary-current">{{ character.ludrelleRewardRuns }}</span>
          <span class="sanctuary-plus">(+{{ character.ludrelleRewardExtra }})</span>
          <span class="sanctuary-sep">/</span>
          <span class="sanctuary-fixed">2</span>
        </div>
      </div>

      <!-- 净化所 -->
      <div class="sanctuary-section" @dblclick="openPurifyEditDialog">
        <div class="sanctuary-header">侵蚀净化所</div>
        <div class="sanctuary-row">
          <span class="sanctuary-label">挑战:</span>
          <span class="sanctuary-current">{{ character.purifyRuns }}</span>
          <span class="sanctuary-plus">(+{{ character.purifyExtra }})</span>
          <span class="sanctuary-sep">/</span>
          <span class="sanctuary-fixed">4</span>
        </div>
        <div class="sanctuary-row">
          <span class="sanctuary-label">奖励:</span>
          <span class="sanctuary-current">{{ character.purifyRewardRuns }}</span>
          <span class="sanctuary-plus">(+{{ character.purifyRewardExtra }})</span>
          <span class="sanctuary-sep">/</span>
          <span class="sanctuary-fixed">2</span>
        </div>
      </div>
    </div>

    <!-- 噩梦挑战模块 -->
    <div class="runs-container">
      <div class="runs-section nightmare" @dblclick="openNightmareEditDialog">
        <div class="runs-header">噩梦挑战</div>
        <div class="runs-row">
          <span class="runs-current">{{ character.nightmareRuns }}</span>
          <span class="runs-plus">(+{{ character.nightmareExtra }})</span>
          <span class="runs-sep">/</span>
          <span class="runs-max">14</span>
        </div>
      </div>
    </div>
    
    <!-- 任务状态 -->
    <div v-if="showTasks" class="task-section">
      <div class="task-header">
        <span class="task-label">任务</span>
        <el-button
          size="small"
          type="primary"
          link
          @click="showAllTasks = !showAllTasks"
        >
          {{ showAllTasks ? '收起' : '展开' }}
        </el-button>
      </div>
      <div class="task-buttons">
        <el-tag
          v-for="task in displayTasks"
          :key="task.key"
          :type="character.tasks[task.key] ? 'success' : 'info'"
          class="task-tag"
          @click="handleToggleTask(task.key)"
        >
          <el-icon v-if="character.tasks[task.key]" class="task-icon"><CircleCheck /></el-icon>
          <el-icon v-else class="task-icon"><CircleClose /></el-icon>
          {{ task.label }}
        </el-tag>
      </div>
    </div>
    
    <!-- 备注 -->
    <div class="notes-section" @dblclick="openNotesEditDialog">
      <el-text type="info">{{ character.notes || '双击编辑备注' }}</el-text>
    </div>

    <!-- 能量编辑弹窗 -->
    <el-dialog
      v-model="showEnergyEditDialog"
      title="编辑奥德能量"
      width="320px"
      @click.stop
    >
      <el-form label-width="80px">
        <el-form-item label="基础能量">
          <el-input-number
            v-model="editEnergyForm.energy"
            :min="0"
            :max="props.character.maxEnergy"
            controls-position="right"
          />
          <span class="form-unit"> / {{ props.character.maxEnergy }}</span>
        </el-form-item>
        <el-form-item label="补充能量">
          <el-input-number
            v-model="editEnergyForm.extraEnergy"
            :min="0"
            :max="props.character.maxExtraEnergy"
            controls-position="right"
          />
          <span class="form-unit"> / {{ props.character.maxExtraEnergy }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEnergyEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmEnergyEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 装备评分编辑弹窗 -->
    <el-dialog v-model="showScoreEditDialog" title="编辑装备评分" width="280px" @click.stop>
      <el-form-item>
        <el-input-number v-model="editScoreForm.score" :min="0" controls-position="right" />
      </el-form-item>
      <template #footer>
        <el-button @click="showScoreEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmScoreEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 战斗力编辑弹窗 -->
    <el-dialog v-model="showCombatPowerEditDialog" title="编辑战斗力" width="280px" @click.stop>
      <el-form-item>
        <el-input-number v-model="editCombatPowerForm.combatPower" :min="0" controls-position="right" />
      </el-form-item>
      <template #footer>
        <el-button @click="showCombatPowerEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCombatPowerEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 基纳编辑弹窗 -->
    <el-dialog v-model="showKinaEditDialog" title="编辑基纳" width="280px" @click.stop>
      <el-form-item>
        <el-input-number v-model="editKinaForm.kina" :min="0" controls-position="right" />
      </el-form-item>
      <template #footer>
        <el-button @click="showKinaEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmKinaEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 远征编辑弹窗 -->
    <el-dialog v-model="showRunsEditDialog" title="编辑远征" width="320px" @click.stop>
      <el-form label-width="100px">
        <el-form-item label="奖励次数">
          <el-input-number v-model="editRunsForm.runs" :min="0" :max="props.character.maxRuns" controls-position="right" />
          <span class="form-unit"> / {{ props.character.maxRuns }}</span>
        </el-form-item>
        <el-form-item label="补充次数">
          <el-input-number v-model="editRunsForm.extraRuns" :min="0" :max="10" controls-position="right" />
          <span class="form-unit"> / 10</span>
        </el-form-item>
        <el-form-item label="最终消灭">
          <el-input-number v-model="editRunsForm.finalRuns" :min="0" :max="props.character.maxFinalRuns" controls-position="right" />
          <span class="form-unit"> / {{ props.character.maxFinalRuns }}</span>
        </el-form-item>
        <el-form-item label="最终补充">
          <el-input-number v-model="editRunsForm.extraFinalRuns" :min="0" :max="10" controls-position="right" />
          <span class="form-unit"> / 10</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRunsEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmRunsEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 超越编辑弹窗 -->
    <el-dialog v-model="showTranscendEditDialog" title="编辑超越" width="320px" @click.stop>
      <el-form label-width="100px">
        <el-form-item label="奖励次数">
          <el-input-number v-model="editTranscendForm.transcendRuns" :min="0" :max="7" controls-position="right" />
          <span class="form-unit"> / 7</span>
        </el-form-item>
        <el-form-item label="补充次数">
          <el-input-number v-model="editTranscendForm.extraTranscendRuns" :min="0" :max="10" controls-position="right" />
          <span class="form-unit"> / 10</span>
        </el-form-item>
        <el-form-item label="最终消灭">
          <el-input-number v-model="editTranscendForm.transcendFinalRuns" :min="0" :max="28" controls-position="right" />
          <span class="form-unit"> / 28</span>
        </el-form-item>
        <el-form-item label="最终补充">
          <el-input-number v-model="editTranscendForm.extraTranscendFinalRuns" :min="0" :max="10" controls-position="right" />
          <span class="form-unit"> / 10</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTranscendEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmTranscendEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 卢德莱编辑弹窗 -->
    <el-dialog v-model="showLudrelleEditDialog" title="编辑卢德莱" width="320px" @click.stop>
      <el-form label-width="100px">
        <el-form-item label="挑战当前">
          <el-input-number v-model="editLudrelleForm.ludrelleRuns" :min="0" :max="4" controls-position="right" />
        </el-form-item>
        <el-form-item label="挑战补充">
          <el-input-number v-model="editLudrelleForm.ludrelleExtra" :min="0" :max="10" controls-position="right" />
        </el-form-item>
        <el-form-item label="奖励当前">
          <el-input-number v-model="editLudrelleForm.ludrelleRewardRuns" :min="0" :max="2" controls-position="right" />
        </el-form-item>
        <el-form-item label="奖励补充">
          <el-input-number v-model="editLudrelleForm.ludrelleRewardExtra" :min="0" :max="10" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLudrelleEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmLudrelleEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 净化所编辑弹窗 -->
    <el-dialog v-model="showPurifyEditDialog" title="编辑净化所" width="320px" @click.stop>
      <el-form label-width="100px">
        <el-form-item label="挑战当前">
          <el-input-number v-model="editPurifyForm.purifyRuns" :min="0" :max="4" controls-position="right" />
        </el-form-item>
        <el-form-item label="挑战补充">
          <el-input-number v-model="editPurifyForm.purifyExtra" :min="0" :max="10" controls-position="right" />
        </el-form-item>
        <el-form-item label="奖励当前">
          <el-input-number v-model="editPurifyForm.purifyRewardRuns" :min="0" :max="2" controls-position="right" />
        </el-form-item>
        <el-form-item label="奖励补充">
          <el-input-number v-model="editPurifyForm.purifyRewardExtra" :min="0" :max="10" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPurifyEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmPurifyEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 噩梦挑战编辑弹窗 -->
    <el-dialog v-model="showNightmareEditDialog" title="编辑噩梦挑战" width="320px" @click.stop>
      <el-form label-width="100px">
        <el-form-item label="挑战当前">
          <el-input-number v-model="editNightmareForm.nightmareRuns" :min="0" :max="14" controls-position="right" />
          <span class="form-unit"> / 14</span>
        </el-form-item>
        <el-form-item label="补充次数">
          <el-input-number v-model="editNightmareForm.nightmareExtra" :min="0" :max="30" controls-position="right" />
          <span class="form-unit"> / 30</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNightmareEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmNightmareEdit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 备注编辑弹窗 -->
    <el-dialog v-model="showNotesEditDialog" title="编辑备注" width="320px" @click.stop>
      <div class="notes-edit-content">
        <el-input v-model="editNotesForm.notes" type="textarea" :rows="3" placeholder="请输入备注" />
      </div>
      <template #footer>
        <el-button @click="showNotesEditDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmNotesEdit">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { useCharacterStore, useGroupStore, useTeamStore, useUIStore } from '@/stores'
import { taskList } from '@/dict'
import type { Character, TaskStatus } from '@/types'

interface Props {
  character: Character
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', character: Character): void
}>()

const characterStore = useCharacterStore()
const groupStore = useGroupStore()
const teamStore = useTeamStore()
const uiStore = useUIStore()

const showAllTasks = ref(true)
const showEnergyEditDialog = ref(false)
const showScoreEditDialog = ref(false)
const showCombatPowerEditDialog = ref(false)
const showKinaEditDialog = ref(false)
const showRunsEditDialog = ref(false)
const showTranscendEditDialog = ref(false)
const showLudrelleEditDialog = ref(false)
const showPurifyEditDialog = ref(false)
const showNightmareEditDialog = ref(false)
const showNotesEditDialog = ref(false)

const editEnergyForm = ref({
  energy: 0,
  extraEnergy: 0
})

const editScoreForm = ref({
  score: 0
})

const editCombatPowerForm = ref({
  combatPower: 0
})

const editKinaForm = ref({
  kina: 0
})

const editRunsForm = ref({
  runs: 0,
  extraRuns: 0,
  finalRuns: 0,
  extraFinalRuns: 0
})

const editTranscendForm = ref({
  transcendRuns: 0,
  extraTranscendRuns: 0,
  transcendFinalRuns: 0,
  extraTranscendFinalRuns: 0
})

const editLudrelleForm = ref({
  ludrelleRuns: 0,
  ludrelleExtra: 0,
  ludrelleRewardRuns: 0,
  ludrelleRewardExtra: 0
})

const editPurifyForm = ref({
  purifyRuns: 0,
  purifyExtra: 0,
  purifyRewardRuns: 0,
  purifyRewardExtra: 0
})

const editNightmareForm = ref({
  nightmareRuns: 0,
  nightmareExtra: 0
})

const editNotesForm = ref({
  notes: ''
})

const displayTasks = computed(() => {
  // 过滤掉卢德莱和净化所（它们在卡片中有独立模块）
  const filteredTasks = taskList.filter((t: any) => t.key !== 'ludrelle' && t.key !== 'purify')
  return showAllTasks.value ? filteredTasks : filteredTasks.slice(0, 0)
})

const showTasks = computed(() => uiStore.settings.showTasks)

const groupColor = computed(() => groupStore.getGroupColor(props.character.groupId))

const groupName = computed(() => groupStore.getGroupName(props.character.groupId))

const teamName = computed(() => {
  if (!props.character.teamId) return ''
  const team = teamStore.teams.find(t => t.id === props.character.teamId)
  return team?.name || ''
})

// 基础能量百分比（进度条用）
const energyPercentage = computed(() => {
  return Math.min(100, Math.round((props.character.energy / props.character.maxEnergy) * 100))
})

// 总能量
const totalEnergy = computed(() => props.character.energy + props.character.extraEnergy)
const totalMaxEnergy = computed(() => props.character.maxEnergy + props.character.maxExtraEnergy)

const energyColor = computed(() => {
  const pct = energyPercentage.value
  if (pct >= 70) return '#67c23a'
  if (pct >= 30) return '#e6a23c'
  return '#f56c6c'
})

const handleEdit = () => {
  emit('edit', props.character)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该角色吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    characterStore.deleteCharacter(props.character.id)
    ElMessage.success('角色已删除')
  }).catch(() => {
    // 取消删除
  })
}

const handleRunsChange = (delta: number) => {
  const newRuns = Math.max(0, props.character.runs + delta)
  characterStore.updateCharacter(props.character.id, { runs: newRuns })
}

const handleTranscendChange = (delta: number) => {
  const newRuns = Math.max(0, props.character.transcendRuns + delta)
  characterStore.updateCharacter(props.character.id, { transcendRuns: newRuns })
}

const handleToggleTask = (taskKey: keyof TaskStatus) => {
  // 点击卢德莱时：切换状态 + 清空所有次数
  if (taskKey === 'ludrelle') {
    characterStore.toggleTask(props.character.id, taskKey)
    characterStore.updateCharacter(props.character.id, {
      ludrelleRuns: 0,
      ludrelleExtra: 0,
      ludrelleRewardRuns: 0,
      ludrelleRewardExtra: 0
    })
    return
  }
  // 点击净化所时：切换状态 + 清空所有次数
  if (taskKey === 'purify') {
    characterStore.toggleTask(props.character.id, taskKey)
    characterStore.updateCharacter(props.character.id, {
      purifyRuns: 0,
      purifyExtra: 0,
      purifyRewardRuns: 0,
      purifyRewardExtra: 0
    })
    return
  }
  characterStore.toggleTask(props.character.id, taskKey)
}

// 减少能量：优先减少基础能量，其次减少附加能量
const adjustEnergy = (delta: number) => {
  if (delta >= 0) return // 只处理减少
  
  const absDelta = Math.abs(delta)
  let remaining = absDelta
  let newBase = props.character.energy
  let newExtra = props.character.extraEnergy
  
  // 先从基础能量减少
  if (remaining > 0) {
    const reduceFromBase = Math.min(newBase, remaining)
    newBase -= reduceFromBase
    remaining -= reduceFromBase
  }
  
  // 再从附加能量减少
  if (remaining > 0) {
    const reduceFromExtra = Math.min(newExtra, remaining)
    newExtra -= reduceFromExtra
    remaining -= reduceFromExtra
  }
  
  characterStore.updateCharacter(props.character.id, { 
    energy: newBase,
    extraEnergy: newExtra
  })
}

// 增加附加能量（基础能量不能手动增加）
const adjustExtraEnergy = (delta: number) => {
  if (delta <= 0) return // 只处理增加
  const newExtra = Math.min(
    props.character.maxExtraEnergy,
    props.character.extraEnergy + delta
  )
  characterStore.updateCharacter(props.character.id, { extraEnergy: newExtra })
}

// 附加能量设为满
const setExtraFull = () => {
  characterStore.updateCharacter(props.character.id, { extraEnergy: props.character.maxExtraEnergy })
}

// 打开能量编辑弹窗
const openEnergyEditDialog = () => {
  editEnergyForm.value = {
    energy: props.character.energy,
    extraEnergy: props.character.extraEnergy
  }
  showEnergyEditDialog.value = true
}

// 确认能量编辑
const confirmEnergyEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    energy: Math.max(0, Math.min(props.character.maxEnergy, editEnergyForm.value.energy)),
    extraEnergy: Math.max(0, Math.min(props.character.maxExtraEnergy, editEnergyForm.value.extraEnergy))
  })
  showEnergyEditDialog.value = false
  ElMessage.success('能量已更新')
}

// 打开装备评分编辑弹窗
const openScoreEditDialog = () => {
  editScoreForm.value = {
    score: props.character.score
  }
  showScoreEditDialog.value = true
}

// 确认装备评分编辑
const confirmScoreEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    score: editScoreForm.value.score
  })
  showScoreEditDialog.value = false
  ElMessage.success('装备评分已更新')
}

// 打开战斗力编辑弹窗
const openCombatPowerEditDialog = () => {
  editCombatPowerForm.value = {
    combatPower: props.character.combatPower || 0
  }
  showCombatPowerEditDialog.value = true
}

// 确认战斗力编辑
const confirmCombatPowerEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    combatPower: editCombatPowerForm.value.combatPower
  })
  showCombatPowerEditDialog.value = false
  ElMessage.success('战斗力已更新')
}

// 打开基纳编辑弹窗
const openKinaEditDialog = () => {
  editKinaForm.value = {
    kina: props.character.kina
  }
  showKinaEditDialog.value = true
}

// 确认基纳编辑
const confirmKinaEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    kina: editKinaForm.value.kina
  })
  showKinaEditDialog.value = false
  ElMessage.success('基纳已更新')
}

// 打开远征编辑弹窗
const openRunsEditDialog = () => {
  editRunsForm.value = {
    runs: props.character.runs,
    extraRuns: props.character.extraRuns,
    finalRuns: props.character.finalRuns,
    extraFinalRuns: props.character.extraFinalRuns
  }
  showRunsEditDialog.value = true
}

// 确认远征编辑
const confirmRunsEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    runs: editRunsForm.value.runs,
    extraRuns: editRunsForm.value.extraRuns,
    finalRuns: editRunsForm.value.finalRuns,
    extraFinalRuns: editRunsForm.value.extraFinalRuns
  })
  showRunsEditDialog.value = false
  ElMessage.success('远征已更新')
}

// 打开超越编辑弹窗
const openTranscendEditDialog = () => {
  editTranscendForm.value = {
    transcendRuns: props.character.transcendRuns,
    extraTranscendRuns: props.character.extraTranscendRuns,
    transcendFinalRuns: props.character.transcendFinalRuns,
    extraTranscendFinalRuns: props.character.extraTranscendFinalRuns
  }
  showTranscendEditDialog.value = true
}

// 确认超越编辑
const confirmTranscendEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    transcendRuns: editTranscendForm.value.transcendRuns,
    extraTranscendRuns: editTranscendForm.value.extraTranscendRuns,
    transcendFinalRuns: editTranscendForm.value.transcendFinalRuns,
    extraTranscendFinalRuns: editTranscendForm.value.extraTranscendFinalRuns
  })
  showTranscendEditDialog.value = false
  ElMessage.success('超越已更新')
}

// 打开卢德莱编辑弹窗
const openLudrelleEditDialog = () => {
  editLudrelleForm.value = {
    ludrelleRuns: props.character.ludrelleRuns,
    ludrelleExtra: props.character.ludrelleExtra,
    ludrelleRewardRuns: props.character.ludrelleRewardRuns,
    ludrelleRewardExtra: props.character.ludrelleRewardExtra
  }
  showLudrelleEditDialog.value = true
}

// 确认卢德莱编辑
const confirmLudrelleEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    ludrelleRuns: editLudrelleForm.value.ludrelleRuns,
    ludrelleExtra: editLudrelleForm.value.ludrelleExtra,
    ludrelleRewardRuns: editLudrelleForm.value.ludrelleRewardRuns,
    ludrelleRewardExtra: editLudrelleForm.value.ludrelleRewardExtra
  })
  showLudrelleEditDialog.value = false
  ElMessage.success('卢德莱已更新')
}

// 打开净化所编辑弹窗
const openPurifyEditDialog = () => {
  editPurifyForm.value = {
    purifyRuns: props.character.purifyRuns,
    purifyExtra: props.character.purifyExtra,
    purifyRewardRuns: props.character.purifyRewardRuns,
    purifyRewardExtra: props.character.purifyRewardExtra
  }
  showPurifyEditDialog.value = true
}

// 确认净化所编辑
const confirmPurifyEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    purifyRuns: editPurifyForm.value.purifyRuns,
    purifyExtra: editPurifyForm.value.purifyExtra,
    purifyRewardRuns: editPurifyForm.value.purifyRewardRuns,
    purifyRewardExtra: editPurifyForm.value.purifyRewardExtra
  })
  showPurifyEditDialog.value = false
  ElMessage.success('净化所已更新')
}

// 打开噩梦挑战编辑弹窗
const openNightmareEditDialog = () => {
  editNightmareForm.value = {
    nightmareRuns: props.character.nightmareRuns,
    nightmareExtra: props.character.nightmareExtra
  }
  showNightmareEditDialog.value = true
}

// 确认噩梦挑战编辑
const confirmNightmareEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    nightmareRuns: editNightmareForm.value.nightmareRuns,
    nightmareExtra: editNightmareForm.value.nightmareExtra
  })
  showNightmareEditDialog.value = false
  ElMessage.success('噩梦挑战已更新')
}

// 打开备注编辑弹窗
const openNotesEditDialog = () => {
  editNotesForm.value = {
    notes: props.character.notes || ''
  }
  showNotesEditDialog.value = true
}

// 确认备注编辑
const confirmNotesEdit = () => {
  characterStore.updateCharacter(props.character.id, {
    notes: editNotesForm.value.notes
  })
  showNotesEditDialog.value = false
  ElMessage.success('备注已更新')
}
</script>

<style scoped>
.character-card {
  border-left: 4px solid var(--group-color);
  transition: all 0.3s ease;
}

.character-card:hover {
  transform: translateY(-3px);
}

/* 头部 */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-row-1 {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.header-row-2 {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-actions {
  display: none; /* Hidden, buttons moved to header-row-2 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card-actions {
  display: flex;
  gap: 4px;
  padding-top: 8px;
}

.char-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.char-tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.char-tags :deep(.el-tag) {
  color: #fff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 移除 el-card header 的默认下边框 */
:deep(.el-card__header) {
  border-bottom: none;
  padding-bottom: 0;
}

/* 移除 el-card header 的默认下边框 */
:deep(.el-card__header) {
  border-bottom: none;
  padding-bottom: 0;
}

/* 能量 */
.energy-section {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-fast);
}

.energy-section:hover {
  box-shadow: var(--shadow-sm);
}

/* 基纳 */
.kina-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.15), rgba(230, 162, 60, 0.05));
  border-radius: 8px;
  border: 1px solid rgba(230, 162, 60, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.kina-section:hover {
  border-color: rgba(230, 162, 60, 0.5);
  transform: translateY(-1px);
}

.kina-section .stat-label {
  font-size: 14px;
  color: #e6a23c;
  font-weight: 600;
}

.kina-section .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #e6a23c;
}

/* 装备评分+战斗力容器 */
.top-stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

/* 装备评分 */
.score-section {
  cursor: default;
}

.score-section .stat-cell-box {
  cursor: default;
  transition: all 0.2s;
  height: 100%;
}

.score-section .stat-cell-box:hover {
  transform: translateY(-1px);
}

/* 战斗力 */
.combat-power-section {
  cursor: default;
}

.combat-power-section .stat-cell-box {
  cursor: default;
  transition: all 0.2s;
  height: 100%;
}

.combat-power-section .stat-cell-box:hover {
  transform: translateY(-1px);
}

.stat-cell-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}

.stat-cell-box .stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.stat-cell-box .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

/* 远征/超越容器 */
.runs-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.runs-section {
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.runs-section:hover {
  transform: translateY(-1px);
}

.runs-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.runs-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.runs-current {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.runs-plus {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.runs-sep {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0 2px;
}

.runs-max {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.runs-final {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

/* 超越特殊颜色 */
.runs-section.transcend .runs-current {
  color: #b37feb;
}

.runs-section.transcend .runs-header {
  color: #b37feb;
}

/* 噩梦特殊颜色 */
.runs-section.nightmare .runs-current {
  color: #f56c6c;
}

.runs-section.nightmare .runs-header {
  color: var(--danger);
}

/* 圣域容器 */
.sanctuary-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.sanctuary-section {
  padding: var(--space-3);
  background: var(--primary-light);
  border-radius: var(--radius-lg);
  border: 1px solid var(--primary);
  opacity: 0.9;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sanctuary-section:hover {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.sanctuary-header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--primary);
  margin-bottom: var(--space-2);
}

.sanctuary-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  margin-bottom: var(--space-1);
}

.sanctuary-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.sanctuary-current {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: #409eff;
}

.sanctuary-plus {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.sanctuary-sep {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin: 0 2px;
}

.sanctuary-fixed {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.energy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.energy-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  font-weight: 600;
}

.energy-value {
  font-weight: 700;
  color: var(--el-color-primary);
}

.energy-details {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.energy-controls {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

/* 数据统计 */
.main-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}

.stat-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-cell.full-width {
  grid-column: span 2;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.stat-value.gold {
  color: #e6a23c;
}

.runs-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 任务 */
.task-section {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.task-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.task-tag {
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-tag:hover {
  transform: scale(1.05);
}

.task-icon {
  font-size: 14px;
}

/* 备注 */
.notes-section {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.notes-section:hover {
  background: var(--el-fill-color);
}

/* 备注编辑弹窗内容居中 */
.notes-edit-content {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.notes-edit-content .el-textarea {
  width: 100%;
  max-width: 260px;
}

/* 分组 */
.group-badge {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

/* 能量编辑弹窗 */
.form-unit {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}

/* 能量标签 */
.energy-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.energy-label .el-button {
  padding: 2px;
}

@media (max-width: 480px) {
  .main-stats {
    grid-template-columns: 1fr 1fr;
  }
  
  .char-name {
    font-size: 14px;
  }
}
</style>