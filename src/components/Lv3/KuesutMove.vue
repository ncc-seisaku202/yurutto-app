<template>
  <div class="p-4 max-w-2xl mx-auto">
  <div class="space-y-4 quest-form">
    <h1 class="text-2xl font-bold mb-4">⚔クエスト作成</h1>

    <!-- テンプレート選択 -->
    <div class="mb-4">
      <label class="block mb-1">テンプレート選択:</label>
      <select v-model="selectedTemplateId" @change="applyTemplate" class="border rounded p-2 w-full">
        <option disabled value="">テンプレートを選んでください</option>
        <option v-for="template in templates" :key="template.id" :value="template.id">
          {{ template.name }}
        </option>
      </select>
    </div>

    <!-- クエスト作成フォーム + 進捗管理 -->
    
      <div>
        <label class="block">クエスト名</label>
        <input v-model="quest.name" class="border px-3 py-[0.4rem] w-full rounded" placeholder="例: 毎日早起きチャレンジ" />
      </div>
      <div>
        <label class="block">期間</label>
        <input v-model="quest.duration" type="text" class="border px-3 py-[0.4rem] w-full rounded" placeholder="例: 7日間" />
      </div>
      <div>
        <label class="block">内容メモ</label>
        <textarea v-model="quest.memo" class="border px-3 py-[0.4rem] w-full rounded" rows="3" placeholder="クエストの詳細を書いてください"></textarea>
      </div>
      <div>
        <label class="block">難易度</label>
        <select v-model="quest.difficulty" class="border px-3 py-[0.4rem] w-full rounded">
          <option disabled value="">選択してください</option>
          <option>簡単</option>
          <option>普通</option>
          <option>難しい</option>
        </select>
      </div>
      <div>
        <label class="block">ごほうび設定</label>
        <input v-model="quest.reward" class="border px-3 py-[0.4rem] w-full rounded" placeholder="例: ケーキを食べる！" />
      </div>

      <!-- 進捗管理（フォーム内に移動） -->
      <div class="mt-4">
        <label class="block mb-2">進捗管理</label>
        <button
          @click="toggleCompletion"
          :disabled="isToggleDisabled"
          :class="[
            'px-4 py-[0.6rem] rounded w-full text-white font-bold transition-colors',
            quest.completed
              ? 'bg-red-500 border-2 border-red-600 hover:bg-red-600'
              : 'bg-blue-500 border-2 border-transparent hover:bg-blue-600',
            isToggleDisabled ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          {{ quest.completed ? '達成済み ✔' : '未達成' }}
        </button>
      </div>
    </div>


    <!-- 開発者用: リセットボタン -->
    <div class="mt-2">
      <button @click="resetProgress" class="w-full bg-red-500 text-white px-4 py-2 rounded">
        🔄 進捗をリセット（開発用）
      </button>
    </div>

    <!-- 達成時フィードバック -->
    <div v-if="quest.completed" class="mt-4 p-4 bg-green-100 rounded border border-green-400">
      <h2 class="font-bold text-lg text-green-800">🎉 クエスト達成！</h2>
      <p>経験値 +100</p>
      <p>祝福メッセージ: {{ randomMessage }}</p> 
      <div class="mt-2">
        <button @click="claimReward" class="bg-yellow-400 px-4 py-2 rounded font-bold w-full">
          🎁 ごほうびゲット！
        </button>
        <p v-if="rewardClaimed" class="mt-2 text-sm">ごほうび: {{ quest.reward }}</p>
      </div>
    </div>
    <!-- 累計経験値で木を成長表示 -->
    <div class="mt-10 flex justify-center">
      <SeityouView :exp="totalExp" />
    </div>
  </div>
</template>

<script>
import SeityouView from './SeityouView.vue';

export default {
  name: 'Kuesut',
  components: { SeityouView },
  data() {
    return {
      quest: {
        name: '',
        duration: '',
        memo: '',
        difficulty: '',
        reward: '',
        completed: false,
      },
      rewardClaimed: false,
      selectedTemplateId: '',
      totalExp: 0,
      lastCompletionDate: '',
      randomMessage: '', // ← 追加
    successMessages: [ // ← 追加
      "よくがんばりました！",
      "すばらしい努力です！",
      "継続は力なり！",
      "あなたは今日も輝いています！",
      "その調子で続けていこう！",
      "達成おめでとうございます！"
    ],
      templates: [
        {
          id: 'template1',
          name: '朝活クエスト',
          nameDefault: '朝6時に起きる',
          duration: '7日間',
          memo: '毎朝6時に起きて散歩する',
          difficulty: '普通',
          reward: 'コーヒータイムを満喫',
        },
        {
          id: 'template2',
          name: '学習クエスト',
          nameDefault: '毎日30分英語',
          duration: '14日間',
          memo: '英語学習アプリを30分使う',
          difficulty: '難しい',
          reward: 'ごほうびマンガ1冊',
        },
      ],
    };
  },
  computed: {
    isToggleDisabled() {
      const today = this.todayDate();
      return this.lastCompletionDate === today;
    },
  },
  methods: {
    applyTemplate() {
      const template = this.templates.find(t => t.id === this.selectedTemplateId);
      if (template) {
        this.quest.name = template.nameDefault;
        this.quest.duration = template.duration;
        this.quest.memo = template.memo;
        this.quest.difficulty = template.difficulty;
        this.quest.reward = template.reward;
      }
    },
    toggleCompletion() {
  if (this.lastCompletedDate === this.todayDate()) {
    alert('今日はすでに完了しています！');
    return;
  }

  if (!confirm('今日のクエストを達成しましたか？')) {
    return;
  }

  this.quest.completed = true;
  this.lastCompletedDate = this.todayDate();
  this.totalExp += 100;

  // ランダム祝福メッセージ
  const i = Math.floor(Math.random() * this.successMessages.length);
  this.randomMessage = this.successMessages[i];
},
    claimReward() {
      this.rewardClaimed = true;
    },
    resetProgress() {
      this.quest.completed = false;
      this.rewardClaimed = false;
      this.totalExp = 0;
      this.lastCompletionDate = '';
      alert('進捗がリセットされました');
    },
    todayDate() {
      return new Date().toISOString().split('T')[0];
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #ff9e3e;
  box-shadow: 0 0 15px rgba(255, 150, 50, 0.5);
  border-radius: 1rem;
  font-family: sans-serif;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
  color: #222;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  background-color: #666;
  color: white;
  border: none;
  padding: 0.75rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
}
button:hover {
  background-color: #444;
}

.reward-button {
  background-color: #facc15;
  color: black;
  margin-top: 1rem;
}

.feedback {
  background-color: #e6ffed;
  border: 1px solid #66bb6a;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 2rem;
  text-align: center;
}
.quest-form {
  background-color: #ff9e3e;
  box-shadow: 0 0 12px rgba(255, 140, 30, 0.4);
  border-radius: 1rem;
  padding: 1.5rem;
}

/* 入力欄の高さ調整 */
.quest-form input,
.quest-form select,
.quest-form textarea {
  padding: 0.4rem 0.6rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

</style>
