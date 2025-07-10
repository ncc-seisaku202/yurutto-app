<template>
  <div class="container">
    <!-- 既存流用コンポーネント -->
    <div class="section">
      <MoodInput />
      <ActionGacha />
    </div>

    <!-- Lv4特有の要素 -->
    <div class="section">
      <MyPlan />
      <ReflectionNote />
    </div>

    <!-- 既存流用コンポーネント -->
    <div class="section">
      <MoodChart />
      <MoodCalendar />
      
    </div>
  </div>
</template>

<script setup>
// Lv4新機能
import MyPlan from './MyPlan.vue'
import ReflectionNote from './ReflectionNote.vue' 

// Lv2から再利用
import MoodInput from '../Lv2/MoodInput.vue'
import MoodChart from '../Lv2/MoodChart.vue'
import MoodCalendar from '../Lv2/MoodCalendar.vue'

// Lv1から再利用
import ActionGacha from '../Lv1//ActionGacha.vue'

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
