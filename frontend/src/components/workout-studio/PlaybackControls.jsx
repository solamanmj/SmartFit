import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onReset,
  tempoSpeed,
  onChangeSpeed,
  cameraAngle,
  onChangeAngle,
  recommendedAngle = 'front',
  formMode,
  onToggleFormMode,
  voiceEnabled,
  onToggleVoice,
  onReplayVoice,
  voiceSpeaking
}) {
  const SPEED_OPTIONS = [
    { value: 0.5, label: '0.5×' },
    { value: 0.75, label: '0.75×' },
    { value: 1.0, label: '1×' },
    { value: 1.25, label: '1.25×' },
    { value: 1.5, label: '1.5×' }
  ];

  const ANGLE_OPTIONS = [
    { id: 'side', label: 'Side Profile' },
    { id: 'front', label: 'Front View' },
    { id: 'rear', label: 'Rear View' },
    { id: 'isometric', label: '45° Dynamic' }
  ];

  return (
    <div style={{
      background: 'rgba(24, 6, 20, 0.95)',
      border: '1px solid rgba(255, 158, 125, 0.22)',
      borderRadius: '16px',
      padding: '12px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.45)',
      marginBottom: '16px'
    }}>
      
      {/* Responsive Main Control Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        
        {/* 1. Play / Pause & Replay */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={onTogglePlay}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
              border: 'none',
              color: '#12030F',
              fontWeight: 900,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 12px rgba(255, 112, 67, 0.35)',
              transition: 'transform 0.15s ease'
            }}>
            {isPlaying ? <Pause size={15} /> : <Play size={15} fill="#12030F" />}
            <span>{isPlaying ? 'Pause' : 'Play Demo'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Reset from Starting Setup"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 158, 125, 0.18)',
              color: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}>
            <RotateCcw size={15} />
          </button>
        </div>

        {/* 2. Playback Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Speed
          </span>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.55)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {SPEED_OPTIONS.map(spd => {
              const isSelected = tempoSpeed === spd.value;
              return (
                <button
                  key={spd.value}
                  type="button"
                  onClick={() => onChangeSpeed(spd.value)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isSelected ? '#FF7043' : 'transparent',
                    color: isSelected ? '#12030F' : '#CBD5E1',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 900 : 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                  {spd.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Viewing Angle Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Angle
          </span>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.55)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {ANGLE_OPTIONS.map(ang => {
              const isSelected = cameraAngle === ang.id;
              const isRec = recommendedAngle === ang.id;

              return (
                <button
                  key={ang.id}
                  type="button"
                  onClick={() => onChangeAngle(ang.id)}
                  style={{
                    position: 'relative',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                    color: isSelected ? '#38BDF8' : '#CBD5E1',
                    fontWeight: isSelected ? 900 : 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}>
                  <span>{ang.label}</span>
                  {isRec && (
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FACC15' }} title="Optimal View" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Form Comparison Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.55)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            onClick={() => onToggleFormMode('correct')}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              background: formMode === 'correct' ? '#34D399' : 'transparent',
              color: formMode === 'correct' ? '#12030F' : '#94A3B8',
              fontWeight: 900,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}>
            <CheckCircle2 size={13} />
            <span>Optimal Technique</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleFormMode('mistake')}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              background: formMode === 'mistake' ? '#EF4444' : 'transparent',
              color: formMode === 'mistake' ? '#FFF' : '#94A3B8',
              fontWeight: 900,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}>
            <AlertTriangle size={13} />
            <span>Common Fault</span>
          </button>
        </div>

        {/* 5. Voice Audio Coach */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={onToggleVoice}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: voiceEnabled ? 'rgba(255, 112, 67, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: voiceEnabled ? '1px solid #FF7043' : '1px solid rgba(255, 255, 255, 0.1)',
              color: voiceEnabled ? '#FF9E7D' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{voiceEnabled ? (voiceSpeaking ? 'Voice Active' : 'AI Voice') : 'Muted'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
