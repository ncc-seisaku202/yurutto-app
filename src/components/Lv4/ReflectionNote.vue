<template>
  <div class="reflection-note">
    <h2 class="section-title">📝 ふりかえりノート</h2>

    <!-- Q1 -->
    <div class="question-block q1 animated">
      <p class="question-text">🌀 この1週間をひとことで表すと、どんな感じだったかな？</p>
      <div class="options horizontal">
        <label><input type="radio" value="すっきり" v-model="answers.q1" /> すっきり</label>
        <label><input type="radio" value="もやもや" v-model="answers.q1" /> もやもや</label>
        <label><input type="radio" value="忙しかった" v-model="answers.q1" /> 忙しかった</label>
        <label><input type="radio" value="穏やか" v-model="answers.q1" /> 穏やか</label>
      </div>
    </div>

    <!-- Q2 -->
    <div class="question-block q2 animated">
      <p class="question-text">💪 今週、自分をちょっとほめられることはあった？</p>
      <div class="options horizontal">
        <label><input type="radio" value="できた！" v-model="answers.q2" /> できた！</label>
        <label><input type="radio" value="少しできた" v-model="answers.q2" /> 少しできた</label>
        <label><input type="radio" value="あまりできなかった" v-model="answers.q2" /> あまりできなかった</label>
      </div>
    </div>

    <!-- Q3 -->
    <div class="question-block q3 animated">
      <p class="question-text">🔮 来週はどんな気持ちで過ごしたい？</p>
      <div class="options horizontal">
        <label><input type="radio" value="楽しみ" v-model="answers.q3" /> 楽しみ</label>
        <label><input type="radio" value="ちょっと不安" v-model="answers.q3" /> ちょっと不安</label>
        <label><input type="radio" value="のんびり" v-model="answers.q3" /> のんびり</label>
      </div>
    </div>

    <!-- Q4 -->
    <div class="question-block q4 animated">
      <p class="question-text">🌱 気になったことや感じたこと、ちょこっとでも自由に書いてみませんか？（書かなくても大丈夫です）</p>
      <div class="textarea-wrapper">
        <textarea
          v-model="answers.q4"
          placeholder="例：久しぶりに朝の空気をゆっくり感じられて、気持ちよかったな〜。"
        ></textarea>
      </div>
    </div>

    <!-- 保存ボタン -->
    <div class="button-wrapper">
      <button @click="saveToLocal">保存する</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const answers = ref({
  q1: '',
  q2: '',
  q3: '',
  q4: '',
})

const saveToLocal = () => {
  localStorage.setItem('reflectionNote', JSON.stringify(answers.value))
  alert('保存しました！')
}

onMounted(() => {
  const saved = localStorage.getItem('reflectionNote')
  if (saved) {
    try {
      answers.value = JSON.parse(saved)
    } catch (e) {
      console.warn('保存データの読み込みに失敗しました', e)
    }
  }
})
</script>

<style scoped>
/* 以下、UI用のスタイルはすべて以前のものを維持 */
.reflection-note {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 640px;
  margin: 2rem auto;
}
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #003366;
}
.question-block {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}
.question-block.q1 { background-color: #e6f2ff; animation-delay: 0s; }
.question-block.q2 { background-color: #f9f1ff; animation-delay: 0.1s; }
.question-block.q3 { background-color: #fff3f3; animation-delay: 0.2s; }
.question-block.q4 {
  background-color: #f6f6f6;
  animation-delay: 0.3s;
  padding-bottom: 1.5rem;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.question-text {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 1.2rem;
  padding-left: 0.5rem;
}
.options.horizontal label {
  display: flex;
  align-items: center;
  font-weight: normal;
  color: #444;
  background: #eef4fa;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.options.horizontal label:hover {
  background-color: #dde8f5;
}
input[type='radio'] {
  margin-right: 0.4rem;
}
.textarea-wrapper {
  max-width: 95%;
  margin: 0 auto;
}
textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  background-color: #fff;
}
.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
