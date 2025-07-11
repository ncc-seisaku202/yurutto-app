const actionsLv1 = [
  { name: '深呼吸を3回する', category: 'リラックス', description: 'ゆっくりと深く呼吸して心を落ち着けましょう', duration: '1分' },
  { name: '水を一口飲む', category: 'セルフケア', description: '喉を潤し、体を目覚めさせましょう', duration: '1分' },
  { name: 'カーテンを開ける', category: 'セルフケア', description: '部屋に光を取り入れ、気分転換をしましょう', duration: '1分' },
  { name: '好きな音楽を1曲聴く', category: 'リラックス', description: '心地よい音楽で気分をリフレッシュしましょう', duration: '3分' },
  { name: '目を閉じて1分間休む', category: 'リラックス', description: '何も考えず、ただ目を閉じて休みましょう', duration: '1分' },
  { name: '手足を軽く伸ばす', category: '運動', description: 'ベッドや椅子に座ったまま、軽く体を動かしましょう', duration: '2分' },
  { name: '温かい飲み物を飲む', category: 'セルフケア', description: '温かい飲み物で心身を落ち着かせましょう', duration: '5分' }
];

const actionsLv2 = [
  { name: '5分散歩（家の中でもOK）', category: '運動', description: 'ゆっくり歩いて体を動かしましょう', duration: '5分' },
  { name: 'ストレッチを3分する', category: '運動', description: '肩や首、手足をゆっくり伸ばしてリフレッシュ', duration: '3分' },
  { name: '窓を開けて外の空気を吸う', category: 'セルフケア', description: '新鮮な空気を取り入れ、気分を入れ替えましょう', duration: '2分' },
  { name: '好きな動画を1本見る', category: 'リラックス', description: '短めの好きな動画を見て気分転換をしましょう', duration: '10分' },
  { name: '簡単な掃除を5分する', category: 'セルフケア', description: '身の回りの簡単な場所を少しだけきれいにしましょう', duration: '5分' },
  { name: '日記を1行書く', category: '創作活動', description: '今日の気持ちや出来事をたった1行でも書き留めましょう', duration: '3分' },
  { name: '植物に水をやる（もしあれば）', category: 'セルフケア', description: '植物の世話をして、小さな生命に触れましょう', duration: '5分' }
];

const actionsLv3 = [
  { name: '今日のTo-Doリストを3つ書く', category: '創作活動', description: '今日やるべきことを3つだけ書き出し、達成感を味わいましょう', duration: '5分' },
  { name: '友人にメッセージを送る', category: '社交', description: '久しぶりの友人や大切な人に短いメッセージを送ってみましょう', duration: '5分' },
  { name: '簡単な料理を作る', category: '創作活動', description: '手軽に作れる料理に挑戦し、達成感を味わいましょう', duration: '30分' },
  { name: '読書を10分する', category: 'セルフケア', description: '好きな本や雑誌を10分だけ読んで、知識や想像力を育みましょう', duration: '10分' },
  { name: '部屋の整理を15分する', category: 'セルフケア', description: '身の回りの気になる場所を15分だけ整理整頓しましょう', duration: '15分' },
  { name: '新しい情報を1つ調べる', category: '創作活動', description: '興味のあることや知りたいことを一つだけ調べてみましょう', duration: '10分' },
  { name: '感謝できることを3つ見つける', category: 'リラックス', description: '今日あった良いことや感謝できることを3つ書き出してみましょう', duration: '5分' }
];

const actionsLv4 = [
  { name: '目標達成に向けた小さなタスクを1つ実行する', category: '創作活動', description: '中期目標達成のための具体的な一歩を踏み出しましょう', duration: '15分' },
  { name: '目標に関連する情報を調べる', category: '創作活動', description: '目標達成に必要な知識や情報を収集しましょう', duration: '20分' },
  { name: '運動を20分する', category: '運動', description: 'ウォーキングや軽い筋トレなど、体を動かす時間を20分作りましょう', duration: '20分' },
  { name: '長めの入浴をする', category: 'セルフケア', description: 'ゆっくり湯船に浸かり、心身をリラックスさせましょう', duration: '30分' },
  { name: '仲の良い人とゆっくり話す', category: '社交', description: '仲の良い人と今日の出来事や感じたことを共有する時間を作りましょう', duration: '20分' },
  { name: '自分の強みを3つ書き出す', category: 'セルフケア', description: '自分の良いところや得意なこと、新しくできるようになったことを3つ書き出し、自己肯定感を高めましょう', duration: '10分' },
  { name: '新しい知識を1つ学ぶ', category: '創作活動', description: '興味のある分野の新しい知識を一つ学びましょう', duration: '15分' }
];

const actionsLv5 = [
  { name: '長期目標の進捗を振り返る', category: '創作活動', description: '設定した長期目標の進捗を確認し、必要であれば計画を見直しましょう', duration: '30分' },
  { name: '新しい挑戦のための準備を1つする', category: '創作活動', description: '新しいスキル習得やプロジェクト開始に向けた準備を一つ進めましょう', duration: '45分' },
  { name: '新しい趣味を探す', category: '社交', description: '視野を広げ、人生を豊かにする新しい趣味や活動について情報収集してみましょう', duration: '20分' },
  { name: 'ボランティア活動について調べる', category: '社交', description: '社会貢献できるボランティア活動について調べてみましょう', duration: '20分' },
  { name: '新しい出会いの場を探す', category: '社交', description: '興味のあるコミュニティやイベントについて調べてみましょう', duration: '20分' },
  { name: '自分の価値観を再確認する', category: 'セルフケア', description: '自分にとって何が大切か、どんなことを重視したいか再確認しましょう', duration: '15分' },
  { name: '自己投資になる行動を1つする', category: 'セルフケア', description: '将来の自分への投資として、学びや経験に繋がる行動を一つ選びましょう', duration: '30分' }
];

export const actionsByLevel = {
  1: actionsLv1,
  2: actionsLv2,
  3: actionsLv3,
  4: actionsLv4,
  5: actionsLv5,
};
