import React from 'react';
import { X, CheckCircle } from 'lucide-react';

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
