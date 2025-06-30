<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Lv1 from './components/Lv1/MainView.vue'
import Lv2 from './components/Lv2/MainView.vue'
import Lv3 from './components/Lv3/MainView.vue'
import Lv4 from './components/Lv4/MainView.vue' // ← 追加
import Lv5 from './components/Lv5/MainView.vue'
import LoginForm from './components/LoginForm.vue'

const currentLevel = ref('Lv2') // デフォルトをLv2に設定

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
    <LoginForm v-if="!isLoggedIn" @login="handleLogin" />
    <div v-else>
      <!-- ヘッダー部分 -->
      <div class="header">
        <div class="user-info">
          <span>ようこそ、{{ currentUser }}さん</span>
          <span class="user-uid">UID: {{ userUID }}</span>
        </div>
        <div class="header-controls">
          <!-- レベル切り替えボタン -->
          <div class="level-selector">
            <button
              :class="['level-btn', { active: currentLevel === 'Lv1' }]"
              @click="currentLevel = 'Lv1'"
            >
              Lv1
            </button>
            <button
              :class="['level-btn', { active: currentLevel === 'Lv2' }]"
              @click="currentLevel = 'Lv2'"
            >
              Lv2
            </button>
            <button
              :class="['level-btn', { active: currentLevel === 'Lv3' }]"
              @click="currentLevel = 'Lv3'"
            >
              Lv3
            </button>
            <button
              :class="['level-btn', { active: currentLevel === 'Lv4' }]"
              @click="currentLevel = 'Lv4'"
            >
              Lv4
            </button>
            <button
              :class="['level-btn', { active: currentLevel === 'Lv5' }]"
              @click="currentLevel = 'Lv5'"
            >
              Lv5
            </button>
          </div>

          <button @click="handleLogout" class="logout-button">ログアウト</button>
        </div>
      </div>
      
      <!-- レベルに応じてコンポーネントを切り替え -->
      <Lv1 v-if="currentLevel === 'Lv1'" />
      <Lv2 v-if="currentLevel === 'Lv2'" />
      <Lv3 v-if="currentLevel === 'Lv3'" />
      <Lv4 v-if="currentLevel === 'Lv4'" />
      <Lv5 v-if="currentLevel === 'Lv5'" />
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-selector {
  display: flex;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.level-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: #fff;
  color: #6c757d;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  border-right: 1px solid #e9ecef;
}

.level-btn:last-child {
  border-right: none;
}

.level-btn:hover {
  background: #f8f9fa;
}

.level-btn.active {
  background: #007bff;
  color: white;
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
