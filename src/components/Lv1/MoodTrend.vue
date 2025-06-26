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

    // 3. REST APIで気分データを取得（例として mood と mood_level のみ）
    const user = session.user
    const accessToken = session.access_token
    const createdAfter = new Date('2025-06-23T15:00:00.000Z')

    const params = new URLSearchParams({
      select: 'mood,mood_level',
      user_id: `eq.${user.id}`,
      created_at: `gte.${createdAfter.toISOString()}`,
    })

    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/moods?${params.toString()}`
    const headers = buildRestHeaders(accessToken)

    const response = await fetch(url, { headers })
    if (!response.ok) {
      errorMessage.value = `エラー: ${response.status} ${response.statusText}`
      return
    }

    await response.json()
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
