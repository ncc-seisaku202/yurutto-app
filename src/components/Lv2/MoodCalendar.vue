<template>
  <div class="mood-calendar">
    <h2 class="calendar-title">📅 気分カレンダー (Lv2)</h2>
    <p class="calendar-description">日付をクリックすると、その日の気分とメモを確認できます</p>
    
    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="previousMonth" class="nav-button">‹</button>
        <h3 class="month-year">{{ currentMonthYear }}</h3>
        <button @click="nextMonth" class="nav-button">›</button>
      </div>
      
      <div class="calendar-grid">
        <div class="day-header" v-for="day in dayHeaders" :key="day">
          {{ day }}
        </div>
        
        <div
          v-for="date in calendarDates"
          :key="date.key"
          :class="[
            'calendar-day',
            {
              'other-month': !date.isCurrentMonth,
              'has-mood': date.hasMood,
              'selected': selectedDate === date.dateString,
              'today': date.isToday
            }
          ]"
          @click="selectDate(date)"
        >
          <span class="day-number">{{ date.day }}</span>
          <div v-if="date.hasMood" class="mood-indicator">
            <span class="mood-emoji">{{ getMoodEmoji(date.moodLevel) }}</span>
            <div v-if="date.memoCount > 0" class="memo-count">{{ date.memoCount }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 選択された日の詳細表示 -->
    <div v-if="selectedDateData" class="date-details">
      <h3 class="details-title">{{ formatSelectedDate(selectedDate) }}の記録</h3>
      
      <div class="mood-section">
        <h4 class="section-title">🌊 気分</h4>
        <div class="mood-display">
          <span class="mood-level">{{ selectedDateData.mood }}</span>
          <span class="mood-emoji-large">{{ getMoodEmoji(selectedDateData.moodLevel) }}</span>
        </div>
      </div>
      
      <div v-if="selectedDateData.gachaResult" class="action-section">
        <h4 class="section-title">🎯 行動</h4>
        <div class="action-display">
          <p class="action-name">{{ selectedDateData.gachaResult }}</p>
          <p v-if="selectedDateData.actionMemo" class="action-memo">
            💭 {{ selectedDateData.actionMemo }}
          </p>
        </div>
      </div>
      
      <div v-if="selectedDateData.dailyMemos && selectedDateData.dailyMemos.length > 0" class="memos-section">
        <h4 class="section-title">📝 その日のメモ</h4>
        <div class="memos-list">
          <div
            v-for="memo in selectedDateData.dailyMemos"
            :key="memo.id"
            class="memo-item"
          >
            <div class="memo-header">
              <span class="memo-category">{{ getCategoryEmoji(memo.category) }} {{ getCategoryLabel(memo.category) }}</span>
              <span class="memo-time">{{ formatTime(memo.timestamp) }}</span>
            </div>
            <p class="memo-content">{{ memo.content }}</p>
          </div>
        </div>
      </div>
      <button @click="selectedDate = null" class="close-details">閉じる</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'

// リアクティブデータ
const currentDate = ref(new Date())
const selectedDate = ref(null)

// Supabaseから取得したデータをここに入れる
const moodRecords = ref([])

// 曜日ヘッダー
const dayHeaders = ['日', '月', '火', '水', '木', '金', '土']

// メモカテゴリ
const memoCategories = {
  mood: { label: '気分', emoji: '😊' },
  action: { label: '行動', emoji: '🎯' },
  reflection: { label: '振り返り', emoji: '💭' },
  gratitude: { label: '感謝', emoji: '🙏' },
  goal: { label: '目標', emoji: '⭐' }
}

// 現在の月年を表示
const currentMonthYear = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

// 気分レベルに対応する絵文字を取得 (指示に合わせたもの)
const getMoodEmoji = (level) => {
  const emojis = {
    1: '😰',
    2: '😔',
    3: '😐',
    4: '😊',
    5: '😄'
  }
  return emojis[level] || '😐'
}

// 気分レベルに対応するテキストを取得（詳細表示用）
const getMoodTextByLevel = (level) => {
  const texts = {
    1: 'とてもしんどい',
    2: 'しんどい',
    3: '普通',
    4: 'いけるかも',
    5: 'とても良い'
  }
  return texts[level] || '不明'
}

// カテゴリの絵文字を取得
const getCategoryEmoji = (category) => {
  return memoCategories[category]?.emoji || '📝'
}

// カテゴリのラベルを取得
const getCategoryLabel = (category) => {
  return memoCategories[category]?.label || 'メモ'
}

// 時刻をフォーマット
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 選択された日付をフォーマット
const formatSelectedDate = (dateString) => {
  const parts = dateString.split('-')
  const month = parseInt(parts[1], 10)
  const day = parseInt(parts[2], 10)
  return `${month}月${day}日`
}

// カレンダーの日付データを生成
const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
  
  const dates = []
  const currentDateObj = new Date(startDate)
  const today = new Date()
  
  while (currentDateObj <= endDate) {
    const year_str = currentDateObj.getFullYear()
    const month_str = (currentDateObj.getMonth() + 1).toString().padStart(2, '0')
    const day_str = currentDateObj.getDate().toString().padStart(2, '0')
    const dateString = `${year_str}-${month_str}-${day_str}`
    
    const moodRecord = moodRecords.value.find(record => record.date === dateString)
    
    dates.push({
      key: dateString,
      dateString,
      day: currentDateObj.getDate(),
      isCurrentMonth: currentDateObj.getMonth() === month,
      isToday: currentDateObj.toDateString() === today.toDateString(),
      hasMood: !!moodRecord,
      moodLevel: moodRecord?.moodLevel,
      // dailyMemosは取得しないので、memoCountは常に0になります
      memoCount: moodRecord?.dailyMemos?.length || 0
    })
    
    currentDateObj.setDate(currentDateObj.getDate() + 1)
  }
  
  return dates
})

// 選択された日のデータ
const selectedDateData = computed(() => {
  if (!selectedDate.value) return null
  const record = moodRecords.value.find(record => record.date === selectedDate.value)
  if (record) {
    return {
      ...record,
      mood: getMoodTextByLevel(record.moodLevel)
    }
  }
  return null
})

// 前の月に移動
const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  selectedDate.value = null
}

// 次の月に移動
const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  selectedDate.value = null
}

// 日付を選択
const selectDate = (date) => {
  if (date.hasMood) {
    selectedDate.value = date.dateString
  }
}

// Supabaseから気分データを取得する関数
const fetchMoodRecords = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('ユーザー情報取得失敗:', userError?.message || userError)
    moodRecords.value = []
    return
  }

  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999)

  // 【修正点】: select句から存在しないカラムを削除。mood_levelのみ取得します。
  const { data, error } = await supabase
    .from('moods')
    .select('created_at, mood_level')
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('気分データ取得失敗:', error.message || error)
    moodRecords.value = []
    return
  }

  // 【修正点】: 取得したデータ（mood_levelのみ）をマッピングします。
  moodRecords.value = data.map(entry => {
    const datePart = entry.created_at.split('T')[0] 
    return {
      date: datePart,
      moodLevel: entry.mood_level,
      // gachaResultなどはデータにないため、テンプレート側で表示されなくなります
      gachaResult: null,
      actionMemo: null,
      dailyMemos: []
    }
  })
}

watch(currentDate, fetchMoodRecords, { immediate: true })

onMounted(() => {
  // watchの immediate: true で初期ロードが実行されるため、ここは空でOK
  document.addEventListener('mood-recorded', fetchMoodRecords)
})

onUnmounted(() => {
  document.removeEventListener('mood-recorded', fetchMoodRecords)
})
</script>

<style scoped>
/* スタイルはレベル1とレベル2で見た目が異なるが、指示に従い変更していません。 */
/* レベル2の元々のスタイルをそのまま維持します。 */

.mood-calendar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.calendar-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-align: center;
}

.calendar-description {
  margin-bottom: 2rem;
  opacity: 0.9;
  text-align: center;
  font-size: 0.9rem;
}

.calendar-container {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.nav-button {
  background: #667eea;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #5a67d8;
  transform: scale(1.1);
}

.month-year {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.day-header {
  background: #f8fafc;
  padding: 0.8rem 0.5rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: #64748b;
}

.calendar-day {
  background: white;
  min-height: 80px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.calendar-day:hover {
  background: #f1f5f9;
}

.calendar-day.other-month {
  background: #f8fafc;
  color: #cbd5e1;
}

.calendar-day.other-month:hover {
  background: #f1f5f9;
}

.calendar-day.has-mood {
  background: linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 100%);
  cursor: pointer;
}

.calendar-day.has-mood:hover {
  background: linear-gradient(135deg, #b3e5fc 0%, #e1bee7 100%);
  transform: scale(1.02);
}

.calendar-day.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.calendar-day.today {
  border: 2px solid #667eea;
}

.day-number {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.mood-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.mood-emoji {
  font-size: 1.2rem;
}

.memo-count {
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.date-details {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.details-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #667eea;
}

.mood-section {
  margin-bottom: 2rem;
}

.mood-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.mood-level {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.mood-emoji-large {
  font-size: 2rem;
}

.action-section {
  margin-bottom: 2rem;
}

.action-display {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.action-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.action-memo {
  font-style: italic;
  color: #64748b;
  margin: 0;
}

.memos-section {
  margin-bottom: 2rem;
}

.memos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.memo-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.memo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.memo-category {
  font-weight: bold;
  color: #667eea;
  font-size: 0.9rem;
}

.memo-time {
  font-size: 0.8rem;
  color: #64748b;
}

.memo-content {
  margin: 0;
  line-height: 1.5;
  color: #333;
}

.close-details {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
}

.close-details:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .mood-calendar {
    padding: 1.5rem;
  }
  
  .calendar-container {
    padding: 1rem;
  }
  
  .calendar-day {
    min-height: 60px;
    padding: 0.3rem;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  .mood-emoji {
    font-size: 1rem;
  }
  
  .memo-count {
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
  }
  
  .date-details {
    padding: 1.5rem;
  }
  
  .calendar-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .mood-calendar {
    padding: 1rem;
  }
  
  .calendar-container {
    padding: 0.8rem;
  }
  
  .calendar-day {
    min-height: 50px;
    padding: 0.2rem;
  }
  
  .day-header {
    padding: 0.5rem 0.3rem;
    font-size: 0.8rem;
  }
  
  .date-details {
    padding: 1rem;
  }
  
  .mood-display {
    flex-direction: column;
    text-align: center;
  }
}
</style>