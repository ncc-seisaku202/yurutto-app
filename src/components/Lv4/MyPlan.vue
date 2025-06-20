<template>
  <div class="my-plan">
    <h2 class="section-title">🎯 マイプラン</h2>

    <!-- カード：目標と期間 -->
    <div class="card-section">
      <!-- 目標名入力 -->
      <div class="form-group">
        <label for="goal">目標名</label>
        <div class="goal-input-group">
          <input
            id="goal"
            v-model="planTitle"
            :disabled="!isEditingTitle"
            type="text"
            placeholder="例: 朝の散歩を習慣にする"
          />
          <button @click="toggleTitleEdit">
            {{ isEditingTitle ? '確定' : '目標名を変更' }}
          </button>
        </div>
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
    </div>

    <!-- カード：ステップ追加と進捗 -->
    <div class="card-section">
      <div class="step-section">
        <label>ステップを追加</label>
        <div class="step-input">
          <input v-model="newStep" placeholder="例: 毎朝7時に起きる" />
          <button @click="addStepAndSave" :disabled="!newStep.trim()">追加して保存</button>
        </div>

        <!-- 進捗バー -->
        <div class="progress-bar-wrapper" v-if="steps.length">
          <div class="progress-bar">
            <div class="progress" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p class="progress-text">{{ completedSteps }}/{{ steps.length }} ステップ完了</p>
        </div>

        <!-- ステップ一覧 -->
        <div class="step-cards">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-card"
            :class="{ completed: step.completed }"
          >
            <div class="step-card-inner" @click="openModal(step, index)">
              <span class="step-text">{{ step.text }}</span>
            </div>
            <input
              type="checkbox"
              class="step-checkbox"
              v-model="step.completed"
              @change="handleCheckboxChange($event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 詳細表示モーダル -->
<div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
  <div class="modal-content">
    <h3>ステップの詳細</h3>

    <template v-if="!isEditingStep">
      <p>{{ selectedStep?.text }}</p>
      <p>状態: {{ selectedStep?.completed ? '完了' : '未完了' }}</p>
      <button @click="isEditingStep = true">✏️ 編集する</button>
      <button @click="deleteSelectedStep">このステップを削除</button>
      <button @click="closeModal">閉じる</button>
    </template>

    <template v-else>
      <input v-model="editedText" class="edit-input" placeholder="ステップを編集..." />
      <div class="modal-buttons">
        <button @click="saveEditedStep">保存する</button>
        <button @click="isEditingStep = false">キャンセル</button>
      </div>
    </template>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const planTitle = ref('')
const isEditingTitle = ref(true)
const selectedDuration = ref('')
const newStep = ref('')
const steps = ref([])
const isModalOpen = ref(false)
const selectedStep = ref(null)
const selectedIndex = ref(null)
const isEditingStep = ref(false)
const editedText = ref('')

const toggleTitleEdit = () => {
  isEditingTitle.value = !isEditingTitle.value
  if (!isEditingTitle.value) {
    savePlan()
  }
}

const addStepAndSave = () => {
  steps.value.push({ text: newStep.value, completed: false })
  newStep.value = ''
  savePlan()
}

const openModal = (step, index) => {
  selectedStep.value = step
  selectedIndex.value = index
  isModalOpen.value = true
  isEditingStep.value = false
  editedText.value = step.text
}

const closeModal = () => {
  isModalOpen.value = false
  selectedStep.value = null
  selectedIndex.value = null
  isEditingStep.value = false
}

const deleteSelectedStep = () => {
  if (selectedIndex.value !== null) {
    steps.value.splice(selectedIndex.value, 1)
    savePlan()
    closeModal()
  }
}

const saveEditedStep = () => {
  if (selectedIndex.value !== null && editedText.value.trim()) {
    steps.value[selectedIndex.value].text = editedText.value.trim()
    savePlan()
    isEditingStep.value = false
  }
}

const handleCheckboxChange = (event) => {
  const checkbox = event.target
  checkbox.classList.add('animate')
  setTimeout(() => {
    checkbox.classList.remove('animate')
  }, 300)
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
    isEditingTitle.value = false
  } catch (e) {
    console.warn('読み込みエラー', e)
  }
}

onMounted(() => {
  loadPlan()
})
</script>


<style scoped>
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
.step-checkbox.animate {
  animation: pop 0.3s ease;
}

.my-plan {
  background: #f0f8ff; /* やわらかいブルー */
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  color: #445566;
}

.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #445566;
  margin-bottom: 1.5rem;
}

.card-section {
  background-color: #ffffff;
  border: 2px solid #dceefa; /* 薄い水色の枠線 */
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(145, 201, 247, 0.2);
  margin-bottom: 2rem;
  transition: box-shadow 0.3s ease;
}

.card-section:hover {
  box-shadow: 0 4px 12px rgba(145, 201, 247, 0.25);
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
  background-color: #ffffff;
  border: 1px solid #cce3f5;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  color: #333;
}

.step-section {
  margin-top: 1rem;
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
  background-color: #f8c8dc; /* ピンクアクセント */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.step-input button:disabled {
  background-color: #ddd;
  color: #aaa;
  cursor: not-allowed;
}

.step-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.step-card {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: background-color 0.3s;
}
.step-card.completed {
  background-color: #eef6f9;
  border-color: #91c9f7;
}
.step-card-inner {
  cursor: pointer;
  padding-right: 2rem;
}
.step-text {
  display: inline-block;
  font-size: 1rem;
}
.step-checkbox {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border: 2px solid #dceefa;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(145, 201, 247, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  color: #444;
}
.modal-content button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.modal-content button:first-of-type {
  background-color: #dc3545;
  color: white;
}
.modal-content button:last-of-type {
  background-color: #6c757d;
  color: white;
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
  height: 100%;
  background: linear-gradient(to right, #f8c8dc, #91c9f7); /* ピンク→ブルー */
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 0.9rem;
  margin-top: 0.25rem;
  color: #555;
}

.goal-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.goal-input-group input[disabled] {
  background-color: #f1f1f1;
  color: #666;
  cursor: not-allowed;
}
.goal-input-group button {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  background-color: #f8c8dc;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
.goal-input-group button:hover {
  background-color: #f4a9c4;
}
</style>

