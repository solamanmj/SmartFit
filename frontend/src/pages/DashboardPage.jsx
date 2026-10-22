import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, Activity, Dumbbell, Utensils, Zap, BarChart3, HelpCircle, CheckCircle2, TrendingUp, RefreshCw, Calendar, Award } from 'lucide-react';

export default function DashboardPage({ userData }) {
  const profile = userData || {
    fullName: 'Alex Morgan',
    fitnessGoal: 'Muscle Building',
    dietaryPreference: 'Standard Balanced',
    workoutEquipment: 'Full Gym Access',
    medicalConditions: 'None'
  };

  const [activeTab, setActiveTab] = useState('workout');

  return (
    <div className="dashboard-page-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge" style={{ marginBottom: '8px' }}>
              <Zap size={14} /> SmartFit AI Engine • Active
            </div>
            <h1 className="gradient-peach-rose" style={{ fontSize: '2.4rem' }}>
              Welcome back, {profile.fullName.split(' ')[0]}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
              Goal: <strong style={{ color: 'var(--peach-light)' }}>{profile.fitnessGoal}</strong> • Equipment: <strong style={{ color: 'var(--peach-light)' }}>{profile.workoutEquipment}</strong>
            </p>
          </div>

          <button onClick={() => alert('AI Re-calculating workout & recovery parameters based on recent biometric logs...')} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.875rem' }}>
            <RefreshCw size={16} />
            <span>Refresh AI Model</span>
          </button>
        </div>

        {/* Dashboard Top Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
          
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontWeight: 600 }}>RECOVERY SCORE</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>94%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--peach-light)', marginTop: '4px' }}>
              High Readiness for Heavy Push Day
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontWeight: 600 }}>TARGET CALORIES</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>2,450 kcal</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--peach-light)', marginTop: '4px' }}>
              165g P • 245g C • 68g F
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontWeight: 600 }}>WEEKLY WORKOUTS</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>4 / 4 Sessions</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--peach-light)', marginTop: '4px' }}>
              100% Target Met This Week
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontWeight: 600 }}>XAI SAFETY INDEX</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255, 158, 125, 0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Optimal</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--peach-light)', marginTop: '4px' }}>
              Safeguards Active ({profile.medicalConditions})
            </div>
          </div>

        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', borderBottom: '1px solid rgba(255,158,125,0.15)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('workout')}
            className={`btn-secondary ${activeTab === 'workout' ? 'active' : ''}`}
            style={{
              background: activeTab === 'workout' ? 'var(--peach-primary)' : 'transparent',
              color: activeTab === 'workout' ? '#12030f' : 'var(--text-muted)',
              border: activeTab === 'workout' ? 'none' : '1px solid var(--glass-border)',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          >
            🏋️ AI Today's Workout
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`btn-secondary ${activeTab === 'nutrition' ? 'active' : ''}`}
            style={{
              background: activeTab === 'nutrition' ? 'var(--peach-primary)' : 'transparent',
              color: activeTab === 'nutrition' ? '#12030f' : 'var(--text-muted)',
              border: activeTab === 'nutrition' ? 'none' : '1px solid var(--glass-border)',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          >
            🥗 AI Meal & Macro Recommendations
          </button>
          <button
            onClick={() => setActiveTab('xai')}
            className={`btn-secondary ${activeTab === 'xai' ? 'active' : ''}`}
            style={{
              background: activeTab === 'xai' ? 'var(--peach-primary)' : 'transparent',
              color: activeTab === 'xai' ? '#12030f' : 'var(--text-muted)',
              border: activeTab === 'xai' ? 'none' : '1px solid var(--glass-border)',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 700
            }}
          >
            🔍 XAI Explainability Metrics
          </button>
        </div>

        {/* TAB CONTENTS */}

        {/* Tab 1: AI Workout Plan */}
        {activeTab === 'workout' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="gradient-peach-rose" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                  Today's Session: Hypertrophy Upper Push Split
                </h2>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  Target Volume: 16 Sets • Estimated Duration: 50 Mins • Intensity: 8.5/10
                </p>
              </div>
              <span className="badge">AI Personalized</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Incline Dumbbell Chest Press', sets: '4 Sets × 8-10 Reps', weight: '28 kg', rpe: 'RPE 8', note: 'AI adjusted angle to protect shoulders' },
                { name: 'Seated Cable Chest Flyes', sets: '3 Sets × 12-15 Reps', weight: '18 kg', rpe: 'RPE 9', note: 'Focus on peak contraction & slow eccentric' },
                { name: 'Standing Overhead Dumbbell Press', sets: '3 Sets × 10-12 Reps', weight: '20 kg', rpe: 'RPE 8', note: 'Optimized for collarbone stability' },
                { name: 'Cable Lateral Raise Drop Sets', sets: '3 Sets × 15 Reps', weight: '10 kg', rpe: 'RPE 9.5', note: 'Max hypertrophy stimulus' },
                { name: 'Rope Triceps Pushdowns', sets: '3 Sets × 12 Reps', weight: '25 kg', rpe: 'RPE 9', note: 'Strict elbow isolation' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,158,125,0.06)', padding: '18px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,158,125,0.2)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--peach-soft)' }}>💡 {item.note}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--peach-light)', fontSize: '1rem' }}>{item.sets}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-subtle)' }}>Target: {item.weight} • {item.rpe}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => alert('Workout completed! Workout log saved to SmartFit neural model.')} className="btn-primary" style={{ width: '100%', marginTop: '28px' }}>
              <span>Log & Complete Today's Workout</span>
              <CheckCircle2 size={18} />
            </button>
          </div>
        )}

        {/* Tab 2: AI Meal & Nutrition Plan */}
        {activeTab === 'nutrition' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="gradient-peach-rose" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                  Daily Macro & Meal Breakdown
                </h2>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  Preference: <strong style={{ color: 'var(--peach-light)' }}>{profile.dietaryPreference}</strong> • Target Caloric Goal: 2,450 kcal
                </p>
              </div>
              <span className="badge">Metabolic Sync</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>PROTEIN TARGET</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>165 grams</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>4 kcal / gram</div>
              </div>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>CARBOHYDRATE TARGET</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>245 grams</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>4 kcal / gram</div>
              </div>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>FAT TARGET</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>68 grams</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>9 kcal / gram</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { time: 'Meal 1 (Breakfast)', title: 'Oatmeal & Whey Protein with Blueberries & Almond Butter', macros: '550 kcal • 42g P • 60g C • 14g F' },
                { time: 'Meal 2 (Lunch)', title: 'Grilled Chicken Breast, Quinoa & Steamed Broccoli', macros: '650 kcal • 52g P • 65g C • 15g F' },
                { time: 'Meal 3 (Pre-Workout)', title: 'Greek Yogurt with Honey & Rice Cakes', macros: '350 kcal • 25g P • 45g C • 4g F' },
                { time: 'Meal 4 (Dinner)', title: 'Pan-Seared Salmon, Sweet Potato & Asparagus', macros: '700 kcal • 46g P • 55g C • 28g F' },
              ].map((meal, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--peach-primary)', fontWeight: 700 }}>{meal.time}</div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginTop: '2px' }}>{meal.title}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--peach-light)', fontSize: '0.9rem' }}>
                    {meal.macros}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: XAI Explainability Metrics */}
        {activeTab === 'xai' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="gradient-peach-rose" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                  Explainable AI (XAI) Recommendation Logic
                </h2>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  Transparency engine detailing why each decision was made for your profile.
                </p>
              </div>
              <span className="badge">Transparent XAI</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--peach-light)', fontSize: '1.1rem', marginBottom: '8px' }}>
                  🔍 Why 2,450 Calories Was Recommended
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Based on your age ({profile.age}), weight ({profile.weight} kg), height ({profile.height} cm), and {profile.activityLevel} activity level, your BMR was calculated at baseline. Adding a +350 calorie surplus supports clean lean muscle growth without excessive fat gain.
                </p>
              </div>

              <div style={{ background: 'rgba(255,158,125,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--peach-light)', fontSize: '1.1rem', marginBottom: '8px' }}>
                  🛡️ Medical & Joint Safeguard Reasonings
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Selected medical condition profile: <strong style={{ color: '#fff' }}>{profile.medicalConditions}</strong>. SmartFit’s neural filter has automatically verified that no high-shear joint exercises are included in your 4-day split.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
