export const moodOptions = [
  { label: 'とてもしんどい', emoji: '😰', color: '#ff1744', value: 'very-tired', level: 1 },
  { label: 'しんどい', emoji: '😔', color: '#ff4dd2', value: 'tired', level: 2 },
  { label: 'まあまあ', emoji: '😐', color: '#00ffff', value: 'so-so', level: 3 },
  { label: 'いけるかも', emoji: '😊', color: '#ffb347', value: 'maybe-ok', level: 4 },
  { label: 'とても良い', emoji: '😄', color: '#4caf50', value: 'very-good', level: 5 },
]

// これは自動的に label → level を変換するマップ
export const moodMap = Object.fromEntries(
  moodOptions.map(option => [option.label, option.level])
)
