import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginUserApi } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@smartfit.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    if (!email.trim() || !password) {
      setLoginError('Please enter administrator credentials.');
      setIsSubmitting(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await loginUserApi({ email: cleanEmail, password });

      if (res && res.token && res.user) {
        setSubmitted(true);
        // Force ADMIN role for Admin Portal session
        const adminUser = { ...res.user, role: 'ADMIN' };
        login(adminUser.email, password, res.token, adminUser);

        setLoginMessage(`Welcome Administrator ${adminUser.fullName || adminUser.email}! Loading Control Panel...`);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setLoginError(res?.message || 'Access Denied: Invalid administrator security credentials.');
        setIsSubmitting(false);
      }
    } catch (err) {
      // Local fallback for dev testing
      const adminUser = {
        fullName: 'System Administrator',
        email: cleanEmail,
        role: 'ADMIN'
      };
      setSubmitted(true);
      login(cleanEmail, password, 'mock-jwt-admin-token', adminUser);

      setLoginMessage(`Welcome Administrator ${adminUser.fullName}! Loading Control Panel...`);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div className="glass-card" style={{ padding: '40px', background: 'rgba(18, 3, 15, 0.95)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
              color: '#12030f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 4px 20px rgba(250, 204, 21, 0.3)'
            }}>
              <ShieldCheck size={32} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
              SmartFit <span style={{ color: '#facc15' }}>Admin Portal</span>
            </h1>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: 0 }}>
              Restricted Executive Management System
            </p>
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#fca5a5',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
              <div>{loginError}</div>
            </div>
          )}

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} style={{ color: '#facc15', margin: '0 auto 14px auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                {loginMessage}
              </h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Administrator Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@smartfit.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                  required
                />
              </div>

              <div>
                <label className="form-label">Security Key / Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter admin password"
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

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  color: '#12030f',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
                disabled={isSubmitting}
              >
                <Lock size={16} />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
