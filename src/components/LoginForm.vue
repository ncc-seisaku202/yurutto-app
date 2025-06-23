<template>
  <div class="login-container">
  <div class="login-form">
      <h2>{{ isLogin ? 'ログイン' : '新規登録' }}</h2>
      <form @submit.prevent="isLogin ? handleLogin() : handleSignup()">
        <div class="form-group">
          <label for="userId">メールアドレス</label>
          <input
            id="userId"
            v-model="userId"
            type="email"
            placeholder="メールアドレスを入力してください"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="パスワードを入力してください"
            required
            :disabled="isLoading"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          {{
            isLoading
              ? isLogin
                ? 'ログイン中...'
                : '登録中...'
              : isLogin
                ? 'ログイン'
                : '登録'
          }}
        </button>
      </form>
      <div class="toggle-link">
        <span>{{ isLogin ? 'アカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？' }}</span>
        <a href="#" @click.prevent="isLogin = !isLogin">
          {{ isLogin ? '新規登録はこちら' : 'ログインはこちら' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const emit = defineEmits(['login'])

const userId = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const isLogin = ref(true)

const handleLogin = async () => {
  if (!userId.value || !password.value) {
    errorMessage.value = 'IDとパスワードを入力してください'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Supabaseでメール/パスワード認証を実行
    // userIdをメールアドレスとして使用
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userId.value,
      password: password.value,
    })

    if (error) {
      console.error('ログインエラー:', error)
      errorMessage.value = 'ログインに失敗しました。IDとパスワードを確認してください。'
    } else {
      console.log('ログイン成功:', data)
      emit('login', {
        userId: userId.value,
        password: password.value,
        user: data.user
      })
    }
  } catch (error) {
    console.error('予期しないエラー:', error)
    errorMessage.value = 'ログイン処理中にエラーが発生しました。'
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  if (!userId.value || !password.value) {
    errorMessage.value = 'メールとパスワードを入力してください'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signUp({
      email: userId.value,
      password: password.value,
    })

    if (error) {
      console.error('登録エラー:', error)
      errorMessage.value = '登録に失敗しました。'
    } else {
      console.log('登録成功:', data)
      emit('login', {
        userId: userId.value,
        password: password.value,
        user: data.user,
      })
    }
  } catch (error) {
    console.error('予期しないエラー:', error)
    errorMessage.value = '登録処理中にエラーが発生しました。'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
  font-size: 0.9rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.toggle-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.toggle-link a {
  color: #667eea;
  cursor: pointer;
  margin-left: 0.25rem;
}
</style>