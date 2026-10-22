import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import { dataStore } from '../config/dataStore.js';
import { matchCareTeamForUser } from '../config/careTeamMatcher.js';

const router = express.Router();

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{}|;:',.<>/]).{8,}$/;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      age,
      gender,
      height,
      weight,
      activityLevel,
      fitnessGoal,
      dietaryPreference,
      workoutEquipment,
      medicalConditions
    } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanName = (fullName && fullName.trim().length > 0) ? fullName.trim() : (cleanEmail ? cleanEmail.split('@')[0] : 'SmartFit User');

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Registration Failed', message: 'Please enter a valid email address.' });
    }

    // Check if user already exists in database/store
    const existing = await dataStore.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'Registration Failed', message: 'Email address is already registered. Please login instead.' });
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: 'Registration Failed',
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    const numAge = Number(age) || 26;
    const numHeight = Number(height) || 178;
    const numWeight = Number(weight) || 75;

    if (numAge < 13 || numAge > 120) {
      return res.status(400).json({ error: 'Registration Failed', message: 'Age must be between 13 and 120 years.' });
    }
    if (numHeight < 50 || numHeight > 250) {
      return res.status(400).json({ error: 'Registration Failed', message: 'Height must be between 50 cm and 250 cm.' });
    }
    if (numWeight < 20 || numWeight > 300) {
      return res.status(400).json({ error: 'Registration Failed', message: 'Weight must be between 20 kg and 300 kg.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Dynamic SmartCareTeam Matching Engine based on Goal & Dietary Preference
    const matchedTeam = await matchCareTeamForUser({
      fitnessGoal,
      dietaryPreference,
      workoutEquipment,
      medicalConditions,
      age: numAge,
      weight: numWeight
    });

    const assignedTrainer = matchedTeam.assignedTrainer;
    const assignedNutritionist = matchedTeam.assignedNutritionist;

    const newUser = await dataStore.createUser({
      fullName: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      plainPasswordFallback: password,
      age: numAge,
      gender: gender || 'Male',
      height: numHeight,
      weight: numWeight,
      activityLevel: activityLevel || 'Moderately Active',
      fitnessGoal: fitnessGoal || 'Muscle Building',
      dietaryPreference: dietaryPreference || 'Standard Balanced',
      workoutEquipment: workoutEquipment || 'Full Gym Access',
      medicalConditions: medicalConditions || 'None',
      role: 'USER',
      assignedTrainer,
      assignedNutritionist,
      completedWorkoutDays: [],
      activeWorkoutDay: 1,
      completedNutritionDays: [],
      activeNutritionDay: 1,
      workoutDaysCount: 0,
      workoutTenDayCompleted: false,
      milestones: [],
      streakDays: 1,
      points: 250,
      isLoggedIn: true,
      lastLoginTime: now
    });

    const token = generateToken(newUser.email);

    return res.status(200).json({
      token,
      user: newUser,
      assignedTrainer,
      assignedNutritionist,
      matchingMode: 'AI_AUTOMATED_GOAL_MATCH'
    });
  } catch (err) {
    console.error('Registration Route Error:', err);
    return res.status(400).json({ error: 'Registration Failed', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(401).json({ error: 'Authentication Failed', message: 'Email address and password cannot be empty.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await dataStore.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Authentication Failed', message: 'Invalid email or password. Please verify your credentials.' });
    }

    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else if (user.password) {
      isMatch = (password === user.password);
    }

    // Direct fallback ONLY for staff roles (TRAINER / NUTRITIONIST) with initial temporary password, or ADMIN
    const isStaff = user.role === 'TRAINER' || user.role === 'NUTRITIONIST';
    const isAdmin = user.role === 'ADMIN';
    const hasCustomizedPassword = Boolean(user.hasChangedDefaultPassword === true || user.passwordLastChangedAt);

    if (!isMatch && !hasCustomizedPassword) {
      if (isStaff) {
        if (user.plainPasswordFallback && password === user.plainPasswordFallback) {
          isMatch = true;
        } else if (password === 'password123') {
          isMatch = true;
        }
      } else if (isAdmin) {
        if (password === 'AdminPass123!' || (user.plainPasswordFallback && password === user.plainPasswordFallback)) {
          isMatch = true;
        }
      }
    }

    if (!isMatch) {
      const wrongPassMessage = hasCustomizedPassword
        ? 'Incorrect Password: The password you entered is incorrect. Please log in using your updated custom password.'
        : 'Incorrect Password: The password you entered is incorrect. Please verify your credentials.';
      return res.status(401).json({ error: 'Authentication Failed', message: wrongPassMessage });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updatedUser = await dataStore.updateUser(cleanEmail, {
      isLoggedIn: true,
      lastLoginTime: now
    }) || user;

    const token = generateToken(user.email);
    return res.status(200).json({ token, user: updatedUser });
  } catch (err) {
    console.error('Login Route Error:', err);
    return res.status(400).json({ error: 'Login Error', message: err.message });
  }
});

export default router;
