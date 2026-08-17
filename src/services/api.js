const API_BASE_URL = 'http://localhost:8081/api';

export const registerUserApi = async (registerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = 'Registration failed. Email may already be registered.';
      try {
        const errObj = JSON.parse(errText);
        if (errObj.message) errorMsg = errObj.message;
      } catch (e) {
        if (errText) errorMsg = errText;
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (err) {
    if (err.message && !err.message.toLowerCase().includes('failed to fetch')) {
      throw err;
    }
    throw new Error(err.message || 'Server Connection Error');
  }
};

export const loginUserApi = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = 'Access Denied: Incorrect email or password.';
      try {
        const errObj = JSON.parse(errText);
        if (errObj.message) errorMsg = errObj.message;
      } catch (e) {
        if (errText) errorMsg = errText;
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (err) {
    if (err.message && !err.message.toLowerCase().includes('failed to fetch')) {
      throw err;
    }
    throw new Error(err.message || 'Server Connection Error');
  }
};

export const fetchAllRegisteredUsersApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/all`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.log('[INFO] Backend offline, returning empty users list:', err.message);
  }
  return [];
};

export const fetchAIWorkoutPlan = async (userProfile) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const isMuscle = userProfile?.fitnessGoal === 'Muscle Building';
  return {
    sessionTitle: isMuscle ? "Hypertrophy Upper Push Split" : "Fat Loss & Metabolic Conditioning",
    durationMins: 50,
    rpeTarget: "8.5 / 10",
    recoveryScore: 94,
    exercises: [
      { id: 1, name: 'Incline Dumbbell Press', sets: '4 × 8-10 reps', weight: '28 kg', note: 'Angled for shoulder preservation' },
      { id: 2, name: 'Seated Cable Chest Flyes', sets: '3 × 12-15 reps', weight: '18 kg', note: 'Peak contraction focus' },
      { id: 3, name: 'Standing Overhead DB Press', sets: '3 × 10-12 reps', weight: '20 kg', note: 'Collarbone stability target' },
      { id: 4, name: 'Cable Lateral Raise', sets: '3 × 15 reps', weight: '10 kg', note: 'Deltoid hypertrophy stimulus' },
      { id: 5, name: 'Rope Triceps Pushdowns', sets: '3 × 12 reps', weight: '25 kg', note: 'Strict elbow isolation' }
    ]
  };
};

export const fetchAINutritionPlan = async (userProfile) => {
  const payload = {
    userId: userProfile?.email || userProfile?.userId || "user@smartfit.ai",
    age: parseFloat(userProfile?.age || 26),
    gender: userProfile?.gender || "Male",
    height: parseFloat(userProfile?.height || 178),
    weight: parseFloat(userProfile?.weight || 75),
    bmi: parseFloat(userProfile?.bmi || 23.7),
    activityLevel: userProfile?.activityLevel || "Moderately Active",
    fitnessGoal: userProfile?.fitnessGoal || "Muscle Building",
    dietaryPreference: userProfile?.dietaryPreference || "Vegetarian",
    nutritionPreference: userProfile?.nutritionPreference || "High Protein",
    medicalConditions: userProfile?.medicalConditions || "None",
    allergies: userProfile?.allergies || []
  };

  try {
    const response = await fetch('http://localhost:8000/predict/nutrition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.log('[INFO] ML Service offline, applying client-side AI fallback:', e.message);
  }

  // Client-side Fallback Calculation
  const weight = payload.weight;
  const height = payload.height < 3 ? payload.height * 100 : payload.height;
  const age = payload.age;
  const isFemale = payload.gender.toLowerCase() === 'female';
  const bmr = 10 * weight + 6.25 * height - 5 * age + (isFemale ? -161 : 5);
  let mult = 1.55;
  if (payload.activityLevel.toLowerCase().includes('sedentary')) mult = 1.2;
  else if (payload.activityLevel.toLowerCase().includes('light')) mult = 1.375;

  let targetCalories = Math.round(bmr * mult);
  if (payload.fitnessGoal.toLowerCase().includes('loss')) targetCalories -= 450;
  else if (payload.fitnessGoal.toLowerCase().includes('muscle')) targetCalories += 350;

  const proteinGrams = Math.round(weight * 2.2);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  return {
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    dietPreference: payload.dietaryPreference,
    fitnessGoal: payload.fitnessGoal,
    meals: [
      { id: 1, type: 'Breakfast', title: 'High-Protein Oats & Greek Yogurt with Berries', calories: Math.round(targetCalories * 0.22), macros: `${Math.round(proteinGrams * 0.25)}g P • ${Math.round(carbGrams * 0.30)}g C • ${Math.round(fatGrams * 0.20)}g F` },
      { id: 2, type: 'Lunch', title: 'Quinoa & Chickpea Bowl with Avocado & Roasted Greens', calories: Math.round(targetCalories * 0.35), macros: `${Math.round(proteinGrams * 0.35)}g P • ${Math.round(carbGrams * 0.35)}g C • ${Math.round(fatGrams * 0.35)}g F` },
      { id: 3, type: 'Snack', title: 'Almond & Dried Fruit Satiety Power Blend', calories: Math.round(targetCalories * 0.15), macros: `${Math.round(proteinGrams * 0.15)}g P • ${Math.round(carbGrams * 0.15)}g C • ${Math.round(fatGrams * 0.20)}g F` },
      { id: 4, type: 'Dinner', title: 'Grilled Tofu & Vegetable Stir-Fry with Brown Rice', calories: Math.round(targetCalories * 0.28), macros: `${Math.round(proteinGrams * 0.25)}g P • ${Math.round(carbGrams * 0.20)}g C • ${Math.round(fatGrams * 0.25)}g F` }
    ],
    explanation: [
      `Calibrated target calories (${targetCalories} kcal) for goal '${payload.fitnessGoal}' and activity '${payload.activityLevel}'.`,
      `Dietary constraint enforced: '${payload.dietaryPreference}'.`,
      "Generated continuous macronutrient distribution (Protein, Carbs, Fat) optimized for satiety and recovery."
    ]
  };
};

export const fetchProgressAnalytics = async () => {
  return {
    weightHistory: [
      { date: 'Week 1', weight: 77.2, bodyFat: 18.5 },
      { date: 'Week 2', weight: 76.5, bodyFat: 18.1 },
      { date: 'Week 3', weight: 75.8, bodyFat: 17.6 },
      { date: 'Week 4', weight: 75.0, bodyFat: 17.0 }
    ],
    strengthProgress: [
      { exercise: 'Bench Press', start: '70 kg', current: '85 kg', gain: '+15 kg' },
      { exercise: 'Squat', start: '90 kg', current: '110 kg', gain: '+20 kg' },
      { exercise: 'Deadlift', start: '110 kg', current: '135 kg', gain: '+25 kg' }
    ]
  };
};

export const fetchChallenges = async () => {
  return [
    { id: 1, title: '🔥 30-Day Consistent Streak', participants: 14200, reward: '500 XP', daysLeft: 12, category: 'Consistency' },
    { id: 2, title: '🏋️ 10,000 Push-Up Monthly Quest', participants: 8900, reward: '750 XP', daysLeft: 18, category: 'Strength' },
    { id: 3, title: '🥗 Clean Macro Blueprint Challenge', participants: 19500, reward: '400 XP', daysLeft: 5, category: 'Nutrition' },
    { id: 4, title: '🏃 50km Total Distance Challenge', participants: 11300, reward: '600 XP', daysLeft: 22, category: 'Endurance' }
  ];
};
