<template>
  <div class="mood-chart-container">
    <div class="header-section">
      <h2 class="chart-title">🌊 ゆる波 - 気分の流れ (Lv2)</h2>
      <div class="period-selector">
        <button
          v-for="period in periods"
          :key="period.value"
          :class="['period-btn', { active: selectedPeriod === period.value }]"
          @click="changePeriod(period.value)"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="chart-footer">
      <p class="gentle-message">{{ getGentleMessage() }}</p>
      <div class="mood-legend">
        <div class="legend-item" v-for="(label, level) in moodLabels" :key="level">
          <span class="legend-color" :style="{ backgroundColor: getMoodColor(parseInt(level)) }"></span>
          <span class="legend-text">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import moodDataLv2 from '@/data/moodDataLv2.json'

// Chart.jsの必要なコンポーネントを登録
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartCanvas = ref(null)
const selectedPeriod = ref(7)
let chartInstance = null

// 期間選択オプション
const periods = ref([
  { value: 7, label: '1週間' },
  { value: 14, label: '2週間' },
  { value: 30, label: '1ヶ月' }
])

// 5段階気分レベルのラベルマッピング
const moodLabels = {
  1: 'とてもしんどい',
  2: 'しんどい',
  3: 'まあまあ',
  4: 'いけるかも',
  5: 'とても良い'
}

// 気分レベルに応じた色を取得
const getMoodColor = (level) => {
  const colors = {
    1: '#ff1744', // とてもしんどい - 赤
    2: '#ff4dd2', // しんどい - ピンク
    3: '#00ffff', // まあまあ - シアン
    4: '#ffb347', // いけるかも - オレンジ
    5: '#4caf50'  // とても良い - 緑
  }
  return colors[level] || '#ddd'
}

// 指定期間の日付を生成
const getDateRange = (days) => {
  const dates = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// やさしいメッセージを取得
const getGentleMessage = () => {
  const messages = [
    '5段階で記録することで、より細かな気分の変化を見つめることができますね 🌸',
    'あなたの気分の波は、とても自然で美しいものです。どんな気分も大切です ✨',
    '毎日の小さな変化も、大切な成長の証です。自分を褒めてあげてくださいね 🌱',
    'ゆったりとした時間の中で、自分の心と向き合う時間を大切にしてください 💙',
    '気分の記録を続けることで、自分のパターンが見えてきますよ 🔍'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// 期間変更
const changePeriod = (days) => {
  selectedPeriod.value = days
  updateChart()
}

// データを整形する関数
const prepareChartData = () => {
  const dateRange = getDateRange(selectedPeriod.value)
  const moodRecords = moodDataLv2.moodRecords
  
  // 各日の気分データを取得（記録がない日は中間値3を使用）
  const chartData = dateRange.map(date => {
    const record = moodRecords.find(r => r.date === date)
    return {
      date,
      moodLevel: record ? record.moodLevel : 3, // デフォルトは「まあまあ」
      hasData: !!record,
      mood: record ? record.mood : 'まあまあ',
      actionMemo: record ? record.actionMemo : null
    }
  })
  
  return {
    labels: chartData.map(item => {
      const date = new Date(item.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    datasets: [{
      label: '気分の波',
      data: chartData.map(item => item.moodLevel),
      borderColor: 'rgba(147, 197, 253, 0.8)', // やわらかい青
      backgroundColor: 'rgba(147, 197, 253, 0.1)',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 10,
      pointBackgroundColor: chartData.map(item => getMoodColor(item.moodLevel)),
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      tension: 0.4, // よりゆるやかな波線効果
      fill: true,
      fillColor: 'rgba(147, 197, 253, 0.05)'
    }],
    rawData: chartData
  }
}

// チャート更新関数
const updateChart = () => {
  if (chartInstance) {
    const newData = prepareChartData()
    chartInstance.data.labels = newData.labels
    chartInstance.data.datasets[0].data = newData.datasets[0].data
    chartInstance.data.datasets[0].pointBackgroundColor = newData.datasets[0].pointBackgroundColor
    // rawDataも更新
    chartInstance.rawData = newData.rawData
    // パフォーマンス向上のため'none'モードで更新
    chartInstance.update('none')
  }
}

// チャートを初期化
const initChart = () => {
  if (!chartCanvas.value) return
  
  const data = prepareChartData()
  
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300, // アニメーション時間を短縮
        easing: 'easeOutQuart'
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      elements: {
        point: {
          hoverRadius: 10,
          hitRadius: 15 // ホバー検出範囲を拡大
        },
        line: {
          tension: 0.4
        }
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
      plugins: {
        title: {
          display: false
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              const index = context[0].dataIndex
              const chart = context[0].chart
              const rawData = chart.rawData
              if (rawData && rawData[index]) {
                const date = rawData[index].date
                const dateObj = new Date(date)
                return `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
              }
              return ''
            },
            label: function(context) {
              const moodLevel = context.parsed.y
              const index = context.dataIndex
              const chart = context.chart
              const rawData = chart.rawData
              const label = moodLabels[moodLevel]
              
              if (rawData && rawData[index]) {
                const hasData = rawData[index].hasData
                const actionMemo = rawData[index].actionMemo
                
                let tooltipText = `気分: ${label} 🌊`
                if (!hasData) {
                  tooltipText += ' (記録なし) 💭'
                }
                if (actionMemo) {
                  tooltipText += `\nメモ: ${actionMemo}`
                }
                return tooltipText
              }
              return `気分: ${label} 🌊`
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#475569',
          bodyColor: '#64748b',
          borderColor: 'rgba(147, 197, 253, 0.5)',
          borderWidth: 2,
          cornerRadius: 12,
          padding: 12,
          titleFont: {
            size: 14,
            weight: '600'
          },
          bodyFont: {
            size: 13,
            weight: '500'
          },
          multiKeyBackground: 'transparent'
        }
      },
      scales: {
        y: {
          min: 0.5,
          max: 5.5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return moodLabels[value] || ''
            },
            color: '#64748b',
            font: {
              size: 12,
              weight: '500'
            }
          },
          grid: {
            color: 'rgba(147, 197, 253, 0.2)',
            lineWidth: 1
          },
          border: {
            display: false
          }
        },
        x: {
          ticks: {
            color: '#64748b',
            font: {
              size: 11,
              weight: '500'
            }
          },
          grid: {
            color: 'rgba(147, 197, 253, 0.15)',
            lineWidth: 1
          },
          border: {
            display: false
          }
        }
      }
    }
  })
  
  // rawDataを保存してツールチップで使用
  chartInstance.rawData = data.rawData
}

// コンポーネントがマウントされた時にチャートを初期化
onMounted(() => {
  initChart()
})

// コンポーネントがアンマウントされる時にチャートを破棄
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.mood-chart-container {
  width: 100%;
  margin: 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: none;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(147, 197, 253, 0.15);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.mood-chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    rgba(147, 197, 253, 0.3) 0%,
    rgba(196, 181, 253, 0.3) 50%,
    rgba(147, 197, 253, 0.3) 100%);
  border-radius: 20px 20px 0 0;
}

.header-section {
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #475569;
  letter-spacing: 0.5px;
}

.period-selector {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.period-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid rgba(147, 197, 253, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.7);
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.period-btn:hover {
  background: rgba(147, 197, 253, 0.1);
  border-color: rgba(147, 197, 253, 0.5);
  transform: translateY(-1px);
}

.period-btn.active {
  background: rgba(147, 197, 253, 0.2);
  border-color: rgba(147, 197, 253, 0.6);
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(147, 197, 253, 0.2);
}

.chart-wrapper {
  position: relative;
  height: 350px;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.chart-wrapper canvas {
  max-width: 100% !important;
  height: auto !important;
}

.chart-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.gentle-message {
  font-size: 0.95rem;
  color: #64748b;
  font-style: italic;
  margin: 0 0 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 197, 253, 0.2);
}

.mood-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #64748b;
  backdrop-filter: blur(10px);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
}

.legend-text {
  font-weight: 500;
}

@media (max-width: 768px) {
  .mood-chart-container {
    padding: 1.5rem;
  }
  
  .chart-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  
  .period-selector {
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  
  .period-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .chart-wrapper {
    height: 300px;
    padding: 0.8rem;
  }
  
  .gentle-message {
    font-size: 0.9rem;
    padding: 0.8rem;
  }
  
  .mood-legend {
    gap: 0.5rem;
  }
  
  .legend-item {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .mood-chart-container {
    padding: 1rem;
  }
  
  .chart-wrapper {
    height: 250px;
    padding: 0.6rem;
  }
  
  .chart-title {
    font-size: 1.3rem;
  }
  
  .period-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .gentle-message {
    font-size: 0.85rem;
    padding: 0.7rem;
  }
  
  .mood-legend {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }
}
</style>