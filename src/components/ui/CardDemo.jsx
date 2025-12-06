import { useState } from "react"
import { Label } from "@/components/ui/label"
import "./CardDemo.css"

export function CardDemo() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log('로그인:', { email: formData.email, password: formData.password })
      // 로그인 로직 구현
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }
      console.log('회원가입:', formData)
      // 회원가입 로직 구현
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
      </div>
      <div className="card-demo-footer">
        <button
          type="submit"
          className="card-demo-button-primary"
          onClick={handleSubmit}
        >
          {isLogin ? 'Login' : 'Sign Up'}
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
