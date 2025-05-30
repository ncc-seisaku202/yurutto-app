<script setup>
import { ref } from 'vue'
import Lv1 from './components/Lv1/index.vue'
import Login from './components/Login.vue'

const isLoggedIn = ref(false)
const currentUser = ref(null)

const handleLogin = (credentials) => {
  // 簡単なログイン処理（実際のアプリケーションでは認証APIを呼び出します）
  console.log('ログイン試行:', credentials)
  
  // デモ用：任意のID/パスワードでログイン成功とする
  if (credentials.userId && credentials.password) {
    isLoggedIn.value = true
    currentUser.value = credentials.userId
    console.log('ログイン成功:', credentials.userId)
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  currentUser.value = null
  console.log('ログアウトしました')
}
</script>

<template>
  <div>
    <!-- ログイン状態に応じて表示を切り替え -->
    <Login v-if="!isLoggedIn" @login="handleLogin" />
    <div v-else>
      <!-- ログアウトボタンを追加 -->
      <div class="header">
        <span>ようこそ、{{ currentUser }}さん</span>
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
