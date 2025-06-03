<template>
  <div class="mood-chart-container">
    <div class="header-section">
      <h2 class="chart-title">🌊 ゆる波 - 気分の流れ</h2>
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
import moodData from '@/data/moodData.json'

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

// 気分レベルのラベルマッピング
const moodLabels = {
  1: 'しんどい',
  2: 'まあまあ',
  3: 'いけるかも'
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
    '今日も一歩ずつ、ゆっくりと進んでいきましょう 🌸',
    'あなたの気分の波は、とても自然で美しいものです ✨',
    '毎日の小さな変化も、大切な成長の証です 🌱',
    'ゆったりとした時間の中で、自分を大切にしてくださいね 💙'
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
  const moodRecords = moodData.moodRecords
  
  // 各日の気分データを取得（記録がない日は中間値2を使用）
  const chartData = dateRange.map(date => {
    const record = moodRecords.find(r => r.date === date)
    return {
      date,
      moodLevel: record ? record.moodLevel : 2, // デフォルトは「まあまあ」
      hasData: !!record
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
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgba(147, 197, 253, 0.9)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      tension: 0.5, // よりゆるやかな波線効果
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
    chartInstance.update('active')
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
              const date = data.rawData[index].date
              const dateObj = new Date(date)
              return `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
            },
            label: function(context) {
              const moodLevel = context.parsed.y
              const index = context.dataIndex
              const hasData = data.rawData[index].hasData
              const label = moodLabels[moodLevel]
              
              if (hasData) {
                return `気分: ${label} 🌊`
              } else {
                return `気分: ${label} (記録なし) 💭`
              }
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
          }
        }
      },
      scales: {
        y: {
          min: 0.5,
          max: 3.5,
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
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
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
  margin: 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 197, 253, 0.2);
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
}
</style>