<template>
  <div class="roadmap-creator">
    <div class="header-section">
      <h2 class="section-title">🗺️ 道しるべマップを作る</h2>
      <p class="description">
        あなたの価値観を基に、長期的なありたい姿を描いてみましょう。
      </p>
    </div>

    <!-- 価値観が未設定の場合の案内 -->
    <div v-if="discoveredValues.length === 0" class="no-values-message">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// リアクティブデータ
const discoveredValues = ref([])
const roadmapData = ref({
  year1: { vision: '', relatedValues: [] },
  year3: { vision: '', relatedValues: [] },
  year5: { vision: '', relatedValues: [] }
})
const isEditMode = ref(false)
const savedAt = ref(null)
const lastKnownValues = ref([])

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

const saveRoadmap = () => {
  const now = new Date().toISOString()
  const roadmapSaveData = {
    roadmapData: roadmapData.value,
    savedAt: now
  }
  
  localStorage.setItem('roadmapData', JSON.stringify(roadmapSaveData))
  savedAt.value = now
  isEditMode.value = false
  
  alert('道しるべマップを保存しました！')
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
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 価値観変更を検知する関数
const checkValuesChange = () => {
  const saved = localStorage.getItem('discoveredValues')
  if (saved) {
    const data = JSON.parse(saved)
    const currentValues = data.selectedKeywords || []
    
    // 初回読み込み時は比較しない
    if (lastKnownValues.value.length === 0) {
      lastKnownValues.value = [...currentValues]
      discoveredValues.value = currentValues
      return
    }
    
    // 価値観が変更されているかチェック
    const hasChanged = JSON.stringify(lastKnownValues.value.sort()) !== JSON.stringify(currentValues.sort())
    
    if (hasChanged && hasSavedRoadmap.value) {
      const confirmMessage = `価値観が変更されました。\n道しるべマップをリセットして新しく作り直しますか？\n\n※「キャンセル」を選択すると価値観の変更は反映されません。`
      
      if (confirm(confirmMessage)) {
        // 道しるべマップをリセット
        roadmapData.value = {
          year1: { vision: '', relatedValues: [] },
          year3: { vision: '', relatedValues: [] },
          year5: { vision: '', relatedValues: [] }
        }
        savedAt.value = null
        localStorage.removeItem('roadmapData')
        
        // 新しい価値観を適用
        discoveredValues.value = currentValues
        lastKnownValues.value = [...currentValues]
        
        alert('道しるべマップをリセットしました。新しい価値観で作り直してください。')
      }
    } else {
      // 変更がない場合、または道しるべマップが未作成の場合は通常更新
      discoveredValues.value = currentValues
      lastKnownValues.value = [...currentValues]
    }
  }
}

// 価値観データを読み込み
const loadDiscoveredValues = () => {
  checkValuesChange()
}

// 道しるべマップデータを読み込み
const loadRoadmapData = () => {
  const saved = localStorage.getItem('roadmapData')
  if (saved) {
    const data = JSON.parse(saved)
    roadmapData.value = data.roadmapData || {
      year1: { vision: '', relatedValues: [] },
      year3: { vision: '', relatedValues: [] },
      year5: { vision: '', relatedValues: [] }
    }
    savedAt.value = data.savedAt || null
  }
}

// 価値観のリアルタイム監視
const startValuesWatcher = () => {
  // 5秒ごとに価値観の変更をチェック
  setInterval(() => {
    checkValuesChange()
  }, 5000)
}

// コンポーネント初期化時に実行
onMounted(() => {
  loadDiscoveredValues()
  loadRoadmapData()
  startValuesWatcher()
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