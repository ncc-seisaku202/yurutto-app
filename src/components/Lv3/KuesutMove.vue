<template>
  <div class="container">
    <!-- ヘッダー -->
    <h1 class="title">🎯 マイプラン</h1>

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
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: sans-serif;
  background-color: #fff;
  border-radius: 12px;
}

.title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

input,
select {
  flex: 1;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  background-color: #aaa;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

button:hover {
  background-color: #888;
}
</style>
