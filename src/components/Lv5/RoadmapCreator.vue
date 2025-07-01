<template>
  <div class="roadmap-creator">
    <div class="header-section">
      <h2 class="section-title">🗺️ 道しるべマップ</h2>
      <p class="description">
        価値観を基に、長期的なありたい姿を描く機能です。
      </p>
    </div>

    <!-- 今後実装予定の機能 -->
    <div class="coming-soon">
      <div class="feature-list">
        <h3>実装予定の機能</h3>
        <ul>
          <li>📝 期間別ありたい姿の入力（1年後、3年後、5年後）</li>
          <li>🔗 価値観との関連付け</li>
          <li>📊 視覚的なマップ表示</li>
          <li>💾 マップの保存・編集機能</li>
        </ul>
      </div>
      
      <div class="placeholder-message">
        <p>🚧 この機能は現在開発中です</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 今後実装予定
</script>

<style scoped>
.roadmap-creator {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.roadmap-creator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4299e1 0%, #3182ce 100%);
  border-radius: 16px 16px 0 0;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.coming-soon {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.feature-list {
  margin-bottom: 2rem;
}

.feature-list h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.8rem;
  padding: 0.5rem;
  background: rgba(66, 153, 225, 0.05);
  border-radius: 8px;
  text-align: left;
}

.placeholder-message {
  padding: 1.5rem;
  background: rgba(66, 153, 225, 0.1);
  border-radius: 8px;
  border: 2px dashed #4299e1;
}

.placeholder-message p {
  font-size: 1.1rem;
  color: #3182ce;
  font-weight: 500;
  margin: 0;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .roadmap-creator {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .coming-soon {
    padding: 1.5rem;
  }
}
</style>