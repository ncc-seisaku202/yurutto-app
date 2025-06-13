<template>
  <div class="mood-calendar">
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-button">&lt;</button>
      <h2 class="month-year">{{ currentYear }}年 {{ currentMonth }}月</h2>
      <button @click="nextMonth" class="nav-button">&gt;</button>
    </div>
    
    <div class="calendar-grid">
      <!-- 曜日ヘッダー -->
      <div class="day-header sunday">日</div>
      <div class="day-header">月</div>
      <div class="day-header">火</div>
      <div class="day-header">水</div>
      <div class="day-header">木</div>
      <div class="day-header">金</div>
      <div class="day-header saturday">土</div>
      
      <!-- 空白セル（前月の日付） -->
      <div 
        v-for="blank in firstDayOfWeek" 
        :key="`blank-${blank}`" 
        class="day-cell blank"
      ></div>
      
      <!-- 日付セル -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day-cell"
        :class="getDayClass(day)"
        @click="selectDay(day)"
      >
        <span class="day-number">{{ day }}</span>
        <div v-if="getMoodForDay(day)" class="mood-content">
          <div class="mood-emoji">{{ getMoodEmoji(day) }}</div>
          <div class="mood-indicator" :class="getMoodClass(day)"></div>
        </div>
      </div>
    </div>
    
    <!-- 詳細表示モーダル -->
    <div v-if="selectedDayData" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDayData.date }} の記録</h3>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="mood-info">
            <h4>気分</h4>
            <div class="mood-display" :class="getMoodClassByLevel(selectedDayData.moodLevel)">
              <span class="mood-emoji-large">{{ getMoodEmojiByLevel(selectedDayData.moodLevel) }}</span>
              {{ getMoodText(selectedDayData.moodLevel) }}
            </div>
          </div>
          <div class="gacha-info">
            <h4>ガチャ結果</h4>
            <p>{{ selectedDayData.gachaResult }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// リアクティブデータ
const currentDate = ref(new Date())
const selectedDayData = ref(null)

// Supabaseから取得したデータをここに入れる
const moodRecords = ref([])

// 計算プロパティ
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
})

// メソッド
const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 2, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1)
}

const getMoodForDay = (day) => {
  const dateString = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return moodRecords.value.find(record => record.date === dateString)
}

const getMoodClass = (day) => {
  const mood = getMoodForDay(day)
  if (!mood) return ''

  switch (mood.moodLevel) {
    case 2: return 'mood-bad'     // しんどい
    case 3: return 'mood-normal'  // まあまあ
    case 4: return 'mood-good'    // いけるかも
    default: return ''            // 1, 5 は表示しない
  }
}

const getMoodClassByLevel = (level) => {
  switch (level) {
    case 2: return 'mood-bad'
    case 3: return 'mood-normal'
    case 4: return 'mood-good'
    default: return ''
  }
}

const getMoodText = (level) => {
  switch (level) {
    case 2: return 'しんどい'
    case 3: return 'まあまあ'
    case 4: return 'いけるかも'
    default: return ''
  }
}

const getMoodEmoji = (day) => {
  const mood = getMoodForDay(day)
  if (!mood) return ''

  switch (mood.moodLevel) {
    case 2: return '😔'
    case 3: return '😐'
    case 4: return '😊'
    default: return ''
  }
}

const getMoodEmojiByLevel = (level) => {
  switch (level) {
    case 2: return '😔'
    case 3: return '😐'
    case 4: return '😊'
    default: return ''
  }
}

const getDayClass = (day) => {
  const dayOfWeek = new Date(currentYear.value, currentMonth.value - 1, day).getDay()
  const classes = []
  
  if (dayOfWeek === 0) classes.push('sunday')
  if (dayOfWeek === 6) classes.push('saturday')
  
  const mood = getMoodForDay(day)
  if (mood) {
    classes.push('has-mood')
    classes.push(`mood-bg-${mood.moodLevel}`)
  }
  
  return classes.join(' ')
}

const selectDay = (day) => {
  const mood = getMoodForDay(day)
  if (mood) {
    selectedDayData.value = {
      ...mood,
      date: `${currentYear.value}年${currentMonth.value}月${day}日`
    }
  }
}

const closeModal = () => {
  selectedDayData.value = null
}

onMounted(async () => {
  currentDate.value = new Date()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('ユーザー情報取得失敗:', userError)
    return
  }

  const { data, error } = await supabase
    .from('moods')
    .select('created_at, mood_level')
    .eq('user_id', user.id)
    .in('mood_level', [2, 3, 4])
    .order('created_at', { ascending: true })

  if (error) {
    console.error('気分データ取得失敗:', error)
    return
  }

  // 日付文字列を整えて保存
  moodRecords.value = data.map(entry => ({
    date: entry.created_at.split('T')[0],
    moodLevel: entry.mood_level
  }))
})
</script>

<style scoped>
.mood-calendar {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #fef7f0 0%, #f8f4f0 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
}

.month-year {
  font-size: 1.6rem;
  font-weight: 600;
  color: #5a4a42;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

.nav-button {
  background: linear-gradient(135deg, #f4a6cd 0%, #f093c4 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(240, 147, 196, 0.3);
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: linear-gradient(135deg, #f093c4 0%, #e67db8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 147, 196, 0.4);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  background: transparent;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}

.day-header {
  background: linear-gradient(135deg, #fff5f8 0%, #f0e6ea 100%);
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #6b5b73;
  border-radius: 12px;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.day-header.sunday {
  color: #e67e9b;
  background: linear-gradient(135deg, #fef0f4 0%, #f8e6ea 100%);
}

.day-header.saturday {
  color: #7ba7d9;
  background: linear-gradient(135deg, #f0f6ff 0%, #e6f0fa 100%);
}

.day-cell {
  background: rgba(255, 255, 255, 0.8);
  min-height: 85px;
  padding: 8px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
}

.day-cell:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.day-cell.blank {
  background: rgba(248, 249, 250, 0.3);
  cursor: default;
  box-shadow: none;
}

.day-cell.blank:hover {
  transform: none;
  background: rgba(248, 249, 250, 0.3);
}

.day-cell.sunday .day-number {
  color: #e67e9b;
}

.day-cell.saturday .day-number {
  color: #7ba7d9;
}

.day-cell.has-mood {
  cursor: pointer;
}

.day-cell.has-mood:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 気分に応じた背景色 */
.day-cell.mood-bg-2 {
  background: linear-gradient(135deg, #ffeef2 0%, #ffe0e8 100%);
}

.day-cell.mood-bg-3 {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}

.day-cell.mood-bg-4 {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 1rem;
  line-height: 1.2;
}

.mood-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: auto;
}

.mood-emoji {
  font-size: 1.2rem;
  line-height: 1;
}

.mood-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.mood-bad {
  background: linear-gradient(135deg, #ffb3ba 0%, #ff9aa2 100%);
}

.mood-normal {
  background: linear-gradient(135deg, #ffe066 0%, #ffd93d 100%);
}

.mood-good {
  background: linear-gradient(135deg, #b3e5b3 0%, #90d690 100%);
}

/* モーダルスタイル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #fefbf8 100%);
  border-radius: 24px;
  padding: 28px;
  max-width: 420px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(240, 147, 196, 0.1);
  padding-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  color: #5a4a42;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.close-button {
  background: rgba(240, 147, 196, 0.1);
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #b08a93;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(240, 147, 196, 0.2);
  color: #8a6b75;
  transform: scale(1.1);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mood-info, .gacha-info {
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 244, 240, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.mood-info h4, .gacha-info h4 {
  margin: 0 0 12px 0;
  color: #5a4a42;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.mood-display {
  padding: 16px 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mood-emoji-large {
  font-size: 1.4rem;
}

.gacha-info p {
  margin: 0;
  font-size: 1.1rem;
  color: #5a4a42;
  line-height: 1.5;
  font-weight: 500;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .mood-calendar {
    padding: 16px;
    margin: 8px;
  }
  
  .calendar-header {
    margin-bottom: 20px;
  }
  
  .month-year {
    font-size: 1.4rem;
  }
  
  .nav-button {
    padding: 10px 14px;
    font-size: 1rem;
  }
  
  .calendar-grid {
    gap: 6px;
    padding: 12px;
  }
  
  .day-header {
    padding: 10px 6px;
    font-size: 0.85rem;
  }
  
  .day-cell {
    min-height: 70px;
    padding: 6px;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  .mood-emoji {
    font-size: 1rem;
  }
  
  .mood-indicator {
    width: 14px;
    height: 14px;
  }
  
  .modal-content {
    margin: 16px;
    padding: 24px;
    border-radius: 20px;
  }
  
  .modal-header h3 {
    font-size: 1.2rem;
  }
  
  .mood-info, .gacha-info {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .mood-calendar {
    padding: 12px;
    margin: 4px;
  }
  
  .calendar-grid {
    gap: 4px;
    padding: 8px;
  }
  
  .day-cell {
    min-height: 60px;
    padding: 4px;
  }
  
  .day-number {
    font-size: 0.85rem;
  }
  
  .mood-emoji {
    font-size: 0.9rem;
  }
  
  .mood-indicator {
    width: 12px;
    height: 12px;
  }
  
  .modal-content {
    margin: 12px;
    padding: 20px;
  }
}
</style>
