import React, { useEffect } from 'react';
import { Clock, Plus, Play, X, Zap, HeartPulse } from 'lucide-react';

export default function RestTimerOverlay({
  isOpen,
  secondsRemaining,
  totalSeconds,
  onSkip,
  onAddSeconds,
  onSetTimerDuration
}) {
  if (!isOpen || secondsRemaining <= 0) return null;

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / (totalSeconds || 60)) * 100));

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999,
      background: 'linear-gradient(135deg, rgba(35, 8, 28, 0.95) 0%, rgba(18, 3, 15, 0.98) 100%)',
      border: '2px solid var(--peach-primary)',
      borderRadius: '20px',
      padding: '20px 24px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 112, 67, 0.3)',
      maxWidth: '380px',
      width: '100%',
      backdropFilter: 'blur(12px)',
      animation: 'slideInUp 0.3s ease'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 112, 67, 0.2)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#FFB8A1', fontWeight: 800, textTransform: 'uppercase' }}>Between-Set Recovery</div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>Rest & ATP Replenishment</h4>
          </div>
        </div>

        <button
          type="button"
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px'
          }}>
          <X size={18} />
        </button>
      </div>

      {/* Countdown Display & Progress Ring */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          fontSize: '2.4rem',
          fontWeight: 900,
          color: secondsRemaining <= 10 ? '#EF4444' : '#FFF',
          letterSpacing: '1px'
        }}>
          00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF7043, #34D399)',
            transition: 'width 1s linear'
          }} />
        </div>
      </div>

      {/* Quick Adjust Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => onAddSeconds(15)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}>
            +15s
          </button>
          <button
            type="button"
            onClick={() => onAddSeconds(30)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}>
            +30s
          </button>
        </div>

        <button
          type="button"
          onClick={onSkip}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
            border: 'none',
            color: '#12030F',
            fontSize: '0.82rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
          <span>Ready to Lift</span>
          <Play size={12} fill="#12030F" />
        </button>
      </div>

    </div>
  );
}
