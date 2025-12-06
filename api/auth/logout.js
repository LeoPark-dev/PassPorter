import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // Supabase 클라이언트 생성
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({ error: 'Supabase 설정이 올바르지 않습니다.' })
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Authorization 헤더에서 토큰 가져오기
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      // 토큰으로 세션 설정
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) {
        await supabase.auth.signOut()
      }
    }

    // 성공 응답
    res.status(200).json({ message: '로그아웃되었습니다.' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}

