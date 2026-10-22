import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateUserProfileApi, changePasswordApi } from '../services/api';
import { DEFAULT_ACCOUNTS } from './defaultAccounts';

const AuthContext = createContext();

export { DEFAULT_ACCOUNTS };


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('smartfit_token') || null;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartfit_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const STALE_LEGACY_ACCOUNTS = [
    'aby@example.com',
    'alex@example.com',
    'justin@gmail.com',
    'denis@gmail.com',
    'dennis@gmail.com',
    'abin@gmail.com',
    'deric@gmail.com',
    'johndoe@example.com'
  ];

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem('smartfit_accounts');
    let loadedAccounts = [];
    if (saved) {
      try {
        loadedAccounts = JSON.parse(saved);
        // Clean out legacy removed seed and test accounts from browser cache
        loadedAccounts = loadedAccounts.filter(a => !STALE_LEGACY_ACCOUNTS.includes((a.email || '').toLowerCase()));
      } catch (e) {
        loadedAccounts = [];
      }
    }
    // Merge loaded accounts with DEFAULT_ACCOUNTS while strictly preserving updated passwords and flags
    const merged = [...loadedAccounts];
    DEFAULT_ACCOUNTS.forEach(defAcc => {
      if (STALE_LEGACY_ACCOUNTS.includes((defAcc.email || '').toLowerCase())) return;
      const existingIdx = merged.findIndex(a => a.email.toLowerCase() === defAcc.email.toLowerCase());
      if (existingIdx === -1) {
        merged.push(defAcc);
      } else {
        // Preserve customized password if user changed it
        merged[existingIdx] = { 
          ...defAcc, 
          ...merged[existingIdx],
          password: merged[existingIdx].password || defAcc.password,
          hasChangedDefaultPassword: merged[existingIdx].hasChangedDefaultPassword || false
        };
      }
    });
    return merged.filter(a => !STALE_LEGACY_ACCOUNTS.includes((a.email || '').toLowerCase()));
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartfit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartfit_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smartfit_token', token);
    } else {
      localStorage.removeItem('smartfit_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('smartfit_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  const login = (arg1, arg2, arg3, arg4) => {
    let cleanEmail = '';
    let password = '';
    let jwtToken = null;
    let userObj = null;

    if (typeof arg1 === 'object' && arg1 !== null) {
      userObj = arg1;
      jwtToken = arg2 || null;
      cleanEmail = (userObj.email || '').trim().toLowerCase();
      password = userObj.password || '';
    } else {
      cleanEmail = (arg1 || '').trim().toLowerCase();
      password = arg2 || '';
      jwtToken = arg3 || null;
      userObj = arg4 || null;
    }
    
    // Search in registeredAccounts or fallback to DEFAULT_ACCOUNTS
    let found = registeredAccounts.find(acc => acc.email.toLowerCase() === cleanEmail);
    if (!found) {
      found = DEFAULT_ACCOUNTS.find(acc => acc.email.toLowerCase() === cleanEmail);
      if (found) {
        setRegisteredAccounts(prev => [...prev.filter(a => a.email.toLowerCase() !== cleanEmail), found]);
      }
    }

    // If authenticated via Spring Boot / Express JWT token or provided user object
    if (jwtToken) {
      const activeUser = userObj || found || {
        fullName: cleanEmail.split('@')[0] || 'SmartFit User',
        email: cleanEmail,
        role: cleanEmail.includes('admin') ? 'ADMIN' : cleanEmail.includes('marcus') || cleanEmail.includes('sarah') || cleanEmail.includes('david') ? 'TRAINER' : cleanEmail.includes('sruthy') || cleanEmail.includes('elena') ? 'NUTRITIONIST' : 'USER',
        password: password,
        age: 26,
        gender: 'Male',
        height: 178,
        weight: 75,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Muscle Building',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        streakDays: 1,
        points: 250
      };
      setUser(activeUser);
      setToken(jwtToken);
      try {
        localStorage.setItem('smartfit_user', JSON.stringify(activeUser));
        localStorage.setItem('smartfit_token', jwtToken);
        setRegisteredAccounts(prev => {
          const idx = prev.findIndex(a => a.email.toLowerCase() === cleanEmail);
          let next;
          if (idx >= 0) {
            next = [...prev];
            next[idx] = { ...next[idx], ...activeUser };
          } else {
            next = [...prev, activeUser];
          }
          localStorage.setItem('smartfit_accounts', JSON.stringify(next));
          return next;
        });
      } catch (e) {}
      return { success: true, user: activeUser, token: jwtToken };
    }

    if (found) {
      const hasCustomPass = Boolean(found.hasChangedDefaultPassword === true || found.passwordLastChangedAt);
      let passwordMatches = false;
      if (found.password) {
        passwordMatches = (found.password === password);
      }
      const isStaff = found.role === 'TRAINER' || found.role === 'NUTRITIONIST';
      const isAdmin = found.role === 'ADMIN';
      if (!passwordMatches && !hasCustomPass) {
        if (isStaff && password === 'password123') {
          passwordMatches = true;
        } else if (isAdmin && password === 'AdminPass123!') {
          passwordMatches = true;
        }
      }

      if (!passwordMatches) {
        return { 
          success: false, 
          message: hasCustomPass
            ? 'Incorrect Password: The password you entered is incorrect. Please log in using your updated custom password.'
            : 'Incorrect Password: The password you entered is incorrect. Please verify your credentials.' 
        };
      }

      const authToken = `smartfit-jwt-token-${Date.now()}`;
      setUser(found);
      setToken(authToken);
      try {
        localStorage.setItem('smartfit_user', JSON.stringify(found));
        localStorage.setItem('smartfit_token', authToken);
      } catch (e) {}
      return { success: true, user: found, token: authToken };
    }

    return { success: false, message: 'Account Not Found: No account exists with this email address. Please register.' };
  };

  const register = (profileData, jwtToken = null) => {
    const authToken = jwtToken || `smartfit-jwt-token-${Date.now()}`;
    const cleanEmail = (profileData?.email || '').trim().toLowerCase();
    
    // Smart trainer & nutritionist assignment
    const goalStr = (profileData?.fitnessGoal || '').toLowerCase();
    let assignedTrainer = profileData?.assignedTrainer || {
      email: 'marcus@example.com',
      name: 'Marcus Vance',
      specialization: 'Hypertrophy & Strength Conditioning'
    };
    if (goalStr.includes('loss') || goalStr.includes('fat') || goalStr.includes('cardio') || goalStr.includes('endurance')) {
      assignedTrainer = {
        email: 'sarah@example.com',
        name: 'Sarah Jenkins',
        specialization: 'Cardio Endurance & Calisthenics'
      };
    } else if (goalStr.includes('mobility') || goalStr.includes('functional') || goalStr.includes('athletic')) {
      assignedTrainer = {
        email: 'david@example.com',
        name: 'David Kim',
        specialization: 'Athletic Mobility & Functional Training'
      };
    }

    const dietStr = (profileData?.dietaryPreference || '').toLowerCase();
    let assignedNutritionist = profileData?.assignedNutritionist || {
      email: 'sruthy@example.com',
      name: 'Sruthy Varghese',
      qualification: 'M.Sc. Dietetics & Performance Nutrition'
    };
    if (dietStr.includes('keto') || dietStr.includes('low carb') || dietStr.includes('high protein')) {
      assignedNutritionist = {
        email: 'elena@example.com',
        name: 'Dr. Elena Rostova',
        qualification: 'Ph.D. Sports Clinical Nutrition'
      };
    }

    const weight = Number(profileData?.weight) || 75;
    const height = Number(profileData?.height) || 178;
    const age = Number(profileData?.age) || 26;
    const heightM = height / 100.0;
    const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);

    const newUser = {
      role: 'USER',
      age,
      gender: 'Male',
      height,
      weight,
      activityLevel: 'Moderately Active',
      fitnessGoal: 'Muscle Building',
      dietaryPreference: 'Standard Balanced',
      workoutEquipment: 'Full Gym Access',
      medicalConditions: 'None',
      bmi,
      bmr,
      tdee: Math.round(bmr * 1.55),
      targetCalories: Math.round(bmr * 1.55) + 300,
      fitnessScore: 80,
      completedWorkoutDays: [],
      activeWorkoutDay: 1,
      completedNutritionDays: [],
      activeNutritionDay: 1,
      workoutDaysCount: 0,
      workoutTenDayCompleted: false,
      milestones: [],
      ...profileData,
      email: cleanEmail,
      assignedTrainer,
      assignedNutritionist,
      streakDays: 1,
      points: 250
    };

    // Ensure freshly registered user starts clean at Day 1 for both workouts and nutrition
    try {
      localStorage.setItem(`smartfit_${cleanEmail}_workout_active_day`, '1');
      localStorage.setItem(`smartfit_${cleanEmail}_completed_days_map`, JSON.stringify({}));
      localStorage.setItem(`smartfit_${cleanEmail}_completed_days_timestamps`, JSON.stringify({}));
      localStorage.setItem(`smartfit_${cleanEmail}_nutrition_active_day`, '1');
      localStorage.setItem(`smartfit_${cleanEmail}_nutrition_completed_days_map`, JSON.stringify({}));
      localStorage.setItem(`smartfit_${cleanEmail}_nutrition_completed_timestamps`, JSON.stringify({}));
    } catch (e) {}

    setRegisteredAccounts(prev => [newUser, ...prev.filter(a => a.email.toLowerCase() !== cleanEmail)]);
    setUser(newUser);
    setToken(authToken);
    try {
      localStorage.setItem('smartfit_user', JSON.stringify(newUser));
      localStorage.setItem('smartfit_token', authToken);
      window.dispatchEvent(new Event('smartfit_accounts_updated'));
    } catch (e) {}
    return { user: newUser, token: authToken };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartfit_user');
    localStorage.removeItem('smartfit_token');
  };

  const updateProfile = async (updatedData) => {
    if (!user && !updatedData?.email) {
      return { success: false, message: 'No active user session found.' };
    }
    const cleanEmail = (updatedData?.email || user?.email || '').trim().toLowerCase();
    const merged = { ...user, ...updatedData, email: cleanEmail };

    const weight = Number(merged.weight) || 75;
    const height = Number(merged.height) || 178;
    const age = Number(merged.age) || 26;
    const heightM = height / 100.0;
    merged.bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
    merged.bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    merged.tdee = Math.round(merged.bmr * 1.55);
    merged.targetCalories = Math.round(merged.bmr * 1.55) + 300;

    setUser(merged);
    try {
      localStorage.setItem('smartfit_user', JSON.stringify(merged));
    } catch (e) {}

    setRegisteredAccounts(prev =>
      prev.map(acc => (acc.email?.toLowerCase() === cleanEmail ? { ...acc, ...merged } : acc))
    );

    try {
      await updateUserProfileApi(merged);
    } catch (e) {
      console.warn('Backend profile sync notice:', e.message);
    }

    return { success: true, user: merged };
  };

  const updatePassword = async ({ currentPassword, newPassword }) => {
    if (!user || !user.email) {
      return { success: false, message: 'No active session found.' };
    }

    const cleanEmail = user.email.trim().toLowerCase();

    // Call backend change-password endpoint to verify current password & encrypt new password
    let backendUser = null;
    try {
      const result = await changePasswordApi({
        email: cleanEmail,
        currentPassword,
        newPassword
      });
      if (result && result.user) {
        backendUser = result.user;
      }
    } catch (err) {
      console.warn('Backend change-password notice:', err.message);
      if (err.message && (err.message.toLowerCase().includes('incorrect') || err.message.toLowerCase().includes('required') || err.message.toLowerCase().includes('found'))) {
        return { success: false, message: err.message };
      }
    }

    const updatedUser = {
      ...user,
      ...(backendUser || {}),
      password: newPassword,
      plainPasswordFallback: newPassword,
      mustChangePassword: false,
      hasChangedDefaultPassword: true,
      isFirstLogin: false,
      passwordLastChangedAt: new Date().toISOString()
    };

    setUser(updatedUser);
    try {
      localStorage.setItem('smartfit_user', JSON.stringify(updatedUser));
    } catch (e) {}

    setRegisteredAccounts(prev => {
      const next = prev.map(acc => (acc.email?.toLowerCase() === cleanEmail ? { ...acc, ...updatedUser } : acc));
      try {
        localStorage.setItem('smartfit_accounts', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      await updateUserProfileApi({
        email: cleanEmail,
        password: newPassword,
        plainPasswordFallback: newPassword,
        mustChangePassword: false,
        hasChangedDefaultPassword: true,
        isFirstLogin: false,
        passwordLastChangedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Backend profile password sync notice:', e.message);
    }

    return { success: true, user: updatedUser, message: 'Password customized successfully!' };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!user, 
      registeredAccounts, 
      login, 
      register, 
      logout, 
      updateProfile,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

