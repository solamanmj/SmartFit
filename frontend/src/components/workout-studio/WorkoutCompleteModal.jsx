import React from 'react';
import { Trophy, Award, Flame, Dumbbell, CheckCircle2, ArrowRight, X, Sparkles, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkoutCompleteModal({
  isOpen,
  onClose,
  splitName = 'Push Split',
  exercisesCount = 5,
  totalSets = 16,
  totalVolumeKg = 3450,
  caloriesBurned = 420
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.88)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'linear-gradient(135deg, #1d0718 0%, #12030F 100%)',
        border: '2px solid #FF7043',
        borderRadius: '24px',
        padding: '36px',
        textAlign: 'center',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 112, 67, 0.35)',
        position: 'relative',
        animation: 'scaleUp 0.3s ease'
      }}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer'
          }}>
          <X size={20} />
        </button>

        {/* Trophy Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
          color: '#12030F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          boxShadow: '0 8px 25px rgba(255, 112, 67, 0.4)'
        }}>
          <Trophy size={36} />
        </div>

        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 900,
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Workout Split Completed!
        </h2>

        <p style={{ color: '#E2C9D6', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
          Outstanding discipline! You have completed all movements in the <strong>{splitName}</strong> masterclass with verified biomechanical form.
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '26px'
        }}>
          
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,158,125,0.2)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Movements</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38BDF8', marginTop: '2px' }}>
              {exercisesCount}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,158,125,0.2)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Sets Logged</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FF7043', marginTop: '2px' }}>
              {totalSets}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,158,125,0.2)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Calories Burned</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>
              {caloriesBurned} <span style={{ fontSize: '0.7rem' }}>kcal</span>
            </div>
          </div>

        </div>

        {/* Verified Coach Sign-Off Badge */}
        <div style={{
          background: 'rgba(52, 211, 153, 0.1)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left'
        }}>
          <CheckCircle2 size={20} color="#34D399" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.8rem', color: '#A7F3D0' }}>
            <strong>Session Logged to MongoDB & Streak Recorded:</strong> +250 XP earned toward your athlete progression rank.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}>
            Review Split
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/dashboard');
            }}
            className="btn-primary"
            style={{
              padding: '12px 26px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 900
            }}>
            <span>Back to Dashboard</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
