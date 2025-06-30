<template>
  <div class="discover-values">
    <h2 class="section-title">🌱 わたしの価値観を見つける</h2>

    <p class="description">
      あなたが大切にしたいことを自由に選んでください。選んでも、選ばなくても大丈夫です。
    </p>

    <!-- 価値観キーワードリスト -->
    <div class="keywords-section">
      <p class="section-subtitle">価値観を選ぶ</p>
      <div class="keywords-list">
        <label v-for="keyword in keywords" :key="keyword" class="keyword-item">
          <input type="checkbox" disabled />
          <span>{{ keyword }}</span>
        </label>
      </div>
    </div>

    <!-- 自由記述欄 -->
    <div class="free-entry-section">
      <p class="section-subtitle">自由に書く</p>
      <textarea
        placeholder="あなたが大事にしたいこと、気になっている価値観を書いてみてください"
        disabled
      ></textarea>
    </div>

    <!-- ボタン（今は非機能） -->
    <div class="button-section">
      <button disabled>保存する</button>
      <button disabled>リセット</button>
    </div>
  </div>
</template>

<script setup>
const keywords = [
  "挑戦",
  "家族",
  "友情",
  "学び",
  "自由",
  "安心",
  "成長",
  "誠実",
  "創造",
  "感謝"
]
</script>

<style scoped>
.discover-values {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  margin: 0 auto;
}
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
}
.section-subtitle {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}
.keywords-section,
.free-entry-section {
  margin-bottom: 2rem;
}
.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.keyword-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #eaf6fa;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  cursor: not-allowed;
  user-select: none;
}
.keyword-item input[type="checkbox"] {
  pointer-events: none;
}
.free-entry-section textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  background-color: #f0f0f0;
  color: #777;
  cursor: not-allowed;
}
.button-section {
  display: flex;
  gap: 1rem;
}
.button-section button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background-color: #6c757d;
  color: white;
  cursor: not-allowed;
}
</style>
