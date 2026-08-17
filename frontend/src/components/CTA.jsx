import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function CTA({ onOpenGetStarted }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-banner">
          <div className="badge">
            <Zap size={14} /> Ready to Transform?
          </div>

          <h2 className="cta-title">
            Start Your <span className="gradient-peach-rose">SmartFit Journey</span> Today
          </h2>

          <p className="cta-desc">
            Join over 50,000+ fitness enthusiasts optimizing their training, nutrition, and recovery with explainable AI.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button onClick={onOpenGetStarted} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
              <span>Get Started Now</span>
              <ArrowRight size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-subtle)', marginTop: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--peach-primary)' }} /> No Credit Card Required
              </span>
              <span>•</span>
              <span>14-Day Free Trial</span>
              <span>•</span>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
