import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Eye, 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, 
  Activity, Flame, Award, ChevronRight, Layers, Target, Compass
} from 'lucide-react';
import VirtualTrainerCanvas from './VirtualTrainerCanvas';
import PlaybackControls from './PlaybackControls';
import PhaseTracker from './PhaseTracker';

export default function ExerciseDemoPlayer({
  exercise,
  onStartExercise,
  autoPlay = true
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [cameraAngle, setCameraAngle] = useState(exercise?.recommendedAngle || 'side');
  const [tempoSpeed, setTempoSpeed] = useState(1.0);
  const [muscleHeatmapActive, setMuscleHeatmapActive] = useState(true);
  const [formMode, setFormMode] = useState('correct'); // 'correct' | 'mistake'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentPhaseName, setCurrentPhaseName] = useState('1. Starting Setup');
  
  // Voice Coach (Web Speech API)
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const speechUtteranceRef = useRef(null);

  // Sync camera angle when exercise changes
  useEffect(() => {
    if (exercise?.recommendedAngle) {
      setCameraAngle(exercise.recommendedAngle);
    }
  }, [exercise]);

  // Voice narration triggers
  const speakCoachCue = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setVoiceSpeaking(true);
      utterance.onend = () => setVoiceSpeaking(false);
      utterance.onerror = () => setVoiceSpeaking(false);
      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis note:', e);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setCurrentPhaseIndex(0);
    if (exercise?.coachSpeech) {
      speakCoachCue(exercise.coachSpeech);
    }
  };

  if (!exercise) {
    return (
      <div style={{
        background: 'rgba(18, 24, 38, 0.7)',
        border: '1px dashed rgba(255, 112, 67, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        color: '#94A3B8'
      }}>
        <Activity size={36} color="#FF7043" style={{ marginBottom: '12px' }} />
        <p>Select an exercise from your prescribed plan to view virtual demonstration.</p>
      </div>
    );
  }

  const recommendedAngleText = exercise.recommendedAngle 
    ? exercise.recommendedAngle.charAt(0).toUpperCase() + exercise.recommendedAngle.slice(1) + ' view' 
    : 'Side view';

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1px solid rgba(255, 112, 67, 0.25)',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0px'
    }}>
      {/* 1. Header Bar with Exercise Metatags */}
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(180deg, rgba(255,112,67,0.12) 0%, rgba(15,23,42,0) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: '#FF7043',
              color: '#FFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              Virtual Coach 3D Kinematics
            </span>
            <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700 }}>
              {exercise.category || 'Compound Strength'}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {exercise.name || exercise.exerciseName}
          </h2>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px', fontSize: '0.82rem', color: '#94A3B8' }}>
            <span><strong>Target Muscles:</strong> {Array.isArray(exercise.primaryMuscles) ? exercise.primaryMuscles.join(', ') : (exercise.targetMuscle || 'Full Body')}</span>
            <span>•</span>
            <span><strong>Equipment:</strong> {Array.isArray(exercise.equipment) ? exercise.equipment.join(', ') : (exercise.equipmentNeeded || exercise.equipment || 'Gym Equipment')}</span>
            <span>•</span>
            <span><strong>Difficulty:</strong> {exercise.difficulty || 'Intermediate'}</span>
          </div>
        </div>

        {onStartExercise && (
          <button
            onClick={() => onStartExercise(exercise)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.15s ease'
            }}>
            <Activity size={18} />
            <span>Start Live Camera Form Analysis</span>
          </button>
        )}
      </div>

      {/* 2. Virtual Human Demonstration Screen */}
      <div style={{ position: 'relative', width: '100%', minHeight: '440px', background: '#090D16' }}>
        <VirtualTrainerCanvas
          activeExercise={exercise}
          isPlaying={isPlaying}
          tempoSpeed={tempoSpeed}
          cameraAngle={cameraAngle}
          muscleHeatmapActive={muscleHeatmapActive}
          formMode={formMode}
          onPhaseChange={(idx, name) => {
            setCurrentPhaseIndex(idx);
            setCurrentPhaseName(name);
          }}
        />

        {/* Floating Recommended Angle Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '10px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#38BDF8',
          fontSize: '0.78rem',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          zIndex: 10
        }}>
          <Compass size={14} />
          <span>Recommended Angle: <strong>{recommendedAngleText}</strong></span>
        </div>
      </div>

      {/* 3. Playback Controls & Speed Multipliers */}
      <div style={{ padding: '16px 24px', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          tempoSpeed={tempoSpeed}
          onChangeSpeed={setTempoSpeed}
          cameraAngle={cameraAngle}
          onChangeAngle={setCameraAngle}
          recommendedAngle={exercise.recommendedAngle || 'side'}
          formMode={formMode}
          onToggleFormMode={() => setFormMode(prev => prev === 'correct' ? 'mistake' : 'correct')}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => setVoiceEnabled(prev => !prev)}
          onReplayVoice={() => exercise.coachSpeech && speakCoachCue(exercise.coachSpeech)}
          voiceSpeaking={voiceSpeaking}
        />

        {/* Phase Tracker Progression */}
        <PhaseTracker
          phases={exercise.phases || [
            { phaseNumber: 1, name: 'Setup & Starting Position', cue: 'Position body with joint alignment and core brace.' },
            { phaseNumber: 2, name: 'Controlled Movement / Eccentric', cue: 'Lower/control load through full natural range of motion.' },
            { phaseNumber: 3, name: 'Concentric Drive & Lockout', cue: 'Drive explosively back to starting posture.' }
          ]}
          currentPhaseIndex={currentPhaseIndex}
          currentPhaseName={currentPhaseName}
          isPlaying={isPlaying}
          formMode={formMode}
        />
      </div>

      {/* 4. Structured Biomechanics & Step-by-Step Instructions */}
      <div style={{
        padding: '24px',
        background: 'rgba(11, 15, 23, 0.95)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* Step-by-Step Execution */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={16} />
            <span>Exercise Execution Guide</span>
          </h4>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#CBD5E1', fontSize: '0.84rem', lineHeight: '1.6' }}>
            {exercise.instructions && Array.isArray(exercise.instructions) && exercise.instructions.length > 0 ? (
              exercise.instructions.map((inst, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{inst}</li>
              ))
            ) : (
              <>
                <li><strong>1. Starting position:</strong> Align feet and shoulders, brace core and establish firm posture.</li>
                <li><strong>2. Movement:</strong> Initiate controlled descent/pull ensuring horizontal barbell alignment.</li>
                <li><strong>3. End position:</strong> Contract target musculature at peak range of motion and return.</li>
                <li><strong>4. Breathing:</strong> Inhale during eccentric phase; exhale forcefully on concentric drive.</li>
              </>
            )}
          </ol>
        </div>

        {/* Common Mistakes & Safety Tips */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '18px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} />
            <span>Common Biomechanical Mistakes to Avoid</span>
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#FCA5A5', fontSize: '0.84rem', lineHeight: '1.6' }}>
            {exercise.commonMistakes && Array.isArray(exercise.commonMistakes) && exercise.commonMistakes.length > 0 ? (
              exercise.commonMistakes.map((m, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>
              ))
            ) : (
              <>
                <li>Hyperextending lumbar spine during overhead or squat lockout.</li>
                <li>Flaring elbows excessively beyond 60 degrees.</li>
                <li>Allowing knees to cave inwards (valgus collapse) under load.</li>
                <li>Bouncing weights at bottom of repetition without control.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
