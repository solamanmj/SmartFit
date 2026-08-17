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
  await new Promise(resolve => setTimeout(resolve, 300));
  const weight = parseFloat(userProfile?.weight || 75);
  const protein = Math.round(weight * 2.2);
  return {
    targetCalories: 2450,
    proteinGrams: protein,
    carbGrams: 245,
    fatGrams: 68,
    meals: [
      { id: 1, type: 'Breakfast', title: 'Oatmeal & Whey Protein with Blueberries & Almond Butter', calories: 550, macros: `${protein > 150 ? '42g' : '35g'} P • 60g C • 14g F` },
      { id: 2, type: 'Lunch', title: 'Grilled Chicken Breast, Quinoa & Steamed Broccoli', calories: 650, macros: '52g P • 65g C • 15g F' },
      { id: 3, type: 'Pre-Workout', title: 'Greek Yogurt with Honey & Rice Cakes', calories: 350, macros: '25g P • 45g C • 4g F' },
      { id: 4, type: 'Dinner', title: 'Pan-Seared Salmon, Sweet Potato & Asparagus', calories: 700, macros: '46g P • 55g C • 28g F' }
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
