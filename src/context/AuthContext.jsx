import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem('smartfit_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'password123',
        age: '26',
        gender: 'Male',
        height: '178',
        weight: '75',
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Muscle Building',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        streakDays: 14,
        points: 1450
      }
    ];
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

  const login = (email, password, jwtToken = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = registeredAccounts.find(acc => acc.email.toLowerCase() === cleanEmail);

    // If authenticated via Spring Boot JWT token
    if (jwtToken) {
      const activeUser = found || {
        fullName: email.split('@')[0] || 'SmartFit User',
        email: cleanEmail,
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
      return { success: true, user: activeUser, token: jwtToken };
    }

    if (found) {
      if (found.password && found.password !== password) {
        return { success: false, message: 'Incorrect Password: The password you entered is incorrect.' };
      }
      const authToken = `smartfit-jwt-token-${Date.now()}`;
      setUser(found);
      setToken(authToken);
      return { success: true, user: found, token: authToken };
    }

    return { success: false, message: 'Account Not Found: No account exists with this email address. Please register.' };
  };

  const register = (profileData, jwtToken = null) => {
    const authToken = jwtToken || `mock-jwt-token-${Date.now()}`;
    const newUser = {
      ...profileData,
      streakDays: 1,
      points: 250
    };

    setRegisteredAccounts(prev => [newUser, ...prev.filter(a => a.email !== newUser.email)]);
    setUser(newUser);
    setToken(authToken);
    return { user: newUser, token: authToken };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartfit_user');
    localStorage.removeItem('smartfit_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, registeredAccounts, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
