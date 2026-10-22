import React from 'react';
import { 
  Zap, Flame, Activity, Dumbbell, Layers, Target, 
  Award, ShieldCheck, Sparkles, HeartPulse 
} from 'lucide-react';

const ICON_MAP = {
  Zap: Zap,
  Flame: Flame,
  Activity: Activity,
  Dumbbell: Dumbbell,
  Layers: Layers,
  Target: Target,
  Award: Award,
  ShieldCheck: ShieldCheck,
  Sparkles: Sparkles,
  HeartPulse: HeartPulse
};

export default function WorkoutSplitSelector({ splits = [], activeSplitId, onSelectSplit }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--peach-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1. Select Workout Split Category
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
          {splits.length} Certified Periodization Splits Available
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'thin'
      }}>
        {splits.map(split => {
          const isSelected = activeSplitId === split.id;
          const IconComp = ICON_MAP[split.icon] || Dumbbell;

          return (
            <button
              key={split.id}
              onClick={() => onSelectSplit(split.id)}
              style={{
                flexShrink: 0,
                padding: '12px 18px',
                borderRadius: '14px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(255, 112, 67, 0.28) 0%, rgba(232, 128, 157, 0.22) 100%)' 
                  : 'rgba(29, 7, 24, 0.65)',
                border: isSelected 
                  ? '2px solid var(--peach-primary)' 
                  : '1px solid rgba(255, 158, 125, 0.18)',
                color: isSelected ? '#FFF' : '#CBD5E1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isSelected ? '0 4px 18px rgba(255, 112, 67, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isSelected ? '#FF7043' : 'rgba(255, 158, 125, 0.12)',
                color: isSelected ? '#12030F' : 'var(--peach-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900
              }}>
                <IconComp size={16} />
              </div>

              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#FFF' : '#E2C9D6' }}>
                  {split.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: isSelected ? '#FFD9CB' : '#94A3B8' }}>
                  {split.count} {split.count === 1 ? 'Exercise' : 'Exercises'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
