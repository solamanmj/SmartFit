import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, ArrowRight, ArrowLeft, ShieldAlert, Activity, HeartPulse, 
  Lock, Eye, EyeOff, CheckCircle2, Circle, AlertCircle, ShieldCheck, Check, X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUserApi } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '26',
    gender: 'Male',
    height: '178',
    weight: '75',
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Muscle Building',
    dietaryPreference: 'Standard Balanced',
    workoutEquipment: 'Full Gym Access',
    medicalConditions: 'None'
  });

  const passwordCriteria = [
    { id: 'length', label: '8+ characters', met: formData.password.length >= 8 },
    { id: 'upper', label: 'Uppercase (A-Z)', met: /[A-Z]/.test(formData.password) },
    { id: 'lower', label: 'Lowercase (a-z)', met: /[a-z]/.test(formData.password) },
    { id: 'number', label: 'Number (0-9)', met: /\d/.test(formData.password) },
    { id: 'special', label: 'Special symbol (@$!%*#...)', met: /[@$!%*?&#^()_+\-=[\]{}|;:',.<>/]/.test(formData.password) }
  ];

  const passedCriteriaCount = passwordCriteria.filter(c => c.met).length;
  const isPasswordStrong = passedCriteriaCount === 5;
  const passwordsMatch = Boolean(formData.confirmPassword && formData.password === formData.confirmPassword);

  const getStrengthInfo = () => {
    if (!formData.password) return { label: '', percent: 0, color: 'rgba(255,255,255,0.1)' };
    if (passedCriteriaCount <= 1) return { label: 'Very Weak', percent: 20, color: '#EF4444' };
    if (passedCriteriaCount === 2) return { label: 'Weak', percent: 40, color: '#F97316' };
    if (passedCriteriaCount === 3) return { label: 'Moderate', percent: 60, color: '#FBBF24' };
    if (passedCriteriaCount === 4) return { label: 'Good', percent: 80, color: '#34D399' };
    return { label: 'Very Strong', percent: 100, color: '#10B981' };
  };

  const strengthInfo = getStrengthInfo();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationError('');
    setBackendError('');
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setValidationError('');
    setBackendError('');

    if (step === 1) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
      if (!emailRegex.test(formData.email.trim())) {
        setValidationError('Please enter a valid email address (e.g. alex@example.com).');
        return;
      }

      if (!isPasswordStrong) {
        setValidationError('Password must meet all 5 requirements: at least 8 characters, uppercase, lowercase, number, and special character.');
        return;
      }

      if (!passwordsMatch) {
        setValidationError('Passwords do not match. Please verify both password fields.');
        return;
      }

      const ageNum = parseInt(formData.age, 10);
      const heightNum = parseFloat(formData.height);
      const weightNum = parseFloat(formData.weight);

      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        setValidationError('Age must be between 13 and 120 years.');
        return;
      }
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
        setValidationError('Height must be between 50 cm and 250 cm.');
        return;
      }
      if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
        setValidationError('Weight must be between 20 kg and 300 kg.');
        return;
      }

      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitting(true);
      const payload = {
        fullName: formData.fullName.trim() || formData.email.trim().split('@')[0],
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        age: parseInt(formData.age, 10) || 26,
        gender: formData.gender || 'Male',
        height: parseFloat(formData.height) || 178,
        weight: parseFloat(formData.weight) || 75,
        activityLevel: formData.activityLevel || 'Moderately Active',
        fitnessGoal: formData.fitnessGoal || 'Muscle Building',
        dietaryPreference: formData.dietaryPreference || 'Standard Balanced',
        workoutEquipment: formData.workoutEquipment || 'Full Gym Access',
        medicalConditions: formData.medicalConditions || 'None'
      };

      try {
        const res = await registerUserApi(payload);
        if (res && res.token) {
          register(res.user || payload, res.token);
          setIsSubmitting(false);
          navigate('/dashboard');
        } else {
          setBackendError(res?.message || 'Registration failed. Please try again.');
          setIsSubmitting(false);
        }
      } catch (err) {
        console.warn('Registration API note:', err.message);
        if (err.message && (
          err.message.includes('already registered') || 
          err.message.includes('Password must') || 
          err.message.includes('Full name') || 
          err.message.includes('valid email') ||
          err.message.includes('Age must') ||
          err.message.includes('Height must') ||
          err.message.includes('Weight must')
        )) {
          setBackendError(err.message);
          setIsSubmitting(false);
        } else {
          register(payload);
          setIsSubmitting(false);
          navigate('/dashboard');
        }
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="badge" style={{ marginBottom: '14px' }}>
              <Sparkles size={14} /> Step {step} of 3 • SmartFit Account Registration
            </div>
            <h1 className="gradient-peach-rose" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
              Create Your Secure Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Set up your credentials with strong password security & biometric parameters.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    height: '6px',
                    width: i <= step ? '80px' : '40px',
                    borderRadius: '4px',
                    background: i <= step ? 'var(--peach-primary)' : 'rgba(255, 255, 255, 0.15)',
                    transition: '0.4s'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '40px' }}>
            {validationError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#fca5a5' }}>
                <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{validationError}</span>
              </div>
            )}

            {backendError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', color: '#fca5a5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{backendError}</span>
                </div>
                {backendError.includes('already registered') && (
                  <Link to="/login" style={{ color: 'var(--peach-primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'underline' }}>
                    Click here to Login &rarr;
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleNextStep}>

              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--peach-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={22} style={{ color: 'var(--peach-primary)' }} />
                    1. Account Credentials & Security
                  </h3>

                  {/* Full Name Field */}
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Alex Morgan"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                  </div>

                  {/* Email Address with Dynamic Live Validation */}
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ margin: 0 }}>Email Address (Login Username)</label>
                      {formData.email.trim().length > 0 && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(formData.email.trim()) ? '#34D399' : '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(formData.email.trim()) ? (
                            <><CheckCircle2 size={13} color="#34D399" /> Valid Email Format</>
                          ) : (
                            <><AlertCircle size={13} color="#EF4444" /> Enter valid email address</>
                          )}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      style={{
                        borderColor: formData.email ? (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(formData.email.trim()) ? 'rgba(52, 211, 153, 0.5)' : 'rgba(239, 68, 68, 0.5)') : undefined
                      }}
                      required
                    />
                  </div>

                  {/* Password & Confirm Password Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="form-label" style={{ margin: 0 }}>Create Password</label>
                        {formData.password.length > 0 && (
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            color: strengthInfo.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {isPasswordStrong && <CheckCircle2 size={13} color="#10B981" />}
                            {strengthInfo.label}
                          </span>
                        )}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Min. 8 chars, mixed case & symbols"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          style={{ 
                            paddingRight: '42px',
                            borderColor: formData.password 
                              ? (isPasswordStrong ? 'rgba(16, 185, 129, 0.55)' : strengthInfo.percent >= 60 ? 'rgba(251, 191, 36, 0.55)' : 'rgba(239, 68, 68, 0.55)') 
                              : undefined
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#B392A5', cursor: 'pointer', padding: 0 }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="form-label" style={{ margin: 0 }}>Confirm Password</label>
                        {formData.confirmPassword && (
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            color: passwordsMatch ? '#34D399' : '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {passwordsMatch ? <><CheckCircle2 size={13} color="#34D399" /> Matches</> : <><AlertCircle size={13} color="#EF4444" /> Must match</>}
                          </span>
                        )}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          style={{
                            borderColor: formData.confirmPassword ? (passwordsMatch ? 'rgba(52, 211, 153, 0.55)' : 'rgba(239, 68, 68, 0.55)') : undefined,
                            paddingRight: '42px'
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#B392A5', cursor: 'pointer', padding: 0 }}
                          title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Live Password Strength & Criteria Validation */}
                  {formData.password.length > 0 && (
                    <div style={{ 
                      marginTop: '4px',
                      marginBottom: '16px',
                      padding: '12px 14px', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255, 255, 255, 0.08)' 
                    }}>
                      {/* Real-time Strength Meter Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#B392A5', fontWeight: 600 }}>Password Strength</span>
                        <span style={{ fontSize: '0.78rem', color: strengthInfo.color, fontWeight: 700 }}>{strengthInfo.label}</span>
                      </div>
                      <div style={{ 
                        height: '4px', 
                        width: '100%', 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        borderRadius: '4px', 
                        overflow: 'hidden',
                        marginBottom: '10px'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${strengthInfo.percent}%`, 
                          background: strengthInfo.color, 
                          borderRadius: '4px',
                          transition: 'width 0.3s ease, background-color 0.3s ease'
                        }} />
                      </div>

                      {/* Live Validation Criteria Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {passwordCriteria.map(item => (
                          <div 
                            key={item.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '20px',
                              background: item.met ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                              color: item.met ? '#34D399' : '#8A7080',
                              border: `1px solid ${item.met ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                              transition: 'all 0.25s ease'
                            }}
                          >
                            {item.met ? (
                              <Check size={11} strokeWidth={3} color="#34D399" />
                            ) : (
                              <Circle size={6} fill="currentColor" color="currentColor" style={{ opacity: 0.4 }} />
                            )}
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Age (Years: 13-120)</label>
                      <input
                        type="number"
                        min="13" max="120"
                        className="form-input"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-input"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        style={{ background: '#1d0718' }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Height (cm: 50-250)</label>
                      <input
                        type="number"
                        min="50" max="250"
                        className="form-input"
                        value={formData.height}
                        onChange={(e) => handleChange('height', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Weight (kg: 20-300)</label>
                      <input
                        type="number"
                        min="20" max="300"
                        className="form-input"
                        value={formData.weight}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                    <span>Continue to Activity & Goals</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--peach-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={22} style={{ color: 'var(--peach-primary)' }} />
                    2. Lifestyle & Fitness Goals
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Daily Activity Level</label>
                    <select
                      className="form-input"
                      value={formData.activityLevel}
                      onChange={(e) => handleChange('activityLevel', e.target.value)}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="Sedentary">Sedentary (Desk job, minimal movement)</option>
                      <option value="Lightly Active">Lightly Active (1-3 light sessions/week)</option>
                      <option value="Moderately Active">Moderately Active (3-5 moderate sessions/week)</option>
                      <option value="Very Active">Very Active (6-7 intense sessions/week)</option>
                      <option value="Extremely Active">Extremely Active (Athletes / physical job)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Fitness Goal</label>
                    <select
                      className="form-input"
                      value={formData.fitnessGoal}
                      onChange={(e) => handleChange('fitnessGoal', e.target.value)}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="Muscle Building">🏋️ Muscle Building & Hypertrophy</option>
                      <option value="Weight Loss">🔥 Fat Loss & Caloric Deficit</option>
                      <option value="Maintenance">⚖️ Weight Maintenance & Recomp</option>
                      <option value="General Health">🧘 General Health & Longevity</option>
                      <option value="Athletic Performance">🏃 Athletic Performance & Speed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dietary Preference</label>
                    <select
                      className="form-input"
                      value={formData.dietaryPreference}
                      onChange={(e) => handleChange('dietaryPreference', e.target.value)}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="Standard Balanced">🥗 Standard Balanced (Omnivore)</option>
                      <option value="High Protein">🥩 High Protein / Low Carb</option>
                      <option value="Vegetarian">🌱 Vegetarian</option>
                      <option value="Vegan">🥑 Vegan (Plant-Based)</option>
                      <option value="Keto">🧀 Ketogenic</option>
                      <option value="Pescatarian">🐟 Pescatarian</option>
                      <option value="Paleo">🍖 Paleo</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                      <span>Continue to Equipment & Health</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--peach-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HeartPulse size={22} style={{ color: 'var(--peach-primary)' }} />
                    3. Equipment & Medical Safeguards
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Available Workout Equipment</label>
                    <select
                      className="form-input"
                      value={formData.workoutEquipment}
                      onChange={(e) => handleChange('workoutEquipment', e.target.value)}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="Full Gym Access">🏋️ Full Commercial Gym Access</option>
                      <option value="Home Gym">🏠 Home Gym (Dumbbells, Bench, Bar)</option>
                      <option value="Dumbbells Only">🧱 Dumbbells Only</option>
                      <option value="Resistance Bands">🎗️ Resistance Bands</option>
                      <option value="Bodyweight Only">🤸 Bodyweight / Calisthenics</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical Conditions or Past Injuries</label>
                    <select
                      className="form-input"
                      value={formData.medicalConditions}
                      onChange={(e) => handleChange('medicalConditions', e.target.value)}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="None">✅ None / Fully Cleared for All Exercises</option>
                      <option value="Lower Back Issues">⚠️ Lower Back Issues (Replaces heavy squats/deadlifts)</option>
                      <option value="Knee Joint Sensitivity">🦵 Knee Joint Sensitivity (Adjusts impact loading)</option>
                      <option value="Shoulder Impingement">💪 Shoulder Impingement (Modifies overhead press)</option>
                      <option value="Hypertension / Cardiac Note">❤️ High Blood Pressure / Cardiac Note</option>
                      <option value="Asthma">🫁 Asthma / Respiratory Considerations</option>
                    </select>
                  </div>

                  <div style={{ background: 'rgba(255, 158, 125, 0.08)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '14px', margin: '20px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--peach-light)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <ShieldAlert size={16} style={{ color: 'var(--peach-primary)' }} />
                      Security & Privacy Guarantee
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-subtle)' }}>
                      Your password is encrypted with BCrypt before storing into Spring Boot MongoDB backend.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={isSubmitting}>
                      <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration'}</span>
                      <Sparkles size={18} />
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--peach-primary)', fontWeight: 600, textDecoration: 'none' }}>Login to Dashboard</Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
