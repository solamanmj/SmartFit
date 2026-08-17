import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, ArrowRight, CheckCircle2, User, Activity, Dumbbell, Utensils, ShieldCheck, Cpu } from 'lucide-react';

export default function UserProfilePage({ userData }) {
  const navigate = useNavigate();

  // Fallback defaults if accessed directly
  const profile = userData || {
    fullName: 'Alex Morgan',
    age: '26',
    gender: 'Male',
    height: '178',
    weight: '75',
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Muscle Building',
    dietaryPreference: 'Standard Balanced',
    workoutEquipment: 'Full Gym Access',
    medicalConditions: 'None'
  };

  // AI Calculations based on the 9 parameters
  const weightNum = parseFloat(profile.weight) || 75;
  const heightNum = parseFloat(profile.height) || 178;
  const ageNum = parseFloat(profile.age) || 26;

  // Mifflin-St Jeor BMR Formula approximation
  const bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + (profile.gender === 'Female' ? -161 : 5));
  const tdee = Math.round(bmr * 1.55);
  const targetCalories = profile.fitnessGoal === 'Muscle Building' ? tdee + 350 : profile.fitnessGoal === 'Weight Loss' ? tdee - 450 : tdee;

  const proteinGrams = Math.round(weightNum * 2.2);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  return (
    <div className="profile-page-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>

          {/* Success Banner */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 158, 125, 0.2)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h1 className="gradient-peach-rose" style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
              SmartFit Profile Initialized
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Explainable AI has processed your 9 biometric parameters and generated your baseline physiological targets.
            </p>
          </div>

          {/* Summary Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>

            {/* Biometric Card */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <User size={22} style={{ color: 'var(--peach-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Biometric Summary</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Name:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.fullName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Age / Gender:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.age} yrs • {profile.gender}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Height / Weight:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{profile.height} cm • {profile.weight} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Activity Level:</span>
                  <span style={{ fontWeight: 600, color: 'var(--peach-light)' }}>{profile.activityLevel}</span>
                </div>
              </div>
            </div>

            {/* AI Calculations Card */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Cpu size={22} style={{ color: 'var(--peach-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>AI Caloric & Macro Targets</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Calculated BMR:</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{bmr} kcal/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Target Daily Energy (TDEE):</span>
                  <span style={{ fontWeight: 700, color: 'var(--peach-light)' }}>{targetCalories} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Macro Split (P / C / F):</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{proteinGrams}g / {carbGrams}g / {fatGrams}g</span>
                </div>
              </div>
            </div>

          </div>

          {/* Setup Preferences Detail Card */}
          <div className="glass-card" style={{ padding: '30px', marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '18px' }}>
              Tailored Settings & Safety Rules
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Fitness Goal</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{profile.fitnessGoal}</div>
              </div>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Dietary Preference</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{profile.dietaryPreference}</div>
              </div>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Medical Safeguards</div>
                <div style={{ fontWeight: 700, color: profile.medicalConditions !== 'None' ? '#ff9e7d' : '#fff', fontSize: '1.05rem' }}>{profile.medicalConditions}</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
              style={{ padding: '16px 40px', fontSize: '1.1rem' }}
            >
              <span>Go to SmartFit AI Dashboard</span>
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
