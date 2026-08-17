import React from 'react';
import { Sparkles, ArrowRight, Zap, CheckCircle2, TrendingUp, Award, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Hero({ onOpenGetStarted, onScrollToFeatures }) {
  const { user } = useAuth();
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Content */}
          <div className="hero-content">
            <div className="badge">
              <Sparkles size={16} />
              <span>AI-Powered Health & Performance Optimization</span>
            </div>

            <h1 className="hero-title">
              Elevate Your Health with <br />
              <span className="gradient-peach-rose">Precision AI Fitness</span>
            </h1>

            <p className="hero-subtitle">
              Intelligent workout splits, real-time nutrition macro sync, and adaptive recovery insights tailored specifically to your body and lifestyle goals.
            </p>

            <div className="hero-cta-group">
              <button 
                className="btn-primary" 
                onClick={onOpenGetStarted}
              >
                <span>{user ? 'Go to Dashboard' : 'Get Started Now'}</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn-secondary" 
                onClick={onScrollToFeatures}
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Trust Bar Metrics */}
            <div className="hero-trust-bar">
              <div className="trust-stat">
                <span className="trust-stat-num gradient-peach-rose">98.4%</span>
                <span className="trust-stat-label">AI Recommendation Precision</span>
              </div>
              <div style={{ width: '1px', height: '36px', background: 'rgba(255, 158, 125, 0.15)' }} />
              <div className="trust-stat">
                <span className="trust-stat-num gradient-peach-rose">50k+</span>
                <span className="trust-stat-label">Active Transformations</span>
              </div>
              <div style={{ width: '1px', height: '36px', background: 'rgba(255, 158, 125, 0.15)' }} />
              <div className="trust-stat">
                <span className="trust-stat-num gradient-peach-rose">4.9★</span>
                <span className="trust-stat-label">User Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic with Floating Badges */}
          <div className="hero-visual">
            {/* Floating Badge 1 - Top Right */}
            <div className="floating-badge badge-top-right">
              <div className="badge-icon">
                <Zap size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--peach-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  AI Recovery Score
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  94% Ready to Push
                </div>
              </div>
            </div>

            {/* Main Glowing Card Visual */}
            <div className="hero-image-container">
              <div className="hero-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--peach-light)', fontWeight: 600, background: 'rgba(255,158,125,0.15)', padding: '4px 12px', borderRadius: '12px' }}>
                  Smart Engine Live
                </span>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                  DAILY BIOMETRIC TARGET
                </div>
                <h3 className="gradient-peach-rose" style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>
                  Hypertrophy Upper Body Split
                </h3>
              </div>

              {/* Progress Widget */}
              <div className="hero-main-stat">
                <div className="stat-header">
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Adaptive Target Goal</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--peach-light)' }}>78% Completed</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  <span>Optimal Volume: 18 Sets</span>
                  <span>Macro Sync: 2,450 kcal</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 158, 125, 0.08)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--peach-light)' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--peach-primary)' }} />
                  <span>AI Recommendation verified</span>
                </div>
                <TrendingUp size={18} style={{ color: 'var(--peach-primary)' }} />
              </div>
            </div>

            {/* Floating Badge 2 - Bottom Left */}
            <div className="floating-badge badge-bottom-left">
              <div className="badge-icon" style={{ background: 'rgba(232, 128, 157, 0.2)', color: 'var(--rose-accent)' }}>
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rose-pastel)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Milestone Streak
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  14 Days Consistent
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
