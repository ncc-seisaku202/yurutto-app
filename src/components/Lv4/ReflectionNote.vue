<template>
  <div class="reflection-note">
    <h2 class="section-title">📝 ふりかえりノート</h2>

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-indicator">データを読み込んでいます...</div>

    <!-- Input Form -->
    <div v-else class="reflection-form">
      <div class="question-block q1 animated">
        <p class="question-text">🌀 この1週間をひとことで表すと、どんな感じだったかな？</p>
        <div class="options horizontal">
          <label :class="{ 'checked': newNote.mood === 'すっきり' }"><input type="radio" value="すっきり" v-model="newNote.mood" /> すっきり</label>
          <label :class="{ 'checked': newNote.mood === 'もやもや' }"><input type="radio" value="もやもや" v-model="newNote.mood" /> もやもや</label>
          <label :class="{ 'checked': newNote.mood === '忙しかった' }"><input type="radio" value="忙しかった" v-model="newNote.mood" /> 忙しかった</label>
          <label :class="{ 'checked': newNote.mood === '穏やか' }"><input type="radio" value="穏やか" v-model="newNote.mood" /> 穏やか</label>
        </div>
      </div>
      <div class="question-block q2 animated">
        <p class="question-text">💪 今週、自分をちょっとほめられることはあった？</p>
        <div class="options horizontal">
          <label :class="{ 'checked': newNote.achievement === 'できた！' }"><input type="radio" value="できた！" v-model="newNote.achievement" /> できた！</label>
          <label :class="{ 'checked': newNote.achievement === '少しできた' }"><input type="radio" value="少しできた" v-model="newNote.achievement" /> 少しできた</label>
          <label :class="{ 'checked': newNote.achievement === 'あまりできなかった' }"><input type="radio" value="あまりできなかった" v-model="newNote.achievement" /> あまりできなかった</label>
        </div>
      </div>
      <div class="question-block q3 animated">
        <p class="question-text">🔮 来週はどんな気持ちで過ごしたい？</p>
        <div class="options horizontal">
          <label :class="{ 'checked': newNote.next_week_feeling === '楽しみ' }"><input type="radio" value="楽しみ" v-model="newNote.next_week_feeling" /> 楽しみ</label>
          <label :class="{ 'checked': newNote.next_week_feeling === 'ちょっと不安' }"><input type="radio" value="ちょっと不安" v-model="newNote.next_week_feeling" /> ちょっと不安</label>
          <label :class="{ 'checked': newNote.next_week_feeling === 'のんびり' }"><input type="radio" value="のんびり" v-model="newNote.next_week_feeling" /> のんびり</label>
        </div>
      </div>
      <div class="question-block q4 animated">
        <p class="question-text">🌱 気になったことや感じたこと、ちょこっとでも自由に書いてみませんか？</p>
        <div class="textarea-wrapper">
          <textarea v-model="newNote.memo" placeholder="例：久しぶりに朝の空気をゆっくり感じられて、気持ちよかったな〜。"></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="button-wrapper">
        <button @click="showModal = true" class="secondary">記録を見る</button>
        <button @click="addNote">保存する</button>
      </div>
    </div>

    <!-- Records Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="modal-close-btn">×</button>
        
        <!-- Note List View -->
        <div v-if="!selectedNote">
          <h3 class="modal-title">過去の記録</h3>
          <ul v-if="notes.length > 0" class="notes-list">
            <li v-for="note in notes" :key="note.id" @click="openModalWithNote(note)" class="note-item">
              <span>{{ formatDate(note.created_at) }}</span>
              <span>{{ note.mood }}</span>
            </li>
          </ul>
          <p v-else>まだ記録がありません。</p>
        </div>

        <!-- Note Detail/Edit View -->
        <div v-else class="note-detail">
          <button @click="selectedNote = null" class="back-btn">← 一覧へ戻る</button>
          <h3 class="modal-title">記録の詳細</h3>
          
          <div v-if="!isEditing">
            <p><strong>記録日時:</strong> {{ formatDate(selectedNote.created_at) }}</p>
            <p><strong>Q1: この1週間をひとことで表すと？</strong></p>
            <p class="answer-box">{{ selectedNote.mood || '（無回答）' }}</p>
            <p><strong>Q2: 今週、自分をちょっとほめられることはあった？</strong></p>
            <p class="answer-box">{{ selectedNote.achievement || '（無回答）' }}</p>
            <p><strong>Q3: 来週はどんな気持ちで過ごしたい？</strong></p>
            <p class="answer-box">{{ selectedNote.next_week_feeling || '（無回答）' }}</p>
            <p><strong>Q4: 気になったことや感じたこと</strong></p>
            <p class="answer-box">{{ selectedNote.memo || '（メモはありません）' }}</p>
            <div class="modal-actions">
              <button @click="isEditing = true">編集する</button>
              <button @click="deleteNote(selectedNote.id)" class="danger">削除する</button>
            </div>
          </div>

          <div v-else class="edit-view">
            <div class="form-group">
              <label>Q1: この1週間をひとことで表すと？</label>
              <select v-model="selectedNote.mood">
                <option>すっきり</option> <option>もやもや</option> <option>忙しかった</option> <option>穏やか</option>
              </select>
            </div>
            <div class="form-group">
              <label>Q2: 今週、自分をちょっとほめられることはあった？</label>
              <select v-model="selectedNote.achievement">
                <option>できた！</option> <option>少しできた</option> <option>あまりできなかった</option>
              </select>
            </div>
            <div class="form-group">
              <label>Q3: 来週はどんな気持ちで過ごしたい？</label>
              <select v-model="selectedNote.next_week_feeling">
                <option>楽しみ</option> <option>ちょっと不安</option> <option>のんびり</option>
              </select>
            </div>
            <div class="form-group">
              <label>Q4: 気になったことや感じたこと</label>
              <textarea v-model="selectedNote.memo"></textarea>
            </div>
            <div class="modal-actions">
              <button @click="updateNote">更新する</button>
              <button @click="isEditing = false" class="secondary">キャンセル</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'

// -- Data Refs --
const user = ref(null)
const notes = ref([])
const newNote = ref({
  mood: '',
  achievement: '',
  next_week_feeling: '',
  memo: ''
})

// -- UI State Refs --
const loading = ref(true)
const showModal = ref(false)
const selectedNote = ref(null)
const isEditing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

let subscription = null

// -- Supabase Functions --

// 1. Fetch initial data
const fetchNotes = async () => {
  if (!user.value) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('reflection_notes')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    notes.value = data
  } catch (error) {
    console.error('Error fetching notes:', error.message)
    triggerToast('データの読み込みに失敗しました', 'error')
  } finally {
    loading.value = false
  }
}

// 2. Add a new note
const addNote = async () => {
  if (!newNote.value.mood || !newNote.value.achievement || !newNote.value.next_week_feeling) {
    triggerToast('必須項目をすべて選択してください', 'error')
    return
  }
  try {
    const { data, error } = await supabase
      .from('reflection_notes')
      .insert([{ ...newNote.value, user_id: user.value.id }])
      .select()
      .single()
    if (error) throw error
    notes.value.unshift(data) // UIに即時反映
    // Realtime subscription will handle adding the note to the UI
    resetForm()
    triggerToast('記録を保存しました！')
  } catch (error) {
    console.error('Error adding note:', error.message)
    triggerToast('保存に失敗しました', 'error')
  }
}

// 3. Update a note
const updateNote = async () => {
  if (!selectedNote.value) return
  try {
    const { error } = await supabase
      .from('reflection_notes')
      .update({ 
        mood: selectedNote.value.mood,
        achievement: selectedNote.value.achievement,
        next_week_feeling: selectedNote.value.next_week_feeling,
        memo: selectedNote.value.memo
       })
      .eq('id', selectedNote.value.id)
    if (error) throw error
    // Realtime subscription will handle updating the UI
    isEditing.value = false
    triggerToast('記録を更新しました！')
  } catch (error) {
    console.error('Error updating note:', error.message)
    triggerToast('更新に失敗しました', 'error')
  }
}

// 4. Delete a note
const deleteNote = async (noteId) => {
  if (!confirm('本当にこの記録を削除しますか？')) return
  try {
    const { error } = await supabase.from('reflection_notes').delete().eq('id', noteId)
    if (error) throw error
    // Realtime subscription will handle removing the note from the UI
    closeModal()
    triggerToast('記録を削除しました')
  } catch (error) {
    console.error('Error deleting note:', error.message)
    triggerToast('削除に失敗しました', 'error')
  }
}

// 5. Realtime subscription
const setupSubscription = () => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
  subscription = supabase
    .channel('public:reflection_notes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'reflection_notes', filter: `user_id=eq.${user.value.id}` },
      (payload) => {
        console.log('Change received!', payload)
        if (payload.eventType === 'INSERT') {
          notes.value.unshift(payload.new)
        } else if (payload.eventType === 'UPDATE') {
          const index = notes.value.findIndex(n => n.id === payload.new.id)
          if (index !== -1) notes.value.splice(index, 1, payload.new)
        } else if (payload.eventType === 'DELETE') {
          notes.value = notes.value.filter(n => n.id !== payload.old.id)
        }
      }
    )
    .subscribe()
}

// -- UI Helper Functions --

const resetForm = () => {
  newNote.value = { mood: '', achievement: '', next_week_feeling: '', memo: '' }
}

const openModalWithNote = (note) => {
  selectedNote.value = { ...note } // Create a copy for editing
  isEditing.value = false
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedNote.value = null
  isEditing.value = false
}

const triggerToast = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  // Add a class based on type for styling
  const toastElement = document.querySelector('.toast-notification')
  if (toastElement) {
    toastElement.classList.remove('success', 'error') // Remove previous types
    toastElement.classList.add(type)
  }
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// -- Lifecycle Hooks --

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    await fetchNotes()
    setupSubscription()
  } else {
    console.log('User not logged in')
    loading.value = false
  }
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>

<style scoped>
/* Base styles are maintained */
.reflection-note {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #003366;
}
.question-block {
  margin-bottom: 1.5rem; /* Adjusted margin */
  padding: 1rem;
  border-radius: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}
.question-block.q1 { background-color: #e6f2ff; animation-delay: 0s; }
.question-block.q2 { background-color: #f9f1ff; animation-delay: 0.1s; }
.question-block.q3 { background-color: #fff3f3; animation-delay: 0.2s; }
.question-block.q4 { background-color: #f6f6f6; animation-delay: 0.3s; padding-bottom: 1.5rem; }
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

.question-text { font-weight: 600; margin-bottom: 0.8rem; color: #333; }
.options.horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 1.2rem;
}
.options.horizontal label {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.options.horizontal label:hover { background-color: #f0f5fa; }
.options.horizontal input[type='radio']:checked + span { color: #007bff; font-weight: bold; }
input[type='radio'] { display: none; } /* Hide original radio button */
.options.horizontal label.checked { background-color: #d4eaff; border-color: #007bff; }

.textarea-wrapper { max-width: 100%; margin: 0 auto; }
textarea { width: 100%; min-height: 100px; padding: 0.8rem; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; resize: vertical; box-sizing: border-box; }

.button-wrapper { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
button { padding: 0.7rem 1.5rem; font-size: 1rem; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
button:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
button { background-color: #007bff; }
button.secondary { background-color: #6c757d; }
button.danger { background-color: #dc3545; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 550px; max-height: 85vh; overflow-y: auto; position: relative; }
.modal-close-btn { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; }
.modal-title { font-size: 1.4rem; margin-bottom: 1.5rem; color: #003366; text-align: center; }

.notes-list { list-style: none; padding: 0; }
.note-item { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 1rem; border-radius: 8px; cursor: pointer; transition: background-color 0.2s ease; border-bottom: 1px solid #eee; }
.note-item:hover { background-color: #f0f5fa; }
.note-item span:first-child { font-weight: 500; }
.note-item span:last-child { color: #555; background: #eee; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9rem; }

.note-detail .back-btn { font-size: 0.9rem; background: #eee; color: #333; padding: 0.4rem 0.8rem; margin-bottom: 1.5rem; }
.note-detail p { margin-bottom: 0.5rem; }
.note-detail p.answer-box { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 0.8rem; margin-top: 0.2rem; margin-bottom: 1rem; min-height: 1.5rem; white-space: pre-wrap; }

.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }

.edit-view .form-group { margin-bottom: 1rem; }
.edit-view label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
.edit-view select, .edit-view textarea { width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; }

.loading-indicator, .toast-notification {
  text-align: center; padding: 1rem; font-size: 1.1rem; color: #555;
}
.toast-notification {
  position: fixed; top: 20px; right: 20px; background-color: #28a745; color: white; padding: 0.8rem 1.5rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 2000; font-weight: bold;}
.toast-notification.error { background-color: #dc3545; }

@media (max-width: 480px) {
  .reflection-note {
    padding: 1rem;
  }

  .options.horizontal {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
