import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpecialistClientChat from '../components/SpecialistClientChat';
import TrainerPasswordModal from '../components/TrainerPasswordModal';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Dumbbell, Award, CheckCircle2, AlertCircle, Plus, Trash2, Edit3, 
  Send, Activity, Sparkles, ChevronRight, Search, Flame, Clock, RefreshCw, 
  Shield, UserCheck, MessageSquare, Calendar, Zap, ShieldAlert, HeartHandshake,
  TrendingUp, Check, Info, ArrowRight, Layers, AlertTriangle, Stethoscope, HeartPulse,
  X, MessageCircle, KeyRound, Lock
} from 'lucide-react';
import { 
  fetchTrainerDashboardApi, 
  fetchTrainerAssignedUsersApi, 
  fetchTrainerUserDetailApi, 
  fetchTrainerWorkoutSplitApi,
  saveTrainerWorkoutSplitApi, 
  sendTrainerFeedbackApi,
  fetchTrainerPendingWorkoutPlansApi,
  approveTrainerWorkoutPlanApi,
  modifyTrainerWorkoutPlanApi,
  requestAiWorkoutPlanApi
} from '../services/api';
import { getClientThreadSummary } from '../services/chatService';


// Intelligent Health Condition Analysis & Safe Split Rules
const analyzeHealthConditions = (client) => {
  const medical = (client?.medicalConditions || '').toLowerCase();
  const goal = (client?.fitnessGoal || '').toLowerCase();
  const equipment = client?.workoutEquipment || 'Full Gym Access';
  const bmi = Number(client?.bmi || 23.5);

  let conditionCategory = 'Healthy / Standard Protocol';
  let riskLevel = 'LOW';
  let safetyAlerts = [];
  let contraindications = [];
  let recommendedModifications = [];
  let defaultSplitType = 'Push / Pull / Legs (PPL)';
  let targetIntensity = 'High';

  if (medical.includes('knee') || medical.includes('patell') || medical.includes('acl')) {
    conditionCategory = 'Knee Joint Sensitivity / Patellar Tendinopathy';
    riskLevel = 'MODERATE';
    safetyAlerts.push('Avoid deep axial knee flexion (>90 degrees under heavy spinal load) and high-impact plyometric jumping.');
    contraindications.push('Barbell Back Squats (heavy)', 'Jump Squats / Box Jumps', 'Walking Lunges on Hard Floors');
    recommendedModifications.push('Romanian Deadlifts (Hip-Hinge focus)', 'Glute Bridges & Hip Thrusts', 'Seated Hamstring Curls', 'Low-Impact Stationary Cycling Warm-Up');
    defaultSplitType = 'Joint-Safe Lower & Upper Push/Pull Split';
    targetIntensity = 'Moderate';
  } else if (medical.includes('back') || medical.includes('lumbar') || medical.includes('disc') || medical.includes('spine')) {
    conditionCategory = 'Lumbar Spine Sensitivity / Lower Back Care';
    riskLevel = 'MODERATE';
    safetyAlerts.push('Avoid unsupported spinal flexion and heavy compressive axial loads on lumbar vertebrae.');
    contraindications.push('Conventional Heavy Deadlifts from Floor', 'Good Mornings', 'Standing Barbell Overhead Press without Back Support');
    recommendedModifications.push('Chest-Supported Dumbbell Rows', 'Seated Dumbbell Overhead Press with 80° Back Rest', 'Farmer Carries with Braced Core', 'Bird-Dogs & Deadbugs for Core Anti-Rotation');
    defaultSplitType = 'Spine-Friendly Upper / Lower Power Split';
    targetIntensity = 'Moderate';
  } else if (medical.includes('shoulder') || medical.includes('rotator') || medical.includes('impingement')) {
    conditionCategory = 'Shoulder Impingement / Rotator Cuff Caution';
    riskLevel = 'MODERATE';
    safetyAlerts.push('Avoid flared elbow pressing and behind-the-neck movements that pinch the subacromial space.');
    contraindications.push('Behind-the-Neck Shoulder Press', 'Wide-Grip Barbell Bench Press', 'Upright Rows with Close Grip');
    recommendedModifications.push('Neutral-Grip Dumbbell Pressing', 'Incline Press (30° angle)', 'Face Pulls with External Rotation', 'Cable Lateral Raises in Scapular Plane');
    defaultSplitType = 'Deltoid-Protected Push / Pull / Legs Split';
    targetIntensity = 'Moderate';
  } else if (medical.includes('hypertension') || medical.includes('bp') || medical.includes('blood pressure') || medical.includes('heart')) {
    conditionCategory = 'Cardiovascular & Blood Pressure Consideration';
    riskLevel = 'HIGH';
    safetyAlerts.push('Avoid prolonged breath holding (Valsalva maneuver) during maximum lifts. Maintain continuous breathing cadence.');
    contraindications.push('1-Rep Max Heavy Lifting', 'Prolonged Inversion Drills', 'Rapid Posture Transitions');
    recommendedModifications.push('Moderate 10-12 Rep Ranges (RPE 6-7)', 'Extended 90-120s Rest Periods', 'Daily 20m Zone 2 Aerobic Base Conditioning', 'Diaphragmatic Breathing Post-Set');
    defaultSplitType = 'Cardio-Conditioned Hypertrophy Split';
    targetIntensity = 'Moderate';
  } else if (medical.includes('asthma') || medical.includes('respirat') || medical.includes('breath')) {
    conditionCategory = 'Respiratory / Exercise-Induced Bronchospasm';
    riskLevel = 'MODERATE';
    safetyAlerts.push('Ensure 10-15 minute gradual warm-up and avoid extreme cold-air sprint intervals without recovery pacing.');
    contraindications.push('Exhaustive HIIT Tabata sprints without gradual pacing');
    recommendedModifications.push('Extended Controlled Cardio Intervals', 'Strict 90s Recovery Windows', 'Indoor Warm-Up Protocols');
    defaultSplitType = 'Paced Athletic & Hypertrophy Split';
    targetIntensity = 'Moderate';
  } else if (goal.includes('loss') || goal.includes('fat') || bmi > 28) {
    conditionCategory = 'Metabolic Recomposition & Fat Loss Focus';
    riskLevel = 'LOW';
    safetyAlerts.push('Calibrated for high energy expenditure while preserving joint integrity and lean muscle mass.');
    contraindications.push('Excessive High-Impact Running on Hard Surfaces (use low-impact incline walk/rowing instead)');
    recommendedModifications.push('High-Density Circuit Work', '15m Incline Treadmill LISS', 'Compound Hypertrophy to Protect Basal Metabolic Rate');
    defaultSplitType = 'Cardio & HIIT Conditioning Split';
    targetIntensity = 'High';
  } else {
    conditionCategory = 'Healthy General Conditioning / Hypertrophy';
    riskLevel = 'LOW';
    safetyAlerts.push('No chronic physiological limitations detected. Follow standard progressive overload protocol.');
    contraindications.push('Uncontrolled 1RM without spotter');
    recommendedModifications.push('Standard Compound Progressive Overload (+2.5kg/week)', '3-Second Eccentric Muscle Cadence');
    defaultSplitType = 'Push / Pull / Legs (PPL)';
    targetIntensity = 'High';
  }

  return {
    conditionCategory,
    riskLevel,
    safetyAlerts,
    contraindications,
    recommendedModifications,
    defaultSplitType,
    targetIntensity
  };
};

// Health-Aware Split Presets
const generateHealthAwareWeeklySchedule = (client, healthAnalysis) => {
  const medical = (client?.medicalConditions || '').toLowerCase();
  const goal = (client?.fitnessGoal || '').toLowerCase();
  const isLoss = goal.includes('loss') || goal.includes('fat');
  const name = client?.fullName || 'Client';

  if (medical.includes('knee')) {
    return [
      { day: 'Monday', isRestDay: false, focus: 'Spine-Supported Upper Body Push (Chest & Shoulders)', targetMuscleGroups: 'Chest, Front Delts, Triceps', intensity: 'Moderate', targetDurationMinutes: 55, cardioGuidance: '10 min seated arm ergometer', coachNotes: 'Incline dumbbell press & seated cable flies. No leg drive pressure.' },
      { day: 'Tuesday', isRestDay: false, focus: 'Joint-Safe Posterior Chain & Glutes (Hip-Hinge Focus)', targetMuscleGroups: 'Glutes, Hamstrings, Upper Back', intensity: 'Moderate', targetDurationMinutes: 60, cardioGuidance: 'None / Pure posterior focus', coachNotes: 'Romanian deadlifts with soft knees. Hip thrusts & seated leg curls. Zero deep squats.' },
      { day: 'Wednesday', isRestDay: true, focus: 'Active Low-Impact Joint Mobility & Swimming/Cycle', targetMuscleGroups: 'Core & Hip Openers', intensity: 'Active Recovery', targetDurationMinutes: 30, cardioGuidance: '20 min low-resistance stationary bike', coachNotes: 'Foam roll IT band, quads, and calves. Keep resistance on bike light.' },
      { day: 'Thursday', isRestDay: false, focus: 'Upper Body Pull & Postural Strength (Back & Biceps)', targetMuscleGroups: 'Lats, Rhomboids, Rear Delts, Biceps', intensity: 'Moderate', targetDurationMinutes: 55, cardioGuidance: '10 min low-impact rowing', coachNotes: 'Chest-supported seated cable rows. Squeeze scapulae at peak.' },
      { day: 'Friday', isRestDay: false, focus: 'Low-Impact Functional Core & Accessory Hypertrophy', targetMuscleGroups: 'Core, Arms, Calves', intensity: 'Moderate', targetDurationMinutes: 50, cardioGuidance: '15 min incline treadmill walk (low speed)', coachNotes: 'Plank variations and seated dumbbell curls.' },
      { day: 'Saturday', isRestDay: true, focus: 'Knee Joint Decompression & Soft Tissue Recovery', targetMuscleGroups: 'Systemic Recovery', intensity: 'Active Recovery', targetDurationMinutes: 25, cardioGuidance: 'Light outdoor walk on flat grass/track', coachNotes: 'Stretch hamstrings and hip flexors. Ice knee if feeling warmth.' },
      { day: 'Sunday', isRestDay: true, focus: 'Complete Rest & Recovery', targetMuscleGroups: 'Full Rest', intensity: 'Rest', targetDurationMinutes: 0, cardioGuidance: 'Rest day', coachNotes: 'Prioritize 8+ hours sleep and systemic recovery.' }
    ];
  }

  if (medical.includes('back') || medical.includes('lumbar') || medical.includes('spine')) {
    return [
      { day: 'Monday', isRestDay: false, focus: 'Supported Upper Body Power (Chest & Arms)', targetMuscleGroups: 'Chest, Triceps, Anterior Delts', intensity: 'Moderate', targetDurationMinutes: 55, cardioGuidance: '5 min warm-up', coachNotes: 'Dumbbell bench press on flat bench with feet flat. Avoid arching lower spine.' },
      { day: 'Tuesday', isRestDay: false, focus: 'Spine-Safe Quad & Hamstring Hypertrophy', targetMuscleGroups: 'Quads, Hamstrings, Calves', intensity: 'Moderate', targetDurationMinutes: 55, cardioGuidance: 'None', coachNotes: 'Leg press (controlled depth), seated leg extensions & lying leg curls. Avoid standing barbell squats.' },
      { day: 'Wednesday', isRestDay: true, focus: 'Core Anti-Extension & Pelvic Stability', targetMuscleGroups: 'Deep Core, Transverse Abdominis', intensity: 'Active Recovery', targetDurationMinutes: 30, cardioGuidance: '20 min brisk flat walk', coachNotes: 'Bird-dogs, deadbugs, and side planks. Focus on pelvic neutral.' },
      { day: 'Thursday', isRestDay: false, focus: 'Chest-Supported Pull & Upper Back Stability', targetMuscleGroups: 'Lats, Mid-Traps, Biceps', intensity: 'Moderate', targetDurationMinutes: 55, cardioGuidance: '10 min elliptical', coachNotes: 'Incline bench dumbbell rows and wide lat pulldowns. Keep torso anchored.' },
      { day: 'Friday', isRestDay: false, focus: 'Unilateral Lower Body & Glute Strength', targetMuscleGroups: 'Glutes, Adductors, Core', intensity: 'Moderate', targetDurationMinutes: 50, cardioGuidance: '10 min stationary cycle', coachNotes: 'Step-ups on low box and cable pull-throughs.' },
      { day: 'Saturday', isRestDay: true, focus: 'Lumbar Decompression & Thoracic Mobility', targetMuscleGroups: 'Mobility & Recovery', intensity: 'Active Recovery', targetDurationMinutes: 25, cardioGuidance: 'Light walking', coachNotes: 'Cat-cow stretches, child pose, and gentle thoracic twists.' },
      { day: 'Sunday', isRestDay: true, focus: 'Complete Rest & Weekly Reset', targetMuscleGroups: 'Systemic Rest', intensity: 'Rest', targetDurationMinutes: 0, cardioGuidance: 'Rest day', coachNotes: 'Full rest and hydration.' }
    ];
  }

  if (isLoss) {
    return [
      { day: 'Monday', isRestDay: false, focus: 'Upper Body Metabolic Circuit & Core Power', targetMuscleGroups: 'Chest, Back, Arms, Core', intensity: 'High', targetDurationMinutes: 50, cardioGuidance: '15 min incline treadmill walk', coachNotes: 'Short 45s rest intervals to maintain elevated calorie expenditure.' },
      { day: 'Tuesday', isRestDay: false, focus: 'High Intensity Interval Cardio & Functional Stamina', targetMuscleGroups: 'Cardiovascular & Full Body', intensity: 'High', targetDurationMinutes: 45, cardioGuidance: '20 min HIIT sprints / bike', coachNotes: 'Target 80-85% peak heart rate during working intervals.' },
      { day: 'Wednesday', isRestDay: false, focus: 'Lower Body Strength & Plyometric Power', targetMuscleGroups: 'Quads, Glutes, Hamstrings', intensity: 'High', targetDurationMinutes: 50, cardioGuidance: '10 min stair climber', coachNotes: 'Goblet squats, walking lunges, and kettlebell swings.' },
      { day: 'Thursday', isRestDay: true, focus: 'Active Aerobic Base Recovery & Mobility', targetMuscleGroups: 'Full Body Mobility', intensity: 'Active Recovery', targetDurationMinutes: 30, cardioGuidance: '30 min Zone 2 walk or swim', coachNotes: 'Maintain conversational pace in Zone 2.' },
      { day: 'Friday', isRestDay: false, focus: 'Full Body Functional Conditioning & Core', targetMuscleGroups: 'Full Body Compound', intensity: 'High', targetDurationMinutes: 45, cardioGuidance: '15 min rowing machine', coachNotes: 'Dumbbell thrusters, battle ropes, and renegade rows.' },
      { day: 'Saturday', isRestDay: false, focus: 'Zone 2 Steady-State Cardio & Core Endurance', targetMuscleGroups: 'Aerobic Base & Abs', intensity: 'Moderate', targetDurationMinutes: 45, cardioGuidance: '40 min steady state cycle', coachNotes: 'Optimal fat oxidation zone.' },
      { day: 'Sunday', isRestDay: true, focus: 'Complete Rest & Systematic Recovery', targetMuscleGroups: 'Systemic Rest', intensity: 'Rest', targetDurationMinutes: 0, cardioGuidance: 'Rest day', coachNotes: 'Recharge for the upcoming week.' }
    ];
  }

  // Default Standard Push / Pull / Legs
  return [
    { day: 'Monday', isRestDay: false, focus: 'Chest, Shoulders & Triceps (Push Heavy)', targetMuscleGroups: 'Chest, Anterior Delts, Triceps', intensity: 'High', targetDurationMinutes: 60, cardioGuidance: '10 min incline walk warm-up', coachNotes: 'Heavy compound pressing focus. 90-120s rest between working sets.' },
    { day: 'Tuesday', isRestDay: false, focus: 'Back, Lats, Traps & Biceps (Pull Heavy)', targetMuscleGroups: 'Lats, Rhomboids, Rear Delts, Biceps', intensity: 'High', targetDurationMinutes: 60, cardioGuidance: 'None / Pure strength', coachNotes: 'Barbell rows and weighted chin-ups with full scapular retraction.' },
    { day: 'Wednesday', isRestDay: false, focus: 'Quads, Hamstrings & Calves (Legs & Core)', targetMuscleGroups: 'Quadriceps, Hamstrings, Glutes, Calves', intensity: 'High', targetDurationMinutes: 65, cardioGuidance: '5 min spin bike cool-down', coachNotes: 'Barbell back squats & Romanian deadlifts with neutral spine.' },
    { day: 'Thursday', isRestDay: true, focus: 'Active Biomechanical Recovery & Core Mobility', targetMuscleGroups: 'Core & Stabilizers', intensity: 'Active Recovery', targetDurationMinutes: 30, cardioGuidance: '20 min low-impact Zone 2 walk', coachNotes: 'Foam roll IT bands & hamstrings. Hydrate with 3.5L water.' },
    { day: 'Friday', isRestDay: false, focus: 'Upper Body Power & Hypertrophy Dynamic', targetMuscleGroups: 'Full Upper Body Complex', intensity: 'Moderate', targetDurationMinutes: 60, cardioGuidance: '10 min HIIT battle ropes', coachNotes: 'Focus on time-under-tension and pump-inducing accessory volume.' },
    { day: 'Saturday', isRestDay: false, focus: 'Lower Body Posterior & Core Stability', targetMuscleGroups: 'Hamstrings, Glutes, Abs', intensity: 'Moderate', targetDurationMinutes: 50, cardioGuidance: '15 min steady state incline walk', coachNotes: 'Bulgarian split squats & hanging leg raises.' },
    { day: 'Sunday', isRestDay: true, focus: 'Complete Rest & Systemic Recovery', targetMuscleGroups: 'Systemic Recovery', intensity: 'Rest', targetDurationMinutes: 0, cardioGuidance: 'Rest day', coachNotes: 'Hit 8-9 hours deep sleep.' }
  ];
};

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssignedUsers: 0,
    activeUsers: 0,
    publishedSplitsCount: 0,
    pendingReviewsCount: 0
  });

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatSummaries, setChatSummaries] = useState({});

  // Active Tab: 'split' | 'health' | 'chat'
  const [activeTab, setActiveTab] = useState('split');

  // Floating Quick Chat Modal state
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);

  // Security / Password Customization Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Detect if trainer needs mandatory first-time password customization
  const isInitialTrainerPassword = Boolean(
    user && 
    user.role === 'TRAINER' && 
    !user.hasChangedDefaultPassword && 
    !user.passwordLastChangedAt && 
    (user.mustChangePassword === true || user.isFirstLogin === true || user.password === 'password123')
  );

  useEffect(() => {
    if (isInitialTrainerPassword) {
      setShowPasswordModal(true);
    }
  }, [isInitialTrainerPassword]);

  // Workout Split Prescriber State
  const [splitTitle, setSplitTitle] = useState('Personalized Workout Split');
  const [splitType, setSplitType] = useState('Push / Pull / Legs (PPL)');
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [targetGoal, setTargetGoal] = useState('Hypertrophy & Muscle Gain');
  const [progressiveOverloadStrategy, setProgressiveOverloadStrategy] = useState('Add 2.5kg to primary compound lifts each week when RPE < 8; prioritize 3s eccentric tempo.');
  const [recoveryProtocols, setRecoveryProtocols] = useState('Ensure 8 hours of sleep, 10 min daily dynamic mobility post-session.');
  const [coachGuidelines, setCoachGuidelines] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [healthAnalysis, setHealthAnalysis] = useState(null);
  const [prescribingSplit, setPrescribingSplit] = useState(false);
  const [prescribeSuccess, setPrescribeSuccess] = useState('');

  // AI Workout Plan Review & Approval State
  const [pendingPlans, setPendingPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [approvingPlan, setApprovingPlan] = useState(false);
  const [planApprovalSuccess, setPlanApprovalSuccess] = useState('');
  const [coachPlanNotes, setCoachPlanNotes] = useState('');

  // Feedback State
  const [feedbackText, setFeedbackText] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  useEffect(() => {
    loadTrainerData();

    // Listen for real-time chat updates across tabs & local windows
    const handleChatUpdate = () => {
      refreshChatSummaries();
    };

    window.addEventListener('smartfit_chat_update', handleChatUpdate);
    return () => {
      window.removeEventListener('smartfit_chat_update', handleChatUpdate);
    };
  }, [user]);

  useEffect(() => {
    refreshChatSummaries();
  }, [assignedUsers]);

  const refreshChatSummaries = () => {
    const trainerEmail = user?.email || 'marcus@example.com';
    const map = {};
    assignedUsers.forEach(u => {
      map[u.email] = getClientThreadSummary(u.email, trainerEmail);
    });
    setChatSummaries(map);
  };

  const loadTrainerData = async () => {
    setLoading(true);
    const trainerEmail = user?.email || 'marcus@example.com';
    const [dashStats, usersList, plansList] = await Promise.all([
      fetchTrainerDashboardApi(trainerEmail),
      fetchTrainerAssignedUsersApi(trainerEmail),
      fetchTrainerPendingWorkoutPlansApi(trainerEmail)
    ]);

    if (dashStats) setStats(dashStats);
    if (plansList) {
      setPendingPlans(plansList);
      if (plansList.length > 0) setSelectedPlan(plansList[0]);
    }
    const STALE_LEGACY_ACCOUNTS = [
      'justin@gmail.com', 'denis@gmail.com', 'dennis@gmail.com',
      'abin@gmail.com', 'deric@gmail.com', 'aby@example.com',
      'alex@example.com', 'johndoe@example.com'
    ];
    const validUsers = (Array.isArray(usersList) ? usersList : [])
      .filter(u => !STALE_LEGACY_ACCOUNTS.includes((u.email || '').toLowerCase()));
    setAssignedUsers(validUsers);
    if (validUsers.length > 0) {
      const stillExists = selectedUser && validUsers.find(u => u.email.toLowerCase() === selectedUser.email.toLowerCase());
      if (stillExists) {
        setSelectedUser(stillExists);
      } else {
        selectClient(validUsers[0]);
      }
    } else {
      setSelectedUser(null);
      setSelectedUserDetail(null);
    }
    setLoading(false);
  };

  const handleGenerateAiPlanForClient = async (client) => {
    if (!client) return;
    setPrescribingSplit(true);
    const res = await requestAiWorkoutPlanApi({
      trainerEmail: user?.email || 'marcus@example.com'
    });
    setPrescribingSplit(false);
    if (res && res.plan) {
      setPendingPlans(prev => [res.plan, ...prev]);
      setSelectedPlan(res.plan);
      setActiveTab('ai_plans');
      setPlanApprovalSuccess(`New AI recommendation generated for ${client.fullName}! Review and customize below.`);
    }
  };

  const handleApproveAndPublishPlan = async (planId) => {
    if (!planId) return;
    setApprovingPlan(true);
    setPlanApprovalSuccess('');
    const res = await approveTrainerWorkoutPlanApi(planId, coachPlanNotes || 'Approved by certified trainer.');
    setApprovingPlan(false);
    if (res && res.plan) {
      setPlanApprovalSuccess(`Workout plan APPROVED & PUBLISHED for client ${res.plan.userEmail}! It is now active on their dashboard.`);
      setPendingPlans(prev => prev.map(p => p.id === planId ? res.plan : p));
      setSelectedPlan(res.plan);
      loadTrainerData();
    }
  };

  const handleModifyPlanExercise = async (planId, exIdx, field, value) => {
    if (!selectedPlan) return;
    const updatedExercises = [...(selectedPlan.exercises || [])];
    if (updatedExercises[exIdx]) {
      updatedExercises[exIdx] = { ...updatedExercises[exIdx], [field]: value };
      const updatedPlan = { ...selectedPlan, exercises: updatedExercises };
      setSelectedPlan(updatedPlan);
      await modifyTrainerWorkoutPlanApi(planId, updatedPlan);
    }
  };


  const selectClient = async (client, targetTab = null) => {
    setSelectedUser(client);
    setDetailLoading(true);
    setPrescribeSuccess('');
    setFeedbackSuccess('');

    if (targetTab) {
      setActiveTab(targetTab);
    }

    // Compute health analysis
    const analysis = analyzeHealthConditions(client);
    setHealthAnalysis(analysis);

    const [detail, splitRes] = await Promise.all([
      fetchTrainerUserDetailApi(client.email),
      fetchTrainerWorkoutSplitApi(client.email)
    ]);

    if (detail) {
      setSelectedUserDetail(detail);

      const activeSplit = splitRes || detail.activeSplit;
      if (activeSplit) {
        setSplitTitle(activeSplit.splitTitle || `${client.fullName}'s ${analysis.defaultSplitType}`);
        setSplitType(activeSplit.splitType || analysis.defaultSplitType);
        setDaysPerWeek(activeSplit.daysPerWeek || (analysis.riskLevel === 'HIGH' ? 4 : 5));
        setDurationWeeks(activeSplit.durationWeeks || 4);
        setDifficulty(activeSplit.difficulty || (analysis.riskLevel === 'HIGH' ? 'Beginner' : 'Intermediate'));
        setTargetGoal(activeSplit.targetGoal || client.fitnessGoal || 'Hypertrophy & Muscle Gain');
        setProgressiveOverloadStrategy(activeSplit.progressiveOverloadStrategy || 'Add 2.5kg per week on main lifts with strict posture.');
        setRecoveryProtocols(activeSplit.recoveryProtocols || '8 hours sleep, 10m soft tissue stretching.');
        setCoachGuidelines(activeSplit.coachGuidelines || activeSplit.notes || '');
        if (activeSplit.schedule && activeSplit.schedule.length === 7) {
          setWeeklySchedule(activeSplit.schedule);
        } else {
          setWeeklySchedule(generateHealthAwareWeeklySchedule(client, analysis));
        }
      } else {
        generateAiStartingSplit(client, analysis);
      }
    } else {
      generateAiStartingSplit(client, analysis);
    }
    setDetailLoading(false);
  };

  const generateAiStartingSplit = (client, analysisParam = null) => {
    const analysis = analysisParam || analyzeHealthConditions(client);
    setHealthAnalysis(analysis);

    const schedule = generateHealthAwareWeeklySchedule(client, analysis);
    setSplitTitle(`${client.fullName}'s ${analysis.defaultSplitType}`);
    setSplitType(analysis.defaultSplitType);
    setDaysPerWeek(analysis.riskLevel === 'HIGH' ? 4 : 5);
    setDurationWeeks(4);
    setDifficulty(analysis.riskLevel === 'HIGH' ? 'Beginner' : 'Intermediate');
    setTargetGoal(client.fitnessGoal || 'Hypertrophy & Muscle Gain');
    setProgressiveOverloadStrategy(
      analysis.riskLevel === 'HIGH' 
        ? 'Maintain moderate RPE 6-7. Focus on movement mastery and cadence before increasing weight.' 
        : 'Add 2.5kg to primary compound lifts each week when RPE < 8; prioritize 3s eccentric tempo.'
    );
    setRecoveryProtocols(
      analysis.safetyAlerts.length > 0 
        ? `Health Protocol: ${analysis.safetyAlerts[0]} Hydrate with 3.5L water & 8 hours sleep.` 
        : 'Ensure 8 hours of sleep, 10 min daily dynamic mobility post-session.'
    );
    setCoachGuidelines(
      `Calibrated for ${client.fullName} (${client.fitnessGoal || 'General Fitness'}) with health profile: [${analysis.conditionCategory}]. Equipment: ${client.workoutEquipment || 'Full Gym Access'}. Strictly enforce safe biomechanics.`
    );
    setWeeklySchedule(schedule);
  };

  const handleUpdateScheduleDay = (index, field, value) => {
    const updated = [...weeklySchedule];
    updated[index] = { ...updated[index], [field]: value };
    setWeeklySchedule(updated);
  };

  const handlePrescribeSplit = async () => {
    if (!selectedUser) return;
    setPrescribingSplit(true);
    setPrescribeSuccess('');

    const payload = {
      userEmail: selectedUser.email,
      userName: selectedUser.fullName,
      trainerEmail: user?.email || 'marcus@example.com',
      trainerName: user?.fullName || 'Coach Marcus Vance',
      splitTitle,
      splitType,
      daysPerWeek: Number(daysPerWeek),
      durationWeeks: Number(durationWeeks),
      difficulty,
      targetGoal,
      progressiveOverloadStrategy,
      recoveryProtocols,
      coachGuidelines,
      status: 'PUBLISHED',
      schedule: weeklySchedule
    };

    const res = await saveTrainerWorkoutSplitApi(payload);
    setPrescribingSplit(false);
    if (res) {
      setPrescribeSuccess(`Workout Split successfully prescribed & published for ${selectedUser.fullName}!`);
      loadTrainerData();
    }
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedUser) return;
    setSendingFeedback(true);
    setFeedbackSuccess('');

    const res = await sendTrainerFeedbackApi({
      userEmail: selectedUser.email,
      trainerEmail: user?.email || 'marcus@example.com',
      comments: feedbackText,
      rating: 5
    });

    setSendingFeedback(false);
    if (res) {
      setFeedbackSuccess('Coaching advice delivered to client!');
      setFeedbackText('');
    }
  };

  const filteredUsers = assignedUsers.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.fitnessGoal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Total unread messages across all clients
  const totalUnreadCount = Object.values(chatSummaries).reduce((acc, s) => acc + (s.unreadCount || 0), 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0B0F17', color: '#F1F5F9' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '110px', paddingBottom: '80px' }}>
        
        {/* Header Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(255,112,67,0.18) 0%, rgba(26,34,51,0.85) 100%)', 
          border: '1px solid rgba(255,112,67,0.35)', 
          borderRadius: '22px', 
          padding: '30px 35px', 
          marginBottom: '35px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: '#FF7043', color: '#FFF', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', letterSpacing: '0.6px' }}>
                TRAINER WORKSPACE
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>Health Analysis • AI Workout Split Prescriptions • Live Care</span>
            </div>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Welcome, Coach {user?.fullName || 'Marcus Vance'}
            </h1>
            <p style={{ color: '#CBD5E1', margin: '6px 0 0', fontSize: '1rem', maxWidth: '680px' }}>
              Analyze client health conditions, prescribe structured AI-generated workout splits, and consult in real-time to address all client training concerns.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('split')}
              className="btn" 
              style={{ 
                backgroundColor: activeTab === 'split' ? '#FF7043' : 'rgba(255,255,255,0.08)',
                color: '#FFF',
                border: activeTab === 'split' ? 'none' : '1px solid rgba(255,255,255,0.12)',
                padding: '11px 20px',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === 'split' ? '0 4px 18px rgba(255,112,67,0.4)' : 'none',
                transition: 'all 0.2s'
              }}>
              <Dumbbell size={18} />
              <span>🏋️ Prescribe Workout Split</span>
            </button>

            <button 
              onClick={() => setActiveTab('ai_plans')}
              className="btn" 
              style={{ 
                backgroundColor: activeTab === 'ai_plans' ? '#FF7043' : 'rgba(255,255,255,0.08)',
                color: '#FFF',
                border: activeTab === 'ai_plans' ? 'none' : '1px solid rgba(255,255,255,0.12)',
                padding: '11px 20px',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === 'ai_plans' ? '0 4px 18px rgba(255,112,67,0.4)' : 'none',
                transition: 'all 0.2s'
              }}>
              <Sparkles size={18} />
              <span>🤖 AI Workout Plans & Approval</span>
              {pendingPlans.length > 0 && (
                <span style={{ backgroundColor: '#10B981', color: '#FFF', fontSize: '0.72rem', fontWeight: 900, padding: '2px 7px', borderRadius: '8px' }}>
                  {pendingPlans.length}
                </span>
              )}
            </button>


            <button 
              onClick={() => setActiveTab('health')}
              className="btn" 
              style={{ 
                backgroundColor: activeTab === 'health' ? '#FF7043' : 'rgba(255,255,255,0.08)',
                color: '#FFF',
                border: activeTab === 'health' ? 'none' : '1px solid rgba(255,255,255,0.12)',
                padding: '11px 20px',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === 'health' ? '0 4px 18px rgba(255,112,67,0.4)' : 'none',
                transition: 'all 0.2s'
              }}>
              <Stethoscope size={18} />
              <span>🩺 Health Condition Analysis</span>
            </button>

            <button 
              onClick={() => setActiveTab('chat')}
              className="btn" 
              style={{ 
                backgroundColor: activeTab === 'chat' ? '#FF7043' : 'rgba(255,112,67,0.12)',
                color: activeTab === 'chat' ? '#FFF' : '#FFB8A1',
                border: activeTab === 'chat' ? 'none' : '1px solid rgba(255,112,67,0.35)',
                padding: '11px 20px',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === 'chat' ? '0 4px 18px rgba(255,112,67,0.4)' : 'none',
                position: 'relative',
                transition: 'all 0.2s'
              }}>
              <MessageSquare size={18} />
              <span>💬 Client Live Chat & Concerns</span>
              {totalUnreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#EF4444',
                  color: '#FFF',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {totalUnreadCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setShowPasswordModal(true)}
              className="btn" 
              style={{ 
                backgroundColor: 'rgba(255, 112, 67, 0.15)',
                color: '#FF7043',
                border: '1px solid rgba(255, 112, 67, 0.4)',
                padding: '11px 18px',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isInitialTrainerPassword ? '0 0 15px rgba(255, 112, 67, 0.4)' : 'none'
              }}>
              <KeyRound size={17} />
              <span>🔐 {isInitialTrainerPassword ? 'Customize Password (Required)' : 'Password & Security'}</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          <div style={{ background: 'rgba(18,24,38,0.85)', border: '1px solid rgba(255,255,255,0.08)', padding: '22px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Assigned Clients</span>
              <Users size={20} color="#FF7043" />
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFF' }}>{assignedUsers.length || stats.totalAssignedUsers}</div>
            <div style={{ color: '#4ADE80', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>● Active coaching profiles</div>
          </div>

          <div style={{ background: 'rgba(18,24,38,0.85)', border: '1px solid rgba(255,255,255,0.08)', padding: '22px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Prescribed Workout Splits</span>
              <Award size={20} color="#38BDF8" />
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFF' }}>{stats.publishedSplitsCount || assignedUsers.length}</div>
            <div style={{ color: '#38BDF8', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>Health-customized weekly splits</div>
          </div>

          <div style={{ background: 'rgba(18,24,38,0.85)', border: '1px solid rgba(255,255,255,0.08)', padding: '22px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Health Condition Screenings</span>
              <HeartPulse size={20} color="#FBBF24" />
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFF' }}>100% Screened</div>
            <div style={{ color: '#FBBF24', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>Injury prevention active</div>
          </div>

          <div style={{ background: 'rgba(18,24,38,0.85)', border: '1px solid rgba(255,255,255,0.08)', padding: '22px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Avg Client Adherence</span>
              <TrendingUp size={20} color="#A78BFA" />
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFF' }}>89.4%</div>
            <div style={{ color: '#A78BFA', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>Consistent routine logging</div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '25px', alignItems: 'start' }}>
          
          {/* Column 1: Client Selector List with Unread Badges & Message Previews */}
          <div style={{ background: 'rgba(18,24,38,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '22px', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFF' }}>My Assigned Clients</h3>
                <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Select client to inspect & prescribe</span>
              </div>
              <span style={{ backgroundColor: 'rgba(255,112,67,0.15)', color: '#FF7043', fontSize: '0.78rem', fontWeight: 800, padding: '3px 10px', borderRadius: '10px' }}>
                {filteredUsers.length} Active
              </span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Client List Items with Live Chat Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '560px', overflowY: 'auto' }}>
              {filteredUsers.map(client => {
                const isSelected = selectedUser?.email === client.email;
                const hasMedical = client.medicalConditions && client.medicalConditions !== 'None';
                const summary = chatSummaries[client.email] || {};

                return (
                  <div 
                    key={client.email}
                    onClick={() => selectClient(client)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      backgroundColor: isSelected ? 'rgba(255,112,67,0.14)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid #FF7043' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 15px rgba(255,112,67,0.2)' : 'none'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: isSelected ? '#FF7043' : '#FFF', fontSize: '0.95rem' }}>{client.fullName}</span>
                      
                      {summary.hasUnread ? (
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#EF4444', color: '#FFF', fontWeight: 800, animation: 'pulse 1.5s infinite' }}>
                          💬 New Msg
                        </span>
                      ) : hasMedical ? (
                        <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '6px', backgroundColor: 'rgba(248,113,113,0.15)', color: '#F87171', fontWeight: 700 }}>
                          ⚠️ Medical Note
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '6px', backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontWeight: 600 }}>
                          Active
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '6px' }}>{client.email}</div>
                    
                    {/* Last message preview */}
                    {summary.lastText && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: summary.hasUnread ? '#FFB8A1' : '#64748B', 
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: summary.hasUnread ? 600 : 400
                      }}>
                        {summary.isFromClient ? '👤 ' : '🏋️ '} {summary.lastText}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                        <span style={{ color: '#CBD5E1', backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '6px' }}>
                          🎯 {client.fitnessGoal || 'Hypertrophy'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectClient(client, 'chat');
                        }}
                        style={{
                          background: 'rgba(255, 112, 67, 0.15)',
                          border: '1px solid rgba(255, 112, 67, 0.3)',
                          borderRadius: '8px',
                          padding: '3px 8px',
                          color: '#FF7043',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <MessageSquare size={12} /> Chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Selected Client Biometric Summary Header Bar */}
            {selectedUser && (
              <div style={{ 
                background: 'rgba(18,24,38,0.92)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '20px', 
                padding: '22px 26px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #FF7043, #D84315)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 14px rgba(255,112,67,0.3)'
                  }}>
                    {selectedUser.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                        {selectedUser.fullName}
                      </h2>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>
                        {selectedUser.gender}, {selectedUser.age || 26} yrs
                      </span>
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '2px' }}>
                      Goal: <strong style={{ color: '#FF7043' }}>{selectedUser.fitnessGoal || 'Muscle Gain'}</strong> • Equipment: <strong>{selectedUser.workoutEquipment || 'Full Gym'}</strong> • Condition: <strong style={{ color: selectedUser.medicalConditions && selectedUser.medicalConditions !== 'None' ? '#F87171' : '#4ADE80' }}>{selectedUser.medicalConditions || 'None'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => generateAiStartingSplit(selectedUser)}
                    className="btn" 
                    style={{ 
                      backgroundColor: 'rgba(56,189,248,0.12)', 
                      color: '#38BDF8', 
                      border: '1px solid rgba(56,189,248,0.35)', 
                      padding: '8px 16px', 
                      borderRadius: '10px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}>
                    <Sparkles size={16} />
                    <span>✨ AI Split Generator</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab(activeTab === 'chat' ? 'split' : 'chat')}
                    className="btn" 
                    style={{ 
                      backgroundColor: activeTab === 'chat' ? 'rgba(255,255,255,0.1)' : '#FF7043', 
                      color: '#FFF', 
                      border: 'none', 
                      padding: '8px 18px', 
                      borderRadius: '10px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: activeTab === 'chat' ? 'none' : '0 4px 14px rgba(255,112,67,0.3)'
                    }}>
                    <MessageSquare size={16} />
                    <span>{activeTab === 'chat' ? 'View Split Prescriber' : '💬 Chat with Client'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: PRESCRIBE WORKOUT SPLIT (HEALTH-AWARE & AI-GENERATED) */}
            {activeTab === 'split' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* Health Condition Assessment Mini-Banner */}
                {healthAnalysis && (
                  <div style={{
                    background: healthAnalysis.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.08)' : (healthAnalysis.safetyAlerts.length > 0 ? 'rgba(251, 191, 36, 0.08)' : 'rgba(74, 222, 128, 0.08)'),
                    border: `1px solid ${healthAnalysis.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.3)' : (healthAnalysis.safetyAlerts.length > 0 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(74, 222, 128, 0.25)')}`,
                    borderRadius: '18px',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}>
                    <Stethoscope size={24} color={healthAnalysis.riskLevel === 'HIGH' ? '#EF4444' : (healthAnalysis.safetyAlerts.length > 0 ? '#FBBF24' : '#4ADE80')} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>
                          Client Health Condition Profile: {healthAnalysis.conditionCategory}
                        </span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 800, 
                          padding: '2px 8px', 
                          borderRadius: '8px', 
                          backgroundColor: healthAnalysis.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.2)' : (healthAnalysis.safetyAlerts.length > 0 ? 'rgba(251,191,36,0.2)' : 'rgba(74,222,128,0.2)'),
                          color: healthAnalysis.riskLevel === 'HIGH' ? '#EF4444' : (healthAnalysis.safetyAlerts.length > 0 ? '#FBBF24' : '#4ADE80')
                        }}>
                          Risk Level: {healthAnalysis.riskLevel}
                        </span>
                      </div>
                      <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: '4px 0 8px' }}>
                        {healthAnalysis.safetyAlerts[0] || 'Client is cleared for standard progressive overload and hypertrophy splits.'}
                      </p>
                      {healthAnalysis.contraindications.length > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#F87171' }}>
                          <strong>Contraindications to avoid:</strong> {healthAnalysis.contraindications.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Workout Split Prescriber Card */}
                <div style={{ background: 'rgba(18,24,38,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px', padding: '30px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={22} color="#FF7043" />
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                          Prescribe Structured Workout Split
                        </h3>
                      </div>
                      <p style={{ color: '#94A3B8', margin: '6px 0 0', fontSize: '0.9rem' }}>
                        Structured weekly workout splits tailored to <strong>{selectedUser?.fullName}</strong>'s analyzed health conditions and equipment availability.
                      </p>
                    </div>
                  </div>

                  {prescribeSuccess && (
                    <div style={{ backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ADE80', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
                      <CheckCircle2 size={20} />
                      {prescribeSuccess}
                    </div>
                  )}

                  {/* Split Meta Parameters Form */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '25px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>Split Title</label>
                      <input 
                        type="text" 
                        value={splitTitle} 
                        onChange={(e) => setSplitTitle(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>Split Architecture Type</label>
                      <select 
                        value={splitType} 
                        onChange={(e) => setSplitType(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1A2233', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}>
                        <option value="Push / Pull / Legs (PPL)">Push / Pull / Legs (PPL - 5/6 Days)</option>
                        <option value="Upper / Lower Split">Upper / Lower Strength Split (4 Days)</option>
                        <option value="Joint-Safe Lower & Upper Push/Pull Split">Joint-Safe Lower & Upper Push/Pull Split</option>
                        <option value="Spine-Friendly Upper / Lower Power Split">Spine-Friendly Upper / Lower Power Split</option>
                        <option value="Cardio & HIIT Conditioning Split">Cardio & HIIT Conditioning Split</option>
                        <option value="Full Body Split (3-Day)">Full Body Foundation (3 Days)</option>
                        <option value="Custom Athletic Split">Custom Athletic & Mobility Split</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>Days Per Week</label>
                      <select 
                        value={daysPerWeek} 
                        onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1A2233', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}>
                        <option value={3}>3 Training Days / Week</option>
                        <option value={4}>4 Training Days / Week</option>
                        <option value={5}>5 Training Days / Week</option>
                        <option value={6}>6 Training Days / Week</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>Target Difficulty & Goal</label>
                      <input 
                        type="text" 
                        value={targetGoal} 
                        onChange={(e) => setTargetGoal(e.target.value)}
                        placeholder="e.g. Hypertrophy & Muscle Gain"
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* 7-Day Weekly Workout Split Schedule */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅 7-Day Weekly Split Schedule (Monday – Sunday)</span>
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        Prescribe routine focus, target muscle groups, safe durations, and health cues for each day.
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {weeklySchedule.map((dayPlan, idx) => {
                        const isRest = dayPlan.isRestDay || dayPlan.intensity === 'Rest';
                        return (
                          <div 
                            key={dayPlan.day || idx}
                            style={{ 
                              background: isRest ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.02)', 
                              border: isRest ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.07)', 
                              padding: '16px 20px', 
                              borderRadius: '14px',
                              display: 'grid',
                              gridTemplateColumns: '120px 2.2fr 1.6fr 100px 130px',
                              gap: '14px',
                              alignItems: 'center'
                            }}>
                            
                            {/* Day Name & Rest Toggle */}
                            <div>
                              <div style={{ fontWeight: 800, color: isRest ? '#94A3B8' : '#FF7043', fontSize: '0.95rem' }}>
                                {dayPlan.day}
                              </div>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', cursor: 'pointer' }}>
                                <input 
                                  type="checkbox"
                                  checked={dayPlan.isRestDay || false}
                                  onChange={(e) => {
                                    handleUpdateScheduleDay(idx, 'isRestDay', e.target.checked);
                                    if (e.target.checked) {
                                      handleUpdateScheduleDay(idx, 'intensity', 'Rest');
                                    } else {
                                      handleUpdateScheduleDay(idx, 'intensity', 'High');
                                    }
                                  }}
                                />
                                Rest / Recovery
                              </label>
                            </div>

                            {/* Routine Focus */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '3px' }}>Daily Routine Focus</label>
                              <input 
                                type="text"
                                value={dayPlan.focus || ''}
                                onChange={(e) => handleUpdateScheduleDay(idx, 'focus', e.target.value)}
                                placeholder="e.g. Low-Impact Upper Push & Scapular Control"
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.09)',
                                  borderRadius: '8px',
                                  color: '#FFF',
                                  fontSize: '0.85rem',
                                  fontWeight: 600
                                }}
                              />
                            </div>

                            {/* Target Muscle Groups / Protocol */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '3px' }}>Target Muscle Groups / Safe Guidance</label>
                              <input 
                                type="text"
                                value={dayPlan.targetMuscleGroups || ''}
                                onChange={(e) => handleUpdateScheduleDay(idx, 'targetMuscleGroups', e.target.value)}
                                placeholder="e.g. Chest, Triceps (Neutral Dumbbell)"
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.09)',
                                  borderRadius: '8px',
                                  color: '#CBD5E1',
                                  fontSize: '0.82rem'
                                }}
                              />
                            </div>

                            {/* Duration (mins) */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '3px' }}>Duration</label>
                              <input 
                                type="number"
                                value={dayPlan.targetDurationMinutes || 0}
                                onChange={(e) => handleUpdateScheduleDay(idx, 'targetDurationMinutes', Number(e.target.value))}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.09)',
                                  borderRadius: '8px',
                                  color: '#FFF',
                                  fontSize: '0.85rem'
                                }}
                              />
                            </div>

                            {/* Intensity Level */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '3px' }}>Intensity</label>
                              <select 
                                value={dayPlan.intensity || 'High'}
                                onChange={(e) => handleUpdateScheduleDay(idx, 'intensity', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  backgroundColor: '#1A2233',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '8px',
                                  color: '#FFF',
                                  fontSize: '0.82rem'
                                }}>
                                <option value="High">🔥 High Intensity</option>
                                <option value="Moderate">⚡ Moderate</option>
                                <option value="Active Recovery">🌱 Active Recovery</option>
                                <option value="Rest">💤 Complete Rest</option>
                              </select>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Coach Progression & Health Directives */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '25px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>
                        📈 Progressive Overload & Safe Cadence Strategy
                      </label>
                      <textarea 
                        rows={3}
                        value={progressiveOverloadStrategy}
                        onChange={(e) => setProgressiveOverloadStrategy(e.target.value)}
                        placeholder="e.g. Add 2.5kg to primary compound lifts each week when RPE < 8; prioritize 3s eccentric tempo."
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 700 }}>
                        🩺 Health Precautions & Recovery Guidelines
                      </label>
                      <textarea 
                        rows={3}
                        value={coachGuidelines}
                        onChange={(e) => setCoachGuidelines(e.target.value)}
                        placeholder="e.g. Foam roll thoracic spine, 10 min daily hip mobility, minimum 8 hours sleep, 3.5L hydration."
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  {/* Prescribe Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                      Prescription automatically syncs to client's dashboard
                    </span>
                    <button 
                      onClick={handlePrescribeSplit}
                      disabled={prescribingSplit}
                      className="btn"
                      style={{ 
                        backgroundColor: '#FF7043', 
                        color: '#FFF', 
                        border: 'none', 
                        padding: '13px 32px', 
                        borderRadius: '14px', 
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 20px rgba(255,112,67,0.35)',
                        cursor: prescribingSplit ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                      <CheckCircle2 size={18} />
                      {prescribingSplit ? 'Prescribing Split...' : `Prescribe Split to ${selectedUser ? selectedUser.fullName : 'Client'}`}
                    </button>
                  </div>

                </div>

                {/* Direct Coaching Notes Card */}
                <div style={{ background: 'rgba(18,24,38,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Send size={18} color="#FF7043" />
                    Quick Coaching Note / Feedback
                  </h3>
                  <p style={{ color: '#94A3B8', margin: '0 0 14px', fontSize: '0.85rem' }}>
                    Send an instant feedback note to {selectedUser?.fullName} regarding their health condition or workout execution.
                  </p>

                  {feedbackSuccess && (
                    <div style={{ backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ADE80', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
                      {feedbackSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSendFeedback}>
                    <textarea 
                      rows={2}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder={`Write a coaching tip for ${selectedUser?.fullName}... (e.g. Ensure 2 minutes rest on heavy squats; stop immediately if you feel joint pain.)`}
                      style={{ width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF', fontSize: '0.88rem', marginBottom: '10px' }}
                    />
                    <button 
                      type="submit"
                      disabled={sendingFeedback}
                      className="btn"
                      style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFF', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {sendingFeedback ? 'Sending...' : 'Send Coaching Note'}
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 2: HEALTH CONDITION ANALYSIS & INJURY PREVENTION */}
            {activeTab === 'health' && selectedUser && healthAnalysis && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                <div style={{ background: 'rgba(18,24,38,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px', padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Stethoscope size={22} color="#FF7043" />
                        Health & Biomechanical Condition Analysis: {selectedUser.fullName}
                      </h3>
                      <p style={{ color: '#94A3B8', margin: '4px 0 0', fontSize: '0.85rem' }}>
                        Automated AI clinical screening for injury contraindications and workout adjustments.
                      </p>
                    </div>

                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 800, 
                      padding: '4px 12px', 
                      borderRadius: '10px', 
                      backgroundColor: healthAnalysis.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.2)',
                      color: healthAnalysis.riskLevel === 'HIGH' ? '#EF4444' : '#4ADE80'
                    }}>
                      Risk Level: {healthAnalysis.riskLevel}
                    </span>
                  </div>

                  {/* Biometrics Badges */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Medical Limitations</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedUser.medicalConditions && selectedUser.medicalConditions !== 'None' ? '#F87171' : '#4ADE80', marginTop: '2px' }}>
                        {selectedUser.medicalConditions || 'None / Healthy'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>BMI Metric</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>{selectedUser.bmi || 23.5}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{selectedUser.bmiCategory || 'Normal'}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Fitness Goal</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#A78BFA', marginTop: '3px' }}>{selectedUser.fitnessGoal || 'Hypertrophy'}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Equipment Access</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FCD34D', marginTop: '3px' }}>{selectedUser.workoutEquipment || 'Full Gym'}</div>
                    </div>
                  </div>

                  {/* Contraindications vs Safe Recommendations */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '20px', borderRadius: '16px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F87171', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={18} /> Contraindicated Exercises & Movements
                      </h4>
                      {healthAnalysis.contraindications.length === 0 ? (
                        <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>No high-risk contraindications detected.</p>
                      ) : (
                        <ul style={{ paddingLeft: '18px', margin: 0, color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.6 }}>
                          {healthAnalysis.contraindications.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                              <strong style={{ color: '#FCA5A5' }}>{item}</strong>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div style={{ background: 'rgba(74, 222, 128, 0.05)', border: '1px solid rgba(74, 222, 128, 0.25)', padding: '20px', borderRadius: '16px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4ADE80', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={18} /> Safe Recommended Substitutions
                      </h4>
                      <ul style={{ paddingLeft: '18px', margin: 0, color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        {healthAnalysis.recommendedModifications.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#86EFAC' }}>{item}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action to prescribe based on health */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      onClick={() => {
                        generateAiStartingSplit(selectedUser, healthAnalysis);
                        setActiveTab('split');
                      }}
                      className="btn"
                      style={{
                        backgroundColor: '#FF7043',
                        color: '#FFF',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                      <Sparkles size={16} />
                      <span>Apply Health-Calibrated Split to Prescriber ➔</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: CLIENT LIVE CHAT & CONCERNS DESK */}
            {activeTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SpecialistClientChat
                  specialistUser={user}
                  client={selectedUser}
                  specialistRole="TRAINER"
                />
              </div>
            )}

            {/* TAB 4: AI WORKOUT PLAN REVIEW & APPROVAL SYSTEM */}
            {activeTab === 'ai_plans' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Status Alert Banner */}
                {planApprovalSuccess && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34D399',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: 700
                  }}>
                    <CheckCircle2 size={20} />
                    <span>{planApprovalSuccess}</span>
                  </div>
                )}

                {/* Plan Overview Card */}
                <div style={{
                  background: 'rgba(18, 24, 38, 0.95)',
                  border: '1px solid rgba(255, 112, 67, 0.3)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ background: 'rgba(255, 112, 67, 0.2)', color: '#FF7043', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                          AI RECOMMENDATION STAGING
                        </span>
                        <span style={{
                          background: selectedPlan?.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                          color: selectedPlan?.status === 'APPROVED' ? '#34D399' : '#FBBF24',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          STATUS: {selectedPlan?.status || 'PENDING_TRAINER_REVIEW'}
                        </span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
                        {selectedPlan?.planTitle || 'AI-Generated Workout Routine'}
                      </h3>
                      <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.84rem' }}>
                        Client: <strong style={{ color: '#FFF' }}>{selectedUser?.fullName || selectedPlan?.userEmail}</strong> • AI Match Confidence: <strong style={{ color: '#38BDF8' }}>{selectedPlan?.aiConfidence || '91.2%'}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleGenerateAiPlanForClient(selectedUser)}
                        disabled={prescribingSplit}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: '#38BDF8',
                          padding: '10px 18px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                        <RefreshCw size={15} />
                        <span>Re-query AI Model</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveAndPublishPlan(selectedPlan?.id || 'current')}
                        disabled={approvingPlan || selectedPlan?.status === 'APPROVED'}
                        style={{
                          background: selectedPlan?.status === 'APPROVED' 
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          border: 'none',
                          color: '#FFF',
                          padding: '10px 22px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          cursor: selectedPlan?.status === 'APPROVED' ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: selectedPlan?.status === 'APPROVED' ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)'
                        }}>
                        <CheckCircle2 size={16} />
                        <span>{selectedPlan?.status === 'APPROVED' ? '✓ Plan Approved & Published' : 'Approve & Publish to Client'}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Rationale Box */}
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '20px',
                    fontSize: '0.84rem',
                    color: '#BAE6FD',
                    lineHeight: '1.45'
                  }}>
                    <strong>🤖 ML Recommendation Rationale:</strong> {selectedPlan?.aiReason || 'Calibrated based on user biometrics, target fitness goal, and joint contraindication screening.'}
                  </div>

                  {/* Exercise Candidate Table with Inline Editing */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={16} color="#FF7043" />
                      <span>Prescribed Exercises (Trainer Load & Volume Customization)</span>
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(selectedPlan?.exercises || [
                        { exerciseId: 'ex-leg-press-45', exerciseName: '45-Degree Leg Press', targetMuscle: 'Quadriceps & Glutes', sets: 4, reps: '10', restSeconds: 90, intensityRpe: 8.0, recommendedAngle: 'side', confidence: 0.93 },
                        { exerciseId: 'ex-bench-barbell', exerciseName: 'Barbell Bench Press', targetMuscle: 'Chest & Triceps', sets: 4, reps: '10', restSeconds: 90, intensityRpe: 8.0, recommendedAngle: 'side', confidence: 0.92 },
                        { exerciseId: 'ex-pushup-standard', exerciseName: 'Standard Push-Up', targetMuscle: 'Chest & Core', sets: 3, reps: '15', restSeconds: 60, intensityRpe: 7.0, recommendedAngle: 'side', confidence: 0.90 },
                        { exerciseId: 'ex-bicep-curl', exerciseName: 'Bicep Dumbbell / Barbell Curl', targetMuscle: 'Biceps Brachii', sets: 3, reps: '12', restSeconds: 60, intensityRpe: 7.5, recommendedAngle: 'front', confidence: 0.91 },
                        { exerciseId: 'ex-overhead-press', exerciseName: 'Overhead Shoulder Press', targetMuscle: 'Anterior Deltoids', sets: 3, reps: '10', restSeconds: 75, intensityRpe: 8.0, recommendedAngle: 'front', confidence: 0.89 }
                      ]).map((ex, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '14px',
                          padding: '14px 18px',
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                          gap: '12px',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.92rem' }}>
                              {idx + 1}. {ex.exerciseName}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                              {ex.targetMuscle} • Recommended Angle: <strong style={{ color: '#38BDF8' }}>{ex.recommendedAngle || 'side'}</strong>
                            </div>
                          </div>

                          {/* Sets Input */}
                          <div>
                            <label style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Sets</label>
                            <input
                              type="number"
                              value={ex.sets || 4}
                              onChange={e => handleModifyPlanExercise(selectedPlan?.id, idx, 'sets', parseInt(e.target.value) || 3)}
                              style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', padding: '6px 8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          {/* Reps Input */}
                          <div>
                            <label style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Reps</label>
                            <input
                              type="text"
                              value={ex.reps || '10'}
                              onChange={e => handleModifyPlanExercise(selectedPlan?.id, idx, 'reps', e.target.value)}
                              style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', padding: '6px 8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          {/* Rest Seconds */}
                          <div>
                            <label style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Rest (Sec)</label>
                            <input
                              type="number"
                              value={ex.restSeconds || 60}
                              onChange={e => handleModifyPlanExercise(selectedPlan?.id, idx, 'restSeconds', parseInt(e.target.value) || 60)}
                              style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', padding: '6px 8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          {/* Target RPE */}
                          <div>
                            <label style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>RPE (1-10)</label>
                            <input
                              type="number"
                              step="0.5"
                              value={ex.intensityRpe || 8.0}
                              onChange={e => handleModifyPlanExercise(selectedPlan?.id, idx, 'intensityRpe', parseFloat(e.target.value) || 8.0)}
                              style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', padding: '6px 8px', fontSize: '0.85rem' }}
                            />
                          </div>

                          {/* Match Confidence Badge */}
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                              {Math.round((ex.confidence || 0.9) * 100)}% Match
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coach Safety Notes & Prescription Form */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.84rem', color: '#CBD5E1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Coach Prescription Directives & Safety Notes:
                    </label>
                    <textarea
                      rows={3}
                      value={coachPlanNotes}
                      onChange={e => setCoachPlanNotes(e.target.value)}
                      placeholder="Add specific instructions (e.g. Ensure 3-second eccentric tempo, maintain neutral spine, avoid flared elbows)..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

              </div>
            )}


          </div>

        </div>

      </main>

      {/* Floating Quick-Chat Dock on Bottom Right (Always Accessible) */}
      {activeTab !== 'chat' && selectedUser && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
          {floatingChatOpen ? (
            <div style={{
              width: '420px',
              maxWidth: '92vw',
              height: '560px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 112, 67, 0.3)',
              background: '#0B0F17',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #FF7043, #D84315)',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#FFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} />
                  <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>Live Desk: {selectedUser.fullName}</span>
                </div>
                <button 
                  onClick={() => setFloatingChatOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <SpecialistClientChat
                  specialistUser={user}
                  client={selectedUser}
                  specialistRole="TRAINER"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setFloatingChatOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #FF7043, #D84315)',
                color: '#FFF',
                border: 'none',
                padding: '14px 22px',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(255, 112, 67, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                position: 'relative'
              }}
            >
              <MessageCircle size={20} />
              <span>Quick Chat ({selectedUser.fullName.split(' ')[0]})</span>
              {chatSummaries[selectedUser.email]?.hasUnread && (
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF',
                  position: 'absolute',
                  top: '8px',
                  right: '12px'
                }} />
              )}
            </button>
          )}
        </div>
      )}

      {/* Mandatory / Voluntary Trainer Password Customization Modal */}
      <TrainerPasswordModal 
        isOpen={showPasswordModal}
        isMandatory={isInitialTrainerPassword}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => setShowPasswordModal(false)}
      />

      <Footer />
    </div>
  );
}
