<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Lv1 from './components/Lv1/index.vue'
import Login from './components/Login.vue'

const isLoggedIn = ref(false)
const currentUser = ref(null)
const userUID = ref(null)

const handleLogin = (credentials) => {
  console.log('ログイン試行:', credentials)
  
  if (credentials.user) {
    isLoggedIn.value = true
    currentUser.value = credentials.userId
    userUID.value = credentials.user.id
    console.log('ログイン成功 - UID:', credentials.user.id)
    console.log('ログイン成功 - Email:', credentials.userId)
  }
}

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('ログアウトエラー:', error)
    } else {
      isLoggedIn.value = false
      currentUser.value = null
      userUID.value = null
      console.log('ログアウトしました')
    }
  } catch (error) {
    console.error('予期しないログアウトエラー:', error)
  }
}

// ページ読み込み時に認証状態をチェック
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    isLoggedIn.value = true
    currentUser.value = user.email
    userUID.value = user.id
    console.log('既存セッション検出 - UID:', user.id)
  }
})
</script>

<template>
  <div>
    <!-- ログイン状態に応じて表示を切り替え -->
    <Login v-if="!isLoggedIn" @login="handleLogin" />
    <div v-else>
      <!-- ログアウトボタンを追加 -->
      <div class="header">
        <div class="user-info">
          <span>ようこそ、{{ currentUser }}さん</span>
          <span class="user-uid">UID: {{ userUID }}</span>
        </div>
        <button @click="handleLogout" class="logout-button">ログアウト</button>
      </div>
      <Lv1 />
    </div>
  </div>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-uid {
  font-size: 0.8rem;
  color: #6c757d;
  font-family: monospace;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>
