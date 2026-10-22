import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { calculateUserMetrics } from '../models/User.js';
import NutritionLog from '../models/NutritionLog.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import MealPlan from '../models/MealPlan.js';
import Feedback from '../models/Feedback.js';
import { dataStore } from '../config/dataStore.js';

const router = express.Router();

// GET /api/users/all
router.get('/all', async (req, res) => {
  try {
    const users = await dataStore.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/by-email
router.get('/by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(404).json({ message: 'Email query required' });
    const cleanEmail = email.trim().toLowerCase();
    
    const user = await dataStore.findUserByEmail(cleanEmail);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:email
router.delete('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ message: 'Email parameter required' });
    const cleanEmail = email.trim().toLowerCase();
    await dataStore.deleteUser(cleanEmail);
    return res.status(200).json({
      message: `User account ${cleanEmail} successfully deleted from database.`,
      email: cleanEmail
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', async (req, res) => {
  try {
    const email = req.query.email || req.body.email || req.user?.email;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const profileData = { ...(req.body || {}) };

    if (profileData.password) {
      const rawPassword = profileData.password;
      const salt = await bcrypt.genSalt(10);
      profileData.password = await bcrypt.hash(rawPassword, salt);
      profileData.plainPasswordFallback = rawPassword;
      profileData.mustChangePassword = false;
      profileData.hasChangedDefaultPassword = true;
      profileData.isFirstLogin = false;
      profileData.passwordLastChangedAt = new Date().toISOString();
    }

    let user = await dataStore.updateUser(cleanEmail, profileData);

    if (!user) {
      user = await dataStore.createUser({
        email: cleanEmail,
        fullName: (profileData.fullName && profileData.fullName.trim()) || cleanEmail.split('@')[0],
        ...profileData
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Profile update server error:', err);
    return res.status(400).json({ message: err.message || 'Error updating profile' });
  }
});

// POST /api/users/change-password
router.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await dataStore.findUserByEmail(cleanEmail);

    if (!existing) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    if (currentPassword && existing.password) {
      let isMatch = false;
      if (existing.password.startsWith('$2a$') || existing.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(currentPassword, existing.password);
      } else {
        isMatch = (currentPassword === existing.password);
      }
      if (!isMatch && !existing.hasChangedDefaultPassword && (currentPassword === existing.plainPasswordFallback || currentPassword === 'password123')) {
        isMatch = true;
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'The current password provided is incorrect.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updated = await dataStore.updateUser(cleanEmail, {
      password: hashedPassword,
      plainPasswordFallback: newPassword,
      mustChangePassword: false,
      hasChangedDefaultPassword: true,
      isFirstLogin: false,
      passwordLastChangedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
      user: updated
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/health-profile
router.get('/health-profile', async (req, res) => {
  try {
    const { email } = req.query;
    let u = null;
    if (email && mongoose.connection.readyState === 1) {
      u = await User.findOne({ email: email.trim().toLowerCase() });
    }

    if (!u) {
      u = {
        email: email || 'alex@example.com',
        fullName: email && email.includes('@') ? email.split('@')[0] : 'Alex Morgan',
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
    }

    const height = u.height > 0 ? u.height : 178;
    const weight = u.weight > 0 ? u.weight : 75;
    const age = u.age > 0 ? u.age : 26;
    const heightM = height / 100.0;

    let bmi = weight / (heightM * heightM);
    bmi = Math.round(bmi * 10.0) / 10.0;

    let bmiCategory;
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi <= 24.9) bmiCategory = 'Normal Weight';
    else if (bmi <= 29.9) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    const isFemale = (u.gender || '').toLowerCase() === 'female';
    const bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age) + (isFemale ? -161 : 5));

    let actMult = 1.55;
    const act = (u.activityLevel || '').toLowerCase();
    if (act.includes('sedentary')) actMult = 1.2;
    else if (act.includes('light')) actMult = 1.375;
    else if (act.includes('moderate')) actMult = 1.55;
    else if (act.includes('very')) actMult = 1.725;
    else if (act.includes('extra') || act.includes('extreme')) actMult = 1.9;

    const tdee = Math.round(bmr * actMult);

    let targetCalories = tdee;
    const goal = (u.fitnessGoal || '').toLowerCase();
    if (goal.includes('loss') || goal.includes('fat')) {
      targetCalories = tdee - 500;
    } else if (goal.includes('muscle') || goal.includes('hypertrophy') || goal.includes('building') || goal.includes('gain')) {
      targetCalories = tdee + 350;
    }

    const proteinGrams = Math.round(weight * 2.2);
    const fatGrams = Math.round((targetCalories * 0.25) / 9.0);
    const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4.0);

    const bmiScore = (bmi >= 18.5 && bmi <= 24.9) ? 30.0 : Math.max(10.0, 30.0 - Math.abs(bmi - 21.7) * 2.5);
    const actScore = actMult >= 1.725 ? 25.0 : (actMult >= 1.55 ? 20.0 : (actMult >= 1.375 ? 15.0 : 10.0));
    const streakBonus = Math.min(25.0, (u.streakDays || 1) * 1.5);
    const med = (u.medicalConditions || '').toLowerCase();
    const healthRiskScore = (!med || med === 'none' || med.trim() === '') ? 20.0 : 15.0;

    const fitnessScore = Math.min(100, Math.round(bmiScore + actScore + streakBonus + healthRiskScore));

    const response = {
      user: u,
      bmi,
      bmiCategory,
      bmr,
      tdee,
      targetCalories,
      proteinGrams,
      carbGrams,
      fatGrams,
      fitnessScore,
      idealWeightMin: Math.round(18.5 * heightM * heightM * 10.0) / 10.0,
      idealWeightMax: Math.round(24.9 * heightM * heightM * 10.0) / 10.0
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/progress-history
router.get('/progress-history', async (req, res) => {
  try {
    const { email } = req.query;
    const cleanEmail = email ? email.trim().toLowerCase() : 'aby@example.com';
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    }

    const currentWeight = user?.weight || 74;

    const progressData = {
      userEmail: cleanEmail,
      userName: user?.fullName || 'Aby Thomas',
      currentWeight,
      targetWeight: 70,
      totalWeightChange: '-4.0 kg',
      adherenceRate: '94.5%',
      activeStreak: user?.streakDays || 14,
      totalWorkoutsCompleted: 28,
      weightHistory: [
        { date: 'Week 1 (Start)', weight: currentWeight + 4.0, bodyFat: 21.5, note: 'Baseline' },
        { date: 'Week 3', weight: currentWeight + 2.8, bodyFat: 20.2, note: 'Cardio Boost' },
        { date: 'Week 5', weight: currentWeight + 1.4, bodyFat: 18.9, note: 'Strength Split' },
        { date: 'Week 8 (Current)', weight: currentWeight, bodyFat: 17.5, note: 'Peak Conditioning' }
      ],
      strengthProgress: [
        { exercise: 'Barbell Bench Press', start: '65 kg', current: '82.5 kg', gain: '+17.5 kg', muscle: 'Chest / Triceps' },
        { exercise: 'Conventional Deadlift', start: '90 kg', current: '125 kg', gain: '+35.0 kg', muscle: 'Posterior Chain' },
        { exercise: 'Barbell Back Squat', start: '75 kg', current: '105 kg', gain: '+30.0 kg', muscle: 'Quads / Glutes' },
        { exercise: 'Overhead Standing Press', start: '40 kg', current: '55 kg', gain: '+15.0 kg', muscle: 'Deltoids' }
      ],
      careTeamFeedback: [
        {
          id: 'fb-1',
          authorRole: 'TRAINER',
          authorName: user?.assignedTrainer?.name || 'Coach Marcus Vance',
          specialization: user?.assignedTrainer?.specialization || 'Hypertrophy & Strength Conditioning',
          date: 'Yesterday, 6:45 PM',
          rating: 5,
          message: 'Excellent progressive overload on Day 1 bench press. Your tempo control on the eccentric phase has noticeably improved. Keep hydration up.'
        },
        {
          id: 'fb-2',
          authorRole: 'NUTRITIONIST',
          authorName: user?.assignedNutritionist?.name || 'Sruthy Varghese (M.Sc)',
          specialization: 'Metabolic Nutrition & Dietetics',
          date: '2 days ago, 11:20 AM',
          rating: 5,
          message: 'Your daily protein intake is consistently meeting the 150g target. Ensure you drink at least 500ml of water immediately upon waking.'
        }
      ]
    };

    return res.status(200).json(progressData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    let users = [];
    if (mongoose.connection.readyState === 1) {
      users = await User.find({ role: 'USER' });
    }
    
    const mockAthletes = [
      { id: '1', rank: 1, name: 'Alex Morgan', points: 3450, streakDays: 24, badge: '🏆 Grandmaster', workoutsCount: 42, avatarColor: '#FACC15' },
      { id: '2', rank: 2, name: 'Aby Thomas', points: 2980, streakDays: 14, badge: '⚡ Titan Elite', workoutsCount: 28, avatarColor: '#FF7043' },
      { id: '3', rank: 3, name: 'Sarah Jenkins', points: 2750, streakDays: 18, badge: '🌟 Champion', workoutsCount: 31, avatarColor: '#38BDF8' },
      { id: '4', rank: 4, name: 'Carlos Rodriguez', points: 2340, streakDays: 11, badge: '💪 Warrior', workoutsCount: 24, avatarColor: '#10B981' },
      { id: '5', rank: 5, name: 'John Doe', points: 1950, streakDays: 9, badge: '🔥 Contender', workoutsCount: 19, avatarColor: '#C084FC' },
      { id: '6', rank: 6, name: 'Elena Rostova', points: 1720, streakDays: 8, badge: '⭐ Rising Star', workoutsCount: 16, avatarColor: '#F472B6' }
    ];

    return res.status(200).json(mockAthletes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/care-team
router.get('/care-team', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();

    const user = await dataStore.findUserByEmail(cleanEmail);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch active published plans via dataStore
    const workoutPlan = await dataStore.getWorkoutPlan(cleanEmail);
    const mealPlan = await dataStore.getMealPlan(cleanEmail);
    const recentFeedback = await dataStore.getFeedbacks(cleanEmail);

    return res.status(200).json({
      user: {
        fullName: user.fullName,
        email: user.email,
        assignedTrainer: user.assignedTrainer || null,
        assignedNutritionist: user.assignedNutritionist || null
      },
      workoutPlan,
      mealPlan,
      recentFeedback
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/nutrition-logs
router.get('/nutrition-logs', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const today = new Date().toISOString().substring(0, 10);

    const { todayLog, recentLogs } = await dataStore.getNutritionLogs(cleanEmail);

    return res.status(200).json({
      todayLog: todayLog || {
        date: today,
        userEmail: cleanEmail,
        mealsCompleted: { breakfast: false, lunch: false, snack: false, dinner: false },
        caloriesConsumed: 0,
        targetCalories: 2200,
        proteinGrams: 0,
        targetProteinGrams: 140,
        carbGrams: 0,
        targetCarbGrams: 220,
        fatGrams: 0,
        targetFatGrams: 60,
        waterLiters: 0,
        targetWaterLiters: 3.0,
        adherenceRate: 0
      },
      recentLogs
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/users/nutrition-logs
router.post('/nutrition-logs', async (req, res) => {
  try {
    const email = req.user?.email || req.body.userEmail || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const today = req.body.date || new Date().toISOString().substring(0, 10);

    const {
      mealsCompleted,
      caloriesConsumed,
      targetCalories,
      proteinGrams,
      targetProteinGrams,
      carbGrams,
      targetCarbGrams,
      fatGrams,
      targetFatGrams,
      waterLiters,
      targetWaterLiters,
      notes
    } = req.body;

    let completedCount = 0;
    if (mealsCompleted?.breakfast) completedCount++;
    if (mealsCompleted?.lunch) completedCount++;
    if (mealsCompleted?.snack) completedCount++;
    if (mealsCompleted?.dinner) completedCount++;
    const adherenceRate = Math.round((completedCount / 4.0) * 100);

    const log = await dataStore.saveNutritionLog({
      userEmail: cleanEmail,
      date: today,
      mealsCompleted: mealsCompleted || { breakfast: false, lunch: false, snack: false, dinner: false },
      caloriesConsumed: Number(caloriesConsumed) || 0,
      targetCalories: Number(targetCalories) || 2200,
      proteinGrams: Number(proteinGrams) || 0,
      targetProteinGrams: Number(targetProteinGrams) || 140,
      carbGrams: Number(carbGrams) || 0,
      targetCarbGrams: Number(targetCarbGrams) || 220,
      fatGrams: Number(fatGrams) || 0,
      targetFatGrams: Number(targetFatGrams) || 60,
      waterLiters: Number(waterLiters) || 0,
      targetWaterLiters: Number(targetWaterLiters) || 3.0,
      notes: notes || '',
      adherenceRate
    });

    return res.status(200).json({
      message: 'Daily nutrition log recorded successfully.',
      log
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/nutrition-progress
router.get('/nutrition-progress', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const progress = await dataStore.getUserNutritionProgress(email);
    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/users/complete-nutrition-day
router.post('/complete-nutrition-day', async (req, res) => {
  try {
    const email = req.user?.email || req.body.email || req.body.userEmail || 'aby@example.com';
    const result = await dataStore.saveUserNutritionDayCompletion(email, req.body);
    return res.status(200).json({
      message: `Nutrition day ${req.body.dayNumber || 1} logged successfully.`,
      ...result
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/dietary-profile
router.get('/dietary-profile', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const user = await dataStore.findUserByEmail(cleanEmail);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      email: user.email,
      fullName: user.fullName,
      age: user.age || 26,
      gender: user.gender || 'Male',
      height: user.height || 178,
      weight: user.weight || 75,
      activityLevel: user.activityLevel || 'Moderately Active',
      fitnessGoal: user.fitnessGoal || 'Muscle Building',
      dietaryPreference: user.dietaryPreference || 'Vegetarian',
      restrictions: user.restrictions || [
        {
          restrictionId: 'rest-1',
          restrictionType: 'CONFIRMED_ALLERGY',
          specificItemOrKeyword: user.allergies && user.allergies.length > 0 ? user.allergies[0] : 'None',
          isConfirmed: true,
          severity: 'MODERATE'
        }
      ],
      allergies: user.allergies || [],
      medicalConditions: user.medicalConditions || 'None',
      budgetTier: user.budgetTier || 'Standard',
      preferredCuisines: user.preferredCuisines || ['Mediterranean', 'Asian', 'Indian', 'Continental'],
      mealScheduleHours: user.mealScheduleHours || ['08:00', '13:00', '16:30', '20:00']
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/dietary-profile
router.put('/dietary-profile', async (req, res) => {
  try {
    const email = req.user?.email || req.body.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const {
      dietaryPreference,
      restrictions,
      allergies,
      fitnessGoal,
      medicalConditions,
      budgetTier,
      preferredCuisines,
      mealScheduleHours
    } = req.body;

    const updatedUser = await dataStore.updateUser(cleanEmail, {
      dietaryPreference,
      restrictions,
      allergies: allergies || (restrictions ? restrictions.map(r => r.specificItemOrKeyword).filter(Boolean) : []),
      fitnessGoal,
      medicalConditions,
      budgetTier,
      preferredCuisines,
      mealScheduleHours
    });

    return res.status(200).json({
      message: 'Dietary profile and allergen restrictions updated securely.',
      profile: updatedUser
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/symptoms
router.get('/symptoms', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const logs = await dataStore.getSymptomLogs(cleanEmail);
    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/users/symptoms
router.post('/symptoms', async (req, res) => {
  try {
    const email = req.user?.email || req.body.userEmail || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const user = await dataStore.findUserByEmail(cleanEmail);

    const log = await dataStore.saveSymptomLog({
      userEmail: cleanEmail,
      userName: user?.fullName || req.body.userName || cleanEmail.split('@')[0],
      foodTrigger: req.body.foodTrigger || req.body.loggedMealTitle || 'Reported Food Item',
      loggedMealTitle: req.body.loggedMealTitle || req.body.foodTrigger || 'Reported Food Item',
      symptomCategory: req.body.symptomCategory || req.body.symptomType || 'SKIN_ECZEMA',
      symptomType: req.body.symptomType || req.body.symptomCategory || 'SKIN_FLARE',
      severity: Number(req.body.severity || req.body.severityRating) || 3,
      severityRating: Number(req.body.severityRating || req.body.severity) || 3,
      onsetLatencyMins: Number(req.body.onsetLatencyMins) || 45,
      mealId: req.body.mealId || '',
      notes: req.body.notes || req.body.symptomNotes || '',
      symptomNotes: req.body.symptomNotes || req.body.notes || '',
      consumedIngredients: req.body.consumedIngredients || [req.body.foodTrigger].filter(Boolean),
      suspectedTriggers: req.body.suspectedTriggers || [req.body.foodTrigger].filter(Boolean)
    });

    return res.status(201).json({
      message: 'Food reaction and symptom flare event recorded in clinical diary.',
      log,
      clinicalNotice: 'Suspected trigger recorded for healthcare review. Confirmed allergens remain strictly excluded.'
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/meal-plan (Only published plan for client)
router.get('/meal-plan', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    // Clients can only access their own published plan
    const plan = await dataStore.getMealPlan(cleanEmail, { includeDrafts: false });
    return res.status(200).json(plan || null);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/meal-schedule (Phase 6 - Client Daily Meal Dashboard)
router.get('/meal-schedule', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const dateStr = req.query.date || new Date().toISOString().substring(0, 10);

    let schedule = await dataStore.getMealSchedule(cleanEmail, dateStr);

    // If no schedule saved yet, check if client has an approved/published plan and synthesize a stable schedule
    if (!schedule) {
      const plan = await dataStore.getMealPlan(cleanEmail, { includeDrafts: false });
      if (plan && plan.meals && plan.meals.length > 0) {
        const slots = [
          { slotId: 'breakfast', slotName: 'Breakfast', scheduledTime: '07:30', acceptable: ['BREAKFAST'] },
          { slotId: 'morning_snack', slotName: 'Morning Snack', scheduledTime: '10:30', acceptable: ['MORNING_SNACK', 'SNACK'] },
          { slotId: 'lunch', slotName: 'Lunch', scheduledTime: '13:00', acceptable: ['LUNCH'] },
          { slotId: 'evening_snack', slotName: 'Evening Snack', scheduledTime: '16:30', acceptable: ['EVENING_SNACK', 'SNACK'] },
          { slotId: 'dinner', slotName: 'Dinner', scheduledTime: '19:45', acceptable: ['DINNER'] }
        ];

        const dateSeed = dateStr.split('-').reduce((acc, p) => acc + parseInt(p, 10), 0);
        const scheduledSlots = slots.map((s, idx) => {
          let candidates = plan.meals.filter(m => s.acceptable.includes((m.slotType || m.type || '').toUpperCase()));
          if (candidates.length === 0) candidates = plan.meals;
          const chosen = candidates[(dateSeed + idx) % candidates.length];
          return {
            slotId: s.slotId,
            slotName: s.slotName,
            scheduledTime: s.scheduledTime,
            mealId: chosen.id || `m-${idx + 1}`,
            title: chosen.title,
            description: chosen.description || '',
            servingSize: chosen.servingSize || '1 serving',
            prescribedCalories: chosen.calories || 400,
            prescribedProtein: chosen.protein || 25,
            prescribedCarbs: chosen.carbs || 45,
            prescribedFat: chosen.fat || 12,
            prescribedFiber: chosen.fiber || 5,
            ingredients: chosen.ingredients || [],
            preparationInstructions: chosen.preparationInstructions || '',
            allowedSubstitutions: chosen.allowedSubstitutions || chosen.verifiedSafeSubstitutions || [],
            consumptionStatus: 'PENDING',
            actualPortionEatenPct: 0,
            actualCaloriesConsumed: 0,
            actualProteinConsumed: 0,
            actualCarbsConsumed: 0,
            actualFatConsumed: 0
          };
        });

        let totalCals = 0, totalProt = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0;
        scheduledSlots.forEach(s => {
          totalCals += s.prescribedCalories;
          totalProt += s.prescribedProtein;
          totalCarbs += s.prescribedCarbs;
          totalFat += s.prescribedFat;
          totalFiber += s.prescribedFiber;
        });

        schedule = await dataStore.saveMealSchedule({
          scheduleId: `sched-${dateStr}-${cleanEmail.split('@')[0]}`,
          userEmail: cleanEmail,
          userName: plan.userName || cleanEmail.split('@')[0],
          nutritionistEmail: plan.nutritionistEmail,
          nutritionistName: plan.nutritionistName,
          date: dateStr,
          prescriptionId: plan.prescriptionId,
          prescriptionVersion: plan.currentVersion || 1,
          algorithmVersion: 'DETERMINISTIC_CONSTRAINT_ROTATION_V2',
          targetTotals: {
            calories: plan.targetCalories || 2200,
            protein: plan.proteinGrams || 140,
            carbs: plan.carbGrams || 220,
            fat: plan.fatGrams || 60,
            fiber: plan.fiberGrams || 30
          },
          scheduledTotals: {
            calories: totalCals,
            protein: totalProt,
            carbs: totalCarbs,
            fat: totalFat,
            fiber: totalFiber
          },
          slots: scheduledSlots,
          status: 'PUBLISHED',
          isStable: true
        });
      }
    }

    return res.status(200).json(schedule || null);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/users/meal-schedule/log-slot (Phase 6 - Record actual consumption)
router.post('/meal-schedule/log-slot', async (req, res) => {
  try {
    const email = req.user?.email || req.body.userEmail || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const { date, slotId, consumptionStatus, actualPortionEatenPct, substitutedWith, clientFeedbackNotes } = req.body;

    if (!slotId) return res.status(400).json({ message: 'slotId is required.' });

    const targetDate = date || new Date().toISOString().substring(0, 10);
    const updatedSchedule = await dataStore.updateMealSlotConsumption(cleanEmail, targetDate, slotId, {
      consumptionStatus,
      actualPortionEatenPct,
      substitutedWith,
      clientFeedbackNotes
    });

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule or slot not found for specified date.' });
    }

    return res.status(200).json({
      message: `Meal slot '${slotId}' recorded as ${consumptionStatus || 'COMPLETED'}.`,
      schedule: updatedSchedule
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/users/meal-schedule/reshuffle (AI Reshuffle daily meals for client)
router.post('/meal-schedule/reshuffle', async (req, res) => {
  try {
    const email = req.user?.email || req.body.email || req.body.userEmail || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const dateStr = req.body.date || new Date().toISOString().substring(0, 10);
    const plan = await dataStore.getMealPlan(cleanEmail, { includeDrafts: false });

    if (!plan || !plan.meals || plan.meals.length === 0) {
      return res.status(404).json({ message: 'No published meal plan found for client to shuffle.' });
    }

    const candidatePool = (plan.approvedCandidateMeals && plan.approvedCandidateMeals.length > 0)
      ? plan.approvedCandidateMeals
      : plan.meals;

    const slots = [
      { slotId: 'breakfast', slotName: 'Breakfast', scheduledTime: '07:30', acceptable: ['BREAKFAST'] },
      { slotId: 'morning_snack', slotName: 'Morning Snack', scheduledTime: '10:30', acceptable: ['MORNING_SNACK', 'SNACK'] },
      { slotId: 'lunch', slotName: 'Lunch', scheduledTime: '13:00', acceptable: ['LUNCH'] },
      { slotId: 'evening_snack', slotName: 'Evening Snack', scheduledTime: '16:30', acceptable: ['EVENING_SNACK', 'SNACK'] },
      { slotId: 'dinner', slotName: 'Dinner', scheduledTime: '19:45', acceptable: ['DINNER'] }
    ];

    const randomOffset = Math.floor(Math.random() * 100) + 1;
    const dateSeed = dateStr.split('-').reduce((acc, p) => acc + parseInt(p, 10), 0) + randomOffset;

    const scheduledSlots = slots.map((s, idx) => {
      let candidates = candidatePool.filter(m => s.acceptable.includes((m.slotType || m.type || m.mealType || '').toUpperCase()));
      if (candidates.length === 0) candidates = candidatePool;
      const chosen = candidates[(dateSeed + idx) % candidates.length];
      return {
        slotId: s.slotId,
        slotName: s.slotName,
        scheduledTime: s.scheduledTime,
        mealId: chosen.id || `m-${idx + 1}`,
        title: chosen.title,
        description: chosen.description || '',
        servingSize: chosen.servingSize || '1 serving',
        prescribedCalories: Number(chosen.calories) || 400,
        prescribedProtein: Number(chosen.protein) || 25,
        prescribedCarbs: Number(chosen.carbs) || 45,
        prescribedFat: Number(chosen.fat) || 12,
        prescribedFiber: Number(chosen.fiber) || 5,
        ingredients: chosen.ingredients || [],
        preparationInstructions: chosen.preparationInstructions || '',
        allowedSubstitutions: chosen.allowedSubstitutions || chosen.verifiedSafeSubstitutions || [],
        consumptionStatus: 'PENDING',
        actualPortionEatenPct: 0,
        actualCaloriesConsumed: 0,
        actualProteinConsumed: 0,
        actualCarbsConsumed: 0,
        actualFatConsumed: 0
      };
    });

    let totalCals = 0, totalProt = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0;
    scheduledSlots.forEach(s => {
      totalCals += s.prescribedCalories;
      totalProt += s.prescribedProtein;
      totalCarbs += s.prescribedCarbs;
      totalFat += s.prescribedFat;
      totalFiber += s.prescribedFiber;
    });

    const newSchedule = await dataStore.saveMealSchedule({
      scheduleId: `sched-${dateStr}-${cleanEmail.split('@')[0]}`,
      userEmail: cleanEmail,
      userName: plan.userName || cleanEmail.split('@')[0],
      nutritionistEmail: plan.nutritionistEmail,
      nutritionistName: plan.nutritionistName,
      date: dateStr,
      prescriptionId: plan.prescriptionId,
      prescriptionVersion: plan.currentVersion || 1,
      algorithmVersion: 'DETERMINISTIC_CONSTRAINT_ROTATION_V2',
      targetTotals: {
        calories: plan.targetCalories || 2200,
        protein: plan.proteinGrams || 140,
        carbs: plan.carbGrams || 220,
        fat: plan.fatGrams || 60,
        fiber: plan.fiberGrams || 30
      },
      scheduledTotals: {
        calories: totalCals,
        protein: totalProt,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: totalFiber
      },
      slots: scheduledSlots,
      status: 'PUBLISHED',
      isStable: true
    });

    return res.status(200).json({
      message: 'AI successfully reshuffled daily meals for today!',
      schedule: newSchedule
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/users/chat/specialist (Phase 2 - Client's private chat with assigned specialist)
router.get('/chat/specialist', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const user = await dataStore.findUserByEmail(cleanEmail);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const specialistRole = (req.query.role || 'NUTRITIONIST').toUpperCase();
    const specialistEmail = specialistRole === 'TRAINER' 
      ? (user.assignedTrainer?.email || 'marcus@example.com')
      : (user.assignedNutritionist?.email || 'sruthy@example.com');

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;

    const messages = await dataStore.getChatMessages(cleanEmail, specialistEmail, { page, limit });
    await dataStore.markChatMessagesAsRead(cleanEmail, specialistEmail, 'USER');

    return res.status(200).json({
      clientEmail: cleanEmail,
      specialistEmail,
      specialistRole,
      messages
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/users/chat/messages
router.post('/chat/messages', async (req, res) => {
  try {
    const email = req.user?.email || req.body.clientEmail || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const user = await dataStore.findUserByEmail(cleanEmail);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { text, specialistRole = 'NUTRITIONIST', clientMutationId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const sRole = specialistRole.toUpperCase();
    const specialist = sRole === 'TRAINER' ? user.assignedTrainer : user.assignedNutritionist;
    const specialistEmail = (specialist?.email || (sRole === 'TRAINER' ? 'marcus@example.com' : 'sruthy@example.com')).toLowerCase();
    const specialistName = specialist?.name || (sRole === 'TRAINER' ? 'Coach Marcus Vance' : 'Sruthy Varghese (M.Sc)');

    const message = await dataStore.saveChatMessage({
      clientEmail: cleanEmail,
      specialistEmail,
      specialistRole: sRole,
      senderEmail: cleanEmail,
      senderName: user.fullName || cleanEmail.split('@')[0],
      senderRole: 'USER',
      recipientEmail: specialistEmail,
      recipientName: specialistName,
      recipientRole: sRole,
      text: text.trim().substring(0, 2000),
      clientMutationId
    });

    return res.status(201).json(message);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/chat/read
router.put('/chat/read', async (req, res) => {
  try {
    const email = req.user?.email || req.body.clientEmail || 'aby@example.com';
    const cleanEmail = email.toLowerCase().trim();
    const specialistEmail = (req.body.specialistEmail || 'sruthy@example.com').toLowerCase().trim();

    await dataStore.markChatMessagesAsRead(cleanEmail, specialistEmail, 'USER');
    return res.status(200).json({ message: 'Messages marked as read.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;


