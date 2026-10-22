import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Dumbbell, Award } from 'lucide-react';
import VirtualTrainerCanvas from './workout-studio/VirtualTrainerCanvas';
import PlaybackControls from './workout-studio/PlaybackControls';
import PhaseTracker from './workout-studio/PhaseTracker';
import ExerciseInfoTabs from './workout-studio/ExerciseInfoTabs';
import { getExerciseDetails } from '../data/exerciseSeedData';

export default function VirtualCoachDemoModal({ exercise, allExercises = [], onClose }) {
  const initialIndex = Array.isArray(allExercises) && allExercises.length > 0 && exercise
    ? Math.max(0, allExercises.findIndex(e => (e.name || e.id) === (exercise.name || exercise.id)))
    : 0;
  const [currentExIndex, setCurrentExIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const rawActiveExercise = (Array.isArray(allExercises) && allExercises.length > 0 && allExercises[currentExIndex])
    ? allExercises[currentExIndex]
    : exercise;

  // Fully hydrate exercise metadata
  const activeExercise = getExerciseDetails(rawActiveExercise);

  // Playback & Simulation State
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraAngle, setCameraAngle] = useState(activeExercise?.recommendedAngle || 'side');
  const [tempoSpeed, setTempoSpeed] = useState(1.0);
  const [muscleHeatmapActive, setMuscleHeatmapActive] = useState(true);
  const [formMode, setFormMode] = useState('correct'); // 'correct' | 'mistake'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentPhaseName, setCurrentPhaseName] = useState('Setup & Stance');

  // Audio Voice State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const speechUtteranceRef = useRef(null);

  // Sync camera angle when exercise changes
  useEffect(() => {
    if (activeExercise?.recommendedAngle) {
      setCameraAngle(activeExercise.recommendedAngle);
    }
  }, [activeExercise?.name]);

  // Voice narration speech trigger
  const triggerVoiceNarration = (text) => {
    if (!('speechSynthesis' in window) || !voiceEnabled || !text) return;

    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    setVoiceSpeaking(false);

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      speechUtteranceRef.current = utterance;
      utterance.rate = 1.0;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('alex')) && v.lang.startsWith('en'));
      if (maleVoice) utterance.voice = maleVoice;

      utterance.onstart = () => setVoiceSpeaking(true);
      utterance.onend = () => setVoiceSpeaking(false);
      utterance.onerror = () => setVoiceSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis note:', e);
    }
  };

  useEffect(() => {
    if (voiceEnabled && (activeExercise?.coachSpeech || activeExercise?.instructions?.[0])) {
      triggerVoiceNarration(activeExercise.coachSpeech || activeExercise.instructions?.[0]);
    }
    return () => {
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
    };
  }, [activeExercise?.name, voiceEnabled]);

  const handlePrevExercise = () => {
    if (Array.isArray(allExercises) && allExercises.length > 0 && currentExIndex > 0) {
      setCurrentExIndex(currentExIndex - 1);
      setCurrentPhaseIndex(0);
    }
  };

  const handleNextExercise = () => {
    if (Array.isArray(allExercises) && allExercises.length > 0 && currentExIndex < allExercises.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
      setCurrentPhaseIndex(0);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 2, 8, 0.94)',
      backdropFilter: 'blur(20px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '1080px',
        width: '100%',
        background: 'linear-gradient(145deg, #1c0617 0%, #12030f 100%)',
        border: '1px solid rgba(255, 112, 67, 0.45)',
        borderRadius: '24px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 112, 67, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '94vh'
      }}>

        {/* MODAL HEADER: STUDIO BANNER & CONTROLS */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(35, 8, 28, 0.85)',
          borderBottom: '1px solid rgba(255, 112, 67, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff7043, #e8809d)',
              color: '#12030f', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, boxShadow: '0 4px 15px rgba(255, 112, 67, 0.4)'
            }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'rgba(52, 211, 153, 0.2)', color: '#34D399',
                  fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.4px'
                }}>
                  3D Biomechanical Demonstration
                </span>
                <span style={{ fontSize: '0.74rem', color: '#38BDF8', fontWeight: 700 }}>
                  {activeExercise.category || 'Movement Pattern'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: '2px 0 0 0' }}>
                {activeExercise.name}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Multi-Exercise Nav if Available */}
            {Array.isArray(allExercises) && allExercises.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,158,125,0.2)' }}>
                <button
                  onClick={handlePrevExercise}
                  disabled={currentExIndex <= 0}
                  title="Previous Exercise in Split"
                  style={{
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: currentExIndex <= 0 ? 'transparent' : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: currentExIndex <= 0 ? 'rgba(255,255,255,0.2)' : '#FF9E7D',
                    cursor: currentExIndex <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '0.74rem', color: '#CBD5E1', fontWeight: 800, padding: '0 4px' }}>
                  {currentExIndex + 1}/{allExercises.length}
                </span>
                <button
                  onClick={handleNextExercise}
                  disabled={currentExIndex >= allExercises.length - 1}
                  title="Next Exercise in Split"
                  style={{
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: currentExIndex >= allExercises.length - 1 ? 'transparent' : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: currentExIndex >= allExercises.length - 1 ? 'rgba(255,255,255,0.2)' : '#FF9E7D',
                    cursor: currentExIndex >= allExercises.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODAL BODY: DEMONSTRATION & CONTROLS */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. 3D Virtual Demonstration Canvas with HUD */}
          <div style={{
            position: 'relative',
            background: '#0c020b',
            border: formMode === 'mistake' ? '2px solid #EF4444' : '1px solid rgba(255, 158, 125, 0.35)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: formMode === 'mistake' 
              ? '0 10px 40px rgba(239, 68, 68, 0.3)' 
              : '0 10px 40px rgba(255, 112, 67, 0.2)',
            minHeight: '440px'
          }}>
            <VirtualTrainerCanvas
              exercise={activeExercise}
              isPlaying={isPlaying}
              cameraAngle={cameraAngle}
              tempoSpeed={tempoSpeed}
              muscleHeatmapActive={muscleHeatmapActive}
              formMode={formMode}
              currentPhaseIndex={currentPhaseIndex}
              onPhaseChange={(idx, name) => {
                setCurrentPhaseIndex(idx);
                setCurrentPhaseName(name);
              }}
              onRepComplete={() => {}}
            />
          </div>

          {/* 2. Playback Controls Directly Beneath the Canvas */}
          <PlaybackControls
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={() => {
              setIsPlaying(true);
              setCurrentPhaseIndex(0);
            }}
            tempoSpeed={tempoSpeed}
            onChangeSpeed={setTempoSpeed}
            cameraAngle={cameraAngle}
            onChangeAngle={setCameraAngle}
            recommendedAngle={activeExercise?.recommendedAngle || 'front'}
            formMode={formMode}
            onToggleFormMode={setFormMode}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              if (next && activeExercise) triggerVoiceNarration(activeExercise.coachSpeech || activeExercise.instructions?.[0]);
            }}
            onReplayVoice={() => {
              if (activeExercise) triggerVoiceNarration(activeExercise.coachSpeech || activeExercise.instructions?.[0]);
            }}
            voiceSpeaking={voiceSpeaking}
          />

          {/* 3. Movement Phase Timeline */}
          <PhaseTracker
            phases={activeExercise?.phases}
            activePhaseIndex={currentPhaseIndex}
            tempo={activeExercise?.tempo || '3-1-1'}
            breathing={activeExercise?.breathingInstructions}
          />

          {/* 4. Comprehensive Biomechanical Cues & Exercise Breakdown Tabs */}
          <ExerciseInfoTabs exercise={activeExercise} />

        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(29, 7, 24, 0.95)',
          borderTop: '1px solid rgba(255, 112, 67, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94A3B8' }}>
            <Award size={16} color="#34D399" />
            <span>Biomechanical Kinematics Verified & Certified • Level Horizontal Barbell Trajectory</span>
          </div>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 24px', fontSize: '0.88rem' }}>
            Ready to Lift
          </button>
        </div>

      </div>
    </div>
  );
}
