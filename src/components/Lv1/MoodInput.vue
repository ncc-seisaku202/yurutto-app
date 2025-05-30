<template>
  <div
    class="form-container"
    :style="{ backgroundColor: showConfirm ? selectedColor : '#fff' }"
  >
    <div v-if="!showConfirm">
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

    <div v-else class="confirm-box">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['mood-selected'])

const moodOptions = ref([
  { label: 'しんどい', emoji: '😔', color: '#ff4dd2', value: 'tired' },       // ネオンピンク
  { label: 'まあまあ', emoji: '😐', color: '#00ffff', value: 'so-so' },        // ネオンシアン
  { label: 'いけるかも', emoji: '😊', color: '#ffb347', value: 'maybe-ok' },    // ネオンオレンジ
])

const selectedMood = ref(null)
const selectedLabel = ref('')
const selectedColor = ref('')
const selectedEmoji = ref('')
const showConfirm = ref(false)

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

function confirmMood() {
  emit('mood-selected', {
    value: selectedMood.value,
    label: selectedLabel.value,
    color: selectedColor.value,
    emoji: selectedEmoji.value,
    date: new Date().toISOString(),
  })
  // 記録後にリセット
  goBack()
}

// ESCキーでの戻る機能
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showConfirm.value) {
    goBack()
  }
}

// マウント時にキーボードイベントリスナーを追加
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
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
  width: 90%; /* 画面サイズに応じて */
  max-width: 500px; /* サイズを縮小 */
  margin: 1.5rem auto; /* マージンを縮小 */
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem; /* パディングを縮小 */
  text-align: center;
  box-shadow: 0 0 10px var(--shadow-color);
  transition: background-color 0.4s ease;
}

.title {
  font-size: 1.8rem; /* フォントサイズを縮小 */
  margin-bottom: 1.5rem; /* マージンを縮小 */
  color: var(--text-color);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1.2rem; /* ギャップを少し縮小 */
  flex-wrap: wrap;
  margin-bottom: 1.5rem; /* マージンを縮小 */
}

.mood-button {
  padding: 0.8rem 1.5rem; /* パディングを縮小 */
  width: 150px; /* 幅を縮小 */
  height: 60px; /* 高さを少し増加（アイコン分） */
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1.1rem; /* フォントサイズを縮小 */
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

.mood-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.subtext {
  font-size: 1rem; /* フォントサイズを少し縮小 */
  color: #333;
}

.confirm-box {
  margin-top: 6vh; /* マージンを少し縮小 */
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
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.confirm-text {
  font-size: 1.4rem; /* フォントサイズを縮小 */
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
  padding: 0.8rem 2.5rem; /* パディングを縮小 */
  font-size: 1.2rem; /* フォントサイズを縮小 */
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

/* レスポンシブデザインの改善 */
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
  
  .title {
    font-size: 1.6rem;
  }
  
  .confirm-text {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 0.8rem;
  }
  
  .title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  
  .mood-button {
    height: 55px;
    font-size: 1rem;
  }
  
  .mood-emoji {
    font-size: 1.2rem;
  }
  
  .mood-label {
    font-size: 0.9rem;
  }
  
  .selected-emoji {
    font-size: 2.5rem;
  }
  
  .confirm-text {
    font-size: 1.1rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .back-button,
  .ok-button {
    font-size: 1rem;
    padding: 0.7rem 1.5rem;
    width: 100%;
    max-width: 200px;
  }
}
</style>
