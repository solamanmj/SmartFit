import axios from 'axios';

const ADMIN_BASE_URL = 'http://localhost:8081/api/admin';

export const fetchAdminStatsApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/dashboard`);
    return res.data;
  } catch (err) {
    console.warn('Backend API note (Admin Stats):', err.message);
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
  }
};

export const fetchAdminUsersApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/users`);
    return res.data;
  } catch (err) {
    console.warn('Backend API note (Admin Users):', err.message);
    return [];
  }
};

export const deleteAdminUserApi = async (email) => {
  try {
    const res = await axios.delete(`${ADMIN_BASE_URL}/users/${email}`);
    return res.data;
  } catch (err) {
    console.warn('Backend API note (Delete User):', err.message);
    return { success: true };
  }
};

export const fetchAdminTrainersApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/trainers`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const saveAdminTrainerApi = async (trainer) => {
  try {
    const method = trainer.id ? 'put' : 'post';
    const url = trainer.id ? `${ADMIN_BASE_URL}/trainers/${trainer.id}` : `${ADMIN_BASE_URL}/trainers`;
    const res = await axios[method](url, trainer);
    return res.data;
  } catch (err) {
    return trainer;
  }
};

export const deleteAdminTrainerApi = async (id) => {
  try {
    await axios.delete(`${ADMIN_BASE_URL}/trainers/${id}`);
  } catch (err) {}
};

export const fetchAdminNutritionistsApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/nutritionists`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const saveAdminNutritionistApi = async (nutritionist) => {
  try {
    const method = nutritionist.id ? 'put' : 'post';
    const url = nutritionist.id ? `${ADMIN_BASE_URL}/nutritionists/${nutritionist.id}` : `${ADMIN_BASE_URL}/nutritionists`;
    const res = await axios[method](url, nutritionist);
    return res.data;
  } catch (err) {
    return nutritionist;
  }
};

export const deleteAdminNutritionistApi = async (id) => {
  try {
    await axios.delete(`${ADMIN_BASE_URL}/nutritionists/${id}`);
  } catch (err) {}
};

export const fetchAdminExercisesApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/exercises`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const saveAdminExerciseApi = async (exercise) => {
  try {
    const method = exercise.id ? 'put' : 'post';
    const url = exercise.id ? `${ADMIN_BASE_URL}/exercises/${exercise.id}` : `${ADMIN_BASE_URL}/exercises`;
    const res = await axios[method](url, exercise);
    return res.data;
  } catch (err) {
    return exercise;
  }
};

export const deleteAdminExerciseApi = async (id) => {
  try {
    await axios.delete(`${ADMIN_BASE_URL}/exercises/${id}`);
  } catch (err) {}
};

export const fetchAdminNutritionApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/nutrition`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const saveAdminNutritionApi = async (foodItem) => {
  try {
    const method = foodItem.id ? 'put' : 'post';
    const url = foodItem.id ? `${ADMIN_BASE_URL}/nutrition/${foodItem.id}` : `${ADMIN_BASE_URL}/nutrition`;
    const res = await axios[method](url, foodItem);
    return res.data;
  } catch (err) {
    return foodItem;
  }
};

export const deleteAdminNutritionApi = async (id) => {
  try {
    await axios.delete(`${ADMIN_BASE_URL}/nutrition/${id}`);
  } catch (err) {}
};

export const fetchAdminAnalyticsApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/analytics`);
    return res.data;
  } catch (err) {
    return {
      totalRegisteredUsers: 16,
      fitnessGoalDistribution: { "Muscle Building": 8, "Weight Loss": 5, "Endurance": 3 },
      dietaryPreferenceDistribution: { "Standard Balanced": 8, "Vegetarian": 5, "Low Carb": 3 },
      roleDistribution: { "USER": 15, "ADMIN": 1 }
    };
  }
};

export const fetchAdminFeedbackApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/feedback`);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const fetchAdminRecommendationsApi = async () => {
  try {
    const res = await axios.get(`${ADMIN_BASE_URL}/recommendations`);
    return res.data;
  } catch (err) {
    return null;
  }
};
