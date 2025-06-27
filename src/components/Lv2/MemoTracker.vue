<template>
  <div class="memo-tracker">
    <h2 class="title">📝 今日のメモ</h2>
    <p class="description">今日の気分や行動について、自由にメモを残してみましょう</p>
    
    <div class="memo-container">
      <!-- メモ入力エリア -->
      <div class="memo-input-section">
        <textarea
          v-model="currentMemo"
          class="memo-textarea"
          placeholder="今日の気分や出来事をメモしよう"
          rows="4"
        ></textarea>
        
        <div class="memo-actions">
          <button 
            class="save-memo-button" 
            @click="insertMemo" 
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
        <div v-if="error" class="error-message">
          {{ error }}
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
              <span class="memo-time">{{ formatTime(memo.created_at) }}</span>
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
            <div class="history-date">{{ formatDate(memo.created_at) }}</div>
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
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// リアクティブデータ
const currentMemo = ref('')
const memoSaved = ref(false)
const todayMemos = ref([])
const recentMemos = ref([])
const error = ref(null)

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

// メモを保存 (Supabase)
const insertMemo = async () => {
  if (!currentMemo.value.trim()) return
  error.value = null
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("ユーザーが認証されていません。")

    const { data, error: insertError } = await supabase
      .from('memos')
      .insert([
        { content: currentMemo.value, user_id: user.id }
      ])
      .select()

    if (insertError) throw insertError

    // 保存成功
    memoSaved.value = true
    setTimeout(() => {
      memoSaved.value = false
    }, 3000)
    
    currentMemo.value = ''
    await fetchMemos() // メモ一覧を再取得

  } catch (e) {
    error.value = `エラーが発生しました: ${e.message}`
    console.error('メモの保存に失敗しました:', e)
  }
}

// メモを取得 (Supabase)
const fetchMemos = async () => {
  error.value = null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return;

    const { data, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (fetchError) throw fetchError

    const today = new Date().toISOString().split('T')[0]
    todayMemos.value = data.filter(memo => memo.created_at.startsWith(today))
    recentMemos.value = data

  } catch (e) {
    error.value = `メモの読み込みに失敗しました: ${e.message}`
    console.error('メモの読み込みエラー:', e)
  }
}


// メモをクリア
const clearMemo = () => {
  currentMemo.value = ''
  memoSaved.value = false
}

// コンポーネントマウント時にメモを読み込み
onMounted(() => {
  fetchMemos()
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

.error-message {
  margin-top: 1rem;
  padding: 0.8rem;
  background: #f8d7da;
  color: #721c24;
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
}
</style>