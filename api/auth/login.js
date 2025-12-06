import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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
    const { email, password } = req.body

    // 입력 검증
    if (!email || !password) {
      res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' })
      return
    }

    // Supabase 클라이언트 생성
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({ error: 'Supabase 설정이 올바르지 않습니다.' })
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // 인증 실패
      if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
        res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' })
        return
      }
      res.status(400).json({ error: error.message })
      return
    }

    // 성공 응답 (세션 토큰 포함)
    res.status(200).json({
      message: '로그인 성공',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}

