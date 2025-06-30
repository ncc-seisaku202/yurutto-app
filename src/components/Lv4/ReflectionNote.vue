<template>
  <div class="reflection-note">
    <h2 class="section-title">📝 ふりかえりノート</h2>

    <!-- Questions -->
    <div class="question-block q1 animated">
      <p class="question-text">🌀 この1週間をひとことで表すと、どんな感じだったかな？</p>
      <div class="options horizontal">
        <label><input type="radio" value="すっきり" v-model="answers.q1" /> すっきり</label>
        <label><input type="radio" value="もやもや" v-model="answers.q1" /> もやもや</label>
        <label><input type="radio" value="忙しかった" v-model="answers.q1" /> 忙しかった</label>
        <label><input type="radio" value="穏やか" v-model="answers.q1" /> 穏やか</label>
      </div>
    </div>
    <div class="question-block q2 animated">
      <p class="question-text">💪 今週、自分をちょっとほめられることはあった？</p>
      <div class="options horizontal">
        <label><input type="radio" value="できた！" v-model="answers.q2" /> できた！</label>
        <label><input type="radio" value="少しできた" v-model="answers.q2" /> 少しできた</label>
        <label><input type="radio" value="あまりできなかった" v-model="answers.q2" /> あまりできなかった</label>
      </div>
    </div>
    <div class="question-block q3 animated">
      <p class="question-text">🔮 来週はどんな気持ちで過ごしたい？</p>
      <div class="options horizontal">
        <label><input type="radio" value="楽しみ" v-model="answers.q3" /> 楽しみ</label>
        <label><input type="radio" value="ちょっと不安" v-model="answers.q3" /> ちょっと不安</label>
        <label><input type="radio" value="のんびり" v-model="answers.q3" /> のんびり</label>
      </div>
    </div>
    <div class="question-block q4 animated">
      <p class="question-text">🌱 気になったことや感じたこと、ちょこっとでも自由に書いてみませんか？（書かなくても大丈夫です）</p>
      <div class="textarea-wrapper">
        <textarea v-model="answers.q4" placeholder="例：久しぶりに朝の空気をゆっくり感じられて、気持ちよかったな〜。"></textarea>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="button-wrapper">
      <button @click="openModal" class="secondary">記録を見る</button>
      <button @click="saveNote">保存する</button>
    </div>

    <!-- Records Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="modal-close-btn">×</button>
        <div v-if="!selectedNote">
          <h3 class="modal-title">過去の記録</h3>
          <ul v-if="allNotes.length > 0" class="notes-list">
            <li v-for="note in allNotes" :key="note.id" @click="selectNote(note)" class="note-item">
              <span>{{ formatDate(note.timestamp) }}</span>
              <span>{{ note.answers.q1 }}</span>
            </li>
          </ul>
          <p v-else>まだ記録がありません。</p>
        </div>
        <div v-else class="note-detail">
          <button @click="selectedNote = null" class="back-btn">← 一覧へ戻る</button>
          <h3 class="modal-title">記録の詳細</h3>
          <p><strong>記録日時:</strong> {{ formatDate(selectedNote.timestamp) }}</p>
          <p><strong>Q1: この1週間をひとことで表すと？</strong></p>
          <p class="answer-box">{{ selectedNote.answers.q1 || '（無回答）' }}</p>
          <p><strong>Q2: 今週、自分をちょっとほめられることはあった？</strong></p>
          <p class="answer-box">{{ selectedNote.answers.q2 || '（無回答）' }}</p>
          <p><strong>Q3: 来週はどんな気持ちで過ごしたい？</strong></p>
          <p class="answer-box">{{ selectedNote.answers.q3 || '（無回答）' }}</p>
          <p><strong>Q4: 気になったことや感じたこと</strong></p>
          <p class="answer-box">{{ selectedNote.answers.q4 || '（無回答）' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const answers = ref({ q1: '', q2: '', q3: '', q4: '' })
const allNotes = ref([])
const showModal = ref(false)
const selectedNote = ref(null)

const KEY = 'reflectionNotes' // 複数形に変更

const resetForm = () => {
  answers.value = { q1: '', q2: '', q3: '', q4: '' }
}

const saveNote = () => {
  if (!answers.value.q1 && !answers.value.q2 && !answers.value.q3 && !answers.value.q4) {
    alert('何かひとつでも入力してくださいね。')
    return
  }
  const newNote = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    answers: { ...answers.value },
  }
  const existingNotes = JSON.parse(localStorage.getItem(KEY)) || []
  existingNotes.unshift(newNote)
  localStorage.setItem(KEY, JSON.stringify(existingNotes))
  alert('保存しました！')
  resetForm()
}

const loadAllNotes = () => {
  allNotes.value = JSON.parse(localStorage.getItem(KEY)) || []
}

const openModal = () => {
  loadAllNotes()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedNote.value = null
}

const selectNote = (note) => {
  selectedNote.value = note
}

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
/* Base styles are maintained */
.reflection-note {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 640px;
  margin: 2rem auto;
}
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #003366;
}
.question-block {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}
.question-block.q1 {
  background-color: #e6f2ff;
  animation-delay: 0s;
}
.question-block.q2 {
  background-color: #f9f1ff;
  animation-delay: 0.1s;
}
.question-block.q3 {
  background-color: #fff3f3;
  animation-delay: 0.2s;
}
.question-block.q4 {
  background-color: #f6f6f6;
  animation-delay: 0.3s;
  padding-bottom: 1.5rem;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.question-text {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 1.2rem;
  padding-left: 0.5rem;
}
.options.horizontal label {
  display: flex;
  align-items: center;
  font-weight: normal;
  color: #444;
  background: #eef4fa;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.options.horizontal label:hover {
  background-color: #dde8f5;
}
input[type='radio'] {
  margin-right: 0.4rem;
}
.textarea-wrapper {
  max-width: 95%;
  margin: 0 auto;
}
textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  background-color: #fff;
}

/* Updated and New Styles */
.button-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:hover {
  opacity: 0.9;
}
button {
  background-color: #007bff;
}
button.secondary {
  background-color: #6c757d;
}

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
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}
.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
}
.modal-title {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #003366;
}

.notes-list {
  list-style: none;
  padding: 0;
}
.note-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #eee;
}
.note-item:hover {
  background-color: #f0f5fa;
}
.note-item span:first-child {
  font-weight: 500;
}
.note-item span:last-child {
  color: #555;
}

.note-detail .back-btn {
  font-size: 0.9rem;
  background: #eee;
  color: #333;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1.5rem;
}
.note-detail p {
  margin-bottom: 0.5rem;
}
.note-detail p.answer-box {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 0.8rem;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  min-height: 1.5rem;
  white-space: pre-wrap;
}
</style>
