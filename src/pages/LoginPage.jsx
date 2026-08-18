import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUserApi } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    if (!email.trim() || !password) {
      setLoginError('Please enter both your email address and password.');
      setIsSubmitting(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await loginUserApi({ email: cleanEmail, password });

      if (res && res.token && res.user) {
        setSubmitted(true);
        login(res.user.email, password, res.token, res.user);
        setLoginMessage(`Welcome back, ${res.user.fullName || res.user.email}! Loading AI Dashboard...`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setLoginError(res?.message || 'Access Denied: Incorrect password or invalid email address.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.warn('Backend API login note:', err.message);
      const res = login(cleanEmail, password);
      if (res && res.success) {
        setSubmitted(true);
        setLoginMessage(`Welcome back, ${res.user.fullName}! Loading AI Dashboard...`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setLoginError(res?.message || 'Access Denied: Incorrect password. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="badge" style={{ marginBottom: '12px' }}>
                <Sparkles size={14} /> Secure Authentication
              </div>
              <h1 className="gradient-peach-rose" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
                SmartFit Account Login
              </h1>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                Enter your credentials to access your AI fitness & nutrition dashboard.
              </p>
            </div>

            {loginError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#fca5a5' }}>
                <AlertCircle size={22} style={{ color: '#ef4444', flexShrink: 0 }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{loginError}</div>
              </div>
            )}

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={52} style={{ color: 'var(--peach-primary)', margin: '0 auto 16px auto' }} />
                <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                  {loginMessage}
                </h3>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="alex@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                      <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email!'); }} style={{ fontSize: '0.8rem', color: 'var(--peach-primary)', textDecoration: 'none' }}>
                        Forgot password?
                      </a>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0 24px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-subtle)' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: 'var(--peach-primary)' }}
                      />
                      Remember this device
                    </label>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Verifying Credentials...' : 'Login to Dashboard'}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
              Don't have an account yet? <Link to="/register" style={{ color: 'var(--peach-primary)', fontWeight: 600, textDecoration: 'none' }}>Get Started / Register</Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
