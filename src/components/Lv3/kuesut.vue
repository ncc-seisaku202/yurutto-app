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
export default {
  name: 'Kuesut',
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
/* optional styling */
</style>
