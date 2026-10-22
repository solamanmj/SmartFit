import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  BarChart3, TrendingUp, TrendingDown, Award, Flame, Dumbbell, 
  Utensils, CheckCircle2, MessageSquare, Plus, Sparkles, Droplets, 
  User, Calendar, HeartPulse, Scale, ShieldCheck, PieChart, Activity,
  ArrowRight, ArrowUpRight, Zap, Target, Check, RefreshCw, X, Download, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Progress() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'all-gains' | 'biometrics'
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeight, setNewWeight] = useState(74);
  const [newBodyFat, setNewBodyFat] = useState(17.5);
  const [acknowledgedFeedback, setAcknowledgedFeedback] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const userEmail = (user?.email || 'default_user').trim().toLowerCase();

  // Load workout & nutrition progression states from user-scoped localStorage
  const loadWorkoutProgress = (email) => {
    try {
      const completedMap = JSON.parse(localStorage.getItem(`smartfit_${email}_completed_days_map`) || '{}');
      const activeDay = parseInt(localStorage.getItem(`smartfit_${email}_workout_active_day`) || '1', 10);
      const completedCount = Object.keys(completedMap).filter(k => completedMap[k]).length;
      return {
        completedDays: completedCount,
        activeDay,
        isCompletedToday: !!completedMap[activeDay] || completedCount > 0,
        activeSplit: 'Chest, Shoulders & Triceps Hypertrophy',
        caloriesBurned: completedCount > 0 ? 520 : 0,
        durationMins: completedCount > 0 ? 45 : 0,
        totalVolumeKg: completedCount * 1250,
        setsDone: completedCount > 0 ? 17 : 0,
        totalSets: 17,
        rpeScore: '8.5 / 10'
      };
    } catch (e) {
      return {
        completedDays: 0,
        activeDay: 1,
        isCompletedToday: false,
        activeSplit: 'Chest, Shoulders & Triceps Hypertrophy',
        caloriesBurned: 0,
        durationMins: 0,
        totalVolumeKg: 0,
        setsDone: 0,
        totalSets: 17,
        rpeScore: '8.5 / 10'
      };
    }
  };

  const loadNutritionProgress = (email) => {
    try {
      const completedNutMap = JSON.parse(localStorage.getItem(`smartfit_${email}_nutrition_completed_days_map`) || '{}');
      const activeNutDay = parseInt(localStorage.getItem(`smartfit_${email}_nutrition_active_day`) || '1', 10);
      const mealsDoneMap = JSON.parse(localStorage.getItem(`smartfit_${email}_meals_day_${activeNutDay}`) || '{}');
      const waterMl = parseInt(localStorage.getItem(`smartfit_${email}_water_day_${activeNutDay}`) || '2500', 10);
      const completedNutCount = Object.keys(completedNutMap).filter(k => completedNutMap[k]).length;
      const mealsEaten = Object.values(mealsDoneMap).filter(Boolean).length;

      return {
        completedDays: completedNutCount,
        activeDay: activeNutDay,
        mealsEaten: completedNutCount > 0 ? (mealsEaten || 5) : 0,
        totalMeals: 5,
        caloriesConsumed: completedNutCount > 0 ? 2380 : 0,
        targetCalories: 2450,
        proteinGrams: completedNutCount > 0 ? 162 : 0,
        targetProtein: 165,
        carbGrams: completedNutCount > 0 ? 254 : 0,
        targetCarbs: 260,
        fatGrams: completedNutCount > 0 ? 61 : 0,
        targetFats: 65,
        waterMl: waterMl || 2500,
        targetWaterMl: 3500,
        adherenceRate: completedNutCount > 0 ? 98 : 0
      };
    } catch (e) {
      return {
        completedDays: 0,
        activeDay: 1,
        mealsEaten: 0,
        totalMeals: 5,
        caloriesConsumed: 0,
        targetCalories: 2450,
        proteinGrams: 0,
        targetProtein: 165,
        carbGrams: 0,
        targetCarbs: 260,
        fatGrams: 0,
        targetFats: 65,
        waterMl: 2500,
        targetWaterMl: 3500,
        adherenceRate: 0
      };
    }
  };

  const [workoutProgress, setWorkoutProgress] = useState(() => loadWorkoutProgress(userEmail));
  const [nutritionProgress, setNutritionProgress] = useState(() => loadNutritionProgress(userEmail));

  useEffect(() => {
    const email = (user?.email || 'default_user').trim().toLowerCase();
    setWorkoutProgress(loadWorkoutProgress(email));
    setNutritionProgress(loadNutritionProgress(email));
  }, [user?.email]);

  const [weightLogs, setWeightLogs] = useState([
    { week: 'Week 1 (Baseline)', weight: 78.0, bodyFat: 21.5, muscleMass: 32.4, status: 'Initial Baseline' },
    { week: 'Week 3', weight: 76.8, bodyFat: 20.2, muscleMass: 33.1, status: 'Fat Loss & Adapt' },
    { week: 'Week 5', weight: 75.4, bodyFat: 18.9, muscleMass: 34.0, status: 'Lean Hypertrophy' },
    { week: 'Week 8 (Current)', weight: 74.0, bodyFat: 17.5, muscleMass: 35.1, status: 'Peak Body Recomp' }
  ]);

  // Comprehensive Strength & Physical Gains Registry
  const strengthGains = [
    { exercise: 'Barbell Incline Bench Press', start: '65.0 kg', current: '82.5 kg', gain: '+17.5 kg', percent: '+26.9%', target: 'Upper Pecs & Triceps' },
    { exercise: 'Conventional Barbell Deadlift', start: '90.0 kg', current: '125.0 kg', gain: '+35.0 kg', percent: '+38.8%', target: 'Posterior Chain & Lats' },
    { exercise: '45-Degree Sled Leg Press', start: '140.0 kg', current: '195.0 kg', gain: '+55.0 kg', percent: '+39.3%', target: 'Quads & Glute Max' },
    { exercise: 'Seated DB Overhead Press', start: '18.0 kg', current: '26.0 kg', gain: '+8.0 kg', percent: '+44.4%', target: 'Anterior & Side Delts' },
    { exercise: 'Incline Dumbbell Hammer Curls', start: '12.0 kg', current: '18.0 kg', gain: '+6.0 kg', percent: '+50.0%', target: 'Brachialis & Biceps' },
    { exercise: 'Bodyweight Strict Pull-ups', start: '4 Reps', current: '14 Reps', gain: '+10 Reps', percent: '+250.0%', target: 'Lat Width & Grip' }
  ];

  const bodyCompGains = [
    { metric: 'Lean Skeletal Muscle', start: '32.4 kg', current: '35.1 kg', change: '+2.7 kg', isPositive: true, subtext: 'Hypertrophic Protein Retention' },
    { metric: 'Total Body Fat', start: '21.5 %', current: '17.5 %', change: '-4.0 %', isPositive: true, subtext: 'Subcutaneous Adipose Loss' },
    { metric: 'Resting Heart Rate', start: '72 bpm', current: '58 bpm', change: '-14 bpm', isPositive: true, subtext: 'Enhanced Parasympathetic Tone' },
    { metric: 'Estimated VO2 Max', start: '38.5 ml/kg', current: '45.2 ml/kg', change: '+6.7 ml/kg', isPositive: true, subtext: 'Aerobic & Mitochondrial Output' }
  ];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleLogWeightSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    const bf = parseFloat(newBodyFat);
    if (!w || w <= 0) return;

    const newEntry = {
      week: `Week ${weightLogs.length + 1} (Logged)`,
      weight: w,
      bodyFat: bf || 17.5,
      muscleMass: 35.3,
      status: 'Live Check-in Verified'
    };

    setWeightLogs([...weightLogs, newEntry]);
    setShowLogModal(false);
    showToast(`Progress weigh-in recorded: ${w} kg (${bf}% body fat)`);
  };

  const handleAcknowledge = (id) => {
    setAcknowledgedFeedback(prev => ({
      ...prev,
      [id]: true
    }));
    showToast('Coach directive acknowledged and recorded in your athlete record.');
  };

  const trainerName = user?.assignedTrainer?.name || 'Coach Marcus Vance';
  const dietitianName = user?.assignedNutritionist?.name || 'Sruthy Varghese (M.Sc)';

  // Energy balance calculation
  const bmrEst = 1750;
  const activeBurn = workoutProgress.caloriesBurned || 520;
  const totalBurn = bmrEst + activeBurn + 400; // BMR + Workout + TEF/NEAT
  const netEnergyDifferential = nutritionProgress.caloriesConsumed - totalBurn;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#12030F', color: '#FFFFFF' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

          {/* Toast Notification Alert */}
          {toastMsg && (
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.18)', border: '1px solid #34D399', color: '#34D399', padding: '12px 18px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(52, 211, 153, 0.25)' }}>
              <CheckCircle2 size={18} /> {toastMsg}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. EXECUTIVE PROGRESS & TRANSFORMATION HERO HEADER */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.45) 0%, rgba(29, 7, 24, 0.95) 100%)',
            border: '1px solid rgba(255, 158, 125, 0.25)',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '26px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--peach-primary)', background: 'rgba(255, 158, 125, 0.15)', border: '1px solid rgba(255, 158, 125, 0.35)', padding: '2px 9px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> CLINICAL TRANSFORMATION SUITE
                </span>
                <span style={{ fontSize: '0.74rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.12)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  96.5% Overall Adherence
                </span>
              </div>

              <h1 style={{ 
                fontSize: '2.3rem', 
                fontWeight: 900, 
                margin: '4px 0', 
                background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                Progress & Performance Gains Report
              </h1>

              <p style={{ color: '#E2C9D6', fontSize: '0.88rem', margin: 0 }}>
                Synthesizing daily workout load volume, macro & protein assimilation, and periodized strength hypertrophy.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowLogModal(true)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38BDF8',
                  color: '#38BDF8',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Scale size={15} />
                <span>Log Weigh-In</span>
              </button>

              <button
                onClick={() => showToast('Official 30-Day Transformation Report PDF generated & downloaded.')}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
                  border: 'none',
                  color: '#12030F',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Download size={15} />
                <span>Export Report PDF</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. PROGRESS VIEW SWITCHER TABS */}
          {/* ========================================================================= */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px',
            background: 'rgba(29, 7, 24, 0.85)',
            border: '1px solid rgba(255, 158, 125, 0.18)',
            padding: '6px',
            borderRadius: '16px',
            marginBottom: '26px'
          }}>
            {[
              { id: 'daily', label: '🔥 Daily Intake & Workout Synthesis', icon: Flame },
              { id: 'all-gains', label: '💪 What All Gains Gained Matrix', icon: Dumbbell },
              { id: 'biometrics', label: '📈 8-Week Biometric Transformation', icon: BarChart3 }
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid var(--peach-primary)' : '1px solid transparent',
                    background: isSelected ? 'linear-gradient(135deg, rgba(255,158,125,0.22) 0%, rgba(82,21,65,0.6) 100%)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#B392A5',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease'
                  }}>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: DAILY INTAKE & WORKOUT SYNTHESIS REPORT */}
          {/* ========================================================================= */}
          {activeTab === 'daily' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Daily Energy & Output Master Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                
                {/* WORKOUT OUTPUT CARD */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12) 0%, rgba(35, 8, 28, 0.9) 100%)',
                  border: '1px solid rgba(255, 112, 67, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FF7043', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Dumbbell size={20} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#FFB8A1', fontWeight: 800, textTransform: 'uppercase' }}>TRAINER LOGGED SESSION</span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: '2px 0 0 0' }}>
                          Workout Energy & Volume
                        </h3>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#4ADE80', fontWeight: 800, background: 'rgba(74,222,128,0.12)', padding: '3px 9px', borderRadius: '8px' }}>
                      ✓ Verified Complete
                    </span>
                  </div>

                  <p style={{ color: '#E2C9D6', fontSize: '0.86rem', margin: '0 0 16px 0' }}>
                    Focus: <strong>{workoutProgress.activeSplit}</strong> (Prescribed by {trainerName}).
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Active Burn</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF7043' }}>{workoutProgress.caloriesBurned} kcal</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Volume Lifted</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>{(workoutProgress.totalVolumeKg / 1000).toFixed(1)}k kg</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Sets Finished</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>{workoutProgress.setsDone}/{workoutProgress.totalSets}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #FF7043' }}>
                    <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>Neuromuscular RPE Target: <strong>{workoutProgress.rpeScore}</strong></span>
                    <button onClick={() => navigate('/workout')} style={{ background: 'none', border: 'none', color: 'var(--peach-primary)', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Workout Desk</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* NUTRITION INTAKE CARD */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 24, 28, 0.9) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#10B981', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Utensils size={20} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#A7F3D0', fontWeight: 800, textTransform: 'uppercase' }}>DIETITIAN MACRO ASSIMILATION</span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: '2px 0 0 0' }}>
                          Nutrition Consumption
                        </h3>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 800, background: 'rgba(52,211,153,0.12)', padding: '3px 9px', borderRadius: '8px' }}>
                      {nutritionProgress.adherenceRate}% Adherence
                    </span>
                  </div>

                  <p style={{ color: '#E2C9D6', fontSize: '0.86rem', margin: '0 0 16px 0' }}>
                    All <strong>{nutritionProgress.mealsEaten} of {nutritionProgress.totalMeals} Prescribed Meals</strong> consumed (Prescribed by {dietitianName}).
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Calories Consumed</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80' }}>{nutritionProgress.caloriesConsumed} kcal</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Protein Ingested</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>{nutritionProgress.proteinGrams}g</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Hydration Status</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#67E8F9' }}>{(nutritionProgress.waterMl / 1000).toFixed(1)}L</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #10B981' }}>
                    <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>Protein Bioavailability: <strong>2.2g / kg Mass</strong></span>
                    <button onClick={() => navigate('/nutrition')} style={{ background: 'none', border: 'none', color: '#34D399', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Nutrition Desk</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>

              {/* DETAILED DAILY MACRONUTRIENT CONSUMPTION SPECTRUM */}
              <div style={{
                background: 'rgba(29, 7, 24, 0.75)',
                border: '1px solid rgba(255, 158, 125, 0.25)',
                borderRadius: '20px',
                padding: '26px 30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PieChart size={20} color="var(--peach-primary)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                      Daily Macronutrient & Caloric Ingestion Breakdown
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#4ADE80', fontWeight: 700, background: 'rgba(74,222,128,0.12)', padding: '4px 10px', borderRadius: '8px' }}>
                    Metabolic Balance: Optimal Surplus
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
                  {/* Energy Bar */}
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                      <span style={{ color: '#94A3B8', fontWeight: 700 }}>Total Caloric Intake</span>
                      <strong style={{ color: '#4ADE80' }}>{nutritionProgress.caloriesConsumed} / {nutritionProgress.targetCalories} kcal</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, Math.round((nutritionProgress.caloriesConsumed / nutritionProgress.targetCalories) * 100))}%`, height: '100%', background: '#4ADE80' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '6px' }}>97.1% of Calibrated Target Ingested</div>
                  </div>

                  {/* Protein Bar */}
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                      <span style={{ color: '#94A3B8', fontWeight: 700 }}>Protein Synthesis (MPS)</span>
                      <strong style={{ color: '#38BDF8' }}>{nutritionProgress.proteinGrams} / {nutritionProgress.targetProtein}g</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, Math.round((nutritionProgress.proteinGrams / nutritionProgress.targetProtein) * 100))}%`, height: '100%', background: '#38BDF8' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '6px' }}>98.2% Amino Acid Nitrogen Balance</div>
                  </div>

                  {/* Carbohydrate Bar */}
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                      <span style={{ color: '#94A3B8', fontWeight: 700 }}>Glycogen Carbs</span>
                      <strong style={{ color: '#FACC15' }}>{nutritionProgress.carbGrams} / {nutritionProgress.targetCarbs}g</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, Math.round((nutritionProgress.carbGrams / nutritionProgress.targetCarbs) * 100))}%`, height: '100%', background: '#FACC15' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '6px' }}>Replenished Intramuscular ATP</div>
                  </div>

                  {/* Healthy Fats Bar */}
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                      <span style={{ color: '#94A3B8', fontWeight: 700 }}>Lipids & Omega-3s</span>
                      <strong style={{ color: '#FF7043' }}>{nutritionProgress.fatGrams} / {nutritionProgress.targetFats}g</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, Math.round((nutritionProgress.fatGrams / nutritionProgress.targetFats) * 100))}%`, height: '100%', background: '#FF7043' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '6px' }}>Hormonal & Joint Membrane Repair</div>
                  </div>
                </div>

                {/* Net Energy Balance Differential Matrix */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>DAILY ENERGY DIFFERENTIAL EQUATION</div>
                    <div style={{ fontSize: '0.9rem', color: '#FFF', marginTop: '2px' }}>
                      <strong>{nutritionProgress.caloriesConsumed} kcal (Consumed)</strong> - <strong>{totalBurn} kcal (Total Metabolic Burn)</strong> = <span style={{ color: netEnergyDifferential > 0 ? '#4ADE80' : '#38BDF8', fontWeight: 800 }}>{netEnergyDifferential > 0 ? `+${netEnergyDifferential} kcal (Clean Surplus)` : `${netEnergyDifferential} kcal (Lean Deficit)`}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--peach-soft)', background: 'rgba(255,158,125,0.12)', padding: '6px 14px', borderRadius: '8px', fontWeight: 700 }}>
                    🧬 Clinical Status: Optimal Muscle Protein Synthesis Active
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: WHAT ALL GAINS GAINED MATRIX */}
          {/* ========================================================================= */}
          {activeTab === 'all-gains' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* STRENGTH OVERLOAD GAINS TABLE */}
              <div style={{
                background: 'rgba(29, 7, 24, 0.75)',
                border: '1px solid rgba(255, 112, 67, 0.35)',
                borderRadius: '20px',
                padding: '26px 30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Dumbbell size={22} color="#FF7043" />
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                        Compound Lift Strength & 1RM Overload Gains
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                        Documented strength baseline improvements throughout your periodized progression
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#4ADE80', fontWeight: 800, background: 'rgba(74,222,128,0.12)', padding: '4px 10px', borderRadius: '8px' }}>
                    +34.2% Avg Strength Surge
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {strengthGains.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF' }}>{item.exercise}</div>
                        <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>Target: {item.target}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Baseline &rarr; Current</div>
                          <div style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{item.start} &rarr; <strong style={{ color: '#FFF' }}>{item.current}</strong></div>
                        </div>

                        <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid #10B981', padding: '6px 14px', borderRadius: '8px', textAlign: 'center', minWidth: '90px' }}>
                          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34D399' }}>{item.gain}</div>
                          <div style={{ fontSize: '0.68rem', color: '#A7F3D0', fontWeight: 700 }}>{item.percent}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BODY COMPOSITION & METABOLIC GAINS */}
              <div style={{
                background: 'rgba(29, 7, 24, 0.75)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '20px',
                padding: '26px 30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <Award size={22} color="#10B981" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                      Physical Body Recomposition & Cellular Gains
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                      Direct bioelectrical and cardiovascular performance markers
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {bodyCompGains.map((b, idx) => (
                    <div key={idx} style={{
                      padding: '18px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)'
                    }}>
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>{b.metric}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                        <span style={{ fontSize: '1.1rem', color: '#CBD5E1' }}>{b.start} &rarr; <strong style={{ color: '#FFF' }}>{b.current}</strong></span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                          {b.change}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#A7F3D0' }}>✓ {b.subtext}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 8-WEEK BIOMETRIC TRANSFORMATION TIMELINE */}
          {/* ========================================================================= */}
          {activeTab === 'biometrics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* HISTORICAL WEIGHT LOG TABLE */}
              <div style={{
                background: 'rgba(29, 7, 24, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '20px',
                padding: '26px 30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Scale size={22} color="#38BDF8" />
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                        Biometric Weight & Body Fat Transformation History
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                        Verified weekly athlete weigh-ins and recomp tracking
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogModal(true)}
                    style={{ padding: '8px 16px', borderRadius: '10px', background: '#38BDF8', border: 'none', color: '#12030F', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={15} />
                    <span>Log New Check-in</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {weightLogs.map((log, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>{log.week}</div>
                        <div style={{ fontSize: '0.76rem', color: '#38BDF8' }}>Status: {log.status}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Scale Weight</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>{log.weight} kg</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Body Fat %</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FACC15' }}>{log.bodyFat}%</div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Muscle Mass</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34D399' }}>{log.muscleMass || '34.5'} kg</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CARE TEAM SPECIALIST ENDORSEMENTS & VERIFIED NOTES */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.35) 0%, rgba(29, 7, 24, 0.9) 100%)',
            border: '1px solid rgba(255, 158, 125, 0.22)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginTop: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--peach-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                  Care Team Specialist Performance Evaluations
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Verified by Coach & Clinical Dietitian
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {/* Trainer Note */}
              <div style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255,112,67,0.08)', border: '1px solid rgba(255,112,67,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>{trainerName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#FFB8A1' }}>Certified Strength Coach • CSCS, NASM</div>
                  </div>
                  <button
                    onClick={() => handleAcknowledge('trainer')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: acknowledgedFeedback['trainer'] ? 'rgba(74,222,128,0.2)' : '#FF7043',
                      border: 'none',
                      color: acknowledgedFeedback['trainer'] ? '#4ADE80' : '#12030F',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}>
                    {acknowledgedFeedback['trainer'] ? '✓ Acknowledged' : 'Acknowledge'}
                  </button>
                </div>
                <p style={{ color: '#E2C9D6', fontSize: '0.84rem', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                  "Phenomenal progression on your compound movement volume this week. Your 3-second eccentric tempo on bench press and squats is accelerating chest and quad hypertrophy."
                </p>
              </div>

              {/* Dietitian Note */}
              <div style={{ padding: '18px', borderRadius: '14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>{dietitianName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#A7F3D0' }}>Head Clinical Dietitian • M.Sc Dietetics</div>
                  </div>
                  <button
                    onClick={() => handleAcknowledge('dietitian')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: acknowledgedFeedback['dietitian'] ? 'rgba(74,222,128,0.2)' : '#10B981',
                      border: 'none',
                      color: acknowledgedFeedback['dietitian'] ? '#4ADE80' : '#12030F',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}>
                    {acknowledgedFeedback['dietitian'] ? '✓ Acknowledged' : 'Acknowledge'}
                  </button>
                </div>
                <p style={{ color: '#E2C9D6', fontSize: '0.84rem', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                  "Your protein assimilation logged at 162g today, right in our gold-standard 2.2g/kg window. Hydration of 2.5L is solid; push for 3.5L on heavy leg days."
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: LOG NEW WEIGHT CHECK-IN */}
      {/* ========================================================================= */}
      {showLogModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '32px', maxWidth: '440px', width: '100%', background: '#1d0718', border: '1px solid #38BDF8', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0, fontWeight: 800 }}>Log Body Weight & Vitals</h3>
              <button onClick={() => setShowLogModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLogWeightSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Body Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={newWeight} 
                  onChange={e => setNewWeight(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(56,189,248,0.3)', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Estimated Body Fat (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={newBodyFat} 
                  onChange={e => setNewBodyFat(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(56,189,248,0.3)', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowLogModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 22px' }}>
                  Record Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
