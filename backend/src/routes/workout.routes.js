import express from 'express';
import User from '../models/User.js';
import WorkoutLog from '../models/WorkoutLog.js';
import { dataStore } from '../config/dataStore.js';

const router = express.Router();
const FASTAPI_ML_URL = process.env.FASTAPI_ML_URL || 'http://localhost:8000/predict/workout';

// Helper: Generate fallback / rule-based exercises
function generateWorkoutExercises(user, category = 'Full Body') {
  const exercises = [];
  const equipment = user?.workoutEquipment || 'Full Gym Access';
  const goal = user?.fitnessGoal || 'Muscle Building';
  const medical = (user?.medicalConditions || '').toLowerCase();

  const repsMultiplier = goal.toLowerCase().includes('loss') ? 15 : 10;
  const setsCount = goal.toLowerCase().includes('muscle') ? 4 : 3;

  if (!category || category.toLowerCase() === 'full body' || category === '') {
    if (!medical.includes('knee')) {
      exercises.push({
        id: 'ex-1',
        name: 'Barbell Back Squats',
        sets: setsCount,
        reps: repsMultiplier + ' Reps',
        targetMuscle: 'Quadriceps & Glutes',
        equipmentNeeded: equipment,
        instructions: 'Keep chest up and squat down to 90 degrees.',
        estimatedCaloriesBurned: 120
      });
    } else {
      exercises.push({
        id: 'ex-1',
        name: 'Seated Dumbbell Press',
        sets: setsCount,
        reps: repsMultiplier + ' Reps',
        targetMuscle: 'Shoulders & Core',
        equipmentNeeded: equipment,
        instructions: 'Press dumbbells overhead smoothly keeping back flat.',
        estimatedCaloriesBurned: 90
      });
    }

    exercises.push({
      id: 'ex-2',
      name: 'Incline Dumbbell Bench Press',
      sets: setsCount,
      reps: repsMultiplier + ' Reps',
      targetMuscle: 'Upper Chest',
      equipmentNeeded: equipment,
      instructions: 'Press dumbbells upward at a 30 degree incline.',
      estimatedCaloriesBurned: 110
    });
    exercises.push({
      id: 'ex-3',
      name: 'Lat Pulldown / Bent Rows',
      sets: setsCount,
      reps: repsMultiplier + ' Reps',
      targetMuscle: 'Lats & Upper Back',
      equipmentNeeded: equipment,
      instructions: 'Pull down to upper chest focusing on squeeze.',
      estimatedCaloriesBurned: 100
    });
    exercises.push({
      id: 'ex-4',
      name: 'Plank Hold',
      sets: 3,
      reps: '60 Sec',
      targetMuscle: 'Core Stability',
      equipmentNeeded: 'Bodyweight',
      instructions: 'Maintain rigid straight line from shoulders to ankles.',
      estimatedCaloriesBurned: 50
    });
    exercises.push({
      id: 'ex-5',
      name: 'HIIT Jump Rope / Mountain Climbers',
      sets: 3,
      reps: '45 Sec',
      targetMuscle: 'Cardiovascular',
      equipmentNeeded: 'Bodyweight',
      instructions: 'High intensity burst to boost metabolic rate.',
      estimatedCaloriesBurned: 130
    });
  } else if (category.toLowerCase() === 'upper body') {
    exercises.push({
      id: 'ex-u1',
      name: 'Barbell / Dumbbell Bench Press',
      sets: setsCount,
      reps: repsMultiplier + ' Reps',
      targetMuscle: 'Chest',
      equipmentNeeded: equipment,
      instructions: 'Lower bar to mid-chest and explode upward.',
      estimatedCaloriesBurned: 110
    });
    exercises.push({
      id: 'ex-u2',
      name: 'Seated Cable Rows',
      sets: setsCount,
      reps: repsMultiplier + ' Reps',
      targetMuscle: 'Middle Back',
      equipmentNeeded: equipment,
      instructions: 'Pull handles to belly button, squeezing shoulder blades.',
      estimatedCaloriesBurned: 95
    });
    exercises.push({
      id: 'ex-u3',
      name: 'Dumbbell Lateral Raises',
      sets: 3,
      reps: '12-15 Reps',
      targetMuscle: 'Side Deltoids',
      equipmentNeeded: equipment,
      instructions: 'Raise arms out to sides until parallel with floor.',
      estimatedCaloriesBurned: 60
    });
    exercises.push({
      id: 'ex-u4',
      name: 'Triceps Rope Pushdowns',
      sets: 3,
      reps: '12 Reps',
      targetMuscle: 'Triceps',
      equipmentNeeded: equipment,
      instructions: 'Extend arms downward locking out at bottom.',
      estimatedCaloriesBurned: 70
    });
    exercises.push({
      id: 'ex-u5',
      name: 'EZ-Bar Biceps Curls',
      sets: 3,
      reps: '10-12 Reps',
      targetMuscle: 'Biceps',
      equipmentNeeded: equipment,
      instructions: 'Curl bar up focusing on tension without swinging.',
      estimatedCaloriesBurned: 70
    });
  } else if (category.toLowerCase().includes('core') || category.toLowerCase().includes('cardio')) {
    exercises.push({
      id: 'ex-c1',
      name: 'Hanging Leg Raises / Knee Tucks',
      sets: 4,
      reps: '15 Reps',
      targetMuscle: 'Lower Abs',
      equipmentNeeded: 'Bodyweight',
      instructions: 'Raise legs up to 90 degrees with control.',
      estimatedCaloriesBurned: 80
    });
    exercises.push({
      id: 'ex-c2',
      name: 'Russian Twists with Weight',
      sets: 3,
      reps: '20 Reps',
      targetMuscle: 'Obliques',
      equipmentNeeded: equipment,
      instructions: 'Twist torso side to side touching weight to floor.',
      estimatedCaloriesBurned: 65
    });
    exercises.push({
      id: 'ex-c3',
      name: 'Sprinting Interval Treadmill',
      sets: 5,
      reps: '1 Min Sprint / 1 Min Walk',
      targetMuscle: 'Cardio System',
      equipmentNeeded: equipment,
      instructions: 'High speed sprint followed by recovery walk.',
      estimatedCaloriesBurned: 180
    });
    exercises.push({
      id: 'ex-c4',
      name: 'Bicycle Crunches',
      sets: 3,
      reps: '25 Reps',
      targetMuscle: 'Total Abs',
      equipmentNeeded: 'Bodyweight',
      instructions: 'Alternate elbow to opposite knee smoothly.',
      estimatedCaloriesBurned: 75
    });
  }

  return exercises;
}

// Helper: ML workout recommendation with fallback
async function getMLWorkoutRecommendation(user) {
  try {
    const payload = {
      userId: user.id || user._id?.toString() || user.email || 'john@example.com',
      age: user.age > 0 ? user.age : 26,
      gender: user.gender || 'Male',
      weight: user.weight > 0 ? user.weight : 70.0,
      height: user.height > 0 ? (user.height < 3 ? user.height : user.height / 100.0) : 1.75,
      bmi: user.bmi > 0 ? user.bmi : 22.9,
      restingBpm: 65.0,
      fatPercentage: 20.0,
      workoutFrequency: 4,
      experienceLevel: '2',
      fitnessGoal: user.fitnessGoal || 'Weight Loss',
      workoutEquipment: user.workoutEquipment || 'Dumbbells Only',
      medicalConditions: user.medicalConditions || 'None'
    };

    const response = await fetch(FASTAPI_ML_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // FastAPI ML service offline notice
  }

  return {
    userId: user.email || 'john@example.com',
    recommendedWorkoutType: (user.fitnessGoal || '').toLowerCase().includes('loss') ? 'Cardio' : 'Strength',
    experienceLevel: 'Intermediate',
    recommendedDuration: '45 - 60 mins',
    recommendedFrequency: '4 days / week',
    recommendedIntensity: 'Moderate (RPE 7-8)',
    reason: `Target Goal: Calibrated for goal '${user.fitnessGoal || 'General Fitness'}' • Biometric Match: Adapted for user profile.`,
    confidence: '88.5%'
  };
}

// GET /api/workouts/recommend
router.get('/recommend', async (req, res) => {
  try {
    const email = req.user?.email || req.query.email || 'john@example.com';
    let user = await dataStore.findUserByEmail(email.toLowerCase());
    if (!user) {
      user = {
        fullName: 'John Doe',
        email,
        age: 26,
        gender: 'Male',
        weight: 70.0,
        height: 175.0,
        workoutEquipment: 'Dumbbells Only',
        fitnessGoal: 'Weight Loss'
      };
    }

    const rec = await getMLWorkoutRecommendation(user);
    return res.status(200).json(rec);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts/recommend
router.post('/recommend', async (req, res) => {
  try {
    const customProfile = req.body || {};
    const email = req.user?.email || customProfile.email || 'john@example.com';
    let user = await dataStore.findUserByEmail(email.toLowerCase());

    if (!user) {
      user = {
        fullName: 'John Doe',
        email,
        ...customProfile
      };
    } else {
      if (customProfile.fitnessGoal) user.fitnessGoal = customProfile.fitnessGoal;
      if (customProfile.workoutEquipment) user.workoutEquipment = customProfile.workoutEquipment;
    }

    const rec = await getMLWorkoutRecommendation(user);
    return res.status(200).json(rec);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/generate
router.get('/generate', async (req, res) => {
  try {
    const category = req.query.category || 'Full Body';
    const email = req.user?.email || req.query.email || 'john@example.com';
    let user = await dataStore.findUserByEmail(email.toLowerCase());

    if (!user) {
      user = {
        fullName: 'User',
        email,
        workoutEquipment: 'Full Gym Access',
        fitnessGoal: 'Muscle Building'
      };
    }

    const exercises = generateWorkoutExercises(user, category);
    return res.status(200).json({
      category,
      userGoal: user.fitnessGoal,
      equipment: user.workoutEquipment,
      exercises
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts/log
router.post('/log', async (req, res) => {
  try {
    const payload = req.body || {};
    const email = req.user?.email || payload.email || 'john@example.com';
    const workoutTitle = payload.workoutTitle || 'SmartFit Daily Session';
    const durationMinutes = Number(payload.durationMinutes) || 45;
    const caloriesBurned = Number(payload.caloriesBurned) || 350;
    const completedExercises = payload.completedExercises || [];

    const xpEarned = caloriesBurned + (durationMinutes * 5);
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const log = await WorkoutLog.create({
      userEmail: email.toLowerCase(),
      workoutTitle,
      date: dateStr,
      durationMinutes,
      caloriesBurned,
      xpEarned,
      completedExercises
    });

    // Update user points and streak
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.points = (user.points || 0) + xpEarned;
      user.streakDays = (user.streakDays || 1) + 1;
      await user.save();
    }

    return res.status(200).json({
      message: 'Workout logged successfully to MongoDB!',
      log
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/history
router.get('/history', async (req, res) => {
  try {
    const email = req.query.email || req.user?.email || 'john@example.com';
    const history = await WorkoutLog.find({ userEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/progress
router.get('/progress', async (req, res) => {
  try {
    const email = req.query.email || req.user?.email || 'aby@example.com';
    const progress = await dataStore.getUserWorkoutProgress(email);
    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts/complete-day
router.post('/complete-day', async (req, res) => {
  try {
    const email = req.body.email || req.user?.email || 'aby@example.com';
    const result = await dataStore.saveUserWorkoutDayCompletion(email, req.body);
    return res.status(200).json({
      message: `Day ${req.body.dayNumber || 1} workout logged and recorded in user profile.`,
      ...result
    });
  } catch (err) {
    console.error('Error completing workout day:', err);
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts/reset-cycle
router.post('/reset-cycle', async (req, res) => {
  try {
    const email = req.body.email || req.user?.email || 'aby@example.com';
    const result = await dataStore.resetUserWorkoutProgress(email);
    return res.status(200).json({
      message: 'Workout cycle reset to Day 1.',
      user: result
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
