<template>
  <div class="action-gacha">
    <h2 class="title">🎲 行動ガチャ</h2>
    <p class="description">今日のおすすめ行動をガチャで決めよう！</p>
    
    <div class="gacha-container">
      <!-- ルーレット表示エリア -->
      <div class="roulette-area">
        <svg
          class="roulette-wheel"
          :class="{ 'spinning': isSpinning }"
          :style="{ transform: `rotate(${rotation}deg)` }"
          width="300"
          height="300"
          viewBox="0 0 300 300"
        >
          <g v-for="(color, index) in rouletteColors" :key="index">
            <path
              :d="getSlicePath(index, rouletteColors.length)"
              :fill="color"
              stroke="white"
              stroke-width="3"
            />
          </g>
        </svg>
        <div class="roulette-pointer"></div>
      </div>

      <!-- 結果表示エリア -->
      <div class="result-area" v-if="selectedAction">
        <div class="result-card" :class="{ 'show': showResult }">
          <div class="category-badge" :style="{ backgroundColor: getCategoryColor(selectedAction.category) }">
            {{ selectedAction.category }}
          </div>
          <h3 class="action-name">{{ selectedAction.name }}</h3>
          <p class="action-description">{{ selectedAction.description }}</p>
          <div class="action-duration">⏱️ {{ selectedAction.duration }}</div>
        </div>
      </div>

      <!-- ガチャボタン -->
      <button
        class="gacha-button"
        @click="spinGacha"
        :disabled="isSpinning"
        :class="{ 'spinning': isSpinning }"
      >
        {{ isSpinning ? 'ガチャ中...' : 'ガチャを回す！' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// リアクティブデータ
const isSpinning = ref(false)
const rotation = ref(0)
const selectedAction = ref(null)
const showResult = ref(false)

// ルーレットの色配列（カテゴリ色を繰り返し配置）
const rouletteColors = [
  '#FF6B6B', // 運動
  '#4ECDC4', // リラックス
  '#45B7D1', // 創作活動
  '#96CEB4', // 社交
  '#FFEAA7', // セルフケア
  '#FF6B6B', // 運動
  '#4ECDC4', // リラックス
  '#45B7D1', // 創作活動
  '#96CEB4', // 社交
  '#FFEAA7', // セルフケア
  '#FF6B6B', // 運動
  '#4ECDC4'  // リラックス
]

// ルーレット色とカテゴリのマッピング
const colorToCategoryMap = {
  '#FF6B6B': '運動',
  '#4ECDC4': 'リラックス',
  '#45B7D1': '創作活動',
  '#96CEB4': '社交',
  '#FFEAA7': 'セルフケア'
}

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

// SVGピザスライスのパスを生成
const getSlicePath = (index, total) => {
  const centerX = 150
  const centerY = 150
  const radius = 140
  const anglePerSlice = (2 * Math.PI) / total
  const startAngle = index * anglePerSlice
  const endAngle = (index + 1) * anglePerSlice
  
  const x1 = centerX + radius * Math.cos(startAngle)
  const y1 = centerY + radius * Math.sin(startAngle)
  const x2 = centerX + radius * Math.cos(endAngle)
  const y2 = centerY + radius * Math.sin(endAngle)
  
  const largeArcFlag = anglePerSlice > Math.PI ? 1 : 0
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

// ガチャを回す
const spinGacha = () => {
  if (isSpinning.value) return
  
  isSpinning.value = true
  showResult.value = false
  selectedAction.value = null
  
  // 先に結果を決定する
  const randomActionIndex = Math.floor(Math.random() * actionDatabase.length)
  const targetAction = actionDatabase[randomActionIndex]
  const targetCategory = targetAction.category
  const targetColor = getCategoryColor(targetCategory)
  
  // 目標の色に対応するスライスのインデックスを見つける
  const targetSliceIndices = []
  rouletteColors.forEach((color, index) => {
    if (color === targetColor) {
      targetSliceIndices.push(index)
    }
  })
  
  // ランダムに目標スライスを選択
  const targetSliceIndex = targetSliceIndices[Math.floor(Math.random() * targetSliceIndices.length)]
  
  // 目標スライスの中央角度を計算
  const sliceAngle = 360 / rouletteColors.length
  const targetAngle = targetSliceIndex * sliceAngle + sliceAngle / 2
  
  // ランダムな回転数を設定（3-5回転 + 目標角度）
  const spins = 3 + Math.random() * 2
  const totalRotation = spins * 360 + targetAngle
  
  rotation.value += totalRotation
  
  // アニメーション終了後の処理
  setTimeout(() => {
    // 結果を設定
    selectedAction.value = targetAction
    
    isSpinning.value = false
    
    // 結果表示のアニメーション
    setTimeout(() => {
      showResult.value = true
    }, 300)
  }, 3000) // 3秒間のスピンアニメーション
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

.roulette-area {
  position: relative;
  width: 300px;
  height: 300px;
}

.roulette-wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
  border: 4px solid white;
  background: white;
}

.roulette-wheel.spinning {
  transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
}


.roulette-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 20px solid #FFD700;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.result-area {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 300px;
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
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.action-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: #333;
}

.action-description {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  color: #666;
}

.action-duration {
  font-size: 0.8rem;
  color: #888;
  font-weight: bold;
}

.gacha-button {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #333;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  min-width: 200px;
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

.gacha-button.spinning {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .action-gacha {
    padding: 1.5rem;
  }
  
  .roulette-area {
    width: 250px;
    height: 250px;
  }
  
  .roulette-wheel {
    width: 250px;
    height: 250px;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>
