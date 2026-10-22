import { dataStore } from './dataStore.js';

/**
 * SmartCareTeam Matcher:
 * Intelligently matches a user with the most qualified Personal Trainer and Clinical Nutritionist
 * based on primary fitness goal, dietary preference, training style, and body metrics.
 */
export async function matchCareTeamForUser(userData) {
  const trainers = await dataStore.getTrainers();
  const nutritionists = await dataStore.getNutritionists();

  const goal = (userData.fitnessGoal || '').toLowerCase().trim();
  const diet = (userData.dietaryPreference || '').toLowerCase().trim();
  const equipment = (userData.workoutEquipment || '').toLowerCase().trim();

  // ==========================================
  // 1. TRAINER MATCHING ALGORITHM
  // ==========================================
  let bestTrainer = null;
  let bestTrainerScore = -1;
  let trainerMatchRationale = '';

  for (const t of trainers) {
    if (t.status && t.status !== 'ACTIVE') continue;

    const spec = (t.specialization || '').toLowerCase();
    const cert = (t.certificationName || '').toLowerCase();
    let score = 50; // Base baseline

    // Match Longevity / Health Maintenance / Metabolic Management / Wellness
    if (goal.includes('health') || goal.includes('longevity') || goal.includes('maintenance') || goal.includes('wellness') || goal.includes('metabolic') || goal.includes('general')) {
      if (spec.includes('longevity') || spec.includes('metabolic') || spec.includes('wellness') || spec.includes('nutrition management') || spec.includes('health')) {
        score += 48;
      } else if (spec.includes('functional') || spec.includes('mobility')) {
        score += 35;
      } else if (spec.includes('calisthenics') || spec.includes('cardio')) {
        score += 25;
      }
    }
    // Match Muscle Building / Hypertrophy / Heavy Strength
    else if (goal.includes('muscle') || goal.includes('strength') || goal.includes('hypertrophy') || goal.includes('bulk') || goal.includes('power')) {
      if (spec.includes('hypertrophy') || spec.includes('strength') || spec.includes('powerlifting') || spec.includes('conditioning')) {
        score += 48;
      } else if (spec.includes('functional') || spec.includes('mobility')) {
        score += 28;
      }
    }
    // Match Fat Loss / Weight Loss / Cardio HIIT / Endurance
    else if (goal.includes('fat') || goal.includes('loss') || goal.includes('cardio') || goal.includes('endurance') || goal.includes('stamina') || goal.includes('toning') || goal.includes('hiit')) {
      if (spec.includes('cardio') || spec.includes('endurance') || spec.includes('calisthenics') || spec.includes('fat loss')) {
        score += 48;
      } else if (spec.includes('metabolic') || spec.includes('wellness')) {
        score += 35;
      }
    }
    // Match Athletic Performance / Functional Movement / Mobility
    else if (goal.includes('athletic') || goal.includes('mobility') || goal.includes('functional') || goal.includes('agility') || goal.includes('sports')) {
      if (spec.includes('athletic') || spec.includes('mobility') || spec.includes('functional') || spec.includes('movement')) {
        score += 48;
      } else if (spec.includes('strength') || spec.includes('calisthenics')) {
        score += 30;
      }
    }
    // General fallback matching
    else {
      if (spec.includes('general') || spec.includes('wellness') || spec.includes('strength')) {
        score += 35;
      }
    }

    // Equipment & Experience Alignment Bonus
    if (equipment.includes('calisthenics') || equipment.includes('bodyweight') || equipment.includes('home')) {
      if (spec.includes('calisthenics') || spec.includes('mobility') || spec.includes('wellness')) score += 8;
    } else if (equipment.includes('full gym') || equipment.includes('barbell') || equipment.includes('dumbbell')) {
      if (spec.includes('hypertrophy') || spec.includes('strength')) score += 8;
    }

    // Verification and Experience bonus
    if ((t.verificationStatus || 'VERIFIED') === 'VERIFIED') score += 5;
    if (Number(t.experienceYears) >= 6) score += 3;

    const finalScore = Math.min(score, 99);

    if (finalScore > bestTrainerScore) {
      bestTrainerScore = finalScore;
      bestTrainer = t;
      trainerMatchRationale = `${t.fullName}'s specialization in ${t.specialization} provides a ${finalScore}% precision match with your "${userData.fitnessGoal || 'Fitness'}" objective.`;
    }
  }

  // ==========================================
  // 2. NUTRITIONIST MATCHING ALGORITHM
  // ==========================================
  let bestNutritionist = null;
  let bestNutritionistScore = -1;
  let nutritionistMatchRationale = '';

  for (const n of nutritionists) {
    if (n.status && n.status !== 'ACTIVE') continue;

    const spec = (n.specialization || '').toLowerCase();
    const qual = (n.qualification || '').toLowerCase();
    let score = 50;

    // Plant-Based / Vegetarian / Vegan / Pescatarian
    if (diet.includes('vegetarian') || diet.includes('vegan') || diet.includes('plant') || diet.includes('pescatarian')) {
      if (spec.includes('plant') || spec.includes('vegetarian') || spec.includes('vegan') || qual.includes('dietetics')) {
        score += 48;
      } else {
        score += 20;
      }
    }
    // High Protein / Keto / Low Carb / Metabolic Diets
    else if (diet.includes('high protein') || diet.includes('keto') || diet.includes('low carb') || diet.includes('metabolic') || diet.includes('carnivore')) {
      if (spec.includes('high-protein') || spec.includes('metabolic') || spec.includes('keto') || qual.includes('sports clinical')) {
        score += 48;
      } else {
        score += 25;
      }
    }
    // Standard Balanced / Mediterranean / Clean Eating
    else {
      if (spec.includes('metabolic') || spec.includes('wellness') || qual.includes('dietetics')) {
        score += 42;
      } else {
        score += 35;
      }
    }

    if (Number(n.experienceYears) >= 7) score += 4;
    const finalScore = Math.min(score, 99);

    if (finalScore > bestNutritionistScore) {
      bestNutritionistScore = finalScore;
      bestNutritionist = n;
      nutritionistMatchRationale = `${n.fullName} (${n.qualification || n.specialization}) aligns directly with your "${userData.dietaryPreference || 'Balanced'}" nutrition plan (${finalScore}% compatibility).`;
    }
  }

  return {
    assignedTrainer: bestTrainer ? {
      email: bestTrainer.email.toLowerCase().trim(),
      name: bestTrainer.fullName,
      specialization: bestTrainer.specialization,
      matchScore: bestTrainerScore,
      matchRationale: trainerMatchRationale
    } : {
      email: 'marcus@example.com',
      name: 'Coach Marcus Vance',
      specialization: 'Hypertrophy & Strength Conditioning',
      matchScore: 85,
      matchRationale: 'Default standard coach assignment'
    },
    assignedNutritionist: bestNutritionist ? {
      email: bestNutritionist.email.toLowerCase().trim(),
      name: bestNutritionist.fullName,
      qualification: bestNutritionist.qualification || bestNutritionist.specialization,
      matchScore: bestNutritionistScore,
      matchRationale: nutritionistMatchRationale
    } : {
      email: 'sruthy@example.com',
      name: 'Sruthy Varghese (M.Sc)',
      qualification: 'M.Sc. Dietetics & Performance Nutrition',
      matchScore: 88,
      matchRationale: 'Default standard clinical nutritionist assignment'
    }
  };
}

/**
 * Auto-assign care teams to all registered users (or a specific user)
 */
export async function autoAssignCareTeamsForAllUsers() {
  const allUsers = await dataStore.getAllUsers();
  const updatedUsers = [];

  for (const user of allUsers) {
    // Only assign care teams for client users (role USER)
    if (user.role && user.role !== 'USER') continue;

    const { assignedTrainer, assignedNutritionist } = await matchCareTeamForUser(user);

    const updatedUser = await dataStore.updateUser(user.email, {
      assignedTrainer,
      assignedNutritionist
    });

    updatedUsers.push({
      email: user.email,
      fullName: user.fullName,
      fitnessGoal: user.fitnessGoal,
      dietaryPreference: user.dietaryPreference,
      assignedTrainer,
      assignedNutritionist
    });
  }

  return updatedUsers;
}
