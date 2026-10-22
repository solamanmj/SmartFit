import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Trainer from '../models/Trainer.js';
import Nutritionist from '../models/Nutritionist.js';
import ExerciseItem from '../models/ExerciseItem.js';
import NutritionFoodItem from '../models/NutritionFoodItem.js';
import Feedback from '../models/Feedback.js';
import WorkoutLog from '../models/WorkoutLog.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import MealPlan from '../models/MealPlan.js';

export async function seedDatabase() {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', salt);

    // 1. Seed Users with Trainer & Nutritionist Assignments
    const seedUsers = [
      {
        fullName: 'System Administrator',
        email: 'admin@smartfit.com',
        password: adminPasswordHash,
        age: 32,
        gender: 'Male',
        height: 180,
        weight: 80,
        activityLevel: 'Very Active',
        fitnessGoal: 'System Operations',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'ADMIN'
      },
      {
        fullName: 'Sarah Jenkins',
        email: 'sarah@example.com',
        password: defaultPasswordHash,
        age: 28,
        gender: 'Female',
        height: 165,
        weight: 58,
        activityLevel: 'Very Active',
        fitnessGoal: 'Endurance & Conditioning',
        dietaryPreference: 'Vegan',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'TRAINER'
      },
      {
        fullName: 'Marcus Vance',
        email: 'marcus@example.com',
        password: defaultPasswordHash,
        age: 34,
        gender: 'Male',
        height: 185,
        weight: 92,
        activityLevel: 'Very Active',
        fitnessGoal: 'Heavy Strength',
        dietaryPreference: 'High Protein Keto',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'Knee Tendonitis',
        role: 'TRAINER'
      },
      {
        fullName: 'David Kim',
        email: 'david@example.com',
        password: defaultPasswordHash,
        age: 24,
        gender: 'Male',
        height: 176,
        weight: 68,
        activityLevel: 'Lightly Active',
        fitnessGoal: 'Athletic Conditioning',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Bodyweight / Calisthenics',
        medicalConditions: 'None',
        role: 'TRAINER'
      },
      {
        fullName: 'Dr. Elena Rostova',
        email: 'elena@example.com',
        password: defaultPasswordHash,
        age: 31,
        gender: 'Female',
        height: 170,
        weight: 62,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Hypertrophy & Toning',
        dietaryPreference: 'Low Carb',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'NUTRITIONIST'
      },
      {
        fullName: 'Sruthy Varghese',
        email: 'sruthy@example.com',
        password: defaultPasswordHash,
        age: 25,
        gender: 'Female',
        height: 163,
        weight: 56,
        activityLevel: 'Very Active',
        fitnessGoal: 'Fat Loss & Toning',
        dietaryPreference: 'Vegetarian',
        workoutEquipment: 'Dumbbells & Resistance Bands',
        medicalConditions: 'None',
        role: 'NUTRITIONIST'
      },
      {
        fullName: 'Aby Thomas',
        email: 'aby@example.com',
        password: defaultPasswordHash,
        age: 27,
        gender: 'Male',
        height: 177,
        weight: 74,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Muscle Building',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'USER',
        assignedTrainer: {
          email: 'marcus@example.com',
          name: 'Marcus Vance',
          specialization: 'Hypertrophy & Strength Conditioning'
        },
        assignedNutritionist: {
          email: 'sruthy@example.com',
          name: 'Sruthy Varghese',
          qualification: 'M.Sc. Dietetics & Plant-Based Nutrition'
        }
      },
      {
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        password: defaultPasswordHash,
        age: 26,
        gender: 'Male',
        height: 178,
        weight: 75,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Muscle Building',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'USER',
        assignedTrainer: {
          email: 'sarah@example.com',
          name: 'Sarah Jenkins',
          specialization: 'Cardio Endurance & Calisthenics'
        },
        assignedNutritionist: {
          email: 'elena@example.com',
          name: 'Dr. Elena Rostova',
          qualification: 'Ph.D. Sports Clinical Nutrition'
        }
      },
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: defaultPasswordHash,
        age: 21,
        gender: 'Male',
        height: 175,
        weight: 70,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Weight Loss',
        dietaryPreference: 'Vegetarian',
        workoutEquipment: 'Dumbbells Only',
        medicalConditions: 'None',
        role: 'USER',
        assignedTrainer: {
          email: 'david@example.com',
          name: 'David Kim',
          specialization: 'Athletic Mobility & Functional Training'
        },
        assignedNutritionist: {
          email: 'sruthy@example.com',
          name: 'Sruthy Varghese',
          qualification: 'M.Sc. Dietetics & Plant-Based Nutrition'
        }
      },
      {
        fullName: 'Priya Sharma',
        email: 'priya@example.com',
        password: defaultPasswordHash,
        age: 29,
        gender: 'Female',
        height: 162,
        weight: 55,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Fat Loss & Toning',
        dietaryPreference: 'Vegetarian',
        workoutEquipment: 'Dumbbells & Resistance Bands',
        medicalConditions: 'None',
        role: 'USER',
        assignedTrainer: {
          email: 'marcus@example.com',
          name: 'Marcus Vance',
          specialization: 'Hypertrophy & Strength Conditioning'
        },
        assignedNutritionist: {
          email: 'elena@example.com',
          name: 'Dr. Elena Rostova',
          qualification: 'Ph.D. Sports Clinical Nutrition'
        }
      },
      {
        fullName: 'Carlos Mendez',
        email: 'carlos@example.com',
        password: defaultPasswordHash,
        age: 38,
        gender: 'Male',
        height: 180,
        weight: 84,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Muscle Building',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'Lower Back Tightness',
        role: 'USER',
        assignedTrainer: {
          email: 'marcus@example.com',
          name: 'Marcus Vance',
          specialization: 'Hypertrophy & Strength Conditioning'
        },
        assignedNutritionist: {
          email: 'elena@example.com',
          name: 'Dr. Elena Rostova',
          qualification: 'Ph.D. Sports Clinical Nutrition'
        }
      },
      {
        fullName: 'Emily Watson',
        email: 'emily@example.com',
        password: defaultPasswordHash,
        age: 25,
        gender: 'Female',
        height: 168,
        weight: 60,
        activityLevel: 'Lightly Active',
        fitnessGoal: 'Health & Mobility',
        dietaryPreference: 'Pescatarian',
        workoutEquipment: 'Yoga Mat & Dumbbells',
        medicalConditions: 'None',
        role: 'USER'
      },
      {
        fullName: 'Michael Chang',
        email: 'michael@example.com',
        password: defaultPasswordHash,
        age: 42,
        gender: 'Male',
        height: 172,
        weight: 78,
        activityLevel: 'Moderately Active',
        fitnessGoal: 'Weight Loss',
        dietaryPreference: 'Low Carb',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'Mild Asthma',
        role: 'USER'
      },
      {
        fullName: 'Sophia Taylor',
        email: 'sophia@example.com',
        password: defaultPasswordHash,
        age: 23,
        gender: 'Female',
        height: 160,
        weight: 52,
        activityLevel: 'Very Active',
        fitnessGoal: 'Endurance',
        dietaryPreference: 'High Protein',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'USER'
      },
      {
        fullName: 'James Wilson',
        email: 'james@example.com',
        password: defaultPasswordHash,
        age: 30,
        gender: 'Male',
        height: 182,
        weight: 88,
        activityLevel: 'Very Active',
        fitnessGoal: 'Hypertrophy',
        dietaryPreference: 'Standard Balanced',
        workoutEquipment: 'Full Gym Access',
        medicalConditions: 'None',
        role: 'USER'
      }
    ];

    for (const u of seedUsers) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create(u);
      } else {
        if (u.assignedTrainer && !existing.assignedTrainer?.email) {
          existing.assignedTrainer = u.assignedTrainer;
          existing.assignedNutritionist = u.assignedNutritionist;
          await existing.save();
        }
      }
    }

    // 2. Seed Trainers
    if ((await Trainer.countDocuments()) === 0) {
      await Trainer.create([
        { fullName: 'Marcus Vance', email: 'marcus@example.com', specialization: 'Hypertrophy & Strength Conditioning', experienceYears: 8, assignedUsersCount: 3, status: 'ACTIVE', createdAt: '2026-01-15' },
        { fullName: 'Sarah Jenkins', email: 'sarah@example.com', specialization: 'Cardio Endurance & Calisthenics', experienceYears: 6, assignedUsersCount: 2, status: 'ACTIVE', createdAt: '2026-02-01' },
        { fullName: 'David Kim', email: 'david@example.com', specialization: 'Athletic Mobility & Functional Training', experienceYears: 5, assignedUsersCount: 2, status: 'ACTIVE', createdAt: '2026-02-10' }
      ]);
    }

    // 3. Seed Nutritionists
    if ((await Nutritionist.countDocuments()) === 0) {
      await Nutritionist.create([
        { fullName: 'Dr. Elena Rostova', email: 'elena@example.com', qualification: 'Ph.D. Sports Clinical Nutrition', specialization: 'High-Protein & Metabolic Diets', experienceYears: 10, status: 'ACTIVE', createdAt: '2026-01-10' },
        { fullName: 'Sruthy Varghese', email: 'sruthy@example.com', qualification: 'M.Sc. Dietetics & Wellness', specialization: 'Plant-Based & Vegetarian Nutrition', experienceYears: 7, status: 'ACTIVE', createdAt: '2026-01-20' }
      ]);
    }

    // 4. Seed Exercises
    if ((await ExerciseItem.countDocuments()) === 0) {
      await ExerciseItem.create([
        { name: 'Incline Dumbbell Bench Press', workoutType: 'Hypertrophy', muscleGroup: 'Upper Chest & Triceps', difficulty: 'Intermediate', equipmentNeeded: 'Dumbbells & Incline Bench', durationMinutes: 15, estimatedCaloriesBurned: 140, instructions: 'Maintain 45-degree incline bench angle. Press weights directly over chest.' },
        { name: 'Barbell Romanian Deadlift', workoutType: 'Strength', muscleGroup: 'Hamstrings & Glutes', difficulty: 'Intermediate', equipmentNeeded: 'Barbell & Plates', durationMinutes: 20, estimatedCaloriesBurned: 180, instructions: 'Keep spine neutral. Hinge backwards at hips until hamstring stretch is felt.' },
        { name: 'High Intensity Battle Ropes', workoutType: 'Cardio HIIT', muscleGroup: 'Full Body Conditioning', difficulty: 'Advanced', equipmentNeeded: 'Battle Ropes', durationMinutes: 10, estimatedCaloriesBurned: 150, instructions: 'Perform alternating waves continuously for 45-second work intervals.' },
        { name: 'Bodyweight Pull-Ups', workoutType: 'Calisthenics', muscleGroup: 'Lats & Biceps', difficulty: 'Intermediate', equipmentNeeded: 'Pull-up Bar', durationMinutes: 12, estimatedCaloriesBurned: 110, instructions: 'Full range of motion. Pull chin over bar without swinging hips.' },
        { name: 'Seated Cable Rows', workoutType: 'Hypertrophy', muscleGroup: 'Mid-Back & Rhomboids', difficulty: 'Beginner', equipmentNeeded: 'Cable Machine', durationMinutes: 15, estimatedCaloriesBurned: 120, instructions: 'Drive elbows back while keeping chest upright.' }
      ]);
    }

    // 5. Seed Nutrition Food Items
    if ((await NutritionFoodItem.countDocuments()) === 0) {
      await NutritionFoodItem.create([
        { name: 'Grilled Organic Chicken Breast', calories: 165, proteinGrams: 31.0, carbGrams: 0.0, fatGrams: 3.6, category: 'Poultry', dietaryCategory: 'Standard Balanced' },
        { name: 'Wild Alaskan Salmon Fillet', calories: 206, proteinGrams: 22.0, carbGrams: 0.0, fatGrams: 12.0, category: 'Seafood', dietaryCategory: 'Pescatarian / High Omega-3' },
        { name: 'Steamed Quinoa & Chickpea Bowl', calories: 222, proteinGrams: 8.1, carbGrams: 39.4, fatGrams: 3.5, category: 'Grains & Legumes', dietaryCategory: 'Vegan / Vegetarian' },
        { name: 'Greek Yogurt & Chia Protein Parfait', calories: 150, proteinGrams: 15.0, carbGrams: 12.0, fatGrams: 4.0, category: 'Dairy', dietaryCategory: 'High Protein Vegetarian' },
        { name: 'Avocado & Spinach Almond Protein Shake', calories: 240, proteinGrams: 20.0, carbGrams: 14.0, fatGrams: 11.0, category: 'Beverage & Shake', dietaryCategory: 'Keto / Vegan' }
      ]);
    }

    // 6. Seed Feedback
    if ((await Feedback.countDocuments()) === 0) {
      await Feedback.create([
        { userEmail: 'aby@example.com', rating: 5, feedbackCategory: 'Recommendation Accuracy', recommendationType: 'WORKOUT', comments: 'Coach Marcus: The chest and triceps hypertrophy split matched my gym equipment perfectly!', createdAt: '2026-08-17 14:20' },
        { userEmail: 'sruthy@example.com', rating: 5, feedbackCategory: 'Nutrition Plan', recommendationType: 'NUTRITION', comments: 'Vegetarian meal targets calculated my daily protein goals accurately.', createdAt: '2026-08-17 15:45' },
        { userEmail: 'alex@example.com', rating: 4, feedbackCategory: 'UI & Recommendations', recommendationType: 'WORKOUT', comments: 'Great AI exercise suggestions reviewed and enhanced by Coach Sarah.', createdAt: '2026-08-17 16:10' }
      ]);
    }

    // 7. Seed Workout Logs
    if ((await WorkoutLog.countDocuments()) === 0) {
      await WorkoutLog.create([
        { userEmail: 'aby@example.com', workoutTitle: 'Hypertrophy Chest & Triceps Split', date: '2026-08-17 10:30:00', durationMinutes: 50, caloriesBurned: 480, xpEarned: 730, completedExercises: ['Incline Dumbbell Press', 'Barbell Bench Press', 'Triceps Rope Pushdowns'] },
        { userEmail: 'sruthy@example.com', workoutTitle: 'Fat Loss HIIT & Core Conditioning', date: '2026-08-17 11:15:00', durationMinutes: 45, caloriesBurned: 420, xpEarned: 645, completedExercises: ['Russian Twists with Weight', 'Bicycle Crunches', 'Sprinting Interval Treadmill'] },
        { userEmail: 'alex@example.com', workoutTitle: 'Hypertrophy Upper Body Split', date: '2026-08-17 09:00:00', durationMinutes: 60, caloriesBurned: 550, xpEarned: 850, completedExercises: ['Barbell Back Squats', 'Lat Pulldown', 'Plank Hold'] }
      ]);
    }

    // 8. Seed Sample Published Workout Plans (Crafted by Trainers for Users)
    if ((await WorkoutPlan.countDocuments()) === 0) {
      await WorkoutPlan.create([
        {
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
          ]
        },
        {
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
          ]
        }
      ]);
    }

    // 9. Seed Sample Published Meal Plans (Crafted by Nutritionists for Users)
    if ((await MealPlan.countDocuments()) === 0) {
      await MealPlan.create([
        {
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
          ]
        },
        {
          userEmail: 'alex@example.com',
          userName: 'Alex Morgan',
          nutritionistEmail: 'elena@example.com',
          nutritionistName: 'Dr. Elena Rostova',
          planTitle: 'Clinical Lean Mass & Recovery Fuel',
          dietaryPreference: 'Standard Balanced',
          targetCalories: 2900,
          proteinGrams: 170,
          carbGrams: 340,
          fatGrams: 70,
          hydrationLiters: 3.8,
          notes: 'Electrolyte-replenished hydration plan recommended during heavy training days.',
          status: 'PUBLISHED',
          meals: [
            { id: 'mp-a1', type: 'Breakfast', title: 'Whole Egg & White Omelette with Avocado Toast', description: '3 whole eggs + 2 whites, spinach, 2 slices whole grain toast', calories: 650, protein: '40g', carbs: '52g', fat: '28g' },
            { id: 'mp-a2', type: 'Lunch', title: 'Turkey & Brown Rice Performance Bowl', description: '220g lean ground turkey, 1.5 cups brown rice, black beans & salsa', calories: 850, protein: '58g', carbs: '96g', fat: '16g' },
            { id: 'mp-a3', type: 'Snack', title: 'Protein Fruit Smoothie with Oats', description: '1 banana, 1 scoop isolate, 40g oats, unsweetened almond milk', calories: 450, protein: '32g', carbs: '58g', fat: '8g' },
            { id: 'mp-a4', type: 'Dinner', title: 'Seared White Fish with Quinoa Salad', description: '220g cod/tilapia, quinoa, mixed peppers and olive oil dressing', calories: 750, protein: '48g', carbs: '72g', fat: '16g' }
          ]
        }
      ]);
    }

    console.log('[SUCCESS] Database initialized with Role-Based Assignments and seed data.');
  } catch (err) {
    console.warn('[INFO] Database seed notice:', err.message);
  }
}
