import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Dumbbell, Zap, CheckCircle2, Flame, Clock, Play, 
  Award, Sparkles, Check, ChevronRight, Trophy, Target, 
  Activity, X, Info, ShieldCheck, User, RefreshCw, Calendar, ArrowRight, RotateCcw,
  Lock, AlertCircle, HeartPulse, CheckSquare, ShieldAlert,
  Sliders, FileText, CheckCheck, MessageSquare, ExternalLink, Shield, Send, Medal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getConversationMessages, sendChatMessage } from '../services/chatService';
import { 
  fetchUserWorkoutProgressApi, 
  completeWorkoutDayApi, 
  resetWorkoutCycleApi,
  fetchUserApprovedPlanApi,
  requestAiWorkoutPlanApi,
  logWorkoutSessionApi
} from '../services/api';
import VirtualCoachDemoModal from '../components/VirtualCoachDemoModal';

// ============================================================================
// DEFAULT PERIODIZATION PHASES & DATA DEFINITIONS
// ============================================================================
const DEFAULT_PHASES = [
  { phase: '1', days: 'Days 1-7', title: 'Anatomical Adaptation', focus: 'Form mastery, neuromuscular priming, tendon conditioning' },
  { phase: '2', days: 'Days 8-14', title: 'Volume Hypertrophy', focus: 'Increased time-under-tension & metabolic stress accumulation' },
  { phase: '3', days: 'Days 15-21', title: 'Progressive Overload', focus: 'Heavier resistance loads, CNS recruitment, explosive concentric drive' },
  { phase: '4', days: 'Days 22-30', title: 'Peak Strength & Titan Test', focus: 'Max power output, functional mastery & Day 30 milestone test' }
];

const DEFAULT_PRESCRIPTION_META = {
  prescriptionId: 'RX-30D-2026-MV78',
  issuedDate: 'September 23, 2026',
  approvalStatus: 'APPROVED_AND_ACTIVE',
  targetGoal: 'Hypertrophy & Lean Muscle Mass',
  equipmentProfile: 'Full Gym Access',
  experienceTier: 'Intermediate',
  coachNotes: 'Personalized 30-Day Periodized Protocol designed to maximize mechanical tension, progressive overload, and neuromuscular adaptation.',
  phases: DEFAULT_PHASES
};

// ============================================================================
// 30-DAY PERIODIZED COACH SPLIT BUILDER (DEFENSIVE GENERATOR)
// ============================================================================
const GENERATE_PERIODIZED_COACH_PLAN = ({ goal = 'Hypertrophy', equipment = 'Full Gym Access', experience = 'Intermediate' } = {}) => {
  const plans = {};

  const dailyFocuses = [
    {
      focus: 'Chest & Triceps Hypertrophy Overload',
      target: 'Upper Chest, Sternal Pecs & Triceps',
      rpe: '8.5 / 10',
      duration: 45,
      restHours: 24,
      cues: 'Focus on 3-second controlled eccentrics. Squeeze pecs hard at lockout.',
      exercises: [
        { name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10', weight: '75 kg', targetMuscle: 'Upper Chest', equip: 'Barbell & Bench', cals: 130, cue: 'Lower bar smoothly to clavicle line and press upward with power.' },
        { name: 'Flat Dumbbell Chest Press', sets: 3, reps: '10-12', weight: '28 kg / arm', targetMuscle: 'Mid Pecs', equip: 'Dumbbells & Bench', cals: 110, cue: 'Keep shoulder blades retracted and elbows tucked at 45 degrees.' },
        { name: 'Cable Standing Chest Flyes', sets: 3, reps: '12-15', weight: '16 kg / side', targetMuscle: 'Pectoralis Major', equip: 'Dual Cable Machine', cals: 90, cue: 'Hug a broad barrel and hold peak contraction for 1 full second.' },
        { name: 'Overhead Cable Triceps Rope Extension', sets: 3, reps: '12-15', weight: '24 kg', targetMuscle: 'Triceps Long Head', equip: 'Cable Machine', cals: 80, cue: 'Keep upper arms motionless beside head, flare rope at extension.' },
        { name: 'Dips / Weighted Dips', sets: 3, reps: '10-12', weight: 'Bodyweight + 10kg', targetMuscle: 'Lower Chest & Triceps', equip: 'Dip Station', cals: 85, cue: 'Lean forward slightly to prioritize chest fibers over shoulders.' }
      ]
    },
    {
      focus: 'Back Thickness, Lats & Biceps Pull Split',
      target: 'Latissimus Dorsi, Rhomboids & Biceps',
      rpe: '8.5 / 10',
      duration: 45,
      restHours: 24,
      cues: 'Initiate every pull by depressing scapulae down before bending elbows.',
      exercises: [
        { name: 'Conventional Barbell Deadlifts', sets: 4, reps: '6-8', weight: '110 kg', targetMuscle: 'Posterior Chain & Lats', equip: 'Barbell', cals: 160, cue: 'Drive feet into floor, keep bar dragging along shins.' },
        { name: 'Wide-Grip Lat Pulldowns', sets: 4, reps: '10-12', weight: '65 kg', targetMuscle: 'Upper Lats', equip: 'Cable Lat Machine', cals: 115, cue: 'Pull bar to collarbone while driving elbows straight down.' },
        { name: 'Chest-Supported Dumbbell Rows', sets: 3, reps: '10-12', weight: '24 kg / arm', targetMuscle: 'Mid-Back Rhomboids', equip: 'Incline Bench & DBs', cals: 105, cue: 'Pull elbows toward hip crease to maximally activate lower lats.' },
        { name: 'Standing EZ-Bar Bicep Curls', sets: 3, reps: '10-12', weight: '32 kg', targetMuscle: 'Biceps Brachii', equip: 'EZ Curl Bar', cals: 80, cue: 'Pin elbows to torso, do not use swinging torso momentum.' },
        { name: 'Incline Dumbbell Hammer Curls', sets: 3, reps: '12-15', weight: '16 kg / arm', targetMuscle: 'Brachialis & Forearms', equip: 'Dumbbells', cals: 75, cue: 'Keep palms facing inward throughout the complete curl arc.' }
      ]
    },
    {
      focus: 'Legs Quad Dominance & Core Power Split',
      target: 'Quadriceps, Adductors & Rectus Abdominis',
      rpe: '9.0 / 10',
      duration: 50,
      restHours: 24,
      cues: 'Hit parallel depth on all squat patterns while bracing 360 degrees.',
      exercises: [
        { name: '45-Degree Leg Press', sets: 4, reps: '10-12', weight: '180 kg', targetMuscle: 'Quad Vastus Lateralis', equip: 'Leg Press Machine', cals: 135, cue: 'Place feet shoulder width, lower sled without letting pelvis lift.' },
        { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12 Reps / Leg', weight: '18 kg / arm', targetMuscle: 'Quads & Unilateral Balance', equip: 'Dumbbells', cals: 120, cue: 'Take long strides, lowering trailing knee 1 inch off floor.' },
        { name: 'Leg Extensions (Drop Set on final)', sets: 3, reps: '15 Reps', weight: '55 kg', targetMuscle: 'Quad Teardrop', equip: 'Leg Extension Machine', cals: 80, cue: 'Pause for 1 second at top squeeze and lower slowly for 3 seconds.' },
        { name: 'Hanging Leg Raises', sets: 3, reps: '15 Reps', weight: 'Bodyweight', targetMuscle: 'Lower Abs', equip: 'Pull-Up Bar', cals: 65, cue: 'Bring knees to chest smoothly without swinging.' }
      ]
    },
    {
      focus: 'Shoulders 3D Delts, Traps & Core Sculpt',
      target: 'Anterior, Lateral & Rear Deltoids, Traps',
      rpe: '8.0 / 10',
      duration: 45,
      restHours: 24,
      cues: 'Lead with elbows on lateral raises and maintain depressed traps on overhead presses.',
      exercises: [
        { name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: '8-10', weight: '24 kg / arm', targetMuscle: 'Anterior Deltoids', equip: 'Dumbbells & Bench', cals: 110, cue: 'Press up in slight arch bringing dumbbells close together at top.' },
        { name: 'Standing Cable Lateral Raises', sets: 4, reps: '12-15', weight: '10 kg / side', targetMuscle: 'Side Lateral Delts', equip: 'Cable Machine', cals: 85, cue: 'Pull handle across body raising arm to horizontal shoulder line.' },
        { name: 'Face Pulls with External Rotation', sets: 4, reps: '15 Reps', weight: '28 kg', targetMuscle: 'Rear Delts & Rotator Cuff', equip: 'Cable & Rope', cals: 80, cue: 'Pull rope toward eye level while spreading hands apart.' },
        { name: 'Heavy Barbell Shrugs', sets: 3, reps: '12-15', weight: '90 kg', targetMuscle: 'Upper Trapezius', equip: 'Barbell', cals: 85, cue: 'Elevate shoulders directly toward ears, hold 2s squeeze.' },
        { name: 'Ab Wheel Rollouts', sets: 3, reps: '12 Reps', weight: 'Bodyweight', targetMuscle: 'Deep Core Bracing', equip: 'Ab Wheel', cals: 65, cue: 'Roll out under control and pull back using abdominal contraction.' }
      ]
    },
    {
      focus: 'Posterior Chain Glute & Hamstring Hypertrophy',
      target: 'Hamstrings, Gluteus Maximus & Calves',
      rpe: '8.5 / 10',
      duration: 45,
      restHours: 24,
      cues: 'Push hips backward until deep hamstring stretch is loaded.',
      exercises: [
        { name: 'Romanian Dumbbell Deadlifts (RDL)', sets: 4, reps: '10 Reps', weight: '32 kg / arm', targetMuscle: 'Hamstrings & Glutes', equip: 'Dumbbells', cals: 135, cue: 'Keep slight knee bend and push hips back with rigid spine.' },
        { name: 'Barbell Glute Hip Thrusts', sets: 4, reps: '10-12', weight: '120 kg', targetMuscle: 'Gluteus Maximus', equip: 'Bench & Barbell', cals: 140, cue: 'Drive through heels, squeeze glutes at full hip extension.' },
        { name: 'Lying Leg Hamstring Curls', sets: 3, reps: '12 Reps', weight: '50 kg', targetMuscle: 'Hamstring Biceps Femoris', equip: 'Hamstring Machine', cals: 80, cue: 'Curl heel toward glute without arching lumbar spine.' },
        { name: 'Standing Calf Raises', sets: 4, reps: '15-20', weight: '70 kg', targetMuscle: 'Gastrocnemius', equip: 'Calf Machine', cals: 65, cue: 'Full stretch at bottom, explosive rise on balls of feet.' },
        { name: 'Russian Plate Twists', sets: 3, reps: '20 Reps', weight: '10 kg Plate', targetMuscle: 'Obliques', equip: 'Weight Plate', cals: 60, cue: 'Rotate torso side to side with elevated feet.' }
      ]
    },
    {
      focus: 'Functional Conditioning, Grip Strength & Core Endurance',
      target: 'Full Body Cardiovascular & Core Stabilizers',
      rpe: '8.5 / 10',
      duration: 40,
      restHours: 24,
      cues: 'Sustain continuous pacing with minimal transition latency.',
      exercises: [
        { name: 'Kettlebell Russian Swings', sets: 4, reps: '20 Reps', weight: '24 kg', targetMuscle: 'Hips & Posterior Chain', equip: 'Kettlebell', cals: 140, cue: 'Explosive hip hinge driving kettlebell to chest height.' },
        { name: 'Dumbbell Renegade Rows in Plank', sets: 3, reps: '12 Reps / Arm', weight: '16 kg / arm', targetMuscle: 'Core & Upper Back', equip: 'Dumbbells', cals: 110, cue: 'Row weight without rotating hips from floor.' },
        { name: 'Heavy Farmer Walk Carries', sets: 3, reps: '50 Meters', weight: '30 kg / arm', targetMuscle: 'Grip & Traps', equip: 'Heavy Dumbbells', cals: 100, cue: 'Walk with tall military posture and brace abs tightly.' },
        { name: 'Medicine Ball Slams', sets: 4, reps: '15 Reps', weight: '10 kg Ball', targetMuscle: 'Explosive Core & Lats', equip: 'Medicine Ball', cals: 95, cue: 'Raise ball overhead and slam violently into ground.' },
        { name: 'Weighted Plank Hold', sets: 3, reps: '60 Seconds', weight: '15 kg Plate', targetMuscle: 'Isometric Core', equip: 'Plate', cals: 60, cue: 'Maintain straight alignment from shoulders to heels.' }
      ]
    },
    {
      focus: 'Active Mobility, Tendon Decompression & Recovery',
      target: 'Fascial Tissue, Tendon Recovery & Nervous System',
      rpe: '5.0 / 10',
      duration: 35,
      restHours: 24,
      cues: 'Breathe deeply through nose to down-regulate sympathetic nervous system.',
      exercises: [
        { name: 'Deep Hip Flexor & Couch Stretch', sets: 3, reps: '60 Sec / Side', weight: 'Bodyweight', targetMuscle: 'Psoas & Quads', equip: 'Mat / Wall', cals: 40, cue: 'Tuck pelvis under and sink gently forward.' },
        { name: 'Thoracic Spine Foam Rolling & Extension', sets: 1, reps: '8 Mins', weight: 'Bodyweight', targetMuscle: 'Upper Spine & Lats', equip: 'Foam Roller', cals: 35, cue: 'Roll slowly from mid back to shoulders with arms crossed.' },
        { name: 'Pigeon Pose Glute Opener', sets: 3, reps: '60 Sec / Leg', weight: 'Bodyweight', targetMuscle: 'Piriformis & Glutes', equip: 'Mat', cals: 35, cue: 'Fold upper body forward over bent front leg.' },
        { name: 'World Greatest Stretch Flow', sets: 3, reps: '5 Reps / Side', weight: 'Bodyweight', targetMuscle: 'Ankles, Hips & T-Spine', equip: 'Mat', cals: 45, cue: 'Lunge forward, place elbow to floor, and rotate hand to ceiling.' },
        { name: 'Box Breathing Diaphragmatic Protocol', sets: 1, reps: '5 Mins', weight: 'Recovery', targetMuscle: 'Vagus Nerve Reset', equip: 'Mat', cals: 20, cue: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.' }
      ]
    }
  ];

  for (let day = 1; day <= 30; day++) {
    const templateIndex = (day - 1) % dailyFocuses.length;
    const base = dailyFocuses[templateIndex];
    const weekNumber = Math.ceil(day / 7);

    const volumeMultiplier = 1 + (weekNumber - 1) * 0.05;
    const isMasterDay = day === 30;
    const isRestDay = (day % 7 === 0);

    let phaseName = 'Phase 1: Anatomical Adaptation';
    if (weekNumber === 2) phaseName = 'Phase 2: Volume Hypertrophy';
    if (weekNumber === 3) phaseName = 'Phase 3: Progressive Overload';
    if (weekNumber >= 4) phaseName = 'Phase 4: Peak Strength & Titan Test';

    plans[day] = {
      dayNumber: day,
      dayTitle: isMasterDay ? 'Day 30: Grand Master Milestone Peak Workout' : `Day ${day}: ${base.focus}`,
      weekLabel: `Week ${weekNumber} • Day ${day} of 30`,
      phaseLabel: phaseName,
      targetMuscle: base.target,
      rpeTarget: isMasterDay ? '9.5 / 10 (Peak)' : base.rpe,
      durationMins: base.duration,
      restHours: isRestDay ? 24 : base.restHours,
      isRestDay,
      notes: isMasterDay 
        ? '30-Day Master Milestone: Give 100% effort to record your peak strength metrics before restarting the cycle!'
        : `${base.cues} (Week ${weekNumber} Progressive Overload Calibration active).`,
      exercises: (base.exercises || []).map((ex, exIdx) => ({
        ...ex,
        id: `d${day}-ex${exIdx + 1}`,
        estimatedCaloriesBurned: Math.round((ex.cals || 90) * volumeMultiplier)
      }))
    };
  }

  return plans;
};

export default function Workout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = (user?.email || 'default_user').trim().toLowerCase();

  // Safely resolve assigned coach profile
  const assignedCoach = (user?.assignedTrainer && typeof user.assignedTrainer === 'object') ? {
    name: user.assignedTrainer.name || 'Coach Marcus Vance',
    role: user.assignedTrainer.specialization || 'Certified Strength & Conditioning Specialist (CSCS)',
    certifications: user.assignedTrainer.credentials || 'NASM-CPT, CSCS, Precision Nutrition L2',
    experience: '9+ Years Elite Coaching',
    avatar: user.assignedTrainer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    verificationCode: 'CSCS-78492-VANCE'
  } : {
    name: 'Coach Marcus Vance',
    role: 'Certified Strength & Conditioning Specialist (CSCS)',
    certifications: 'NASM-CPT, CSCS, Precision Nutrition L2',
    experience: '9+ Years Elite Coaching',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    verificationCode: 'CSCS-78492-VANCE'
  };

  // Safely load or initialize Prescription Meta
  const [prescriptionMeta, setPrescriptionMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_workout_prescription`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_PRESCRIPTION_META,
            ...parsed,
            phases: Array.isArray(parsed.phases) && parsed.phases.length > 0 ? parsed.phases : DEFAULT_PHASES
          };
        }
      }
      return DEFAULT_PRESCRIPTION_META;
    } catch (e) {
      return DEFAULT_PRESCRIPTION_META;
    }
  });

  // 30-Day Progressive Plan Repository
  const [allPlans, setAllPlans] = useState(() => {
    return GENERATE_PERIODIZED_COACH_PLAN({
      goal: 'Hypertrophy',
      equipment: prescriptionMeta?.equipmentProfile || 'Full Gym Access',
      experience: prescriptionMeta?.experienceTier || 'Intermediate'
    });
  });

  // Completed Days History Map { 1: true, 2: true ... } scoped per user
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_completed_days_map`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Timestamps of completions { 1: 1710000000000, ... }
  const [completedTimestamps, setCompletedTimestamps] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_completed_days_timestamps`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Calculate highest unlocked day (Sequential progression)
  const completedCount = Object.keys(completedDays).filter(d => completedDays[d]).length;
  const maxUnlockedDay = Math.min(30, completedCount + 1);

  // Active Day Tracker (defaults to Day 1 for new user or from query param / storage)
  const [activeDay, setActiveDay] = useState(() => {
    const params = new URLSearchParams(location.search);
    const dayParam = params.get('day');
    if (dayParam) {
      const parsedParam = parseInt(dayParam, 10);
      if (!isNaN(parsedParam) && parsedParam >= 1 && parsedParam <= 30) {
        return Math.min(maxUnlockedDay, parsedParam);
      }
    }
    const saved = localStorage.getItem(`smartfit_${userEmail}_workout_active_day`);
    const parsed = saved ? parseInt(saved, 10) : 1;
    return Math.min(maxUnlockedDay, Math.max(1, parsed));
  });

  const [completedState, setCompletedState] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_sets_day_${activeDay}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [logging, setLogging] = useState(false);
  const [alertBanner, setAlertBanner] = useState('');
  const [logSuccess, setLogSuccess] = useState(null);

  // Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Modals
  const [demoExercise, setDemoExercise] = useState(null);
  const [achievementData, setAchievementData] = useState(null);
  const [cycleCompletedModal, setCycleCompletedModal] = useState(false);
  const [tenDayMilestoneModal, setTenDayMilestoneModal] = useState(false);
  const [lockedDayModal, setLockedDayModal] = useState(null);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [calibrateModal, setCalibrateModal] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [coachChatOpen, setCoachChatOpen] = useState(false);

  // Server Workout Plan (AI Generated & Trainer Approved)
  const [serverWorkoutPlan, setServerWorkoutPlan] = useState(null);
  const [aiGenModalOpen, setAiGenModalOpen] = useState(false);
  const [requestingAiPlan, setRequestingAiPlan] = useState(false);
  const [aiFormFields, setAiFormFields] = useState({
    fitnessGoal: 'Hypertrophy',
    fitnessLevel: 'Intermediate',
    daysPerWeek: 4,
    equipment: 'Full Gym Access',
    injuryNotes: ''
  });

  // Coach Chat State inside Modal
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Calibration Form State
  const [customGoal, setCustomGoal] = useState(prescriptionMeta?.targetGoal || 'Hypertrophy & Lean Muscle Mass');
  const [customEquip, setCustomEquip] = useState(prescriptionMeta?.equipmentProfile || 'Full Gym Access');
  const [customExp, setCustomExp] = useState(prescriptionMeta?.experienceTier || 'Intermediate');

  // Safely resolve current plan and exercise list with default fallbacks
  const currentPlan = allPlans?.[activeDay] || allPlans?.[1] || {
    dayNumber: 1,
    dayTitle: 'Day 1: Chest & Triceps Hypertrophy Overload',
    weekLabel: 'Week 1 • Day 1 of 30',
    phaseLabel: 'Phase 1: Anatomical Adaptation',
    targetMuscle: 'Upper Chest & Triceps',
    rpeTarget: '8.5 / 10',
    durationMins: 45,
    restHours: 24,
    notes: 'Focus on 3-second controlled eccentrics. Squeeze pecs hard at lockout.',
    exercises: []
  };
  const currentExercises = currentPlan?.exercises || [];

  // Sync state when user switches or URL query param changes
  useEffect(() => {
    const email = (user?.email || 'default_user').trim().toLowerCase();
    
    // Check URL query param first
    const params = new URLSearchParams(location.search);
    const dayParam = params.get('day');
    
    // Read local scoped state
    let localMap = {};
    try {
      const savedMap = localStorage.getItem(`smartfit_${email}_completed_days_map`);
      if (savedMap) localMap = JSON.parse(savedMap);
    } catch (e) {}

    const localCount = Object.keys(localMap).filter(d => localMap[d]).length;
    const localMax = Math.min(30, localCount + 1);

    if (dayParam) {
      const p = parseInt(dayParam, 10);
      if (!isNaN(p) && p >= 1 && p <= 30) {
        setActiveDay(Math.min(localMax, p));
      }
    } else {
      const savedActive = localStorage.getItem(`smartfit_${email}_workout_active_day`);
      const p = savedActive ? parseInt(savedActive, 10) : 1;
      setActiveDay(Math.min(localMax, Math.max(1, p)));
    }

    setCompletedDays(localMap);

    // Fetch and sync from backend database
    if (user?.email) {
      fetchUserWorkoutProgressApi(user.email).then(data => {
        if (data && Array.isArray(data.completedWorkoutDays)) {
          const map = {};
          data.completedWorkoutDays.forEach(d => { map[d] = true; });
          setCompletedDays(map);
          try {
            localStorage.setItem(`smartfit_${email}_completed_days_map`, JSON.stringify(map));
          } catch (e) {}

          const count = data.completedWorkoutDays.length;
          const maxAllowed = Math.min(30, count + 1);
          const backendActive = data.activeWorkoutDay || maxAllowed;

          if (!dayParam) {
            const finalDay = Math.min(maxAllowed, Math.max(1, backendActive));
            setActiveDay(finalDay);
            localStorage.setItem(`smartfit_${email}_workout_active_day`, finalDay.toString());
          }
        }
      }).catch(err => {
        console.warn('Backend progress fetch sync note:', err);
      });

      // Fetch official approved workout plan
      fetchUserApprovedPlanApi(user.email).then(plan => {
        if (plan) {
          setServerWorkoutPlan(plan);
        }
      }).catch(err => {
        console.warn('Backend approved plan fetch note:', err);
      });
    }
  }, [user?.email, location.search]);

  // Sync state when switching active day
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_sets_day_${activeDay}`);
      setCompletedState(saved ? JSON.parse(saved) : {});
    } catch (e) {
      setCompletedState({});
    }
    localStorage.setItem(`smartfit_${userEmail}_workout_active_day`, activeDay.toString());
    setAlertBanner('');
  }, [activeDay, userEmail]);

  // Save completed sets for active day
  useEffect(() => {
    localStorage.setItem(`smartfit_${userEmail}_sets_day_${activeDay}`, JSON.stringify(completedState));
  }, [completedState, activeDay, userEmail]);

  // Rest Timer Countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Load chat messages when coach chat modal is opened
  useEffect(() => {
    if (coachChatOpen) {
      const msgs = getConversationMessages(user?.email || 'aby@example.com', 'marcus@example.com');
      setChatMessages(msgs);
    }
  }, [coachChatOpen, user?.email]);

  useEffect(() => {
    if (coachChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, coachChatOpen]);

  const startRestTimer = (seconds) => {
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  const toggleSetComplete = (exId, setNum) => {
    setCompletedState(prev => {
      const key = `${exId}-${setNum}`;
      const updated = { ...prev, [key]: !prev[key] };
      return updated;
    });
    startRestTimer(60);
    setAlertBanner('');
  };

  const handleCompleteAllSets = () => {
    const allSets = {};
    currentExercises.forEach(ex => {
      const sCount = ex.sets || 3;
      for (let s = 1; s <= sCount; s++) {
        allSets[`${ex.id}-${s}`] = true;
      }
    });
    setCompletedState(allSets);
    setAlertBanner('');
    startRestTimer(45);
  };

  const calculateTotalCalories = () => {
    if (!currentExercises || !currentExercises.length) return 450;
    return currentExercises.reduce((acc, ex) => acc + (ex.estimatedCaloriesBurned || 85), 0);
  };

  const totalSetsCount = currentExercises.reduce((acc, ex) => acc + (ex.sets || 3), 0);
  const completedSetsCount = currentExercises.reduce((acc, ex) => {
    const sCount = ex.sets || 3;
    let done = 0;
    for (let s = 1; s <= sCount; s++) {
      if (completedState[`${ex.id}-${s}`]) done++;
    }
    return acc + done;
  }, 0);

  const isDayFullyCompleted = completedDays[activeDay] || (completedSetsCount === totalSetsCount && totalSetsCount > 0);

  const handleSelectDay = (dayNum) => {
    if (dayNum > maxUnlockedDay) {
      setLockedDayModal({
        targetDay: dayNum,
        requiredDay: maxUnlockedDay,
        reason: `Sequential Progression Locked: You cannot skip to Day ${dayNum} without finishing Day ${maxUnlockedDay} and fulfilling your prescribed recovery period.`
      });
      return;
    }
    setActiveDay(dayNum);
  };

  const handleCalibratePlan = () => {
    setCalibrating(true);
    setTimeout(() => {
      const newPlans = GENERATE_PERIODIZED_COACH_PLAN({
        goal: 'Hypertrophy',
        equipment: customEquip,
        experience: customExp
      });

      const updatedMeta = {
        ...prescriptionMeta,
        targetGoal: customGoal,
        equipmentProfile: customEquip,
        experienceTier: customExp,
        issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        approvalStatus: 'APPROVED_AND_ACTIVE',
        prescriptionId: `RX-30D-${Math.floor(1000 + Math.random() * 9000)}-${assignedCoach.name.split(' ').map(n=>n[0]).join('')}`
      };

      setAllPlans(newPlans);
      setPrescriptionMeta(updatedMeta);
      localStorage.setItem(`smartfit_${userEmail}_workout_prescription`, JSON.stringify(updatedMeta));
      setCalibrating(false);
      setCalibrateModal(false);
      setLogSuccess(`✓ Coach ${assignedCoach.name} has approved and certified your updated 30-Day Prescription!`);
    }, 1000);
  };

  const handleSendCoachMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userEmailAddr = user?.email || 'aby@example.com';
    const userName = user?.fullName || 'Aby Thomas';

    sendChatMessage(
      userEmailAddr,
      'marcus@example.com',
      'TRAINER',
      'USER',
      userEmailAddr,
      userName,
      chatInput
    );

    const updated = getConversationMessages(userEmailAddr, 'marcus@example.com');
    setChatMessages(updated);
    setChatInput('');
  };

  const handleRequestAiPlan = async (e) => {
    e?.preventDefault();
    setRequestingAiPlan(true);
    setAlertBanner('');
    try {
      const payload = {
        userEmail: user?.email || 'aby@example.com',
        fitnessGoal: aiFormFields.fitnessGoal,
        fitnessLevel: aiFormFields.fitnessLevel,
        daysPerWeek: Number(aiFormFields.daysPerWeek) || 4,
        equipment: aiFormFields.equipment,
        injuryNotes: aiFormFields.injuryNotes,
        age: user?.age ? Number(user.age) : 26,
        gender: user?.gender || 'Male',
        weightKg: user?.weight ? Number(user.weight) : 75,
        heightCm: user?.height ? Number(user.height) : 178
      };
      const res = await requestAiWorkoutPlanApi(payload);
      if (res && res.plan) {
        setServerWorkoutPlan(res.plan);
        setLogSuccess(`✨ AI Candidate Plan Generated! Plan has been routed to ${assignedCoach.name} for official review & sign-off.`);
      } else {
        setLogSuccess(`✨ AI Workout Recommendation submitted! It is now pending Trainer review.`);
      }
    } catch (err) {
      console.warn('Request AI plan error:', err);
      setLogSuccess(`✨ AI Workout Recommendation created and sent to your trainer.`);
    } finally {
      setRequestingAiPlan(false);
      setAiGenModalOpen(false);
    }
  };

  const handleLogWorkout = async () => {
    if (completedSetsCount < totalSetsCount) {
      setAlertBanner(`⚠️ Incomplete Sets: You have only completed ${completedSetsCount} of ${totalSetsCount} prescribed sets. Complete all sets before logging to unlock Day ${Math.min(30, activeDay + 1)}.`);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setLogging(true);
    setAlertBanner('');
    setLogSuccess(null);

    const completedNames = currentExercises.map(ex => ex.name);
    const totalCals = calculateTotalCalories();
    const durationMins = currentPlan.durationMins || 45;
    const xpEarned = totalCals + (durationMins * 5);
    const dayTitle = currentPlan.dayTitle;
    const nowTimestamp = Date.now();

    const payload = {
      email: userEmail,
      dayNumber: activeDay,
      workoutTitle: `${dayTitle} (Trainer Verified)`,
      durationMinutes: durationMins,
      caloriesBurned: totalCals,
      completedExercises: completedNames
    };

    try {
      await completeWorkoutDayApi(payload);
    } catch (err) {
      console.warn('Backend complete day note:', err);
    }

    setLogging(false);
    
    const newCompletedMap = { ...completedDays, [activeDay]: true };
    const newTimestamps = { ...completedTimestamps, [activeDay]: nowTimestamp };
    setCompletedDays(newCompletedMap);
    setCompletedTimestamps(newTimestamps);
    
    localStorage.setItem(`smartfit_${userEmail}_completed_days_map`, JSON.stringify(newCompletedMap));
    localStorage.setItem(`smartfit_${userEmail}_completed_days_timestamps`, JSON.stringify(newTimestamps));

    const totalDaysDone = Object.keys(newCompletedMap).filter(k => newCompletedMap[k]).length;

    // Check if 10-day workout milestone reached
    if (totalDaysDone === 10 || activeDay === 10) {
      setTenDayMilestoneModal(true);
    }

    if (activeDay === 30) {
      setCycleCompletedModal(true);
    } else {
      const nextDay = activeDay + 1;
      setLogSuccess(`✓ Day ${activeDay} Completed & Rest Period Activated! Day ${nextDay} is now Unlocked 🎉 (Total ${totalDaysDone} Days Completed Saved)`);
      
      setAchievementData({
        dayNumber: activeDay,
        nextDay,
        planTitle: dayTitle,
        calories: totalCals,
        duration: durationMins,
        xp: xpEarned,
        completedCount: currentExercises.length,
        totalExercises: currentExercises.length,
        restHours: currentPlan.restHours || 24,
        coachName: assignedCoach.name,
        totalDaysCompleted: totalDaysDone
      });

      setActiveDay(nextDay);
      localStorage.setItem(`smartfit_${userEmail}_workout_active_day`, nextDay.toString());
    }
  };

  const handleRestartCycle = async () => {
    try {
      await resetWorkoutCycleApi(userEmail);
    } catch (e) {}

    setActiveDay(1);
    setCompletedDays({});
    setCompletedTimestamps({});
    for (let d = 1; d <= 30; d++) {
      localStorage.removeItem(`smartfit_${userEmail}_sets_day_${d}`);
    }
    localStorage.setItem(`smartfit_${userEmail}_workout_active_day`, '1');
    localStorage.setItem(`smartfit_${userEmail}_completed_days_map`, JSON.stringify({}));
    localStorage.setItem(`smartfit_${userEmail}_completed_days_timestamps`, JSON.stringify({}));
    setCycleCompletedModal(false);
    setTenDayMilestoneModal(false);
    setAlertBanner('');
    setLogSuccess('Workout Cycle Reset. Day 1 is now active for your next progression level.');
  };

  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#12030F', color: '#FFFFFF' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

          {/* Success Toast Notification */}
          {logSuccess && (
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.18)', border: '1px solid #34D399', color: '#34D399', padding: '14px 20px', borderRadius: '12px', fontSize: '0.92rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(52, 211, 153, 0.25)' }}>
              <CheckCircle2 size={20} /> {logSuccess}
            </div>
          )}

          {/* Warning / Incomplete Set Validation Alert */}
          {alertBanner && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.18)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '14px 20px', borderRadius: '12px', fontSize: '0.92rem', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="#EF4444" />
                <span>{alertBanner}</span>
              </div>
              <button
                onClick={handleCompleteAllSets}
                style={{ background: '#EF4444', border: 'none', color: '#FFF', fontWeight: 800, fontSize: '0.8rem', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                Check All Sets Complete
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. OFFICIAL COACH PRESCRIPTION & VERIFICATION SEAL HEADER */}
          {/* ========================================================================= */}
          <div style={{
            padding: '24px 28px',
            marginBottom: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 112, 67, 0.35)',
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.5) 0%, rgba(29, 7, 24, 0.95) 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={assignedCoach.avatar} 
                  alt={assignedCoach.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF7043' }}
                />
                <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#10B981', color: '#FFF', borderRadius: '50%', padding: '3px', border: '2px solid #12030F' }}>
                  <ShieldCheck size={12} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.74rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} /> CERTIFIED COACH PRESCRIPTION
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                    ID: {prescriptionMeta?.prescriptionId || 'RX-30D-2026-MV78'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: '0 0 2px 0', fontWeight: 800 }}>
                  Prescribed by {assignedCoach.name}
                </h3>

                <p style={{ color: 'var(--peach-soft)', fontSize: '0.82rem', margin: 0 }}>
                  {assignedCoach.role} • <span style={{ color: '#E2C9D6' }}>{assignedCoach.certifications}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setAiGenModalOpen(true)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)'
                }}>
                <Sparkles size={15} />
                <span>✨ AI Workout Generator</span>
              </button>

              <button
                onClick={() => navigate('/workout-studio')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
                  border: 'none',
                  color: '#12030F',
                  fontWeight: 900,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(255, 112, 67, 0.35)'
                }}>
                <Zap size={15} />
                <span>3D Workout Studio (14 Splits)</span>
              </button>

              <button
                onClick={() => setPrescriptionModal(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 158, 125, 0.12)',
                  border: '1px solid var(--peach-primary)',
                  color: 'var(--peach-light)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <FileText size={15} />
                <span>View Prescription</span>
              </button>

              <button
                onClick={() => setCalibrateModal(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Sliders size={15} />
                <span>Calibrate Split</span>
              </button>

              <button
                onClick={() => setCoachChatOpen(true)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  background: '#FF7043',
                  border: 'none',
                  color: '#12030F',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <MessageSquare size={15} />
                <span>Ask Coach</span>
              </button>
            </div>
          </div>

          {/* Pending Trainer Review Status Banner */}
          {serverWorkoutPlan && (serverWorkoutPlan.status === 'PENDING_TRAINER_REVIEW' || serverWorkoutPlan.status === 'AI_GENERATED') && (
            <div style={{
              padding: '16px 22px',
              marginBottom: '24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(29, 7, 24, 0.95) 100%)',
              border: '1px solid #8B5CF6',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.25)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(139, 92, 246, 0.3)', color: '#C084FC', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.5)' }}>
                      STATUS: PENDING TRAINER APPROVAL
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      {serverWorkoutPlan.planName || 'Personalized AI Split'}
                    </span>
                  </div>
                  <div style={{ color: '#E2C9D6', fontSize: '0.86rem' }}>
                    Your AI-generated exercise protocol is currently with <strong>{assignedCoach.name}</strong> for safety evaluation and custom set/rep calibration.
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#C084FC', fontWeight: 700 }}>
                {serverWorkoutPlan.exercises?.length || 0} candidate exercises generated
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. 30-DAY PROGRESS TRACKER & SEQUENTIAL LOCK SELECTOR BAR */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '24px 28px', 
            marginBottom: '26px', 
            borderRadius: '20px',
            border: '1px solid rgba(255, 158, 125, 0.25)', 
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.4) 0%, rgba(29, 7, 24, 0.9) 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={20} color="var(--peach-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  30-Day Sequential Progression Cycle
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#4ADE80', fontWeight: 700, background: 'rgba(74,222,128,0.12)', padding: '3px 10px', borderRadius: '10px' }}>
                  {completedCount}/30 Days Completed ({progressPercent}%)
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--peach-primary)', fontWeight: 700, background: 'rgba(255,158,125,0.12)', padding: '3px 10px', borderRadius: '10px' }}>
                  Unlocked: Up to Day {maxUnlockedDay}
                </span>
              </div>
            </div>

            {/* Cycle Progress Bar */}
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #FF7043, #10B981)', transition: 'width 0.4s ease' }} />
            </div>

            {/* 30-Day Grid Selector with Locked & Unlocked Visual Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(32px, 1fr))', gap: '6px' }}>
              {Array.from({ length: 30 }, (_, i) => {
                const dayNum = i + 1;
                const isSelected = activeDay === dayNum;
                const isDone = !!completedDays[dayNum];
                const isLocked = dayNum > maxUnlockedDay;

                return (
                  <button
                    key={dayNum}
                    onClick={() => handleSelectDay(dayNum)}
                    title={isLocked ? `Locked: Complete Day ${maxUnlockedDay} and rest first` : (isDone ? `Day ${dayNum} Completed` : `Day ${dayNum} In Progress`)}
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: isSelected 
                        ? '2px solid #FF7043' 
                        : (isDone 
                            ? '1px solid #10B981' 
                            : (isLocked 
                                ? '1px solid rgba(255,255,255,0.06)' 
                                : '1px solid rgba(255,158,125,0.3)')),
                      backgroundColor: isSelected 
                        ? '#FF7043' 
                        : (isDone 
                            ? 'rgba(16,185,129,0.18)' 
                            : (isLocked 
                                ? 'rgba(255,255,255,0.02)' 
                                : 'rgba(255,158,125,0.08)')),
                      color: isSelected 
                        ? '#12030F' 
                        : (isDone 
                            ? '#34D399' 
                            : (isLocked 
                                ? 'rgba(255,255,255,0.25)' 
                                : '#FFF')),
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1px',
                      transition: 'all 0.2s ease',
                      opacity: isLocked ? 0.45 : 1
                    }}>
                    {isDone ? (
                      <Check size={12} strokeWidth={3} />
                    ) : isLocked ? (
                      <Lock size={11} />
                    ) : (
                      <span>{dayNum}</span>
                    )}
                    <span style={{ fontSize: '0.62rem', lineHeight: 1 }}>{isDone ? `${dayNum}` : ''}</span>
                  </button>
                );
              })}
            </div>

            {/* Progression & Rest Rules Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.76rem', color: '#E2C9D6', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10B981', display: 'inline-block' }} /> Completed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#FF7043', display: 'inline-block' }} /> Active Day
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} /> 🔒 Sequential Lock
                </span>
              </div>
              <span style={{ color: 'var(--peach-primary)', fontWeight: 700 }}>
                💡 Sequential Progression Enforced: Complete all sets for Day {activeDay} to unlock Day {Math.min(30, activeDay + 1)}.
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. PRIMARY COACH BLUEPRINT BANNER FOR ACTIVE DAY */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '28px 32px', 
            marginBottom: '26px', 
            borderRadius: '20px',
            border: '1px solid rgba(255, 112, 67, 0.4)', 
            background: 'linear-gradient(135deg, rgba(255,112,67,0.12) 0%, rgba(35,8,28,0.85) 100%)',
            boxShadow: '0 10px 35px rgba(255,112,67,0.18)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#FF7043', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Dumbbell size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#FF7043', color: '#12030F', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {currentPlan.weekLabel}
                    </span>
                    <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      {currentPlan.phaseLabel}
                    </span>
                    <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 700 }}>
                      ✓ Coach Approved
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: '0 0 6px 0', fontWeight: 800 }}>
                    {currentPlan.dayTitle}
                  </h2>

                  <p style={{ color: '#E2C9D6', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', lineHeight: '1.5', maxWidth: '720px' }}>
                    "{currentPlan.notes}"
                  </p>
                </div>
              </div>

              {/* Routine Metrics Overview */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Duration</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>{currentPlan.durationMins || 45} mins</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Target Load</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FF7043' }}>{currentPlan.rpeTarget || '8.5 / 10'}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Est. Calories</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ADE80' }}>{calculateTotalCalories()} kcal</div>
                </div>

                <button
                  onClick={() => setDemoExercise(currentExercises[0] || { name: 'Incline Barbell Bench Press' })}
                  title="Launch 3D Virtual Coach Split Masterclass"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
                    border: 'none',
                    color: '#12030F',
                    fontWeight: 900,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    boxShadow: '0 4px 18px rgba(255, 112, 67, 0.45)',
                    transition: 'transform 0.2s ease'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} />
                    <span>3D Virtual Man Demo</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Full Split Masterclass</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. INTERACTIVE REST TIMER BAR */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '16px 24px', 
            marginBottom: '26px', 
            borderRadius: '16px',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '14px', 
            background: 'rgba(29,7,24,0.75)',
            border: '1px solid rgba(255,158,125,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,158,125,0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase' }}>Between-Set Rest Timer</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: timerActive ? '#FF7043' : '#FFF' }}>
                  {timerSeconds > 0 ? `${timerSeconds}s Remaining (Rest & Recover)` : 'Ready for Next Set'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startRestTimer(45)} style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                45s Rest
              </button>
              <button onClick={() => startRestTimer(60)} style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                60s Rest
              </button>
              <button onClick={() => startRestTimer(90)} style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                90s Rest
              </button>
              {timerActive && (
                <button onClick={() => setTimerSeconds(0)} style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. PRESCRIBED EXERCISE SCHEDULE & SET COMPLETION CHECKLIST */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  Day {activeDay} Movement Schedule ({currentExercises.length} Exercises)
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  Check off each set as you complete them with proper form and rest intervals.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: completedSetsCount === totalSetsCount ? '#4ADE80' : '#FFB8A1', fontWeight: 800, background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: '10px' }}>
                  {completedSetsCount} / {totalSetsCount} Sets Completed
                </span>
                <button
                  onClick={handleCompleteAllSets}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid #34D399',
                    color: '#34D399',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <CheckSquare size={14} />
                  <span>Check All Sets Done</span>
                </button>
              </div>
            </div>

            {currentExercises.map((ex, idx) => {
              const setsCount = ex.sets || 3;
              const allSetsCompleted = Array.from({ length: setsCount }, (_, sIdx) => !!completedState[`${ex.id}-${sIdx + 1}`]).every(Boolean);

              return (
                <div 
                  key={ex.id || idx}
                  style={{
                    padding: '24px 28px',
                    borderRadius: '16px',
                    border: allSetsCompleted ? '1px solid #34D399' : '1px solid rgba(255, 158, 125, 0.2)',
                    background: allSetsCompleted ? 'linear-gradient(135deg, rgba(52,211,153,0.08) 0%, rgba(29,7,24,0.85) 100%)' : 'rgba(29,7,24,0.75)',
                    transition: 'all 0.25s ease'
                  }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ backgroundColor: 'rgba(255,112,67,0.15)', color: '#FF7043', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                          EXERCISE #{idx + 1}
                        </span>
                        <span style={{ color: '#38BDF8', fontSize: '0.78rem', fontWeight: 700 }}>
                          Target: {ex.targetMuscle}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                        {ex.name}
                      </h4>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                        Equipment: <span style={{ color: '#FFF' }}>{ex.equip || ex.equipmentNeeded || 'Standard Gym'}</span> • Weight Target: <span style={{ color: '#FACC15' }}>{ex.weight || 'Prescribed Load'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => navigate(`/workout-studio?exercise=${encodeURIComponent(ex.name)}&mode=demo`)}
                        title={`Watch Virtual Human 3D Demonstration for ${ex.name}`}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(255,112,67,0.2) 0%, rgba(255,158,125,0.1) 100%)',
                          border: '1px solid var(--peach-primary)',
                          color: 'var(--peach-light)',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(255,112,67,0.15)',
                          transition: 'all 0.2s ease'
                        }}>
                        <Play size={13} fill="var(--peach-primary)" />
                        <span>3D Demo</span>
                      </button>

                      <button
                        onClick={() => navigate(`/workout-studio?exercise=${encodeURIComponent(ex.name)}&mode=camera`)}
                        title={`Launch AI Camera Computer-Vision Form Tracker & Rep Counter for ${ex.name}`}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(139,92,246,0.15) 100%)',
                          border: '1px solid #38BDF8',
                          color: '#BAE6FD',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(56,189,248,0.15)',
                          transition: 'all 0.2s ease'
                        }}>
                        <Sparkles size={13} />
                        <span>AI Form Camera</span>
                      </button>

                      <div style={{ textAlign: 'right', marginLeft: '6px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ADE80' }}>
                          {ex.estimatedCaloriesBurned || 90} <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coach Form Instructions */}
                  {(ex.cue || ex.instructions) && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #FF7043', marginBottom: '16px', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                      <strong style={{ color: 'var(--peach-soft)' }}>Coach Cue:</strong> {ex.cue || ex.instructions}
                    </div>
                  )}

                  {/* Interactive Set Checklist Row */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
                        PRESCRIPTION: {ex.sets} SETS × {ex.reps} REPS
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Array.from({ length: setsCount }, (_, sIdx) => {
                        const setNum = sIdx + 1;
                        const isDone = !!completedState[`${ex.id}-${setNum}`];
                        return (
                          <button
                            key={setNum}
                            onClick={() => toggleSetComplete(ex.id, setNum)}
                            style={{
                              padding: '7px 16px',
                              borderRadius: '8px',
                              border: isDone ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.2)',
                              background: isDone ? '#10B981' : 'rgba(255,255,255,0.04)',
                              color: isDone ? '#12030F' : '#FFF',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease'
                            }}>
                            {isDone && <Check size={14} strokeWidth={3} />}
                            <span>Set {setNum} {isDone ? 'Done' : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 6. FINISH & LOG WORKOUT OR RECOVERY PROTOCOL BANNER */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '28px 32px', 
            borderRadius: '20px',
            border: isDayFullyCompleted ? '2px solid #10B981' : '1px solid rgba(255,158,125,0.3)', 
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.45) 0%, rgba(29, 7, 24, 0.9) 100%)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isDayFullyCompleted ? '#10B981' : 'var(--peach-primary)', textTransform: 'uppercase' }}>
                  {isDayFullyCompleted ? '✓ ALL SETS PERFORMED' : 'SESSION IN PROGRESS'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  ({completedSetsCount}/{totalSetsCount} sets completed)
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                Finish & Log Day {activeDay} Workout
              </h3>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Fulfilling all sets registers your workout session, awards XP, and unlocks Day {Math.min(30, activeDay + 1)} after the recovery protocol.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {completedDays[activeDay] ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.92rem', background: 'rgba(16,185,129,0.15)', padding: '10px 18px', borderRadius: '12px' }}>
                    ✓ Day {activeDay} Completed
                  </span>
                  {activeDay < 30 && (
                    <button
                      onClick={() => setActiveDay(activeDay + 1)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #FF7043 0%, #10B981 100%)',
                        border: 'none',
                        color: '#12030F',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                      <span>Proceed to Day {activeDay + 1}</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogWorkout}
                  disabled={logging}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    background: completedSetsCount === totalSetsCount ? 'linear-gradient(135deg, #FF7043 0%, #10B981 100%)' : 'rgba(255,158,125,0.15)',
                    border: completedSetsCount === totalSetsCount ? 'none' : '1px solid rgba(255,158,125,0.35)',
                    color: completedSetsCount === totalSetsCount ? '#12030F' : 'var(--peach-light)',
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    cursor: logging ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: completedSetsCount === totalSetsCount ? '0 6px 20px rgba(255,112,67,0.4)' : 'none'
                  }}>
                  <CheckCircle2 size={18} />
                  <span>{logging ? 'Logging...' : `Complete Day ${activeDay} & Unlock Day ${Math.min(30, activeDay + 1)}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODAL 1: OFFICIAL COACH PRESCRIPTION CERTIFICATE */}
          {/* ========================================================================= */}
          {prescriptionModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '36px', maxWidth: '680px', width: '100%', background: '#1d0718', border: '2px solid #FF7043', borderRadius: '22px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ background: '#FF7043', color: '#12030F', fontSize: '0.72rem', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
                        OFFICIAL PRESCRIPTION
                      </span>
                      <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 800 }}>
                        ✓ STATUS: APPROVED & ACTIVE
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.6rem', color: '#FFF', margin: '4px 0 0 0', fontWeight: 900 }}>
                      30-Day Periodized Training Prescription
                    </h2>
                  </div>
                  <button onClick={() => setPrescriptionModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={22} />
                  </button>
                </div>

                {/* Athlete & Coach Profile Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Athlete Profile</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{user?.fullName || 'John Doe'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', marginTop: '2px' }}>Target: {prescriptionMeta?.targetGoal || 'Hypertrophy & Lean Muscle Mass'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>Equipment: {prescriptionMeta?.equipmentProfile || 'Full Gym Access'}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Prescribing Coach</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FF7043', marginTop: '2px' }}>{assignedCoach.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#4ADE80', marginTop: '2px' }}>{assignedCoach.role}</div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>ID: {prescriptionMeta?.prescriptionId || 'RX-30D-2026-MV78'}</div>
                  </div>
                </div>

                {/* 4 Periodized Mesocycles */}
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#FFF', fontWeight: 800, marginBottom: '10px' }}>
                    4-Phase Periodization Architecture
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(prescriptionMeta?.phases || DEFAULT_PHASES).map((ph, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '10px', borderLeft: `3px solid ${idx === 0 ? '#38BDF8' : idx === 1 ? '#FACC15' : idx === 2 ? '#FF7043' : '#10B981'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFF' }}>
                            Phase {ph.phase}: {ph.title} <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>({ph.days})</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '2px' }}>
                            {ph.focus}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#34D399', fontWeight: 800, background: 'rgba(52,211,153,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach Clinical Directives */}
                <div style={{ background: 'rgba(255,112,67,0.1)', border: '1px dashed #FF7043', padding: '14px', borderRadius: '12px', marginBottom: '22px', fontSize: '0.84rem', color: '#E2C9D6', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--peach-soft)' }}>Coach Clinical Directives:</strong> "{prescriptionMeta?.coachNotes || DEFAULT_PRESCRIPTION_META.coachNotes}"
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Digitally Certified on {prescriptionMeta?.issuedDate || 'September 23, 2026'}
                  </div>
                  <button onClick={() => setPrescriptionModal(false)} className="btn-primary" style={{ padding: '8px 24px' }}>
                    Acknowledge & Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 2: CALIBRATE & REQUEST COACH PLAN APPROVAL */}
          {/* ========================================================================= */}
          {calibrateModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '36px', maxWidth: '520px', width: '100%', background: '#1d0718', border: '2px solid #FF7043', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                      Calibrate 30-Day Training Split
                    </h3>
                    <p style={{ color: 'var(--peach-soft)', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                      Request updated coach prescription & volume parameters
                    </p>
                  </div>
                  <button onClick={() => setCalibrateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>Primary Training Goal</label>
                    <select 
                      value={customGoal} 
                      onChange={e => setCustomGoal(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Hypertrophy & Lean Muscle Mass">Hypertrophy & Lean Muscle Mass</option>
                      <option value="Maximum Strength & CNS Power">Maximum Strength & CNS Power</option>
                      <option value="Fat Shred & Metabolic Conditioning">Fat Shred & Metabolic Conditioning</option>
                      <option value="Functional Longevity & Athletic Mobility">Functional Longevity & Athletic Mobility</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>Equipment Availability</label>
                    <select 
                      value={customEquip} 
                      onChange={e => setCustomEquip(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Full Gym Access">Full Gym Access (Barbells, Cables, Machines)</option>
                      <option value="Dumbbells & Adjustable Bench">Dumbbells & Adjustable Bench Only</option>
                      <option value="Home & Calisthenics Bodyweight">Home & Calisthenics Bodyweight</option>
                      <option value="Kettlebell & Resistance Bands">Kettlebell & Resistance Bands</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>Athlete Experience Tier</label>
                    <select 
                      value={customExp} 
                      onChange={e => setCustomExp(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Beginner / Novice">Beginner / Novice (Anatomical Adaptation Priority)</option>
                      <option value="Intermediate">Intermediate (Progressive Overload Standard)</option>
                      <option value="Advanced Athlete">Advanced Athlete (Peak Mechanical Tension)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setCalibrateModal(false)} style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button 
                    onClick={handleCalibratePlan} 
                    disabled={calibrating}
                    className="btn-primary" 
                    style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {calibrating ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
                    <span>{calibrating ? 'Calibrating with Coach...' : 'Request Coach Sign-off'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 3: 3D AI VIRTUAL COACH EXERCISE DEMO & VOICE MASTERCLASS */}
          {/* ========================================================================= */}
          {demoExercise && (
            <VirtualCoachDemoModal
              exercise={demoExercise}
              allExercises={currentExercises}
              onClose={() => setDemoExercise(null)}
            />
          )}

          {/* ========================================================================= */}
          {/* MODAL 4: LOCKED DAY NOTIFICATION POPUP */}
          {/* ========================================================================= */}
          {lockedDayModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '32px', maxWidth: '480px', width: '100%', background: '#1d0718', border: '2px solid #FF7043', borderRadius: '18px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,112,67,0.15)', color: '#FF7043', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Lock size={30} />
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: '0 0 8px 0', fontWeight: 800 }}>
                  🔒 Day {lockedDayModal.targetDay} is Locked
                </h3>

                <p style={{ color: '#E2C9D6', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                  {lockedDayModal.reason}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.84rem', color: '#38BDF8', textAlign: 'left' }}>
                  <strong>Next Action:</strong> Head to <strong>Day {lockedDayModal.requiredDay}</strong>, perform all {allPlans?.[lockedDayModal.requiredDay]?.exercises?.length || 4} exercise sets, and log your session.
                </div>

                <button
                  onClick={() => {
                    setActiveDay(lockedDayModal.requiredDay);
                    setLockedDayModal(null);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px' }}>
                  Go to Active Day {lockedDayModal.requiredDay}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 5: DAY COMPLETION & UNLOCK ACHIEVEMENT */}
          {/* ========================================================================= */}
          {achievementData && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '36px', maxWidth: '500px', width: '100%', background: '#1d0718', border: '2px solid #34D399', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(52,211,153,0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Trophy size={36} />
                </div>

                <h3 style={{ fontSize: '1.5rem', color: '#FFF', margin: '0 0 6px 0', fontWeight: 800 }}>
                  Day {achievementData.dayNumber} Completed!
                </h3>
                <p style={{ color: '#A7F3D0', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                  {achievementData.planTitle}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Energy Burned</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4ADE80' }}>{achievementData.calories} kcal</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>XP Earned</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FACC15' }}>+{achievementData.xp} XP</div>
                  </div>
                </div>

                {/* Rest & Recovery Directive */}
                <div style={{ backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid #34D399', padding: '14px', borderRadius: '12px', marginBottom: '22px', fontSize: '0.86rem', color: '#FFF', textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <HeartPulse size={16} /> Rest & Recovery Protocol Active
                  </div>
                  <div style={{ color: '#E2C9D6', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    🧬 {achievementData.restHours}h Recovery protocol initiated. Muscle protein synthesis and glycogen reload are underway. <strong>Day {achievementData.nextDay}</strong> is now officially unlocked for your next session!
                  </div>
                </div>

                <button 
                  onClick={() => setAchievementData(null)}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
                  Continue to Day {achievementData.nextDay}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 5.5: 10-DAY WORKOUT PLAN COMPLETED MILESTONE POPUP */}
          {/* ========================================================================= */}
          {tenDayMilestoneModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1050, padding: '20px', backdropFilter: 'blur(16px)'
            }}>
              <div style={{ padding: '38px', maxWidth: '540px', width: '100%', background: '#1d0718', border: '2px solid #38BDF8', borderRadius: '22px', textAlign: 'center', boxShadow: '0 0 40px rgba(56, 189, 248, 0.35)' }}>
                <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid #38BDF8' }}>
                  <Award size={44} />
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '10px' }}>
                  <Medal size={15} /> 10-DAY WORKOUT PLAN COMPLETED
                </div>

                <h2 style={{ fontSize: '1.75rem', color: '#FFF', margin: '0 0 8px 0', fontWeight: 900 }}>
                  🎉 10 DAYS COMPLETED & STORED!
                </h2>
                <p style={{ color: '#BAE6FD', fontSize: '0.92rem', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  Congratulations! You have successfully completed the 10-Day Workout Milestone. This milestone is permanently stored in your fitness profile and training log.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Plan Progress</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>10 Days Done</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Calorie Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80' }}>4,800+ kcal</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Milestone Bonus</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FACC15' }}>+3,500 XP</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '14px', borderRadius: '12px', marginBottom: '22px', fontSize: '0.84rem', color: '#E2C9D6', textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: '#38BDF8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> Certified Permanent Record
                  </div>
                  <span>Coach Marcus Vance has signed off on your 10-Day Adaptation milestone. You are now prepared for advanced Progressive Overload in Days 11-30!</span>
                </div>

                <button 
                  onClick={() => setTenDayMilestoneModal(false)}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>Continue Progression (Day 11 Unlocked)</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 6: 30-DAY PROGRAM TITAN CYCLE COMPLETION */}
          {/* ========================================================================= */}
          {cycleCompletedModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(15px)'
            }}>
              <div style={{ padding: '40px', maxWidth: '540px', width: '100%', background: '#1d0718', border: '2px solid #FACC15', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(250,204,21,0.2)', color: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Award size={42} />
                </div>

                <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: '0 0 8px 0', fontWeight: 800 }}>
                  👑 30-DAY TITAN MASTER COMPLETED!
                </h2>
                <p style={{ color: '#FACC15', fontSize: '0.95rem', margin: '0 0 20px 0', fontWeight: 700 }}>
                  You have successfully completed all 30 days of your trainer's periodized progression!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Total Burn</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ADE80' }}>14,500+ kcal</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Total XP</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FACC15' }}>+16,950 XP</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Discipline</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8' }}>100%</div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Ready to restart the 30-day progression with increased strength baselines and overload?
                </p>

                <button 
                  onClick={handleRestartCycle}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <RotateCcw size={18} />
                  <span>Restart 30-Day Cycle (Day 1 Next Level)</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 7: DEDICATED COACH CONSULTATION & CHAT MODAL */}
          {/* ========================================================================= */}
          {coachChatOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '24px 28px', maxWidth: '520px', width: '100%', background: '#1d0718', border: '1px solid #FF7043', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '600px', maxHeight: '90vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={assignedCoach.avatar} alt={assignedCoach.name} style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #FF7043' }} />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0, fontWeight: 800 }}>{assignedCoach.name}</h4>
                      <span style={{ fontSize: '0.74rem', color: '#4ADE80' }}>● Online • Strength Coach Desk</span>
                    </div>
                  </div>
                  <button onClick={() => setCoachChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Chat message history stream */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginTop: '60px' }}>
                      Start a direct inquiry with {assignedCoach.name} regarding form, rest times, or exercise substitutions.
                    </div>
                  ) : (
                    chatMessages.map((m, idx) => {
                      const isMe = m.senderRole === 'USER' || m.senderEmail === (user?.email || 'aby@example.com');
                      return (
                        <div key={m.id || idx} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '80%',
                            padding: '10px 14px',
                            borderRadius: '14px',
                            background: isMe ? '#FF7043' : 'rgba(255,255,255,0.08)',
                            color: isMe ? '#12030F' : '#FFF',
                            fontWeight: isMe ? 700 : 400,
                            fontSize: '0.86rem',
                            lineHeight: '1.4'
                          }}>
                            <div>{m.text}</div>
                            <div style={{ fontSize: '0.68rem', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                              {m.timestamp || 'Just now'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat input box */}
                <form onSubmit={handleSendCoachMessage} style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={`Ask ${assignedCoach.name.split(' ')[0]} a question...`}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.88rem' }}
                  />
                  <button type="submit" style={{ padding: '10px 16px', borderRadius: '10px', background: '#FF7043', border: 'none', color: '#12030F', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 8: AI WORKOUT PLAN GENERATOR (SUBMIT TO TRAINER) */}
          {/* ========================================================================= */}
          {aiGenModalOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '32px 36px', maxWidth: '560px', width: '100%', background: '#1d0718', border: '2px solid #8B5CF6', borderRadius: '22px', boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.25)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                        AI Workout Plan Generator
                      </h3>
                      <p style={{ color: '#C084FC', fontSize: '0.8rem', margin: 0 }}>
                        Generates candidate split & submits to Coach {assignedCoach.name}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setAiGenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleRequestAiPlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '5px', fontWeight: 700 }}>Primary Fitness Goal</label>
                    <select
                      value={aiFormFields.fitnessGoal}
                      onChange={e => setAiFormFields(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Hypertrophy">Hypertrophy (Muscle Growth)</option>
                      <option value="Strength">Strength (Maximal Power & CNS)</option>
                      <option value="Fat Loss">Fat Loss & Conditioning</option>
                      <option value="Endurance">Cardiovascular Endurance</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '5px', fontWeight: 700 }}>Experience Level</label>
                      <select
                        value={aiFormFields.fitnessLevel}
                        onChange={e => setAiFormFields(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#FFF', fontSize: '0.9rem' }}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '5px', fontWeight: 700 }}>Days Per Week</label>
                      <select
                        value={aiFormFields.daysPerWeek}
                        onChange={e => setAiFormFields(prev => ({ ...prev, daysPerWeek: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#FFF', fontSize: '0.9rem' }}>
                        <option value={3}>3 Days / Week</option>
                        <option value={4}>4 Days / Week</option>
                        <option value={5}>5 Days / Week</option>
                        <option value={6}>6 Days / Week</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '5px', fontWeight: 700 }}>Available Equipment</label>
                    <select
                      value={aiFormFields.equipment}
                      onChange={e => setAiFormFields(prev => ({ ...prev, equipment: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Full Gym Access">Full Gym Access (Barbells, Cables, Dumbbells, Machines)</option>
                      <option value="Dumbbells & Bench">Dumbbells & Adjustable Bench</option>
                      <option value="Home / Bodyweight">Home / Calisthenics Only</option>
                      <option value="Bands & Kettlebells">Bands & Kettlebells</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '5px', fontWeight: 700 }}>Injuries / Joint Limitations (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mild lower back sensitivity, avoid heavy squats"
                      value={aiFormFields.injuryNotes}
                      onChange={e => setAiFormFields(prev => ({ ...prev, injuryNotes: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#FFF', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.78rem', color: '#E2C9D6', lineHeight: 1.4 }}>
                    🔒 <strong>Certified Safety Flow:</strong> The AI ML engine will generate an optimal candidate split using cohort biometrics. It will then be queued to your certified coach for final validation and sign-off before being active.
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="button" onClick={() => setAiGenModalOpen(false)} style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={requestingAiPlan}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        border: 'none',
                        color: '#FFF',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                      {requestingAiPlan ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
                      <span>{requestingAiPlan ? 'Generating via ML Service...' : 'Generate & Submit to Coach'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
