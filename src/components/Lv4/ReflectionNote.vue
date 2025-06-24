<template>
  <div class="reflection-note">
    <h2 class="section-title">📝 ふりかえりノート</h2>

    <!-- 質問1 -->
    <div class="question-block">
      <p class="question-text">1. この1週間を一言で表すと？</p>
      <div class="options">
        <label><input type="radio" name="q1" /> すっきり</label>
        <label><input type="radio" name="q1" /> もやもや</label>
        <label><input type="radio" name="q1" /> 忙しかった</label>
        <label><input type="radio" name="q1" /> 穏やか</label>
      </div>
    </div>

    <!-- 質問2 -->
    <div class="question-block">
      <p class="question-text">2. よくできたことはありましたか？</p>
      <div class="options">
        <label><input type="radio" name="q2" /> できた</label>
        <label><input type="radio" name="q2" /> 少しできた</label>
        <label><input type="radio" name="q2" /> あまりできなかった</label>
      </div>
    </div>

    <!-- 質問3 -->
    <div class="question-block">
      <p class="question-text">3. 来週の気持ちは？</p>
      <div class="options">
        <label><input type="radio" name="q3" /> 楽しみ</label>
        <label><input type="radio" name="q3" /> 不安</label>
        <label><input type="radio" name="q3" /> 変化なし</label>
      </div>
    </div>

    <!-- 保存ボタン（現状は非活性） -->
    <div class="button-wrapper">
      <button disabled>保存（準備中）</button>
    </div>
  </div>
</template>

<script setup>
// 現段階ではロジックなし
</script>

<style scoped>
.reflection-note {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 640px; /* ✅ MyPlanと同じ幅 */
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
}

.question-text {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-left: 1rem;
}

.options label {
  font-weight: normal;
  color: #444;
}

input[type='radio'] {
  margin-right: 0.5rem;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #aaa;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: not-allowed;
}
</style>
