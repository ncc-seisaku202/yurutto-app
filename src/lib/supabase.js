import { createClient } from '@supabase/supabase-js'

// 環境変数から設定を読み込み
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 環境変数が設定されていない場合のエラーハンドリング
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません。.env.localファイルを確認してください。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// REST API呼び出し時に使用する共通ヘッダーを生成
export const buildRestHeaders = (accessToken) => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${accessToken}`,
  Accept: 'application/json',
})
