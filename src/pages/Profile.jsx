import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User, Cpu, ArrowRight, ShieldCheck, Activity, Flame, HeartPulse,
  Dumbbell, Utensils, LogOut, CheckCircle2, Award, Zap, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const weightNum = parseFloat(profile.weight) || 75;
  const heightNum = parseFloat(profile.height) || 178;
  const ageNum = parseFloat(profile.age) || 26;

  // Health Metrics Calculations
  const heightMeters = heightNum / 100;
  const bmi = (weightNum / (heightMeters * heightMeters)).toFixed(1);

  let bmiCategory = 'Normal / Optimal Weight';
  let bmiColor = '#4ade80';
  if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiColor = '#38bdf8'; }
  else if (bmi > 24.9 && bmi <= 29.9) { bmiCategory = 'Overweight'; bmiColor = '#facc15'; }
  else if (bmi > 29.9) { bmiCategory = 'Obese'; bmiColor = '#f87171'; }

  const bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + (profile.gender === 'Female' ? -161 : 5));

  let actMultiplier = 1.55;
  if (profile.activityLevel?.toLowerCase().includes('sedentary')) actMultiplier = 1.2;
  else if (profile.activityLevel?.toLowerCase().includes('lightly')) actMultiplier = 1.375;
  else if (profile.activityLevel?.toLowerCase().includes('very')) actMultiplier = 1.725;
  else if (profile.activityLevel?.toLowerCase().includes('extremely')) actMultiplier = 1.9;

  const tdee = Math.round(bmr * actMultiplier);
  const targetCalories = profile.fitnessGoal?.toLowerCase().includes('muscle')
    ? tdee + 350
    : profile.fitnessGoal?.toLowerCase().includes('loss') || profile.fitnessGoal?.toLowerCase().includes('fat')
      ? tdee - 500
      : tdee;

  const proteinGrams = Math.round(weightNum * 2.2);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.max(0, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Hero Profile Banner */}
          <div className="glass-card" style={{ padding: '36px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 158, 125, 0.15) 0%, rgba(255, 107, 74, 0) 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--peach-primary), #ff6b4a)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '2rem',
                  boxShadow: '0 8px 24px rgba(255, 158, 125, 0.35)'
                }}>
                  {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      {profile.fullName || 'User Profile'}
                    </h1>
                    <span style={{
                      background: 'rgba(74, 222, 128, 0.15)',
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={13} /> Active Session
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                    {profile.email} • Member of SmartFit AI Engine
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: '0.2s'
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--peach-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Body Mass Index</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{bmi}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: bmiColor }}>{bmiCategory}</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--peach-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Target Calories</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--peach-light)' }}>{targetCalories}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>kcal / day</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--peach-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Basal Metabolic Rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{bmr}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>BMR kcal</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--peach-soft)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Daily Expenditure</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{tdee}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>TDEE kcal</span>
            </div>
          </div>

          {/* Main Grid: Biometrics & AI Macro Blueprint */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '28px' }}>

            {/* Biometrics Card */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)' }}>
                  <User size={22} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Biometric Parameters</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Age:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.age} years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Gender:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.gender}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Height:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.height} cm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Weight:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.weight} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Daily Activity:</span>
                  <span style={{ fontWeight: 600, color: 'var(--peach-light)' }}>{profile.activityLevel}</span>
                </div>
              </div>
            </div>

            {/* AI Macro Blueprint Card */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)' }}>
                  <Cpu size={22} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>AI Nutrition & Macro Split</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Flame size={15} style={{ color: '#ff6b4a' }} /> Protein Target
                    </span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{proteinGrams}g ({proteinGrams * 4} kcal)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #ff9e7d, #ff6b4a)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Utensils size={15} style={{ color: '#facc15' }} /> Carbohydrate Target
                    </span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{carbGrams}g ({carbGrams * 4} kcal)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: '#facc15', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={15} style={{ color: '#38bdf8' }} /> Healthy Fats Target
                    </span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{fatGrams}g ({fatGrams * 9} kcal)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '25%', height: '100%', background: '#38bdf8', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Lifestyle, Goals & Medical Safeguards */}
          <div className="glass-card" style={{ padding: '30px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={22} style={{ color: 'var(--peach-primary)' }} />
              Tailored Fitness Strategy & Safety Rules
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ background: 'rgba(255,158,125,0.06)', padding: '18px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Primary Goal</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} style={{ color: 'var(--peach-primary)' }} /> {profile.fitnessGoal}
                </div>
              </div>

              <div style={{ background: 'rgba(255,158,125,0.06)', padding: '18px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Dietary Style</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Utensils size={16} style={{ color: '#4ade80' }} /> {profile.dietaryPreference}
                </div>
              </div>

              <div style={{ background: 'rgba(255,158,125,0.06)', padding: '18px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Equipment</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Dumbbell size={16} style={{ color: '#38bdf8' }} /> {profile.workoutEquipment}
                </div>
              </div>

              <div style={{ background: 'rgba(255,158,125,0.06)', padding: '18px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Medical Rules</div>
                <div style={{ fontWeight: 700, color: profile.medicalConditions !== 'None' ? '#ff9e7d' : '#fff', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HeartPulse size={16} style={{ color: '#f87171' }} /> {profile.medicalConditions}
                </div>
              </div>
            </div>
          </div>

          {/* Database & Security Verification Footer */}
          <div className="glass-card" style={{ padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <ShieldCheck size={28} style={{ color: '#4ade80' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>MongoDB Database Synchronized</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', margin: '2px 0 0 0' }}>
                  Your profile biometrics & encrypted security credentials are stored in Spring Boot MongoDB (`smartfit_db`).
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'transparent',
                color: 'var(--peach-light)',
                border: '1px solid var(--peach-primary)',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Edit3 size={15} />
              <span>Update Biometrics</span>
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
