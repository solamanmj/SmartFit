import React from 'react';
import { Clock, Activity, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function PhaseTracker({ 
  phases = [], 
  activePhaseIndex = 0,
  tempo = '3-1-1',
  breathing = ''
}) {
  const defaultPhases = [
    { phaseNumber: 1, name: 'Setup', cue: 'Position joints and establish stable base' },
    { phaseNumber: 2, name: 'Brace', cue: 'Diaphragmatic inhale & 360° abdominal tension' },
    { phaseNumber: 3, name: 'Descent', cue: '3-second smooth eccentric negative' },
    { phaseNumber: 4, name: 'Stretch', cue: '1-second isometric pause at apex range' },
    { phaseNumber: 5, name: 'Concentric', cue: 'Explosive power drive through prime movers' },
    { phaseNumber: 6, name: 'Lockout', cue: 'Peak muscular squeeze at top contraction' },
    { phaseNumber: 7, name: 'Reset', cue: 'Stabilize posture and prepare next rep' }
  ];

  const currentPhases = (phases && phases.length > 0) ? phases : defaultPhases;

  return (
    <div style={{
      background: 'rgba(29, 7, 24, 0.75)',
      border: '1px solid rgba(255, 158, 125, 0.2)',
      borderRadius: '16px',
      padding: '16px 20px',
      marginBottom: '18px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)'
    }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="var(--peach-primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>
            Biomechanical Movement Phases & Cadence
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255, 112, 67, 0.15)', color: '#FF9E7D', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
            TEMPO: {tempo}
          </span>
        </div>
      </div>

      {/* Phased Step Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${currentPhases.length}, 1fr)`,
        gap: '6px',
        marginBottom: '12px'
      }}>
        {currentPhases.map((phase, idx) => {
          const isActive = idx === activePhaseIndex;
          const isPassed = idx < activePhaseIndex;

          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                padding: '8px 6px',
                borderRadius: '8px',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(255, 112, 67, 0.35) 0%, rgba(232, 128, 157, 0.25) 100%)' 
                  : isPassed 
                    ? 'rgba(52, 211, 153, 0.12)' 
                    : 'rgba(0, 0, 0, 0.3)',
                border: isActive 
                  ? '1.5px solid var(--peach-primary)' 
                  : isPassed 
                    ? '1px solid rgba(52, 211, 153, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: isActive ? '#FFF' : isPassed ? '#34D399' : '#94A3B8'
              }}>
                P{idx + 1}
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isActive ? '#FFD9CB' : isPassed ? '#CBD5E1' : '#64748B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {phase.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phase Cue Callout */}
      {currentPhases[activePhaseIndex] && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '8px 14px',
          borderRadius: '10px',
          borderLeft: '3px solid var(--peach-primary)',
          fontSize: '0.8rem',
          color: '#E2C9D6',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <strong style={{ color: '#FF9E7D', whiteSpace: 'nowrap' }}>Active Directive:</strong>
          <span>{currentPhases[activePhaseIndex].cue}</span>
        </div>
      )}

    </div>
  );
}
