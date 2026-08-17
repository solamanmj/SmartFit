import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, ArrowRight, ArrowLeft, ShieldAlert, Activity, HeartPulse, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUserApi } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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

  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{}|;:',.<>/]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const isPasswordStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

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

      if (formData.fullName.trim().length < 2) {
        setValidationError('Full Name must be at least 2 characters long.');
        return;
      }

      if (!isPasswordStrong) {
        setValidationError('Password does not meet security requirements. Check requirements below.');
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
      try {
        const payload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          age: parseInt(formData.age, 10),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activityLevel: formData.activityLevel,
          fitnessGoal: formData.fitnessGoal,
          dietaryPreference: formData.dietaryPreference,
          workoutEquipment: formData.workoutEquipment,
          medicalConditions: formData.medicalConditions
        };

        const res = await registerUserApi(payload);
        if (res && res.token) {
          register(payload, res.token);
          navigate('/profile');
        } else {
          setBackendError(res?.message || 'Registration failed. Please try again.');
          setIsSubmitting(false);
        }
      } catch (err) {
        console.warn('Registration API note:', err.message);
        register(formData);
        navigate('/profile');
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
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#fca5a5' }}>
                <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Backend Error: {backendError}</span>
              </div>
            )}

            <form onSubmit={handleNextStep}>

              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--peach-light)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={22} style={{ color: 'var(--peach-primary)' }} />
                    1. Account Credentials & Security
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Alex Morgan"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Login Username)</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Create Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Strong Password"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
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

                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Re-enter Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 158, 125, 0.06)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '16px', margin: '12px 0 20px 0' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--peach-light)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={16} /> Password Security Checklist:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                      <div style={{ color: hasMinLength ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasMinLength ? <CheckCircle2 size={14} /> : '○'} At least 8 characters
                      </div>
                      <div style={{ color: hasUpper ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasUpper ? <CheckCircle2 size={14} /> : '○'} 1 Uppercase letter (A-Z)
                      </div>
                      <div style={{ color: hasLower ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasLower ? <CheckCircle2 size={14} /> : '○'} 1 Lowercase letter (a-z)
                      </div>
                      <div style={{ color: hasNumber ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasNumber ? <CheckCircle2 size={14} /> : '○'} 1 Numeric digit (0-9)
                      </div>
                      <div style={{ color: hasSpecial ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasSpecial ? <CheckCircle2 size={14} /> : '○'} 1 Special character (@$!%*?)
                      </div>
                      <div style={{ color: passwordsMatch ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {passwordsMatch ? <CheckCircle2 size={14} /> : '○'} Passwords match
                      </div>
                    </div>
                  </div>

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
