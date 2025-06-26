<template>
  <div>
    <h2>気分の履歴</h2>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <ul>
      <li v-for="mood in moods" :key="mood.id">
        {{ mood.created_at }} - {{ mood.mood }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase, buildRestHeaders } from '@/lib/supabase'

const moods = ref([])
const errorMessage = ref('')

// コンポーネントがマウントされたときの処理を一つにまとめる
onMounted(async () => {
  try {
    // 1. ログインセッションを取得して存在を確認
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    const session = sessionData?.session

    if (sessionError || !session) {
      errorMessage.value = 'ログインセッションがありません'
      return
    }

    // 2. Supabaseのテーブルから気分一覧を取得
    const { data, error } = await supabase.from('moods').select('*')

    if (error) {
      errorMessage.value = '気分データの取得に失敗しました'
      return
    }
    moods.value = data

    // 3. mood と mood_level のみ取得する例 (REST fetch を supabase-js に変更)
    const user = session.user
    const createdAfter = new Date('2025-06-23T15:00:00.000Z')

    const { data: moodData, error: moodError } = await supabase
      .from('moods')
      .select('mood, mood_level')
      .eq('user_id', user.id)
      .gte('created_at', createdAfter.toISOString())

    if (moodError) {
      errorMessage.value = 'moodデータの取得に失敗しました'
      console.error(moodError)
      return
    }

    // 必要であれば取得したデータを利用
    console.log('Filtered moods:', moodData)
  } catch (err) {
    // まとめてエラー処理
    errorMessage.value = 'データ取得中にエラーが発生しました'
    console.error(err)
  }
})

</script>

<style scoped>
.error {
  color: red;
}
</style>
