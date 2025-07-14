<template>
  <div class="discover-values">
    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-indicator">データを読み込んでいます...</div>

    <!-- 選択モード -->
    <div v-else-if="!savedAt || isEditMode" class="selection-mode">
      <div class="header-section">
        <h2 class="section-title">🌱 わたしの価値観を見つける</h2>
        <p class="description">
          あなたが大切にしたいことを自由に選んでください。選んでも、選ばなくても大丈夫です。
        </p>
      </div>

      <!-- 価値観キーワードカード -->
      <div class="keywords-section">
        <div class="section-header">
          <p class="section-subtitle">価値観を選ぶ</p>
          <span class="selection-count">{{ selectedKeywords.length }}個選択中</span>
        </div>
        <div class="keywords-grid">
          <div
            v-for="keyword in keywords"
            :key="keyword"
            class="keyword-card"
            :class="{ 'selected': selectedKeywords.includes(keyword) }"
            @click="toggleKeyword(keyword)"
          >
            <div class="card-content">
              <div class="keyword-icon">{{ getKeywordIcon(keyword) }}</div>
              <span class="keyword-text">{{ keyword }}</span>
              <div class="selection-indicator">
                <div class="checkmark">✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 自由記述欄 -->
      <div class="free-entry-section">
        <div class="section-header">
          <p class="section-subtitle">自由に書く</p>
          <span class="char-count">{{ freeText.length }}/200文字</span>
        </div>
        <div class="textarea-container">
          <textarea
            v-model="freeText"
            placeholder="あなたが大事にしたいこと、気になっている価値観を書いてみてください"
            maxlength="200"
            class="free-text-input"
          ></textarea>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="button-section">
        <button
          class="save-button"
          :disabled="selectedKeywords.length === 0 && freeText.trim() === ''"
          @click="saveValues"
        >
          <span class="button-icon">💾</span>
          {{ isEditMode ? '更新する' : '保存する' }}
        </button>
        <button
          class="reset-button"
          :disabled="selectedKeywords.length === 0 && freeText.trim() === ''"
          @click="resetValues"
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

    <!-- 結果表示モード -->
    <div v-else-if="savedAt" class="result-mode">
      <div class="header-section">
        <h2 class="section-title">✨ あなたの価値観</h2>
        <p class="description">
          あなたが大切にしている価値観です。これらを意識して日々を過ごしてみてください。
        </p>
      </div>

      <!-- 選択された価値観の表示 -->
      <div v-if="selectedKeywords.length > 0" class="selected-values-section">
        <div class="section-header">
          <p class="section-subtitle">選択した価値観</p>
          <span class="selection-count">{{ selectedKeywords.length }}個</span>
        </div>
        <div class="selected-values-grid">
          <div
            v-for="keyword in selectedKeywords"
            :key="keyword"
            class="selected-value-card"
          >
            <div class="card-content">
              <div class="keyword-icon">{{ getKeywordIcon(keyword) }}</div>
              <span class="keyword-text">{{ keyword }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 自由記述の表示 -->
      <div v-if="freeText.trim()" class="free-text-display-section">
        <div class="section-header">
          <p class="section-subtitle">あなたの想い</p>
        </div>
        <div class="free-text-display">
          <p>{{ freeText }}</p>
        </div>
      </div>

      <!-- 保存日時の表示 -->
      <div v-if="savedAt" class="saved-info">
        <p class="saved-date">{{ formatSavedDate(savedAt) }}に保存</p>
      </div>

      <!-- 変更ボタン -->
      <div class="button-section">
        <button class="edit-button" @click="enterEditMode">
          <span class="button-icon">✏️</span>
          変更する
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="showToast" class="toast-notification" :class="{ 'error': toastMessage.includes('失敗') || toastMessage.includes('エラー') }">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// -- Data Refs --
const user = ref(null)
const selectedKeywords = ref([])
const freeText = ref('')
const savedAt = ref(null) // DBからはupdated_atを利用

// -- UI State Refs --
const loading = ref(true)
const showSaveMessage = ref(false) // これはトースト通知に置き換える
const isEditMode = ref(false)
const toastMessage = ref('')
const showToast = ref(false)

// 編集前の状態を保存（キャンセル用）
const originalSelectedKeywords = ref([])
const originalFreeText = ref('')



// 価値観キーワードリスト
const keywords = [
  "挑戦",
  "家族",
  "友情",
  "学び",
  "自由",
  "安心",
  "成長",
  "誠実",
  "創造",
  "感謝",
  "健康",
  "平和",
  "冒険",
  "責任",
  "独立",
  "協調"
]

// キーワードアイコンマッピング
const keywordIcons = {
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

// メソッド
const toggleKeyword = (keyword) => {
  const index = selectedKeywords.value.indexOf(keyword)
  if (index > -1) {
    selectedKeywords.value.splice(index, 1)
  } else {
    selectedKeywords.value.push(keyword)
  }
}

const getKeywordIcon = (keyword) => {
  return keywordIcons[keyword] || "✨"
}

const saveValues = async () => {
  if (!user.value) {
    triggerToast('ログインしていません', 'error')
    return
  }
  try {
    const updates = {
      user_id: user.value.id,
      selected_keywords: selectedKeywords.value,
      free_text: freeText.value,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('user_values')
      .upsert(updates, { onConflict: 'user_id' })
      .select()

    if (error) throw error

    // UIを更新
    if (data && data.length > 0) {
        selectedKeywords.value = data[0].selected_keywords
        freeText.value = data[0].free_text
        savedAt.value = data[0].updated_at
    }

    isEditMode.value = false
    triggerToast(isEditMode.value ? '価値観を更新しました！' : '価値観を保存しました！')

  } catch (error) {
    console.error('Error saving values:', error.message)
    triggerToast('保存に失敗しました', 'error')
  }
}

const triggerToast = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const resetValues = () => {
  if (confirm('選択した価値観をリセットしますか？')) {
    selectedKeywords.value = []
    freeText.value = ''
  }
}

// 編集モードに入る
const enterEditMode = () => {
  // 現在の状態を保存（キャンセル用）
  originalSelectedKeywords.value = [...selectedKeywords.value]
  originalFreeText.value = freeText.value
  isEditMode.value = true
}

// 編集をキャンセル
const cancelEdit = () => {
  // 元の状態に戻す
  selectedKeywords.value = [...originalSelectedKeywords.value]
  freeText.value = originalFreeText.value
  isEditMode.value = false
}

// 保存日時をフォーマット
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

// -- Supabase Functions --

// 1. Fetch user values from Supabase
const fetchUserValues = async () => {
  if (!user.value) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('user_values')
      .select('selected_keywords, free_text, updated_at')
      .eq('user_id', user.value.id)

    if (error) throw error

    if (data && data.length > 0) {
      selectedKeywords.value = data[0].selected_keywords || []
      freeText.value = data[0].free_text || ''
      savedAt.value = data[0].updated_at
    } else {
      // データがない場合は初期状態
      selectedKeywords.value = []
      freeText.value = ''
      savedAt.value = null
    }
  } catch (error) {
    console.error('Error fetching user values:', error.message)
    triggerToast('データの読み込みに失敗しました', 'error')
  } finally {
    loading.value = false
  }
}

// -- Lifecycle Hooks --

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    await fetchUserValues()
  } else {
    console.log('User not logged in')
    loading.value = false
    triggerToast('ログインしてください', 'error')
  }
})
</script>

<style scoped>
.discover-values {
  background: linear-gradient(135deg, #f8f9ff 0%, #fdfdfd 100%);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.discover-values::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.keywords-section,
.free-entry-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-subtitle {
  font-weight: 600;
  font-size: 1.2rem;
  color: #2d3748;
}

.selection-count,
.char-count {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.keywords-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.keyword-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  user-select: none;
}

.keyword-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s;
}

.keyword-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.keyword-card:hover::before {
  left: 100%;
}

.keyword-card.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.keyword-icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}

.keyword-text {
  font-weight: 500;
  font-size: 0.95rem;
  text-align: center;
}

.selection-indicator {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 24px;
  height: 24px;
  background: #48bb78;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.keyword-card.selected .selection-indicator {
  opacity: 1;
  transform: scale(1);
}

.checkmark {
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.textarea-container {
  position: relative;
}

.free-text-input {
  width: 100%;
  min-height: 140px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  background: #ffffff;
  color: #2d3748;
  transition: all 0.3s ease;
  line-height: 1.6;
}

.free-text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.free-text-input::placeholder {
  color: #a0aec0;
}

.button-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-button,
.reset-button {
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
  position: relative;
  overflow: hidden;
}

.save-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
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

.save-button:disabled,
.reset-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.button-icon {
  font-size: 1.1rem;
}

/* 結果表示モード用のスタイル */
.result-mode {
  animation: fadeIn 0.5s ease-in-out;
}

.selected-values-section,
.free-text-display-section {
  margin-bottom: 2.5rem;
}

.selected-values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.selected-value-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.selected-value-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.free-text-display {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.7;
  color: #2d3748;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.free-text-display p {
  margin: 0;
  white-space: pre-wrap;
}

.saved-info {
  text-align: center;
  margin-bottom: 2rem;
}

.saved-date {
  font-size: 0.9rem;
  color: #718096;
  background: rgba(113, 128, 150, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin: 0;
}

.edit-button,
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

.edit-button {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(237, 137, 54, 0.3);
}

.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(237, 137, 54, 0.4);
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

.loading-indicator {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #718096;
}

.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
  font-weight: 500;
  z-index: 1000;
}

.toast-notification.error {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  box-shadow: 0 8px 25px rgba(229, 62, 62, 0.3);
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

/* アニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .discover-values {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .keywords-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.8rem;
  }
  
  .button-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .save-message {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
  }
}
</style>
