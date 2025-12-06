import { useState } from "react"
import { Label } from "@/components/ui/label"
import "./CardDemo.css"

export function CardDemo({ onSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        // 로그인
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '로그인에 실패했습니다.')
        }

        // 토큰을 localStorage에 저장
        if (data.session?.access_token) {
          localStorage.setItem('access_token', data.session.access_token)
          localStorage.setItem('refresh_token', data.session.refresh_token)
        }

        // 사용자 정보 저장
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }

        // 성공 콜백 호출
        if (onSuccess) {
          onSuccess(data.user)
        }

        // 모달 닫기
        if (onClose) {
          onClose()
        }
      } else {
        // 회원가입
        if (formData.password !== formData.confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.')
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '회원가입에 실패했습니다.')
        }

        alert('회원가입이 완료되었습니다! 로그인해주세요.')
        
        // 로그인 모드로 전환
        setIsLogin(true)
        setFormData({
          email: formData.email, // 이메일은 유지
          password: '',
          confirmPassword: '',
          name: ''
        })
      }
    } catch (err) {
      setError(err.message || '오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="card-demo-container w-full max-w-sm">
      <div className="card-demo-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 className="card-demo-title">
              {isLogin ? 'Login to your account' : 'Create an account'}
            </h2>
            <p className="card-demo-description">
              {isLogin 
                ? 'Enter your email below to login to your account'
                : 'Enter your information below to create your account'
              }
            </p>
          </div>
          <button
            className="card-demo-signup-link"
            onClick={() => setIsLogin(!isLogin)}
            style={{ marginLeft: '1rem', marginTop: '0.25rem' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
      <div className="card-demo-content">
        <form onSubmit={handleSubmit} className="card-demo-form">
          {!isLogin && (
            <div className="card-demo-field">
              <Label htmlFor="name" className="card-demo-label">Name</Label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required={!isLogin}
                className="card-demo-input"
              />
            </div>
          )}
          <div className="card-demo-field">
            <Label htmlFor="email" className="card-demo-label">Email</Label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="card-demo-input"
            />
          </div>
          <div className="card-demo-field">
            <div className="card-demo-password-header">
              <Label htmlFor="password" className="card-demo-label">Password</Label>
              {isLogin && (
                <a
                  href="#"
                  className="card-demo-forgot-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot your password?
                </a>
              )}
            </div>
            <input 
              id="password" 
              type="password" 
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required 
              className="card-demo-input"
            />
          </div>
          {!isLogin && (
            <div className="card-demo-field">
              <Label htmlFor="confirmPassword" className="card-demo-label">Confirm Password</Label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required={!isLogin}
                className="card-demo-input"
              />
            </div>
          )}
        </form>
        {error && (
          <div style={{ 
            color: '#ef4444', 
            fontSize: '0.875rem', 
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>
      <div className="card-demo-footer">
        <button
          type="submit"
          className="card-demo-button-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (isLogin ? '로그인 중...' : '가입 중...') : (isLogin ? 'Login' : 'Sign Up')}
        </button>
        <button
          type="button"
          className="card-demo-button-secondary"
        >
          {isLogin ? 'Login' : 'Sign Up'} with Google
        </button>
      </div>
    </div>
  )
}
