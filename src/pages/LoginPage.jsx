import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const LoginPage = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === '@Agustus2') {
      localStorage.setItem('admin_authenticated', 'true')
      navigate('/admin')
    } else {
      setError('Password salah!')
    }
  }

  return (
    <div className="login-container">
      <motion.div 
        className="login-card glass"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-header">
          <div className="lock-icon">
            <Lock size={32} />
          </div>
          <h2>Admin Login</h2>
          <p>Masukkan password untuk mengelola undangan</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-premium">Login</button>
        </form>
      </motion.div>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-cream);
          background-image: url('/src/assets/bg.png');
          background-size: cover;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
        }
        .lock-icon {
          width: 70px;
          height: 70px;
          background: rgba(184, 134, 11, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--primary);
        }
        h2 { margin-bottom: 10px; color: var(--secondary); }
        p { color: var(--text-light); margin-bottom: 30px; font-size: 0.9rem; }
        .form-group { margin-bottom: 20px; }
        input {
          width: 100%;
          padding: 15px;
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 12px;
          font-family: var(--font-body);
          text-align: center;
        }
        .error-msg { color: #e53e3e; font-size: 0.8rem; margin-top: -10px; margin-bottom: 15px; }
        .btn-premium { width: 100%; }
      `}</style>
    </div>
  )
}

export default LoginPage
