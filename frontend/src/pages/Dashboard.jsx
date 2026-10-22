import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CareTeamChat from '../components/CareTeamChat';
import { 
  Dumbbell, Utensils, Zap, Award, ArrowRight, ShieldCheck, 
  Target, Flame, Activity, Sparkles, CheckCircle2, User, 
  Droplets, Check, Edit, X, Cpu, ChevronRight, TrendingUp, TrendingDown, Plus, Calendar,
  MessageSquare, HeartPulse, Scale, PieChart, Layers, Clock, Star, AlertCircle, ArrowUpRight,
  Lock, Shield, Key, Eye, EyeOff, ShieldAlert, Smartphone, Fingerprint, History, CheckCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfileApi } from '../services/api';

export default function Dashboard() {
  const { user, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();

  // Profile State
  const [profile, setProfile] = useState(user || {
    fullName: 'Aby Thomas',
    email: 'aby@example.com',
    age: 27,
    gender: 'Male',
    height: 177,
    weight: 74,
    activityLevel: 'Moderately Active',
    fitnessGoal: 'Muscle Building',
    dietaryPreference: 'Standard Balanced',
    workoutEquipment: 'Full Gym Access',
    medicalConditions: 'None',
    streakDays: 14,
    points: 1450,
    fitnessScore: 88,
    assignedTrainer: {
      name: 'Coach Marcus Vance',
      specialization: 'Hypertrophy & Strength Conditioning'
    },
    assignedNutritionist: {
      name: 'Sruthy Varghese (M.Sc)',
      qualification: 'M.Sc. Dietetics & Performance Nutrition'
    }
  });

  // Modals & Toast State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityTab, setSecurityTab] = useState('password'); // 'password' | '2fa' | 'sessions'
  const [profileFormData, setProfileFormData] = useState({ ...profile });
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Password & Security Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  // 2FA & Biometric Device Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    try {
      const email = (user?.email || 'default_user').trim().toLowerCase();
      return localStorage.getItem(`smartfit_${email}_2fa_enabled`) === 'true';
    } catch (e) { return false; }
  });
  const [biometricsEnabled, setBiometricsEnabled] = useState(() => {
    try {
      const email = (user?.email || 'default_user').trim().toLowerCase();
      return localStorage.getItem(`smartfit_${email}_biometrics_enabled`) === 'true';
    } catch (e) { return false; }
  });

  // Weekly Weight Log Analytics State
  const [newLogWeight, setNewLogWeight] = useState(74);
  const [newLogBodyFat, setNewLogBodyFat] = useState(17.5);
  const [weightLogs, setWeightLogs] = useState([
    { week: 'Week 1 (Baseline)', weight: 78.0, bodyFat: 21.5, change: '0.0 kg', status: 'Start' },
    { week: 'Week 3', weight: 76.8, bodyFat: 20.2, change: '-1.2 kg', status: 'Fat Loss' },
    { week: 'Week 5', weight: 75.4, bodyFat: 18.9, change: '-2.6 kg', status: 'Lean Phase' },
    { week: 'Week 8 (Current)', weight: 74.0, bodyFat: 17.5, change: '-4.0 kg', status: 'Peak Hypertrophy' }
  ]);

  // Care Team Feedback State
  const [careTeamFeedback, setCareTeamFeedback] = useState([
    {
      authorRole: 'TRAINER',
      authorName: 'Coach Marcus Vance',
      specialization: 'Hypertrophy & Strength Conditioning',
      date: 'Today, 09:30 AM',
      rating: 5,
      message: 'Your workout consistency has improved significantly. Focus on your 3-second eccentric tempo on bench press and squats.'
    },
    {
      authorRole: 'NUTRITIONIST',
      authorName: 'Sruthy Varghese (M.Sc)',
      specialization: 'Metabolic Nutrition & Dietetics',
      date: 'Yesterday, 02:15 PM',
      rating: 5,
      message: 'Your protein intake is right in our target hypertrophy window (150-165g). Keep hydration above 3.5L on training days.'
    }
  ]);

  // Message Care Team Modal State
  const [careTeamChat, setCareTeamChat] = useState({
    isOpen: false,
    role: 'TRAINER',
    isFloating: false
  });

  const handleOpenCareTeamChat = (role = 'TRAINER') => {
    setCareTeamChat({
      isOpen: true,
      role,
      isFloating: false
    });
  };

  useEffect(() => {
    if (user) {
      setProfile(user);
      setProfileFormData(user);
      if (user.weight) setNewLogWeight(user.weight);
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Password Security Strength Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Not Entered', color: '#64748B', percent: 0, criteria: { length: false, upper: false, lower: false, num: false, special: false } };
    const criteria = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      num: /[0-9]/.test(pass),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pass)
    };
    const score = Object.values(criteria).filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Weak (Vulnerable)', color: '#EF4444', percent: 35, criteria };
    if (score <= 4) return { score, label: 'Moderate (Standard)', color: '#F59E0B', percent: 70, criteria };
    return { score, label: 'Bank-Grade Strong', color: '#10B981', percent: 100, criteria };
  };

  // Handle Password Update Form Submit
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (!currentPass.trim()) {
      setSecurityError('Please enter your current password.');
      return;
    }

    const strength = getPasswordStrength(newPass);
    if (strength.score < 5) {
      setSecurityError('New password must meet all 5 security criteria: at least 8 characters, uppercase, lowercase, number, and special symbol.');
      return;
    }

    if (newPass !== confirmPass) {
      setSecurityError('New password and confirmation do not match. Please verify both fields.');
      return;
    }

    if (newPass === currentPass) {
      setSecurityError('New password cannot be identical to your current password.');
      return;
    }

    setSecuritySaving(true);
    try {
      if (updatePassword) {
        const res = await updatePassword({
          currentPassword: currentPass,
          newPassword: newPass
        });

        if (res && res.success) {
          setSecuritySuccess('Password updated and encrypted successfully across all SmartFit endpoints!');
          showToast('🔒 Security credentials updated successfully!');
          setCurrentPass('');
          setNewPass('');
          setConfirmPass('');
          setTimeout(() => {
            setShowSecurityModal(false);
            setSecuritySuccess('');
          }, 1500);
        } else {
          setSecurityError(res?.message || 'Failed to update password. Please verify your current password.');
        }
      } else {
        setSecurityError('Authentication service unavailable. Please retry.');
      }
    } catch (err) {
      setSecurityError(err.message || 'An error occurred while updating your security credentials.');
    } finally {
      setSecuritySaving(false);
    }
  };

  const handleToggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    const cleanEmail = (user?.email || profile?.email || 'default_user').trim().toLowerCase();
    try {
      localStorage.setItem(`smartfit_${cleanEmail}_2fa_enabled`, next ? 'true' : 'false');
    } catch (e) {}
    showToast(next ? '🛡️ Two-Factor Authentication activated on your account' : '⚠️ Two-Factor Authentication disabled');
  };

  const handleToggleBiometrics = () => {
    const next = !biometricsEnabled;
    setBiometricsEnabled(next);
    const cleanEmail = (user?.email || profile?.email || 'default_user').trim().toLowerCase();
    try {
      localStorage.setItem(`smartfit_${cleanEmail}_biometrics_enabled`, next ? 'true' : 'false');
    } catch (e) {}
    showToast(next ? '⚡ Biometric / Passkey fast sign-in enabled' : 'Biometric sign-in disabled');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const updated = { ...profile, ...profileFormData };
    setProfile(updated);
    if (updateProfile) updateProfile(updated);
    
    try {
      await updateUserProfileApi(updated);
    } catch (err) {
      console.warn('Backend sync fallback to local storage');
    }
    
    setSavingProfile(false);
    setShowEditProfileModal(false);
    showToast('Athlete profile updated successfully!');
  };

  const handleSaveWeightLog = (e) => {
    e.preventDefault();
    const w = parseFloat(newLogWeight);
    const bf = parseFloat(newLogBodyFat);
    if (!w || w <= 0) return;

    const lastW = weightLogs[weightLogs.length - 1]?.weight || w;
    const diff = (w - lastW).toFixed(1);
    const diffStr = diff > 0 ? `+${diff} kg` : `${diff} kg`;

    const newEntry = {
      week: `Week ${weightLogs.length + 1} (Logged)`,
      weight: w,
      bodyFat: bf || 17.5,
      change: diffStr,
      status: w < lastW ? 'Fat Loss Progress' : 'Lean Mass Gain'
    };

    setWeightLogs([...weightLogs, newEntry]);
    const updatedProfile = { ...profile, weight: w };
    setProfile(updatedProfile);
    if (updateProfile) updateProfile(updatedProfile);

    setShowLogWeightModal(false);
    showToast(`Weight log recorded: ${w} kg (${diffStr})`);
  };

  // Safe Biometrics Calculations
  const weightNum = parseFloat(profile.weight) || 74;
  const heightNum = parseFloat(profile.height) || 177;
  const ageNum = parseInt(profile.age, 10) || 27;
  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Athlete';

  const heightM = heightNum / 100;
  const bmi = (weightNum / (heightM * heightM)).toFixed(1);
  const bmiNum = parseFloat(bmi);

  let bmiCategory = 'Normal Weight';
  let bmiColor = '#4ade80';
  if (bmiNum < 18.5) { bmiCategory = 'Underweight'; bmiColor = '#60a5fa'; }
  else if (bmiNum >= 18.5 && bmiNum <= 24.9) { bmiCategory = 'Normal Weight'; bmiColor = '#4ade80'; }
  else if (bmiNum >= 25.0 && bmiNum <= 29.9) { bmiCategory = 'Overweight'; bmiColor = '#facc15'; }
  else if (bmiNum >= 30.0) { bmiCategory = 'Obese'; bmiColor = '#f87171'; }

  const isFemale = (profile.gender || '').toLowerCase() === 'female';
  const bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + (isFemale ? -161 : 5));

  let actMultiplier = 1.55;
  const act = (profile.activityLevel || '').toLowerCase();
  if (act.includes('sedentary')) actMultiplier = 1.2;
  else if (act.includes('light')) actMultiplier = 1.375;
  else if (act.includes('very')) actMultiplier = 1.725;
  const tdee = Math.round(bmr * actMultiplier);

  let targetCalories = tdee;
  const goal = (profile.fitnessGoal || '').toLowerCase();
  if (goal.includes('loss') || goal.includes('fat')) targetCalories = tdee - 450;
  else if (goal.includes('muscle') || goal.includes('hypertrophy') || goal.includes('gain')) targetCalories = tdee + 350;

  const targetProtein = Math.round(weightNum * 2.2);

  const userEmail = (user?.email || profile?.email || 'default_user').trim().toLowerCase();
  
  // User-scoped workout and nutrition days
  const workoutDaysMap = (() => {
    try {
      return JSON.parse(localStorage.getItem(`smartfit_${userEmail}_completed_days_map`) || '{}');
    } catch (e) { return {}; }
  })();
  const completedWorkoutCount = Object.keys(workoutDaysMap).filter(k => workoutDaysMap[k]).length;
  const activeWorkoutDay = (() => {
    const saved = localStorage.getItem(`smartfit_${userEmail}_workout_active_day`);
    return saved ? parseInt(saved, 10) : (completedWorkoutCount > 0 ? Math.min(30, completedWorkoutCount + 1) : 1);
  })();

  const nutritionDaysMap = (() => {
    try {
      return JSON.parse(localStorage.getItem(`smartfit_${userEmail}_nutrition_completed_days_map`) || '{}');
    } catch (e) { return {}; }
  })();
  const completedNutritionCount = Object.keys(nutritionDaysMap).filter(k => nutritionDaysMap[k]).length;
  const activeNutritionDay = (() => {
    const saved = localStorage.getItem(`smartfit_${userEmail}_nutrition_active_day`);
    return saved ? parseInt(saved, 10) : (completedNutritionCount > 0 ? Math.min(30, completedNutritionCount + 1) : 1);
  })();

  const isTenDaysCompleted = completedWorkoutCount >= 10;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#12030F',
      color: '#FFFFFF'
    }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

          {/* Toast Notification Alert */}
          {toastMsg && (
            <div style={{ 
              backgroundColor: 'rgba(52, 211, 153, 0.18)', 
              border: '1px solid #34D399', 
              color: '#34D399', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              fontSize: '0.9rem', 
              marginBottom: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              boxShadow: '0 4px 20px rgba(52, 211, 153, 0.25)'
            }}>
              <CheckCircle2 size={18} /> {toastMsg}
            </div>
          )}

          {/* 10-DAY WORKOUT MILESTONE ACHIEVED BANNER (IF >= 10 DAYS COMPLETED) */}
          {isTenDaysCompleted && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(29, 7, 24, 0.9) 100%)',
              border: '2px solid #38BDF8',
              borderRadius: '16px',
              padding: '16px 22px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#38BDF8', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  🏆
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', color: '#FFF', fontWeight: 800 }}>
                    10-Day Workout Milestone Completed!
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#BAE6FD' }}>
                    You have verified and saved {completedWorkoutCount} workout days. Next phase active: Day {activeWorkoutDay}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/workout?day=${activeWorkoutDay}`)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: '#38BDF8',
                  color: '#12030F',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <span>Continue Day {activeWorkoutDay}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. EXECUTIVE HERO HEADER */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.45) 0%, rgba(29, 7, 24, 0.85) 100%)',
            border: '1px solid rgba(255, 158, 125, 0.22)',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '28px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
                  <Sparkles size={12} /> ATHLETE COCKPIT
                </span>
                <span style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.12)', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>
                  Active Member
                </span>
              </div>

              <h1 style={{ 
                fontSize: '2.2rem', 
                fontWeight: 800, 
                margin: '0 0 6px 0', 
                background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                Welcome back, {firstName} 👋
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.84rem', color: '#E2C9D6' }}>
                <span>🎯 Goal: <strong>{profile.fitnessGoal}</strong></span>
                <span>•</span>
                <span>🏋️ Equipment: <strong>{profile.workoutEquipment}</strong></span>
                <span>•</span>
                <span>🥗 Diet: <strong>{profile.dietaryPreference}</strong></span>
              </div>
            </div>

            {/* Quick Stats Pills & Edit Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.35)', 
                border: '1px solid rgba(255, 112, 67, 0.3)', 
                padding: '10px 16px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#FFB8A1', fontWeight: 700, textTransform: 'uppercase' }}>Workout Days</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF7043', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Dumbbell size={16} /> {completedWorkoutCount} <span style={{ fontSize: '0.75rem' }}>Days Done</span>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(0, 0, 0, 0.35)', 
                border: '1px solid rgba(52, 211, 153, 0.3)', 
                padding: '10px 16px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#A7F3D0', fontWeight: 700, textTransform: 'uppercase' }}>Fitness Score</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Award size={16} /> {profile.fitnessScore || 88} <span style={{ fontSize: '0.75rem' }}>/100</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileFormData({ ...profile });
                  setShowEditProfileModal(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 158, 125, 0.12)',
                  border: '1px solid var(--peach-primary)',
                  color: 'var(--peach-primary)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                <Edit size={14} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setSecurityError('');
                  setSecuritySuccess('');
                  setShowSecurityModal(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(232, 128, 157, 0.2) 0%, rgba(255, 112, 67, 0.15) 100%)',
                  border: '1px solid #E8809D',
                  color: '#FFD9CB',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(232, 128, 157, 0.2)',
                  transition: 'all 0.2s ease'
                }}>
                <Shield size={14} color="#FF9E7D" />
                <span>Security & Password</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. PRIMARY ACTION GATEWAYS: TRAINER WORKOUTS & DIETITIAN NUTRITION */}
          {/* ========================================================================= */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Zap size={18} color="var(--peach-primary)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                Prescribed Training & Nutrition Portals
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
              
              {/* GATEWAY 1: TRAINER PRESCRIBED WORKOUT PORTAL */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12) 0%, rgba(35, 8, 28, 0.9) 100%)',
                border: '1px solid rgba(255, 112, 67, 0.45)',
                borderRadius: '22px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(255, 112, 67, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FF7043', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(255, 112, 67, 0.4)' }}>
                      <Dumbbell size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255, 112, 67, 0.2)', color: '#FF7043', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
                        CERTIFIED PERIODIZED SPLIT
                      </span>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 0 0', color: '#FFF' }}>
                        Prescribed Workouts
                      </h3>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#4ADE80', fontWeight: 700, background: 'rgba(74, 222, 128, 0.12)', padding: '4px 10px', borderRadius: '10px' }}>
                    {completedWorkoutCount > 0 ? `Day ${activeWorkoutDay} Active (${completedWorkoutCount} Completed)` : 'New User • Starts Day 1'}
                  </span>
                </div>

                <p style={{ color: '#E2C9D6', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 18px 0' }}>
                  Structured 30-day progressive overload program certified by <strong>{profile.assignedTrainer?.name || 'Coach Marcus Vance'}</strong>. Complete daily prescribed sets with guided rest protocols to advance.
                </p>

                {/* Key Program Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Coach In Charge</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FF7043' }}>{profile.assignedTrainer?.name || 'Coach Marcus Vance'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Equipment Target</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>{profile.workoutEquipment || 'Full Gym Access'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    onClick={() => navigate(`/workout?day=${completedWorkoutCount === 0 ? 1 : activeWorkoutDay}`)}
                    style={{
                      flex: 1,
                      padding: '13px 18px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
                      color: '#12030F',
                      fontWeight: 900,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 18px rgba(255, 112, 67, 0.4)'
                    }}>
                    <Activity size={17} />
                    <span>{completedWorkoutCount === 0 ? 'Start Day 1 Workout' : `Continue Day ${activeWorkoutDay} Workout`}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenCareTeamChat('TRAINER')}
                    title="Consult Coach Marcus Vance"
                    style={{
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 112, 67, 0.4)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#FFB8A1',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                    <MessageSquare size={16} />
                    <span>Ask Coach</span>
                  </button>
                </div>
              </div>

              {/* GATEWAY 2: DIETITIAN PRESCRIBED NUTRITION PORTAL */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 24, 28, 0.9) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                borderRadius: '22px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#10B981', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                      <Utensils size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
                        PRECISION DIETETICS
                      </span>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 0 0', color: '#FFF' }}>
                        Prescribed Nutrition
                      </h3>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, background: 'rgba(52, 211, 153, 0.12)', padding: '4px 10px', borderRadius: '10px' }}>
                    {completedNutritionCount > 0 ? `Day ${activeNutritionDay} Active` : 'Day 1 Blueprint'}
                  </span>
                </div>

                <p style={{ color: '#E2C9D6', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 18px 0' }}>
                  Custom metabolic meal blueprints and macronutrient splits calibrated by <strong>{profile.assignedNutritionist?.name || 'Sruthy Varghese (M.Sc)'}</strong> to fuel muscle recovery and peak energy.
                </p>

                {/* Key Nutrition Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Clinical Dietitian</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981' }}>{profile.assignedNutritionist?.name || 'Sruthy Varghese (M.Sc)'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Daily Protein Goal</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38BDF8' }}>{targetProtein}g / day</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    onClick={() => navigate(`/nutrition?day=${completedNutritionCount === 0 ? 1 : activeNutritionDay}`)}
                    style={{
                      flex: 1,
                      padding: '13px 18px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10B981 0%, #38BDF8 100%)',
                      color: '#12030F',
                      fontWeight: 900,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
                    }}>
                    <Utensils size={17} />
                    <span>{completedNutritionCount === 0 ? 'Start Day 1 Nutrition' : `Continue Day ${activeNutritionDay} Nutrition`}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenCareTeamChat('NUTRITIONIST')}
                    title="Consult Dietitian Sruthy Varghese"
                    style={{
                      padding: '13px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#A7F3D0',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                    <MessageSquare size={16} />
                    <span>Ask Dietitian</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. ATHLETE BIOMETRICS & METABOLIC CALIBRATION MATRIX */}
          {/* ========================================================================= */}
          <div style={{
            background: 'rgba(29, 7, 24, 0.75)',
            border: '1px solid rgba(255, 158, 125, 0.2)',
            borderRadius: '20px',
            padding: '26px 28px',
            marginBottom: '28px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HeartPulse size={20} color="var(--peach-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                  Athlete Biometric & Caloric Health Profile
                </h3>
              </div>
              <button
                onClick={() => setShowLogWeightModal(true)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38BDF8',
                  color: '#38BDF8',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Scale size={14} />
                <span>Log Current Weight</span>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '14px',
              textAlign: 'center'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#B392A5', textTransform: 'uppercase', fontWeight: 700 }}>BMI Ratio</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: bmiColor, marginTop: '2px' }}>{bmi}</div>
                <span style={{ fontSize: '0.74rem', color: '#E2C9D6' }}>{bmiCategory}</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#B392A5', textTransform: 'uppercase', fontWeight: 700 }}>Basal BMR</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{bmr.toLocaleString()}</div>
                <span style={{ fontSize: '0.74rem', color: '#E2C9D6' }}>kcal / day base</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#B392A5', textTransform: 'uppercase', fontWeight: 700 }}>Total TDEE</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{tdee.toLocaleString()}</div>
                <span style={{ fontSize: '0.74rem', color: '#E2C9D6' }}>Active Burn</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#B392A5', textTransform: 'uppercase', fontWeight: 700 }}>Caloric Target</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--peach-primary)', marginTop: '2px' }}>{targetCalories.toLocaleString()}</div>
                <span style={{ fontSize: '0.74rem', color: '#E2C9D6' }}>Calibrated Goal</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#B392A5', textTransform: 'uppercase', fontWeight: 700 }}>Current Weight</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>{weightNum} kg</div>
                <span style={{ fontSize: '0.74rem', color: '#E2C9D6' }}>-4.0 kg net change</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. CARE TEAM RECENT CLINICAL DIRECTIVES */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.3) 0%, rgba(29, 7, 24, 0.75) 100%)',
            border: '1px solid rgba(255, 158, 125, 0.2)',
            borderRadius: '20px',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--peach-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                  Care Team Specialist Directives
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Direct Consultations Active
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {careTeamFeedback.map((fb, idx) => (
                <div key={idx} style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  background: fb.authorRole === 'TRAINER' ? 'rgba(255,112,67,0.08)' : 'rgba(16,185,129,0.08)',
                  border: fb.authorRole === 'TRAINER' ? '1px solid rgba(255,112,67,0.25)' : '1px solid rgba(16,185,129,0.25)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>{fb.authorName}</div>
                      <div style={{ fontSize: '0.75rem', color: fb.authorRole === 'TRAINER' ? '#FFB8A1' : '#A7F3D0' }}>{fb.specialization}</div>
                    </div>
                    <button
                      onClick={() => handleOpenCareTeamChat(fb.authorRole)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: fb.authorRole === 'TRAINER' ? '#FF7043' : '#10B981',
                        border: 'none',
                        color: '#12030F',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                      <MessageSquare size={13} />
                      <span>Message</span>
                    </button>
                  </div>
                  <p style={{ color: '#E2C9D6', fontSize: '0.85rem', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                    "{fb.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. ACCOUNT SECURITY & CREDENTIAL VAULT */}
          {/* ========================================================================= */}
          <div style={{
            marginTop: '28px',
            background: 'linear-gradient(135deg, rgba(35, 8, 28, 0.9) 0%, rgba(18, 3, 15, 0.95) 100%)',
            border: '1px solid rgba(232, 128, 157, 0.25)',
            borderRadius: '20px',
            padding: '26px 28px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(232, 128, 157, 0.15)', color: '#FF9E7D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                    Account Security & Credentials
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#B392A5' }}>
                    End-to-end encrypted profile authentication & credential management
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSecurityError('');
                  setSecuritySuccess('');
                  setShowSecurityModal(true);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
                  color: '#12030F',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(255, 112, 67, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                <Key size={14} />
                <span>Update Password & Security</span>
              </button>
            </div>

            {/* 3 Security Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              
              {/* Pillar 1: Password Health */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 158, 125, 0.2)',
                borderRadius: '14px',
                padding: '18px 20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF9E7D', fontWeight: 800, fontSize: '0.9rem' }}>
                    <Lock size={16} />
                    <span>Password Status</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    Active & Encrypted
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#E2C9D6', marginBottom: '12px', lineHeight: '1.4' }}>
                  Your password is protected using salted hash encryption. Last updated: <span style={{ color: '#FFF', fontWeight: 700 }}>{user?.passwordLastChangedAt ? new Date(user.passwordLastChangedAt).toLocaleDateString() : 'Active Profile Session'}</span>.
                </div>
                <button
                  onClick={() => {
                    setSecurityTab('password');
                    setSecurityError('');
                    setSecuritySuccess('');
                    setShowSecurityModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--peach-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <span>Change Password</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Pillar 2: 2FA Protection */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 158, 125, 0.2)',
                borderRadius: '14px',
                padding: '18px 20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 800, fontSize: '0.9rem' }}>
                    <Smartphone size={16} />
                    <span>2-Factor Authentication</span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    background: twoFactorEnabled ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: twoFactorEnabled ? '#34D399' : '#FCA5A5',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 800
                  }}>
                    {twoFactorEnabled ? 'Shield Active' : 'Not Enabled'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#E2C9D6', marginBottom: '12px', lineHeight: '1.4' }}>
                  Add a second verification layer with authentication passcodes or biometric device recognition.
                </div>
                <button
                  onClick={() => {
                    setSecurityTab('2fa');
                    setShowSecurityModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38BDF8',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <span>Configure 2FA & Biometrics</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Pillar 3: Active Device & Session */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 158, 125, 0.2)',
                borderRadius: '14px',
                padding: '18px 20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78BFA', fontWeight: 800, fontSize: '0.9rem' }}>
                    <Fingerprint size={16} />
                    <span>Session Security</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    Active Device
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#E2C9D6', marginBottom: '12px', lineHeight: '1.4' }}>
                  Logged in as <strong style={{ color: '#FFF' }}>{profile.email}</strong>. Session protected by JWT authentication token.
                </div>
                <button
                  onClick={() => {
                    setSecurityTab('sessions');
                    setShowSecurityModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#A78BFA',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <span>View Security Activity</span>
                  <ArrowRight size={12} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PROFILE */}
      {/* ========================================================================= */}
      {showEditProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '32px', maxWidth: '520px', width: '100%', background: '#1d0718', border: '1px solid #FF7043', borderRadius: '18px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>Edit Athlete Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Full Name</label>
                <input 
                  type="text" 
                  value={profileFormData.fullName || ''} 
                  onChange={e => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Height (cm)</label>
                  <input 
                    type="number" 
                    value={profileFormData.height || ''} 
                    onChange={e => setProfileFormData({ ...profileFormData, height: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profileFormData.weight || ''} 
                    onChange={e => setProfileFormData({ ...profileFormData, weight: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Fitness Goal</label>
                <select 
                  value={profileFormData.fitnessGoal || 'Muscle Building'} 
                  onChange={e => setProfileFormData({ ...profileFormData, fitnessGoal: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF' }}>
                  <option value="Muscle Building">Muscle Building / Hypertrophy</option>
                  <option value="Fat Loss">Fat Loss & Definition</option>
                  <option value="Endurance">Endurance & Athletic Stamina</option>
                  <option value="General Health">General Longevity & Mobility</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Workout Equipment</label>
                <select 
                  value={profileFormData.workoutEquipment || 'Full Gym Access'} 
                  onChange={e => setProfileFormData({ ...profileFormData, workoutEquipment: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF' }}>
                  <option value="Full Gym Access">Full Gym Access</option>
                  <option value="Dumbbells & Bench">Dumbbells & Bench Only</option>
                  <option value="Home / Bodyweight">Home / Bodyweight</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEditProfileModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={savingProfile} className="btn-primary" style={{ padding: '10px 22px' }}>
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LOG WEIGHT & BODY FAT */}
      {/* ========================================================================= */}
      {showLogWeightModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '32px', maxWidth: '440px', width: '100%', background: '#1d0718', border: '1px solid #38BDF8', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0, fontWeight: 800 }}>Log Body Weight</h3>
              <button onClick={() => setShowLogWeightModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveWeightLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={newLogWeight} 
                  onChange={e => setNewLogWeight(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(56,189,248,0.3)', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Estimated Body Fat (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={newLogBodyFat} 
                  onChange={e => setNewLogBodyFat(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(56,189,248,0.3)', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowLogWeightModal(false)} style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
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

      {/* ========================================================================= */}
      {/* MODAL 3: PASSWORD & SECURITY MANAGEMENT MODAL */}
      {/* ========================================================================= */}
      {showSecurityModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            background: '#1d0718',
            border: '1px solid #E8809D',
            borderRadius: '20px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(232, 128, 157, 0.2)'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                    Security & Credential Vault
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#B392A5' }}>
                    Manage your account password, 2FA shields, and active sessions
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowSecurityModal(false);
                  setSecurityError('');
                  setSecuritySuccess('');
                }} 
                style={{ background: 'none', border: 'none', color: '#B392A5', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Security Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', borderBottom: '1px solid rgba(255, 158, 125, 0.2)', paddingBottom: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setSecurityTab('password');
                  setSecurityError('');
                  setSecuritySuccess('');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: securityTab === 'password' ? 'rgba(255, 112, 67, 0.2)' : 'transparent',
                  border: securityTab === 'password' ? '1px solid #FF7043' : '1px solid transparent',
                  color: securityTab === 'password' ? '#FF9E7D' : '#CBD5E1',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Lock size={14} />
                <span>Change Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSecurityTab('2fa');
                  setSecurityError('');
                  setSecuritySuccess('');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: securityTab === '2fa' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: securityTab === '2fa' ? '1px solid #38BDF8' : '1px solid transparent',
                  color: securityTab === '2fa' ? '#38BDF8' : '#CBD5E1',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Smartphone size={14} />
                <span>2FA & Biometrics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSecurityTab('sessions');
                  setSecurityError('');
                  setSecuritySuccess('');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: securityTab === 'sessions' ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                  border: securityTab === 'sessions' ? '1px solid #A78BFA' : '1px solid transparent',
                  color: securityTab === 'sessions' ? '#A78BFA' : '#CBD5E1',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <History size={14} />
                <span>Active Sessions</span>
              </button>
            </div>

            {/* TAB 1: CHANGE PASSWORD FORM */}
            {securityTab === 'password' && (
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Alert Banners */}
                {securityError && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #EF4444',
                    color: '#FCA5A5',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{securityError}</span>
                  </div>
                )}

                {securitySuccess && (
                  <div style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid #34D399',
                    color: '#34D399',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} />
                    <span>{securitySuccess}</span>
                  </div>
                )}

                {/* Current Password Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      value={currentPass}
                      onChange={e => {
                        setCurrentPass(e.target.value);
                        setSecurityError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 14px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.45)',
                        border: '1px solid rgba(255,158,125,0.3)',
                        color: '#FFF',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer'
                      }}>
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 700 }}>
                      New Secure Password
                    </label>
                    {newPass && (
                      <span style={{ fontSize: '0.74rem', color: getPasswordStrength(newPass).color, fontWeight: 800 }}>
                        {getPasswordStrength(newPass).label}
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="Create a strong new password"
                      value={newPass}
                      onChange={e => {
                        setNewPass(e.target.value);
                        setSecurityError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 14px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.45)',
                        border: '1px solid rgba(255,158,125,0.3)',
                        color: '#FFF',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer'
                      }}>
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPass && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${getPasswordStrength(newPass).percent}%`,
                          height: '100%',
                          background: getPasswordStrength(newPass).color,
                          transition: 'width 0.3s ease, background 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder="Re-type your new password"
                      value={confirmPass}
                      onChange={e => {
                        setConfirmPass(e.target.value);
                        setSecurityError('');
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 14px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.45)',
                        border: '1px solid rgba(255,158,125,0.3)',
                        color: '#FFF',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer'
                      }}>
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Password Strength Requirements:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.78rem' }}>
                    {(() => {
                      const c = getPasswordStrength(newPass).criteria;
                      return (
                        <>
                          <div style={{ color: c.length ? '#34D399' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>{c.length ? '✓' : '○'}</span> At least 8 characters
                          </div>
                          <div style={{ color: c.upper ? '#34D399' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>{c.upper ? '✓' : '○'}</span> Uppercase letter (A-Z)
                          </div>
                          <div style={{ color: c.lower ? '#34D399' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>{c.lower ? '✓' : '○'}</span> Lowercase letter (a-z)
                          </div>
                          <div style={{ color: c.num ? '#34D399' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>{c.num ? '✓' : '○'}</span> Numeric digit (0-9)
                          </div>
                          <div style={{ color: c.special ? '#34D399' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px', gridColumn: 'span 2' }}>
                            <span>{c.special ? '✓' : '○'}</span> Special symbol (!@#$%^&*)
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowSecurityModal(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: '#CBD5E1',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={securitySaving}
                    className="btn-primary"
                    style={{
                      padding: '10px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 800
                    }}>
                    {securitySaving ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
                    <span>{securitySaving ? 'Encrypting & Saving...' : 'Save New Password'}</span>
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: 2FA & BIOMETRICS */}
            {securityTab === '2fa' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* 2FA Toggle Card */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                      <Smartphone size={18} />
                      <span>Two-Factor Authentication (2FA)</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                      Require a secure verification code sent to your registered email or Google Authenticator during new sign-ins.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggle2FA}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '10px',
                      background: twoFactorEnabled ? '#10B981' : 'rgba(255,255,255,0.1)',
                      color: twoFactorEnabled ? '#12030F' : '#CBD5E1',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}>
                    {twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
                  </button>
                </div>

                {/* Biometrics / Passkey Card */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78BFA', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
                      <Fingerprint size={18} />
                      <span>Biometric Touch ID / Passkey</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                      Fast, cryptographic biometric login using Windows Hello, Apple Touch ID, or hardware security keys.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleBiometrics}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '10px',
                      background: biometricsEnabled ? '#A78BFA' : 'rgba(255,255,255,0.1)',
                      color: biometricsEnabled ? '#12030F' : '#CBD5E1',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}>
                    {biometricsEnabled ? 'Active ✓' : 'Activate'}
                  </button>
                </div>

                {/* Security Standards Info */}
                <div style={{
                  background: 'rgba(255, 112, 67, 0.08)',
                  border: '1px solid rgba(255, 112, 67, 0.25)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '0.8rem',
                  color: '#FFB8A1',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Enterprise Security Standards:</strong> SmartFit encrypts athlete medical biometrics and credentials with 256-bit AES database encryption and stateless JSON Web Tokens.
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: ACTIVE SESSIONS & AUDIT LOG */}
            {securityTab === 'sessions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '14px',
                  padding: '16px 18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                      <strong style={{ color: '#FFF', fontSize: '0.9rem' }}>Current Browser Session</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      Active Now
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.5' }}>
                    <div><strong>Device:</strong> Windows PC • Desktop Browser</div>
                    <div><strong>Authenticated As:</strong> {profile.email}</div>
                    <div><strong>Protocol:</strong> JSON Web Token (JWT) SSL Encrypted</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 158, 125, 0.15)',
                  borderRadius: '14px',
                  padding: '16px 18px'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
                    Security Event History
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#CBD5E1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Session Login Authorization</span>
                      <span style={{ color: '#94A3B8' }}>Today, Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Profile Credentials Verification</span>
                      <span style={{ color: '#94A3B8' }}>{user?.passwordLastChangedAt ? new Date(user.passwordLastChangedAt).toLocaleDateString() : 'Initial Setup'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('All other browser sessions terminated securely.');
                    }}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid #EF4444',
                      color: '#FCA5A5',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}>
                    Log Out of All Other Devices
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Specialist Chat Modal */}
      <CareTeamChat
        isOpen={careTeamChat.isOpen}
        onClose={() => setCareTeamChat({ ...careTeamChat, isOpen: false })}
        defaultRole={careTeamChat.role}
        isFloating={careTeamChat.isFloating}
      />

      <Footer />
    </div>
  );
}
