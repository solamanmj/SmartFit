import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Dumbbell, Play, Sparkles, ShieldCheck, ArrowRight, 
  RotateCcw, Info, Activity, Flame, Award, Layers,
  ChevronRight, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchExerciseSplitsApi, 
  fetchExercisesApi, 
  logWorkoutSessionApi 
} from '../services/api';
import { WORKOUT_SPLITS_LIST, INITIAL_EXERCISES_DATABASE } from '../data/exerciseSeedData';

// Subcomponents
import WorkoutSplitSelector from '../components/workout-studio/WorkoutSplitSelector';
import ExercisePlaylist from '../components/workout-studio/ExercisePlaylist';
import VirtualTrainerCanvas from '../components/workout-studio/VirtualTrainerCanvas';
import ExerciseDemoPlayer from '../components/workout-studio/ExerciseDemoPlayer';
import AIFormAnalysisStudio from '../components/workout-studio/AIFormAnalysisStudio';
import PlaybackControls from '../components/workout-studio/PlaybackControls';
import PhaseTracker from '../components/workout-studio/PhaseTracker';
import RepetitionSetCounter from '../components/workout-studio/RepetitionSetCounter';
import RestTimerOverlay from '../components/workout-studio/RestTimerOverlay';
import ExerciseInfoTabs from '../components/workout-studio/ExerciseInfoTabs';
import MuscleMapVisualizer from '../components/workout-studio/MuscleMapVisualizer';
import AIFormAnalysisStub from '../components/workout-studio/AIFormAnalysisStub';
import WorkoutCompleteModal from '../components/workout-studio/WorkoutCompleteModal';


export default function VirtualWorkoutStudio() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userEmail = (user?.email || 'default_athlete').trim().toLowerCase();

  // 1. Splits & Exercises State
  const [splits, setSplits] = useState(WORKOUT_SPLITS_LIST);
  const [activeSplitId, setActiveSplitId] = useState('push');
  const [exercises, setExercises] = useState([]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 2. Playback & Simulation State
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraAngle, setCameraAngle] = useState('front');
  const [tempoSpeed, setTempoSpeed] = useState(1.0);
  const [muscleHeatmapActive, setMuscleHeatmapActive] = useState(true);
  const [formMode, setFormMode] = useState('correct'); // 'correct' | 'mistake'
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentPhaseName, setCurrentPhaseName] = useState('1. Starting Setup');

  // 3. Audio Voice Coach State (Web Speech API)
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  const speechUtteranceRef = useRef(null);

  // 4. Studio Mode Switch: 'demo' (Virtual 3D Coach) | 'camera' (Live AI Pose Vision Analysis)
  const [studioMode, setStudioMode] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('mode') === 'camera' ? 'camera' : 'demo';
  });

  // 5. Live Workout Session Tracking State
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [completedSetsMap, setCompletedSetsMap] = useState({}); // { 'Barbell Bench Press': [1, 2] }
  const [completedExercisesMap, setCompletedExercisesMap] = useState({});
  const [isWorkoutCompleteModalOpen, setIsWorkoutCompleteModalOpen] = useState(false);

  // 6. Rest Timer State
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState(60);

  const handleCompleteLiveExercise = async (sessionData) => {
    try {
      await logWorkoutSessionApi({
        userEmail,
        workoutTitle: `${activeExercise?.name || 'Exercise'} Live Session`,
        durationMinutes: sessionData?.durationMinutes || 10,
        caloriesBurned: sessionData?.caloriesBurned || 95,
        completedExercises: [activeExercise?.name || 'Barbell Squat'],
        formScoreOverall: sessionData?.formScoreOverall || 90
      });
    } catch (e) {
      console.warn('Live log session note:', e);
    }
    setIsWorkoutCompleteModalOpen(true);
    setStudioMode('demo');
  };

  // Load Splits on Mount
  useEffect(() => {
    fetchExerciseSplitsApi().then(data => {
      if (data && data.length > 0) setSplits(data);
    }).catch(() => {});
  }, []);

  // Sync Split & Initial Exercise from query params or active state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const splitParam = params.get('split');
    const exerciseParam = params.get('exercise');

    const targetSplit = splitParam || activeSplitId || 'all';
    setActiveSplitId(targetSplit);

    setLoading(true);
    fetchExercisesApi({ splitId: targetSplit }).then(res => {
      const exList = (res && res.length > 0) 
        ? res 
        : (targetSplit === 'all' 
            ? INITIAL_EXERCISES_DATABASE 
            : INITIAL_EXERCISES_DATABASE.filter(e => e.splitId.toLowerCase() === targetSplit.toLowerCase()));

      setExercises(exList);

      // Select matching exercise or default to first
      if (exerciseParam) {
        const found = exList.find(e => e.name.toLowerCase() === exerciseParam.toLowerCase() || e.id === exerciseParam);
        if (found) {
          setActiveExercise(found);
          setCameraAngle(found.recommendedAngle || 'front');
        } else if (exList.length > 0) {
          setActiveExercise(exList[0]);
          setCameraAngle(exList[0].recommendedAngle || 'front');
        }
      } else if (exList.length > 0) {
        setActiveExercise(exList[0]);
        setCameraAngle(exList[0].recommendedAngle || 'front');
      }
      setLoading(false);
    }).catch(err => {
      console.warn('Exercise fetch fallback:', err);
      const fallback = targetSplit === 'all' 
        ? INITIAL_EXERCISES_DATABASE 
        : INITIAL_EXERCISES_DATABASE.filter(e => e.splitId.toLowerCase() === targetSplit.toLowerCase());
      setExercises(fallback);
      if (fallback.length > 0) {
        setActiveExercise(fallback[0]);
        setCameraAngle(fallback[0].recommendedAngle || 'front');
      }
      setLoading(false);
    });
  }, [location.search, activeSplitId]);

  // Load User Saved Completion State
  useEffect(() => {
    try {
      const savedSets = localStorage.getItem(`smartfit_${userEmail}_studio_sets_${activeSplitId}`);
      if (savedSets) setCompletedSetsMap(JSON.parse(savedSets));

      const savedEx = localStorage.getItem(`smartfit_${userEmail}_studio_completed_ex_${activeSplitId}`);
      if (savedEx) setCompletedExercisesMap(JSON.parse(savedEx));
    } catch (e) {}
  }, [userEmail, activeSplitId]);

  // Rest Timer Countdown Interval
  useEffect(() => {
    let interval = null;
    if (restTimerActive && restSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (restSecondsRemaining === 0 && restTimerActive) {
      setRestTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [restTimerActive, restSecondsRemaining]);

  // Voice Narration Synthesis Trigger
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
      const maleVoice = voices.find(v => 
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('alex')) 
        && v.lang.startsWith('en')
      );
      if (maleVoice) utterance.voice = maleVoice;

      utterance.onstart = () => setVoiceSpeaking(true);
      utterance.onend = () => setVoiceSpeaking(false);
      utterance.onerror = () => setVoiceSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis note:', e);
    }
  };

  // Trigger voice when exercise changes
  useEffect(() => {
    if (activeExercise && voiceEnabled) {
      triggerVoiceNarration(activeExercise.coachSpeech || activeExercise.instructions?.[0]);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [activeExercise?.name, voiceEnabled]);

  // Handle Switching Exercise
  const handleSelectExercise = (ex) => {
    setActiveExercise(ex);
    setFormMode('correct');
    setCurrentPhaseIndex(0);
    setCurrentSet(1);
    setCurrentRep(0);
    setCameraAngle(ex.recommendedAngle || 'front');
  };

  // Handle Set Completion & Rest Trigger
  const handleCompleteSet = (setNumber) => {
    if (!activeExercise) return;

    const exKey = activeExercise.name;
    const currentCompleted = completedSetsMap[exKey] || [];
    const nextCompleted = Array.from(new Set([...currentCompleted, setNumber]));

    const nextSetsMap = { ...completedSetsMap, [exKey]: nextCompleted };
    setCompletedSetsMap(nextSetsMap);

    const totalSets = activeExercise.sets || 4;
    if (nextCompleted.length >= totalSets) {
      const nextExMap = { ...completedExercisesMap, [exKey]: true };
      setCompletedExercisesMap(nextExMap);
      try {
        localStorage.setItem(`smartfit_${userEmail}_studio_completed_ex_${activeSplitId}`, JSON.stringify(nextExMap));
      } catch (e) {}

      // Check if all exercises in split completed
      if (Object.keys(nextExMap).length >= exercises.length && exercises.length > 0) {
        setIsWorkoutCompleteModalOpen(true);
        // Log to Backend MongoDB
        logWorkoutSessionApi({
          email: userEmail,
          splitName: activeSplit?.name || activeSplitId,
          exercisesCompleted: exercises.length,
          totalSets: exercises.length * 4,
          caloriesBurned: 450,
          timestamp: new Date().toISOString()
        });
      }
    }

    try {
      localStorage.setItem(`smartfit_${userEmail}_studio_sets_${activeSplitId}`, JSON.stringify(nextSetsMap));
    } catch (e) {}

    // Advance set counter or trigger rest
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
    }
    const restTarget = activeExercise.restSeconds || 60;
    setRestTotalSeconds(restTarget);
    setRestSecondsRemaining(restTarget);
    setRestTimerActive(true);
  };

  // Rep Completion from Canvas Cycle
  const handleRepComplete = () => {
    setCurrentRep(prev => prev + 1);
  };

  // Previous & Next Exercise Navigation
  const currentIndex = exercises.findIndex(e => e.name === activeExercise?.name);
  const isFirstExercise = currentIndex <= 0;
  const isLastExercise = currentIndex >= exercises.length - 1;

  const handlePrevExercise = () => {
    if (currentIndex > 0) {
      handleSelectExercise(exercises[currentIndex - 1]);
    }
  };

  const handleNextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      handleSelectExercise(exercises[currentIndex + 1]);
    }
  };

  const activeSplit = splits.find(s => s.id === activeSplitId) || splits[0];
  const activeExCompletedSets = activeExercise ? (completedSetsMap[activeExercise.name] || []) : [];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#12030F',
      color: '#FFFFFF'
    }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '105px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* ========================================================================= */}
          {/* 1. EDUCATIONAL DISCLAIMER & TOP STUDIO HERO BANNER */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.45) 0%, rgba(29, 7, 24, 0.9) 100%)',
            border: '1px solid rgba(255, 158, 125, 0.22)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '24px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  color: 'var(--peach-primary)',
                  backgroundColor: 'rgba(255, 158, 125, 0.15)',
                  border: '1px solid rgba(255, 158, 125, 0.35)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Sparkles size={12} /> SMARTFIT VIRTUAL STUDIO
                </span>
                <span style={{ fontSize: '0.75rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.12)', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>
                  3D Kinetic Multi-Angle Engine
                </span>
              </div>

              <h1 style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                margin: '0 0 6px 0',
                background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                AI Virtual Workout Demonstration & Masterclass
              </h1>

              <p style={{ margin: 0, fontSize: '0.85rem', color: '#E2C9D6', maxWidth: '720px', lineHeight: '1.4' }}>
                Interactive 3D biomechanical demonstrations showing correct movement patterns, tempo cadence, diaphragmatic breathing, and common form mistakes across 14 periodized training splits.
              </p>
            </div>

            {/* Educational Disclaimer Badge */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 158, 125, 0.2)',
              padding: '12px 16px',
              borderRadius: '14px',
              maxWidth: '300px',
              fontSize: '0.74rem',
              color: '#94A3B8',
              lineHeight: '1.35',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <ShieldCheck size={16} color="var(--peach-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFD9CB' }}>Form Education Notice:</strong> Designed for technique & posture mastery. Does not replace certified medical consultation.
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. SPLIT SELECTOR (14 SPLITS) */}
          {/* ========================================================================= */}
          <WorkoutSplitSelector
            splits={splits}
            activeSplitId={activeSplitId}
            onSelectSplit={id => {
              setActiveSplitId(id);
              navigate(`/workout-studio?split=${id}`);
            }}
          />

          {/* ========================================================================= */}
          {/* 3. MAIN WORKOUT STUDIO ARENA (SIDEBAR + 3D VIRTUAL TRAINER) */}
          {/* ========================================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '24px',
            marginBottom: '28px',
            alignItems: 'start'
          }}>
            
            {/* LEFT COLUMN: Exercise Playlist */}
            <ExercisePlaylist
              exercises={exercises}
              activeExerciseId={activeExercise?.id || activeExercise?.name}
              completedExercises={completedExercisesMap}
              onSelectExercise={handleSelectExercise}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              splitName={activeSplit?.name || 'Workout Split'}
            />

            {/* RIGHT COLUMN: 3D Virtual Trainer Demonstration Stage */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Exercise Header & Badge Banner */}
              {activeExercise && (
                <div style={{
                  background: 'rgba(29, 7, 24, 0.75)',
                  border: '1px solid rgba(255, 158, 125, 0.2)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255, 112, 67, 0.2)', color: '#FF7043', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        {activeExercise.category || activeSplit?.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        Target: {activeExercise.primaryMuscles?.[0] || 'Prime Mover'}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
                      {activeExercise.name}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase' }}>Recommended Angle</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FACC15' }}>
                        ⭐ {activeExercise.recommendedAngle?.toUpperCase() || 'SIDE PROFILE'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Studio Mode Switcher: 3D Demo vs Live Camera Pose Analysis */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStudioMode('demo')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: studioMode === 'demo' ? 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)' : 'rgba(255,255,255,0.06)',
                    border: studioMode === 'demo' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: studioMode === 'demo' ? '#12030F' : '#CBD5E1',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: studioMode === 'demo' ? '0 4px 15px rgba(255, 112, 67, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}>
                  <Play size={16} />
                  <span>🎥 Virtual Human 3D Demonstration</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudioMode('camera')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: studioMode === 'camera' ? 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)' : 'rgba(255,255,255,0.06)',
                    border: studioMode === 'camera' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: studioMode === 'camera' ? '#FFF' : '#CBD5E1',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: studioMode === 'camera' ? '0 4px 15px rgba(2, 132, 199, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}>
                  <Activity size={16} />
                  <span>📸 Start AI Camera Form Analysis</span>
                </button>
              </div>

              {studioMode === 'camera' ? (
                <AIFormAnalysisStudio
                  exercise={activeExercise}
                  targetSets={activeExercise?.sets || 4}
                  targetReps={parseInt((activeExercise?.reps || '10').split('-')[0], 10) || 10}
                  onCompleteWorkout={handleCompleteLiveExercise}
                  onBackToDemo={() => setStudioMode('demo')}
                />
              ) : (
                <>
                  {/* 3D Kinetic Simulation Canvas Container */}
                  <div style={{
                    position: 'relative',
                    background: '#0c020b',
                    border: formMode === 'mistake' ? '2px solid #EF4444' : '1px solid rgba(255, 158, 125, 0.35)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: formMode === 'mistake' 
                      ? '0 10px 40px rgba(239, 68, 68, 0.3)' 
                      : '0 10px 40px rgba(255, 112, 67, 0.2)',
                    minHeight: '460px'
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
                      onRepComplete={handleRepComplete}
                    />
                  </div>

                  {/* Playback Controls Toolbar */}
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

                  {/* Phase Step-by-Step Tracker */}
                  <PhaseTracker
                    phases={activeExercise?.phases}
                    activePhaseIndex={currentPhaseIndex}
                    tempo={activeExercise?.tempo || '3-1-1'}
                    breathing={activeExercise?.breathingInstructions}
                  />

                  {/* Live Repetition and Set Counter Bar */}
                  <RepetitionSetCounter
                    exercise={activeExercise}
                    currentSet={currentSet}
                    totalSets={activeExercise?.sets || 4}
                    currentRep={currentRep}
                    targetReps={parseInt((activeExercise?.reps || '10').split('-')[0], 10) || 10}
                    onCompleteSet={handleCompleteSet}
                    onPrevExercise={handlePrevExercise}
                    onNextExercise={handleNextExercise}
                    isFirstExercise={isFirstExercise}
                    isLastExercise={isLastExercise}
                    setsCompleted={activeExCompletedSets}
                  />
                </>
              )}


            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4. EXERCISE INFORMATION TABS & ANATOMICAL MUSCLE SPECTRUM */}
          {/* ========================================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            marginBottom: '28px',
            alignItems: 'start'
          }}>
            
            {/* Left: Tabbed Information Panel */}
            <ExerciseInfoTabs exercise={activeExercise} />

            {/* Right: Anatomical Muscle Recruitment Map & AI Camera Stub */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MuscleMapVisualizer exercise={activeExercise} />
              <AIFormAnalysisStub />
            </div>

          </div>

        </div>
      </main>

      {/* Floating Rest Recovery Overlay */}
      <RestTimerOverlay
        isOpen={restTimerActive}
        secondsRemaining={restSecondsRemaining}
        totalSeconds={restTotalSeconds}
        onSkip={() => setRestTimerActive(false)}
        onAddSeconds={secs => setRestSecondsRemaining(prev => prev + secs)}
      />

      {/* Workout Complete Celebration Modal */}
      <WorkoutCompleteModal
        isOpen={isWorkoutCompleteModalOpen}
        onClose={() => setIsWorkoutCompleteModalOpen(false)}
        splitName={activeSplit?.name || 'Push Split'}
        exercisesCount={exercises.length}
        totalSets={exercises.length * 4}
        caloriesBurned={450}
      />

      <Footer />
    </div>
  );
}
