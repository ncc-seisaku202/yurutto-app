<template>
  <div class="mood-chart-container">
    <h2 class="chart-title">過去7日間の気分推移</h2>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
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
  Legend
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
  Legend
)

const chartCanvas = ref(null)
let chartInstance = null

// 気分レベルのラベルマッピング
const moodLabels = {
  1: 'しんどい',
  2: 'まあまあ',
  3: 'いけるかも'
}

// 過去7日間の日付を生成
const getLast7Days = () => {
  const dates = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// データを整形する関数
const prepareChartData = () => {
  const last7Days = getLast7Days()
  const moodRecords = moodData.moodRecords
  
  // 各日の気分データを取得（記録がない日は中間値2を使用）
  const chartData = last7Days.map(date => {
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
      label: '気分レベル',
      data: chartData.map(item => item.moodLevel),
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#007bff',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      tension: 0.4, // 波線効果
      fill: false
    }],
    rawData: chartData
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
                return `気分: ${label}`
              } else {
                return `気分: ${label} (記録なし)`
              }
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#007bff',
          borderWidth: 1
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
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
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
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden;
}

.chart-wrapper canvas {
  max-width: 100% !important;
  height: auto !important;
}

@media (max-width: 768px) {
  .mood-chart-container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .chart-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  .chart-wrapper {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    height: 250px;
  }
  
  .chart-title {
    font-size: 1.2rem;
  }
}
</style>