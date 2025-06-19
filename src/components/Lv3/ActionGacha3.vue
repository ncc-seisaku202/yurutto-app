<template>
  <div class="action-gacha">
    <h2 class="title">🎁 行動ガチャ</h2>
    <p class="description">今日のおすすめ行動をガチャで決めよう！</p>
    
    <div class="gacha-container">
      <!-- 初期状態：ガチャボタンのみ -->
      <div v-if="!showTreasures && !selectedAction" class="initial-state">
        <button
          class="gacha-button"
          @click="startGacha"
          :disabled="isProcessing"
        >
          {{ isProcessing ? 'ガチャ準備中...' : 'ガチャを回す！' }}
        </button>
      </div>

      <!-- 宝箱選択画面 -->
      <div v-if="showTreasures && !selectedAction" class="treasure-selection">
        <p class="instruction">宝箱を1つ選んでください！</p>
        <div class="treasures-container">
          <div
            v-for="(treasure, index) in treasures"
            :key="index"
            class="treasure-box"
            :class="{ 
              'selected': treasure.isSelected,
              'opening': treasure.isOpening,
              'glowing': treasure.isGlowing
            }"
            @click="selectTreasure(index)"
          >
            <div class="treasure-lid"></div>
            <div class="treasure-body"></div>
            <div class="treasure-glow"></div>
          </div>
        </div>
      </div>

      <!-- 結果表示エリア -->
      <div v-if="selectedAction" class="result-area">
        <div class="result-card" :class="{ 'show': showResult }">
          <div class="category-badge" :style="{ backgroundColor: getCategoryColor(selectedAction.category) }">
            {{ selectedAction.category }}
          </div>
          <h3 class="action-name">{{ selectedAction.name }}</h3>
          <p class="action-description">{{ selectedAction.description }}</p>
          <div class="action-duration">⏱️ {{ selectedAction.duration }}</div>
        </div>
        
        <!-- もう一度ボタン -->
        <button class="retry-button" @click="resetGacha">
          もう一度ガチャを回す
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// リアクティブデータ
const isProcessing = ref(false)
const showTreasures = ref(false)
const selectedAction = ref(null)
const showResult = ref(false)

// 宝箱データ
const treasures = reactive([
  { isSelected: false, isOpening: false, isGlowing: false },
  { isSelected: false, isOpening: false, isGlowing: false },
  { isSelected: false, isOpening: false, isGlowing: false },
  { isSelected: false, isOpening: false, isGlowing: false },
  { isSelected: false, isOpening: false, isGlowing: false }
])

// 行動データベース
const actionDatabase = [
  // 運動カテゴリ
  { name: '5分散歩', category: '運動', description: '外の空気を吸いながら軽く歩いてみましょう', duration: '5分' },
  { name: 'ストレッチ', category: '運動', description: '肩や首をゆっくりと伸ばしてリフレッシュ', duration: '3分' },
  { name: '階段昇降', category: '運動', description: '階段を使って軽い運動をしてみましょう', duration: '2分' },
  { name: 'ラジオ体操', category: '運動', description: '懐かしいラジオ体操で体を動かそう', duration: '6分' },
  
  // リラックスカテゴリ
  { name: '深呼吸', category: 'リラックス', description: 'ゆっくりと深く呼吸して心を落ち着けましょう', duration: '2分' },
  { name: '瞑想', category: 'リラックス', description: '静かに座って心を空っぽにしてみましょう', duration: '5分' },
  { name: 'お茶を飲む', category: 'リラックス', description: '温かい飲み物でほっと一息つきましょう', duration: '10分' },
  { name: '音楽鑑賞', category: 'リラックス', description: '好きな音楽を聴いてリラックスしましょう', duration: '15分' },
  
  // 創作活動カテゴリ
  { name: '絵を描く', category: '創作活動', description: '思いつくままに絵を描いてみましょう', duration: '15分' },
  { name: '日記を書く', category: '創作活動', description: '今日の出来事や気持ちを書き留めましょう', duration: '10分' },
  { name: '写真を撮る', category: '創作活動', description: '身の回りの美しいものを写真に収めましょう', duration: '10分' },
  { name: '料理をする', category: '創作活動', description: '簡単な料理やお菓子作りに挑戦しましょう', duration: '30分' },
  
  // 社交カテゴリ
  { name: '友人に連絡', category: '社交', description: '久しぶりの友人にメッセージを送ってみましょう', duration: '5分' },
  { name: '家族と話す', category: '社交', description: '家族との時間を大切にしましょう', duration: '15分' },
  { name: 'SNS投稿', category: '社交', description: '今日の良いことをSNSでシェアしましょう', duration: '5分' },
  { name: 'オンライン通話', category: '社交', description: '大切な人とビデオ通話をしてみましょう', duration: '20分' },
  
  // セルフケアカテゴリ
  { name: '入浴', category: 'セルフケア', description: 'ゆっくりとお風呂に入ってリフレッシュ', duration: '20分' },
  { name: '読書', category: 'セルフケア', description: '好きな本を読んで知識や想像力を育みましょう', duration: '30分' },
  { name: '部屋の整理', category: 'セルフケア', description: '身の回りを整理して気分をスッキリさせましょう', duration: '15分' },
  { name: '植物の世話', category: 'セルフケア', description: '植物に水をあげて成長を見守りましょう', duration: '5分' }
]

// カテゴリ別の色設定
const categoryColors = {
  '運動': '#FF6B6B',
  'リラックス': '#4ECDC4',
  '創作活動': '#45B7D1',
  '社交': '#96CEB4',
  'セルフケア': '#FFEAA7'
}

// カテゴリの色を取得
const getCategoryColor = (category) => {
  return categoryColors[category] || '#DDD'
}

// ガチャ開始
const startGacha = () => {
  isProcessing.value = true
  
  // 0.3秒後に宝箱を表示
  setTimeout(() => {
    isProcessing.value = false
    showTreasures.value = true
  }, 300)
}

// 宝箱選択
const selectTreasure = (index) => {
  // 既に選択済みの場合は無視
  if (treasures.some(t => t.isSelected)) return
  
  // 選択された宝箱を光らせる
  treasures[index].isSelected = true
  treasures[index].isGlowing = true
  
  // 0.8秒後に開く演出（光る演出を少し長く）
  setTimeout(() => {
    treasures[index].isOpening = true
    
    // ランダムに行動を選択
    const randomIndex = Math.floor(Math.random() * actionDatabase.length)
    selectedAction.value = actionDatabase[randomIndex]
    
    // 0.5秒後に結果表示
    setTimeout(() => {
      showResult.value = true
    }, 500)
  }, 800)
}

// ガチャリセット
const resetGacha = () => {
  showTreasures.value = false
  selectedAction.value = null
  showResult.value = false
  isProcessing.value = false
  
  // 宝箱の状態をリセット
  treasures.forEach(treasure => {
    treasure.isSelected = false
    treasure.isOpening = false
    treasure.isGlowing = false
  })
}
</script>

<style scoped>
.action-gacha {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.description {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.gacha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.initial-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.gacha-button {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #333;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  min-width: 250px;
}

.gacha-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.gacha-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.treasure-selection {
  text-align: center;
}

.instruction {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #FFD700;
  font-weight: bold;
}

.treasures-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.treasure-box {
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.treasure-box:hover {
  transform: translateY(-5px);
}

.treasure-lid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(45deg, #8B4513, #A0522D);
  border-radius: 8px 8px 4px 4px;
  border: 2px solid #654321;
  transition: all 0.5s ease;
}

.treasure-body {
  position: absolute;
  top: 25px;
  left: 0;
  width: 100%;
  height: 55px;
  background: linear-gradient(45deg, #8B4513, #A0522D);
  border-radius: 4px 4px 8px 8px;
  border: 2px solid #654321;
}

.treasure-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: all 0.5s ease;
}

.treasure-box.glowing .treasure-glow {
  opacity: 1;
  animation: glow 1s infinite alternate;
}

.treasure-box.opening .treasure-lid {
  transform: rotateX(-120deg);
  transform-origin: bottom;
}

.treasure-box.opening .treasure-body {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
}

.result-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.5s ease;
}

.result-card.show {
  transform: scale(1);
  opacity: 1;
}

.category-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.action-name {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.action-description {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  color: #666;
}

.action-duration {
  font-size: 0.9rem;
  color: #888;
  font-weight: bold;
}

.retry-button {
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .action-gacha {
    padding: 1.5rem;
  }
  
  .treasures-container {
    gap: 1rem;
  }
  
  .treasure-box {
    width: 60px;
    height: 60px;
  }
  
  .treasure-lid {
    height: 22px;
  }
  
  .treasure-body {
    top: 18px;
    height: 42px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .gacha-button {
    padding: 1rem 2rem;
    font-size: 1rem;
    min-width: 200px;
  }
}
</style>