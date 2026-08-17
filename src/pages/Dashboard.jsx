import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Dumbbell, Utensils, Zap, Award, ArrowRight, ShieldCheck, 
  Target, Flame, Activity, Sparkles, LogOut, CheckCircle2, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAllRegisteredUsersApi } from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [registeredAccounts, setRegisteredAccounts] = useState([]);

  useEffect(() => {
    fetchAllRegisteredUsersApi().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setRegisteredAccounts(data);
      }
    });
  }, []);

  const profile = user || {
    fullName: 'John Doe',
    email: 'john@example.com',
    age: 21,
    gender: 'Male',
    height: 175,
    weight: 70,
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Weight Loss',
    dietaryPreference: 'Vegetarian',
    workoutEquipment: 'Dumbbells Only',
    medicalConditions: 'None'
  };

  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'John';

  // 1. BMI Calculation
  const weightNum = parseFloat(profile.weight) || 70;
  const heightNum = parseFloat(profile.height) || 175;
  const ageNum = parseFloat(profile.age) || 21;

  const heightMeters = heightNum / 100;
  const bmi = (weightNum / (heightMeters * heightMeters)).toFixed(1);

  // Dynamic WHO BMI Category Evaluation
  const bmiNum = parseFloat(bmi);
  let bmiCategory = 'Normal Weight';
  let bmiColor = '#4ade80';

  if (bmiNum < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#38bdf8';
  } else if (bmiNum >= 18.5 && bmiNum <= 24.9) {
    bmiCategory = 'Normal Weight';
    bmiColor = '#4ade80';
  } else if (bmiNum >= 25.0 && bmiNum <= 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = '#facc15';
  } else if (bmiNum >= 30.0) {
    bmiCategory = 'Obese';
    bmiColor = '#f87171';
  }

  // 2. BMR Calculation (Mifflin-St Jeor)
  const bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + (profile.gender === 'Female' ? -161 : 5));

  // 3. TDEE Calculation
  let actMultiplier = 1.55;
  const act = profile.activityLevel ? profile.activityLevel.toLowerCase() : '';
  if (act.includes('sedentary')) actMultiplier = 1.2;
  else if (act.includes('light')) actMultiplier = 1.375;
  else if (act.includes('very')) actMultiplier = 1.725;

  const tdee = Math.round(bmr * actMultiplier);

  // 4. Target Daily Calories
  const goal = profile.fitnessGoal ? profile.fitnessGoal.toLowerCase() : '';
  let targetCalories = tdee;
  if (goal.includes('loss') || goal.includes('fat')) targetCalories = tdee - 450;
  else if (goal.includes('muscle') || goal.includes('gain')) targetCalories = tdee + 350;

  // 5. Fitness Score (Out of 100)
  const bmiScore = (bmi >= 18.5 && bmi <= 24.9) ? 30 : Math.max(10, Math.round(30 - Math.abs(bmi - 22) * 2.5));
  const fitnessScore = Math.min(100, bmiScore + 25 + 20 + 10);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* User Welcome Banner Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge" style={{ marginBottom: '8px' }}>
                <Sparkles size={14} /> SMARTFIT USER DASHBOARD
              </div>
              <h1 className="gradient-peach-rose" style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
                Hello, {firstName} 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', marginTop: '6px' }}>
                MongoDB Database Active • Synchronized Profile Metrics
              </p>
            </div>
          </div>

          {/* 3 Core Biometric Cards: BMI | BMR | TDEE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px', marginBottom: '28px' }}>
            <div className="glass-card" style={{ padding: '26px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                BMI
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                {bmi}
              </div>
              <span style={{ fontSize: '0.78rem', color: bmiColor, fontWeight: 700, marginTop: '8px', display: 'inline-block' }}>
                {bmiCategory}
              </span>
            </div>

            <div className="glass-card" style={{ padding: '26px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                BMR
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                {bmr.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '8px', display: 'inline-block' }}>
                kcal / day
              </span>
            </div>

            <div className="glass-card" style={{ padding: '26px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                TDEE
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--peach-light)', lineHeight: 1.1 }}>
                {tdee.toLocaleString()}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '8px', display: 'inline-block' }}>
                kcal / day
              </span>
            </div>
          </div>

          {/* Daily Calories & Fitness Score & Today's Goal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px', marginBottom: '36px' }}>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--peach-soft)', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                <Flame size={16} style={{ color: '#ff6b4a' }} /> Daily Calories
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--peach-light)' }}>
                {targetCalories.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-subtle)' }}>kcal</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--peach-soft)', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                <Award size={16} style={{ color: '#facc15' }} /> Fitness Score
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
                {fitnessScore} <span style={{ fontSize: '1rem', color: 'var(--text-subtle)' }}>/ 100</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--peach-soft)', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                <Target size={16} style={{ color: '#38bdf8' }} /> Today's Goal
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                {profile.fitnessGoal}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '36px' }} />

          {/* Action Sections: Today's Workout & Today's Nutrition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px', marginBottom: '36px' }}>
            
            {/* Today's Workout */}
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,158,125,0.18)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Dumbbell size={26} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 8px 0' }}>Today's Workout</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.5', margin: 0 }}>
                  Customized session plan targeting your goal (<strong style={{ color: '#fff' }}>{profile.fitnessGoal}</strong>) using <strong style={{ color: 'var(--peach-light)' }}>{profile.workoutEquipment}</strong>.
                </p>
              </div>

              <div style={{ marginTop: '28px' }}>
                <button
                  onClick={() => navigate('/workout')}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.025rem' }}
                >
                  <span>View Workout</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Today's Nutrition */}
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,158,125,0.18)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Utensils size={26} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 8px 0' }}>Today's Nutrition</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.5', margin: 0 }}>
                  Tailored meal plan for <strong style={{ color: '#fff' }}>{targetCalories.toLocaleString()} kcal</strong> matching your preference (<strong style={{ color: 'var(--peach-light)' }}>{profile.dietaryPreference}</strong>).
                </p>
              </div>

              <div style={{ marginTop: '28px' }}>
                <button
                  onClick={() => navigate('/nutrition')}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.025rem' }}
                >
                  <span>View Meal Plan</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>

          {/* Registered Users Directory */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={22} style={{ color: 'var(--peach-primary)' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Registered Users Directory</h3>
              </div>
              <span className="badge" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                MongoDB Live Sync
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>User</th>
                    <th style={{ padding: '12px 14px' }}>Email</th>
                    <th style={{ padding: '12px 14px' }}>Age / Gender</th>
                    <th style={{ padding: '12px 14px' }}>Height / Weight</th>
                    <th style={{ padding: '12px 14px' }}>Fitness Goal</th>
                    <th style={{ padding: '12px 14px' }}>Diet Style</th>
                    <th style={{ padding: '12px 14px' }}>Session Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    profile,
                    ...(registeredAccounts.filter(a => a.email !== profile.email))
                  ].map((usr, idx) => (
                    <tr key={usr.email || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                        {usr.fullName || 'Registered User'}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--peach-light)' }}>
                        {usr.email}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {usr.age || 26} yrs • {usr.gender || 'Male'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {usr.height || 178} cm • {usr.weight || 75} kg
                      </td>
                      <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>
                        {usr.fitnessGoal || 'Muscle Building'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {usr.dietaryPreference || 'Standard Balanced'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          background: 'rgba(74, 222, 128, 0.15)',
                          color: '#4ade80',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
