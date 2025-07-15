<template>
  <div class="roadmap-creator">
    <div class="header-section">
      <h2 class="section-title">🗺️ 道しるべマップを作る</h2>
      <p class="description">
        あなたの価値観を基に、長期的なありたい姿を描いてみましょう。
      </p>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-indicator">データを読み込んでいます...</div>

    <!-- 価値観が未設定の場合の案内 -->
    <div v-else-if="!loading && discoveredValues.length === 0" class="no-values-message">
      <div class="message-card">
        <div class="message-icon">🌱</div>
        <h3>まずは価値観を見つけましょう</h3>
        <p>道しるべマップを作成するには、先に「わたしの価値観を見つける」で価値観を選択してください。</p>
      </div>
    </div>

    <!-- メインコンテンツ -->
    <div v-else class="main-content">
      <!-- 表示モード -->
      <div v-if="hasSavedRoadmap && !isEditMode" class="display-mode">
        <div class="roadmap-display">
          <div class="display-header">
            <h3 class="section-subtitle">あなたの道しるべマップ</h3>
            <div class="saved-info">
              <span class="saved-date">{{ formatSavedDate(savedAt) }}に作成</span>
            </div>
          </div>
          
          <div class="roadmap-cards">
            <div
              v-for="period in visiblePeriods"
              :key="`display-${period.key}`"
              class="roadmap-card"
            >
              <div class="card-header">
                <div class="period-info">
                  <div class="period-icon">{{ period.icon }}</div>
                  <h4 class="period-title">{{ period.label }}</h4>
                </div>
              </div>
              
              <div class="vision-display">
                <h5 class="vision-label">ありたい姿</h5>
                <p class="vision-text">{{ roadmapData[period.key].vision }}</p>
              </div>
              
              <div v-if="roadmapData[period.key].relatedValues.length > 0" class="related-values-display">
                <h5 class="values-label">関連する価値観</h5>
                <div class="values-tags">
                  <div
                    v-for="value in roadmapData[period.key].relatedValues"
                    :key="`display-tag-${period.key}-${value}`"
                    class="value-tag"
                  >
                    <span class="value-icon">{{ getValueIcon(value) }}</span>
                    <span class="value-text">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="display-actions">
            <button class="edit-button" @click="enterEditMode">
              <span class="button-icon">✏️</span>
              編集する
            </button>
          </div>
        </div>
      </div>

      <!-- 入力モード -->
      <div v-else class="input-mode">
      <!-- 価値観プレビュー -->
      <div class="values-preview-section">
        <div class="section-header">
          <h3 class="section-subtitle">あなたの価値観</h3>
          <span class="values-count">{{ discoveredValues.length }}個</span>
        </div>
        <div class="values-preview">
          <div
            v-for="value in discoveredValues"
            :key="value"
            class="value-chip"
          >
            <span class="value-icon">{{ getValueIcon(value) }}</span>
            <span class="value-text">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 期間別カード -->
      <div class="periods-section">
        <div class="section-header">
          <h3 class="section-subtitle">期間別のありたい姿</h3>
        </div>
        
        <div class="periods-grid">
          <div
            v-for="period in periods"
            :key="period.key"
            class="period-card"
          >
            <!-- カードヘッダー -->
            <div class="card-header">
              <div class="period-info">
                <div class="period-icon">{{ period.icon }}</div>
                <h4 class="period-title">{{ period.label }}</h4>
              </div>
            </div>

            <!-- ありたい姿入力 -->
            <div class="vision-input-section">
              <label class="input-label">ありたい姿</label>
              <textarea
                v-model="roadmapData[period.key].vision"
                :placeholder="`${period.label}のありたい姿を書いてみてください`"
                maxlength="300"
                class="vision-input"
                rows="4"
              ></textarea>
              <div class="char-count">{{ roadmapData[period.key].vision.length }}/300文字</div>
            </div>

            <!-- 関連する価値観選択 -->
            <div class="related-values-section">
              <label class="input-label">関連する価値観</label>
              <div class="values-checkboxes">
                <label
                  v-for="value in discoveredValues"
                  :key="`${period.key}-${value}`"
                  class="value-checkbox"
                  :class="{ 'checked': roadmapData[period.key].relatedValues.includes(value) }"
                >
                  <input
                    type="checkbox"
                    :value="value"
                    v-model="roadmapData[period.key].relatedValues"
                    class="checkbox-input"
                  >
                  <div class="checkbox-content">
                    <span class="value-icon">{{ getValueIcon(value) }}</span>
                    <span class="value-text">{{ value }}</span>
                    <div class="checkmark">✓</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 選択された価値観のタグ表示 -->
            <div v-if="roadmapData[period.key].relatedValues.length > 0" class="selected-values-tags">
              <div class="tags-label">選択中の価値観</div>
              <div class="tags-container">
                <div
                  v-for="value in roadmapData[period.key].relatedValues"
                  :key="`tag-${period.key}-${value}`"
                  class="value-tag"
                >
                  <span class="value-icon">{{ getValueIcon(value) }}</span>
                  <span class="value-text">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="action-buttons">
        <button
          class="save-button"
          :disabled="!hasAnyContent"
          @click="saveRoadmap"
        >
          <span class="button-icon">💾</span>
          {{ isEditMode ? '更新する' : '道しるべマップを保存' }}
        </button>
        <button
          class="reset-button"
          :disabled="!hasAnyContent"
          @click="resetRoadmap"
        >
          <span class="button-icon">🔄</span>
          リセット
        </button>
        <button
          v-if="isEditMode"
          class="cancel-button"
          @click="cancelEdit"
        >
          <span class="button-icon">❌</span>
          キャンセル
        </button>
      </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="showToast" class="toast-notification" :class="{ 'error': toastMessage.includes('失敗'), 'info': toastMessage.includes('リセット') }">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'

// -- Data Refs --
const user = ref(null)
const discoveredValues = ref([])
const roadmapData = ref({
  year1: { vision: '', relatedValues: [] },
  year3: { vision: '', relatedValues: [] },
  year5: { vision: '', relatedValues: [] }
})
const savedAt = ref(null) // DBからはupdated_atを利用

// -- UI State Refs --
const loading = ref(true)
const isEditMode = ref(false)
const toastMessage = ref('')
const showToast = ref(false)

// -- Supabase Refs --
let subscription = null

// 編集前の状態を保存（キャンセル用）
const originalRoadmapData = ref({})

// 期間設定
const periods = [
  { key: 'year1', label: '1年後', icon: '🌱' },
  { key: 'year3', label: '3年後', icon: '🌳' },
  { key: 'year5', label: '5年後', icon: '🌲' }
]

// 価値観アイコンマッピング（DiscoverValuesと同じ）
const valueIcons = {
  "挑戦": "🚀",
  "家族": "👨‍👩‍👧‍👦",
  "友情": "🤝",
  "学び": "📚",
  "自由": "🕊️",
  "安心": "🛡️",
  "成長": "🌱",
  "誠実": "💎",
  "創造": "🎨",
  "感謝": "🙏",
  "健康": "💪",
  "平和": "☮️",
  "冒険": "🗺️",
  "責任": "⚖️",
  "独立": "🦅",
  "協調": "🤲"
}

// 計算プロパティ
const hasAnyContent = computed(() => {
  return Object.values(roadmapData.value).some(data =>
    data.vision.trim() !== '' || data.relatedValues.length > 0
  )
})

const hasSavedRoadmap = computed(() => {
  return savedAt.value !== null && Object.values(roadmapData.value).some(data =>
    data.vision.trim() !== ''
  )
})

const visiblePeriods = computed(() => {
  return periods.filter(period => roadmapData.value[period.key].vision.trim() !== '')
})

// メソッド
const getValueIcon = (value) => {
  return valueIcons[value] || "✨"
}



const resetRoadmap = () => {
  if (confirm('入力した内容をリセットしますか？')) {
    roadmapData.value = {
      year1: { vision: '', relatedValues: [] },
      year3: { vision: '', relatedValues: [] },
      year5: { vision: '', relatedValues: [] }
    }
  }
}

const enterEditMode = () => {
  originalRoadmapData.value = JSON.parse(JSON.stringify(roadmapData.value))
  isEditMode.value = true
}

const cancelEdit = () => {
  roadmapData.value = JSON.parse(JSON.stringify(originalRoadmapData.value))
  isEditMode.value = false
}


const formatSavedDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// -- Supabase Functions --

// 1. Fetch initial data (values and roadmap)
const fetchInitialData = async () => {
  if (!user.value) return
  loading.value = true
  try {
    // Fetch both user_values and roadmaps in parallel
    const [valuesRes, roadmapRes] = await Promise.all([
      supabase.from('user_values').select('selected_keywords').eq('user_id', user.value.id),
      supabase.from('roadmaps').select('roadmap_data, updated_at').eq('user_id', user.value.id)
    ])

    if (valuesRes.error) throw valuesRes.error
    if (roadmapRes.error) throw roadmapRes.error

    // Process user values
    if (valuesRes.data && valuesRes.data.length > 0) {
      discoveredValues.value = valuesRes.data[0].selected_keywords || []
    } else {
      discoveredValues.value = []
    }

    // Process roadmap data
    if (roadmapRes.data && roadmapRes.data.length > 0) {
      roadmapData.value = roadmapRes.data[0].roadmap_data || roadmapData.value
      savedAt.value = roadmapRes.data[0].updated_at
    } else {
      savedAt.value = null
    }

  } catch (error) {
    console.error('Error fetching initial data:', error.message)
    triggerToast('データの読み込みに失敗しました', 'error')
  } finally {
    loading.value = false
  }
}

// 2. Save (Upsert) roadmap
const saveRoadmap = async () => {
  if (!user.value) return triggerToast('ログインしていません', 'error')

  // バリデーション: すべての「ありたい姿」が入力されているか確認
  const allVisionsFilled = periods.every(period => roadmapData.value[period.key].vision.trim() !== '')
  if (!allVisionsFilled) {
    triggerToast('すべての期間の「ありたい姿」を入力してください', 'error')
    return
  }

  try {
    const updates = {
      user_id: user.value.id,
      roadmap_data: roadmapData.value,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('roadmaps')
      .upsert(updates, { onConflict: 'user_id' })
      .select('updated_at')
      .single()

    if (error) throw error

    savedAt.value = data.updated_at
    isEditMode.value = false
    triggerToast('道しるべマップを保存しました！')

  } catch (error) {
    console.error('Error saving roadmap:', error.message)
    triggerToast('保存に失敗しました', 'error')
  }
}

// 3. Handle real-time value changes
const handleValueChange = (payload) => {
  const newValues = payload.new.selected_keywords || []
  const oldValues = payload.old.selected_keywords || []

  // Only proceed if values have actually changed
  if (JSON.stringify(newValues.sort()) === JSON.stringify(oldValues.sort())) {
    return
  }

  if (hasSavedRoadmap.value) {
    const confirmMessage = `価値観が変更されました.\n道しるべマップをリセットして新しく作り直しますか？\n\n※「キャンセル」を選択すると、マップは以前の価値観に基づいたままになります.`
    if (confirm(confirmMessage)) {
      // Reset roadmap data and UI
      roadmapData.value = {
        year1: { vision: '', relatedValues: [] },
        year3: { vision: '', relatedValues: [] },
        year5: { vision: '', relatedValues: [] }
      }
      savedAt.value = null
      isEditMode.value = false
      // Also delete the roadmap from DB
      supabase.from('roadmaps').delete().eq('user_id', user.value.id).then()
      triggerToast('道しるべマップをリセットしました。新しい価値観で作り直してください。', 'info')
    }
  }
  // Update the displayed values regardless of user choice
  discoveredValues.value = newValues
}

// 4. Setup real-time subscription
const setupSubscription = () => {
  if (subscription) return // Avoid duplicate subscriptions
  subscription = supabase
    .channel('public:user_values')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'user_values', filter: `user_id=eq.${user.value.id}` },
      handleValueChange
    )
    .subscribe()
}

// -- UI Helper Functions --

const triggerToast = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  // Add a class based on type for styling
  const toastElement = document.querySelector('.toast-notification')
  if (toastElement) {
    toastElement.classList.remove('error', 'info') // Remove previous types
    if (type === 'error') {
      toastElement.classList.add('error')
    } else if (type === 'info') {
      toastElement.classList.add('info')
    }
  }
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

// -- Lifecycle Hooks --

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    await fetchInitialData()
    setupSubscription()
  } else {
    loading.value = false
    triggerToast('ログインしてください', 'error')
  }
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>

<style scoped>
.roadmap-creator {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.roadmap-creator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4299e1 0%, #3182ce 100%);
  border-radius: 16px 16px 0 0;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* 価値観未設定メッセージ */
.no-values-message {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.message-card {
  background: #ffffff;
  border: 2px solid #fed7d7;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
}

.message-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.message-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.message-card p {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

/* 価値観プレビュー */
.values-preview-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-subtitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.values-count {
  font-size: 0.9rem;
  color: #4299e1;
  font-weight: 500;
  background: rgba(66, 153, 225, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.values-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.value-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

.value-icon {
  font-size: 1rem;
}

.value-text {
  font-size: 0.9rem;
}

/* 期間カード */
.periods-section {
  margin-bottom: 2.5rem;
}

.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.period-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.period-card:hover {
  border-color: #4299e1;
  box-shadow: 0 4px 20px rgba(66, 153, 225, 0.1);
}

.card-header {
  margin-bottom: 1.5rem;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.period-icon {
  font-size: 1.8rem;
}

.period-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

/* 入力セクション */
.vision-input-section,
.related-values-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.8rem;
}

.vision-input {
  width: 100%;
  max-width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  background: #ffffff;
  color: #2d3748;
  transition: all 0.3s ease;
  line-height: 1.6;
  box-sizing: border-box;
}

.vision-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.vision-input::placeholder {
  color: #a0aec0;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.5rem;
}

/* 価値観チェックボックス */
.values-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
}

.value-checkbox {
  position: relative;
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.8rem;
  transition: all 0.3s ease;
  position: relative;
}

.value-checkbox:hover .checkbox-content {
  border-color: #4299e1;
  transform: translateY(-1px);
}

.value-checkbox.checked .checkbox-content {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border-color: #4299e1;
  color: white;
  transform: translateY(-1px) scale(1.02);
}

.checkmark {
  position: absolute;
  top: -0.3rem;
  right: -0.3rem;
  width: 20px;
  height: 20px;
  background: #48bb78;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.value-checkbox.checked .checkmark {
  opacity: 1;
  transform: scale(1);
}

/* 選択された価値観タグ */
.selected-values-tags {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.tags-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.8rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.value-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(66, 153, 225, 0.1);
  color: #3182ce;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* アクションボタン */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-button,
.reset-button,
.cancel-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
}

.reset-button {
  background: #ffffff;
  color: #718096;
  border: 2px solid #e2e8f0;
}

.reset-button:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.cancel-button {
  background: #ffffff;
  color: #e53e3e;
  border: 2px solid #fed7d7;
}

.cancel-button:hover {
  background: #fed7d7;
  transform: translateY(-1px);
}

.save-button:disabled,
.reset-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.button-icon {
  font-size: 1.1rem;
}

/* 表示モード用スタイル */
.display-mode {
  animation: fadeIn 0.5s ease-in-out;
}

.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.saved-info {
  display: flex;
  align-items: center;
}

.saved-date {
  font-size: 0.9rem;
  color: #718096;
  background: rgba(113, 128, 150, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.roadmap-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.roadmap-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.roadmap-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.vision-display {
  margin-bottom: 1.5rem;
}

.vision-label,
.values-label {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.8rem;
  display: block;
}

.vision-text {
  font-size: 1rem;
  color: #2d3748;
  line-height: 1.7;
  margin: 0;
  background: rgba(66, 153, 225, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #4299e1;
}

.related-values-display {
  margin-top: 1.5rem;
}

.values-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.display-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(237, 137, 54, 0.3);
}

.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(237, 137, 54, 0.4);
}

.loading-indicator {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #718096;
}

.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
  font-weight: 500;
  z-index: 1000;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-notification.error {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
}

.toast-notification.info {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .roadmap-creator {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .periods-grid,
  .roadmap-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .values-checkboxes {
    grid-template-columns: 1fr;
  }
  
  .action-buttons,
  .display-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .values-preview {
    justify-content: center;
  }
  
  .display-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>