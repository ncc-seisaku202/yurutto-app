<template>
  <div class="container">
    <MoodInput3 />
    <ActionGacha3 />
    <KuesutMove />
    <MoodChart />
    <MoodCalendar3 />
    <NightModeToggle />
  </div>
</template>

<script setup>
import MoodInput3 from './MoodInput3.vue'
import ActionGacha3 from './ActionGacha3.vue'
import KuesutMove from './KuesutMove.vue'
import MoodChart from './MoodChart.vue'
import MoodCalendar3 from './MoodCalendar3.vue'
</script>

<style scoped>
body {
  background-color: blue;
  margin: 0;
  font-family: sans-serif;
}
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>
