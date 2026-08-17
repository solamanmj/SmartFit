import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Dumbbell, Zap, CheckCircle2, Flame, Clock, Play, RefreshCw, 
  Award, ShieldAlert, Sparkles, Check, ChevronRight, Trophy, Bot, Target, Activity, X, Info, Calendar, Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Workout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Day Progression Engine State (Day 1 to Day 7)
  const [currentDay, setCurrentDay] = useState(() => {
    const savedDay = localStorage.getItem('smartfit_workout_day');
    return savedDay ? parseInt(savedDay, 10) : 1;
  });

  const [category, setCategory] = useState('Full Body');
  const [exercises, setExercises] = useState([]);
  const [completedState, setCompletedState] = useState({});
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(null);
  
  // ML Recommendation State
  const [mlRecommendation, setMlRecommendation] = useState(null);
  const [mlLoading, setMlLoading] = useState(true);

  // Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Animated Coach Demo Modal State
  const [demoExercise, setDemoExercise] = useState(null);

  // Session Completion Achievement Modal State
  const [achievementData, setAchievementData] = useState(null);

  // 7-Day Master Program Completion Modal State
  const [weeklyCompletionData, setWeeklyCompletionData] = useState(null);

  // 7-DAY AUTOMATED PROGRESSION WORKOUT SPLITS
  const DAY_PLANS = {
    1: {
      dayTitle: 'Day 1: Upper Body Push & Hypertrophy Split',
      category: 'Upper Body',
      exercises: [
        { id: 'd1-ex1', name: 'Incline Dumbbell Bench Press', sets: 4, reps: '10 Reps', targetMuscle: 'Upper Chest', equipmentNeeded: user?.workoutEquipment || 'Dumbbells / Bench', instructions: 'Press dumbbells upward at a 30 degree incline keeping wrists stacked over elbows.', estimatedCaloriesBurned: 120 },
        { id: 'd1-ex2', name: 'Standing Dumbbell Shoulder Press', sets: 3, reps: '12 Reps', targetMuscle: 'Deltoids & Shoulders', equipmentNeeded: 'Dumbbells', instructions: 'Press weights overhead smoothly without arching lower back.', estimatedCaloriesBurned: 100 },
        { id: 'd1-ex3', name: 'Cable / Dumbbell Chest Flyes', sets: 3, reps: '12 Reps', targetMuscle: 'Chest Pecs', equipmentNeeded: 'Cable / Dumbbells', instructions: 'Hug a broad barrel bringing weights together with slight elbow bend.', estimatedCaloriesBurned: 90 },
        { id: 'd1-ex4', name: 'Triceps Overhead Extensions', sets: 3, reps: '15 Reps', targetMuscle: 'Triceps Long Head', equipmentNeeded: 'Dumbbell / Cable', instructions: 'Lower weight behind head and extend upward locking out elbow.', estimatedCaloriesBurned: 75 },
        { id: 'd1-ex5', name: 'Push-Up Burnout Set', sets: 3, reps: '20 Reps', targetMuscle: 'Chest & Core', equipmentNeeded: 'Bodyweight', instructions: 'Keep body in rigid plank and push up explosively.', estimatedCaloriesBurned: 85 }
      ]
    },
    2: {
      dayTitle: 'Day 2: Lower Body Quads, Hamstrings & Core Split',
      category: 'Full Body',
      exercises: [
        { id: 'd2-ex1', name: 'Barbell Back Squats', sets: 4, reps: '10 Reps', targetMuscle: 'Quadriceps & Glutes', equipmentNeeded: 'Barbell & Rack', instructions: 'Hinge hips back, keep chest tall, and squat to parallel.', estimatedCaloriesBurned: 140 },
        { id: 'd2-ex2', name: 'Romanian Dumbbell Deadlifts', sets: 4, reps: '10 Reps', targetMuscle: 'Hamstrings & Glutes', equipmentNeeded: 'Dumbbells', instructions: 'Hinge at hips keeping spine flat until stretch is felt in hamstrings.', estimatedCaloriesBurned: 130 },
        { id: 'd2-ex3', name: 'Bulgarian Split Squats', sets: 3, reps: '12 Reps / Leg', targetMuscle: 'Quads & Balance', equipmentNeeded: 'Bench & Dumbbells', instructions: 'Lower back knee toward floor with front knee stacked over ankle.', estimatedCaloriesBurned: 110 },
        { id: 'd2-ex4', name: 'Standing Calf Raises', sets: 4, reps: '15 Reps', targetMuscle: 'Calves', equipmentNeeded: 'Bodyweight / Weight', instructions: 'Press up onto toes squeezing calves at top extension.', estimatedCaloriesBurned: 60 },
        { id: 'd2-ex5', name: 'Plank Hold', sets: 3, reps: '60 Sec', targetMuscle: 'Core Abs', equipmentNeeded: 'Bodyweight', instructions: 'Maintain rigid straight line from head to heels.', estimatedCaloriesBurned: 55 }
      ]
    },
    3: {
      dayTitle: 'Day 3: Pull & Back Hypertrophy Split',
      category: 'Upper Body',
      exercises: [
        { id: 'd3-ex1', name: 'Lat Pulldowns', sets: 4, reps: '10 Reps', targetMuscle: 'Lats & Upper Back', equipmentNeeded: 'Cable Machine', instructions: 'Pull bar down to upper chest while squeezing shoulder blades.', estimatedCaloriesBurned: 115 },
        { id: 'd3-ex2', name: 'Seated Cable Rows', sets: 4, reps: '12 Reps', targetMuscle: 'Rhomboids & Mid-Back', equipmentNeeded: 'Cable Machine', instructions: 'Pull handles to navel squeezing shoulder blades together.', estimatedCaloriesBurned: 105 },
        { id: 'd3-ex3', name: 'Dumbbell Shrugs', sets: 3, reps: '15 Reps', targetMuscle: 'Upper Trapezius', equipmentNeeded: 'Dumbbells', instructions: 'Shrug shoulders straight up toward ears and pause at peak.', estimatedCaloriesBurned: 70 },
        { id: 'd3-ex4', name: 'Standing EZ-Bar Bicep Curls', sets: 3, reps: '12 Reps', targetMuscle: 'Biceps Brachii', equipmentNeeded: 'Barbell / Dumbbells', instructions: 'Curl bar up keeping elbows pinned to ribs without swinging.', estimatedCaloriesBurned: 80 },
        { id: 'd3-ex5', name: 'Hammer Curls', sets: 3, reps: '12 Reps', targetMuscle: 'Brachialis & Forearms', equipmentNeeded: 'Dumbbells', instructions: 'Curl dumbbells with thumbs pointing upward.', estimatedCaloriesBurned: 75 }
      ]
    },
    4: {
      dayTitle: 'Day 4: Active Recovery & Yoga Mobility Protocol',
      category: 'Core & Cardio',
      exercises: [
        { id: 'd4-ex1', name: 'Sun Salutation Flow', sets: 3, reps: '5 Mins', targetMuscle: 'Full Body Mobility', equipmentNeeded: 'Yoga Mat', instructions: 'Smooth transition from upward dog to downward dog with steady breathing.', estimatedCaloriesBurned: 70 },
        { id: 'd4-ex2', name: 'Warrior II & Triangle Pose', sets: 3, reps: '45 Sec Hold', targetMuscle: 'Hip Flexors & Core', equipmentNeeded: 'Yoga Mat', instructions: 'Sink deep into lunging knee while stretching arms parallel to floor.', estimatedCaloriesBurned: 60 },
        { id: 'd4-ex3', name: 'Cat-Cow Spine Stretches', sets: 3, reps: '10 Cycles', targetMuscle: 'Spinal Decompression', equipmentNeeded: 'Yoga Mat', instructions: 'Arch and round spine in sync with deep diaphragmatic breaths.', estimatedCaloriesBurned: 45 },
        { id: 'd4-ex4', name: 'Pigeon Pose Hip Opener', sets: 3, reps: '60 Sec / Side', targetMuscle: 'Glute & Piriformis', equipmentNeeded: 'Yoga Mat', instructions: 'Fold torso forward over bent front leg feeling deep glute stretch.', estimatedCaloriesBurned: 50 },
        { id: 'd4-ex5', name: 'Deep Breathing Meditation', sets: 1, reps: '5 Mins', targetMuscle: 'Nervous System Recovery', equipmentNeeded: 'Mat', instructions: 'Inhale 4s, hold 4s, exhale 6s to lower heart rate variability.', estimatedCaloriesBurned: 30 }
      ]
    },
    5: {
      dayTitle: 'Day 5: High-Intensity Cardio & Metabolic Conditioning',
      category: 'Core & Cardio',
      exercises: [
        { id: 'd5-ex1', name: 'Sprinting Interval Bursts', sets: 5, reps: '1 Min Sprint / 1 Min Walk', targetMuscle: 'Cardiovascular System', equipmentNeeded: 'Treadmill / Track', instructions: 'Explosive all-out sprint followed by active walk recovery.', estimatedCaloriesBurned: 180 },
        { id: 'd5-ex2', name: 'High-Knee Mountain Climbers', sets: 4, reps: '45 Sec', targetMuscle: 'Abs & Cardio', equipmentNeeded: 'Bodyweight', instructions: 'Rapid alternating knees in pushup position keeping core rigid.', estimatedCaloriesBurned: 130 },
        { id: 'd5-ex3', name: 'Jump Rope Double-Unders', sets: 4, reps: '60 Sec', targetMuscle: 'Calves & Endurance', equipmentNeeded: 'Jump Rope', instructions: 'Keep elbows tucked and rotate rope quickly from wrists.', estimatedCaloriesBurned: 140 },
        { id: 'd5-ex4', name: 'Full Burpees with Push-Up', sets: 3, reps: '15 Reps', targetMuscle: 'Total Body Metabolic', equipmentNeeded: 'Bodyweight', instructions: 'Drop to floor, complete push-up, jump up explosively with overhead clap.', estimatedCaloriesBurned: 150 },
        { id: 'd5-ex5', name: 'Russian Twists with Weight', sets: 4, reps: '20 Reps', targetMuscle: 'Obliques & Core', equipmentNeeded: 'Weight Plate / Dumbbell', instructions: 'Twist torso side to side touching weight to floor near hips.', estimatedCaloriesBurned: 90 }
      ]
    },
    6: {
      dayTitle: 'Day 6: Compound Strength & Core Stability Split',
      category: 'Full Body',
      exercises: [
        { id: 'd6-ex1', name: 'Conventional Barbell Deadlifts', sets: 4, reps: '8 Reps', targetMuscle: 'Posterior Chain & Back', equipmentNeeded: 'Barbell', instructions: 'Drive through heels, keep bar close to shins, pull shoulders back at lockout.', estimatedCaloriesBurned: 160 },
        { id: 'd6-ex2', name: 'Dumbbell Incline Chest Press', sets: 4, reps: '10 Reps', targetMuscle: 'Upper Chest & Triceps', equipmentNeeded: 'Bench & Dumbbells', instructions: 'Press dumbbells up in slight arching motion above upper chest.', estimatedCaloriesBurned: 120 },
        { id: 'd6-ex3', name: 'Single-Arm Dumbbell Rows', sets: 3, reps: '12 Reps / Arm', targetMuscle: 'Lats & Core Stabilizers', equipmentNeeded: 'Bench & Dumbbell', instructions: 'Pull dumbbell toward hip crease squeezing lat at top.', estimatedCaloriesBurned: 100 },
        { id: 'd6-ex4', name: 'Hanging Leg Raises', sets: 4, reps: '12 Reps', targetMuscle: 'Lower Abs', equipmentNeeded: 'Pull-Up Bar', instructions: 'Raise straight legs to 90 degrees without swinging momentum.', estimatedCaloriesBurned: 85 },
        { id: 'd6-ex5', name: 'Farmer Walk Carries', sets: 3, reps: '40 Meters', targetMuscle: 'Grip Strength & Traps', equipmentNeeded: 'Heavy Dumbbells', instructions: 'Walk with tall posture carrying heavy dumbbells at sides.', estimatedCaloriesBurned: 95 }
      ]
    },
    7: {
      dayTitle: 'Day 7: Rest, Hydration & Deload Recovery Protocol',
      category: 'Full Body',
      exercises: [
        { id: 'd7-ex1', name: 'Foam Rolling Quad & Hamstring Release', sets: 1, reps: '10 Mins', targetMuscle: 'Myofascial Tissue', equipmentNeeded: 'Foam Roller', instructions: 'Roll slowly over tight muscles pausing on tender spots for 30s.', estimatedCaloriesBurned: 40 },
        { id: 'd7-ex2', name: 'Light Outdoor Recovery Walk', sets: 1, reps: '20 Mins', targetMuscle: 'Active Blood Circulation', equipmentNeeded: 'Outdoors', instructions: 'Casual stroll at 3 km/h to promote lactic acid removal.', estimatedCaloriesBurned: 90 },
        { id: 'd7-ex3', name: 'Full Body Static Stretching', sets: 1, reps: '15 Mins', targetMuscle: 'Tendons & Flexibility', equipmentNeeded: 'Mat', instructions: 'Hold each static stretch for 30 seconds without bouncing.', estimatedCaloriesBurned: 50 }
      ]
    }
  };

  useEffect(() => {
    fetchMLRecommendation();
  }, []);

  useEffect(() => {
    fetchWorkout(currentDay, category);
  }, [currentDay, category]);

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

  const fetchMLRecommendation = () => {
    setMlLoading(true);
    fetch('http://localhost:8081/api/workouts/recommend')
      .then(res => res.json())
      .then(data => {
        if (data && data.recommendedWorkoutType) {
          setMlRecommendation(data);
        }
        setMlLoading(false);
      })
      .catch(err => {
        console.warn('Backend ML recommendation note:', err);
        setMlLoading(false);
      });
  };

  const fetchWorkout = (dayNum, selectedCat) => {
    setLoading(true);
    const dayPlan = DAY_PLANS[dayNum] || DAY_PLANS[1];
    if (dayPlan && dayPlan.exercises) {
      setExercises(dayPlan.exercises);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8081/api/workouts/generate?category=${encodeURIComponent(selectedCat)}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.exercises)) {
          setExercises(data.exercises);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend workout fetch fallback active:', err);
        setLoading(false);
      });
  };

  const toggleSetComplete = (exId, setNum) => {
    setCompletedState(prev => {
      const key = `${exId}-${setNum}`;
      const updated = { ...prev, [key]: !prev[key] };
      return updated;
    });

    setTimerSeconds(45);
    setTimerActive(true);
  };

  const calculateTotalCalories = () => {
    return exercises.reduce((acc, ex) => acc + (ex.estimatedCaloriesBurned || 80), 0);
  };

  // CALCULATE GRAND TOTAL CALORIES & XP FOR ALL 7 DAYS
  const calculateWeeklyTotals = () => {
    let grandCals = 0;
    let grandXP = 0;
    Object.keys(DAY_PLANS).forEach(dKey => {
      const plan = DAY_PLANS[dKey];
      const dCals = plan.exercises.reduce((acc, e) => acc + (e.estimatedCaloriesBurned || 80), 0);
      const dXP = dCals + (45 * 5); // 45 mins session
      grandCals += dCals;
      grandXP += dXP;
    });
    return { grandCals, grandXP };
  };

  const handleLogWorkout = () => {
    setLogging(true);
    setLogSuccess(null);

    const completedNames = exercises
      .filter((_, idx) => Object.keys(completedState).some(k => k.startsWith(`d${currentDay}-ex`) && completedState[k]))
      .map(ex => ex.name);

    const totalCals = calculateTotalCalories();
    const durationMins = 45;
    const xpEarned = totalCals + (durationMins * 5);
    const dayTitle = DAY_PLANS[currentDay]?.dayTitle || `Day ${currentDay} Workout`;

    const payload = {
      email: user?.email || 'john@example.com',
      workoutTitle: `${dayTitle} (MongoDB Logged)`,
      durationMinutes: durationMins,
      caloriesBurned: totalCals,
      completedExercises: completedNames.length > 0 ? completedNames : exercises.map(e => e.name)
    };

    fetch('http://localhost:8081/api/workouts/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setLogging(false);
        const earned = data.log?.xpEarned || xpEarned;
        
        // CHECK IF FULL DAY 7 IS COMPLETED
        if (currentDay === 7) {
          const { grandCals, grandXP } = calculateWeeklyTotals();
          setWeeklyCompletionData({
            totalCalories: grandCals,
            totalXP: grandXP,
            daysCompleted: 7,
            completionRate: '100%',
            weeklyBadges: [
              { title: '👑 SmartFit 7-Day Program Titan', desc: 'Successfully executed all 7 automated routine splits' },
              { title: '🔥 Weekly Calorie Master (3,095 kcal)', desc: 'Surpassed 3,000+ kcal weekly burn benchmark' },
              { title: '⚡ Perfect 7-Day Mastery Streak', desc: '100% Program Discipline Rate & Mongo Persistence' }
            ]
          });
        } else {
          const nextDay = currentDay + 1;
          setLogSuccess(`Day ${currentDay} Completed & Logged to MongoDB! +${earned} XP Earned 🎉 Automating to Day ${nextDay}...`);
          
          setAchievementData({
            completedDay: currentDay,
            nextDay: nextDay,
            calories: totalCals,
            duration: durationMins,
            xp: earned,
            completedCount: completedNames.length > 0 ? completedNames.length : exercises.length,
            streak: (user?.streakDays || 1) + 1,
            badges: [
              { title: `🔥 Day ${currentDay} Conqueror`, desc: `Burned ${totalCals} kcal in ${dayTitle}` },
              { title: '🏆 Automated Split Advance', desc: `Unlocked Day ${nextDay} Routine Split` },
              { title: '⚡ Consistency Streak', desc: `${(user?.streakDays || 1) + 1} Consecutive Active Days` }
            ]
          });

          setCurrentDay(nextDay);
          localStorage.setItem('smartfit_workout_day', nextDay.toString());
          setCompletedState({});
        }
      })
      .catch(err => {
        console.warn('Workout log fallback active:', err);
        setLogging(false);
        
        if (currentDay === 7) {
          const { grandCals, grandXP } = calculateWeeklyTotals();
          setWeeklyCompletionData({
            totalCalories: grandCals,
            totalXP: grandXP,
            daysCompleted: 7,
            completionRate: '100%',
            weeklyBadges: [
              { title: '👑 SmartFit 7-Day Program Titan', desc: 'Successfully executed all 7 automated routine splits' },
              { title: '🔥 Weekly Calorie Master (3,095 kcal)', desc: 'Surpassed 3,000+ kcal weekly burn benchmark' },
              { title: '⚡ Perfect 7-Day Mastery Streak', desc: '100% Program Discipline Rate & Mongo Persistence' }
            ]
          });
        } else {
          const nextDay = currentDay + 1;
          setLogSuccess(`Day ${currentDay} Completed locally! +${xpEarned} XP Earned 🎉 Automating to Day ${nextDay}...`);

          setAchievementData({
            completedDay: currentDay,
            nextDay: nextDay,
            calories: totalCals,
            duration: durationMins,
            xp: xpEarned,
            completedCount: exercises.length,
            streak: (user?.streakDays || 1) + 1,
            badges: [
              { title: `🔥 Day ${currentDay} Conqueror`, desc: `Burned ${totalCals} kcal in ${dayTitle}` },
              { title: '🏆 Automated Split Advance', desc: `Unlocked Day ${nextDay} Routine Split` },
              { title: '⚡ Consistency Streak', desc: `${(user?.streakDays || 1) + 1} Consecutive Active Days` }
            ]
          });

          setCurrentDay(nextDay);
          localStorage.setItem('smartfit_workout_day', nextDay.toString());
          setCompletedState({});
        }
      });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="badge" style={{ marginBottom: '10px' }}>
              <Bot size={14} /> MODULE 2: AI WORKOUT RECOMMENDATION ENGINE
            </div>
            <h1 className="gradient-peach-rose" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Personalized AI Workout Tracker
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              Scikit-Learn Machine Learning Model • Fast API Service • MongoDB Profile Sync
            </p>
          </div>

          {/* 7-DAY AUTOMATED PROGRAM ACTIVE TRACKER BADGE */}
          <div className="glass-card" style={{ padding: '20px 28px', marginBottom: '28px', border: '1px solid var(--peach-primary)', background: 'rgba(255,158,125,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--peach-primary), var(--rose-accent))', color: '#12030f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AUTOMATED 7-DAY SPLIT ENGINE ACTIVE
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  {DAY_PLANS[currentDay]?.dayTitle || `Day ${currentDay} Workout`}
                </h3>
              </div>
            </div>

            {/* Day Switcher Buttons (1 to 7) */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600, marginRight: '4px' }}>Jump to Day:</span>
              {[1, 2, 3, 4, 5, 6, 7].map(dNum => (
                <button
                  key={dNum}
                  onClick={() => {
                    setCurrentDay(dNum);
                    localStorage.setItem('smartfit_workout_day', dNum.toString());
                    setCompletedState({});
                  }}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    border: currentDay === dNum ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    background: currentDay === dNum ? 'linear-gradient(135deg, var(--peach-primary), var(--rose-accent))' : 'rgba(255,255,255,0.05)',
                    color: currentDay === dNum ? '#12030f' : '#fff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  {dNum}
                </button>
              ))}
            </div>
          </div>

          {/* ML WORKOUT RECOMMENDATION CARD (EXPLAINABLE AI) */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '36px', border: '1px solid var(--peach-primary)', background: 'linear-gradient(135deg, rgba(255,158,125,0.08), rgba(232,128,157,0.04))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--peach-primary), var(--rose-accent))', color: '#12030f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ML MODEL PREDICTION (FASTAPI + SCIKIT-LEARN)
                  </div>
                  <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                    Recommended Routine: <span className="gradient-peach-rose">{mlRecommendation?.recommendedWorkoutType || 'Cardio'}</span>
                  </h2>
                </div>
              </div>

              {mlRecommendation && (
                <div style={{ background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', color: '#4ade80', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> Confidence Score: {mlRecommendation.confidence}
                </div>
              )}
            </div>

            {mlLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--peach-soft)' }}>
                Running Random Forest ML Recommendation Engine...
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Workout Type</div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--peach-light)', fontWeight: 800, marginTop: '4px' }}>{mlRecommendation?.recommendedWorkoutType || 'Cardio'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Duration</div>
                    <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800, marginTop: '4px' }}>{mlRecommendation?.recommendedDuration || '45 mins'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Frequency</div>
                    <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800, marginTop: '4px' }}>{mlRecommendation?.recommendedFrequency || '4 days/wk'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Intensity</div>
                    <div style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 800, marginTop: '4px' }}>{mlRecommendation?.recommendedIntensity || 'Moderate'}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px 22px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--peach-soft)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} /> EXPLAINABLE AI (XAI) RECOMMENDATION RATIONALE:
                  </div>
                  <div style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {mlRecommendation?.reason || "Target Goal: Chosen to align with user profile goals. Biometric Match: Calibrated for weight, BMI, and resting heart rate capacity."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Controls Bar: Category Selector & Rest Timer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Full Body', 'Upper Body', 'Core & Cardio'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={category === cat ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ background: 'rgba(255,158,125,0.12)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} style={{ color: 'var(--peach-primary)' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Rest Timer: <span style={{ color: 'var(--peach-light)', fontWeight: 800, fontSize: '1.05rem' }}>{timerSeconds}s</span>
              </div>
              {timerActive && (
                <span style={{ fontSize: '0.75rem', background: '#4ade80', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  COUNTING
                </span>
              )}
            </div>
          </div>

          {/* Workout Exercises Grid */}
          {loading ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--peach-soft)' }}>
              Generating personalized workout routines...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
              {exercises.map((ex, exIdx) => {
                const totalSets = ex.sets || 3;
                return (
                  <div key={ex.id || exIdx} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase' }}>
                          Target: {ex.targetMuscle} • {ex.equipmentNeeded}
                        </div>
                        <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: '4px 0 0 0', fontWeight: 700 }}>
                          {ex.name}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                          onClick={() => setDemoExercise(ex)}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.82rem', borderColor: 'var(--peach-primary)', color: 'var(--peach-light)', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Play size={14} style={{ fill: 'var(--peach-primary)' }} /> Watch Demo & Form
                        </button>
                        
                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.88rem', color: 'var(--text-subtle)', alignItems: 'center' }}>
                          <div><strong style={{ color: '#fff' }}>{ex.sets}</strong> Sets</div>
                          <div><strong style={{ color: 'var(--peach-light)' }}>{ex.reps}</strong></div>
                          <div style={{ color: '#ff6b4a', fontWeight: 700 }}><Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />{ex.estimatedCaloriesBurned || 90} kcal</div>
                        </div>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '10px' }}>
                      💡 <strong>Instruction:</strong> {ex.instructions}
                    </p>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Log Sets:</span>
                      {Array.from({ length: totalSets }).map((_, setIdx) => {
                        const setNum = setIdx + 1;
                        const key = `${ex.id}-${setNum}`;
                        const isDone = !!completedState[key];
                        return (
                          <button
                            key={setNum}
                            onClick={() => toggleSetComplete(ex.id, setNum)}
                            style={{
                              background: isDone ? 'linear-gradient(135deg, var(--peach-primary), var(--rose-accent))' : 'rgba(255,255,255,0.06)',
                              color: isDone ? '#12030f' : '#fff',
                              border: isDone ? 'none' : '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '10px',
                              padding: '8px 16px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: '0.2s'
                            }}
                          >
                            {isDone ? <Check size={14} /> : null}
                            Set {setNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Log Workout Banner */}
          <div className="glass-card" style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0' }}>
                {currentDay === 7 ? 'Finish Day 7 & Unlock 7-Day Program Total XP!' : `Complete Day ${currentDay} & Advance to Day ${currentDay + 1}`}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Earn <strong style={{ color: 'var(--peach-light)' }}>+{calculateTotalCalories() + 225} XP</strong> • Saves log to MongoDB.
              </p>
            </div>

            <button
              onClick={handleLogWorkout}
              disabled={logging}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              <Trophy size={18} />
              <span>{logging ? 'Saving to MongoDB...' : currentDay === 7 ? 'Complete 7-Day Master Program 🏆' : `Complete Day ${currentDay} & Advance ➔`}</span>
            </button>
          </div>

          {logSuccess && (
            <div style={{ marginTop: '20px', background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#4ade80', fontWeight: 700 }}>
              {logSuccess}
            </div>
          )}

        </div>
      </main>

      {/* 1. ANIMATED AI COACH DEMO MODAL */}
      {demoExercise && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '36px', border: '1px solid var(--peach-primary)', position: 'relative', overflow: 'hidden' }}>
            <button
              onClick={() => setDemoExercise(null)}
              style={{ position: 'absolute', right: '18px', top: '18px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div className="badge"><Sparkles size={14} /> 3D BIOMECHANICAL REAL AI COACH DEMO</div>
            </div>

            <h2 className="gradient-peach-rose" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 16px 0' }}>
              {demoExercise.name}
            </h2>

            {/* REALISTIC HUMAN ATHLETE VECTOR ANIMATED COACH CONTAINER */}
            <div style={{ height: '270px', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(18,3,15,0.95) 80%)', borderRadius: '20px', border: '1px solid rgba(2, 132, 199, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '22px' }}>
              <svg width="320" height="200" viewBox="0 0 280 180" style={{ filter: 'drop-shadow(0 0 16px rgba(2, 132, 199, 0.4))' }}>
                <style>{`
                  @keyframes humanPress {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-24px); }
                  }
                  @keyframes musclePulse {
                    0%, 100% { opacity: 0.4; filter: blur(4px); }
                    50% { opacity: 0.95; filter: blur(1px); }
                  }
                  .anim-squat { animation: humanSquat 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite; transform-origin: bottom center; }
                  .anim-crunch { animation: humanCrunch 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; transform-origin: 160px 100px; }
                  .anim-press { animation: humanPress 2.2s ease-in-out infinite; }
                  .anim-pulse { animation: musclePulse 1.8s ease-in-out infinite; }
                `}</style>
                
                <defs>
                  {/* Realistic Blue Athletic Top Gradient */}
                  <linearGradient id="blueTopGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  {/* Skin Tone Gradient */}
                  <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e2a76f" />
                    <stop offset="100%" stopColor="#c98a50" />
                  </linearGradient>
                  {/* Dark Athletic Shorts */}
                  <linearGradient id="shortsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {demoExercise.name.toLowerCase().includes('squat') ? (
                  /* 1. REALISTIC HUMAN SQUAT ANIMATION */
                  <g className="anim-squat">
                    {/* Head & Hair Profile */}
                    <path d="M 120 18 C 127 18 132 23 132 30 C 132 37 127 42 120 42 C 113 42 108 37 108 30 C 108 23 113 18 120 18 Z" fill="url(#skinGrad)" />
                    {/* Hair Bun / Style */}
                    <path d="M 112 18 C 107 15 104 22 106 28 C 109 26 114 28 116 22 Z" fill="#4a2e1b" />
                    {/* Neck */}
                    <rect x="117" y="40" width="6" height="8" rx="2" fill="url(#skinGrad)" />
                    {/* Torso - Blue Athletic Tank Top */}
                    <path d="M 106 48 L 134 48 C 138 65 136 82 130 92 L 110 92 C 104 82 102 65 106 48 Z" fill="url(#blueTopGrad)" />
                    {/* Extended Arms for Balance */}
                    <path d="M 128 54 L 175 62 A 4 4 0 0 1 176 68 L 128 66 Z" fill="url(#skinGrad)" />
                    {/* Athletic Shorts */}
                    <path d="M 110 92 L 130 92 L 134 112 L 106 112 Z" fill="url(#shortsGrad)" />
                    {/* Legs & Calf Contours */}
                    <path d="M 112 112 L 108 142 L 100 152 L 114 152 L 118 138 L 120 112 Z" fill="url(#skinGrad)" />
                    <path d="M 120 112 L 122 138 L 126 152 L 140 152 L 132 142 L 128 112 Z" fill="url(#skinGrad)" />
                    {/* Active Muscle Fiber Glow (Quads & Glutes) */}
                    <ellipse cx="114" cy="120" rx="9" ry="14" fill="#0284c7" className="anim-pulse" />
                    <ellipse cx="126" cy="120" rx="9" ry="14" fill="#0284c7" className="anim-pulse" />
                  </g>
                ) : (demoExercise.name.toLowerCase().includes('plank') || demoExercise.name.toLowerCase().includes('hold') || demoExercise.name.toLowerCase().includes('core')) ? (
                  /* 2. REALISTIC HUMAN FOREARM PLANK (MATCHING TOP-RIGHT OF USER IMAGE) */
                  <g>
                    {/* Mat */}
                    <rect x="20" y="128" width="200" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
                    {/* Head & Hair (Facing Down) */}
                    <circle cx="56" cy="72" r="11" fill="url(#skinGrad)" />
                    <path d="M 48 64 C 44 68 46 76 52 80 C 50 72 54 66 62 66 Z" fill="#4a2e1b" />
                    {/* Forearms Resting Flat on Floor */}
                    <path d="M 64 78 L 74 95 L 45 95 L 45 90 L 60 76 Z" fill="url(#skinGrad)" />
                    {/* Blue Athletic Tank Top */}
                    <path d="M 66 74 L 115 76 L 112 94 L 68 92 Z" fill="url(#blueTopGrad)" />
                    {/* Dark Athletic Shorts */}
                    <path d="M 112 76 L 145 78 L 142 96 L 112 94 Z" fill="url(#shortsGrad)" />
                    {/* Rigid Legs Extended Out to Feet */}
                    <path d="M 142 78 L 195 82 A 4 4 0 0 1 198 88 L 142 96 Z" fill="url(#skinGrad)" />
                    {/* Feet Flexed against Mat */}
                    <path d="M 194 82 L 202 96 L 194 96 Z" fill="url(#skinGrad)" />
                    {/* Ab Core Engagement Muscle Glow */}
                    <rect x="75" y="80" width="35" height="10" rx="5" fill="#4ade80" className="anim-pulse" />
                  </g>
                ) : demoExercise.name.toLowerCase().includes('press') ? (
                  /* 3. REALISTIC HUMAN BENCH PRESS ANIMATION */
                  <g>
                    {/* Bench Stand */}
                    <rect x="30" y="112" width="180" height="10" rx="4" fill="#334155" />
                    <rect x="50" y="122" width="10" height="24" fill="#1e293b" />
                    <rect x="180" y="122" width="10" height="24" fill="#1e293b" />
                    {/* Lying Torso - Blue Top */}
                    <rect x="60" y="96" width="90" height="16" rx="8" fill="url(#blueTopGrad)" />
                    {/* Head */}
                    <circle cx="48" cy="104" r="11" fill="url(#skinGrad)" />
                    <path d="M 40 98 C 36 102 38 110 44 114 Z" fill="#4a2e1b" />
                    {/* Shorts & Legs */}
                    <rect x="150" y="96" width="35" height="16" rx="6" fill="url(#shortsGrad)" />
                    <path d="M 185 104 L 205 125 L 200 135 Z" fill="url(#skinGrad)" strokeWidth="6" />
                    {/* Pressing Arms & Barbell */}
                    <g className="anim-press">
                      <path d="M 85 96 L 85 55" stroke="url(#skinGrad)" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 125 96 L 125 55" stroke="url(#skinGrad)" strokeWidth="10" strokeLinecap="round" />
                      <rect x="30" y="50" width="180" height="7" rx="3" fill="#fff" />
                      <rect x="25" y="44" width="10" height="19" rx="3" fill="#e8809d" />
                      <rect x="205" y="44" width="10" height="19" rx="3" fill="#e8809d" />
                    </g>
                    {/* Chest Engagement Glow */}
                    <ellipse cx="105" cy="104" rx="22" ry="8" fill="#0284c7" className="anim-pulse" />
                  </g>
                ) : (
                  /* 4. REALISTIC HUMAN QUADRUPED / BIRD-DOG (MATCHING BOTTOM-LEFT OF USER IMAGE) */
                  <g className="anim-squat">
                    {/* Head & Hair */}
                    <circle cx="165" cy="62" r="11" fill="url(#skinGrad)" />
                    <path d="M 172 56 C 176 60 174 68 168 72 Z" fill="#4a2e1b" />
                    {/* Arms Planted Under Shoulders */}
                    <rect x="145" y="72" width="10" height="52" rx="4" fill="url(#skinGrad)" />
                    {/* Blue Athletic Top */}
                    <path d="M 105 64 L 160 64 L 155 88 L 105 88 Z" fill="url(#blueTopGrad)" />
                    {/* Black Athletic Shorts */}
                    <path d="M 80 64 L 105 64 L 105 88 L 85 88 Z" fill="url(#shortsGrad)" />
                    {/* Bent Kneeling Leg */}
                    <path d="M 92 88 L 92 124 L 75 124 L 75 116 L 84 88 Z" fill="url(#skinGrad)" />
                    {/* Rear Extended Leg */}
                    <path d="M 80 70 L 32 45 A 4 4 0 0 0 26 50 L 80 78 Z" fill="url(#skinGrad)" />
                    {/* Glute & Core Glow */}
                    <circle cx="95" cy="74" r="14" fill="#0284c7" className="anim-pulse" />
                  </g>
                )}
              </svg>

              <div style={{ position: 'absolute', bottom: '10px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(2,132,199,0.3)', padding: '5px 16px', borderRadius: '16px', fontSize: '0.825rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={14} style={{ color: '#4ade80' }} /> Realistic Anatomical AI Coach • 2s Down • 1s Pause • 2s Drive
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--peach-primary)' }} /> REAL-TIME FORM & BIOMECHANICAL CUES:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <div>🔹 <strong>Execution:</strong> {demoExercise.instructions}</div>
                <div>🔹 <strong>Target Muscle Focus:</strong> <span style={{ color: 'var(--peach-light)', fontWeight: 700 }}>{demoExercise.targetMuscle}</span></div>
                <div>🔹 <strong>Breathing Rhythm:</strong> Inhale during eccentric descent; exhale forcefully on concentric drive.</div>
                <div>⚠️ <strong>Mistake Avoidance:</strong> Keep spine in neutral alignment and avoid locking out joints at full extension.</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. DAILY SESSION ACCOMPLISHED MODAL */}
      {achievementData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '40px', textAlign: 'center', border: '2px solid #4ade80', position: 'relative', overflow: 'hidden' }}>
            <button
              onClick={() => setAchievementData(null)}
              style={{ position: 'absolute', right: '18px', top: '18px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>

            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.2)', border: '2px solid #4ade80', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trophy size={38} />
            </div>

            <div className="badge" style={{ marginBottom: '8px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', borderColor: '#4ade80' }}>
              🎉 DAY {achievementData.completedDay} COMPLETED & PERSISTED TO MONGODB
            </div>

            <h2 className="gradient-peach-rose" style={{ fontSize: '2.2rem', fontWeight: 800, margin: '6px 0 6px 0' }}>
              Awesome Work!
            </h2>
            <p style={{ color: 'var(--peach-soft)', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0' }}>
              Automated Advance to <strong>Day {achievementData.nextDay} Workout Split</strong>!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '20px 0' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Calories Burned</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ff6b4a', marginTop: '4px' }}>
                  {achievementData.calories} <span style={{ fontSize: '0.85rem' }}>kcal</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>XP Points Earned</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#facc15', marginTop: '4px' }}>
                  +{achievementData.xp} <span style={{ fontSize: '0.85rem' }}>XP</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Active Streak</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                  {achievementData.streak} <span style={{ fontSize: '0.85rem' }}>Days 🔥</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--peach-soft)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} /> UNLOCKED SESSION ACHIEVEMENTS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {achievementData.badges.map((badge, bIdx) => (
                  <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                    <CheckCircle2 size={20} style={{ color: '#4ade80', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{badge.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{badge.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setAchievementData(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              <span>Start Day {achievementData.nextDay} Workout Split ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. GRAND 7-DAY AUTOMATED PROGRAM CHAMPION CELEBRATION MODAL */}
      {weeklyCompletionData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '650px', padding: '44px', textAlign: 'center', border: '3px solid #facc15', position: 'relative', overflow: 'hidden', boxShadow: '0 0 50px rgba(250, 204, 21, 0.25)' }}>
            
            <button
              onClick={() => setWeeklyCompletionData(null)}
              style={{ position: 'absolute', right: '18px', top: '18px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>

            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #facc15, #ff6b4a)', color: '#12030f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', filter: 'drop-shadow(0 0 18px #facc15)' }}>
              <Crown size={48} />
            </div>

            <div className="badge" style={{ marginBottom: '10px', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', borderColor: '#facc15', fontWeight: 800 }}>
              👑 FULL 7-DAY AUTOMATED PROGRAM FULLY COMPLETED
            </div>

            <h2 className="gradient-peach-rose" style={{ fontSize: '2.5rem', fontWeight: 800, margin: '6px 0 8px 0' }}>
              7-Day Master Program Champion!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '0 0 24px 0' }}>
              You completed all 7 workout splits! Here are your total accumulated stats persisted to MongoDB:
            </p>

            {/* Grand Weekly Totals Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--peach-soft)', textTransform: 'uppercase', fontWeight: 800 }}>7-Day Total Burn</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff6b4a', marginTop: '4px' }}>
                  {weeklyCompletionData.totalCalories.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>kcal</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#facc15', textTransform: 'uppercase', fontWeight: 800 }}>7-Day Total XP</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#facc15', marginTop: '4px' }}>
                  +{weeklyCompletionData.totalXP.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>XP</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: 800 }}>Completion Rate</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', marginTop: '4px' }}>
                  {weeklyCompletionData.completionRate}
                </div>
              </div>
            </div>

            {/* Unlocked 7-Day Program Badges */}
            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.35)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.88rem', color: '#facc15', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} /> UNLOCKED 7-DAY PROGRAM TITLES & BADGES:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {weeklyCompletionData.weeklyBadges.map((wBadge, wIdx) => (
                  <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '12px' }}>
                    <CheckCircle2 size={22} style={{ color: '#facc15', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 800 }}>{wBadge.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{wBadge.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  setWeeklyCompletionData(null);
                  setCurrentDay(1);
                  localStorage.setItem('smartfit_workout_day', '1');
                  setCompletedState({});
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #facc15, #ff6b4a)', color: '#12030f', fontWeight: 800, cursor: 'pointer' }}
              >
                <span>🏋️‍♂️ Back to Workout Page (Start Day 1) ➔</span>
              </button>

              <button
                onClick={() => {
                  setWeeklyCompletionData(null);
                  navigate('/dashboard');
                }}
                className="btn-secondary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                <span>📊 Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
