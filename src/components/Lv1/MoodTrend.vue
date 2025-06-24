<template>
  <div>
    <h2>気分の履歴</h2>
    <ul>
      <li v-for="mood in moods" :key="mood.id">
        {{ mood.created_at }} - {{ mood.mood }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const moods = ref([])

onMounted(async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  const session = sessionData.session

  if (!session || sessionError) {
    console.error('ログインセッションがありません')
    return
  }

  try {
    const { data, error } = await supabase
      .from('moods')
      .select('*')

    console.log('クエリ実行完了 - data:', data, 'error:', error)

    if (error) {
      console.error('moods取得失敗:', error)
      console.error('エラー詳細:', JSON.stringify(error, null, 2))
    } else {
      moods.value = data
      console.log('取得成功！データ件数:', data?.length || 0)
      console.log('データ内容:', data)
    }
  } catch (catchError) {
    console.error('予期しないエラー:', catchError)
  }
})

onMounted(async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  const session = sessionData?.session

  console.log('🟡 セッション取得:', session)

  if (!session || sessionError) {
    console.error('🔴 セッション取得失敗:', sessionError)
    return
  }

  const accessToken = session.access_token
  console.log('🟡 アクセストークン:', accessToken)

  const user = session.user
  const createdAfter = new Date('2025-06-23T15:00:00.000Z')

  const params = new URLSearchParams({
    select: 'mood,mood_level',
    user_id: `eq.${user.id}`,
    created_at: `gte.${createdAfter.toISOString()}`,
  })

  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/moods?${params.toString()}`
  const headers = {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  }

  console.log('🟡 リクエストURL:', url)
  console.log('🟡 リクエストヘッダー:', headers)

  try {
    const response = await fetch(url, { headers })
    const result = await response.json()

    console.log('🟢 REST APIからのレスポンス:', result)
  } catch (error) {
    console.error('🔴 fetch中にエラー:', error)
  }
})


</script>

<style scoped>
</style>
