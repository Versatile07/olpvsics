import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper-split">
      {/* Left Side - Visuals */}
      <div className="login-visual">
        <div className="visual-content">
          <div className="brand-pill">VSICS LaunchPad</div>
          <h1>Unlock your <br /> <span className="highlight-text">Potential.</span></h1>
          <p>Access the world's most advanced learning ecosystem designed for next-gen developers.</p>

          <div className="visual-cards">
            <div className="mini-card c1">
              <span>courses_completed</span>
              <b>12,450+</b>
            </div>
            <div className="mini-card c2">
              <span>active_users</span>
              <b>2,800+</b>
            </div>
          </div>
        </div>
        <div className="visual-overlay"></div>
      </div>

      {/* Right Side - Form */}
      <div className="login-interaction">
        <div className="interaction-box">
          <div className="mobile-brand">VSICS Portal</div>

          <div className="form-head">
            <h2>Welcome back</h2>
            <p className="sub-head">Please enter your details to sign in.</p>
          </div>

          <div className="divider">
            <span>SIGN IN</span>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-alert">{error}</div>}

            <div className={`input-field ${focusedInput === 'email' || email ? 'active' : ''}`}>
              <label>Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>

            <div className={`input-field ${focusedInput === 'pass' || password ? 'active' : ''}`}>
              <label>Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('pass')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>

            <button id="login-submit" type="submit" className="submit-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Sign in'}
            </button>
          </form>

          <div className="register-promo">
            Don't have an account? <span onClick={() => navigate('/')}>Home</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
