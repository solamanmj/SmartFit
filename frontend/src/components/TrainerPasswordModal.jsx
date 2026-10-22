import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, Lock, KeyRound, Eye, EyeOff, CheckCircle2, 
  AlertCircle, Sparkles, X, ShieldAlert, Check, ArrowRight,
  User, Award, Briefcase, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SpecialistAccountModal({ 
  isOpen, 
  onClose, 
  isMandatory = false,
  onSuccess,
  role: propRole
}) {
  const { user, updatePassword, updateProfile } = useAuth();
  
  const role = (propRole || user?.role || 'TRAINER').toUpperCase();
  const isNutritionist = role === 'NUTRITIONIST';

  const accentColor = isNutritionist ? '#34D399' : '#FF7043';
  const accentGradient = isNutritionist 
    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
    : 'linear-gradient(135deg, #FF7043 0%, #C2185B 100%)';
  const roleBadge = isNutritionist ? 'CLINICAL NUTRITIONIST' : 'CERTIFIED TRAINER';
  const roleTitle = isNutritionist ? 'Dietitian' : 'Coach';

  // Tabs: 'PASSWORD' | 'PROFILE'
  const [activeTab, setActiveTab] = useState('PASSWORD');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [specialization, setSpecialization] = useState(user?.specialization || '');
  const [qualification, setQualification] = useState(user?.qualification || '');
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || 5);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setSpecialization(user.specialization || '');
      setQualification(user.qualification || '');
      setExperienceYears(user.experienceYears || 5);
    }
  }, [user, isOpen]);

  // Security evaluation criteria
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{}|;:',.<>/]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Calculate Password Strength Score (0 to 100)
  const strengthScore = useMemo(() => {
    let score = 0;
    if (hasLength) score += 20;
    if (newPassword.length >= 12) score += 10;
    if (hasUpper) score += 20;
    if (hasLower) score += 20;
    if (hasNumber) score += 15;
    if (hasSpecial) score += 15;
    return Math.min(100, score);
  }, [hasLength, newPassword, hasUpper, hasLower, hasNumber, hasSpecial]);

  const strengthLabel = useMemo(() => {
    if (strengthScore < 40) return { label: 'Weak', color: '#EF4444', text: 'Needs more complexity' };
    if (strengthScore < 70) return { label: 'Moderate', color: '#FACC15', text: 'Good, but could be stronger' };
    if (strengthScore < 90) return { label: 'Strong', color: '#38BDF8', text: 'Very secure' };
    return { label: 'Fortified Shield', color: '#4ADE80', text: 'Maximum security rating' };
  }, [strengthScore]);

  const isFormValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial && isMatch;

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isFormValid) {
      setErrorMsg('Please meet all security requirements before saving.');
      return;
    }

    setLoading(true);

    try {
      if (updatePassword) {
        const result = await updatePassword({
          currentPassword,
          newPassword
        });

        if (result && result.success) {
          setSuccessMsg(`Your ${roleTitle} account password has been updated and secured!`);
          setTimeout(() => {
            if (onSuccess) onSuccess();
            if (onClose) onClose();
          }, 1200);
        } else {
          setErrorMsg(result?.message || 'Failed to update password. Please verify current password.');
        }
      } else {
        setSuccessMsg('Password updated successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error customizing password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (updateProfile) {
        const result = await updateProfile({
          fullName,
          specialization,
          qualification,
          experienceYears: Number(experienceYears)
        });

        if (result && result.success) {
          setSuccessMsg(`Profile information updated successfully!`);
          setTimeout(() => {
            if (onSuccess) onSuccess();
            if (!isMandatory && onClose) onClose();
          }, 1200);
        } else {
          setErrorMsg(result?.message || 'Failed to update profile.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error updating profile details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 2, 8, 0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={() => {
        if (!isMandatory && onClose) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(145deg, #1C0918 0%, #2A0E23 50%, #150612 100%)',
          borderRadius: '24px',
          border: `1px solid ${accentColor}55`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px ${accentColor}30`,
          padding: '32px',
          position: 'relative',
          color: '#FFF'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Optional Close Button only when not mandatory */}
        {!isMandatory && onClose && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#CBD5E1',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Header Badge & Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}40`,
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <ShieldCheck size={16} />
            {isMandatory ? 'Initial Security Setup • Action Required' : `${roleBadge} SECURITY & SETTINGS`}
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px', color: '#FFF' }}>
            {isMandatory ? `Customize Your ${roleTitle} Password` : 'Account & Credentials Settings'}
          </h2>
          
          <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: '1.5', maxWidth: '460px', margin: '0 auto' }}>
            {isMandatory ? (
              <>Welcome {roleTitle} <strong>{user?.fullName || 'Specialist'}</strong>! You are signed in with the system initial password (<code>password123</code>). Please customize your password to secure client data.</>
            ) : (
              <>Update your account security password and public specialist credentials anytime.</>
            )}
          </p>
        </div>

        {/* Sub-tab Navigation (only when not strictly mandatory password change) */}
        {!isMandatory && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(10, 2, 8, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('PASSWORD'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                background: activeTab === 'PASSWORD' ? accentGradient : 'transparent',
                color: activeTab === 'PASSWORD' ? '#FFF' : '#CBD5E1',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <KeyRound size={15} />
              <span>Change Password</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('PROFILE'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                background: activeTab === 'PROFILE' ? accentGradient : 'transparent',
                color: activeTab === 'PROFILE' ? '#FFF' : '#CBD5E1',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <User size={15} />
              <span>Specialist Profile</span>
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#FCA5A5',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(74, 222, 128, 0.15)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#86EFAC',
            fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: PASSWORD FORM */}
        {activeTab === 'PASSWORD' ? (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Current / Initial Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                {isMandatory ? 'Current Temporary Password' : 'Old / Current Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    background: 'rgba(10, 2, 8, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                  placeholder={isMandatory ? 'e.g. password123' : 'Enter existing password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Initial default password set by system is <code>password123</code>.
              </span>
            </div>

            {/* New Custom Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1' }}>
                  New Secure Password
                </label>
                {newPassword && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: strengthLabel.color }}>
                    {strengthLabel.label} ({strengthScore}%)
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    background: 'rgba(10, 2, 8, 0.65)',
                    border: `1px solid ${newPassword ? strengthLabel.color : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Enter new 8+ character password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator Bar */}
              {newPassword.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${strengthScore}%`,
                      background: strengthLabel.color,
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    background: 'rgba(10, 2, 8, 0.65)',
                    border: `1px solid ${confirmPassword ? (isMatch ? '#4ADE80' : '#EF4444') : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security Checklist */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 14px',
              borderRadius: '12px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasLength ? '#4ADE80' : '#94A3B8' }}>
                {hasLength ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #64748B' }} />}
                At least 8 characters
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasUpper ? '#4ADE80' : '#94A3B8' }}>
                {hasUpper ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #64748B' }} />}
                1+ uppercase letter (A-Z)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasLower ? '#4ADE80' : '#94A3B8' }}>
                {hasLower ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #64748B' }} />}
                1+ lowercase letter (a-z)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasNumber ? '#4ADE80' : '#94A3B8' }}>
                {hasNumber ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #64748B' }} />}
                1+ number (0-9)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecial ? '#4ADE80' : '#94A3B8' }}>
                {hasSpecial ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #64748B' }} />}
                1+ special symbol (!@#$%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isMatch ? '#4ADE80' : '#94A3B8' }}>
                {isMatch ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #64748B' }} />}
                Passwords match
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: isFormValid 
                  ? accentGradient
                  : 'rgba(255, 255, 255, 0.1)',
                color: isFormValid ? '#FFF' : '#64748B',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isFormValid ? `0 10px 20px -5px ${accentColor}66` : 'none',
                marginTop: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <span>Securing Password...</span>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>{isMandatory ? 'Save Custom Password & Enter Portal' : 'Update Password'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* TAB 2: SPECIALIST PROFILE FORM */
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Full Professional Name
              </label>
              <input
                type="text"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(10, 2, 8, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.9rem'
                }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Registered Login Email (Read Only)
              </label>
              <input
                type="email"
                disabled
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#94A3B8',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
                value={user?.email || ''}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                Area of Specialization & Focus
              </label>
              <input
                type="text"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(10, 2, 8, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '0.9rem'
                }}
                placeholder={isNutritionist ? 'e.g. Metabolic Health, High Protein Diets' : 'e.g. Hypertrophy, Calisthenics'}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(10, 2, 8, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Clinical / Certified Qualification
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(10, 2, 8, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                  placeholder={isNutritionist ? 'Ph.D / M.Sc Dietetics' : 'NASM-CPT / CSCS'}
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: accentGradient,
                color: '#FFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: `0 10px 20px -5px ${accentColor}66`,
                marginTop: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <span>Updating Profile...</span>
              ) : (
                <>
                  <Check size={18} />
                  <span>Save Specialist Profile</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Backward compatibility export
export const TrainerPasswordModal = SpecialistAccountModal;
