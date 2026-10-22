import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, 
  AlertTriangle, Maximize2, Minimize2, Repeat, Compass, RotateCw
} from 'lucide-react';

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
  voiceSpeaking,
  onToggleFullscreen,
  isFullscreen = false,
  isLooping = true,
  onToggleLoop
}) {
  const [internalLoop, setInternalLoop] = useState(isLooping);

  const SPEED_OPTIONS = [
    { value: 0.25, label: '0.25×' },
    { value: 0.5, label: '0.5×' },
    { value: 0.75, label: '0.75×' },
    { value: 1.0, label: '1×' },
    { value: 1.25, label: '1.25×' },
    { value: 1.5, label: '1.5×' },
    { value: 2.0, label: '2×' }
  ];

  const ANGLE_OPTIONS = [
    { id: 'front', label: 'Front View' },
    { id: 'isometric', label: '45° Dynamic' },
    { id: 'side', label: 'Side Profile' },
    { id: 'rear', label: 'Rear View' }
  ];

  const handleLoopClick = () => {
    const next = !internalLoop;
    setInternalLoop(next);
    if (onToggleLoop) onToggleLoop(next);
  };

  const handleResetCamera = () => {
    if (onChangeAngle) onChangeAngle(recommendedAngle || 'side');
  };

  return (
    <div style={{
      background: 'rgba(24, 6, 20, 0.95)',
      border: '1px solid rgba(255, 158, 125, 0.22)',
      borderRadius: '16px',
      padding: '14px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
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
            title="Restart from Starting Setup"
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

          {/* Loop Toggle */}
          <button
            type="button"
            onClick={handleLoopClick}
            title={internalLoop ? 'Looping Active (Continuous Demonstration)' : 'Single Play'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: internalLoop ? 'rgba(255, 112, 67, 0.2)' : 'rgba(255, 255, 255, 0.07)',
              border: internalLoop ? '1px solid #FF7043' : '1px solid rgba(255, 158, 125, 0.18)',
              color: internalLoop ? '#FF7043' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}>
            <Repeat size={15} />
          </button>
        </div>

        {/* 2. Playback Speed Selector (0.25x to 2x) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Speed
          </span>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.55)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'nowrap', overflowX: 'auto' }}>
            {SPEED_OPTIONS.map(spd => {
              const isSelected = tempoSpeed === spd.value;
              return (
                <button
                  key={spd.value}
                  type="button"
                  onClick={() => onChangeSpeed(spd.value)}
                  style={{
                    padding: '5px 7px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isSelected ? '#FF7043' : 'transparent',
                    color: isSelected ? '#12030F' : '#CBD5E1',
                    fontSize: '0.72rem',
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
                    padding: '5px 9px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isSelected ? '#38BDF8' : 'transparent',
                    color: isSelected ? '#0F172A' : '#CBD5E1',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 900 : 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                  {ang.label}
                  {isRec && !isSelected && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: '#FF7043'
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset Camera to Default Angle"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#CBD5E1',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
            <Compass size={13} color="#38BDF8" />
            <span>Reset View</span>
          </button>
        </div>

        {/* 4. Full-Screen Mode & Audio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
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
                cursor: 'pointer'
              }}>
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          )}

          {/* Correct Form vs Fault Demo Mode */}
          {onToggleFormMode && (
            <button
              type="button"
              onClick={() => onToggleFormMode(formMode === 'correct' ? 'mistake' : 'correct')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: formMode === 'mistake' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(52, 211, 153, 0.15)',
                border: formMode === 'mistake' ? '1px solid #EF4444' : '1px solid #34D399',
                color: formMode === 'mistake' ? '#FCA5A5' : '#34D399',
                fontWeight: 800,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
              {formMode === 'mistake' ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
              <span>{formMode === 'mistake' ? 'Viewing Faults' : 'Accurate Form'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
