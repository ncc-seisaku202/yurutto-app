<template>
  <div class="container">
    <h1>クエスト作成</h1>

    <!-- テンプレート選択 -->
    <div>
      <label>テンプレート選択:</label>
      <select v-model="selectedTemplateId" @change="applyTemplate">
        <option disabled value="">テンプレートを選んでください</option>
        <option v-for="template in templates" :key="template.id" :value="template.id">
          {{ template.name }}
        </option>
      </select>
    </div>

    <!-- クエスト作成フォーム -->
    <div>
      <label>クエスト名</label>
<input type="text" v-model="quest.name" placeholder="例: 毎日早起きチャレンジ" />

      <label>期間</label>
      <input v-model="quest.duration" type="text" placeholder="例: 7日間" />

      <label>内容メモ</label>
      <textarea v-model="quest.memo" rows="3" placeholder="クエストの詳細を書いてください"></textarea>

      <label>難易度</label>
      <select v-model="quest.difficulty">
        <option disabled value="">選択してください</option>
        <option>簡単</option>
        <option>普通</option>
        <option>難しい</option>
      </select>

      <label>ごほうび設定</label>
<input type="text" v-model="quest.reward" placeholder="例: ケーキを食べる！" />
    </div>

    <!-- クエスト進捗 -->
    <div>
      <label>進捗管理</label>
      <button @click="toggleCompletion">
        {{ quest.completed ? '達成済み ✔' : '未達成' }}
      </button>
    </div>

    <!-- 達成時フィードバック -->
    <div v-if="quest.completed" class="feedback">
      <h2>🎉 クエスト達成！</h2>
      <p>経験値 +100</p>
      <p>祝福メッセージ: よくがんばりました！</p>
      <div>
        <button @click="claimReward" class="reward-button">🎁 ごほうびゲット！</button>
        <p v-if="rewardClaimed">ごほうび: {{ quest.reward }}</p>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'KuesutMove',
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
      if (!this.quest.completed) {
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
.container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: sans-serif;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

/* ラベルと入力欄 */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

/* ボタン */
button {
  background-color: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
}
button:hover {
  background-color: #bbb;
}

/* 達成時のフィードバック */
.feedback {
  background-color: #e6ffed;
  border: 1px solid #66bb6a;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1.5rem;
}
.feedback h2 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

/* ごほうびボタン */
.reward-button {
  background-color: #facc15;
  margin-top: 0.5rem;
}


</style>
