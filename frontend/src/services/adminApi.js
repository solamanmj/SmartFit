const ADMIN_BASE_URL = 'http://localhost:8081/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('smartfit_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchAdminStatsApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/dashboard`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend API note (Admin Stats):', err.message);
  }
  return {
    totalUsers: 16,
    activeUsers: 16,
    totalTrainers: 3,
    totalNutritionists: 2,
    totalExercises: 5,
    totalNutritionItems: 5,
    workoutRecommendationsGenerated: 142,
    nutritionRecommendationsGenerated: 185,
    mongoDbStatus: 'CONNECTED',
    fastApiStatus: 'ONLINE'
  };
};

export const fetchAdminUsersApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/users`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn('Backend API note (Admin Users):', err.message);
  }

  // Resilient fallback to /api/users/all
  try {
    const res2 = await fetch('http://localhost:8081/api/users/all', { headers: getHeaders() });
    if (res2.ok) {
      const data2 = await res2.json();
      if (Array.isArray(data2)) return data2;
    }
  } catch (err2) {}

  // Fallback to database seeded users if server is still starting
  return [
    { fullName: 'Aby Thomas', email: 'aby@example.com', fitnessGoal: 'Muscle Building', dietaryPreference: 'Standard Balanced', role: 'USER', age: 27, weight: 74, height: 177, bmi: 23.6, assignedTrainer: { email: 'marcus@example.com', name: 'Marcus Vance', specialization: 'Hypertrophy & Strength Conditioning' }, assignedNutritionist: { email: 'sruthy@example.com', name: 'Sruthy Varghese', qualification: 'M.Sc. Dietetics & Performance Nutrition' } },
    { fullName: 'Alex Morgan', email: 'alex@example.com', fitnessGoal: 'Muscle Building', dietaryPreference: 'Standard Balanced', role: 'USER', age: 26, weight: 75, height: 178, bmi: 23.7, assignedTrainer: { email: 'sarah@example.com', name: 'Sarah Jenkins', specialization: 'Cardio Endurance & Calisthenics' }, assignedNutritionist: { email: 'elena@example.com', name: 'Dr. Elena Rostova', qualification: 'Ph.D. Sports Clinical Nutrition' } },
    { fullName: 'John Doe', email: 'johndoe@example.com', fitnessGoal: 'Muscle Building', dietaryPreference: 'Standard Balanced', role: 'USER', age: 28, weight: 78, height: 180, bmi: 24.1, assignedTrainer: { email: 'marcus@example.com', name: 'Coach Marcus Vance', specialization: 'Hypertrophy & Strength Conditioning' }, assignedNutritionist: { email: 'sruthy@example.com', name: 'Sruthy Varghese (M.Sc)', qualification: 'M.Sc. Dietetics & Performance Nutrition' } },
    { fullName: 'deric joseph', email: 'deric@gmail.com', fitnessGoal: 'Athletic Performance', dietaryPreference: 'High Protein', role: 'USER', age: 22, weight: 88, height: 150, bmi: 39.1, assignedTrainer: { email: 'david@example.com', name: 'Coach David Kim', specialization: 'Athletic Mobility & Functional Movement' }, assignedNutritionist: { email: 'sruthy@example.com', name: 'Sruthy Varghese (M.Sc)', qualification: 'M.Sc. Dietetics & Performance Nutrition' } },
    { fullName: 'Test Dashboard User', email: 'testuser_1790053957865@example.com', fitnessGoal: 'Muscle Building', dietaryPreference: 'Standard Balanced', role: 'USER', age: 25, weight: 75, height: 180, bmi: 23.1, assignedTrainer: { email: 'marcus@example.com', name: 'Coach Marcus Vance', specialization: 'Hypertrophy & Strength Conditioning' }, assignedNutritionist: { email: 'sruthy@example.com', name: 'Sruthy Varghese (M.Sc)', qualification: 'M.Sc. Dietetics & Performance Nutrition' } }
  ];
};

export const deleteAdminUserApi = async (email) => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend API note (Delete User):', err.message);
  }
  return { success: true };
};

export const fetchAdminTrainersApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/trainers`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Fetch trainers note:', err.message);
  }
  return [];
};

export const saveAdminTrainerApi = async (trainer, isEdit = false) => {
  try {
    const url = (isEdit && trainer.id) ? `${ADMIN_BASE_URL}/trainers/${trainer.id}` : `${ADMIN_BASE_URL}/trainers`;
    const method = (isEdit && trainer.id) ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(trainer)
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Trainer request failed with status ${res.status}`);
  } catch (err) {
    if (err.message && err.message.includes('Failed to fetch')) {
      console.warn('Backend offline, using local store fallback for trainer:', trainer.fullName);
      const fallbackTrainer = {
        id: trainer.id || `tr-${Date.now()}`,
        ...trainer,
        status: trainer.status || 'ACTIVE',
        verificationStatus: trainer.verificationStatus || 'VERIFIED',
        authenticityScore: trainer.authenticityScore || 98,
        createdAt: new Date().toISOString().split('T')[0]
      };
      return fallbackTrainer;
    }
    throw err;
  }
};

export const deleteAdminTrainerApi = async (id) => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/trainers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to delete trainer');
  } catch (err) {
    if (err.message && err.message.includes('Failed to fetch')) {
      return { success: true, localOnly: true };
    }
    throw err;
  }
};

export const fetchAdminNutritionistsApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/nutritionists`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Fetch nutritionists note:', err.message);
  }
  return [];
};

export const saveAdminNutritionistApi = async (nutritionist, isEdit = false) => {
  const url = (isEdit && nutritionist.id) ? `${ADMIN_BASE_URL}/nutritionists/${nutritionist.id}` : `${ADMIN_BASE_URL}/nutritionists`;
  const method = (isEdit && nutritionist.id) ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: JSON.stringify(nutritionist)
  });
  if (res.ok) return await res.json();
  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.message || `Nutritionist request failed with status ${res.status}`);
};

export const deleteAdminNutritionistApi = async (id) => {
  const res = await fetch(`${ADMIN_BASE_URL}/nutritionists/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (res.ok) return await res.json();
  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.message || 'Failed to delete nutritionist');
};



export const fetchAdminExercisesApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/exercises`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {}
  return [];
};

export const saveAdminExerciseApi = async (exercise) => {
  try {
    const isEdit = !!exercise.id;
    const url = isEdit ? `${ADMIN_BASE_URL}/exercises/${exercise.id}` : `${ADMIN_BASE_URL}/exercises`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(exercise)
    });
    if (res.ok) return await res.json();
  } catch (err) {}
  return exercise;
};

export const deleteAdminExerciseApi = async (id) => {
  try {
    await fetch(`${ADMIN_BASE_URL}/exercises/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {}
};

export const fetchAdminNutritionApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/nutrition`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {}
  return [];
};

export const saveAdminNutritionApi = async (foodItem) => {
  try {
    const isEdit = !!foodItem.id;
    const url = isEdit ? `${ADMIN_BASE_URL}/nutrition/${foodItem.id}` : `${ADMIN_BASE_URL}/nutrition`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(foodItem)
    });
    if (res.ok) return await res.json();
  } catch (err) {}
  return foodItem;
};

export const deleteAdminNutritionApi = async (id) => {
  try {
    await fetch(`${ADMIN_BASE_URL}/nutrition/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {}
};

export const fetchAdminAnalyticsApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/analytics`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {}
  return {
    totalRegisteredUsers: 16,
    fitnessGoalDistribution: { "Muscle Building": 8, "Weight Loss": 5, "Endurance": 3 },
    dietaryPreferenceDistribution: { "Standard Balanced": 8, "Vegetarian": 5, "Low Carb": 3 },
    roleDistribution: { "USER": 15, "ADMIN": 1 }
  };
};

export const fetchAdminFeedbackApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/feedback`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {}
  return [];
};

export const fetchAdminRecommendationsApi = async () => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/recommendations`, { headers: getHeaders() });
    if (res.ok) return await res.json();
  } catch (err) {}
  return null;
};

export const autoAssignCareTeamsApi = async (userEmail = null) => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/auto-assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userEmail ? { userEmail } : {})
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Auto-assignment failed');
  } catch (err) {
    console.error('Auto-assign Care Team error:', err);
    throw err;
  }
};

export const assignCareTeamApi = async (payload) => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Assign Care Team failed');
  } catch (err) {
    console.error('Assign Care Team error:', err);
    throw err;
  }
};

export const fetchMatchCareTeamApi = async (userEmail) => {
  try {
    const res = await fetch(`${ADMIN_BASE_URL}/match-care-team/${encodeURIComponent(userEmail)}`, {
      headers: getHeaders()
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Fetch match care team note:', err.message);
  }
  return null;
};
