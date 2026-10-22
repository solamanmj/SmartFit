import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, 
  Shield, Users, Utensils, Dumbbell, Zap, Lock, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUserApi } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registeredAccounts } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialRole = location.state?.role || 
                      searchParams.get('role')?.toUpperCase() || 
                      (location.pathname.includes('nutritionist') ? 'NUTRITIONIST' : 
                       location.pathname.includes('trainer') ? 'TRAINER' : 
                       location.pathname.includes('admin') ? 'ADMIN' : 'USER');

  // Selected Role Tab: 'USER' | 'TRAINER' | 'NUTRITIONIST' | 'ADMIN'
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Form State
  const [email, setEmail] = useState(initialRole === 'NUTRITIONIST' ? 'sruthy@example.com' : (initialRole === 'TRAINER' ? 'marcus@example.com' : (initialRole === 'ADMIN' ? 'admin@smartfit.com' : 'aby@example.com')));
  const [password, setPassword] = useState(initialRole === 'ADMIN' ? 'AdminPass123!' : 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role Configuration tailored to SmartFit's Wine & Peach signature theme
  const ROLE_CONFIGS = {
    USER: {
      title: 'Member / Athlete',
      badge: 'FITNESS MEMBER',
      icon: Users,
      accentColor: '#FF9E7D', // Signature Peach
      accentSubtle: '#FFD9CB',
      gradient: 'linear-gradient(135deg, #FF9E7D 0%, #E8809D 100%)',
      glowShadow: '0 0 25px rgba(255, 158, 125, 0.35)',
      description: 'Access AI personalized workouts, macro meal tracking, and coach feedback.',
      demoEmail: 'anugrah@gmail.com',
      demoPassword: 'password123',
      targetPath: '/dashboard'
    },
    TRAINER: {
      title: 'Fitness Coach',
      badge: 'CERTIFIED TRAINER',
      icon: Dumbbell,
      accentColor: '#FF7043', // Coral Flame
      accentSubtle: '#FFB8A1',
      gradient: 'linear-gradient(135deg, #FF7043 0%, #C2185B 100%)',
      glowShadow: '0 0 25px rgba(255, 112, 67, 0.35)',
      description: 'Manage assigned clients, customize AI workout routines, and track adherence.',
      demoEmail: 'marcus@example.com',
      demoPassword: 'password123',
      targetPath: '/trainer-dashboard'
    },
    NUTRITIONIST: {
      title: 'Dietitian Expert',
      badge: 'CLINICAL NUTRITIONIST',
      icon: Utensils,
      accentColor: '#34D399', // Mint Peach Fusion
      accentSubtle: '#A7F3D0',
      gradient: 'linear-gradient(135deg, #FF9E7D 0%, #10B981 100%)',
      glowShadow: '0 0 25px rgba(52, 211, 153, 0.35)',
      description: 'Calibrate macronutrients, review dietary health, and publish meal blueprints.',
      demoEmail: 'sruthy@example.com',
      demoPassword: 'password123',
      targetPath: '/nutritionist-dashboard'
    },
    ADMIN: {
      title: 'Platform Admin',
      badge: 'SYSTEM ADMINISTRATOR',
      icon: Shield,
      accentColor: '#E8809D', // Rose Wine
      accentSubtle: '#F7CAD0',
      gradient: 'linear-gradient(135deg, #E8809D 0%, #521541 100%)',
      glowShadow: '0 0 25px rgba(232, 128, 157, 0.35)',
      description: 'Platform governance, professional assignments, and recommendation engines.',
      demoEmail: 'admin@smartfit.com',
      demoPassword: 'AdminPass123!',
      targetPath: '/admin'
    }
  };

  const SPECIALIST_ACCOUNTS = {
    TRAINER: [
      { name: 'Marcus Vance', email: 'marcus@example.com', badge: 'Hypertrophy Coach' },
      { name: 'Midhun Suresh', email: 'midhun.trainer@smartfit.com', badge: 'Strength Specialist' },
      { name: 'Sarah Jenkins', email: 'sarah@example.com', badge: 'Cardio & Calisthenics' },
      { name: 'David Kim', email: 'david@example.com', badge: 'Athletic Mobility' }
    ],
    NUTRITIONIST: [
      { name: 'Dr. Elena Rostova', email: 'elena@example.com', badge: 'Ph.D. Sports Clinical' },
      { name: 'Sruthy Varghese', email: 'sruthy@example.com', badge: 'M.Sc. Dietetics & Plant-Based' }
    ]
  };

  const currentRoleConfig = ROLE_CONFIGS[selectedRole];

  // Handle switching role tabs
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setLoginError('');
    const config = ROLE_CONFIGS[roleKey];
    if (config) {
      setEmail(config.demoEmail);
      const existingAcc = (registeredAccounts || []).find(a => a.email.toLowerCase() === config.demoEmail.toLowerCase());
      if (existingAcc && (existingAcc.hasChangedDefaultPassword || existingAcc.passwordLastChangedAt)) {
        setPassword('');
      } else {
        setPassword(config.demoPassword);
      }
    }
  };

  useEffect(() => {
    if (initialRole && ROLE_CONFIGS[initialRole]) {
      handleRoleSelect(initialRole);
    }
  }, [location.pathname, location.search, location.state]);

  const getRedirectPathForUser = (userObj) => {
    const r = (userObj?.role || selectedRole).toUpperCase();
    if (r === 'ADMIN') return '/admin';
    if (r === 'TRAINER') return '/trainer-dashboard';
    if (r === 'NUTRITIONIST') return '/nutritionist-dashboard';
    return '/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    if (!email.trim() || !password) {
      setLoginError('Please provide both your email and password.');
      setIsSubmitting(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await loginUserApi({ email: cleanEmail, password });

      if (res && res.token && res.user) {
        setSubmitted(true);
        login(res.user.email, password, res.token, res.user);
        const destination = getRedirectPathForUser(res.user);
        setLoginMessage(`Welcome back, ${res.user.fullName || res.user.email}! Launching your workspace...`);
        setTimeout(() => {
          navigate(destination);
        }, 900);
      } else {
        setLoginError(res?.message || 'Access Denied: Invalid email or password credentials.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.warn('Backend API login note:', err.message);
      const isFetchErr = (err.message || '').toLowerCase().includes('failed to fetch') || 
                         (err.message || '').toLowerCase().includes('network') ||
                         (err.message || '').toLowerCase().includes('server connection') ||
                         (err.message || '').toLowerCase().includes('unable to reach') ||
                         (err.message || '').toLowerCase().includes('connection');
      if (isFetchErr) {
        const res = login(cleanEmail, password);
        if (res && res.success) {
          setSubmitted(true);
          const destination = getRedirectPathForUser(res.user);
          setLoginMessage(`Welcome back, ${res.user.fullName}! Launching workspace...`);
          setTimeout(() => {
            navigate(destination);
          }, 900);
          return;
        } else {
          setLoginError(res?.message || 'Incorrect Password: The password you entered is incorrect.');
          setIsSubmitting(false);
          return;
        }
      }
      setLoginError(err.message || 'Incorrect Password: The password you entered is incorrect. Please verify your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#12030F', // Deep Velvet Wine
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(82, 21, 65, 0.65) 0%, transparent 50%),
        radial-gradient(circle at 85% 25%, rgba(255, 158, 125, 0.18) 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(56, 11, 43, 0.75) 0%, transparent 60%)
      `,
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar />

      <main className="container" style={{ 
        flex: 1, 
        paddingTop: '120px', 
        paddingBottom: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Ambient Wine & Peach Glow Orbs */}
        <div style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 158, 125, 0.22) 0%, rgba(82, 21, 65, 0.15) 70%, transparent 100%)',
          filter: 'blur(120px)',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          transition: 'all 0.5s ease'
        }} />

        <div style={{ width: '100%', maxWidth: '580px' }}>
          
          {/* Header Title with Wine-Peach Palette */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 11, 43, 0.6)',
              border: `1px solid rgba(255, 158, 125, 0.35)`,
              color: 'var(--peach-primary)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.6px',
              marginBottom: '12px',
              boxShadow: '0 4px 15px rgba(255, 158, 125, 0.2)'
            }}>
              <Sparkles size={14} style={{ color: '#FF9E7D' }} /> {currentRoleConfig.badge}
            </div>

            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              margin: '0 0 8px 0', 
              background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Smart<span style={{ color: '#FF9E7D', WebkitTextFillColor: '#FF9E7D' }}>Fit</span> Portal Login
            </h1>
            <p style={{ color: '#E2C9D6', fontSize: '0.92rem', margin: 0 }}>
              Select your role to access your personalized health & coaching workspace.
            </p>
          </div>

          {/* 4-Role Segmented Switcher in Deep Wine Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            background: 'rgba(29, 7, 24, 0.85)',
            border: '1px solid rgba(255, 158, 125, 0.2)',
            padding: '6px',
            borderRadius: '16px',
            marginBottom: '20px',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            {Object.keys(ROLE_CONFIGS).map((roleKey) => {
              const cfg = ROLE_CONFIGS[roleKey];
              const isSelected = selectedRole === roleKey;
              const IconComp = cfg.icon;

              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleSelect(roleKey)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 6px',
                    borderRadius: '12px',
                    border: isSelected ? `1px solid ${cfg.accentColor}` : '1px solid transparent',
                    background: isSelected ? 'rgba(82, 21, 65, 0.55)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#B392A5',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 4px 18px ${cfg.accentColor}30` : 'none'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isSelected ? cfg.gradient : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#12030F' : '#B392A5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
                  }}>
                    <IconComp size={18} color={isSelected ? '#12030F' : '#B392A5'} />
                  </div>
                  <span style={{ 
                    fontSize: '0.78rem', 
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#FFD9CB' : '#B392A5'
                  }}>
                    {cfg.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Frosted Wine-Peach Glass Card */}
          <div style={{
            background: 'rgba(32, 8, 26, 0.78)',
            border: `1px solid rgba(255, 158, 125, 0.28)`,
            borderRadius: '24px',
            padding: '36px',
            backdropFilter: 'blur(25px)',
            boxShadow: `0 25px 50px rgba(0, 0, 0, 0.55), 0 0 35px rgba(82, 21, 65, 0.35)`,
            transition: 'border 0.4s ease, box-shadow 0.4s ease'
          }}>

            {/* Dynamic Role Scope Hint Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(56, 11, 43, 0.65)',
              border: `1px solid ${currentRoleConfig.accentColor}35`,
              borderRadius: '14px',
              padding: '12px 16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: currentRoleConfig.gradient,
                color: '#12030F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <currentRoleConfig.icon size={20} color="#12030F" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFD9CB' }}>
                  Signing in as {currentRoleConfig.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#E2C9D6', marginTop: '2px' }}>
                  {currentRoleConfig.description}
                </div>
              </div>
            </div>

            {/* Initial Login Credentials Guidance for Specialists */}
            {(selectedRole === 'TRAINER' || selectedRole === 'NUTRITIONIST') && (
              <div style={{
                background: 'rgba(255, 158, 125, 0.08)',
                border: '1px dashed rgba(255, 158, 125, 0.35)',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: currentRoleConfig.accentColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🔑 Initial Staff Login Credentials</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '6px', color: '#FFD9CB' }}>
                    Default Password: <strong style={{ color: '#fff' }}>password123</strong>
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#E2C9D6', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  Enrolled specialists are provided with initial default credentials below. You can log in immediately and customize your password in dashboard settings.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(SPECIALIST_ACCOUNTS[selectedRole] || []).map((spec) => {
                    const isCurrent = email.toLowerCase() === spec.email.toLowerCase();
                    return (
                      <button
                        key={spec.email}
                        type="button"
                        onClick={() => {
                          setEmail(spec.email);
                          setLoginError('');
                          const acc = (registeredAccounts || []).find(a => a.email.toLowerCase() === spec.email.toLowerCase());
                          if (acc && acc.hasChangedDefaultPassword && acc.plainPasswordFallback) {
                            setPassword(acc.plainPasswordFallback);
                          } else {
                            setPassword('password123');
                          }
                        }}
                        style={{
                          background: isCurrent ? currentRoleConfig.gradient : 'rgba(255,255,255,0.06)',
                          color: isCurrent ? '#12030F' : '#FFFFFF',
                          border: isCurrent ? 'none' : '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{spec.name}</span>
                        <span style={{ opacity: isCurrent ? 0.8 : 0.6, fontSize: '0.7rem' }}>({spec.badge})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Message */}
            {loginError && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.18)', 
                border: '1px solid rgba(239, 68, 68, 0.45)', 
                borderRadius: '12px', 
                padding: '14px 18px', 
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                color: '#FCA5A5' 
              }}>
                <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
                <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{loginError}</div>
              </div>
            )}

            {/* Success State */}
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: currentRoleConfig.gradient,
                  color: '#12030F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: `0 0 35px ${currentRoleConfig.accentColor}80`
                }}>
                  <CheckCircle2 size={38} color="#12030F" />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                  Authentication Successful
                </h3>
                <p style={{ color: '#FFD9CB', fontSize: '0.9rem', margin: 0 }}>
                  {loginMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                
                {/* Email Input Field */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FFD9CB', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#B392A5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                      placeholder="name@example.com"
                      required
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 44px',
                        backgroundColor: 'rgba(18, 3, 15, 0.65)',
                        border: '1px solid rgba(255, 158, 125, 0.22)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FF9E7D';
                        e.target.style.backgroundColor = 'rgba(29, 7, 24, 0.85)';
                        e.target.style.boxShadow = '0 0 15px rgba(255, 158, 125, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 158, 125, 0.22)';
                        e.target.style.backgroundColor = 'rgba(18, 3, 15, 0.65)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD9CB', margin: 0 }}>
                      Password
                    </label>
                    <a 
                      href="#reset" 
                      onClick={(e) => { e.preventDefault(); alert('Password reset verification link dispatched to ' + email); }}
                      style={{ fontSize: '0.78rem', color: '#FF9E7D', textDecoration: 'none', fontWeight: 600 }}>
                      Forgot password?
                    </a>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#B392A5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                      placeholder="Enter account password"
                      required
                      style={{
                        width: '100%',
                        padding: '13px 44px 13px 44px',
                        backgroundColor: 'rgba(18, 3, 15, 0.65)',
                        border: '1px solid rgba(255, 158, 125, 0.22)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FF9E7D';
                        e.target.style.backgroundColor = 'rgba(29, 7, 24, 0.85)';
                        e.target.style.boxShadow = '0 0 15px rgba(255, 158, 125, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 158, 125, 0.22)';
                        e.target.style.backgroundColor = 'rgba(18, 3, 15, 0.65)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#B392A5',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Quick Demo Filler */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.84rem', color: '#E2C9D6' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#FF9E7D', width: '16px', height: '16px', borderRadius: '4px' }}
                    />
                    Remember this session
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail(currentRoleConfig.demoEmail);
                      setPassword(currentRoleConfig.demoPassword);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FF9E7D',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap size={14} style={{ color: '#FF9E7D' }} /> Auto-fill {currentRoleConfig.title} Demo
                  </button>
                </div>

                {/* Submit Action Button in Radiant Peach-to-Rose Gradient */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FF9E7D 0%, #E8809D 50%, #881337 100%)',
                    color: '#12030F',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 25px rgba(255, 158, 125, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 158, 125, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 158, 125, 0.45)';
                  }}
                >
                  <span style={{ color: '#12030F' }}>{isSubmitting ? 'Authenticating...' : `Enter ${currentRoleConfig.title} Portal`}</span>
                  <ArrowRight size={18} color="#12030F" />
                </button>

              </form>
            )}

            {/* Footer Registration Link */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '26px', 
              paddingTop: '20px', 
              borderTop: '1px solid rgba(255, 158, 125, 0.15)',
              color: '#B392A5', 
              fontSize: '0.88rem' 
            }}>
              New to SmartFit?{' '}
              <Link to="/register" style={{ color: '#FF9E7D', fontWeight: 700, textDecoration: 'none' }}>
                Create Member Account
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
