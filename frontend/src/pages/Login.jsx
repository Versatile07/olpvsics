import { useState, useEffect } from "react";
import { loginUser } from "../api/auth.api";
import { setToken, isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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

          {/* Social Buttons (Visual Only) */}
          <div className="social-login">
            <button className="soc-btn google">
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="G" />
              Google
            </button>
            <button className="soc-btn github">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GH" />
              GitHub
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-alert">{error}</div>}

            <div className={`input-field ${focusedInput === 'email' || email ? 'active' : ''}`}>
              <label>Email Address</label>
              <input
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('pass')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>

            <div className="form-extras">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember for 30 days
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Sign in"}
            </button>
          </form>

          <div className="register-promo">
            Don't have an account? <span onClick={() => navigate("/")}>Home</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
