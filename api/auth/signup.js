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
    const { email, password, name } = req.body

    // 입력 검증
    if (!email || !password || !name) {
      res.status(400).json({ error: '이메일, 비밀번호, 이름은 필수입니다.' })
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: '올바른 이메일 형식이 아닙니다.' })
      return
    }

    // 비밀번호 길이 검증 (최소 6자)
    if (password.length < 6) {
      res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' })
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

    // 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: undefined, // 이메일 확인 후 리다이렉트 URL (선택사항)
      },
    })

    if (error) {
      // 이메일 중복 체크
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        res.status(400).json({ error: '이미 등록된 이메일입니다.' })
        return
      }
      console.error('Signup error details:', error)
      res.status(400).json({ error: error.message || '회원가입에 실패했습니다.' })
      return
    }

    // 이메일 확인이 필요한 경우
    if (!data.session) {
      res.status(201).json({
        message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.',
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
        },
        requiresEmailConfirmation: true,
      })
      return
    }

    // 세션이 있는 경우 (이메일 확인 불필요)
    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
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
    console.error('Signup error:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}

