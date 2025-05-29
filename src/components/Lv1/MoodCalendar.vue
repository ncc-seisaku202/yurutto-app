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
        <div v-if="getMoodForDay(day)" class="mood-indicator" :class="getMoodClass(day)"></div>
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
import moodData from '@/data/moodData.json'

// リアクティブデータ
const currentDate = ref(new Date())
const selectedDayData = ref(null)

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
  return moodData.moodRecords.find(record => record.date === dateString)
}

const getMoodClass = (day) => {
  const mood = getMoodForDay(day)
  if (!mood) return ''
  
  switch (mood.moodLevel) {
    case 1: return 'mood-bad'
    case 2: return 'mood-normal'
    case 3: return 'mood-good'
    default: return ''
  }
}

const getMoodClassByLevel = (level) => {
  switch (level) {
    case 1: return 'mood-bad'
    case 2: return 'mood-normal'
    case 3: return 'mood-good'
    default: return ''
  }
}

const getMoodText = (level) => {
  switch (level) {
    case 1: return '悪い'
    case 2: return '普通'
    case 3: return '良い'
    default: return ''
  }
}

const getDayClass = (day) => {
  const dayOfWeek = new Date(currentYear.value, currentMonth.value - 1, day).getDay()
  const classes = []
  
  if (dayOfWeek === 0) classes.push('sunday')
  if (dayOfWeek === 6) classes.push('saturday')
  
  const mood = getMoodForDay(day)
  if (mood) classes.push('has-mood')
  
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

onMounted(() => {
  // 現在の日付に設定
  currentDate.value = new Date()
})
</script>

<style scoped>
.mood-calendar {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-year {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nav-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
}

.nav-button:hover {
  background: #0056b3;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
  border: 1px solid #ddd;
}

.day-header {
  background: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.day-header.sunday {
  color: #dc3545;
}

.day-header.saturday {
  color: #007bff;
}

.day-cell {
  background: white;
  min-height: 80px;
  padding: 5px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-cell:hover {
  background: #f8f9fa;
}

.day-cell.blank {
  background: #f8f9fa;
  cursor: default;
}

.day-cell.sunday .day-number {
  color: #dc3545;
}

.day-cell.saturday .day-number {
  color: #007bff;
}

.day-cell.has-mood {
  cursor: pointer;
}

.day-cell.has-mood:hover {
  background: #e9ecef;
}

.day-number {
  font-weight: bold;
  margin-bottom: 5px;
}

.mood-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-top: auto;
}

.mood-bad {
  background-color: #dc3545;
}

.mood-normal {
  background-color: #ffc107;
}

.mood-good {
  background-color: #28a745;
}

/* モーダルスタイル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mood-info, .gacha-info {
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
}

.mood-info h4, .gacha-info h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.mood-display {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: white;
  font-weight: bold;
}

.gacha-info p {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .mood-calendar {
    padding: 10px;
  }
  
  .day-cell {
    min-height: 60px;
    font-size: 0.9rem;
  }
  
  .mood-indicator {
    width: 15px;
    height: 15px;
  }
  
  .modal-content {
    margin: 20px;
  }
}
</style>
