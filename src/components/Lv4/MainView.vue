<template>
  <div class="container">
    <!-- Lv4特有の要素 -->
    <h1 class="title">🧠 自分だけのマイプラン</h1>

    <!-- 新機能への導線 -->
    <div class="section">
      <MyPlan />
    </div>

    <!-- 既存流用コンポーネント -->
    <div class="section">
      <MoodChart />
      <MoodCalendar />
      <NightModeToggle />
    </div>
  </div>
</template>

<script setup>
// Lv4新機能
import MyPlan from './MyPlan.vue'

// Lv1から再利用
import MoodChart from '../Lv1/MoodChart.vue'
import MoodCalendar from '../Lv1/MoodCalendar.vue'
import NightModeToggle from '../Lv1/NightModeToggle.vue'
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #333;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
