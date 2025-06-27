<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">クエスト作成</h1>

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

    <!-- クエスト作成フォーム -->
    <div class="space-y-4">
      <div>
        <label class="block">クエスト名</label>
        <input v-model="quest.name" class="border p-2 w-full rounded" placeholder="例: 毎日早起きチャレンジ" />
      </div>
      <div>
        <label class="block">期間</label>
        <input v-model="quest.duration" type="text" class="border p-2 w-full rounded" placeholder="例: 7日間" />
      </div>
      <div>
        <label class="block">内容メモ</label>
        <textarea v-model="quest.memo" class="border p-2 w-full rounded" rows="3" placeholder="クエストの詳細を書いてください"></textarea>
      </div>
      <div>
        <label class="block">難易度</label>
        <select v-model="quest.difficulty" class="border p-2 w-full rounded">
          <option disabled value="">選択してください</option>
          <option>簡単</option>
          <option>普通</option>
          <option>難しい</option>
        </select>
      </div>
      <div>
        <label class="block">ごほうび設定</label>
        <input v-model="quest.reward" class="border p-2 w-full rounded" placeholder="例: ケーキを食べる！" />
      </div>
    </div>

    <!-- クエスト進捗 -->
    <div class="mt-6">
      <label class="block mb-2">進捗管理</label>
      <button @click="toggleCompletion" class="px-4 py-2 bg-blue-500 text-white rounded">
        {{ quest.completed ? '達成済み ✔' : '未達成' }}
      </button>
    </div>

    <!-- 達成時フィードバック -->
    <div v-if="quest.completed" class="mt-4 p-4 bg-green-100 rounded border border-green-400">
      <h2 class="font-bold text-lg text-green-800">🎉 クエスト達成！</h2>
      <p>経験値 +100</p>
      <p>祝福メッセージ: よくがんばりました！</p>
      <div class="mt-2">
        <button @click="claimReward" class="bg-yellow-400 px-4 py-2 rounded font-bold">
          🎁 ごほうびゲット！
        </button>
        <p v-if="rewardClaimed" class="mt-2 text-sm">ごほうび: {{ quest.reward }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Seityou from './Seityou.vue';

export default {
  name: 'Kuesut',
  components: {
    Seityou,
  },
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
      totalExp: 0, // ← 累積経験値を追加
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
      this.quest.completed = !this.quest.completed;
      if (this.quest.completed) {
        this.totalExp += 100; // ← 経験値を加算（例: 毎回100）
      } else {
        this.totalExp -= 100; // ← クエスト未達成に戻す場合
        this.rewardClaimed = false;
      }
    },
    claimReward() {
      this.rewardClaimed = true;
    },
  },
};
</script>


<style scoped>
/* optional styling */
</style>


<style scoped>
.container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

/* ラベルと入力欄の縦並び */
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

/* ボタン共通 */
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

/* ごほうびボタン */
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
</style>
