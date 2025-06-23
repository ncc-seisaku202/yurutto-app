<template>
  <div
    class="form-container"
    :style="{ backgroundColor: showConfirm ? selectedColor : '#fff' }"
  >
    <!-- 記録前＆確認画面でもない場合 (初期表示) -->
    <div v-if="!showConfirm && !isCompleted">
      <h1 class="title">今日の気分は？</h1>
      <div class="button-container">
        <button
          v-for="(option, index) in moodOptions"
          :key="index"
          :style="{ backgroundColor: option.color }"
          class="mood-button"
          :aria-label="`気分を${option.label}に設定`"
          @click="selectMood(option)"
          @keydown.enter="selectMood(option)"
          @keydown.space.prevent="selectMood(option)"
        >
          <span class="mood-emoji">{{ option.emoji }}</span>
          <span class="mood-label">{{ option.label }}</span>
        </button>
      </div>
      <p class="subtext">一つ選ぼう！！</p>
    </div>

    <!-- 確認画面の場合 -->
    <div v-else-if="showConfirm">
      <div class="selected-mood-display">
        <span class="selected-emoji">{{ selectedEmoji }}</span>
        <p class="confirm-text">今日の気分は <strong>{{ selectedLabel }}</strong> で記録する？</p>
      </div>
      <div class="button-group">
        <button
          class="back-button"
          @click="goBack"
          @keydown.enter="goBack"
          @keydown.space.prevent="goBack"
          @keydown.esc="goBack"
          aria-label="選択をやり直す"
        >
          戻る
        </button>
        <button
          class="ok-button"
          @click="confirmMood"
          @keydown.enter="confirmMood"
          @keydown.space.prevent="confirmMood"
          aria-label="気分の記録を確定"
        >
          OK
        </button>
      </div>
    </div>

    <!-- 記録完了後の場合 -->
    <div v-else-if="isCompleted" class="completed-box">
      <h1 class="title">記録完了！</h1>
      <div class="completed-mood" :style="{ backgroundColor: completedMood.color }">
        {{ completedMood.label }}
      </div>
      <p class="completed-text">今日の気分を記録しました 🎉</p>
      <!-- 「もう一度選ぶ」ボタンは開発用に残すか、仕様に応じて削除 -->
      <!-- <button class="reset-button" @click="resetSelection">もう一度選ぶ</button> -->
    </div>

    <!-- // 開発者ボタン -->
    <div class="dev-button-container">
      <button class="dev-reset-button" @click="resetMood">
        🛠 開発者用：記録をリセット
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// supabaseとmoodsのパスは実際のプロジェクト構成に合わせてください
import { supabase } from '@/lib/supabase' 
import { moodMap } from '@/constants/moods'

const emit = defineEmits(['mood-selected'])

const moodOptions = ref([
  { label: 'しんどい', emoji: '😔', color: '#ff4dd2', value: 'tired' },
  { label: 'まあまあ', emoji: '😐', color: '#00ffff', value: 'so-so' },
  { label: 'いけるかも', emoji: '😊', color: '#ffb347', value: 'maybe-ok' },
])

const selectedMood = ref(null)
const selectedLabel = ref('')
const selectedColor = ref('')
const selectedEmoji = ref('')
const showConfirm = ref(false)
const isCompleted = ref(false)
const completedMood = ref(null)

// 今日の日付文字列を取得 (YYYY-MM-DD)
function getTodayDateStr() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// ページ読み込み時に今日の気分が記録済みかチェックする
async function checkMoodRecorded() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // ローカルストレージでフォールバック
      const storedDate = localStorage.getItem('mood-recorded-date')
      const submitted = localStorage.getItem('mood-submitted') === 'true'
      if (storedDate === getTodayDateStr() || submitted) {
        isCompleted.value = true
        // 完了時の表示情報を復元
        const localMood = JSON.parse(localStorage.getItem('last-mood'))
        if (localMood) completedMood.value = localMood
      }
      return
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('moods')
      .select('mood, mood_level')
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())
      .single() // 今日は1件のはずなのでsingle()でOK

    if (error && error.code !== 'PGRST116') { // PGRST116は「行が見つからない」エラーなので無視
      throw error
    }
    
    if (data) {
      isCompleted.value = true
      // 完了画面用のデータを設定
      const moodOption = moodOptions.value.find(o => o.label === data.mood)
      if (moodOption) {
        completedMood.value = {
          label: data.mood,
          value: moodOption.value,
          color: moodOption.color,
        }
      }
    }
  } catch (err) {
    console.error('記録チェックエラー:', err.message)
  }
}

function selectMood(option) {
  selectedMood.value = option.value
  selectedLabel.value = option.label
  selectedColor.value = option.color
  selectedEmoji.value = option.emoji
  showConfirm.value = true
}

function goBack() {
  showConfirm.value = false
  selectedMood.value = null
  selectedLabel.value = ''
  selectedColor.value = ''
  selectedEmoji.value = ''
}

async function confirmMood() {
  try {
    const moodData = {
      value: selectedMood.value,
      label: selectedLabel.value,
      color: selectedColor.value,
      emoji: selectedEmoji.value,
      date: new Date().toISOString(),
    }
    
    // ユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Supabaseにinsert（ログインしている場合のみ）
      const { error } = await supabase
        .from('moods')
        .insert([
          {
            id: crypto.randomUUID(),
            user_id: user.id,
            mood: moodData.label,
            mood_level: moodMap[moodData.label],
          },
        ])

      if (error) {
        throw new Error(`Supabaseへの保存に失敗: ${error.message}`)
      }
    } else {
       console.warn('ユーザーがログインしていません。ローカルでのみ記録します。')
    }
    
    // ログイン状態に関わらずローカルストレージにも記録（フォールバック用）
    localStorage.setItem('mood-recorded-date', getTodayDateStr())
    localStorage.setItem('last-mood', JSON.stringify({ label: moodData.label, value: moodData.value, color: moodData.color }))
    localStorage.setItem('mood-submitted', 'true')


    // 完了状態を設定
    completedMood.value = {
      label: moodData.label,
      value: moodData.value,
      color: moodData.color
    }

    emit('mood-selected', moodData)

    showConfirm.value = false
    isCompleted.value = true
    document.dispatchEvent(new Event('mood-recorded'))

  } catch (error) {
    console.error('予期しないエラー:', error)
    alert('記録に失敗しました。')
    goBack() // エラー時は選択画面に戻す
  }
}

// 開発者用リセットボタン
function resetMood() {
  localStorage.removeItem('mood-recorded-date')
  localStorage.removeItem('last-mood')
  localStorage.removeItem('mood-submitted')
  isCompleted.value = false
  completedMood.value = null
  goBack()
  console.log('開発者用リセットが実行されました。')
}

// ESCキーで戻る
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showConfirm.value) {
    goBack()
  }
}

onMounted(() => {
  checkMoodRecorded()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
:root {
  --primary-color: #00bfff;
  --primary-hover: #009acd;
  --border-color: #000;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --text-color: #000;
  --background-color: #fff;
}

.form-container {
  width: 90%;
  max-width: 500px;
  margin: 1.5rem auto;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 0 10px var(--shadow-color);
  transition: background-color 0.4s ease;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.mood-button {
  padding: 0.8rem 1.5rem;
  width: 150px;
  height: 60px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-color);
  cursor: pointer;
  box-shadow: 0 0 10px white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.mood-emoji {
  font-size: 1.4rem;
  line-height: 1;
}

.mood-label {
  font-size: 1rem;
  line-height: 1;
}

.mood-button:hover,
.mood-button:focus {
  transform: scale(1.05);
  box-shadow: 0 0 20px white;
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.subtext {
  font-size: 1rem;
  color: #333;
}

.selected-mood-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.selected-emoji {
  font-size: 3rem;
  line-height: 1;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.confirm-text {
  font-size: 1.4rem;
  color: var(--text-color);
  text-align: center;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.back-button {
  background-color: #6c757d;
  border: 1px solid var(--border-color);
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 12px;
  cursor: pointer;
  color: var(--background-color);
  font-weight: bold;
  transition: background 0.2s ease, transform 0.1s ease;
  min-width: 100px;
}

.back-button:hover,
.back-button:focus {
  background-color: #5a6268;
  transform: translateY(-1px);
  outline: 2px solid #6c757d;
  outline-offset: 2px;
}

.ok-button {
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  padding: 0.8rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  color: var(--background-color);
  font-weight: bold;
  transition: background 0.2s ease, transform 0.1s ease;
  min-width: 100px;
}

.ok-button:hover,
.ok-button:focus {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.dev-button-container {
  margin-top: 2rem;
  text-align: center;
}

.dev-reset-button {
  background-color: #ff4444;
  color: white;
  font-weight: bold;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  box-shadow: 0 0 8px rgba(255, 68, 68, 0.6);
}

.dev-reset-button:hover {
  background-color: #cc0000;
}

.completed-box {
  margin-top: 5vh;
  text-align: center;
}

.completed-mood {
  display: inline-block;
  padding: 1.5rem 3rem;
  margin: 2rem 0;
  border: 2px solid #000;
  border-radius: 12px;
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.completed-text {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 2rem;
}

.reset-button {
  background-color: #28a745;
  border: 1px solid #000;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  transition: background 0.2s ease;
}

.reset-button:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .form-container {
    width: 95%;
    padding: 1rem;
    margin: 1rem auto;
  }

  .button-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .mood-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>