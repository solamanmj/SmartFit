import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { calculateUserMetrics } from '../models/User.js';
import Trainer from '../models/Trainer.js';
import Nutritionist from '../models/Nutritionist.js';
import ExerciseItem from '../models/ExerciseItem.js';
import NutritionFoodItem from '../models/NutritionFoodItem.js';
import Feedback from '../models/Feedback.js';
import WorkoutLog from '../models/WorkoutLog.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import WorkoutSplit from '../models/WorkoutSplit.js';
import MealPlan from '../models/MealPlan.js';
import SymptomLog from '../models/SymptomLog.js';
import ChatMessage from '../models/ChatMessage.js';
import Conversation from '../models/Conversation.js';
import MealSchedule from '../models/MealSchedule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_SEEDS = {
  users: [
    {
      id: 'admin-01',
      fullName: 'System Administrator',
      email: 'admin@smartfit.com',
      password: '$2a$10$e8wY4i8XyP64J8eKjI9X/OHuN17v7yKqW5Z0dJd7B8rQ1M6g5Z4Wa',
      plainPasswordFallback: 'AdminPass123!',
      role: 'ADMIN',
      age: 32,
      gender: 'Male',
      height: 180,
      weight: 80,
      activityLevel: 'Very Active',
      fitnessGoal: 'System Operations',
      dietaryPreference: 'Standard Balanced',
      workoutEquipment: 'Full Gym Access',
      medicalConditions: 'None',
      streakDays: 45,
      points: 1200,
      bmi: 24.7,
      bmr: 1800,
      tdee: 2900,
      targetCalories: 2800,
      fitnessScore: 92,
      bmiCategory: 'Normal Weight',
      isLoggedIn: false
    },
    {
      id: 'trainer-01',
      fullName: 'Marcus Vance',
      email: 'marcus@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
      role: 'TRAINER',
      age: 34,
      gender: 'Male',
      height: 185,
      weight: 92,
      activityLevel: 'Very Active',
      fitnessGoal: 'Heavy Strength',
      dietaryPreference: 'High Protein Keto',
      workoutEquipment: 'Full Gym Access',
      medicalConditions: 'None',
      specialization: 'Hypertrophy & Strength Conditioning',
      experienceYears: 8,
      streakDays: 32,
      points: 850,
      isLoggedIn: false
    },
    {
      id: 'trainer-02',
      fullName: 'Sarah Jenkins',
      email: 'sarah@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
      role: 'TRAINER',
      age: 28,
      gender: 'Female',
      height: 165,
      weight: 58,
      activityLevel: 'Very Active',
      fitnessGoal: 'Endurance & Conditioning',
      dietaryPreference: 'Vegan',
      workoutEquipment: 'Full Gym Access',
      medicalConditions: 'None',
      specialization: 'Cardio Endurance & Calisthenics',
      experienceYears: 6,
      streakDays: 28,
      points: 740,
      isLoggedIn: false
    },
    {
      id: 'trainer-03',
      fullName: 'David Kim',
      email: 'david@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
      role: 'TRAINER',
      age: 24,
      gender: 'Male',
      height: 176,
      weight: 68,
      activityLevel: 'Lightly Active',
      fitnessGoal: 'Athletic Conditioning',
      dietaryPreference: 'Standard Balanced',
      workoutEquipment: 'Bodyweight / Calisthenics',
      medicalConditions: 'None',
      specialization: 'Athletic Mobility & Functional Training',
      experienceYears: 5,
      streakDays: 19,
      points: 520,
      isLoggedIn: false
    },
    {
      id: 'nutri-01',
      fullName: 'Sruthy Varghese (M.Sc)',
      email: 'sruthy@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
      role: 'NUTRITIONIST',
      age: 25,
      gender: 'Female',
      height: 163,
      weight: 56,
      activityLevel: 'Very Active',
      fitnessGoal: 'Fat Loss & Toning',
      dietaryPreference: 'Vegetarian',
      workoutEquipment: 'Dumbbells & Resistance Bands',
      medicalConditions: 'None',
      qualification: 'M.Sc. Dietetics & Performance Nutrition',
      specialization: 'Plant-Based & Vegetarian Nutrition',
      experienceYears: 7,
      streakDays: 24,
      points: 620,
      isLoggedIn: false
    },
    {
      id: 'nutri-02',
      fullName: 'Dr. Elena Rostova (Ph.D)',
      email: 'elena@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
      role: 'NUTRITIONIST',
      age: 31,
      gender: 'Female',
      height: 170,
      weight: 62,
      activityLevel: 'Moderately Active',
      fitnessGoal: 'Hypertrophy & Toning',
      dietaryPreference: 'Low Carb',
      workoutEquipment: 'Full Gym Access',
      medicalConditions: 'None',
      qualification: 'Ph.D. Sports Clinical Nutrition & BCNS',
      specialization: 'High-Protein & Metabolic Diets',
      experienceYears: 10,
      streakDays: 35,
      points: 910,
      isLoggedIn: false
    },
    {
      id: 'user-01',
      fullName: 'Aby Thomas',
      email: 'aby@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
      role: 'USER',
      age: 27,
      gender: 'Male',
      height: 177,
      weight: 74,
      activityLevel: 'Moderately Active',
      fitnessGoal: 'Muscle Building',
      dietaryPreference: 'Standard Balanced',
      workoutEquipment: 'Full Gym Access',
      medicalConditions: 'None',
      assignedTrainer: {
        email: 'marcus@example.com',
        name: 'Coach Marcus Vance',
        specialization: 'Hypertrophy & Strength Conditioning'
      },
      assignedNutritionist: {
        email: 'sruthy@example.com',
        name: 'Sruthy Varghese (M.Sc)',
        qualification: 'M.Sc. Dietetics & Performance Nutrition'
      },
      streakDays: 6,
      points: 380,
      bmi: 23.6,
      bmr: 1720,
      tdee: 2666,
      targetCalories: 3016,
      fitnessScore: 82,
      bmiCategory: 'Normal Weight',
      isLoggedIn: false
    },
    {
      id: 'user-02',
      fullName: 'Alex Morgan',
      email: 'alex@example.com',
      password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
      plainPasswordFallback: 'password123',
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
      assignedTrainer: {
        email: 'sarah@example.com',
        name: 'Coach Sarah Jenkins',
        specialization: 'Cardio Endurance & Calisthenics'
      },
      assignedNutritionist: {
        email: 'elena@example.com',
        name: 'Dr. Elena Rostova (Ph.D)',
        qualification: 'Ph.D. Sports Clinical Nutrition'
      },
      streakDays: 4,
      points: 290,
      bmi: 23.7,
      bmr: 1740,
      tdee: 2697,
      targetCalories: 3047,
      fitnessScore: 78,
      bmiCategory: 'Normal Weight',
      isLoggedIn: false
    }
  ],
  trainers: [
    { fullName: 'Marcus Vance', email: 'marcus@example.com', specialization: 'Hypertrophy & Strength Conditioning', experienceYears: 8, assignedUsersCount: 3, status: 'ACTIVE', createdAt: '2026-01-15' },
    { fullName: 'Sarah Jenkins', email: 'sarah@example.com', specialization: 'Cardio Endurance & Calisthenics', experienceYears: 6, assignedUsersCount: 2, status: 'ACTIVE', createdAt: '2026-02-01' },
    { fullName: 'David Kim', email: 'david@example.com', specialization: 'Athletic Mobility & Functional Training', experienceYears: 5, assignedUsersCount: 2, status: 'ACTIVE', createdAt: '2026-02-10' }
  ],
  nutritionists: [
    { fullName: 'Dr. Elena Rostova', email: 'elena@example.com', qualification: 'Ph.D. Sports Clinical Nutrition', specialization: 'High-Protein & Metabolic Diets', experienceYears: 10, status: 'ACTIVE', createdAt: '2026-01-10' },
    { fullName: 'Sruthy Varghese', email: 'sruthy@example.com', qualification: 'M.Sc. Dietetics & Wellness', specialization: 'Plant-Based & Vegetarian Nutrition', experienceYears: 7, status: 'ACTIVE', createdAt: '2026-01-20' }
  ],
  exercises: [
    { name: 'Incline Dumbbell Bench Press', workoutType: 'Hypertrophy', muscleGroup: 'Upper Chest & Triceps', difficulty: 'Intermediate', equipmentNeeded: 'Dumbbells & Incline Bench', durationMinutes: 15, estimatedCaloriesBurned: 140, instructions: 'Maintain 45-degree incline bench angle. Press weights directly over chest.' },
    { name: 'Barbell Romanian Deadlift', workoutType: 'Strength', muscleGroup: 'Hamstrings & Glutes', difficulty: 'Intermediate', equipmentNeeded: 'Barbell & Plates', durationMinutes: 20, estimatedCaloriesBurned: 180, instructions: 'Keep spine neutral. Hinge backwards at hips until hamstring stretch is felt.' },
    { name: 'High Intensity Battle Ropes', workoutType: 'Cardio HIIT', muscleGroup: 'Full Body Conditioning', difficulty: 'Advanced', equipmentNeeded: 'Battle Ropes', durationMinutes: 10, estimatedCaloriesBurned: 150, instructions: 'Perform alternating waves continuously for 45-second work intervals.' },
    { name: 'Bodyweight Pull-Ups', workoutType: 'Calisthenics', muscleGroup: 'Lats & Biceps', difficulty: 'Intermediate', equipmentNeeded: 'Pull-up Bar', durationMinutes: 12, estimatedCaloriesBurned: 110, instructions: 'Full range of motion. Pull chin over bar without swinging hips.' },
    { name: 'Seated Cable Rows', workoutType: 'Hypertrophy', muscleGroup: 'Mid-Back & Rhomboids', difficulty: 'Beginner', equipmentNeeded: 'Cable Machine', durationMinutes: 15, estimatedCaloriesBurned: 120, instructions: 'Drive elbows back while keeping chest upright.' }
  ],
  foodItems: [
    { name: 'Grilled Organic Chicken Breast', calories: 165, proteinGrams: 31.0, carbGrams: 0.0, fatGrams: 3.6, category: 'Poultry', dietaryCategory: 'Standard Balanced' },
    { name: 'Wild Alaskan Salmon Fillet', calories: 206, proteinGrams: 22.0, carbGrams: 0.0, fatGrams: 12.0, category: 'Seafood', dietaryCategory: 'Pescatarian / High Omega-3' },
    { name: 'Steamed Quinoa & Chickpea Bowl', calories: 222, proteinGrams: 8.1, carbGrams: 39.4, fatGrams: 3.5, category: 'Grains & Legumes', dietaryCategory: 'Vegan / Vegetarian' },
    { name: 'Greek Yogurt & Chia Protein Parfait', calories: 150, proteinGrams: 15.0, carbGrams: 12.0, fatGrams: 4.0, category: 'Dairy', dietaryCategory: 'High Protein Vegetarian' },
    { name: 'Avocado & Spinach Almond Protein Shake', calories: 240, proteinGrams: 20.0, carbGrams: 14.0, fatGrams: 11.0, category: 'Beverage & Shake', dietaryCategory: 'Keto / Vegan' }
  ],
  workoutPlans: [
    {
      id: 'wp-plan-01',
      userEmail: 'aby@example.com',
      userName: 'Aby Thomas',
      trainerEmail: 'marcus@example.com',
      trainerName: 'Marcus Vance',
      planTitle: 'Custom 4-Week Hypertrophy & Power Split',
      category: 'Upper Body',
      difficulty: 'Intermediate',
      targetGoal: 'Muscle Building',
      durationWeeks: 4,
      notes: 'Focus on progressive overload each week. Keep 90s rest intervals on compound lifts.',
      status: 'PUBLISHED',
      exercises: [
        { id: 'wp-1', name: 'Incline Dumbbell Bench Press', sets: 4, reps: '8-10 Reps', targetMuscle: 'Upper Chest', equipmentNeeded: 'Dumbbells & Bench', instructions: 'Drive smoothly upward with 30-degree bench angle.', estimatedCaloriesBurned: 120 },
        { id: 'wp-2', name: 'Barbell Flat Bench Press', sets: 4, reps: '8 Reps', targetMuscle: 'Mid Pecs', equipmentNeeded: 'Barbell & Bench', instructions: 'Lower bar to mid-chest and press up explosively.', estimatedCaloriesBurned: 140 },
        { id: 'wp-3', name: 'Triceps Rope Pushdowns', sets: 3, reps: '12-15 Reps', targetMuscle: 'Triceps Lateral Head', equipmentNeeded: 'Cable Machine', instructions: 'Strict elbow lockout at the bottom.', estimatedCaloriesBurned: 80 },
        { id: 'wp-4', name: 'Cable Lateral Raises', sets: 3, reps: '15 Reps', targetMuscle: 'Side Deltoids', equipmentNeeded: 'Cable Pulley', instructions: 'Keep knuckles pointed slightly upwards for lateral head isolation.', estimatedCaloriesBurned: 60 }
      ],
      createdAt: '2026-08-17 10:00:00'
    },
    {
      id: 'wp-plan-02',
      userEmail: 'alex@example.com',
      userName: 'Alex Morgan',
      trainerEmail: 'sarah@example.com',
      trainerName: 'Sarah Jenkins',
      planTitle: 'Athletic Conditioning & Hypertrophy Foundation',
      category: 'Full Body',
      difficulty: 'Intermediate',
      targetGoal: 'Muscle Building',
      durationWeeks: 4,
      notes: 'Ensure proper dynamic warm-up before squats. Calibrated for high stamina.',
      status: 'PUBLISHED',
      exercises: [
        { id: 'wp-a1', name: 'Barbell Back Squats', sets: 4, reps: '10 Reps', targetMuscle: 'Quadriceps & Glutes', equipmentNeeded: 'Squat Rack & Barbell', instructions: 'Hit 90 degrees depth with upright chest.', estimatedCaloriesBurned: 150 },
        { id: 'wp-a2', name: 'Lat Pulldowns', sets: 3, reps: '12 Reps', targetMuscle: 'Lats & Upper Back', equipmentNeeded: 'Cable Lat Machine', instructions: 'Pull to upper chest focusing on lat contraction.', estimatedCaloriesBurned: 95 },
        { id: 'wp-a3', name: 'Standing Overhead DB Press', sets: 3, reps: '10 Reps', targetMuscle: 'Shoulders', equipmentNeeded: 'Dumbbells', instructions: 'Core braced, press weights overhead without arching back.', estimatedCaloriesBurned: 85 }
      ],
      createdAt: '2026-08-17 10:00:00'
    }
  ],
  mealPlans: [
    {
      id: 'mp-plan-01',
      userEmail: 'aby@example.com',
      userName: 'Aby Thomas',
      nutritionistEmail: 'sruthy@example.com',
      nutritionistName: 'Sruthy Varghese',
      planTitle: 'High-Protein Clean Hypertrophy Blueprint',
      dietaryPreference: 'Standard Balanced',
      targetCalories: 2850,
      proteinGrams: 165,
      carbGrams: 320,
      fatGrams: 75,
      hydrationLiters: 3.5,
      notes: 'Consume post-workout shake within 45 minutes of training. Prioritize complex carbohydrates for sustained energy.',
      status: 'PUBLISHED',
      meals: [
        { id: 'mp-1', type: 'Breakfast', title: 'Rolled Oats with Whey, Chia & Blueberries', description: '80g oats, 1 scoop whey protein, 1 tbsp chia seeds, fresh berries', calories: 620, protein: '42g', carbs: '75g', fat: '14g' },
        { id: 'mp-2', type: 'Lunch', title: 'Grilled Herb Chicken with Quinoa & Roasted Veggies', description: '200g grilled chicken breast, 1 cup cooked quinoa, steamed broccoli', calories: 820, protein: '56g', carbs: '88g', fat: '18g' },
        { id: 'mp-3', type: 'Snack', title: 'Greek Yogurt with Almond Butter & Honey', description: '200g Greek yogurt 0%, 15g natural almond butter, drizzle of honey', calories: 410, protein: '26g', carbs: '32g', fat: '16g' },
        { id: 'mp-4', type: 'Dinner', title: 'Wild Salmon Fillet with Sweet Potato & Asparagus', description: '180g baked salmon, 200g baked sweet potato, garlic asparagus', calories: 780, protein: '45g', carbs: '65g', fat: '24g' }
      ],
      createdAt: '2026-08-17 10:00:00'
    }
  ],
  workoutLogs: [
    { userEmail: 'aby@example.com', workoutTitle: 'Hypertrophy Chest & Triceps Split', date: '2026-08-17 10:30:00', durationMinutes: 50, caloriesBurned: 480, xpEarned: 730, completedExercises: ['Incline Dumbbell Press', 'Barbell Bench Press', 'Triceps Rope Pushdowns'] },
    { userEmail: 'sruthy@example.com', workoutTitle: 'Fat Loss HIIT & Core Conditioning', date: '2026-08-17 11:15:00', durationMinutes: 45, caloriesBurned: 420, xpEarned: 645, completedExercises: ['Russian Twists with Weight', 'Bicycle Crunches', 'Sprinting Interval Treadmill'] },
    { userEmail: 'alex@example.com', workoutTitle: 'Hypertrophy Upper Body Split', date: '2026-08-17 09:00:00', durationMinutes: 60, caloriesBurned: 550, xpEarned: 850, completedExercises: ['Barbell Back Squats', 'Lat Pulldown', 'Plank Hold'] }
  ],
  nutritionLogs: [],
  feedbacks: [
    { userEmail: 'aby@example.com', rating: 5, feedbackCategory: 'Recommendation Accuracy', recommendationType: 'WORKOUT', comments: 'Coach Marcus: The chest and triceps hypertrophy split matched my gym equipment perfectly!', createdAt: '2026-08-17 14:20' },
    { userEmail: 'sruthy@example.com', rating: 5, feedbackCategory: 'Nutrition Plan', recommendationType: 'NUTRITION', comments: 'Vegetarian meal targets calculated my daily protein goals accurately.', createdAt: '2026-08-17 15:45' },
    { userEmail: 'alex@example.com', rating: 4, feedbackCategory: 'UI & Recommendations', recommendationType: 'WORKOUT', comments: 'Great AI exercise suggestions reviewed and enhanced by Coach Sarah.', createdAt: '2026-08-17 16:10' }
  ]
};

// Initialize DB file if not present
function loadStore() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_SEEDS, null, 2), 'utf8');
      return DEFAULT_SEEDS;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    
    // Ensure all seed collections exist
    Object.keys(DEFAULT_SEEDS).forEach(key => {
      if (!parsed[key] || !Array.isArray(parsed[key])) {
        parsed[key] = DEFAULT_SEEDS[key];
      }
    });
    
    return parsed;
  } catch (err) {
    console.error('Error reading database.json:', err);
    return DEFAULT_SEEDS;
  }
}

function saveStore(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database.json:', err);
  }
}

// Store Helper Methods
export const dataStore = {
  _isEnsuringStaff: false,
  // Guarantee that every Trainer and Clinical Nutritionist has an active User login account
  async ensureStaffLoginAccounts() {
    if (this._isEnsuringStaff) return;
    this._isEnsuringStaff = true;
    try {
      const store = loadStore();
      if (!store.users) store.users = [];

      const staffSeeds = [
        {
          id: 'trainer-01',
          fullName: 'Marcus Vance',
          email: 'marcus@example.com',
          role: 'TRAINER',
          specialization: 'Hypertrophy & Strength Conditioning',
          experienceYears: 8
        },
        {
          id: 'trainer-02',
          fullName: 'Sarah Jenkins',
          email: 'sarah@example.com',
          role: 'TRAINER',
          specialization: 'Cardio Endurance & Calisthenics',
          experienceYears: 6
        },
        {
          id: 'trainer-03',
          fullName: 'David Kim',
          email: 'david@example.com',
          role: 'TRAINER',
          specialization: 'Athletic Mobility & Functional Training',
          experienceYears: 5
        },
        {
          id: 'tr-1790569115730-k0s3',
          fullName: 'Midhun Suresh',
          email: 'midhun.trainer@smartfit.com',
          role: 'TRAINER',
          specialization: 'Hypertrophy & Strength Conditioning',
          experienceYears: 6
        },
        {
          id: 'nutri-01',
          fullName: 'Sruthy Varghese',
          email: 'sruthy@example.com',
          role: 'NUTRITIONIST',
          qualification: 'M.Sc. Dietetics & Performance Nutrition',
          specialization: 'Plant-Based & Vegetarian Nutrition',
          experienceYears: 7
        },
        {
          id: 'nutri-02',
          fullName: 'Dr. Elena Rostova',
          email: 'elena@example.com',
          role: 'NUTRITIONIST',
          qualification: 'Ph.D. Sports Clinical Nutrition & BCNS',
          specialization: 'High-Protein & Metabolic Diets',
          experienceYears: 10
        }
      ];

      // Read directly from JSON store
      if (Array.isArray(store.trainers)) {
        store.trainers.forEach(t => {
          if (t.email && !staffSeeds.some(s => s.email.toLowerCase() === t.email.toLowerCase())) {
            staffSeeds.push({
              id: t.id,
              fullName: t.fullName,
              email: t.email,
              role: 'TRAINER',
              specialization: t.specialization,
              experienceYears: t.experienceYears
            });
          }
        });
      }

      if (Array.isArray(store.nutritionists)) {
        store.nutritionists.forEach(n => {
          if (n.email && !staffSeeds.some(s => s.email.toLowerCase() === n.email.toLowerCase())) {
            staffSeeds.push({
              id: n.id,
              fullName: n.fullName,
              email: n.email,
              role: 'NUTRITIONIST',
              qualification: n.qualification,
              specialization: n.specialization,
              experienceYears: n.experienceYears
            });
          }
        });
      }

      if (mongoose.connection.readyState === 1) {
        try {
          const mongoTr = await Trainer.find({}).lean();
          mongoTr.forEach(t => {
            if (t.email && !staffSeeds.some(s => s.email.toLowerCase() === t.email.toLowerCase())) {
              staffSeeds.push({
                id: t.id || t._id?.toString(),
                fullName: t.fullName,
                email: t.email,
                role: 'TRAINER',
                specialization: t.specialization,
                experienceYears: t.experienceYears
              });
            }
          });

          const mongoNu = await Nutritionist.find({}).lean();
          mongoNu.forEach(n => {
            if (n.email && !staffSeeds.some(s => s.email.toLowerCase() === n.email.toLowerCase())) {
              staffSeeds.push({
                id: n.id || n._id?.toString(),
                fullName: n.fullName,
                email: n.email,
                role: 'NUTRITIONIST',
                qualification: n.qualification,
                specialization: n.specialization,
                experienceYears: n.experienceYears
              });
            }
          });
        } catch (e) {}
      }

      const defaultBcryptHash = '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq'; // bcrypt for password123

      for (const s of staffSeeds) {
        const clean = s.email.trim().toLowerCase();
        const existingIdx = store.users.findIndex(u => u.email && u.email.toLowerCase() === clean);

        if (existingIdx === -1) {
          const newStaffUser = {
            id: s.id || `staff-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            fullName: s.fullName,
            email: clean,
            password: defaultBcryptHash,
            plainPasswordFallback: 'password123',
            role: s.role,
            specialization: s.specialization || '',
            qualification: s.qualification || '',
            experienceYears: s.experienceYears || 5,
            mustChangePassword: true,
            hasChangedDefaultPassword: false,
            isFirstLogin: true,
            status: 'ACTIVE',
            isLoggedIn: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          store.users.push(newStaffUser);

          if (mongoose.connection.readyState === 1) {
            try {
              const mongoExists = await User.findOne({ email: clean });
              if (!mongoExists) {
                await User.create(newStaffUser);
              }
            } catch (err) {}
          }
        }
      }

      saveStore(store);
    } catch (e) {
      console.warn('ensureStaffLoginAccounts note:', e.message);
    } finally {
      this._isEnsuringStaff = false;
    }
  },

  // Find a user by email
  async findUserByEmail(email) {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    if (!cleanEmail) return null;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user) return user;
      } catch (e) {
        console.warn('MongoDB lookup notice, fallback to local store:', e.message);
      }
    }

    const store = loadStore();
    const localUser = store.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (localUser) return localUser;

    // Check staff seeds directly without triggering full queries
    const defaultStaff = [
      { email: 'marcus@example.com', fullName: 'Marcus Vance', role: 'TRAINER', specialization: 'Hypertrophy & Strength Conditioning', experienceYears: 8 },
      { email: 'sarah@example.com', fullName: 'Sarah Jenkins', role: 'TRAINER', specialization: 'Cardio Endurance & Calisthenics', experienceYears: 6 },
      { email: 'david@example.com', fullName: 'David Kim', role: 'TRAINER', specialization: 'Athletic Mobility & Functional Training', experienceYears: 5 },
      { email: 'midhun.trainer@smartfit.com', fullName: 'Midhun Suresh', role: 'TRAINER', specialization: 'Hypertrophy & Strength Conditioning', experienceYears: 6 },
      { email: 'sruthy@example.com', fullName: 'Sruthy Varghese', role: 'NUTRITIONIST', qualification: 'M.Sc. Dietetics & Performance Nutrition', specialization: 'Plant-Based & Vegetarian Nutrition', experienceYears: 7 },
      { email: 'elena@example.com', fullName: 'Dr. Elena Rostova', role: 'NUTRITIONIST', qualification: 'Ph.D. Sports Clinical Nutrition & BCNS', specialization: 'High-Protein & Metabolic Diets', experienceYears: 10 }
    ];

    const matchedStaff = defaultStaff.find(s => s.email.toLowerCase() === cleanEmail);
    if (matchedStaff) {
      return await this.createUser({
        fullName: matchedStaff.fullName,
        email: cleanEmail,
        password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
        plainPasswordFallback: 'password123',
        role: matchedStaff.role,
        specialization: matchedStaff.specialization || '',
        qualification: matchedStaff.qualification || '',
        experienceYears: matchedStaff.experienceYears || 5,
        mustChangePassword: true,
        hasChangedDefaultPassword: false,
        isFirstLogin: true,
        status: 'ACTIVE'
      });
    }

    return null;
  },

  // Get all users
  async getAllUsers() {
    const store = loadStore();
    const jsonUsers = Array.isArray(store.users) ? store.users : [];

    if (mongoose.connection.readyState === 1) {
      try {
        const mongoUsers = await User.find({}).lean();
        if (mongoUsers && mongoUsers.length > 0) {
          const userMap = new Map();
          mongoUsers.forEach(u => {
            if (u.email) userMap.set(u.email.toLowerCase(), u);
          });
          jsonUsers.forEach(u => {
            if (u.email && !userMap.has(u.email.toLowerCase())) {
              userMap.set(u.email.toLowerCase(), u);
            }
          });
          return Array.from(userMap.values());
        }
      } catch (e) {
        console.warn('MongoDB find notice, fallback to local store:', e.message);
      }
    }

    return jsonUsers;
  },

  // Save/Create a user
  async createUser(userData) {
    const cleanEmail = userData.email.trim().toLowerCase();
    const metrics = calculateUserMetrics(userData);
    
    const userObj = {
      id: userData.id || `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...userData,
      email: cleanEmail,
      ...metrics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Save to JSON store permanently
    const store = loadStore();
    const existingIndex = store.users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (existingIndex >= 0) {
      store.users[existingIndex] = { ...store.users[existingIndex], ...userObj };
    } else {
      store.users.push(userObj);
    }
    saveStore(store);

    // 2. Also save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) {
          Object.assign(existing, userObj);
          await existing.save();
          return existing;
        } else {
          return await User.create(userObj);
        }
      } catch (err) {
        console.warn('MongoDB user create notice:', err.message);
      }
    }

    return userObj;
  },

  // Update a user
  async updateUser(email, updateData) {
    const cleanEmail = email.trim().toLowerCase();
    const store = loadStore();
    const idx = store.users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    let updatedObj = null;

    if (idx >= 0) {
      const merged = { ...store.users[idx], ...updateData, updatedAt: new Date().toISOString() };
      const metrics = calculateUserMetrics(merged);
      store.users[idx] = { ...merged, ...metrics };
      updatedObj = store.users[idx];

      // Keep Trainer or Nutritionist staff record in sync if staff fields are updated
      const staffUpdate = {};
      if (updateData.fullName) staffUpdate.fullName = updateData.fullName;
      if (updateData.specialization) staffUpdate.specialization = updateData.specialization;
      if (updateData.qualification) staffUpdate.qualification = updateData.qualification;
      if (updateData.experienceYears) staffUpdate.experienceYears = Number(updateData.experienceYears);

      if (Object.keys(staffUpdate).length > 0) {
        if (store.trainers) {
          const tIdx = store.trainers.findIndex(t => t.email && t.email.toLowerCase() === cleanEmail);
          if (tIdx >= 0) {
            store.trainers[tIdx] = { ...store.trainers[tIdx], ...staffUpdate };
          }
        }
        if (store.nutritionists) {
          const nIdx = store.nutritionists.findIndex(n => n.email && n.email.toLowerCase() === cleanEmail);
          if (nIdx >= 0) {
            store.nutritionists[nIdx] = { ...store.nutritionists[nIdx], ...staffUpdate };
          }
        }
      }

      saveStore(store);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await User.findOneAndUpdate({ email: cleanEmail }, updateData, { new: true });
        // Sync to MongoDB Trainer/Nutritionist models
        const staffUpdate = {};
        if (updateData.fullName) staffUpdate.fullName = updateData.fullName;
        if (updateData.specialization) staffUpdate.specialization = updateData.specialization;
        if (updateData.qualification) staffUpdate.qualification = updateData.qualification;
        if (updateData.experienceYears) staffUpdate.experienceYears = Number(updateData.experienceYears);

        if (Object.keys(staffUpdate).length > 0) {
          await Trainer.updateMany({ email: cleanEmail }, staffUpdate);
          await Nutritionist.updateMany({ email: cleanEmail }, staffUpdate);
        }
        if (doc) return doc;
      } catch (e) {
        console.warn('MongoDB update notice:', e.message);
      }
    }

    return updatedObj;
  },

  // Delete a user
  async deleteUser(email) {
    const cleanEmail = email.trim().toLowerCase();
    const store = loadStore();
    store.users = store.users.filter(u => u.email.toLowerCase() !== cleanEmail);
    if (store.workoutPlans) {
      store.workoutPlans = store.workoutPlans.filter(p => (p.userEmail || '').toLowerCase() !== cleanEmail);
    }
    if (store.mealPlans) {
      store.mealPlans = store.mealPlans.filter(p => (p.userEmail || '').toLowerCase() !== cleanEmail);
    }
    if (store.workoutLogs) {
      store.workoutLogs = store.workoutLogs.filter(l => (l.userEmail || '').toLowerCase() !== cleanEmail);
    }
    if (store.nutritionLogs) {
      store.nutritionLogs = store.nutritionLogs.filter(l => (l.userEmail || '').toLowerCase() !== cleanEmail);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        await User.deleteMany({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
        await WorkoutPlan.deleteMany({ userEmail: cleanEmail });
        await MealPlan.deleteMany({ userEmail: cleanEmail });
        await WorkoutLog.deleteMany({ userEmail: cleanEmail });
      } catch (e) {
        console.warn('MongoDB delete notice:', e.message);
      }
    }
    return true;
  },

  // Workout Plans
  async getWorkoutPlan(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const plan = await WorkoutPlan.findOne({ userEmail: cleanEmail, status: 'PUBLISHED' }).sort({ createdAt: -1 });
        if (plan) return plan;
      } catch (e) {}
    }
    const store = loadStore();
    if (!store.workoutPlans) store.workoutPlans = [];
    return store.workoutPlans.find(p => p.userEmail?.toLowerCase() === cleanEmail) || null;
  },

  async saveWorkoutPlan(planData) {
    const cleanEmail = planData.userEmail.trim().toLowerCase();
    const store = loadStore();
    if (!store.workoutPlans) store.workoutPlans = [];
    const idx = store.workoutPlans.findIndex(p => p.userEmail?.toLowerCase() === cleanEmail);
    const planObj = { ...planData, userEmail: cleanEmail, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      store.workoutPlans[idx] = { ...store.workoutPlans[idx], ...planObj };
    } else {
      store.workoutPlans.push(planObj);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        let plan = await WorkoutPlan.findOne({ userEmail: cleanEmail });
        if (plan) {
          Object.assign(plan, planObj);
          await plan.save();
          return plan;
        } else {
          return await WorkoutPlan.create(planObj);
        }
      } catch (e) {}
    }
    return planObj;
  },

  // Meal Plans
  async getAllMealPlans({ nutritionistEmail = null, status = null } = {}) {
    const cleanNutri = nutritionistEmail ? nutritionistEmail.trim().toLowerCase() : null;
    const cleanStatus = status ? status.trim().toUpperCase() : null;

    if (mongoose.connection.readyState === 1) {
      try {
        const query = {};
        if (cleanNutri) query.nutritionistEmail = cleanNutri;
        if (cleanStatus && cleanStatus !== 'ALL') {
          query.status = cleanStatus;
        }
        const plans = await MealPlan.find(query).sort({ updatedAt: -1, createdAt: -1 });
        if (plans && plans.length > 0) return plans.map(p => p.toObject());
      } catch (e) {
        console.warn('MongoDB getAllMealPlans note:', e.message);
      }
    }

    const store = loadStore();
    if (!store.mealPlans) store.mealPlans = [];
    let list = store.mealPlans;

    if (cleanNutri) {
      list = list.filter(p => (p.nutritionistEmail || '').toLowerCase() === cleanNutri);
    }
    if (cleanStatus && cleanStatus !== 'ALL') {
      list = list.filter(p => (p.status || '').toUpperCase() === cleanStatus);
    }
    return list;
  },

  async getMealPlan(userEmail, { includeDrafts = true } = {}) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const query = { userEmail: cleanEmail };
        if (!includeDrafts) {
          query.status = { $in: ['PUBLISHED', 'APPROVED', 'APPROVED_AND_ACTIVE', 'ACTIVE'] };
        }
        const plan = await MealPlan.findOne(query).sort({ updatedAt: -1, createdAt: -1 });
        if (plan) return plan.toObject();
      } catch (e) {
        console.warn('MongoDB getMealPlan note:', e.message);
      }
    }
    const store = loadStore();
    if (!store.mealPlans) store.mealPlans = [];
    const userPlans = store.mealPlans.filter(p => p.userEmail?.toLowerCase() === cleanEmail);
    if (!includeDrafts) {
      return userPlans.find(p => ['PUBLISHED', 'APPROVED', 'APPROVED_AND_ACTIVE', 'ACTIVE'].includes(p.status)) || null;
    }
    return userPlans[0] || null;
  },

  async saveMealPlan(planData) {
    const cleanEmail = planData.userEmail.trim().toLowerCase();
    const store = loadStore();
    if (!store.mealPlans) store.mealPlans = [];
    const idx = store.mealPlans.findIndex(p => p.userEmail?.toLowerCase() === cleanEmail);
    
    // Manage Version History
    const currentVersion = Number(planData.currentVersion) || (idx >= 0 ? (store.mealPlans[idx].currentVersion || 1) : 1);
    const existingHistory = (idx >= 0 && Array.isArray(store.mealPlans[idx].versionHistory)) 
      ? store.mealPlans[idx].versionHistory 
      : [];

    const versionSnapshot = {
      version: currentVersion,
      createdByEmail: planData.nutritionistEmail || 'nutritionist@smartfit.com',
      approvedByEmail: planData.approvedByEmail || (planData.status === 'APPROVED' || planData.status === 'PUBLISHED' ? planData.nutritionistEmail : null),
      createdAt: new Date().toISOString(),
      approvedAt: planData.approvedAt || (planData.status === 'APPROVED' || planData.status === 'PUBLISHED' ? new Date().toISOString() : null),
      revisionReason: planData.revisionReason || 'Prescription updated by nutritionist',
      planTitle: planData.planTitle,
      targetCalories: planData.targetCalories,
      targetProtein: planData.proteinGrams,
      targetCarbs: planData.carbGrams,
      targetFat: planData.fatGrams,
      status: planData.status || 'DRAFT',
      mealsCount: Array.isArray(planData.meals) ? planData.meals.length : 0
    };

    const newHistory = [versionSnapshot, ...existingHistory.filter(h => h.version !== currentVersion)].slice(0, 15);

    const planObj = {
      prescriptionId: planData.prescriptionId || `rx-nut-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...planData,
      userEmail: cleanEmail,
      currentVersion,
      versionHistory: newHistory,
      updatedAt: new Date().toISOString()
    };

    if (idx >= 0) {
      store.mealPlans[idx] = { ...store.mealPlans[idx], ...planObj };
    } else {
      store.mealPlans.unshift(planObj);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        let plan = await MealPlan.findOne({ userEmail: cleanEmail });
        if (plan) {
          Object.assign(plan, planObj);
          await plan.save();
          return plan.toObject();
        } else {
          const created = await MealPlan.create(planObj);
          return created.toObject();
        }
      } catch (e) {
        console.warn('MongoDB saveMealPlan note:', e.message);
      }
    }
    return planObj;
  },

  // Persistent Date-Specific Meal Schedules (Phases 5 & 6)
  async getMealSchedule(userEmail, dateStr) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const targetDate = dateStr || new Date().toISOString().substring(0, 10);
    
    if (mongoose.connection.readyState === 1) {
      try {
        const schedule = await MealSchedule.findOne({ userEmail: cleanEmail, date: targetDate });
        if (schedule) return schedule.toObject();
      } catch (e) {
        console.warn('MongoDB getMealSchedule note:', e.message);
      }
    }
    const store = loadStore();
    if (!store.mealSchedules) store.mealSchedules = [];
    return store.mealSchedules.find(s => s.userEmail?.toLowerCase() === cleanEmail && s.date === targetDate) || null;
  },

  async getAllMealSchedules({ nutritionistEmail = null, userEmail = null, date = null, status = null } = {}) {
    const cleanNutri = nutritionistEmail ? nutritionistEmail.trim().toLowerCase() : null;
    const cleanUser = userEmail ? userEmail.trim().toLowerCase() : null;
    const cleanStatus = status ? status.trim().toUpperCase() : null;

    if (mongoose.connection.readyState === 1) {
      try {
        const query = {};
        if (cleanNutri) query.nutritionistEmail = cleanNutri;
        if (cleanUser) query.userEmail = cleanUser;
        if (date) query.date = date;
        if (cleanStatus && cleanStatus !== 'ALL') query.status = cleanStatus;
        const schedules = await MealSchedule.find(query).sort({ date: -1, updatedAt: -1 });
        if (schedules && schedules.length > 0) return schedules.map(s => s.toObject());
      } catch (e) {
        console.warn('MongoDB getAllMealSchedules note:', e.message);
      }
    }

    const store = loadStore();
    if (!store.mealSchedules) store.mealSchedules = [];
    let list = store.mealSchedules;

    if (cleanNutri) {
      list = list.filter(s => (s.nutritionistEmail || '').toLowerCase() === cleanNutri);
    }
    if (cleanUser) {
      list = list.filter(s => (s.userEmail || '').toLowerCase() === cleanUser);
    }
    if (date) {
      list = list.filter(s => s.date === date);
    }
    if (cleanStatus && cleanStatus !== 'ALL') {
      list = list.filter(s => (s.status || '').toUpperCase() === cleanStatus);
    }

    return list;
  },

  async saveMealSchedule(scheduleData) {
    const cleanEmail = (scheduleData.userEmail || '').trim().toLowerCase();
    const targetDate = scheduleData.date || new Date().toISOString().substring(0, 10);
    const scheduleId = scheduleData.scheduleId || `sched-${targetDate}-${cleanEmail.split('@')[0]}`;

    const scheduleObj = {
      ...scheduleData,
      scheduleId,
      userEmail: cleanEmail,
      date: targetDate,
      isStable: true,
      updatedAt: new Date().toISOString()
    };

    const store = loadStore();
    if (!store.mealSchedules) store.mealSchedules = [];
    const idx = store.mealSchedules.findIndex(s => s.userEmail?.toLowerCase() === cleanEmail && s.date === targetDate);
    if (idx >= 0) {
      store.mealSchedules[idx] = { ...store.mealSchedules[idx], ...scheduleObj };
    } else {
      store.mealSchedules.unshift(scheduleObj);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await MealSchedule.findOne({ userEmail: cleanEmail, date: targetDate });
        if (existing) {
          Object.assign(existing, scheduleObj);
          await existing.save();
          return existing.toObject();
        } else {
          const created = await MealSchedule.create(scheduleObj);
          return created.toObject();
        }
      } catch (e) {
        console.warn('MongoDB saveMealSchedule note:', e.message);
      }
    }
    return scheduleObj;
  },

  async updateMealSlotConsumption(userEmail, dateStr, slotId, consumptionData) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const targetDate = dateStr || new Date().toISOString().substring(0, 10);

    const schedule = await this.getMealSchedule(cleanEmail, targetDate);
    if (!schedule) return null;

    const slots = schedule.slots || [];
    const slotIdx = slots.findIndex(s => s.slotId === slotId);
    if (slotIdx === -1) return null;

    const slot = slots[slotIdx];
    const status = consumptionData.consumptionStatus || 'COMPLETED';
    const portionPct = Number(consumptionData.actualPortionEatenPct) >= 0 ? Number(consumptionData.actualPortionEatenPct) : (status === 'COMPLETED' ? 100 : (status === 'SKIPPED' ? 0 : 50));
    const factor = portionPct / 100.0;

    slot.consumptionStatus = status;
    slot.actualPortionEatenPct = portionPct;
    slot.actualCaloriesConsumed = Math.round((slot.prescribedCalories || 0) * factor);
    slot.actualProteinConsumed = Math.round((slot.prescribedProtein || 0) * factor);
    slot.actualCarbsConsumed = Math.round((slot.prescribedCarbs || 0) * factor);
    slot.actualFatConsumed = Math.round((slot.prescribedFat || 0) * factor);
    slot.substitutedWith = consumptionData.substitutedWith || null;
    slot.clientFeedbackNotes = consumptionData.clientFeedbackNotes || '';
    slot.loggedAt = new Date().toISOString();

    // Recalculate reportedTotals
    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let completedCount = 0;

    slots.forEach(s => {
      totalCals += (s.actualCaloriesConsumed || 0);
      totalProt += (s.actualProteinConsumed || 0);
      totalCarbs += (s.actualCarbsConsumed || 0);
      totalFat += (s.actualFatConsumed || 0);
      if (s.consumptionStatus === 'COMPLETED') completedCount += 1.0;
      else if (s.consumptionStatus === 'PARTIALLY_EATEN') completedCount += (s.actualPortionEatenPct || 50) / 100.0;
      else if (s.consumptionStatus === 'SUBSTITUTED') completedCount += 0.8;
    });

    schedule.reportedTotals = {
      calories: totalCals,
      protein: totalProt,
      carbs: totalCarbs,
      fat: totalFat,
      adherenceRatePct: slots.length > 0 ? Math.round((completedCount / slots.length) * 100) : 0
    };

    return await this.saveMealSchedule(schedule);
  },

  // Persistent Client–Nutritionist Private Chat (Phase 2)
  async getChatMessages(clientEmail, specialistEmail, { page = 1, limit = 50 } = {}) {
    const cEmail = (clientEmail || '').trim().toLowerCase();
    const sEmail = (specialistEmail || '').trim().toLowerCase();
    const convId = [cEmail, sEmail].sort().join('_');

    if (mongoose.connection.readyState === 1) {
      try {
        const query = {
          $or: [
            { conversationId: convId },
            { clientEmail: cEmail, specialistEmail: sEmail },
            { senderEmail: cEmail, recipientEmail: sEmail },
            { senderEmail: sEmail, recipientEmail: cEmail }
          ]
        };
        const skip = (page - 1) * limit;
        const messages = await ChatMessage.find(query).sort({ createdAt: 1 }).skip(skip).limit(limit).lean();
        if (messages && messages.length > 0) {
          return messages.map(m => ({ ...m, id: m._id ? m._id.toString() : m.id }));
        }
      } catch (e) {
        console.warn('MongoDB getChatMessages note:', e.message);
      }
    }

    const store = loadStore();
    if (!store.chatMessages) store.chatMessages = [];
    const thread = store.chatMessages.filter(m => 
      (m.conversationId === convId) ||
      (m.clientEmail?.toLowerCase() === cEmail && m.specialistEmail?.toLowerCase() === sEmail) ||
      (m.senderEmail?.toLowerCase() === cEmail && m.recipientEmail?.toLowerCase() === sEmail) ||
      (m.senderEmail?.toLowerCase() === sEmail && m.recipientEmail?.toLowerCase() === cEmail)
    );
    return thread.sort((a, b) => new Date(a.createdAt || a.timestamp).getTime() - new Date(b.createdAt || b.timestamp).getTime());
  },

  async saveChatMessage(msgData) {
    const cEmail = (msgData.clientEmail || '').trim().toLowerCase();
    const sEmail = (msgData.specialistEmail || '').trim().toLowerCase();
    const convId = [cEmail, sEmail].sort().join('_');
    const senderEmail = (msgData.senderEmail || '').trim().toLowerCase();
    const recipientEmail = (msgData.recipientEmail || (senderEmail === cEmail ? sEmail : cEmail)).trim().toLowerCase();
    
    // Idempotency check: avoid duplicate messages within 3 seconds with same text
    const store = loadStore();
    if (!store.chatMessages) store.chatMessages = [];
    
    const recentDuplicate = store.chatMessages.find(m => 
      m.conversationId === convId &&
      m.senderEmail === senderEmail &&
      m.text === msgData.text?.trim() &&
      (Date.now() - new Date(m.createdAt || Date.now()).getTime() < 3000)
    );
    if (recentDuplicate) {
      return recentDuplicate;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgObj = {
      id: msgData.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: convId,
      clientEmail: cEmail,
      specialistEmail: sEmail,
      specialistRole: msgData.specialistRole || 'NUTRITIONIST',
      senderEmail,
      senderName: msgData.senderName || senderEmail.split('@')[0],
      senderRole: msgData.senderRole || (senderEmail === cEmail ? 'USER' : 'NUTRITIONIST'),
      recipientEmail,
      recipientName: msgData.recipientName || recipientEmail.split('@')[0],
      recipientRole: msgData.recipientRole || (recipientEmail === cEmail ? 'USER' : 'NUTRITIONIST'),
      text: (msgData.text || '').trim(),
      isRead: false,
      deliveryStatus: 'DELIVERED',
      timestamp: `Today, ${timeStr}`,
      rawTime: Date.now(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    store.chatMessages.push(msgObj);
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await ChatMessage.create(msgObj);
        // Update Conversation record
        await Conversation.findOneAndUpdate(
          { conversationId: convId },
          {
            conversationId: convId,
            clientEmail: cEmail,
            specialistEmail: sEmail,
            specialistRole: msgData.specialistRole || 'NUTRITIONIST',
            lastMessageText: msgObj.text,
            lastMessageTime: now,
            lastSenderRole: msgObj.senderRole,
            $inc: msgObj.senderRole === 'USER' ? { unreadCountForSpecialist: 1 } : { unreadCountForClient: 1 }
          },
          { upsert: true, new: true }
        );
        return { ...created.toObject(), id: created._id.toString() };
      } catch (e) {
        console.warn('MongoDB saveChatMessage note:', e.message);
      }
    }

    return msgObj;
  },

  async markChatMessagesAsRead(clientEmail, specialistEmail, readerRole) {
    const cEmail = (clientEmail || '').trim().toLowerCase();
    const sEmail = (specialistEmail || '').trim().toLowerCase();
    const convId = [cEmail, sEmail].sort().join('_');

    const store = loadStore();
    if (store.chatMessages) {
      store.chatMessages.forEach(m => {
        if (m.conversationId === convId && m.senderRole !== readerRole && !m.isRead) {
          m.isRead = true;
          m.deliveryStatus = 'READ';
          m.readAt = new Date().toISOString();
        }
      });
      saveStore(store);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await ChatMessage.updateMany(
          { conversationId: convId, senderRole: { $ne: readerRole }, isRead: false },
          { $set: { isRead: true, deliveryStatus: 'READ', readAt: new Date() } }
        );
        const resetField = readerRole === 'USER' ? { unreadCountForClient: 0 } : { unreadCountForSpecialist: 0 };
        await Conversation.findOneAndUpdate({ conversationId: convId }, { $set: resetField });
      } catch (e) {
        console.warn('MongoDB markChatMessagesAsRead note:', e.message);
      }
    }
    return true;
  },

  async getUnreadChatCount(clientEmail, specialistEmail, forRole) {
    const cEmail = (clientEmail || '').trim().toLowerCase();
    const sEmail = (specialistEmail || '').trim().toLowerCase();
    const convId = [cEmail, sEmail].sort().join('_');

    if (mongoose.connection.readyState === 1) {
      try {
        const count = await ChatMessage.countDocuments({
          conversationId: convId,
          senderRole: { $ne: forRole },
          isRead: false
        });
        return count;
      } catch (e) {}
    }

    const store = loadStore();
    if (!store.chatMessages) return 0;
    return store.chatMessages.filter(m => 
      m.conversationId === convId && m.senderRole !== forRole && !m.isRead
    ).length;
  },

  // Feedbacks
  async getFeedbacks(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const list = await Feedback.find({ userEmail: cleanEmail }).sort({ createdAt: -1 }).limit(10);
        if (list && list.length > 0) return list;
      } catch (e) {}
    }
    const store = loadStore();
    if (!store.feedbacks) store.feedbacks = [];
    return store.feedbacks.filter(f => f.userEmail?.toLowerCase() === cleanEmail);
  },

  async saveFeedback(feedbackData) {
    const cleanEmail = (feedbackData.userEmail || '').trim().toLowerCase();
    const store = loadStore();
    if (!store.feedbacks) store.feedbacks = [];
    const fbObj = {
      id: feedbackData.id || `fb-${Date.now()}`,
      ...feedbackData,
      userEmail: cleanEmail,
      createdAt: feedbackData.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    store.feedbacks.unshift(fbObj);
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        return await Feedback.create(fbObj);
      } catch (e) {}
    }
    return fbObj;
  },

  // Nutrition Logs
  async getNutritionLogs(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const today = new Date().toISOString().substring(0, 10);
    let todayLog = null;
    let recentLogs = [];

    if (mongoose.connection.readyState === 1) {
      try {
        todayLog = await NutritionLog.findOne({ userEmail: cleanEmail, date: today });
        recentLogs = await NutritionLog.find({ userEmail: cleanEmail }).sort({ date: -1 }).limit(7);
      } catch (e) {}
    }

    const store = loadStore();
    if (!store.nutritionLogs) store.nutritionLogs = [];
    const userLogs = store.nutritionLogs.filter(l => l.userEmail?.toLowerCase() === cleanEmail);
    if (!todayLog) {
      todayLog = userLogs.find(l => l.date === today) || null;
    }
    if (recentLogs.length === 0) {
      recentLogs = userLogs.slice(-7).reverse();
    }

    return { todayLog, recentLogs };
  },

  async saveNutritionLog(logData) {
    const cleanEmail = (logData.userEmail || '').trim().toLowerCase();
    const today = logData.date || new Date().toISOString().substring(0, 10);
    const store = loadStore();
    if (!store.nutritionLogs) store.nutritionLogs = [];
    const idx = store.nutritionLogs.findIndex(l => l.userEmail?.toLowerCase() === cleanEmail && l.date === today);
    const logObj = { ...logData, userEmail: cleanEmail, date: today, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      store.nutritionLogs[idx] = { ...store.nutritionLogs[idx], ...logObj };
    } else {
      store.nutritionLogs.push(logObj);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        let log = await NutritionLog.findOne({ userEmail: cleanEmail, date: today });
        if (log) {
          Object.assign(log, logObj);
          await log.save();
          return log;
        } else {
          return await NutritionLog.create(logObj);
        }
      } catch (e) {}
    }
    return logObj;
  },

  // Food and Symptom Diary Logs
  async getSymptomLogs(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const query = cleanEmail ? { userEmail: cleanEmail } : {};
        const logs = await SymptomLog.find(query).sort({ timestamp: -1 }).limit(50);
        if (logs && logs.length > 0) return logs;
      } catch (e) {}
    }
    const store = loadStore();
    if (!store.symptomLogs) store.symptomLogs = [];
    return cleanEmail ? store.symptomLogs.filter(s => s.userEmail?.toLowerCase() === cleanEmail) : store.symptomLogs;
  },

  async saveSymptomLog(logData) {
    const cleanEmail = (logData.userEmail || '').trim().toLowerCase();
    const store = loadStore();
    if (!store.symptomLogs) store.symptomLogs = [];

    const foodTrigger = logData.foodTrigger || logData.loggedMealTitle || 'Reported Food Trigger';
    const symptomCategory = logData.symptomCategory || logData.symptomType || 'SKIN_ECZEMA';
    const severity = Number(logData.severity || logData.severityRating) || 3;
    const notes = logData.notes || logData.symptomNotes || '';

    const logObj = {
      id: logData.id || `symp-${Date.now()}`,
      userEmail: cleanEmail,
      userName: logData.userName || cleanEmail.split('@')[0],
      foodTrigger,
      loggedMealTitle: foodTrigger,
      symptomCategory,
      symptomType: symptomCategory,
      severity,
      severityRating: severity,
      onsetLatencyMins: Number(logData.onsetLatencyMins) || 45,
      mealId: logData.mealId || '',
      notes,
      symptomNotes: notes,
      suspectedTriggers: logData.suspectedTriggers || [foodTrigger].filter(Boolean),
      consumedIngredients: logData.consumedIngredients || [foodTrigger].filter(Boolean),
      timestamp: logData.timestamp || new Date().toISOString(),
      date: logData.date || new Date().toISOString().substring(0, 10),
      requiresClinicalReview: true,
      reviewedBySpecialist: false,
      reviewedByNutritionist: false,
      specialistComments: '',
      nutritionistNotes: ''
    };

    store.symptomLogs.unshift(logObj);
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        return await SymptomLog.create(logObj);
      } catch (e) {
        console.warn('SymptomLog Mongoose creation note:', e.message);
      }
    }
    return logObj;
  },

  async reviewSymptomLog(logId, specialistComments, specialistEmail) {
    const store = loadStore();
    if (!store.symptomLogs) store.symptomLogs = [];
    const idx = store.symptomLogs.findIndex(s => (s.id === logId || s._id?.toString() === logId));
    let updated = null;
    const comment = specialistComments || '';
    const email = specialistEmail || 'sruthy@example.com';
    const now = new Date().toISOString();

    if (idx >= 0) {
      store.symptomLogs[idx] = {
        ...store.symptomLogs[idx],
        reviewedBySpecialist: true,
        reviewedByNutritionist: true,
        specialistComments: comment,
        nutritionistNotes: comment,
        specialistEmail: email,
        reviewedAt: now
      };
      updated = store.symptomLogs[idx];
      saveStore(store);
    }
    if (mongoose.connection.readyState === 1) {
      try {
        const log = await SymptomLog.findOne({ $or: [{ _id: logId }, { id: logId }] });
        if (log) {
          log.reviewedBySpecialist = true;
          log.reviewedByNutritionist = true;
          log.specialistComments = comment;
          log.nutritionistNotes = comment;
          log.specialistEmail = email;
          log.reviewedAt = now;
          await log.save();
          return log;
        }
      } catch (e) {
        console.warn('Symptom review Mongoose note:', e.message);
      }
    }
    return updated;
  },

  // User Workout Progress Tracking
  async getUserWorkoutProgress(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const user = await this.findUserByEmail(cleanEmail);
    const store = loadStore();
    const logs = (store.workoutLogs || []).filter(l => (l.userEmail || '').toLowerCase() === cleanEmail);

    if (!user) {
      return {
        userEmail: cleanEmail,
        activeWorkoutDay: 1,
        completedWorkoutDays: [],
        workoutDaysCount: 0,
        workoutTenDayCompleted: false,
        milestones: [],
        logs: []
      };
    }

    const completedWorkoutDays = Array.isArray(user.completedWorkoutDays) ? user.completedWorkoutDays : [];
    const activeWorkoutDay = user.activeWorkoutDay || (completedWorkoutDays.length > 0 ? Math.min(30, Math.max(...completedWorkoutDays) + 1) : 1);
    const workoutDaysCount = completedWorkoutDays.length;
    const workoutTenDayCompleted = Boolean(user.workoutTenDayCompleted || workoutDaysCount >= 10);

    return {
      userEmail: cleanEmail,
      activeWorkoutDay,
      completedWorkoutDays,
      workoutDaysCount,
      workoutTenDayCompleted,
      milestones: user.milestones || [],
      logs
    };
  },

  async saveUserWorkoutDayCompletion(userEmail, dayData = {}) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const dayNumber = parseInt(dayData.dayNumber, 10) || 1;
    const store = loadStore();
    const idx = store.users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    let userObj = idx >= 0 ? store.users[idx] : await this.findUserByEmail(cleanEmail);
    if (!userObj) {
      userObj = await this.createUser({ email: cleanEmail, fullName: cleanEmail.split('@')[0] });
    }

    const currentCompleted = Array.isArray(userObj.completedWorkoutDays) ? [...userObj.completedWorkoutDays] : [];
    if (!currentCompleted.includes(dayNumber)) {
      currentCompleted.push(dayNumber);
      currentCompleted.sort((a, b) => a - b);
    }

    const nextActiveDay = Math.min(30, Math.max(...currentCompleted) + 1);
    const daysCount = currentCompleted.length;
    const isTenDaysDone = daysCount >= 10 || dayNumber === 10 || userObj.workoutTenDayCompleted;

    const milestones = Array.isArray(userObj.milestones) ? [...userObj.milestones] : [];
    if (isTenDaysDone && !milestones.some(m => m.id === 'ms-10-days')) {
      milestones.push({
        id: 'ms-10-days',
        title: '10-Day Workout Plan Completed',
        achievedAt: new Date().toISOString(),
        daysCount: 10
      });
    }

    const xpEarned = (Number(dayData.caloriesBurned) || 350) + ((Number(dayData.durationMinutes) || 45) * 5);
    const updatedUserFields = {
      completedWorkoutDays: currentCompleted,
      activeWorkoutDay: nextActiveDay,
      workoutDaysCount: daysCount,
      workoutTenDayCompleted: isTenDaysDone,
      milestones,
      points: (userObj.points || 0) + xpEarned,
      streakDays: (userObj.streakDays || 1) + 1
    };

    const updatedUser = await this.updateUser(cleanEmail, updatedUserFields);

    // Save WorkoutLog
    const logItem = {
      id: `wlog-${Date.now()}`,
      userEmail: cleanEmail,
      dayNumber,
      workoutTitle: dayData.workoutTitle || `Day ${dayNumber} Workout`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      durationMinutes: Number(dayData.durationMinutes) || 45,
      caloriesBurned: Number(dayData.caloriesBurned) || 350,
      xpEarned,
      completedExercises: dayData.completedExercises || []
    };

    if (!store.workoutLogs) store.workoutLogs = [];
    store.workoutLogs.unshift(logItem);
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        await WorkoutLog.create(logItem);
      } catch (e) {}
    }

    return {
      user: updatedUser,
      activeWorkoutDay: nextActiveDay,
      completedWorkoutDays: currentCompleted,
      workoutDaysCount: daysCount,
      workoutTenDayCompleted: isTenDaysDone,
      milestoneAchieved: isTenDaysDone,
      log: logItem
    };
  },

  async resetUserWorkoutProgress(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const updated = await this.updateUser(cleanEmail, {
      completedWorkoutDays: [],
      activeWorkoutDay: 1,
      workoutDaysCount: 0
    });
    return updated;
  },

  // User Nutrition Progress Tracking
  async getUserNutritionProgress(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const user = await this.findUserByEmail(cleanEmail);
    const completedNutritionDays = Array.isArray(user?.completedNutritionDays) ? user.completedNutritionDays : [];
    const activeNutritionDay = user?.activeNutritionDay || (completedNutritionDays.length > 0 ? Math.min(30, Math.max(...completedNutritionDays) + 1) : 1);

    return {
      userEmail: cleanEmail,
      activeNutritionDay,
      completedNutritionDays,
      nutritionDaysCount: completedNutritionDays.length
    };
  },

  async saveUserNutritionDayCompletion(userEmail, dayData = {}) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const dayNumber = parseInt(dayData.dayNumber, 10) || 1;
    const userObj = await this.findUserByEmail(cleanEmail);

    const currentCompleted = Array.isArray(userObj?.completedNutritionDays) ? [...userObj.completedNutritionDays] : [];
    if (!currentCompleted.includes(dayNumber)) {
      currentCompleted.push(dayNumber);
      currentCompleted.sort((a, b) => a - b);
    }

    const nextActiveDay = Math.min(30, Math.max(...currentCompleted) + 1);
    const updatedUser = await this.updateUser(cleanEmail, {
      completedNutritionDays: currentCompleted,
      activeNutritionDay: nextActiveDay
    });

    return {
      user: updatedUser,
      activeNutritionDay: nextActiveDay,
      completedNutritionDays: currentCompleted,
      nutritionDaysCount: currentCompleted.length
    };
  },

  // Generic collection getters & setters
  async getCollection(collectionName) {
    const store = loadStore();
    return store[collectionName] || [];
  },

  async addToCollection(collectionName, item) {
    const store = loadStore();
    if (!store[collectionName]) store[collectionName] = [];
    store[collectionName].push(item);
    saveStore(store);
    return item;
  },

  // Trainer Management
  async getTrainers() {
    const store = loadStore();
    const jsonTrainers = Array.isArray(store.trainers) ? store.trainers : [];
    const map = new Map();

    jsonTrainers.forEach(t => {
      if (t.email) map.set(t.email.toLowerCase(), { ...t, id: t.id || t.email });
    });

    // Merge any registered users with role TRAINER
    const allUsers = await this.getAllUsers();
    allUsers.forEach(u => {
      if ((u.role || '').toUpperCase() === 'TRAINER' && u.email) {
        const clean = u.email.toLowerCase();
        if (!map.has(clean)) {
          map.set(clean, {
            id: u.id || clean,
            fullName: u.fullName || u.name || clean.split('@')[0],
            email: clean,
            specialization: u.specialization || 'Hypertrophy & Strength Conditioning',
            experienceYears: u.experienceYears || 5,
            assignedClientsCount: u.assignedClientsCount || 2,
            assignedUsersCount: u.assignedUsersCount || 2,
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            authenticityScore: 96,
            createdAt: u.createdAt || '2026-01-15'
          });
        }
      }
    });

    if (mongoose.connection.readyState === 1) {
      try {
        const mongoTrainers = await Trainer.find({}).lean();
        if (mongoTrainers && mongoTrainers.length > 0) {
          mongoTrainers.forEach(t => {
            const formatted = { ...t, id: t.id || t._id?.toString() };
            if (t.email) {
              const existing = map.get(t.email.toLowerCase()) || {};
              map.set(t.email.toLowerCase(), { ...existing, ...formatted });
            }
          });
        }
      } catch (e) {
        console.warn('MongoDB trainers find note:', e.message);
      }
    }

    return Array.from(map.values());
  },

  async saveTrainer(trainerData) {
    const cleanEmail = (trainerData.email || '').trim().toLowerCase();
    const trainerId = trainerData.id || `tr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    
    const trainerObj = {
      id: trainerId,
      ...trainerData,
      email: cleanEmail,
      status: trainerData.status || 'ACTIVE',
      verificationStatus: trainerData.verificationStatus || 'VERIFIED',
      authenticityScore: Number(trainerData.authenticityScore) || 95,
      createdAt: trainerData.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    // 1. Save to JSON store
    const store = loadStore();
    if (!store.trainers) store.trainers = [];
    const idx = store.trainers.findIndex(t => (t.email && t.email.toLowerCase() === cleanEmail) || t.id === trainerId);
    if (idx >= 0) {
      store.trainers[idx] = { ...store.trainers[idx], ...trainerObj };
    } else {
      store.trainers.unshift(trainerObj);
    }
    saveStore(store);

    // 2. Ensure trainer user account exists for login
    const existingUser = await this.findUserByEmail(cleanEmail);
    if (!existingUser) {
      await this.createUser({
        fullName: trainerObj.fullName,
        email: cleanEmail,
        password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
        plainPasswordFallback: 'password123',
        role: 'TRAINER',
        specialization: trainerObj.specialization || 'Personal Trainer',
        experienceYears: trainerObj.experienceYears || 5,
        mustChangePassword: true,
        hasChangedDefaultPassword: false,
        isFirstLogin: true
      });
    }

    // 3. Save to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await Trainer.findOne({ email: cleanEmail });
        if (existing) {
          Object.assign(existing, trainerObj);
          await existing.save();
        } else {
          await Trainer.create(trainerObj);
        }
      } catch (err) {
        console.warn('MongoDB trainer save note:', err.message);
      }
    }

    return trainerObj;
  },

  async updateTrainer(idOrEmail, updateData) {
    const cleanKey = (idOrEmail || '').toString().trim().toLowerCase();
    const store = loadStore();
    if (!store.trainers) store.trainers = [];
    
    const idx = store.trainers.findIndex(t => 
      t.id === idOrEmail || (t.email && t.email.toLowerCase() === cleanKey)
    );

    let updatedObj = null;
    if (idx >= 0) {
      store.trainers[idx] = { ...store.trainers[idx], ...updateData, updatedAt: new Date().toISOString() };
      updatedObj = store.trainers[idx];
      saveStore(store);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
          doc = await Trainer.findByIdAndUpdate(idOrEmail, updateData, { new: true });
        }
        if (!doc) {
          doc = await Trainer.findOneAndUpdate({ email: cleanKey }, updateData, { new: true });
        }
        if (doc) updatedObj = { ...doc.toObject(), id: doc._id.toString() };
      } catch (err) {
        console.warn('MongoDB trainer update note:', err.message);
      }
    }

    return updatedObj;
  },

  async deleteTrainer(idOrEmail) {
    const cleanKey = (idOrEmail || '').toString().trim().toLowerCase();
    const store = loadStore();
    if (store.trainers) {
      store.trainers = store.trainers.filter(t => 
        t.id !== idOrEmail && (!t.email || t.email.toLowerCase() !== cleanKey)
      );
      saveStore(store);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
          await Trainer.findByIdAndDelete(idOrEmail);
        }
        await Trainer.deleteMany({ email: cleanKey });
      } catch (err) {
        console.warn('MongoDB trainer delete note:', err.message);
      }
    }
    return true;
  },

  // Nutritionist Management
  async getNutritionists() {
    const store = loadStore();
    const jsonNutritionists = Array.isArray(store.nutritionists) ? store.nutritionists : [];
    const map = new Map();

    jsonNutritionists.forEach(n => {
      if (n.email) map.set(n.email.toLowerCase(), { ...n, id: n.id || n.email });
    });

    // Merge any registered users with role NUTRITIONIST
    const allUsers = await this.getAllUsers();
    allUsers.forEach(u => {
      if ((u.role || '').toUpperCase() === 'NUTRITIONIST' && u.email) {
        const clean = u.email.toLowerCase();
        if (!map.has(clean)) {
          map.set(clean, {
            id: u.id || clean,
            fullName: u.fullName || u.name || clean.split('@')[0],
            email: clean,
            qualification: u.qualification || 'M.Sc. Clinical Nutrition & Dietetics',
            specialization: u.specialization || 'Metabolic & Clinical Diets',
            experienceYears: u.experienceYears || 6,
            status: 'ACTIVE',
            verificationStatus: 'VERIFIED',
            authenticityScore: 98,
            createdAt: u.createdAt || '2026-01-20'
          });
        }
      }
    });

    if (mongoose.connection.readyState === 1) {
      try {
        const mongoNutritionists = await Nutritionist.find({}).lean();
        if (mongoNutritionists && mongoNutritionists.length > 0) {
          mongoNutritionists.forEach(n => {
            const formatted = { ...n, id: n.id || n._id?.toString() };
            if (n.email) {
              const existing = map.get(n.email.toLowerCase()) || {};
              map.set(n.email.toLowerCase(), { ...existing, ...formatted });
            }
          });
        }
      } catch (e) {
        console.warn('MongoDB nutritionists find note:', e.message);
      }
    }

    return Array.from(map.values());
  },

  async saveNutritionist(nutriData) {
    const cleanEmail = (nutriData.email || '').trim().toLowerCase();
    const nutriId = nutriData.id || `nu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const nutriObj = {
      id: nutriId,
      ...nutriData,
      email: cleanEmail,
      status: nutriData.status || 'ACTIVE',
      verificationStatus: nutriData.verificationStatus || 'VERIFIED',
      authenticityScore: Number(nutriData.authenticityScore) || 95,
      createdAt: nutriData.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    const store = loadStore();
    if (!store.nutritionists) store.nutritionists = [];
    const idx = store.nutritionists.findIndex(n => (n.email && n.email.toLowerCase() === cleanEmail) || n.id === nutriId);
    if (idx >= 0) {
      store.nutritionists[idx] = { ...store.nutritionists[idx], ...nutriObj };
    } else {
      store.nutritionists.unshift(nutriObj);
    }
    saveStore(store);

    const existingUser = await this.findUserByEmail(cleanEmail);
    if (!existingUser) {
      await this.createUser({
        fullName: nutriObj.fullName,
        email: cleanEmail,
        password: '$2a$10$wK1F5P4bM8hY6QjK.7L.NuZ/18f15gC/YdE1.2kM7aC4Z3nQeE6Gq',
        plainPasswordFallback: 'password123',
        role: 'NUTRITIONIST',
        qualification: nutriObj.qualification,
        specialization: nutriObj.specialization
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await Nutritionist.findOne({ email: cleanEmail });
        if (existing) {
          Object.assign(existing, nutriObj);
          await existing.save();
        } else {
          await Nutritionist.create(nutriObj);
        }
      } catch (err) {
        console.warn('MongoDB nutritionist save note:', err.message);
      }
    }

    return nutriObj;
  },

  async updateNutritionist(idOrEmail, updateData) {
    const cleanKey = (idOrEmail || '').toString().trim().toLowerCase();
    const store = loadStore();
    if (!store.nutritionists) store.nutritionists = [];
    
    const idx = store.nutritionists.findIndex(n => 
      n.id === idOrEmail || (n.email && n.email.toLowerCase() === cleanKey)
    );

    let updatedObj = null;
    if (idx >= 0) {
      store.nutritionists[idx] = { ...store.nutritionists[idx], ...updateData, updatedAt: new Date().toISOString() };
      updatedObj = store.nutritionists[idx];
      saveStore(store);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
          doc = await Nutritionist.findByIdAndUpdate(idOrEmail, updateData, { new: true });
        }
        if (!doc) {
          doc = await Nutritionist.findOneAndUpdate({ email: cleanKey }, updateData, { new: true });
        }
        if (doc) updatedObj = { ...doc.toObject(), id: doc._id.toString() };
      } catch (err) {
        console.warn('MongoDB nutritionist update note:', err.message);
      }
    }

    return updatedObj;
  },

  async deleteNutritionist(idOrEmail) {
    const cleanKey = (idOrEmail || '').toString().trim().toLowerCase();
    const store = loadStore();
    if (store.nutritionists) {
      store.nutritionists = store.nutritionists.filter(n => 
        n.id !== idOrEmail && (!n.email || n.email.toLowerCase() !== cleanKey)
      );
      saveStore(store);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
          await Nutritionist.findByIdAndDelete(idOrEmail);
        }
        await Nutritionist.deleteMany({ email: cleanKey });
      } catch (err) {
        console.warn('MongoDB nutritionist delete note:', err.message);
      }
    }
    return true;
  },

  async getCollection(name) {
    const store = loadStore();
    return store[name] || [];
  },

  async getWorkoutSplit(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const split = await WorkoutSplit.findOne({ userEmail: cleanEmail }).sort({ createdAt: -1 });
        if (split) return split.toObject();
      } catch (e) {
        console.warn('MongoDB getWorkoutSplit note:', e.message);
      }
    }
    const store = loadStore();
    if (!store.workoutSplits) store.workoutSplits = [];
    return store.workoutSplits.find(s => s.userEmail?.toLowerCase() === cleanEmail) || null;
  },

  async saveWorkoutSplit(splitData) {
    const cleanEmail = (splitData.userEmail || '').trim().toLowerCase();
    const splitId = splitData.id || `split-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const splitObj = {
      id: splitId,
      ...splitData,
      userEmail: cleanEmail,
      prescribedAt: splitData.prescribedAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: splitData.status || 'PUBLISHED',
      updatedAt: new Date().toISOString()
    };

    const store = loadStore();
    if (!store.workoutSplits) store.workoutSplits = [];
    const idx = store.workoutSplits.findIndex(s => s.userEmail?.toLowerCase() === cleanEmail);
    if (idx >= 0) {
      store.workoutSplits[idx] = { ...store.workoutSplits[idx], ...splitObj };
    } else {
      store.workoutSplits.unshift(splitObj);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await WorkoutSplit.findOne({ userEmail: cleanEmail });
        if (existing) {
          Object.assign(existing, splitObj);
          await existing.save();
        } else {
          await WorkoutSplit.create(splitObj);
        }
      } catch (e) {
        console.warn('MongoDB saveWorkoutSplit note:', e.message);
      }
    }

    return splitObj;
  },

  async getWorkoutPlan(userEmail) {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const plan = await WorkoutPlan.findOne({ userEmail: cleanEmail }).sort({ createdAt: -1 });
        if (plan) return plan.toObject();
      } catch (e) {
        console.warn('MongoDB getWorkoutPlan note:', e.message);
      }
    }
    const store = loadStore();
    if (!store.workoutPlans) store.workoutPlans = [];
    return store.workoutPlans.find(p => p.userEmail?.toLowerCase() === cleanEmail) || null;
  },

  async saveWorkoutPlan(planData) {
    const cleanEmail = (planData.userEmail || '').trim().toLowerCase();
    const planId = planData.id || `wp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const planObj = {
      id: planId,
      ...planData,
      userEmail: cleanEmail,
      publishedAt: planData.publishedAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: planData.status || 'PUBLISHED',
      updatedAt: new Date().toISOString()
    };

    const store = loadStore();
    if (!store.workoutPlans) store.workoutPlans = [];
    const idx = store.workoutPlans.findIndex(p => p.userEmail?.toLowerCase() === cleanEmail);
    if (idx >= 0) {
      store.workoutPlans[idx] = { ...store.workoutPlans[idx], ...planObj };
    } else {
      store.workoutPlans.unshift(planObj);
    }
    saveStore(store);

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await WorkoutPlan.findOne({ userEmail: cleanEmail });
        if (existing) {
          Object.assign(existing, planObj);
          await existing.save();
        } else {
          await WorkoutPlan.create(planObj);
        }
      } catch (e) {
        console.warn('MongoDB saveWorkoutPlan note:', e.message);
      }
    }

    return planObj;
  }
};


