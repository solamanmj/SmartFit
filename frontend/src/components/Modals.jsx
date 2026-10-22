import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export function GetStartedModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: 'Muscle Growth & Strength',
    experience: 'Intermediate',
    daysPerWeek: '4'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 158, 125, 0.2)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <CheckCircle size={36} />
            </div>
            <h3 className="gradient-peach-rose" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
              Welcome to SmartFit!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
              Your profile has been created. Generating your personalized AI fitness plan now...
            </p>
          </div>
        ) : (
          <div>
            <div className="badge" style={{ marginBottom: '16px' }}>
              <Sparkles size={14} /> Quick Onboarding
            </div>
            <h3 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Build Your AI Fitness Profile
            </h3>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Step {step} of 2 • Tailoring algorithms to your physiological targets.
            </p>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="alex@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Fitness Goal</label>
                    <select
                      className="form-input"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="Muscle Growth & Strength">🏋️ Muscle Growth & Hypertrophy</option>
                      <option value="Fat Loss & Toning">🔥 Fat Loss & Toning</option>
                      <option value="Endurance & Performance">🏃 Endurance & Athletic Conditioning</option>
                      <option value="General Health & Longevity">🧘 Health, Mobility & Longevity</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={() => {
                      if (formData.name && formData.email) setStep(2);
                    }}
                  >
                    <span>Next: AI Plan Parameters</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label">Current Fitness Experience</label>
                    <select
                      className="form-input"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="Beginner">Beginner (0 - 6 months)</option>
                      <option value="Intermediate">Intermediate (1 - 3 years)</option>
                      <option value="Advanced">Advanced (3+ years)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Workout Availability (Days/Week)</label>
                    <select
                      className="form-input"
                      value={formData.daysPerWeek}
                      onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
                      style={{ background: '#1d0718' }}
                    >
                      <option value="3">3 Days / Week</option>
                      <option value="4">4 Days / Week (Recommended)</option>
                      <option value="5">5 Days / Week</option>
                      <option value="6">6 Days / Week</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 2 }}
                    >
                      <span>Generate My AI Plan</span>
                      <Sparkles size={18} />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setTimeout(() => {
      setLoggedIn(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {loggedIn ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 158, 125, 0.2)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <CheckCircle size={36} />
            </div>
            <h3 className="gradient-peach-rose" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
              Logged In Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Redirecting to your SmartFit Dashboard...
            </p>
          </div>
        ) : (
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Welcome Back to SmartFit
            </h3>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Access your personalized workouts, nutrition metrics, and XAI insights.
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                <span>Login to Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export function FeatureModal({ feature, onClose }) {
  if (!feature) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="badge" style={{ marginBottom: '16px' }}>
          {feature.tag} Feature
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div className="why-icon-wrap" style={{ width: '60px', height: '60px' }}>
            <span style={{ fontSize: '2rem' }}>{feature.icon}</span>
          </div>
          <div>
            <h3 className="gradient-peach-rose" style={{ fontSize: '1.8rem' }}>
              {feature.title}
            </h3>
            <span style={{ color: 'var(--peach-soft)', fontWeight: 600, fontSize: '0.95rem' }}>
              {feature.subtitle}
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
          {feature.description}
        </p>

        <div style={{ background: 'rgba(255, 158, 125, 0.08)', border: '1px solid var(--glass-border)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
          <h4 style={{ color: 'var(--peach-light)', fontSize: '1rem', marginBottom: '8px' }}>
            💡 SmartFit Deep Integration
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', lineHeight: '1.6' }}>
            Every parameter updated in {feature.title} instantly syncs with your weekly meal plan, macro targets, and fatigue score algorithms.
          </p>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
