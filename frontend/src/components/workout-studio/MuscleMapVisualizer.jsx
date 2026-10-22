import React from 'react';
import { Activity, Flame, Shield, Sparkles } from 'lucide-react';

export default function MuscleMapVisualizer({ exercise }) {
  if (!exercise) return null;

  const primaryMuscles = exercise.primaryMuscles || ['Target Muscle Group'];
  const secondaryMuscles = exercise.secondaryMuscles || ['Synergist Fibers'];

  return (
    <div style={{
      background: 'rgba(29, 7, 24, 0.75)',
      border: '1px solid rgba(255, 158, 125, 0.2)',
      borderRadius: '16px',
      padding: '18px 20px',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.35)'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Activity size={16} color="var(--peach-primary)" />
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
          Anatomical Muscle Recruitment Spectrum
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Primary Movers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: '#FF9E7D', fontWeight: 800 }}>Primary Agonists ({primaryMuscles.join(', ')})</span>
            <span style={{ color: '#FF7043', fontWeight: 900 }}>80–100% Tension</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #FF7043, #FF9E7D)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Secondary Movers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>Synergist Stabilizers ({secondaryMuscles.join(', ')})</span>
            <span style={{ color: '#38BDF8', fontWeight: 800 }}>45–65% Tension</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '58%', height: '100%', background: 'linear-gradient(90deg, #0284C7, #38BDF8)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Core & Postural Anchors */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: '#A78BFA', fontWeight: 700 }}>Core & Kinetic Chain Bracing</span>
            <span style={{ color: '#A78BFA', fontWeight: 800 }}>30–40% Tension</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '35%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #A78BFA)', borderRadius: '4px' }} />
          </div>
        </div>

      </div>

    </div>
  );
}
