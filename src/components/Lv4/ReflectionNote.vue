<template>
  <div class="reflection-note">
    <h2 class="section-title">📝 ふりかえりノート</h2>

    <!-- 質問1 -->
    <div class="question-block q1 animated">
      <p class="question-text">🌀 この1週間をひとことで表すと、どんな感じだったかな？</p>
      <div class="options horizontal">
        <label><input type="radio" name="q1" /> すっきり</label>
        <label><input type="radio" name="q1" /> もやもや</label>
        <label><input type="radio" name="q1" /> 忙しかった</label>
        <label><input type="radio" name="q1" /> 穏やか</label>
      </div>
    </div>

    <!-- 質問2 -->
    <div class="question-block q2 animated">
      <p class="question-text">💪 今週、自分をちょっとほめられることはあった？</p>
      <div class="options horizontal">
        <label><input type="radio" name="q2" /> できた！</label>
        <label><input type="radio" name="q2" /> 少しできた</label>
        <label><input type="radio" name="q2" /> あまりできなかった</label>
      </div>
    </div>

    <!-- 質問3 -->
    <div class="question-block q3 animated">
      <p class="question-text">🔮 来週はどんな気持ちで過ごしたい？</p>
      <div class="options horizontal">
        <label><input type="radio" name="q3" /> 楽しみ</label>
        <label><input type="radio" name="q3" /> ちょっと不安</label>
        <label><input type="radio" name="q3" /> のんびり</label>
      </div>
    </div>

    <!-- 質問4（自由記述） -->
    <div class="question-block q4 animated">
      <p class="question-text">🌱 気になったことや感じたこと、ちょこっとでも自由に書いてみませんか？（書かなくても大丈夫です）</p>
      <div class="textarea-wrapper">
        <textarea placeholder="例：久しぶりに朝の空気をゆっくり感じられて、気持ちよかったな〜。"></textarea>
      </div>
    </div>

    <!-- 保存ボタン -->
    <div class="button-wrapper">
      <button disabled>あとで保存できるようにします</button>
    </div>
  </div>
</template>

<script setup>
// UIのみ。ロジックなし
</script>

<style scoped>
/* 全体レイアウト */
.reflection-note {
  background: #fdfdfd;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 640px;
  margin: 2rem auto;
}

/* タイトル */
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #003366;
}

/* 各質問ブロック */
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

/* アニメーション */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 質問テキスト */
.question-text {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

/* 選択肢 */
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

/* 自由記述欄 */
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

/* 保存ボタン */
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
