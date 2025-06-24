<template>
  <div class="memo-tracker">
    <h2 class="title">📝 今日のメモ</h2>
    <p class="description">今日の気分や行動について、自由にメモを残してみましょう</p>
    
    <div class="memo-container">
      <!-- メモ入力エリア -->
      <div class="memo-input-section">
        <div class="memo-categories">
          <button
            v-for="category in memoCategories"
            :key="category.value"
            :class="['category-btn', { active: selectedCategory === category.value }]"
            @click="selectedCategory = category.value"
          >
            {{ category.emoji }} {{ category.label }}
          </button>
        </div>
        
        <textarea
          v-model="currentMemo"
          class="memo-textarea"
          :placeholder="getPlaceholderText()"
          rows="4"
        ></textarea>
        
        <div class="memo-actions">
          <button 
            class="save-memo-button" 
            @click="saveMemo" 
            :disabled="!currentMemo.trim()"
          >
            メモを保存
          </button>
          <button 
            class="clear-memo-button" 
            @click="clearMemo" 
            v-if="currentMemo.trim()"
          >
            クリア
          </button>
        </div>
        
        <div v-if="memoSaved" class="memo-saved-message">
          ✅ メモが保存されました！
        </div>
      </div>
      
      <!-- 今日のメモ表示エリア -->
      <div class="today-memos" v-if="todayMemos.length > 0">
        <h3 class="today-title">今日のメモ一覧</h3>
        <div class="memo-list">
          <div
            v-for="memo in todayMemos"
            :key="memo.id"
            class="memo-item"
          >
            <div class="memo-header">
              <span class="memo-time">{{ formatTime(memo.timestamp) }}</span>
            </div>
            <p class="memo-content">{{ memo.content }}</p>
          </div>
        </div>
      </div>
      
      <!-- メモ履歴プレビュー -->
      <div class="memo-history-preview">
        <h3 class="history-title">最近のメモ</h3>
        <div class="history-list">
          <div
            v-for="memo in recentMemos"
            :key="memo.id"
            class="history-item"
          >
            <div class="history-date">{{ formatDate(memo.date) }}</div>
            <div class="history-content">{{ memo.content.substring(0, 50) }}{{ memo.content.length > 50 ? '...' : '' }}</div>
          </div>
        </div>
        <div v-if="recentMemos.length === 0" class="no-history">
          まだメモがありません
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import moodDataLv2 from '@/data/moodDataLv2.json'

// リアクティブデータ
const currentMemo = ref('')
const selectedCategory = ref('mood')
const memoSaved = ref(false)
const todayMemos = ref([])


// プレースホルダーテキストを取得
const getPlaceholderText = () => {
  const placeholders = {
    mood: '今日の気分はどうですか？何か特別な感情はありましたか？',
    action: '今日行った行動や活動について記録してみましょう',
    reflection: '今日一日を振り返って、気づいたことや学んだことは？',
    gratitude: '今日感謝したいことや嬉しかったことを書いてみましょう',
    goal: '明日の目標や今後やりたいことを記録してみましょう'
  }
  return placeholders[selectedCategory.value] || '自由にメモを書いてください'
}

// 時刻をフォーマット
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 日付をフォーマット
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return '今日'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨日'
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

// 最近のメモを取得（デモデータから）
const recentMemos = computed(() => {
  return moodDataLv2.moodRecords
    .filter(record => record.actionMemo)
    .map(record => ({
      id: record.date,
      date: record.date,
      content: record.actionMemo,
      category: 'action'
    }))
    .slice(-5)
    .reverse()
})

// メモを保存
const saveMemo = () => {
  if (!currentMemo.value.trim()) return
  
  const newMemo = {
    id: Date.now(),
    content: currentMemo.value,
    category: selectedCategory.value,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0]
  }
  
  // 今日のメモリストに追加
  todayMemos.value.push(newMemo)
  
  // ローカルストレージに保存（将来的にSupabaseに移行予定）
  const existingMemos = JSON.parse(localStorage.getItem('userMemos') || '[]')
  existingMemos.push(newMemo)
  localStorage.setItem('userMemos', JSON.stringify(existingMemos))
  
  // 保存完了メッセージを表示
  memoSaved.value = true
  setTimeout(() => {
    memoSaved.value = false
  }, 3000)
  
  // 入力をクリア
  currentMemo.value = ''
  
  console.log('メモを保存しました:', newMemo)
}

// メモをクリア
const clearMemo = () => {
  currentMemo.value = ''
  memoSaved.value = false
}

// 今日のメモを読み込み
const loadTodayMemos = () => {
  const today = new Date().toISOString().split('T')[0]
  const existingMemos = JSON.parse(localStorage.getItem('userMemos') || '[]')
  todayMemos.value = existingMemos.filter(memo => memo.date === today)
}

// コンポーネントマウント時に今日のメモを読み込み
onMounted(() => {
  loadTodayMemos()
})
</script>

<style scoped>
.memo-tracker {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-align: center;
}

.description {
  margin-bottom: 2rem;
  opacity: 0.9;
  text-align: center;
}

.memo-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.memo-input-section {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.memo-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.category-btn.active {
  background: #f093fb;
  border-color: #f093fb;
  color: white;
}

.memo-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.memo-textarea:focus {
  outline: none;
  border-color: #f093fb;
  box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
}

.memo-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-memo-button {
  background: linear-gradient(45deg, #f093fb, #f5576c);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-memo-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.save-memo-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.clear-memo-button {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-memo-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.memo-saved-message {
  margin-top: 1rem;
  padding: 0.8rem;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.today-memos {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.today-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.memo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.memo-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #f093fb;
}

.memo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.memo-category {
  font-weight: bold;
  color: #f093fb;
}

.memo-time {
  font-size: 0.9rem;
  color: #6c757d;
}

.memo-content {
  margin: 0;
  line-height: 1.5;
}

.memo-history-preview {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.history-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.history-item {
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #f5576c;
}

.history-date {
  font-size: 0.8rem;
  color: #f5576c;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.history-content {
  font-size: 0.9rem;
  line-height: 1.4;
}

.no-history {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 2rem;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .memo-tracker {
    padding: 1.5rem;
  }
  
  .memo-categories {
    justify-content: center;
  }
  
  .category-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .memo-actions {
    flex-direction: column;
  }
  
  .save-memo-button,
  .clear-memo-button {
    width: 100%;
  }
  
  .title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .memo-tracker {
    padding: 1rem;
  }
  
  .memo-input-section,
  .today-memos,
  .memo-history-preview {
    padding: 1rem;
  }
  
  .memo-categories {
    gap: 0.3rem;
  }
  
  .category-btn {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>