<template>
  <div class="container">
    <MoodInput />
    <ActionGacha />
    <KuesutMove />
    <MoodChart />
    <MoodCalendar />
  </div>
</template>

<script setup>
import MoodInput from '../Lv2/MoodInput.vue'
import ActionGacha from '../Lv1/ActionGacha.vue'
import KuesutMove from './KuesutMove.vue'
import MoodChart from '../Lv2/MoodChart.vue'
import MoodCalendar from '../Lv2/MoodCalendar.vue'

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
