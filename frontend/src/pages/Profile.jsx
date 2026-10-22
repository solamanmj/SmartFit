import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User, Cpu, ArrowRight, ShieldCheck, Activity, Flame, HeartPulse,
  Dumbbell, Utensils, LogOut, CheckCircle2, Award, Zap, Edit3, X, Save,
  Shield, Check, Phone, MapPin, Mail, Calendar, FileText, BadgeCheck,
  Sparkles, Layers, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const isTrainer = (user?.role || '').toUpperCase() === 'TRAINER';

  // Fallback defaults for regular athlete / user
  const profile = user || {
    fullName: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'USER',
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

  // User form state
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

  // Trainer specific form state
  const [trainerData, setTrainerData] = useState({
    fullName: user?.fullName || 'Marcus Vance',
    specialization: user?.specialization || 'Hypertrophy & Strength Conditioning',
    experienceYears: user?.experienceYears || 8,
    phone: user?.phone || '+1 (555) 349-8201',
    location: user?.location || 'San Francisco, CA / Hybrid Remote',
    bio: user?.bio || 'Certified Strength & Conditioning Specialist with over 8 years of professional experience creating hypertrophy splits, biomechanical movement corrections, and progressive overload protocols.',
    certificationName: user?.certificationName || 'NASM Certified Personal Trainer (NASM-CPT)',
    issuingAuthority: user?.issuingAuthority || 'National Academy of Sports Medicine',
    certificateLicenseNo: user?.certificateLicenseNo || 'NASM-CPT-8492019',
    issueDate: user?.issueDate || '2023-01-15',
    expiryDate: user?.expiryDate || '2027-01-15',
    authenticityScore: user?.authenticityScore || 98
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        age: user.age || 26,
        gender: user.gender || 'Male',
        height: user.height || 178,
        weight: user.weight || 75,
        activityLevel: user.activityLevel || 'Moderately Active',
        fitnessGoal: user.fitnessGoal || 'Muscle Building',
        dietaryPreference: user.dietaryPreference || 'Standard Balanced',
        workoutEquipment: user.workoutEquipment || 'Full Gym Access',
        medicalConditions: user.medicalConditions || 'None'
      });

      setTrainerData({
        fullName: user.fullName || 'Marcus Vance',
        specialization: user.specialization || 'Hypertrophy & Strength Conditioning',
        experienceYears: user.experienceYears || 8,
        phone: user.phone || '+1 (555) 349-8201',
        location: user.location || 'San Francisco, CA / Hybrid Remote',
        bio: user.bio || 'Certified Strength & Conditioning Specialist with over 8 years of professional experience creating hypertrophy splits, biomechanical movement corrections, and progressive overload protocols.',
        certificationName: user.certificationName || 'NASM Certified Personal Trainer (NASM-CPT)',
        issuingAuthority: user.issuingAuthority || 'National Academy of Sports Medicine',
        certificateLicenseNo: user.certificateLicenseNo || 'NASM-CPT-8492019',
        issueDate: user.issueDate || '2023-01-15',
        expiryDate: user.expiryDate || '2027-01-15',
        authenticityScore: user.authenticityScore || 98
      });
    }
  }, [user]);

  const handleSaveUserProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ...formData,
        email: profile.email || user?.email || 'alex@example.com'
      });
      setSaveSuccess(true);
      setShowEditModal(false);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.warn('Save user profile notice:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTrainerProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ...trainerData,
        email: user?.email || 'marcus@example.com',
        role: 'TRAINER'
      });
      setSaveSuccess(true);
      setShowEditModal(false);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.warn('Save trainer profile notice:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // User Health Metrics Calculations (only used if isTrainer is false)
  const weightNum = parseFloat(profile.weight) || 75;
  const heightNum = parseFloat(profile.height) || 178;
  const ageNum = parseFloat(profile.age) || 26;
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

  // Additional certifications list for Trainer
  const trainerCertificationsList = [
    {
      id: 1,
      name: trainerData.certificationName,
      authority: trainerData.issuingAuthority,
      licenseNo: trainerData.certificateLicenseNo,
      period: `${trainerData.issueDate} → ${trainerData.expiryDate}`,
      type: 'Primary Board Certification',
      status: 'VERIFIED',
      accreditation: 'NCCA Accredited'
    },
    {
      id: 2,
      name: 'CSCS - Certified Strength and Conditioning Specialist',
      authority: 'National Strength and Conditioning Association (NSCA)',
      licenseNo: 'NSCA-CSCS-881290',
      period: '2022-04-10 → 2026-04-10',
      type: 'Advanced Performance Credential',
      status: 'VERIFIED',
      accreditation: 'Global Gold Standard'
    },
    {
      id: 3,
      name: 'FMS Level 2 Functional Movement Screen Certified',
      authority: 'Functional Movement Systems',
      licenseNo: 'FMS-L2-49102',
      period: '2023-08-20 → 2027-08-20',
      type: 'Biomechanics & Injury Screening',
      status: 'VERIFIED',
      accreditation: 'Clinical Mobility Standard'
    },
    {
      id: 4,
      name: 'Red Cross Adult & Pediatric CPR/AED Emergency Clearance',
      authority: 'American Red Cross',
      licenseNo: 'ARC-CPR-AED-9921',
      period: 'Active & Verified',
      type: 'Emergency Medical Life Support',
      status: 'VERIFIED',
      accreditation: 'Mandatory Safety Clearance'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>

          {/* ========================================================================= */}
          {/* TRAINER VIEW: DETAILS & CERTIFICATIONS ONLY (USER FIELDS REMOVED)       */}
          {/* ========================================================================= */}
          {isTrainer ? (
            <div>
              {/* Trainer Hero Banner */}
              <div className="glass-card" style={{ padding: '36px', marginBottom: '28px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255, 112, 67, 0.3)' }}>
                <div style={{
                  position: 'absolute',
                  top: '-60px',
                  right: '-60px',
                  width: '260px',
                  height: '260px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 112, 67, 0.18) 0%, rgba(194, 24, 91, 0) 70%)',
                  pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF7043 0%, #C2185B 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '2.2rem',
                      boxShadow: '0 8px 24px rgba(255, 112, 67, 0.4)'
                    }}>
                      {trainerData.fullName ? trainerData.fullName.charAt(0).toUpperCase() : 'T'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          {trainerData.fullName}
                        </h1>
                        <span style={{
                          background: 'rgba(255, 112, 67, 0.15)',
                          color: '#FF7043',
                          border: '1px solid rgba(255, 112, 67, 0.4)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <ShieldCheck size={14} /> CERTIFIED FITNESS COACH
                        </span>
                        <span style={{
                          background: 'rgba(74, 222, 128, 0.15)',
                          color: '#4ade80',
                          border: '1px solid rgba(74, 222, 128, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          ● Active Faculty
                        </span>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                        {user?.email || 'trainer@smartfit.com'} • {trainerData.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="btn-primary"
                      style={{
                        padding: '12px 20px',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #FF7043 0%, #C2185B 100%)',
                        boxShadow: '0 4px 16px rgba(255, 112, 67, 0.35)'
                      }}
                    >
                      <Edit3 size={16} />
                      <span>Edit Trainer Details</span>
                    </button>
                    <button
                      onClick={() => navigate('/trainer-dashboard')}
                      className="btn-secondary"
                      style={{ padding: '12px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>Trainer Dashboard</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#fca5a5',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '12px 18px',
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

              {saveSuccess && (
                <div style={{ background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={22} />
                  <span style={{ fontWeight: 600 }}>Trainer credentials and professional details updated successfully!</span>
                </div>
              )}

              {/* Trainer Highlights Metrics Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(255, 112, 67, 0.25)' }}>
                  <div style={{ color: '#FF7043', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Coaching Experience</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{trainerData.experienceYears} Years</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Professional Track</span>
                </div>

                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(255, 112, 67, 0.25)' }}>
                  <div style={{ color: '#FF7043', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Assigned Athletes</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF9E7D' }}>{user?.assignedUsersCount || user?.assignedClientsCount || 3} Clients</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Active Roster</span>
                </div>

                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(255, 112, 67, 0.25)' }}>
                  <div style={{ color: '#FF7043', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Accreditation Score</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ade80' }}>{trainerData.authenticityScore}%</div>
                  <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700 }}>Verified & Audited</span>
                </div>

                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(255, 112, 67, 0.25)' }}>
                  <div style={{ color: '#FF7043', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Verification Status</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '36px' }}>
                    <BadgeCheck size={22} style={{ color: '#4ade80' }} /> VERIFIED
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>NCCA Registry Valid</span>
                </div>
              </div>

              {/* 1. Professional Details & Contact Information */}
              <div className="glass-card" style={{ padding: '30px', marginBottom: '28px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 112, 67, 0.15)', color: '#FF7043' }}>
                    <User size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 800 }}>Trainer Professional Details</h3>
                    <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: 0 }}>Faculty identity, contact channels, and coaching scope</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <User size={14} style={{ color: '#FF7043' }} /> Full Name
                    </span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem' }}>{trainerData.fullName}</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Mail size={14} style={{ color: '#FF7043' }} /> Faculty Email Address
                    </span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem' }}>{user?.email || 'marcus@example.com'}</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Phone size={14} style={{ color: '#FF7043' }} /> Contact Phone
                    </span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem' }}>{trainerData.phone}</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <MapPin size={14} style={{ color: '#FF7043' }} /> Location & Delivery Mode
                    </span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem' }}>{trainerData.location}</div>
                  </div>
                </div>

                {/* Coaching Bio */}
                <div style={{ background: 'rgba(255, 112, 67, 0.05)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 112, 67, 0.2)', marginBottom: '20px' }}>
                  <span style={{ color: '#FF7043', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Coaching Philosophy & Biography
                  </span>
                  <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                    {trainerData.bio}
                  </p>
                </div>

                {/* Core Coaching Domains */}
                <div>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                    Prescribed Training Specializations
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Hypertrophy Optimization', 'Strength Conditioning', 'Joint & Spine Safety Rules', 'Biomechanics Auditing', 'Periodization Strategy', 'Fatigue Load Regulation'].map((spec, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Sparkles size={12} style={{ color: '#FF7043' }} /> {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Official Certifications & Credentials Section */}
              <div className="glass-card" style={{ padding: '30px', marginBottom: '28px', border: '1px solid rgba(255, 112, 67, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80' }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 800 }}>Professional Certifications & Credentials</h3>
                      <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: 0 }}>Accredited licenses, certifications, and compliance clearance</p>
                    </div>
                  </div>

                  <span style={{
                    background: 'rgba(74, 222, 128, 0.12)',
                    color: '#4ade80',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={15} /> All Certifications Verified
                  </span>
                </div>

                {/* Primary Certification Featured Card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12) 0%, rgba(194, 24, 91, 0.08) 100%)',
                  border: '1px solid rgba(255, 112, 67, 0.4)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FF7043', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Primary Board License
                      </span>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '4px 0 2px 0' }}>
                        {trainerData.certificationName}
                      </h4>
                      <p style={{ color: 'var(--peach-soft)', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>
                        Issuing Authority: {trainerData.issuingAuthority}
                      </p>
                    </div>
                    <span style={{
                      background: 'rgba(74, 222, 128, 0.2)',
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800
                    }}>
                      ACTIVE & VERIFIED
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', display: 'block', marginBottom: '2px' }}>License / ID Number</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'monospace' }}>{trainerData.certificateLicenseNo}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', display: 'block', marginBottom: '2px' }}>Effective Validity</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{trainerData.issueDate} → {trainerData.expiryDate}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', display: 'block', marginBottom: '2px' }}>Accreditation Tier</span>
                      <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>NCCA National Standard</span>
                    </div>
                  </div>
                </div>

                {/* Additional Certifications Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {trainerCertificationsList.slice(1).map(cert => (
                    <div key={cert.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '18px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--peach-soft)' }}>{cert.type}</span>
                        <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 800 }}>✓ {cert.status}</span>
                      </div>
                      <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>{cert.name}</h5>
                      <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', margin: '0 0 10px 0' }}>{cert.authority}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                        <span>License: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{cert.licenseNo}</strong></span>
                        <span style={{ color: '#4ade80' }}>{cert.accreditation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Evidence & Compliance Checklist */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: '#4ade80' }} /> Verified Evidence & Safety Audit Report
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#4ade80' }} /> Official National Fitness Registry Match
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#4ade80' }} /> NCCA / International Accreditation Active
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#4ade80' }} /> Adult & Pediatric CPR/AED Emergency Clearance
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.85rem' }}>
                      <Check size={16} style={{ color: '#4ade80' }} /> Safe Biomechanical Prescription Compliance
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (

            /* ========================================================================= */
            /* REGULAR ATHLETE / USER VIEW (Standard biometrics, goals & macro metrics)  */
            /* ========================================================================= */
            <div>
              {/* User Hero Banner */}
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
                      onClick={() => setShowEditModal(true)}
                      className="btn-primary"
                      style={{ padding: '12px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Edit3 size={16} />
                      <span>Edit Biometrics</span>
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="btn-secondary"
                      style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                    >
                      <span>Dashboard</span>
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

              {saveSuccess && (
                <div style={{ background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={22} />
                  <span style={{ fontWeight: 600 }}>Health Profile biometrics updated and synchronized successfully!</span>
                </div>
              )}

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
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* EDIT MODAL: CONDITIONAL FOR TRAINER VS REGULAR USER                       */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: isTrainer ? '1px solid #FF7043' : '1px solid var(--peach-primary)', background: '#1d0718' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={24} style={{ color: isTrainer ? '#FF7043' : 'var(--peach-primary)' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  {isTrainer ? 'Edit Trainer Details & Certifications' : 'Edit Health Biometrics'}
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Trainer Edit Form */}
            {isTrainer ? (
              <form onSubmit={handleSaveTrainerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={trainerData.fullName} 
                    onChange={e => setTrainerData({ ...trainerData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Primary Specialization</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={trainerData.specialization} 
                      onChange={e => setTrainerData({ ...trainerData, specialization: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Experience (Yrs)</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={trainerData.experienceYears} 
                      min="1" 
                      max="50"
                      onChange={e => setTrainerData({ ...trainerData, experienceYears: parseInt(e.target.value) || 5 })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Phone Number</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={trainerData.phone} 
                      onChange={e => setTrainerData({ ...trainerData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Location / Mode</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={trainerData.location} 
                      onChange={e => setTrainerData({ ...trainerData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Coaching Bio & Philosophy</label>
                  <textarea 
                    className="input-field" 
                    rows="3"
                    value={trainerData.bio} 
                    onChange={e => setTrainerData({ ...trainerData, bio: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FF7043', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                    Primary Certification Credentials
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>Certification Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={trainerData.certificationName} 
                        onChange={e => setTrainerData({ ...trainerData, certificationName: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>Issuing Authority</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={trainerData.issuingAuthority} 
                          onChange={e => setTrainerData({ ...trainerData, issuingAuthority: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>License / ID Number</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={trainerData.certificateLicenseNo} 
                          onChange={e => setTrainerData({ ...trainerData, certificateLicenseNo: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>Issue Date</label>
                        <input 
                          type="date" 
                          className="input-field" 
                          value={trainerData.issueDate} 
                          onChange={e => setTrainerData({ ...trainerData, issueDate: e.target.value })}
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>Expiry / Renewal Date</label>
                        <input 
                          type="date" 
                          className="input-field" 
                          value={trainerData.expiryDate} 
                          onChange={e => setTrainerData({ ...trainerData, expiryDate: e.target.value })}
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '14px' }}>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="btn-primary" 
                    style={{ 
                      padding: '10px 24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      background: 'linear-gradient(135deg, #FF7043 0%, #C2185B 100%)'
                    }}
                  >
                    <Save size={18} />
                    <span>{saving ? 'Saving...' : 'Save Trainer Credentials'}</span>
                  </button>
                </div>
              </form>
            ) : (

              /* User Edit Form */
              <form onSubmit={handleSaveUserProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Age (yrs)</label>
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
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Gender</label>
                    <select 
                      className="input-field" 
                      style={{ background: '#12030f' }}
                      value={formData.gender} 
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Height (cm)</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Weight (kg)</label>
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
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Activity Level</label>
                    <select 
                      className="input-field" 
                      style={{ background: '#12030f' }}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Fitness Goal</label>
                    <select 
                      className="input-field" 
                      style={{ background: '#12030f' }}
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
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Dietary Preference</label>
                    <select 
                      className="input-field" 
                      style={{ background: '#12030f' }}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Workout Equipment</label>
                    <select 
                      className="input-field" 
                      style={{ background: '#12030f' }}
                      value={formData.workoutEquipment} 
                      onChange={e => setFormData({ ...formData, workoutEquipment: e.target.value })}
                    >
                      <option value="Full Gym Access">Full Gym Access</option>
                      <option value="Dumbbells Only">Dumbbells Only</option>
                      <option value="Bodyweight / Calisthenics">Bodyweight / Calisthenics</option>
                      <option value="Resistance Bands">Resistance Bands</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '6px' }}>Medical Conditions</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.medicalConditions} 
                      onChange={e => setFormData({ ...formData, medicalConditions: e.target.value })}
                      placeholder="e.g. None, Asthma, Knee Pain"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '14px' }}>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} />
                    <span>{saving ? 'Saving...' : 'Save & Recalculate Metrics'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
