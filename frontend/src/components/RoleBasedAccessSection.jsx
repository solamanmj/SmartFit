import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, Dumbbell, Utensils, Shield, Sparkles, 
  ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUserApi } from '../services/api';

export default function RoleBasedAccessSection() {
  const navigate = useNavigate();
  const { login, registeredAccounts } = useAuth();

  const [selectedRole, setSelectedRole] = useState('USER');
  const [email, setEmail] = useState('aby@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  const ROLES = {
    USER: {
      key: 'USER',
      title: 'Member / Athlete',
      badge: 'ATHLETE ACCESS',
      icon: Users,
      accent: 'var(--peach-primary)',
      accentBg: 'rgba(255, 158, 125, 0.12)',
      border: 'rgba(255, 158, 125, 0.3)',
      tagline: 'AI Workouts & Nutrition',
      description: 'Personalized training splits, continuous macro tracking, and trainer guidance.',
      demoEmail: 'aby@example.com',
      demoPass: 'password123',
      targetPath: '/dashboard'
    },
    TRAINER: {
      key: 'TRAINER',
      title: 'Fitness Coach',
      badge: 'TRAINER PORTAL',
      icon: Dumbbell,
      accent: '#FF7043',
      accentBg: 'rgba(255, 112, 67, 0.12)',
      border: 'rgba(255, 112, 67, 0.35)',
      tagline: 'Client Roster & Workouts',
      description: 'Review assigned athletes, calibrate workout routines, and publish training plans.',
      demoEmail: 'marcus@example.com',
      demoPass: 'password123',
      targetPath: '/trainer-dashboard'
    },
    NUTRITIONIST: {
      key: 'NUTRITIONIST',
      title: 'Clinical Nutritionist',
      badge: 'DIETITIAN PORTAL',
      icon: Utensils,
      accent: '#10B981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      tagline: 'Macronutrients & Meals',
      description: 'Publish calibrated meal blueprints, macro targets, and clinical dietary guidance.',
      demoEmail: 'sruthy@example.com',
      demoPass: 'password123',
      targetPath: '/nutritionist-dashboard'
    },
    ADMIN: {
      key: 'ADMIN',
      title: 'Platform Admin',
      badge: 'EXECUTIVE CONSOLE',
      icon: Shield,
      accent: '#facc15',
      accentBg: 'rgba(250, 204, 21, 0.12)',
      border: 'rgba(250, 204, 21, 0.35)',
      tagline: 'Database & Governance',
      description: 'User directory governance, Care team assignments, and ML model monitoring.',
      demoEmail: 'admin@smartfit.com',
      demoPass: 'AdminPass123!',
      targetPath: '/admin/dashboard'
    }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setLoginError('');
    setLoginSuccess('');
    const targetEmail = ROLES[roleKey].demoEmail;
    setEmail(targetEmail);

    const existingAcc = (registeredAccounts || []).find(a => a.email.toLowerCase() === targetEmail.toLowerCase());
    if (existingAcc && (existingAcc.hasChangedDefaultPassword || existingAcc.passwordLastChangedAt)) {
      setPassword('');
    } else {
      setPassword(ROLES[roleKey].demoPass);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const response = await loginUserApi({ email: email.trim(), password });
      if (response && response.user) {
        login(response.user, response.token);
        setLoginSuccess(`Signed in as ${response.user.fullName || response.user.email} (${response.user.role || selectedRole})`);
        
        const role = (response.user.role || selectedRole).toUpperCase();
        let redirectPath = '/dashboard';
        if (role === 'ADMIN') redirectPath = '/admin/dashboard';
        else if (role === 'TRAINER') redirectPath = '/trainer-dashboard';
        else if (role === 'NUTRITIONIST') redirectPath = '/nutritionist-dashboard';

        setTimeout(() => {
          navigate(redirectPath);
        }, 600);
      } else {
        throw new Error('Invalid login credentials.');
      }
    } catch (err) {
      // Fallback offline login check if network failed, or report actual backend message
      const isFetchErr = (err.message || '').toLowerCase().includes('failed to fetch') || (err.message || '').toLowerCase().includes('network');
      if (isFetchErr) {
        const res = login(email.trim(), password);
        if (res && res.success) {
          setLoginSuccess(`Signed in as ${res.user.fullName || res.user.email} (${res.user.role || selectedRole})`);
          const role = (res.user.role || selectedRole).toUpperCase();
          let redirectPath = '/dashboard';
          if (role === 'ADMIN') redirectPath = '/admin/dashboard';
          else if (role === 'TRAINER') redirectPath = '/trainer-dashboard';
          else if (role === 'NUTRITIONIST') redirectPath = '/nutritionist-dashboard';
          setTimeout(() => {
            navigate(redirectPath);
          }, 600);
          return;
        } else {
          setLoginError(res?.message || 'Incorrect Password: The password you entered is incorrect.');
        }
      } else {
        setLoginError(err.message || 'Incorrect Password: The password you entered is incorrect. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRole = ROLES[selectedRole];
  const CurrentIcon = currentRole.icon;

  return (
    <section id="role-access" style={{ padding: '80px 0', position: 'relative', background: 'rgba(18, 3, 15, 0.6)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 48px auto' }}>
          <div className="badge" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} />
            <span>ROLE-BASED PORTAL ACCESS</span>
          </div>
          <h2 className="gradient-peach-rose" style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Sign In with Role-Based Access
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
            Select your professional or athlete role below to access your dedicated SmartFit dashboard with personalized tools and governance.
          </p>
        </div>

        {/* 4 Role Selection Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {Object.values(ROLES).map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.key;

            return (
              <div
                key={r.key}
                onClick={() => handleRoleSelect(r.key)}
                className="glass-card"
                style={{
                  padding: '22px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${r.accent}` : '1px solid var(--glass-border)',
                  background: isSelected ? r.accentBg : 'rgba(255, 255, 255, 0.03)',
                  boxShadow: isSelected ? `0 8px 24px ${r.border}` : 'none',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: r.accentBg,
                    color: r.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    color: r.accent,
                    background: 'rgba(0,0,0,0.3)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {r.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', margin: 0, lineHeight: 1.4 }}>
                  {r.tagline}
                </p>

                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: r.accent,
                    color: '#12030f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Role Login Box */}
        <div className="glass-card" style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '36px',
          borderRadius: '20px',
          border: `1px solid ${currentRole.border}`,
          background: 'rgba(29, 7, 24, 0.95)',
          boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 30px ${currentRole.accentBg}`
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: currentRole.accentBg,
              color: currentRole.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CurrentIcon size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0', fontWeight: 800 }}>
                Sign In as {currentRole.title}
              </h3>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.84rem', margin: 0 }}>
                {currentRole.description}
              </p>
            </div>
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          {loginSuccess && (
            <div style={{
              background: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              color: '#4ade80',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> {loginSuccess}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartfit.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: currentRole.key === 'ADMIN'
                  ? 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)'
                  : currentRole.key === 'TRAINER'
                  ? 'linear-gradient(135deg, #FF7043 0%, #C2185B 100%)'
                  : currentRole.key === 'NUTRITIONIST'
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, var(--peach-primary) 0%, var(--rose-primary) 100%)',
                color: currentRole.key === 'ADMIN' ? '#12030f' : '#fff',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: `0 4px 16px ${currentRole.border}`
              }}
            >
              <span>{isSubmitting ? 'Authenticating...' : `Enter ${currentRole.title} Portal`}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Selector Footer */}
          <div style={{ marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            <span>Need a new athlete account? <Link to="/register" style={{ color: 'var(--peach-primary)', fontWeight: 700, textDecoration: 'none' }}>Register here</Link></span>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
              Full Login Page →
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
