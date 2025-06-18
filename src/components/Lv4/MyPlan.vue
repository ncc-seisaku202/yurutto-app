<template>
  <div class="my-plan">
    <h2 class="section-title">🎯 マイプラン</h2>

    <!-- 目標名入力 -->
    <div class="form-group">
      <label for="goal">目標名</label>
      <input id="goal" v-model="planTitle" type="text" placeholder="例: 朝の散歩を習慣にする" />
    </div>

    <!-- 期間選択 -->
    <div class="form-group">
      <label for="duration">期間</label>
      <select id="duration" v-model="selectedDuration">
        <option disabled value="">選択してください</option>
        <option value="7">1週間</option>
        <option value="14">2週間</option>
        <option value="21">3週間</option>
        <option value="28">4週間</option>
      </select>
    </div>

    <!-- ステップ追加エリア -->
    <div class="step-section">
      <label>ステップを追加</label>
      <div class="step-input">
        <input v-model="newStep" placeholder="例: 毎朝7時に起きる" />
        <button @click="addStepAndSave" :disabled="!newStep.trim()">追加して保存</button>
      </div>

      <!-- 進捗バー -->
      <div class="progress-bar-wrapper" v-if="steps.length">
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <p class="progress-text">{{ completedSteps }}/{{ steps.length }} ステップ完了</p>
      </div>

      <!-- ステップ一覧 -->
      <ul class="step-list">
        <li v-for="(step, index) in steps" :key="index">
          <label>
            <input type="checkbox" v-model="step.completed" @change="savePlan" />
            <span :class="{ done: step.completed }">{{ step.text }}</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const planTitle = ref('')
const selectedDuration = ref('')
const newStep = ref('')
const steps = ref([])

const addStepAndSave = () => {
  steps.value.push({ text: newStep.value, completed: false })
  newStep.value = ''
  savePlan()
}

const completedSteps = computed(() => steps.value.filter(s => s.completed).length)
const progressPercent = computed(() => {
  if (steps.value.length === 0) return 0
  return Math.round((completedSteps.value / steps.value.length) * 100)
})

const savePlan = () => {
  const planData = {
    title: planTitle.value,
    duration: selectedDuration.value,
    steps: steps.value
  }
  localStorage.setItem('myPlan', JSON.stringify(planData))
  console.log('保存しました:', planData)
}

const loadPlan = () => {
  const saved = localStorage.getItem('myPlan')
  if (!saved) return
  try {
    const data = JSON.parse(saved)
    planTitle.value = data.title
    selectedDuration.value = data.duration
    steps.value = data.steps
  } catch (e) {
    console.warn('読み込みエラー', e)
  }
}

onMounted(() => {
  loadPlan()
})
</script>

<style scoped>
.my-plan {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}
input[type="text"], select {
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.step-section {
  margin-top: 2rem;
}
.step-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.step-input input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.step-input button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.step-input button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.step-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}
.step-list li {
  margin-bottom: 0.75rem;
}
.step-list input[type="checkbox"] {
  margin-right: 0.5rem;
}
.done {
  text-decoration: line-through;
  color: #999;
}
.progress-bar-wrapper {
  margin-bottom: 1rem;
}
.progress-bar {
  background-color: #e0e0e0;
  height: 12px;
  border-radius: 8px;
  overflow: hidden;
}
.progress {
  background-color: #28a745;
  height: 100%;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 0.9rem;
  margin-top: 0.25rem;
  color: #555;
}
</style>
