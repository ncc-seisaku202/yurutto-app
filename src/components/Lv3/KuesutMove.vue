<template>
  <div class="container">
    <!-- ヘッダー -->
    <h1 class="title">自分だけのクエストに挑戦しよう！</h1>

    <!-- 目標名 -->
    <div class="row">
      <input type="text" v-model="quest.name" placeholder="例: 朝の散歩を習慣にする" />
      <button @click="confirmGoal">確定</button>
    </div>

    <!-- 期間 -->
    <div class="row">
      <select v-model="quest.duration">
        <option disabled value="">選択してください</option>
        <option>7日間</option>
        <option>14日間</option>
        <option>30日間</option>
      </select>
    </div>

    <!-- ステップを追加 -->
    <div class="row">
      <input type="text" v-model="newStep" placeholder="例: 毎朝7時に起きる" />
      <button @click="addStep">追加して保存</button>
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
