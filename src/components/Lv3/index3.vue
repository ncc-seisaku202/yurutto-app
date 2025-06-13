<template>
  <div class="container">
    <MoodInput3 />
    <ActionGacha3 />
    <kuesut />
    <MoodCalendar />
    <NightModeToggle />
  </div>
</template>

<script setup>
import MoodInput3 from './MoodInput3.vue'
import ActionGacha3 from './ActionGacha3.vue'
import kuesut from './kuesut.vue'
import MoodCalendar from './MoodCalendar.vue'
import NightModeToggle from './NightModeToggle.vue'
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
