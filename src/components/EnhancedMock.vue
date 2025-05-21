<template>
  <div :class="['outer-wrapper', { dark: isDarkMode }]">
    <div class="container">
      <!-- タイトル -->
      <h1 class="title">ゆるっと。- 強化モック</h1>

      <!-- フィードバックメッセージ -->
      <div class="feedback">
        {{ randomMessage }}
      </div>

      <!-- 気分記録エリア -->
      <div class="section">
        <h2 class="section-title">今日の気分は？</h2>
        <div class="mood-buttons">
          <button
            v-for="mood in moods"
            :key="mood.label"
            :class="mood.class"
            @click="selectMood(mood.label)"
          >
            {{ mood.emoji }} {{ mood.label }}
          </button>
        </div>
        <p v-if="selectedMood">今の気分：{{ selectedMood }}</p>
        <textarea class="note" placeholder="一言メモを書いてみよう（任意）"></textarea>
      </div>

      <!-- 行動ガチャエリア -->
      <div class="section">
        <h2 class="section-title">行動ガチャ</h2>
        <button @click="rollGacha">🎲 ガチャを引く</button>
        <div v-if="actionSuggestion" class="gacha-card">👉 {{ actionSuggestion }}</div>
        <div class="gacha-hint">※気分によってガチャの内容が変わるよ（仮）</div>
      </div>

      <!-- 成長ログ -->
      <div class="section">
        <h2 class="section-title">成長ログ</h2>
        <p>Lv.4：「新しい行動ガチャ」開放！</p>
        <div class="exp-bar">
          <div class="exp-fill" style="width: 60%"></div>
        </div>
      </div>

      <!-- 気分グラフ（仮） -->
      <div class="section">
        <h2 class="section-title">気分の推移</h2>
        <div class="graph-placeholder">📈 グラフ（ここに折れ線 or 棒グラフ）</div>
      </div>

      <!-- カレンダー（仮） -->
      <div class="section">
        <h2 class="section-title">気分カレンダー</h2>
        <div class="calendar-placeholder">🗓️ カレンダーUI（色分けされた日別気分）</div>
      </div>

      <!-- 習慣支援リマインド（仮） -->
      <div class="section">
        <h2 class="section-title">リマインド</h2>
        <p>今日はまだ記録していません。</p>
        <button class="remind-button">通知を受け取る（仮）</button>
      </div>

      <!-- 共有・緊急UI -->
      <div class="section">
        <button class="share-button">そっと誰かに共有する（仮）</button>
        <button class="support-button">相談先を見る（仮）</button>
      </div>

      <!-- ナイトモード切り替え（仮） -->
      <div class="section">
        <h2 class="section-title">表示モード</h2>
        <label><input type="checkbox" v-model="isDarkMode" /> 🌙 ナイトモードに切り替える</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const moods = [
  { label: 'しんどい', emoji: '😞', class: 'mood-1' },
  { label: 'まあまあ', emoji: '😐', class: 'mood-2' },
  { label: 'いけるかも', emoji: '😊', class: 'mood-3' }
]

const messages = [
  'アプリを開いたあなた、えらい！',
  '今日もちゃんと起きてすごいよ。',
  '疲れててもここに来たのが偉業。',
  'どんな気分でも、それが今のあなた。'
]

const randomMessage = ref('')
const selectedMood = ref('')
const actionSuggestion = ref('')
const isDarkMode = ref(false)

onMounted(() => {
  const index = Math.floor(Math.random() * messages.length)
  randomMessage.value = messages[index]
})

function selectMood(label) {
  selectedMood.value = label
}

function rollGacha() {
  const actions = [
    '深呼吸してみよう',
    'スマホを置いて1分目を閉じよう',
    '水を飲もう',
    '軽く背伸びしてみよう',
    '「猫 GIF」で検索してみよう'
  ]
  const index = Math.floor(Math.random() * actions.length)
  actionSuggestion.value = actions[index]
}
</script>

<style scoped>
:global(html, body) {
  margin: 0;
  padding: 0;
  background: #f7faff;
  font-family: 'Arial', sans-serif;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
}

.outer-wrapper.dark {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.outer-wrapper.dark .container,
.outer-wrapper.dark .section {
  background-color: #2c2c2c;
  color: #e0e0e0;
}

.outer-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 40px 20px;
  transition: background-color 0.3s ease;
}

.container {
  max-width: 960px;
  width: 100%;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 30px;
}

.section {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: background-color 0.3s ease;
}

.section-title {
  width: 100%;
  text-align: center;
}

.mood-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.mood-buttons button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  cursor: pointer;
}

.mood-1 {
  background-color: #ffd6d6;
}

.mood-2 {
  background-color: #fff3b0;
}

.mood-3 {
  background-color: #c4f0c5;
}

.note {
  width: 100%;
  max-width: 600px;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.gacha-card {
  margin-top: 10px;
  background: #eaf8ff;
  border: 2px dashed #a0d3ff;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.gacha-hint {
  margin-top: 8px;
  font-size: 0.85em;
  color: #777;
}

.exp-bar {
  height: 12px;
  background: #eee;
  border-radius: 6px;
  margin-top: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
}

.exp-fill {
  height: 100%;
  background: #4fc3f7;
}

.graph-placeholder,
.calendar-placeholder {
  background: #f0f0f0;
  padding: 40px;
  border-radius: 10px;
  color: #999;
  width: 100%;
  max-width: 600px;
}

.feedback {
  text-align: center;
  font-size: 0.9em;
  color: #888;
  margin-bottom: 10px;
}

.share-button,
.support-button,
.remind-button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  max-width: 600px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
}

.share-button {
  background: #ffe0f0;
}

.support-button {
  background: #f0e0ff;
}

.remind-button {
  background: #e0f7fa;
}
</style>
