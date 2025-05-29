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
          @click="selectMood(option)"
        >
          {{ option.label }}
        </button>
      </div>
      <p class="subtext">一つ選ぼう！！</p>
    </div>

    <div v-else class="confirm-box">
      <p class="confirm-text">今日の気分は <strong>{{ selectedLabel }}</strong> で記録する？</p>
      <button class="ok-button" @click="confirmMood">OK</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['mood-selected'])

const moodOptions = ref([
  { label: 'しんどい', color: '#ff4dd2', value: 'tired' },       // ネオンピンク
  { label: 'まあまあ', color: '#00ffff', value: 'so-so' },        // ネオンシアン
  { label: 'いけるかも', color: '#ffb347', value: 'maybe-ok' },    // ネオンオレンジ
])

const selectedMood = ref(null)
const selectedLabel = ref('')
const selectedColor = ref('')
const showConfirm = ref(false)

function selectMood(option) {
  selectedMood.value = option.value
  selectedLabel.value = option.label
  selectedColor.value = option.color
  showConfirm.value = true
}

function confirmMood() {
  emit('mood-selected', {
    value: selectedMood.value,
    label: selectedLabel.value,
    color: selectedColor.value,
    date: new Date().toISOString(),
  })
  showConfirm.value = false
}
</script>

<style scoped>
.form-container {
  width: 90%; /* 画面サイズに応じて */
  max-width: 650px; /* 行動ガチャと同じ幅に */
  margin: 2rem auto;
  background: #fff;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.4s ease;
}

.title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #000;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.mood-button {
  padding: 1rem 2rem;
  width: 180px;
  height: 60px;
  border: 1px solid #000;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  box-shadow: 0 0 10px white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mood-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px white;
}

.subtext {
  font-size: 1.1rem;
  color: #333;
}

.confirm-box {
  margin-top: 10vh;
}

.confirm-text {
  font-size: 1.8rem;
  color: #000;
}

.ok-button {
  margin-top: 2rem;
  background-color: #00bfff;
  border: 1px solid #000;
  padding: 1rem 3rem;
  font-size: 1.4rem;
  border-radius: 12px;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  transition: background 0.2s ease;
}

.ok-button:hover {
  background-color: #009acd;
}
</style>
