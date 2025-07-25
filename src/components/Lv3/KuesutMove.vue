<template>
  <div class="my-plan">
    <h1 class="section-title">⚔ クエスト作成</h1>

    <div class="card-section">
      <!-- テンプレート選択 -->
      <div class="form-group">
        <label for="template-select">テンプレート選択</label>
        <select id="template-select" v-model="selectedTemplateId" @change="applyTemplate" :disabled="quest.id && !isEditing">
          <option disabled value="">テンプレートを選んでください</option>
          <option value="reset">選択を解除</option>
          <option v-for="template in templates" :key="template.id" :value="template.id">
            {{ template.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="card-section">
      <!-- クエスト作成フォーム -->
      <div class="form-group">
        <label for="quest-name">クエスト名</label>
        <input id="quest-name" ref="questNameInput" v-model="quest.name" placeholder="例: 毎日早起きチャレンジ" :disabled="quest.id && !isEditing" />
      </div>
      <div class="form-group">
        <label for="quest-duration">期間</label>
        <select id="quest-duration" v-model.number="quest.duration" :disabled="quest.id && !isEditing">
          <option disabled value="">選択してください</option>
          <option v-for="day in 7" :key="day" :value="day">{{ day }}日間</option>
        </select>
      </div>
      <div class="form-group">
        <label for="quest-memo">内容メモ</label>
        <textarea id="quest-memo" v-model="quest.memo" rows="3" placeholder="クエストの詳細を書いてください" :disabled="quest.id && !isEditing"></textarea>
      </div>

      <!-- ボタンエリア -->
      <div class="mt-4">
        <!-- 新規作成時 or 非編集中 -->
        <button v-if="!quest.id || !isEditing" @click="handleCreateOrEdit" class="create-quest-button">
          {{ quest.id ? 'クエストを更新' : 'クエストを作成' }}
        </button>

        <!-- 編集中 -->
        <div v-if="quest.id && isEditing" class="edit-buttons">
          <button @click="handleUpdate" class="update-button">
            クエストを更新する
          </button>
          <button @click="cancelEdit" class="cancel-button">
            キャンセル
          </button>
        </div>
      </div>
    </div>

    <div v-if="quest.id" class="card-section">
      <!-- 進捗管理 -->
      <div class="form-group">
        <label>進捗管理</label>
        <p v-if="remainingDays !== null" class="remaining-days">
          クエスト終了まであと <strong>{{ remainingDays }}</strong> 日
        </p>
        <button
          @click="toggleCompletion"
          :disabled="isTodayCompleted || remainingDays === 0"
          class="progress-button"
          :class="{ completed: isTodayCompleted, disabled: isTodayCompleted || remainingDays === 0 }"
        >
          {{ isTodayCompleted ? '今日のクエスト達成済み ✔' : '今日のクエストを達成する' }}
        </button>
      </div>

      <div v-if="remainingDays === 0" class="quest-end-section">
        <h2 class="quest-end-title">クエスト期間終了！</h2>
        <p class="quest-end-message">このクエストは終了しました。新しいクエストを作成しましょう！</p>
        <button @click="startNewQuest" class="new-quest-button">
          新しいクエストを作成する
        </button>
      </div>
    </div>

    <!-- 開発者用: リセットボタン -->
    <div class="mt-4" v-if="quest.id">
      <button @click="resetProgress" class="reset-button">
        🔄 進捗をリセット（開発用）
      </button>
    </div>

    <!-- 達成時フィードバック -->
    <div v-if="isTodayCompleted" class="feedback-card">
      <h2 class="feedback-title">🎉 クエスト達成！</h2>
      <p>経験値 +100</p>
      <p>祝福メッセージ: {{ randomMessage }}</p>
    </div>

    <!-- 累計経験値で木を成長表示 -->
    <div class="mt-10 flex justify-center">
      <SeityouView :exp="totalExp" />
    </div>

    <!-- 確認モーダル -->
    <div v-if="isConfirmModalVisible" class="modal-overlay" @click.self="handleConfirmCompletion(false)">
      <div class="modal-content">
        <h3>クエスト達成</h3>
        <p>今日のクエストを達成しましたか？</p>
        <div class="modal-buttons">
          <button @click="handleConfirmCompletion(true)" class="confirm-button">はい</button>
          <button @click="handleConfirmCompletion(false)" class="cancel-button">いいえ</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="showToast" class="toast-notification">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { supabase } from '@/lib/supabase';
import SeityouView from './SeityouView.vue';

const quest = ref({
  id: null,
  name: '',
  duration: '',
  memo: '',
  start_date: null,
  completed_dates: [],
});
const originalQuest = ref(null);
const isEditing = ref(false);

const user = ref(null);
const isLoading = ref(true);
const userTotalExp = ref(0);

const isConfirmModalVisible = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const selectedTemplateId = ref('');
const totalExp = computed(() => userTotalExp.value);
const randomMessage = ref('');

const successMessages = [
  "よくがんばりました！",
  "すばらしい努力です！",
  "継続は力なり！",
  "あなたは今日も輝いています！",
  "その調子で続けていこう！",
  "達成おめでとうございます！"
];

const templates = [
  { id: 'template1', name: '朝活クエスト', nameDefault: '朝6時に起きる', duration: 7, memo: '毎朝6時に起きて散歩する' },
  { id: 'template2', name: '学習クエスト', nameDefault: '毎日30分英語', duration: 7, memo: '英語学習アプリを30分使う' },
  { id: 'template3', name: 'リフレッシュクエスト', nameDefault: '5分間ストレッチ', duration: 3, memo: '仕事や勉強の合間に体をほぐそう' },
  { id: 'template4', name: '生活習慣クエスト', nameDefault: '寝る前に日記を書く', duration: 7, memo: '今日の良かったこと、感じたことをひとことでもOK' },
  { id: 'template5', name: '健康クエスト', nameDefault: '毎日コップ1杯の水を飲む', duration: 5, memo: '起床後や食前など、タイミングを決めてみよう' },
];

const todayDate = () => new Date().toISOString().split('T')[0];

const isTodayCompleted = computed(() => {
  return quest.value.completed_dates?.includes(todayDate());
});

const remainingDays = computed(() => {
  if (!quest.value.start_date || !quest.value.duration) return null;
  const start = new Date(quest.value.start_date);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(start.getTime());
  endDate.setDate(start.getDate() + quest.value.duration);
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
});

const loadQuest = async () => {
  isLoading.value = true;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    console.error('ユーザーがログインしていません。');
    isLoading.value = false;
    return;
  }
  user.value = session.user;

  const { data: questData, error: questError } = await supabase.from('quests').select('*').eq('user_id', user.value.id).single();
  if (questError && questError.code !== 'PGRST116') {
    console.error('クエストの読み込みエラー:', questError);
    triggerToast('クエストの読み込みに失敗しました。');
  } else if (questData) {
    quest.value = { ...questData, completed_dates: questData.completed_dates || [] };
  }

  const { data: profileData, error: profileError } = await supabase.from('profiles').select('total_exp').eq('id', user.value.id).single();
  if (profileError && profileError.code !== 'PGRST116') {
    console.error('プロフィールデータの読み込みエラー:', profileError);
    triggerToast('経験値の読み込みに失敗しました。');
  } else if (profileData) {
    userTotalExp.value = profileData.total_exp || 0;
  } else {
    const { error: insertError } = await supabase.from('profiles').insert({ id: user.value.id, user_exp: 0, total_exp: 0 });
    if (insertError) {
      console.error('プロフィールデータの新規作成エラー:', insertError);
      triggerToast('プロフィールデータの初期化に失敗しました。');
    }
  }
  isLoading.value = false;
};

const upsertQuest = async (isUpdate = false) => {
  if (!user.value || !quest.value.name || !quest.value.duration) {
    triggerToast('クエスト名と期間は必須です。');
    return;
  }

  const updates = {
    id: quest.value.id,
    user_id: user.value.id,
    name: quest.value.name,
    duration: quest.value.duration,
    memo: quest.value.memo,
    start_date: quest.value.start_date || todayDate(),
    completed_dates: quest.value.completed_dates || [],
  };

  if (!updates.id) delete updates.id;

  let nameChanged = false;
  if (isUpdate && originalQuest.value && originalQuest.value.name !== quest.value.name) {
    updates.start_date = todayDate();
    updates.completed_dates = [];
    nameChanged = true;
  }

  const { data, error } = await supabase.from('quests').upsert(updates).select().single();

  if (error) {
    console.error('クエストの保存エラー:', error);
    triggerToast(`クエストの保存に失敗しました: ${error.message}`);
  } else {
    quest.value = { ...data, completed_dates: data.completed_dates || [] };
    if (nameChanged) {
      triggerToast('クエスト名が変更されたため、進捗がリセットされました。');
    } else {
      triggerToast(updates.id && isUpdate ? 'クエストを更新しました！' : 'クエストを作成しました！');
    }
    isEditing.value = false;
    originalQuest.value = null;
  }
};

const handleCreateOrEdit = () => {
  if (!quest.value.id) {
    upsertQuest(false);
  } else {
    isEditing.value = true;
    originalQuest.value = JSON.parse(JSON.stringify(quest.value));
  }
};

const handleUpdate = () => {
  upsertQuest(true);
};

const cancelEdit = () => {
  quest.value = JSON.parse(JSON.stringify(originalQuest.value));
  isEditing.value = false;
  triggerToast('更新をキャンセルしました。');
};

const applyTemplate = () => {
  if (selectedTemplateId.value === 'reset') {
    quest.value.name = '';
    quest.value.duration = '';
    quest.value.memo = '';
    selectedTemplateId.value = '';
    return;
  }
  const template = templates.find(t => t.id === selectedTemplateId.value);
  if (template) {
    quest.value.name = template.nameDefault;
    quest.value.duration = template.duration;
    quest.value.memo = template.memo;
  }
};

const toggleCompletion = () => {
  if (isTodayCompleted.value) {
    alert('今日はすでに完了しています！');
    return;
  }
  isConfirmModalVisible.value = true;
};

const handleConfirmCompletion = async (confirmed) => {
  isConfirmModalVisible.value = false;
  if (!confirmed) return;

  const today = todayDate();
  if (quest.value.completed_dates.includes(today)) return;

  const newCompletedDates = [...quest.value.completed_dates, today];
  const newTotalExp = userTotalExp.value + 100;

  const { error: profileUpdateError } = await supabase.from('profiles').update({ total_exp: newTotalExp }).eq('id', user.value.id);
  if (profileUpdateError) {
    console.error('プロフィール経験値の更新エラー:', profileUpdateError);
    triggerToast('経験値の更新に失敗しました。');
    return;
  }

  const { data, error } = await supabase.from('quests').update({ completed_dates: newCompletedDates }).eq('id', quest.value.id).select().single();
  if (error) {
    console.error('クエスト完了状態の更新エラー:', error);
    triggerToast('クエストの更新に失敗しました。');
    await supabase.from('profiles').update({ total_exp: userTotalExp.value }).eq('id', user.value.id); // Rollback exp
  } else {
    quest.value = { ...data, completed_dates: data.completed_dates || [] };
    userTotalExp.value = newTotalExp;
    const i = Math.floor(Math.random() * successMessages.length);
    randomMessage.value = successMessages[i];
  }
};

const questNameInput = ref(null);

const startNewQuest = () => {
  quest.value = {
    id: null,
    name: '',
    duration: '',
    memo: '',
    start_date: null,
    completed_dates: [],
  };
  originalQuest.value = null;
  isEditing.value = false;
  selectedTemplateId.value = '';
  triggerToast('新しいクエストを作成してください！');
  // クエスト名入力欄にフォーカス
  nextTick(() => {
    if (questNameInput.value) {
      questNameInput.value.focus();
    }
  });
};

const resetProgress = async () => {
  const { error: profileUpdateError } = await supabase.from('profiles').update({ total_exp: 0 }).eq('id', user.value.id);
  if (profileUpdateError) {
    console.error('プロフィール経験値のリセットエラー:', profileUpdateError);
    triggerToast('経験値のリセットに失敗しました。');
    return;
  }

  const { data, error } = await supabase.from('quests').update({ completed_dates: [], start_date: todayDate() }).eq('id', quest.value.id).select().single();
  if (error) {
    console.error('進捗リセットエラー:', error);
    triggerToast('進捗のリセットに失敗しました。');
  } else {
    quest.value = { ...data, completed_dates: data.completed_dates || [] };
    userTotalExp.value = 0;
    alert('進捗がリセットされました');
  }
};

const triggerToast = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 3000);
};

onMounted(loadQuest);
</script>

<style scoped>
.my-plan { background: #F0F4F8; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); color: #5A6A7A; width: 90%; margin: 2rem auto; }
.section-title { font-size: 1.8rem; font-weight: bold; color: #5A6A7A; margin-bottom: 1.5rem; text-align: center; }
.card-section { background-color: #E0F2F7; border: 2px solid #C3D9EE; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(195, 217, 238, 0.3); margin-bottom: 2rem; transition: box-shadow 0.3s ease; }
.card-section:hover { box-shadow: 0 4px 12px rgba(195, 217, 238, 0.4); }
.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 1rem; color: #4A5A6A; }
input, select, textarea { width: 100%; padding: 0.75rem 1rem; font-size: 1rem; border: 1px solid #C3D9EE; border-radius: 8px; box-sizing: border-box; background-color: #FFFFFF; color: #333; transition: border-color 0.3s, box-shadow 0.3s; }
input:disabled, select:disabled, textarea:disabled { background-color: #f0f0f0; cursor: not-allowed; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #A0C4E2; box-shadow: 0 0 0 3px rgba(160, 196, 226, 0.4); }
.progress-button { width: 100%; padding: 0.8rem 1rem; border: none; border-radius: 8px; font-weight: bold; color: white; cursor: pointer; transition: background-color 0.3s, transform 0.2s; background-color: #6A99D0; }
.progress-button.completed { background-color: #8BC34A; }
.progress-button.disabled { background-color: #bdc3c7; cursor: not-allowed; }
.progress-button:not(.disabled):hover { transform: translateY(-2px); }
.reset-button { width: 100%; padding: 0.75rem 1rem; border: none; border-radius: 8px; font-weight: bold; color: white; cursor: pointer; background-color: #FFB74D; transition: background-color 0.3s; }
.reset-button:hover { background-color: #FFA726; }
.create-quest-button, .update-button { width: 100%; padding: 0.75rem 1rem; border: none; border-radius: 8px; font-weight: bold; color: white; cursor: pointer; background-color: #4CAF50; transition: background-color 0.3s; }
.create-quest-button:hover, .update-button:hover { background-color: #43A047; }
.edit-buttons { display: flex; gap: 1rem; }
.edit-buttons .cancel-button { width: 100%; padding: 0.75rem 1rem; }
.cancel-button { border: none; border-radius: 8px; font-weight: bold; color: white; cursor: pointer; background-color: #FF7043; transition: background-color 0.3s; }
.cancel-button:hover { background-color: #F4511E; }
.feedback-card { background-color: #E8F5E9; border: 2px solid #A5D6A7; border-radius: 12px; padding: 1.5rem; text-align: center; margin-top: 2rem; color: #4CAF50; }
.feedback-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(195, 217, 238, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background-color: #E0F2F7; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(195, 217, 238, 0.4); text-align: center; max-width: 400px; width: 90%; }
.modal-content h3 { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #4A5A6A; }
.modal-content p { margin-bottom: 1.5rem; color: #6A7A8A; }
.modal-buttons { display: flex; justify-content: center; gap: 1rem; }
.modal-buttons button { flex: 1; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background-color 0.3s; }
.modal-buttons .confirm-button { background-color: #8BC34A; color: white; }
.modal-buttons .confirm-button:hover { background-color: #7CB342; }
.toast-notification { position: fixed; top: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter, .fade-leave-to { opacity: 0; }

.quest-end-section {
  background-color: #FFF3E0;
  border: 2px solid #FFCC80;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1.5rem;
  color: #E65100;
}

.quest-end-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.quest-end-message {
  margin-bottom: 1rem;
}

.new-quest-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  background-color: #2196F3; /* Blue color */
  transition: background-color 0.3s;
}

.new-quest-button:hover {
  background-color: #1976D2;
}
</style>
