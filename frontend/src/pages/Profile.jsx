import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Activity, Heart, Flame, Scale, Gauge, Edit3, Save, 
  CheckCircle2, User, Cpu, ArrowRight, Database, Users, 
  ShieldCheck, Info, X, Zap, Award, Sparkles, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, registeredAccounts, login, updateProfile } = useAuth();
  const [dbUsers, setDbUsers] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const profile = user || {
    fullName: 'Alex Morgan',
    email: 'alex@example.com',
    age: 26,
    gender: 'Male',
    height: 178,
    weight: 75,
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Muscle Building',
    dietaryPreference: 'Standard Balanced',
    workoutEquipment: 'Full Gym Access',
    medicalConditions: 'None',
    streakDays: 14,
    points: 1450
  };

  // Form state for editing biometrics
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    age: profile.age || 26,
    gender: profile.gender || 'Male',
    height: profile.height || 178,
    weight: profile.weight || 75,
    activityLevel: profile.activityLevel || 'Moderately Active',
    fitnessGoal: profile.fitnessGoal || 'Muscle Building',
    dietaryPreference: profile.dietaryPreference || 'Standard Balanced',
    workoutEquipment: profile.workoutEquipment || 'Full Gym Access',
    medicalConditions: profile.medicalConditions || 'None'
  });

  useEffect(() => {
    setFormData({
      fullName: profile.fullName || '',
      age: profile.age || 26,
      gender: profile.gender || 'Male',
      height: profile.height || 178,
      weight: profile.weight || 75,
      activityLevel: profile.activityLevel || 'Moderately Active',
      fitnessGoal: profile.fitnessGoal || 'Muscle Building',
      dietaryPreference: profile.dietaryPreference || 'Standard Balanced',
      workoutEquipment: profile.workoutEquipment || 'Full Gym Access',
      medicalConditions: profile.medicalConditions || 'None'
    });
  }, [profile]);

  useEffect(() => {
    fetch('http://localhost:8081/api/users/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbUsers(data);
        }
        setLoadingDb(false);
      })
      .catch(err => {
        console.warn('Backend DB users fetch note:', err);
        setLoadingDb(false);
      });
  }, []);

  // Biometric Calculations
  const weightNum = parseFloat(profile.weight) || 75;
  const heightNum = parseFloat(profile.height) || 178;
  const ageNum = parseFloat(profile.age) || 26;

  // 1. BMI Calculation
  const heightM = heightNum / 100;
  const bmi = parseFloat((weightNum / (heightM * heightM)).toFixed(1));
  
  let bmiCategory = 'Normal Weight';
  let bmiColor = '#4ade80';
  let bmiDesc = 'Healthy weight range. Optimal metric for cardiovascular and physical longevity.';
  if (bmi < 18.5) { 
    bmiCategory = 'Underweight'; 
    bmiColor = '#60a5fa';
    bmiDesc = 'Below recommended body mass. Consider controlled caloric surplus and lean strength training.';
  } else if (bmi <= 24.9) { 
    bmiCategory = 'Normal Weight'; 
    bmiColor = '#4ade80';
    bmiDesc = 'Healthy weight range. Optimal metric for cardiovascular and metabolic efficiency.';
  } else if (bmi <= 29.9) { 
    bmiCategory = 'Overweight'; 
    bmiColor = '#facc15';
    bmiDesc = 'Slightly above normal body mass. Consider progressive fat loss with calorie deficit.';
  } else { 
    bmiCategory = 'Obese'; 
    bmiColor = '#f87171';
    bmiDesc = 'Elevated health risks. Focus on sustainable metabolic conditioning and dietary balance.';
  }

  const idealWeightMin = (18.5 * heightM * heightM).toFixed(1);
  const idealWeightMax = (24.9 * heightM * heightM).toFixed(1);
  const bmiPositionPercent = Math.min(95, Math.max(5, ((bmi - 15) / 25) * 100));

  // 2. BMR Calculation (Mifflin-St Jeor)
  const isFemale = profile.gender?.toLowerCase() === 'female';
  const bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + (isFemale ? -161 : 5));

  // 3. TDEE Calculation
  let actMult = 1.55;
  const act = profile.activityLevel?.toLowerCase() || '';
  if (act.includes('sedentary')) actMult = 1.2;
  else if (act.includes('light')) actMult = 1.375;
  else if (act.includes('moderate')) actMult = 1.55;
  else if (act.includes('very')) actMult = 1.725;
  else if (act.includes('extra')) actMult = 1.9;

  const tdee = Math.round(bmr * actMult);

  // 4. Target Calories & Macro Split
  const goal = profile.fitnessGoal?.toLowerCase() || '';
  let calorieAdjustment = 0;
  let goalLabel = 'Maintenance Target';

  if (goal.includes('loss') || goal.includes('cut')) {
    calorieAdjustment = -500;
    goalLabel = 'Caloric Deficit (-500 kcal)';
  } else if (goal.includes('muscle') || goal.includes('gain') || goal.includes('bulk')) {
    calorieAdjustment = 350;
    goalLabel = 'Caloric Surplus (+350 kcal)';
  }

  const targetCalories = Math.max(1200, tdee + calorieAdjustment);
  const proteinGrams = Math.round(weightNum * 2.2);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.max(0, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));

  // 5. Fitness Score Calculation (0 - 100)
  const bmiScore = (bmi >= 18.5 && bmi <= 24.9) ? 30 : Math.max(10, Math.round(30 - Math.abs(bmi - 21.7) * 2.5));
  const actScore = actMult >= 1.725 ? 25 : (actMult >= 1.55 ? 20 : (actMult >= 1.375 ? 15 : 10));
  const streakDays = profile.streakDays || 14;
  const streakBonus = Math.min(25, Math.round(streakDays * 1.5));
  const med = profile.medicalConditions?.toLowerCase() || 'none';
  const healthRiskScore = (med === 'none' || med === '') ? 20 : 15;

  const fitnessScore = Math.min(100, bmiScore + actScore + streakBonus + healthRiskScore);

  let scoreGrade = 'Peak Fitness';
  let scoreColor = '#4ade80';
  if (fitnessScore < 60) { scoreGrade = 'Needs Attention'; scoreColor = '#f87171'; }
  else if (fitnessScore < 75) { scoreGrade = 'Moderate Fitness'; scoreColor = '#facc15'; }
  else if (fitnessScore < 90) { scoreGrade = 'Great Health'; scoreColor = '#38bdf8'; }

  // Combine DB users and frontend registered accounts
  const allAccounts = dbUsers.length > 0 ? dbUsers : registeredAccounts;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setShowEditModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>

          {/* Module 1 Header Banner */}
          <div style={{ textDecoration: 'none', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div className="badge" style={{ marginBottom: '10px' }}>
                  <Sparkles size={14} /> Health Profile Engine
                </div>
                <h1 className="gradient-peach-rose" style={{ fontSize: '2.5rem', marginBottom: '6px' }}>
                  Health Profile & Biometric Metrics
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                  Personalized biometrics, metabolic rates, energy expenditure, and AI Fitness Score for <strong style={{ color: '#fff' }}>{profile.fullName}</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <Edit3 size={18} />
                  <span>Edit Health Biometrics</span>
                </button>
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div style={{ background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', borderRadius: '14px', padding: '16px 20px', marginBottom: '28px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={22} />
              <span style={{ fontWeight: 600 }}>Health Profile parameters updated and synced successfully!</span>
            </div>
          )}

          {/* Main Active Account Card */}
          <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '32px', borderLeft: '5px solid var(--peach-primary)', background: 'linear-gradient(135deg, rgba(255,158,125,0.08) 0%, rgba(18,20,30,0.8) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--peach-primary), #ff7878)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, boxShadow: '0 4px 15px rgba(255,158,125,0.3)' }}>
                  {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{profile.fullName}</h2>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '2px 10px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Signed In
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    {profile.email} • {profile.age} yrs • {profile.gender} • {profile.height} cm • {profile.weight} kg
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Consistency Streak</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--peach-light)' }}>🔥 {streakDays} Days</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>SmartFit Points</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#facc15' }}>⚡ {profile.points || 250} XP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 1: 5 Core Health Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>

            {/* Metric 1: BMI */}
            <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Scale size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>BMI (Body Mass Index)</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Weight / Height² Ratio</span>
                    </div>
                  </div>
                  <span style={{ background: `${bmiColor}22`, color: bmiColor, border: `1px solid ${bmiColor}44`, padding: '4px 12px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {bmiCategory}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '20px 0 12px 0' }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fff' }}>{bmi}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>kg/m²</div>
                </div>

                {/* BMI Visual Progress Gauge */}
                <div style={{ marginTop: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>
                    <span>15.0</span>
                    <span>18.5 (Normal)</span>
                    <span>25.0</span>
                    <span>30.0+</span>
                  </div>
                  <div style={{ position: 'relative', height: '10px', width: '100%', borderRadius: '6px', background: 'linear-gradient(to right, #60a5fa 0%, #4ade80 25%, #facc15 65%, #f87171 100%)' }}>
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: `${bmiPositionPercent}%`, 
                        top: '-4px', 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '50%', 
                        background: '#fff', 
                        border: `3px solid ${bmiColor}`, 
                        transform: 'translateX(-50%)', 
                        boxShadow: '0 0 8px rgba(0,0,0,0.5)' 
                      }} 
                    />
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {bmiDesc}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '16px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Ideal Weight Range ({profile.height} cm): </span>
                <strong style={{ color: 'var(--peach-light)' }}>{idealWeightMin} kg – {idealWeightMax} kg</strong>
              </div>
            </div>

            {/* Metric 2: BMR */}
            <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>BMR (Basal Metabolic Rate)</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Resting Metabolic Rate</span>
                    </div>
                  </div>
                  <span className="chip chip-peach" style={{ fontSize: '0.8rem' }}>Mifflin-St Jeor</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '20px 0 12px 0' }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fff' }}>{bmr.toLocaleString()}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>kcal / day</div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  The total calories your body burns at complete rest during 24 hours to maintain essential life functions (heart beat, brain function, cellular repair).
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '16px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Base Formula: </span>
                <span style={{ color: '#fff' }}>10(w) + 6.25(h) - 5(age) {isFemale ? '- 161' : '+ 5'}</span>
              </div>
            </div>

            {/* Metric 3: TDEE */}
            <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Flame size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>TDEE (Total Daily Energy)</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Maintenance Expenditure</span>
                    </div>
                  </div>
                  <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.825rem', fontWeight: 700 }}>
                    x{actMult} Multiplier
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '20px 0 12px 0' }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fff' }}>{tdee.toLocaleString()}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>kcal / day</div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Total energy burned daily taking into account your physical activity level (<strong style={{ color: '#fff' }}>{profile.activityLevel}</strong>). Consuming this amount maintains your current body mass.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '16px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Active Activity Output: </span>
                <strong style={{ color: '#facc15' }}>+{(tdee - bmr).toLocaleString()} kcal</strong> burned from physical movement
              </div>
            </div>

            {/* Metric 4: Target Calories & Macros */}
            <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Activity size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Target Daily Calories</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Goal-Adjusted Nutrition</span>
                    </div>
                  </div>
                  <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.825rem', fontWeight: 700 }}>
                    {goalLabel}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '20px 0 16px 0' }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--peach-light)' }}>{targetCalories.toLocaleString()}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>kcal / day</div>
                </div>

                {/* Macro Split Bars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 158, 125, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 158, 125, 0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--peach-soft)', fontWeight: 700 }}>PROTEIN</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{proteinGrams}g</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{proteinGrams * 4} kcal</div>
                  </div>

                  <div style={{ background: 'rgba(96, 165, 250, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>CARBS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{carbGrams}g</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{carbGrams * 4} kcal</div>
                  </div>

                  <div style={{ background: 'rgba(250, 204, 21, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(250, 204, 21, 0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 700 }}>FATS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{fatGrams}g</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{fatGrams * 9} kcal</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '16px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Target Goal: </span>
                <strong style={{ color: '#fff' }}>{profile.fitnessGoal} ({profile.dietaryPreference})</strong>
              </div>
            </div>

          </div>

          {/* Metric 5: AI Fitness Score (Full Banner Card) */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '36px', background: 'linear-gradient(135deg, rgba(255,158,125,0.12) 0%, rgba(20,24,38,0.9) 100%)', border: '1px solid rgba(255,158,125,0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'center' }}>

              {/* Score Circular Radial Gauge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: '24px' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="160" height="160" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="transparent" 
                      stroke={scoreColor} 
                      strokeWidth="10" 
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - fitnessScore / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{fitnessScore}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>OUT OF 100</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <span style={{ background: `${scoreColor}22`, color: scoreColor, border: `1px solid ${scoreColor}44`, padding: '6px 16px', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 800 }}>
                    {scoreGrade}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginTop: '8px' }}>SmartFit AI Overall Rating</div>
                </div>
              </div>

              {/* 4 Factor Breakdown */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Award size={24} style={{ color: 'var(--peach-primary)' }} />
                  <h3 style={{ fontSize: '1.35rem', color: '#fff', margin: 0 }}>AI Health & Readiness Score Composition</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-subtle)' }}>BMI Optimality</span>
                      <strong style={{ color: '#fff' }}>{bmiScore} / 30 pts</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(bmiScore/30)*100}%`, height: '100%', background: '#4ade80' }} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-subtle)' }}>Activity Factor</span>
                      <strong style={{ color: '#fff' }}>{actScore} / 25 pts</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(actScore/25)*100}%`, height: '100%', background: '#60a5fa' }} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-subtle)' }}>Streak & Consistency</span>
                      <strong style={{ color: '#fff' }}>{streakBonus} / 25 pts</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(streakBonus/25)*100}%`, height: '100%', background: '#facc15' }} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-subtle)' }}>Health & Safeguard Index</span>
                      <strong style={{ color: '#fff' }}>{healthRiskScore} / 20 pts</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(healthRiskScore/20)*100}%`, height: '100%', background: 'var(--peach-primary)' }} />
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,158,125,0.08)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,158,125,0.2)', fontSize: '0.88rem', color: 'var(--peach-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} />
                  <span>Tip: Maintaining a 20+ day workout streak and keeping activity at Moderately Active boosts your score to 95+.</span>
                </div>
              </div>

            </div>
          </div>



          {/* Navigation to Dashboard */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
              <span>Go to SmartFit Dashboard</span>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </main>

      {/* Edit Health Profile Biometrics Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: '1px solid var(--peach-primary)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={24} style={{ color: 'var(--peach-primary)' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Edit Health Biometrics</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.fullName} 
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Age (yrs)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.age} 
                    min="13" 
                    max="120"
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 26 })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Gender</label>
                  <select 
                    className="input-field" 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Height (cm)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.height} 
                    min="50" 
                    max="250"
                    onChange={e => setFormData({ ...formData, height: parseFloat(e.target.value) || 178 })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="input-field" 
                    value={formData.weight} 
                    min="20" 
                    max="300"
                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) || 75 })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Activity Level</label>
                  <select 
                    className="input-field" 
                    value={formData.activityLevel} 
                    onChange={e => setFormData({ ...formData, activityLevel: e.target.value })}
                  >
                    <option value="Sedentary">Sedentary (Little or no exercise)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                    <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                    <option value="Very Active">Very Active (6-7 days/week)</option>
                    <option value="Extra Active">Extra Active (Hard exercise & job)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Fitness Goal</label>
                  <select 
                    className="input-field" 
                    value={formData.fitnessGoal} 
                    onChange={e => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  >
                    <option value="Muscle Building">Muscle Building (+350 kcal)</option>
                    <option value="Weight Loss">Weight Loss (-500 kcal)</option>
                    <option value="Fat Loss">Fat Loss & Toning (-350 kcal)</option>
                    <option value="Maintenance">Maintenance (TDEE)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Dietary Preference</label>
                  <select 
                    className="input-field" 
                    value={formData.dietaryPreference} 
                    onChange={e => setFormData({ ...formData, dietaryPreference: e.target.value })}
                  >
                    <option value="Standard Balanced">Standard Balanced</option>
                    <option value="High Protein">High Protein</option>
                    <option value="Keto / Low Carb">Keto / Low Carb</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Medical Conditions / Past Injuries</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.medicalConditions} 
                  onChange={e => setFormData({ ...formData, medicalConditions: e.target.value })}
                  placeholder="e.g. None, Asthma, Lower Back Pain"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  <Save size={18} />
                  <span>Save & Recalculate Metrics</span>
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
