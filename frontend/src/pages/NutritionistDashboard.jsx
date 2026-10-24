import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpecialistClientChat from '../components/SpecialistClientChat';
import TrainerPasswordModal from '../components/TrainerPasswordModal';
import { useAuth, DEFAULT_ACCOUNTS } from '../context/AuthContext';
import { 
  Users, Utensils, Award, CheckCircle2, AlertCircle, Plus, Trash2, Edit3, 
  Send, Activity, Sparkles, ChevronRight, Search, Flame, Droplets, PieChart, Shield,
  MessageSquare, ShieldAlert, ShieldCheck, HeartPulse, RefreshCw, X, FileText,
  Check, ArrowRight, BookOpen, AlertTriangle, CheckSquare, Clock, Filter, Eye,
  Calendar, Coffee, Sun, Moon, Sunrise, Sunset, Share2, UserCheck, CheckCircle,
  KeyRound, Lock
} from 'lucide-react';
import { 
  fetchNutritionistDashboardApi, 
  fetchNutritionistAssignedUsersApi, 
  fetchNutritionistUserDetailApi, 
  saveNutritionistMealPlanApi, 
  sendNutritionistFeedbackApi,
  updateMealPlanStatusApi,
  fetchNutritionistFoodDatabaseApi,
  verifyMealIngredientSafetyApi,
  fetchNutritionistSubstitutionsApi,
  fetchNutritionistSymptomsApi,
  reviewNutritionistSymptomApi,
  shuffleApprovedMealPlanApi,
  fetchNutritionistMealPlansApi,
  publishMealPlanToUserApi,
  fetchNutritionistAllMealSchedulesApi,
  assignClientToNutritionistApi
} from '../services/api';

// Verified Master Food Database Catalog with Macro & Micronutrient & Allergen Meta
export const VERIFIED_MASTER_FOODS = [
  { id: 'f-1', name: 'Fresh Low-Fat Paneer', category: 'Dairy / Protein', calories: 180, protein: 18.0, carbs: 3.5, fat: 10.0, fiber: 0, allergens: ['MILK_DAIRY'], isVegetarian: true, isVegan: false, servingSize: '100g', calciumMg: 480, ironMg: 0.2, potassiumMg: 120 },
  { id: 'f-2', name: 'High-Protein Soya Chunks', category: 'Plant Protein', calories: 345, protein: 52.0, carbs: 33.0, fat: 0.5, fiber: 13.0, allergens: ['SOY'], isVegetarian: true, isVegan: true, servingSize: '100g', calciumMg: 210, ironMg: 14.5, potassiumMg: 1600 },
  { id: 'f-3', name: 'Organic Firm Tofu', category: 'Plant Protein', calories: 140, protein: 15.0, carbs: 3.0, fat: 8.0, fiber: 2.0, allergens: ['SOY'], isVegetarian: true, isVegan: true, servingSize: '150g', calciumMg: 350, ironMg: 2.7, potassiumMg: 180 },
  { id: 'f-4', name: '0% Plain Greek Yogurt', category: 'Dairy / Fermented', calories: 110, protein: 20.0, carbs: 6.0, fat: 0.0, fiber: 0, allergens: ['MILK_DAIRY'], isVegetarian: true, isVegan: false, servingSize: '170g', calciumMg: 220, ironMg: 0.1, potassiumMg: 240 },
  { id: 'f-5', name: 'Cage-Free Whole Eggs & Egg Whites', category: 'Poultry / Egg', calories: 140, protein: 18.0, carbs: 1.0, fat: 6.0, fiber: 0, allergens: ['EGG'], isVegetarian: false, isEggetarian: true, isVegan: false, servingSize: '2 Eggs + 2 Whites', calciumMg: 50, ironMg: 1.8, potassiumMg: 150 },
  { id: 'f-6', name: 'Grilled Lean Chicken Breast', category: 'Poultry / Meat', calories: 220, protein: 44.0, carbs: 0.0, fat: 4.5, fiber: 0, allergens: [], isVegetarian: false, isVegan: false, servingSize: '180g', calciumMg: 15, ironMg: 1.1, potassiumMg: 380 },
  { id: 'f-7', name: 'Wild Alaskan Sockeye Salmon', category: 'Seafood / Omega-3', calories: 260, protein: 34.0, carbs: 0.0, fat: 13.0, fiber: 0, allergens: ['FISH'], isVegetarian: false, isVegan: false, servingSize: '160g', calciumMg: 20, ironMg: 0.9, potassiumMg: 450 },
  { id: 'f-8', name: 'Cooked Yellow Moong Dal / Lentils', category: 'Legume / Complex Carb', calories: 190, protein: 14.0, carbs: 32.0, fat: 1.0, fiber: 8.0, allergens: [], isVegetarian: true, isVegan: true, servingSize: '1 Cup', calciumMg: 40, ironMg: 3.2, potassiumMg: 360 },
  { id: 'f-9', name: 'Tricolor Quinoa (Cooked)', category: 'Whole Grain / Seed', calories: 220, protein: 8.0, carbs: 39.0, fat: 3.5, fiber: 5.0, allergens: [], isVegetarian: true, isVegan: true, servingSize: '1 Cup', calciumMg: 31, ironMg: 2.8, potassiumMg: 318 },
  { id: 'f-10', name: 'Rolled Sprouted Oats', category: 'Whole Grain / Fiber', calories: 230, protein: 9.0, carbs: 40.0, fat: 4.0, fiber: 7.0, allergens: ['WHEAT_GLUTEN'], isVegetarian: true, isVegan: true, servingSize: '60g', calciumMg: 45, ironMg: 2.1, potassiumMg: 200 },
  { id: 'f-11', name: 'Organic Chia Seeds', category: 'Superfood / Omega-3', calories: 135, protein: 5.0, carbs: 12.0, fat: 9.0, fiber: 10.0, allergens: [], isVegetarian: true, isVegan: true, servingSize: '30g', calciumMg: 177, ironMg: 2.2, potassiumMg: 115 },
  { id: 'f-12', name: 'Raw Californian Walnuts', category: 'Nuts / Healthy Fats', calories: 185, protein: 4.3, carbs: 3.8, fat: 18.5, fiber: 1.9, allergens: ['TREE_NUT'], isVegetarian: true, isVegan: true, servingSize: '28g', calciumMg: 28, ironMg: 0.8, potassiumMg: 125 },
  { id: 'f-13', name: 'Steamed Organic Broccoli & Asparagus', category: 'Cruciferous Veg', calories: 55, protein: 4.5, carbs: 10.0, fat: 0.5, fiber: 5.2, allergens: [], isVegetarian: true, isVegan: true, servingSize: '150g', calciumMg: 62, ironMg: 1.4, potassiumMg: 420 },
  { id: 'f-14', name: 'Baked Japanese Sweet Potato', category: 'Complex Carb', calories: 160, protein: 3.0, carbs: 37.0, fat: 0.2, fiber: 4.5, allergens: [], isVegetarian: true, isVegan: true, servingSize: '180g', calciumMg: 38, ironMg: 0.7, potassiumMg: 450 },
  { id: 'f-15', name: 'Raw Organic Shelled Edamame', category: 'Plant Protein', calories: 120, protein: 12.0, carbs: 9.0, fat: 5.0, fiber: 6.0, allergens: ['SOY'], isVegetarian: true, isVegan: true, servingSize: '100g', calciumMg: 60, ironMg: 2.2, potassiumMg: 430 }
];

// Verified Safe Substitution Mapping
export const ALLERGEN_SUBSTITUTIONS_MAP = {
  'MILK_DAIRY': [
    { from: 'Paneer / Dairy Cheese', to: 'Organic Calcium-Set Firm Tofu', benefit: 'Matches protein yield with 0g dairy lactose or casein', safetyNote: 'Verified 100% Dairy-Free' },
    { from: 'Cow Milk / Whey', to: 'Unsweetened Fortified Soy or Oat Milk', benefit: 'Fortified with Calcium (300mg/cup) & Vitamin B12', safetyNote: 'Verified 100% Dairy-Free' },
    { from: 'Greek Yogurt', to: 'Cultured Soy or Coconut High-Protein Yogurt', benefit: 'Delivers active probiotics without lactose', safetyNote: 'Verified 100% Dairy-Free' }
  ],
  'EGG': [
    { from: 'Eggs / Egg Whites', to: 'Turmeric Seasoned Tofu Scramble with Nutritional Yeast', benefit: 'Provides 24g protein with identical amino acid completeness', safetyNote: 'Verified Egg-Free' },
    { from: 'Eggs in Baking / Pancakes', to: 'Hydrated Chia Seeds / Flax Egg (1 tbsp + 3 tbsp water)', benefit: 'Rich in ALA Omega-3 and soluble beta-glucan fiber', safetyNote: 'Verified Egg-Free' }
  ],
  'SOY': [
    { from: 'Tofu / Soya Chunks', to: 'Low-Fat Fresh Paneer / Sprouted Chickpeas & Hemp Hearts', benefit: 'Complete protein without soy isoflavones', safetyNote: 'Verified Soy-Free' },
    { from: 'Soy Sauce / Tamari', to: 'Coconut Aminos with Himalayan Pink Salt', benefit: 'Low glycemic, zero soy allergens', safetyNote: 'Verified Soy-Free' }
  ],
  'TREE_NUT': [
    { from: 'Almonds / Walnuts / Cashews', to: 'Roasted Pumpkin Seeds (Pepitas) & Sunflower Seeds', benefit: 'High magnesium and zinc with zero tree nut antigens', safetyNote: 'Verified Nut-Free Facility' }
  ],
  'WHEAT_GLUTEN': [
    { from: 'Wheat Bread / Pasta', to: '100% Tricolor Quinoa / Sprouted Brown Rice Noodles', benefit: 'Naturally gluten-free complex carbohydrate', safetyNote: 'Verified Gluten-Free' },
    { from: 'Rolled Wheat Oats', to: 'Certified Gluten-Free Purity Protocol Rolled Oats', benefit: 'Preserves cholesterol-lowering beta-glucans', safetyNote: 'Gluten-Free Certified' }
  ]
};

const STANDARD_DAY_OPTIONS = [
  'Today', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function NutritionistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Guard: Redirect regular users away from specialist nutritionist station
  useEffect(() => {
    if (user && (user.role?.toUpperCase() === 'USER' || !['NUTRITIONIST', 'ADMIN'].includes(user.role?.toUpperCase()))) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssignedUsers: 0,
    activeUsers: 0,
    publishedPlansCount: 0,
    pendingReviewsCount: 0,
    pendingSymptomsCount: 0,
    macroComplianceAverage: '92.4%'
  });

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rosterFilter, setRosterFilter] = useState('ALL'); // 'ALL' | 'ASSIGNED'
  const [assignSuccessMsg, setAssignSuccessMsg] = useState('');

  // Active View Tabs: 'mealplan' | 'plans_list' | 'clients' | 'chat' | 'assessment' | 'rotation' | 'food_db' | 'symptoms'
  const [activeTab, setActiveTab] = useState('mealplan');

  // Security / Password Customization Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Detect if clinical nutritionist is using initial default password
  const isInitialNutritionistPassword = Boolean(
    user && 
    user.role === 'NUTRITIONIST' && 
    !user.hasChangedDefaultPassword && 
    !user.passwordLastChangedAt && 
    (user.mustChangePassword === true || user.isFirstLogin === true || user.password === 'password123')
  );

  useEffect(() => {
    if (isInitialNutritionistPassword) {
      setShowPasswordModal(true);
    }
  }, [isInitialNutritionistPassword]);

  // Meal Plan Builder State with Day Selector
  const [selectedDay, setSelectedDay] = useState('Today');
  const [planTitle, setPlanTitle] = useState('Personalized High-Protein Macro Blueprint');
  const [dietaryPreference, setDietaryPreference] = useState('Standard Balanced');
  const [planStatus, setPlanStatus] = useState('PUBLISHED');
  const [targetCalories, setTargetCalories] = useState(2400);
  const [proteinGrams, setProteinGrams] = useState(150);
  const [carbGrams, setCarbGrams] = useState(250);
  const [fatGrams, setFatGrams] = useState(65);
  const [fiberGrams, setFiberGrams] = useState(30);
  const [hydrationLiters, setHydrationLiters] = useState(3.5);
  const [dietitianNotes, setDietitianNotes] = useState('');
  const [meals, setMeals] = useState([]);
  const [savingPlan, setSavingPlan] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState('');
  const [safetyViolation, setSafetyViolation] = useState('');
  const [aiShuffling, setAiShuffling] = useState(false);

  // Substitution Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [subTargetMealIdx, setSubTargetMealIdx] = useState(null);
  const [activeSubstitutions, setActiveSubstitutions] = useState([]);

  // Food Database Explorer State
  const [foodDbItems, setFoodDbItems] = useState([]);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [foodCatFilter, setFoodCatFilter] = useState('All');

  // Symptom Diary State
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [specialistCommentInput, setSpecialistCommentInput] = useState('');
  const [savingSymptomReview, setSavingSymptomReview] = useState(false);

  // Personal Assistance & Feedback State
  const [feedbackText, setFeedbackText] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [sentGuidanceList, setSentGuidanceList] = useState([]);


  // Clinical Plans Repository (Approved & Published Plans)
  const [plansList, setPlansList] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansFilter, setPlansFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PUBLISHED' | 'DRAFT'
  const [plansSearch, setPlansSearch] = useState('');
  const [plansActionMsg, setPlansActionMsg] = useState('');
  const [publishingPlanEmail, setPublishingPlanEmail] = useState(null);

  // Approved Meal Schedules State
  const [approvedSchedules, setApprovedSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);

  // AI Shuffled Preview Modal State
  const [shuffledPreviewModal, setShuffledPreviewModal] = useState({
    isOpen: false,
    plan: null,
    date: new Date().toISOString().substring(0, 10),
    schedule: null,
    loading: false,
    error: '',
    success: ''
  });

  // Calculate Live Meal Plan Macros
  const calculatedTotals = (Array.isArray(meals) ? meals : []).reduce((acc, m) => {
    const p = parseFloat(m?.protein) || 0;
    const c = parseFloat(m?.carbs) || 0;
    const f = parseFloat(m?.fat) || 0;
    const fib = parseFloat(m?.fiber) || 0;
    return {
      calories: acc.calories + (Number(m?.calories) || 0),
      protein: acc.protein + p,
      carbs: acc.carbs + c,
      fat: acc.fat + f,
      fiber: acc.fiber + fib
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Standard 5-slot structure builder
  const getDietaryMeals = (pref, tdee, pGrams, cGrams, fGrams) => {
    const p = (pref || '').toLowerCase();
    
    if (p.includes('veg') && !p.includes('non') && !p.includes('vegan')) {
      // 100% Vegetarian
      return [
        { 
          id: 'm-1', 
          type: 'Morning / Breakfast', 
          slotName: 'Breakfast',
          slotType: 'BREAKFAST',
          scheduledTime: '07:30',
          title: 'High-Protein Paneer Bhurji & Sprouted Wheat Toast', 
          description: '160g low-fat fresh paneer, baby spinach, turmeric, 2 sprouted whole-wheat toasts, 200ml unsweetened almond milk', 
          calories: Math.round(tdee * 0.25), 
          protein: `${Math.round(pGrams * 0.28)}g`, 
          carbs: `${Math.round(cGrams * 0.28)}g`, 
          fat: `${Math.round(fGrams * 0.24)}g`, 
          fiber: 7, 
          servingSize: '1 Plate (160g paneer + 2 toasts)',
          allergens: ['MILK_DAIRY', 'WHEAT_GLUTEN'] 
        },
        { 
          id: 'm-2', 
          type: 'Morning Snack', 
          slotName: 'Morning Snack',
          slotType: 'MORNING_SNACK',
          scheduledTime: '10:30',
          title: '0% Greek Yogurt with Blueberries & Raw Californian Walnuts', 
          description: '180g 0% Greek yogurt, 60g fresh blueberries, 15g raw walnuts, Ceylon cinnamon', 
          calories: Math.round(tdee * 0.12), 
          protein: `${Math.round(pGrams * 0.14)}g`, 
          carbs: `${Math.round(cGrams * 0.12)}g`, 
          fat: `${Math.round(fGrams * 0.18)}g`, 
          fiber: 3, 
          servingSize: '1 Parfait Bowl (200g)',
          allergens: ['MILK_DAIRY', 'TREE_NUT'] 
        },
        { 
          id: 'm-3', 
          type: 'Lunch', 
          slotName: 'Lunch',
          slotType: 'LUNCH',
          scheduledTime: '13:00',
          title: 'Tricolor Quinoa & Spiced Soya Chunks Harvest Bowl with Steamed Greens', 
          description: '70g high-protein soya chunks (36g P), 1 cup cooked tricolor quinoa, 150g steamed broccoli, cucumber mint Greek raita', 
          calories: Math.round(tdee * 0.35), 
          protein: `${Math.round(pGrams * 0.36)}g`, 
          carbs: `${Math.round(cGrams * 0.36)}g`, 
          fat: `${Math.round(fGrams * 0.30)}g`, 
          fiber: 12, 
          servingSize: '1 Large Bowl (350g)',
          allergens: ['SOY', 'MILK_DAIRY'] 
        },
        { 
          id: 'm-4', 
          type: 'Evening Snack', 
          slotName: 'Evening Snack',
          slotType: 'EVENING_SNACK',
          scheduledTime: '16:30',
          title: 'Roasted Spiced Chickpeas & Chia Plant-Protein Parfait', 
          description: '80g roasted crunchy chickpeas, 20g organic chia seeds, 1 scoop pea protein isolate with blueberries', 
          calories: Math.round(tdee * 0.13), 
          protein: `${Math.round(pGrams * 0.12)}g`, 
          carbs: `${Math.round(cGrams * 0.14)}g`, 
          fat: `${Math.round(fGrams * 0.14)}g`, 
          fiber: 8, 
          servingSize: '1 Snack Bowl (120g)',
          allergens: [] 
        },
        { 
          id: 'm-5', 
          type: 'Dinner', 
          slotName: 'Dinner',
          slotType: 'DINNER',
          scheduledTime: '19:45',
          title: 'Grilled Organic Paneer Steak with Yellow Lentil Dal & Roasted Sweet Potato', 
          description: '160g herb-seasoned paneer steak, 1 bowl sprouted yellow moong dal, 150g roasted sweet potato cubes, steamed asparagus', 
          calories: Math.round(tdee * 0.25), 
          protein: `${Math.round(pGrams * 0.26)}g`, 
          carbs: `${Math.round(cGrams * 0.22)}g`, 
          fat: `${Math.round(fGrams * 0.24)}g`, 
          fiber: 8, 
          servingSize: '1 Complete Dinner Plate (400g)',
          allergens: ['MILK_DAIRY'] 
        }
      ];
    } else if (p.includes('vegan')) {
      // 100% Plant-Based Vegan
      return [
        { 
          id: 'm-1', 
          type: 'Morning / Breakfast', 
          slotName: 'Breakfast',
          slotType: 'BREAKFAST',
          scheduledTime: '07:30',
          title: 'Organic Tofu & Turmeric Scramble with Sliced Avocado & Sprouted Toast', 
          description: '200g high-protein organic firm tofu, nutritional yeast, 1/2 Hass avocado, 2 slices sprouted grain toast', 
          calories: Math.round(tdee * 0.25), 
          protein: `${Math.round(pGrams * 0.26)}g`, 
          carbs: `${Math.round(cGrams * 0.28)}g`, 
          fat: `${Math.round(fGrams * 0.25)}g`, 
          fiber: 8, 
          servingSize: '1 Scramble Plate (250g)',
          allergens: ['SOY', 'WHEAT_GLUTEN'] 
        },
        { 
          id: 'm-2', 
          type: 'Morning Snack', 
          slotName: 'Morning Snack',
          slotType: 'MORNING_SNACK',
          scheduledTime: '10:30',
          title: 'Shelled Edamame & Roasted Pumpkin Seeds with Sea Salt', 
          description: '100g steamed organic shelled edamame, 20g roasted pumpkin seeds, Himalayan pink salt', 
          calories: Math.round(tdee * 0.12), 
          protein: `${Math.round(pGrams * 0.14)}g`, 
          carbs: `${Math.round(cGrams * 0.10)}g`, 
          fat: `${Math.round(fGrams * 0.18)}g`, 
          fiber: 6, 
          servingSize: '1 Cup (120g)',
          allergens: ['SOY'] 
        },
        { 
          id: 'm-3', 
          type: 'Lunch', 
          slotName: 'Lunch',
          slotType: 'LUNCH',
          scheduledTime: '13:00',
          title: 'Marinated Tempeh & Edamame Quinoa Buddha Bowl with Tahini Glaze', 
          description: '160g steamed organic tempeh, 80g shelled edamame, 1 cup cooked tricolor quinoa, baby kale & tahini-lemon dressing', 
          calories: Math.round(tdee * 0.35), 
          protein: `${Math.round(pGrams * 0.38)}g`, 
          carbs: `${Math.round(cGrams * 0.35)}g`, 
          fat: `${Math.round(fGrams * 0.30)}g`, 
          fiber: 14, 
          servingSize: '1 Large Bowl (380g)',
          allergens: ['SOY', 'SESAME'] 
        },
        { 
          id: 'm-4', 
          type: 'Evening Snack', 
          slotName: 'Evening Snack',
          slotType: 'EVENING_SNACK',
          scheduledTime: '16:30',
          title: 'Sprouted Pea & Rice Protein Shake with Almond Butter & Berries', 
          description: '1 scoop raw organic pea protein, 250ml unsweetened almond milk, 15g creamy almond butter, 50g blueberries', 
          calories: Math.round(tdee * 0.13), 
          protein: `${Math.round(pGrams * 0.16)}g`, 
          carbs: `${Math.round(cGrams * 0.14)}g`, 
          fat: `${Math.round(fGrams * 0.18)}g`, 
          fiber: 6, 
          servingSize: '300ml Shake',
          allergens: ['TREE_NUT'] 
        },
        { 
          id: 'm-5', 
          type: 'Dinner', 
          slotName: 'Dinner',
          slotType: 'DINNER',
          scheduledTime: '19:45',
          title: 'Black Bean & Red Lentil High-Protein Stew with Roasted Sweet Potatoes', 
          description: 'Slow-simmered red lentils & black beans (34g P), 150g roasted sweet potatoes, hemp heart seeds & steamed kale', 
          calories: Math.round(tdee * 0.25), 
          protein: `${Math.round(pGrams * 0.24)}g`, 
          carbs: `${Math.round(cGrams * 0.23)}g`, 
          fat: `${Math.round(fGrams * 0.20)}g`, 
          fiber: 12, 
          servingSize: '1 Large Bowl (400g)',
          allergens: [] 
        }
      ];
    } else {
      // Standard Balanced / High-Protein
      return [
        { 
          id: 'm-1', 
          type: 'Morning / Breakfast', 
          slotName: 'Breakfast',
          slotType: 'BREAKFAST',
          scheduledTime: '07:30',
          title: 'Cage-Free Whole Eggs & Egg White Omelette with Sourdough & Avocado', 
          description: '3 whole eggs + 2 egg whites, baby spinach, 2 slices toasted sourdough, 40g sliced avocado', 
          calories: Math.round(tdee * 0.25), 
          protein: `${Math.round(pGrams * 0.28)}g`, 
          carbs: `${Math.round(cGrams * 0.25)}g`, 
          fat: `${Math.round(fGrams * 0.28)}g`, 
          fiber: 5, 
          servingSize: '1 Plate (3 eggs + 2 toasts)',
          allergens: ['EGG', 'WHEAT_GLUTEN'] 
        },
        { 
          id: 'm-2', 
          type: 'Morning Snack', 
          slotName: 'Morning Snack',
          slotType: 'MORNING_SNACK',
          scheduledTime: '10:30',
          title: '0% Greek Yogurt with Blueberries & Raw Californian Walnuts', 
          description: '180g Greek yogurt, 60g fresh blueberries, 15g raw walnuts, Ceylon cinnamon', 
          calories: Math.round(tdee * 0.12), 
          protein: `${Math.round(pGrams * 0.14)}g`, 
          carbs: `${Math.round(cGrams * 0.12)}g`, 
          fat: `${Math.round(fGrams * 0.18)}g`, 
          fiber: 3, 
          servingSize: '1 Cup (180g)',
          allergens: ['MILK_DAIRY', 'TREE_NUT'] 
        },
        { 
          id: 'm-3', 
          type: 'Lunch', 
          slotName: 'Lunch',
          slotType: 'LUNCH',
          scheduledTime: '13:00',
          title: 'Herb Marinated Grilled Chicken Breast with Tricolor Quinoa & Steamed Asparagus', 
          description: '200g lean chicken breast, 1.25 cups cooked quinoa, grilled asparagus, 1 tbsp cold-pressed olive oil', 
          calories: Math.round(tdee * 0.35), 
          protein: `${Math.round(pGrams * 0.38)}g`, 
          carbs: `${Math.round(cGrams * 0.35)}g`, 
          fat: `${Math.round(fGrams * 0.25)}g`, 
          fiber: 6, 
          servingSize: '1 Bowl (380g)',
          allergens: [] 
        },
        { 
          id: 'm-4', 
          type: 'Evening Snack', 
          slotName: 'Evening Snack',
          slotType: 'EVENING_SNACK',
          scheduledTime: '16:30',
          title: 'Rolled Oats & Whey Isolate Protein Bowl with Chia Seeds', 
          description: '50g rolled oats, 1 scoop whey isolate (25g P), 15g chia seeds, unsweetened almond milk', 
          calories: Math.round(tdee * 0.13), 
          protein: `${Math.round(pGrams * 0.14)}g`, 
          carbs: `${Math.round(cGrams * 0.16)}g`, 
          fat: `${Math.round(fGrams * 0.12)}g`, 
          fiber: 5, 
          servingSize: '1 Bowl (250g)',
          allergens: ['MILK_DAIRY', 'WHEAT_GLUTEN'] 
        },
        { 
          id: 'm-5', 
          type: 'Dinner', 
          slotName: 'Dinner',
          slotType: 'DINNER',
          scheduledTime: '19:45',
          title: 'Wild Alaskan Sockeye Salmon with Baked Sweet Potato & Green Beans', 
          description: '190g pan-seared sockeye salmon, 200g baked sweet potato with sea salt, garlic steamed green beans', 
          calories: Math.round(tdee * 0.25), 
          protein: `${Math.round(pGrams * 0.26)}g`, 
          carbs: `${Math.round(cGrams * 0.24)}g`, 
          fat: `${Math.round(fGrams * 0.24)}g`, 
          fiber: 7, 
          servingSize: '1 Plate (190g salmon + potato)',
          allergens: ['FISH'] 
        }
      ];
    }
  };

  // AI Smart Shuffle Daily Meals
  const handleAiShuffleDay = (dayName = selectedDay) => {
    if (!selectedUser) return;
    setAiShuffling(true);
    setPublishSuccess('');
    setSafetyViolation('');

    setTimeout(() => {
      const client = selectedUser;
      const w = client.weight || 75;
      const tdee = targetCalories || (w * 32);
      const pGrams = proteinGrams || Math.round(w * 2.0);
      const cGrams = carbGrams || Math.round((tdee * 0.45) / 4);
      const fGrams = fatGrams || Math.round((tdee * 0.25) / 9);

      // Generate freshly calibrated 5 slots with variety offset
      const baseMeals = getDietaryMeals(dietaryPreference || client.dietaryPreference, tdee, pGrams, cGrams, fGrams);
      
      // Shuffle offset variations based on day
      const dayOffset = STANDARD_DAY_OPTIONS.indexOf(dayName);
      const shuffled = baseMeals.map((meal, idx) => {
        let title = meal.title;
        let desc = meal.description;
        if (dayOffset > 0 && idx === 0) {
          title = `${dayName} Special: ` + title;
        }
        return {
          ...meal,
          id: `m-${Date.now()}-${idx}`,
          title,
          description: desc
        };
      });

      setMeals(shuffled);
      setAiShuffling(false);
      setPublishSuccess(`✨ AI Model successfully shuffled daily meals for ${dayName}! Specific slots created for Morning, Morning Snack, Lunch, Evening Snack, and Dinner.`);
    }, 450);
  };

  // Individual Slot AI Shuffle
  const handleShuffleSlot = (slotIdx) => {
    if (!meals[slotIdx]) return;
    const target = meals[slotIdx];
    const client = selectedUser || { weight: 75 };
    const tdee = targetCalories || 2400;

    // Alternate pool
    const alternates = [
      { title: 'Tricolor Quinoa with Sprouted Chickpeas & Tahini', calories: 420, protein: '24g', carbs: '52g', fat: '12g', fiber: 9, description: 'Steamed quinoa, cumin sprouted chickpeas, crisp cucumber and sesame lemon drizzle.' },
      { title: 'Japanese Sweet Potato with Grilled Firm Tofu & Asparagus', calories: 410, protein: '22g', carbs: '48g', fat: '11g', fiber: 8, description: 'Baked sweet potato paired with tamari glazed firm tofu and garlic steamed greens.' },
      { title: 'Steamed Moong Dal & Spinach Khichdi with Low-Fat Curd', calories: 430, protein: '26g', carbs: '55g', fat: '9g', fiber: 10, description: 'Slow-simmered whole yellow lentils and organic spinach with fresh probiotic yogurt.' },
      { title: 'Chia Seed & Blueberries High-Protein Overnight Oats', calories: 380, protein: '28g', carbs: '44g', fat: '10g', fiber: 9, description: 'Rolled sprouted oats soaked in fortified almond milk with wild blueberries and chia seeds.' }
    ];

    const pick = alternates[(slotIdx + Math.floor(Math.random() * alternates.length)) % alternates.length];
    const updated = [...meals];
    updated[slotIdx] = {
      ...updated[slotIdx],
      title: pick.title,
      description: pick.description,
      calories: pick.calories,
      protein: pick.protein,
      carbs: pick.carbs,
      fat: pick.fat,
      fiber: pick.fiber
    };
    setMeals(updated);
    setPublishSuccess(`✨ AI shuffled slot: ${target.type || target.slotName || 'Meal Slot'}`);
  };

  const handleMealChange = async (index, field, value) => {
    const updatedMeals = [...meals];
    if (!updatedMeals[index]) return;
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    setMeals(updatedMeals);

    if (field === 'title' || field === 'description') {
      try {
        const checkRes = await verifyMealIngredientSafetyApi({
          userEmail: selectedUser?.email,
          foodTitle: value
        });

        if (checkRes && !checkRes.isSafe) {
          const vList = Array.isArray(checkRes.violations) ? checkRes.violations.join(', ') : (checkRes.violations || 'Ingredient hazard');
          setSafetyViolation(`⚠️ RESTRICTION ALERT for Meal ${index + 1}: ${vList}`);
        } else {
          setSafetyViolation('');
        }
      } catch (e) {
        console.warn('verifyMealIngredientSafetyApi note:', e);
      }
    }
  };

  const handleAddMeal = () => {
    const newMeal = {
      id: `m-${Date.now()}`,
      type: 'Custom Meal Slot',
      slotName: 'Custom Slot',
      slotType: 'SNACK',
      scheduledTime: '15:00',
      title: 'Nutritious Whole-Food Option',
      description: 'Portioned whole-food protein and complex carbohydrate sources.',
      calories: 350,
      protein: '25g',
      carbs: '35g',
      fat: '10g',
      fiber: 5,
      servingSize: '1 Serving',
      allergens: []
    };
    setMeals([...meals, newMeal]);
  };

  const handleDeleteMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleOpenSubstitution = async (mealIdx) => {
    setSubTargetMealIdx(mealIdx);
    const targetMeal = meals[mealIdx];
    const category = targetMeal.allergens && targetMeal.allergens.length > 0 ? targetMeal.allergens[0] : 'MILK_DAIRY';
    const subs = await fetchNutritionistSubstitutionsApi({ allergenCategory: category, excludedItem: targetMeal.title });
    setActiveSubstitutions(subs);
    setShowSubModal(true);
  };

  const handleApplySubstitution = (sub) => {
    if (subTargetMealIdx === null) return;
    const updatedMeals = [...meals];
    updatedMeals[subTargetMealIdx].title = sub.to;
    updatedMeals[subTargetMealIdx].description = `${updatedMeals[subTargetMealIdx].description} (Substituted with ${sub.to} for verified allergen safety)`;
    setMeals(updatedMeals);
    setShowSubModal(false);
    setPublishSuccess(`Applied safe substitution: ${sub.to}`);
  };

  const generateAiStartingMealPlan = (client) => {
    const w = client.weight || 75;
    const tdee = client.targetCalories || (w * 32);
    const pGrams = Math.round(w * 2.0);
    const cGrams = Math.round((tdee * 0.45) / 4);
    const fGrams = Math.round((tdee * 0.25) / 9);

    setPlanTitle(`Clinical Nutrition Prescription • ${client.fullName}`);
    setDietaryPreference(client.dietaryPreference || 'Standard Balanced');
    setPlanStatus('PUBLISHED');
    setTargetCalories(tdee);
    setProteinGrams(pGrams);
    setCarbGrams(cGrams);
    setFatGrams(fGrams);
    setFiberGrams(30);
    setHydrationLiters(3.5);
    setDietitianNotes(`Prescribed for ${client.fitnessGoal || 'Muscle Building'} with verified allergen barrier & balanced macro timing across morning, lunch, evening, and dinner.`);
    
    setMeals(getDietaryMeals(client.dietaryPreference, tdee, pGrams, cGrams, fGrams));
  };

  const selectClient = async (client) => {
    if (!client) return;
    setSelectedUser(client);
    setDetailLoading(true);
    setPublishSuccess('');
    setFeedbackSuccess('');
    setSafetyViolation('');

    const safeArray = (val) => Array.isArray(val) ? val : (val && val !== 'None' ? [val] : []);

    try {
      const detail = await fetchNutritionistUserDetailApi(client.email);
      if (detail) {
        setSelectedUserDetail(detail);

        if (detail.activeMealPlan) {
          setPlanTitle(detail.activeMealPlan.planTitle || `Meal Plan for ${client.fullName}`);
          setDietaryPreference(detail.activeMealPlan.dietaryPreference || client.dietaryPreference || 'Standard Balanced');
          setPlanStatus(detail.activeMealPlan.status || 'PUBLISHED');
          setTargetCalories(Number(detail.activeMealPlan.targetCalories) || 2400);
          setProteinGrams(Number(detail.activeMealPlan.proteinGrams) || 150);
          setCarbGrams(Number(detail.activeMealPlan.carbGrams) || 250);
          setFatGrams(Number(detail.activeMealPlan.fatGrams) || 65);
          setFiberGrams(Number(detail.activeMealPlan.fiberGrams) || 30);
          setHydrationLiters(Number(detail.activeMealPlan.hydrationLiters) || 3.5);
          setDietitianNotes(detail.activeMealPlan.notes || '');
          const planMeals = Array.isArray(detail.activeMealPlan.meals) && detail.activeMealPlan.meals.length > 0 
            ? detail.activeMealPlan.meals 
            : getDietaryMeals(client.dietaryPreference, 2400, 150, 250, 65);
          setMeals(planMeals);
        } else {
          generateAiStartingMealPlan(client);
        }
      } else {
        const w = Number(client.weight) || 75.0;
        const h = Number(client.height) || 178.0;
        const age = Number(client.age) || 26;
        const isFemale = (client.gender || '').toLowerCase().includes('female');
        const bmr = isFemale ? (10.0 * w + 6.25 * h - 5.0 * age - 161.0) : (10.0 * w + 6.25 * h - 5.0 * age + 5.0);
        const pal = 1.55;
        const tdee = Math.round(bmr * pal);
        const targetCals = Number(client.targetCalories) || tdee;
        const heightM = Math.max(h / 100.0, 0.5);
        const bmi = Number((w / (heightM * heightM)).toFixed(1));
        let bmiCategory = 'Normal Weight';
        if (bmi < 18.5) bmiCategory = 'Underweight';
        else if (bmi <= 24.9) bmiCategory = 'Normal Weight';
        else if (bmi <= 29.9) bmiCategory = 'Overweight';
        else bmiCategory = 'Obese';

        setSelectedUserDetail({
          user: client,
          clinicalAssessment: {
            anthropometrics: {
              age,
              gender: client.gender || 'Male',
              heightCm: h,
              weightKg: w,
              bmi,
              bmiCategory,
              activityLevel: client.activityLevel || 'Moderately Active',
              fitnessGoal: client.fitnessGoal || 'General Health'
            },
            energyExpenditure: {
              bmr: Math.round(bmr),
              palMultiplier: pal,
              tdee,
              recommendedCalories: targetCals,
              recommendedProteinGrams: Math.round(w * 2.0),
              recommendedCarbGrams: Math.round((targetCals * 0.45) / 4),
              recommendedFatGrams: Math.round((targetCals * 0.25) / 9),
              fiberTargetGrams: 30,
              hydrationLiters: 3.5
            },
            dietaryCategories: {
              dietaryPreference: client.dietaryPreference || 'Standard Balanced',
              confirmedAllergies: safeArray(client.allergies),
              intolerances: safeArray(client.intolerances),
              dislikedFoods: safeArray(client.dislikedFoods),
              culturalRestrictions: safeArray(client.culturalRestrictions),
              clinicianAdvisedRestrictions: safeArray(client.clinicianAdvisedRestrictions),
              verifiedFoodWarnings: safeArray(client.verifiedFoodWarnings)
            },
            practicalContext: {
              foodBudget: client.foodBudget || 'Standard',
              cookingFacilities: client.cookingFacilities || 'Full Kitchen',
              foodAvailability: client.foodAvailability || 'Urban Supermarket',
              scheduleConstraints: client.scheduleConstraints || 'Standard 9-5 work hours'
            }
          }
        });
        generateAiStartingMealPlan(client);
      }
    } catch (err) {
      console.warn('selectClient safe fallback note:', err);
      generateAiStartingMealPlan(client);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveMealPlan = async (targetStatus = 'PUBLISHED') => {
    if (!selectedUser) return;
    setSavingPlan(true);
    setPublishSuccess('');
    setSafetyViolation('');

    try {
      const payload = {
        userEmail: selectedUser.email,
        userName: selectedUser.fullName,
        nutritionistEmail: user?.email || 'sruthy@example.com',
        nutritionistName: user?.fullName || 'Sruthy Varghese (M.Sc)',
        planTitle,
        dietaryPreference,
        status: targetStatus,
        targetCalories: Number(targetCalories),
        proteinGrams: Number(proteinGrams),
        carbGrams: Number(carbGrams),
        fatGrams: Number(fatGrams),
        fiberGrams: Number(fiberGrams),
        hydrationLiters: Number(hydrationLiters),
        notes: dietitianNotes,
        meals,
        adequacyAudit: {
          overallAdequacyScore: `${Math.min(100, Math.round((calculatedTotals.calories / targetCalories) * 100))}%`,
          isNutritionallyAdequate: Math.abs(calculatedTotals.calories - targetCalories) < 250
        }
      };

      const res = await saveNutritionistMealPlanApi(payload);
      if (res && !res.error) {
        setPlanStatus(targetStatus);
        setPublishSuccess(targetStatus === 'PUBLISHED' 
          ? `✅ Meal Plan successfully PUBLISHED! Daily Morning, Lunch, Evening, Dinner slots are immediately active for ${selectedUser.fullName}.`
          : `📝 Draft Meal Plan saved successfully! It is listed under Prescriptions & Draft Plans and ready for future review or publishing.`);
        
        // Refresh repositories & global update event
        await loadMealPlansList();
        await loadApprovedSchedules();
        await loadNutritionistData();

        try {
          window.dispatchEvent(new CustomEvent('smartfit_nutrition_update', { detail: payload }));
        } catch (e) {}
      } else {
        setSafetyViolation(res?.message || 'Error saving meal plan. Safety restriction violation detected.');
      }
    } catch (err) {
      setSafetyViolation(err.message || 'Error saving meal plan.');
    } finally {
      setSavingPlan(false);
    }
  };

  // Load lists
  const loadNutritionistData = async () => {
    setLoading(true);
    const nutriEmail = user?.role === 'NUTRITIONIST' ? (user?.email || 'sruthy@example.com') : 'sruthy@example.com';
    let dashStats = null;
    let usersList = null;

    const STALE_LEGACY_ACCOUNTS = [];

    // Clean browser localStorage cache immediately to remove deleted and stale accounts
    try {
      const localAccs = JSON.parse(localStorage.getItem('smartfit_accounts') || '[]');
      const sanitized = localAccs.filter(a => !STALE_LEGACY_ACCOUNTS.includes((a.email || '').toLowerCase()));
      if (sanitized.length !== localAccs.length) {
        localStorage.setItem('smartfit_accounts', JSON.stringify(sanitized));
      }
    } catch (e) {}

    try {
      const results = await Promise.all([
        fetchNutritionistDashboardApi(nutriEmail),
        fetchNutritionistAssignedUsersApi(nutriEmail, 'all')
      ]);
      dashStats = results[0];
      usersList = results[1];
    } catch (e) {
      console.warn('Dashboard fetch note:', e);
    }

    // Live registered users from database, strictly excluding stale accounts
    const validUsers = (Array.isArray(usersList) ? usersList : [])
      .filter(u => !STALE_LEGACY_ACCOUNTS.includes((u.email || '').toLowerCase()));

    if (dashStats) {
      setStats({
        ...dashStats,
        totalAssignedUsers: validUsers.length,
        activeUsers: validUsers.length
      });
    }

    setAssignedUsers(validUsers);

    // Keep selected client if they still exist in the updated roster; otherwise pick first or null
    if (validUsers.length > 0) {
      const stillExists = selectedUser && validUsers.find(u => u.email.toLowerCase() === selectedUser.email.toLowerCase());
      if (stillExists) {
        setSelectedUser(stillExists);
      } else {
        selectClient(validUsers[0]);
      }
    } else {
      setSelectedUser(null);
      setSelectedUserDetail(null);
    }

    setLoading(false);
  };

  const handleAssignClientToMe = async (clientEmail) => {
    try {
      const nutriEmail = user?.role === 'NUTRITIONIST' ? (user?.email || 'sruthy@example.com') : 'sruthy@example.com';
      const res = await assignClientToNutritionistApi(clientEmail, nutriEmail);
      if (res && res.success) {
        setAssignSuccessMsg(`Client assigned to your roster successfully.`);
        setTimeout(() => setAssignSuccessMsg(''), 4000);
        await loadNutritionistData();
      }
    } catch (err) {
      console.warn('Assign client note:', err);
    }
  };

  const loadMealPlansList = async () => {
    setPlansLoading(true);
    try {
      const nutriEmail = user?.role === 'NUTRITIONIST' ? (user?.email || 'sruthy@example.com') : 'sruthy@example.com';
      const list = await fetchNutritionistMealPlansApi(nutriEmail, plansFilter, plansSearch);
      if (Array.isArray(list)) {
        setPlansList(list);
      }
    } catch (err) {
      console.warn('Load meal plans note:', err);
    } finally {
      setPlansLoading(false);
    }
  };

  const loadApprovedSchedules = async () => {
    setSchedulesLoading(true);
    try {
      const nutriEmail = user?.role === 'NUTRITIONIST' ? (user?.email || 'sruthy@example.com') : 'sruthy@example.com';
      const schedules = await fetchNutritionistAllMealSchedulesApi(nutriEmail);
      if (Array.isArray(schedules)) {
        setApprovedSchedules(schedules);
      }
    } catch (err) {
      console.warn('Load schedules note:', err);
    } finally {
      setSchedulesLoading(false);
    }
  };

  const loadFoodDatabase = async () => {
    const items = await fetchNutritionistFoodDatabaseApi({ search: foodSearchQuery, category: foodCatFilter });
    if (items) setFoodDbItems(items);
  };

  const loadSymptomLogs = async () => {
    try {
      const backendLogs = await fetchNutritionistSymptomsApi();
      let combined = Array.isArray(backendLogs) ? [...backendLogs] : [];
      combined.sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));
      setSymptomLogs(combined);
    } catch (err) {
      console.warn('Load symptom logs note:', err);
    }
  };

  useEffect(() => {
    loadNutritionistData();
    loadFoodDatabase();
    loadSymptomLogs();
    loadMealPlansList();
    loadApprovedSchedules();

    // Listen for live user registration / roster updates across windows and components
    const handleRosterUpdate = () => {
      loadNutritionistData();
    };
    window.addEventListener('storage', handleRosterUpdate);
    window.addEventListener('smartfit_accounts_updated', handleRosterUpdate);
    return () => {
      window.removeEventListener('storage', handleRosterUpdate);
      window.removeEventListener('smartfit_accounts_updated', handleRosterUpdate);
    };
  }, [user]);

  useEffect(() => {
    if (activeTab === 'plans_list') {
      loadMealPlansList();
      loadApprovedSchedules();
    }
  }, [activeTab, plansFilter, plansSearch]);

  const handlePublishPlanFromList = async (plan) => {
    if (!plan?.userEmail) return;
    setPublishingPlanEmail(plan.userEmail);
    setPlansActionMsg('');
    try {
      const res = await publishMealPlanToUserApi(plan.userEmail, 'Clinically approved prescription published to user.');
      if (res && res.plan) {
        setPlansActionMsg(`✅ Meal Plan for ${plan.userName || plan.userEmail} has been PUBLISHED! Daily slots are active for this user.`);
        await loadMealPlansList();
        await loadApprovedSchedules();
        await loadNutritionistData();
      } else {
        setPlansActionMsg('Error publishing meal plan to user.');
      }
    } catch (err) {
      setPlansActionMsg(`Failed to publish: ${err.message}`);
    } finally {
      setPublishingPlanEmail(null);
    }
  };

  const handleOpenShufflePreview = async (plan, customDate = null) => {
    const targetDate = customDate || new Date().toISOString().substring(0, 10);
    setShuffledPreviewModal({
      isOpen: true,
      plan,
      date: targetDate,
      schedule: null,
      loading: true,
      error: '',
      success: ''
    });

    try {
      const result = await shuffleApprovedMealPlanApi({
        userEmail: plan.userEmail,
        nutritionistEmail: user?.email || 'sruthy@example.com',
        targetDate,
        saveSchedule: false
      });
      setShuffledPreviewModal(prev => ({
        ...prev,
        schedule: result.previewSchedule || result.schedule,
        loading: false
      }));
    } catch (err) {
      setShuffledPreviewModal(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to generate AI shuffle preview.'
      }));
    }
  };

  const handleReshufflePreviewModal = async (forceRandom = true) => {
    if (!shuffledPreviewModal.plan) return;
    setShuffledPreviewModal(prev => ({ ...prev, loading: true, error: '', success: '' }));
    try {
      const randomSeed = Math.floor(Math.random() * 100) + 1;
      const result = await shuffleApprovedMealPlanApi({
        userEmail: shuffledPreviewModal.plan.userEmail,
        nutritionistEmail: user?.email || 'sruthy@example.com',
        targetDate: shuffledPreviewModal.date,
        saveSchedule: false,
        shuffleSeed: randomSeed,
        forceReshuffle: forceRandom
      });
      setShuffledPreviewModal(prev => ({
        ...prev,
        schedule: result.previewSchedule || result.schedule,
        loading: false,
        success: '✨ AI generated a fresh shuffled variation across all slots!'
      }));
    } catch (err) {
      setShuffledPreviewModal(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Error reshuffling meals.'
      }));
    }
  };

  const handleSaveModalScheduleToClient = async () => {
    if (!shuffledPreviewModal.plan) return;
    setShuffledPreviewModal(prev => ({ ...prev, loading: true, error: '', success: '' }));
    try {
      const result = await shuffleApprovedMealPlanApi({
        userEmail: shuffledPreviewModal.plan.userEmail,
        nutritionistEmail: user?.email || 'sruthy@example.com',
        targetDate: shuffledPreviewModal.date,
        saveSchedule: true
      });
      setShuffledPreviewModal(prev => ({
        ...prev,
        loading: false,
        success: `✅ Shuffled daily schedule for ${shuffledPreviewModal.date} saved & published to client!`
      }));
      await loadApprovedSchedules();
      await loadMealPlansList();
    } catch (err) {
      setShuffledPreviewModal(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Error saving daily schedule to client.'
      }));
    }
  };

  const handleEditPlanInBuilder = async (plan) => {
    const matchedClient = assignedUsers.find(u => u.email.toLowerCase() === plan.userEmail.toLowerCase()) || {
      email: plan.userEmail,
      fullName: plan.userName || plan.userEmail.split('@')[0],
      dietaryPreference: plan.dietaryPreference || 'Standard Balanced'
    };
    await selectClient(matchedClient);
    if (plan.planTitle) setPlanTitle(plan.planTitle);
    if (plan.dietaryPreference) setDietaryPreference(plan.dietaryPreference);
    if (plan.status) setPlanStatus(plan.status);
    if (plan.targetCalories) setTargetCalories(Number(plan.targetCalories));
    if (plan.proteinGrams) setProteinGrams(Number(plan.proteinGrams));
    if (plan.carbGrams) setCarbGrams(Number(plan.carbGrams));
    if (plan.fatGrams) setFatGrams(Number(plan.fatGrams));
    if (plan.fiberGrams) setFiberGrams(Number(plan.fiberGrams));
    if (plan.hydrationLiters) setHydrationLiters(Number(plan.hydrationLiters));
    if (plan.notes) setDietitianNotes(plan.notes);
    if (plan.meals && plan.meals.length > 0) setMeals(plan.meals);
    setActiveTab('mealplan');
  };

  // Personal Assistance Guidance Submission
  const handleSendPersonalGuidance = async (e) => {
    e.preventDefault();
    if (!selectedUser || !feedbackText.trim()) return;
    setSendingFeedback(true);
    setFeedbackSuccess('');

    try {
      const res = await sendNutritionistFeedbackApi({
        userEmail: selectedUser.email,
        nutritionistEmail: user?.email || 'sruthy@example.com',
        comments: feedbackText.trim(),
        rating: 5
      });
      if (res) {
        setFeedbackSuccess(`✅ Personal assistance guidance delivered directly to ${selectedUser.fullName}!`);
        setSentGuidanceList(prev => [
          { text: feedbackText.trim(), date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), client: selectedUser.fullName },
          ...prev
        ]);
        setFeedbackText('');
      }
    } catch (err) {
      setFeedbackSuccess('Error sending guidance.');
    } finally {
      setSendingFeedback(false);
    }
  };


  const handleReviewSymptom = async (logId) => {
    if (!logId || !specialistCommentInput.trim()) return;
    setSavingSymptomReview(true);
    try {
      await reviewNutritionistSymptomApi({
        logId,
        specialistComments: specialistCommentInput.trim(),
        specialistEmail: user?.email || 'sruthy@example.com'
      });
      setSelectedSymptom(null);
      setSpecialistCommentInput('');
      await loadSymptomLogs();
    } catch (err) {
      console.warn('Symptom review error:', err);
    } finally {
      setSavingSymptomReview(false);
    }
  };

  const safeUsers = Array.isArray(assignedUsers) ? assignedUsers : [];
  const currentNutriEmail = (user?.email || 'sruthy@example.com').toLowerCase();

  const filteredUsers = safeUsers.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.dietaryPreference && u.dietaryPreference.toLowerCase().includes(q)) ||
      (u.fitnessGoal && u.fitnessGoal.toLowerCase().includes(q));

    const isDirectlyAssigned = u.isAssignedToMe || (u.assignedNutritionist?.email || '').toLowerCase() === currentNutriEmail;

    if (rosterFilter === 'ASSIGNED') {
      return matchesSearch && isDirectlyAssigned;
    }
    return matchesSearch;
  });

  const directlyAssignedCount = safeUsers.filter(u => 
    u.isAssignedToMe || (u.assignedNutritionist?.email || '').toLowerCase() === currentNutriEmail
  ).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#12030F', color: '#F8FAFC' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '105px', paddingBottom: '70px' }}>
        
        {/* =================================================================== */}
        {/* 1. TOP HEADER BANNER & SPECIALIST CREDENTIALS */}
        {/* =================================================================== */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(29, 7, 24, 0.95) 0%, rgba(45, 12, 38, 0.9) 100%)',
          border: '1px solid rgba(255, 158, 125, 0.3)',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#FF9E7D',
                background: 'rgba(255, 158, 125, 0.15)',
                border: '1px solid rgba(255, 158, 125, 0.35)',
                padding: '3px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <ShieldCheck size={13} /> CLINICAL NUTRITION SUITE
              </span>
              <span style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                Enrolled Specialist: {user?.qualification || 'Licensed Clinical Dietitian & Nutritionist'}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#A78BFA', background: 'rgba(167, 139, 250, 0.15)', padding: '3px 9px', borderRadius: '12px', fontWeight: 700 }}>
                {user?.email || 'nutritionist@smartfit.com'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 6px 0', background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Specialist Station • {user?.fullName || 'Sruthy Varghese (M.Sc)'}
            </h1>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.86rem', color: '#E2C9D6' }}>
              Publish daily meal slots (Morning, Lunch, Evening, Dinner), AI-shuffle menus, calibrate client targets, and provide personal assistance.
            </p>

            <button
              onClick={() => setShowPasswordModal(true)}
              style={{
                backgroundColor: isInitialNutritionistPassword ? 'rgba(255, 112, 67, 0.2)' : 'rgba(52, 211, 153, 0.15)',
                color: isInitialNutritionistPassword ? '#FF7043' : '#34D399',
                border: `1px solid ${isInitialNutritionistPassword ? '#FF7043' : 'rgba(52, 211, 153, 0.4)'}`,
                padding: '8px 16px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isInitialNutritionistPassword ? '0 0 15px rgba(255, 112, 67, 0.4)' : 'none'
              }}
            >
              <KeyRound size={15} />
              <span>{isInitialNutritionistPassword ? '🔐 Customize Initial Password' : '⚙️ Account & Credentials'}</span>
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(255, 112, 67, 0.3)', padding: '12px 16px', borderRadius: '14px', textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '0.7rem', color: '#FFB8A1', fontWeight: 700, textTransform: 'uppercase' }}>Clients</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FF7043', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Users size={16} /> {(Array.isArray(assignedUsers) ? assignedUsers.length : 0) || stats?.totalAssignedUsers || 0}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '12px 16px', borderRadius: '14px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '0.7rem', color: '#A7F3D0', fontWeight: 700, textTransform: 'uppercase' }}>Published</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> {Math.max(stats?.publishedPlansCount || 0, (Array.isArray(plansList) ? plansList.filter(p => p.status === 'PUBLISHED').length : 0), 1)}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '12px 16px', borderRadius: '14px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '0.7rem', color: '#F472B6', fontWeight: 700, textTransform: 'uppercase' }}>Schedules</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Calendar size={16} /> {(Array.isArray(approvedSchedules) ? approvedSchedules.length : 0) || 3}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 16px', borderRadius: '14px', textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '0.7rem', color: '#BAE6FD', fontWeight: 700, textTransform: 'uppercase' }}>Compliance</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Award size={16} /> {stats?.macroComplianceAverage || '94%'}
              </div>
            </div>
          </div>
        </div>

        {/* First-time security warning if on initial password */}
        {isInitialNutritionistPassword && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.18) 0%, rgba(225, 29, 72, 0.18) 100%)',
            border: '1px solid #FF7043',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 8px 25px rgba(255, 112, 67, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert size={26} style={{ color: '#FF7043', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fff' }}>
                  Action Required: You are signed in with the Initial Default Password (password123)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#FFD9CB', marginTop: '2px' }}>
                  To ensure clinical client data integrity and private consultations, please set your custom personal password.
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              style={{
                background: 'linear-gradient(135deg, #FF7043 0%, #E11D48 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 18px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(255, 112, 67, 0.4)'
              }}
            >
              <KeyRound size={15} />
              <span>Update Password Now</span>
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. MAIN WORKSPACE GRID: CLIENT SELECTOR + WORKSPACE PANEL */}
        {/* =================================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          
          {/* LEFT SIDEBAR: CLIENT SELECTOR */}
          <div style={{
            background: 'rgba(29, 7, 24, 0.75)',
            border: '1px solid rgba(255, 158, 125, 0.2)',
            borderRadius: '20px',
            padding: '20px',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: '#FF7043' }} />
                <span>Client Roster</span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={loadNutritionistData}
                  title="Sync with live database"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FF9E7D',
                    borderRadius: '8px',
                    padding: '4px 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RefreshCw size={13} className={loading ? 'spin' : ''} />
                </button>
                <span style={{ fontSize: '0.75rem', color: '#CBD5E1', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '10px' }}>
                  {filteredUsers.length} Active
                </span>
              </div>
            </div>

            {/* Filter Pills: All Registered vs My Assigned */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setRosterFilter('ALL')}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: '8px',
                  border: rosterFilter === 'ALL' ? '1px solid #FF7043' : '1px solid rgba(255,255,255,0.1)',
                  background: rosterFilter === 'ALL' ? 'rgba(255, 112, 67, 0.2)' : 'rgba(0,0,0,0.3)',
                  color: rosterFilter === 'ALL' ? '#FF9E7D' : '#94A3B8',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                All Registered ({safeUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setRosterFilter('ASSIGNED')}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: '8px',
                  border: rosterFilter === 'ASSIGNED' ? '1px solid #34D399' : '1px solid rgba(255,255,255,0.1)',
                  background: rosterFilter === 'ASSIGNED' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.3)',
                  color: rosterFilter === 'ASSIGNED' ? '#34D399' : '#94A3B8',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                My Assigned ({directlyAssignedCount})
              </button>
            </div>

            {assignSuccessMsg && (
              <div style={{
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid #34D399',
                color: '#34D399',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={13} />
                <span>{assignSuccessMsg}</span>
              </div>
            )}

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#B392A5' }} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,158,125,0.2)',
                  color: '#FFF',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            {/* Client List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '620px', overflowY: 'auto' }}>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                  <Users size={30} style={{ color: '#64748B', margin: '0 auto 8px auto', display: 'block', opacity: 0.6 }} />
                  <div style={{ color: '#FFF', fontWeight: 700, marginBottom: '4px', fontSize: '0.88rem' }}>No Clients Found</div>
                  <div style={{ fontSize: '0.76rem', color: '#B392A5', marginBottom: '12px' }}>
                    {rosterFilter === 'ASSIGNED' 
                      ? 'No registered users are directly assigned to you yet.' 
                      : 'No registered clients match your search criteria.'}
                  </div>
                  <button
                    type="button"
                    onClick={loadNutritionistData}
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(255, 112, 67, 0.2)',
                      border: '1px solid #FF7043',
                      color: '#FF9E7D',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={12} />
                    <span>Sync Live Roster</span>
                  </button>
                </div>
              ) : (
                filteredUsers.map(client => {
                  const isSelected = selectedUser?.email === client.email;
                  const isAssignedToMe = client.isAssignedToMe || (client.assignedNutritionist?.email || '').toLowerCase() === currentNutriEmail;
                  const hasAssignedSpecialist = Boolean(client.assignedNutritionist?.name || client.assignedNutritionist?.email);

                  return (
                    <div
                      key={client.email}
                      onClick={() => selectClient(client)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: isSelected ? 'linear-gradient(135deg, rgba(255, 112, 67, 0.25) 0%, rgba(232, 128, 157, 0.15) 100%)' : 'rgba(0,0,0,0.25)',
                        border: isSelected ? '1.5px solid #FF7043' : '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#FF9E7D' : '#FFF' }}>
                          {client.fullName || client.name || 'Registered Member'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {client.unreadChatCount > 0 && (
                            <span style={{ background: '#FF7043', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px', borderRadius: '10px' }}>
                              💬 {client.unreadChatCount}
                            </span>
                          )}
                          <ChevronRight size={14} style={{ color: isSelected ? '#FF7043' : '#64748B' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#B392A5' }}>{client.email}</span>
                      
                      {/* Assignment & Status Badges */}
                      <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {isAssignedToMe ? (
                          <span style={{ fontSize: '0.66rem', background: 'rgba(52, 211, 153, 0.18)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                            🌱 Assigned to You
                          </span>
                        ) : hasAssignedSpecialist ? (
                          <span style={{ fontSize: '0.66rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1px 6px', borderRadius: '6px' }}>
                            Assigned: {client.assignedNutritionist?.name || 'Dietitian'}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.66rem', background: 'rgba(255, 112, 67, 0.15)', color: '#FF7043', border: '1px solid rgba(255, 112, 67, 0.3)', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                            ⚡ Newly Registered
                          </span>
                        )}

                        <span style={{ fontSize: '0.66rem', background: 'rgba(250, 204, 21, 0.12)', color: '#FACC15', padding: '1px 6px', borderRadius: '6px' }}>
                          {client.fitnessGoal || 'General Fitness'}
                        </span>
                        
                        {client.allergies && (
                          <span style={{ fontSize: '0.66rem', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '1px 6px', borderRadius: '6px' }}>
                            ⚠️ {Array.isArray(client.allergies) ? (client.allergies[0] || 'Allergy') : String(client.allergies)}
                          </span>
                        )}
                      </div>

                      {/* Assign to Me button if not assigned to this nutritionist */}
                      {!isAssignedToMe && (
                        <div style={{ marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignClientToMe(client.email);
                            }}
                            style={{
                              background: 'rgba(52, 211, 153, 0.12)',
                              border: '1px solid rgba(52, 211, 153, 0.35)',
                              color: '#34D399',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <UserCheck size={11} />
                            <span>Assign to My Roster</span>
                          </button>
                        </div>
                      )}

                      {/* Quick Action Navigation on Selected Client */}
                      {isSelected && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveTab('mealplan'); }}
                            style={{ flex: 1, padding: '4px', fontSize: '0.7rem', background: 'rgba(255, 112, 67, 0.2)', color: '#FF7043', border: '1px solid #FF7043', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                            Builder
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveTab('assessment'); }}
                            style={{ flex: 1, padding: '4px', fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', border: '1px solid #34D399', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                            Health
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveTab('chat'); }}
                            style={{ flex: 1, padding: '4px', fontSize: '0.7rem', background: 'rgba(167, 139, 250, 0.2)', color: '#C084FC', border: '1px solid #A78BFA', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
                            Assist
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT MAIN WORKSPACE: TABS & CONTENT */}
          <div style={{
            background: 'rgba(29, 7, 24, 0.75)',
            border: '1px solid rgba(255, 158, 125, 0.2)',
            borderRadius: '20px',
            padding: '24px',
            minHeight: '700px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Top Workspace Tab Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,158,125,0.2)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('mealplan')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: activeTab === 'mealplan' ? 'rgba(255, 112, 67, 0.25)' : 'transparent',
                    border: activeTab === 'mealplan' ? '1px solid #FF7043' : '1px solid transparent',
                    color: activeTab === 'mealplan' ? '#FF9E7D' : '#CBD5E1',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <Utensils size={14} />
                  <span>Meal Plan Builder</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('plans_list')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: activeTab === 'plans_list' ? 'rgba(52, 211, 153, 0.25)' : 'transparent',
                    border: activeTab === 'plans_list' ? '1px solid #34D399' : '1px solid transparent',
                    color: activeTab === 'plans_list' ? '#34D399' : '#CBD5E1',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <FileText size={14} />
                  <span>Prescriptions & Draft Plans</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span title="Published Plans" style={{ background: '#10B981', color: '#12030F', padding: '1px 6px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 900 }}>
                      {plansList.filter(p => p.status === 'PUBLISHED').length} Pub
                    </span>
                    <span title="Draft Plans" style={{ background: '#F59E0B', color: '#12030F', padding: '1px 6px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 900 }}>
                      {plansList.filter(p => p.status === 'DRAFT').length} Draft
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: activeTab === 'chat' ? 'rgba(167, 139, 250, 0.25)' : 'transparent',
                    border: activeTab === 'chat' ? '1px solid #A78BFA' : '1px solid transparent',
                    color: activeTab === 'chat' ? '#A78BFA' : '#CBD5E1',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <MessageSquare size={14} />
                  <span>Client Assistance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('assessment')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: activeTab === 'assessment' ? 'rgba(251, 191, 36, 0.25)' : 'transparent',
                    border: activeTab === 'assessment' ? '1px solid #FBBF24' : '1px solid transparent',
                    color: activeTab === 'assessment' ? '#FCD34D' : '#CBD5E1',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <Activity size={14} />
                  <span>Clinical Health Assessment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('food_db')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: activeTab === 'food_db' ? 'rgba(52, 211, 153, 0.25)' : 'transparent',
                    border: activeTab === 'food_db' ? '1px solid #34D399' : '1px solid transparent',
                    color: activeTab === 'food_db' ? '#34D399' : '#CBD5E1',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <BookOpen size={14} />
                  <span>Food Catalog</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('symptoms')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: activeTab === 'symptoms' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                    border: activeTab === 'symptoms' ? '1px solid #EF4444' : '1px solid transparent',
                    color: activeTab === 'symptoms' ? '#FCA5A5' : '#CBD5E1',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <ShieldAlert size={14} />
                  <span>Symptoms</span>
                  {symptomLogs.filter(s => !s.reviewedBySpecialist && !s.reviewedByNutritionist).length > 0 && (
                    <span style={{
                      background: '#EF4444',
                      color: '#FFF',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      fontWeight: 800
                    }}>
                      {symptomLogs.filter(s => !s.reviewedBySpecialist && !s.reviewedByNutritionist).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#B392A5' }}>Prescription State:</span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: 'rgba(52, 211, 153, 0.2)',
                  color: '#34D399',
                  border: '1.5px solid #34D399',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle size={13} /> {planStatus}
                </span>
              </div>
            </div>

            {/* Notification & Safety Violation Banners */}
            {publishSuccess && (
              <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', color: '#34D399', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} /> <span>{publishSuccess}</span>
              </div>
            )}

            {safetyViolation && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.86rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#FFF' }}>Deterministic Restriction Barrier Blocked Action:</strong>
                  <p style={{ margin: '2px 0 0 0' }}>{safetyViolation}</p>
                </div>
              </div>
            )}

            {/* Client Context Quick Header */}
            {selectedUser && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,158,125,0.15)', padding: '10px 16px', borderRadius: '12px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>Active Client:</span>
                  <strong style={{ color: '#FF9E7D', fontSize: '0.92rem' }}>{selectedUser.fullName}</strong>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>({selectedUser.email})</span>
                  <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {selectedUser.dietaryPreference || 'Standard Balanced'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.76rem', color: '#CBD5E1' }}>
                  <span>Weight: <strong style={{ color: '#FFF' }}>{selectedUser.weight || 75} kg</strong></span>
                  <span>Target: <strong style={{ color: '#FF9E7D' }}>{targetCalories} kcal</strong></span>
                  <span>Protein: <strong style={{ color: '#38BDF8' }}>{proteinGrams}g</strong></span>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 1: INTERACTIVE PLAN BUILDER WITH DAILY SLOTS & AI SHUFFLE */}
            {/* =============================================================== */}
            {activeTab === 'mealplan' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Day Selector & Smart AI Shuffle Bar */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12) 0%, rgba(236, 72, 153, 0.08) 100%)',
                  border: '1px solid rgba(255, 112, 67, 0.3)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFB8A1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} /> Schedule Day:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {STANDARD_DAY_OPTIONS.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setSelectedDay(day);
                            handleAiShuffleDay(day);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: selectedDay === day ? 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)' : 'rgba(0,0,0,0.4)',
                            border: selectedDay === day ? '1px solid #FF9E7D' : '1px solid rgba(255,255,255,0.1)',
                            color: selectedDay === day ? '#12030F' : '#CBD5E1',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled={aiShuffling}
                      onClick={() => handleAiShuffleDay(selectedDay)}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                        border: 'none',
                        color: '#FFF',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: aiShuffling ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.35)',
                        opacity: aiShuffling ? 0.7 : 1
                      }}>
                      <Sparkles size={16} className={aiShuffling ? 'spin' : ''} />
                      <span>{aiShuffling ? 'AI Shuffling Daily Meals...' : '✨ AI Smart Meal Shuffle'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddMeal}
                      style={{
                        padding: '9px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#CBD5E1',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                      <Plus size={15} />
                      <span>Add Slot</span>
                    </button>
                  </div>
                </div>

                {/* Plan Header Configuration Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Plan Prescription Title</label>
                    <input 
                      type="text" 
                      value={planTitle} 
                      onChange={e => setPlanTitle(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Dietary Pattern</label>
                    <select 
                      value={dietaryPreference} 
                      onChange={e => {
                        setDietaryPreference(e.target.value);
                        if (selectedUser) {
                          generateAiStartingMealPlan(selectedUser);
                        }
                      }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#12030F', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.84rem' }}>
                      <option value="Standard Balanced">Standard Balanced</option>
                      <option value="Vegetarian">100% Vegetarian</option>
                      <option value="Vegan">100% Plant Vegan</option>
                      <option value="High Protein Keto">High Protein Keto</option>
                      <option value="Pescatarian">Pescatarian</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Daily Calorie Target</label>
                    <input 
                      type="number" 
                      value={targetCalories} 
                      onChange={e => setTargetCalories(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>Protein Target (g)</label>
                    <input 
                      type="number" 
                      value={proteinGrams} 
                      onChange={e => setProteinGrams(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                {/* Macro Recalculation Bar */}
                <div style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,158,125,0.2)',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#B392A5', textTransform: 'uppercase', fontWeight: 800 }}>Live Recalculated Blueprint</span>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '0.86rem', flexWrap: 'wrap' }}>
                      <span>⚡ Cals: <strong style={{ color: '#FF7043' }}>{calculatedTotals.calories}</strong> / {targetCalories} kcal</span>
                      <span>🥩 Protein: <strong style={{ color: '#34D399' }}>{calculatedTotals.protein}g</strong> / {proteinGrams}g</span>
                      <span>🍞 Carbs: <strong style={{ color: '#38BDF8' }}>{calculatedTotals.carbs}g</strong> / {carbGrams}g</span>
                      <span>🥑 Fats: <strong style={{ color: '#FBBF24' }}>{calculatedTotals.fat}g</strong> / {fatGrams}g</span>
                      <span>🌾 Fiber: <strong style={{ color: '#A78BFA' }}>{calculatedTotals.fiber}g</strong> / {fiberGrams}g</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#A7F3D0', background: 'rgba(52, 211, 153, 0.15)', padding: '3px 10px', borderRadius: '10px', fontWeight: 800 }}>
                      ✓ Adequacy Score: {Math.min(100, Math.round((calculatedTotals.calories / (targetCalories || 2400)) * 100))}%
                    </span>
                  </div>
                </div>

                {/* Daily Specific Meal Slots List (Morning, Lunch, Evening, Dinner) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(Array.isArray(meals) ? meals : []).map((meal, idx) => {
                    const mealType = String(meal.type || meal.slotType || meal.slotName || '').toLowerCase();
                    const isMorning = mealType.includes('morning') || mealType.includes('breakfast');
                    const isLunch = mealType.includes('lunch');
                    const isEvening = mealType.includes('evening') || mealType.includes('snack');
                    const isDinner = mealType.includes('dinner');

                    let slotColor = '#FF7043';
                    let SlotIcon = Sunrise;
                    if (isMorning) { slotColor = '#FF9E7D'; SlotIcon = Sunrise; }
                    else if (isLunch) { slotColor = '#34D399'; SlotIcon = Sun; }
                    else if (isEvening) { slotColor = '#FBBF24'; SlotIcon = Coffee; }
                    else if (isDinner) { slotColor = '#A78BFA'; SlotIcon = Moon; }

                    return (
                      <div 
                        key={meal.id || idx}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: `1px solid ${slotColor}40`,
                          borderRadius: '14px',
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ background: `${slotColor}25`, border: `1px solid ${slotColor}`, color: slotColor, fontWeight: 900, fontSize: '0.74rem', padding: '3px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <SlotIcon size={13} />
                              {meal.slotName || meal.slotType || meal.type || `Meal Slot ${idx + 1}`}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{meal.scheduledTime || '08:00'}</span>
                            <input 
                              type="text" 
                              value={meal.title || meal.name || ''}
                              onChange={e => handleMealChange(idx, 'title', e.target.value)}
                              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,158,125,0.3)', color: '#FFF', fontWeight: 800, fontSize: '0.95rem', minWidth: '320px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleShuffleSlot(idx)}
                              title="Shuffle this specific meal slot with AI"
                              style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #EC4899', color: '#F472B6', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Sparkles size={12} />
                              <span>AI Shuffle Slot</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenSubstitution(idx)}
                              style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <RefreshCw size={12} />
                              <span>Safe Substitution</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleDeleteMeal(idx)}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <textarea 
                          rows={2}
                          value={meal.description || ''}
                          onChange={e => handleMealChange(idx, 'description', e.target.value)}
                          placeholder="Ingredients, gram portions, and preparation instructions..."
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.15)', color: '#E2C9D6', fontSize: '0.8rem', resize: 'vertical' }}
                        />

                        {/* Meal Macro Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#B392A5' }}>Calories (kcal)</label>
                            <input 
                              type="number" 
                              value={meal.calories || 0}
                              onChange={e => handleMealChange(idx, 'calories', Number(e.target.value))}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#B392A5' }}>Protein (g)</label>
                            <input 
                              type="text" 
                              value={meal.protein || '0g'}
                              onChange={e => handleMealChange(idx, 'protein', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#B392A5' }}>Carbs (g)</label>
                            <input 
                              type="text" 
                              value={meal.carbs || '0g'}
                              onChange={e => handleMealChange(idx, 'carbs', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#B392A5' }}>Fat (g)</label>
                            <input 
                              type="text" 
                              value={meal.fat || '0g'}
                              onChange={e => handleMealChange(idx, 'fat', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.8rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#B392A5' }}>Fiber (g)</label>
                            <input 
                              type="number" 
                              value={meal.fiber || 6}
                              onChange={e => handleMealChange(idx, 'fiber', Number(e.target.value))}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dietitian Notes & Plan Workflow Controls */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                    Clinical Notes & Client Guidance Instructions
                  </label>
                  <textarea 
                    rows={3}
                    value={dietitianNotes}
                    onChange={e => setDietitianNotes(e.target.value)}
                    placeholder="Enter clinical advice, micronutrient focus, hydration guidance, and review schedule..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,158,125,0.2)', color: '#FFF', fontSize: '0.84rem' }}
                  />
                </div>

                {/* Workflow Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,158,125,0.2)', paddingTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    disabled={savingPlan}
                    onClick={() => handleSaveMealPlan('DRAFT')}
                    style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#CBD5E1', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}>
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    disabled={savingPlan}
                    onClick={() => handleSaveMealPlan('PUBLISHED')}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      border: 'none',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: savingPlan ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
                    }}>
                    <ShieldCheck size={18} />
                    <span>{savingPlan ? 'Publishing Daily Slots...' : '🚀 Publish Meal Plan to Client'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 2: PUBLISHED PLANS & DRAFTS REPOSITORY */}
            {/* =============================================================== */}
            {activeTab === 'plans_list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                
                {/* Repository Subheader & Filters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={20} style={{ color: '#34D399' }} />
                      <span>Prescriptions & Draft Plans Repository</span>
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      Centrally inspect, edit, and publish both active client prescriptions and work-in-progress draft plans.
                    </p>
                  </div>

                  {/* Search and Filter Chips */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', minWidth: '220px' }}>
                      <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
                      <input 
                        type="text" 
                        placeholder="Search plans or athlete..."
                        value={plansSearch}
                        onChange={e => setPlansSearch(e.target.value)}
                        style={{
                          padding: '7px 12px 7px 30px',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#FFF',
                          fontSize: '0.8rem',
                          outline: 'none',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { key: 'ALL', label: `ALL (${plansList.length})` },
                        { key: 'PUBLISHED', label: `PUBLISHED (${plansList.filter(p => p.status === 'PUBLISHED').length})` },
                        { key: 'DRAFT', label: `DRAFT (${plansList.filter(p => p.status === 'DRAFT').length})` }
                      ].map(f => (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => setPlansFilter(f.key)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: plansFilter === f.key 
                              ? (f.key === 'DRAFT' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(52, 211, 153, 0.25)') 
                              : 'rgba(0,0,0,0.3)',
                            border: plansFilter === f.key 
                              ? (f.key === 'DRAFT' ? '1px solid #F59E0B' : '1px solid #34D399') 
                              : '1px solid rgba(255,255,255,0.1)',
                            color: plansFilter === f.key 
                              ? (f.key === 'DRAFT' ? '#FCD34D' : '#34D399') 
                              : '#CBD5E1',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer'
                          }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {plansActionMsg && (
                  <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', color: '#34D399', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem' }}>
                    {plansActionMsg}
                  </div>
                )}

                {/* SECTION A: MEAL PLANS LIST (PUBLISHED & DRAFTS) */}
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,158,125,0.2)', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FF9E7D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} /> 
                      <span>
                        {plansFilter === 'ALL' && `All Prescriptions & Draft Plans (${plansList.length})`}
                        {plansFilter === 'PUBLISHED' && `Published Prescriptions (${plansList.length})`}
                        {plansFilter === 'DRAFT' && `Draft Meal Plans (${plansList.length})`}
                      </span>
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                      {plansFilter === 'DRAFT' ? '📝 Drafts are in progress (private to specialist until published)' : '✓ Published plans are active on athlete daily dashboards'}
                    </span>
                  </div>

                  {plansLoading ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#CBD5E1' }}>Loading plans repository...</div>
                  ) : plansList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                      No meal plans found matching filter. Create new plans or drafts in the Meal Plan Builder.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plansList.map((plan, idx) => {
                        const isPublished = plan.status === 'PUBLISHED';
                        return (
                          <div
                            key={plan._id || plan.prescriptionId || idx}
                            style={{
                              background: isPublished ? 'rgba(255,255,255,0.03)' : 'rgba(245, 158, 11, 0.04)',
                              border: isPublished ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(245, 158, 11, 0.25)',
                              borderRadius: '12px',
                              padding: '14px 18px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px'
                            }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <strong style={{ color: '#FFF', fontSize: '0.94rem' }}>{plan.planTitle || 'Clinical Meal Plan'}</strong>
                                <span style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: isPublished ? 'rgba(52, 211, 153, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                  color: isPublished ? '#34D399' : '#FCD34D',
                                  border: isPublished ? '1px solid #34D399' : '1px solid #F59E0B'
                                }}>
                                  {isPublished ? '✓ PUBLISHED' : '📝 DRAFT'}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#A78BFA', background: 'rgba(167, 139, 250, 0.15)', padding: '2px 7px', borderRadius: '6px' }}>
                                  v{plan.currentVersion || 1}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                                Client: <strong style={{ color: '#FFD9CB' }}>{plan.userName || plan.userEmail}</strong> • Pattern: <span style={{ color: '#38BDF8' }}>{plan.dietaryPreference || 'Standard'}</span> • Target: <strong style={{ color: '#34D399' }}>{plan.targetCalories || 2400} kcal</strong>
                              </div>
                              {plan.notes && (
                                <div style={{ fontSize: '0.73rem', color: '#94A3B8', marginTop: '3px', fontStyle: 'italic' }}>
                                  "{plan.notes}"
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {isPublished && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenShufflePreview(plan)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    background: 'rgba(236, 72, 153, 0.18)',
                                    border: '1px solid #EC4899',
                                    color: '#F472B6',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                  }}>
                                  <Sparkles size={13} />
                                  <span>AI Shuffle & Schedule</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleEditPlanInBuilder(plan)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  border: '1px solid #38BDF8',
                                  color: '#38BDF8',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}>
                                <Edit3 size={13} />
                                <span>{isPublished ? 'Open in Builder' : 'Continue Editing Draft'}</span>
                              </button>

                              {!isPublished && (
                                <button
                                  type="button"
                                  disabled={publishingPlanEmail === plan.userEmail}
                                  onClick={() => handlePublishPlanFromList(plan)}
                                  style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    border: 'none',
                                    color: '#FFF',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
                                  }}>
                                  {publishingPlanEmail === plan.userEmail ? 'Publishing...' : '🚀 Publish to Client'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION B: APPROVED DAILY MEAL SCHEDULES LIST */}
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#F472B6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} /> Approved Daily Meal Schedules ({approvedSchedules.length})
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#CBD5E1' }}>
                        Daily date-specific meal schedules listing all 5 slots (Morning, Morning Snack, Lunch, Evening Snack, Dinner) for clients.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadApprovedSchedules}
                      style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCw size={12} className={schedulesLoading ? 'spin' : ''} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {schedulesLoading ? (
                    <div style={{ textAlign: 'center', padding: '25px', color: '#CBD5E1' }}>Loading approved schedules...</div>
                  ) : approvedSchedules.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '25px', color: '#94A3B8' }}>
                      No daily schedules saved yet. Publish a meal plan or run an AI shuffle rotation to generate daily schedules.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {approvedSchedules.map((sched, idx) => {
                        const schedId = sched.scheduleId || `sched-${idx}`;
                        const isExpanded = expandedScheduleId === schedId;
                        return (
                          <div 
                            key={schedId}
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(236, 72, 153, 0.2)',
                              borderRadius: '12px',
                              padding: '14px 18px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#F472B6', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                                    📅 {sched.date}
                                  </span>
                                  <strong style={{ color: '#FFF', fontSize: '0.92rem' }}>{sched.userName || sched.userEmail}</strong>
                                  <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>
                                    {sched.status || 'PUBLISHED'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#CBD5E1', marginTop: '3px' }}>
                                  Total Cals: <strong style={{ color: '#FF9E7D' }}>{sched.scheduledTotals?.calories || 2200} kcal</strong> • P: {sched.scheduledTotals?.protein || 140}g • C: {sched.scheduledTotals?.carbs || 220}g • F: {sched.scheduledTotals?.fat || 60}g
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedScheduleId(isExpanded ? null : schedId)}
                                  style={{ padding: '5px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Eye size={13} />
                                  <span>{isExpanded ? 'Hide Slots' : 'View Slots'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await shuffleApprovedMealPlanApi({
                                        userEmail: sched.userEmail,
                                        targetDate: sched.date,
                                        saveSchedule: true,
                                        forceReshuffle: true
                                      });
                                      await loadApprovedSchedules();
                                    } catch (e) {}
                                  }}
                                  style={{ padding: '5px 12px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.2)', border: '1px solid #EC4899', color: '#F472B6', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Sparkles size={13} />
                                  <span>AI Reshuffle</span>
                                </button>
                              </div>
                            </div>

                            {/* Expanded Slots Breakdown */}
                            {isExpanded && Array.isArray(sched.slots) && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                {sched.slots.map((s, sIdx) => (
                                  <div key={sIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#FFB8A1', fontWeight: 800 }}>
                                      <span>{s.slotName || `Slot ${sIdx + 1}`}</span>
                                      <span>{s.scheduledTime}</span>
                                    </div>
                                    <strong style={{ display: 'block', color: '#FFF', fontSize: '0.82rem', margin: '3px 0' }}>{s.title}</strong>
                                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{s.prescribedCalories} kcal • {s.prescribedProtein}g P</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* =============================================================== */}
            {/* VIEW 4: PERSONAL ASSISTANCE & CLIENT CONSULTATION CHAT */}
            {/* =============================================================== */}
            {activeTab === 'chat' && selectedUser && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                <div style={{ height: '640px' }}>
                  <SpecialistClientChat 
                    specialistUser={user} 
                    client={selectedUser} 
                    specialistRole="NUTRITIONIST" 
                  />
                </div>

                {/* Personal Assistance Guidance Panel */}
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Send size={18} /> Personal Dietary Assistance
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#CBD5E1' }}>
                      Deliver tailored clinical recommendations directly into {selectedUser.fullName}'s daily guidance feed.
                    </p>
                  </div>

                  {feedbackSuccess && (
                    <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', color: '#34D399', padding: '10px', borderRadius: '8px', fontSize: '0.82rem' }}>
                      {feedbackSuccess}
                    </div>
                  )}

                  {/* Clinical Guidance Presets */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#A78BFA', fontWeight: 700, marginBottom: '6px' }}>
                      Quick Clinical Guidance Presets:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {[
                        { title: 'Hydration Protocol', text: 'Hydration Target: Consume 500ml water immediately upon waking, plus 1L during training window. Add pinch of pink salt for electrolyte balance.' },
                        { title: 'MPS Protein Spacing', text: 'Optimal MPS: Space your 140g protein across 4-5 feedings with minimum 30g per meal to sustain muscle protein synthesis.' },
                        { title: 'Gut Prebiotic Care', text: 'Gut Health: Integrate fermented kefir or plain Greek yogurt daily with raw chia seeds to improve microbial diversity and nutrient absorption.' },
                        { title: '14-Day Elimination', text: 'Elimination Trial: Suspend suspicious food allergen for 14 days and monitor digestion, skin clarity, and bloating.' }
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFeedbackText(preset.text)}
                          style={{
                            fontSize: '0.72rem',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(167, 139, 250, 0.3)',
                            color: '#E2C9D6',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}>
                          {preset.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSendPersonalGuidance} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea 
                      rows={5}
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      placeholder="Write personalized dietary advice, supplement recommendations, or clinical guidance for this client..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(167, 139, 250, 0.4)', color: '#FFF', fontSize: '0.84rem', resize: 'vertical' }}
                    />

                    <button
                      type="submit"
                      disabled={sendingFeedback || !feedbackText.trim()}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                        border: 'none',
                        color: '#FFF',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: (sendingFeedback || !feedbackText.trim()) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        opacity: (sendingFeedback || !feedbackText.trim()) ? 0.6 : 1
                      }}>
                      <Send size={14} />
                      <span>{sendingFeedback ? 'Delivering Guidance...' : 'Send Guidance to Client'}</span>
                    </button>
                  </form>

                  {/* Sent Guidance History */}
                  {sentGuidanceList.length > 0 && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Recently Transmitted:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                        {sentGuidanceList.map((item, idx) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A78BFA', fontSize: '0.68rem', marginBottom: '2px' }}>
                              <span>{item.client}</span>
                              <span>{item.date}</span>
                            </div>
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 5: CLINICAL HEALTH ASSESSMENT */}
            {/* =============================================================== */}
            {activeTab === 'assessment' && selectedUserDetail && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  
                  {/* Anthropometric & BMR Card */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '18px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} /> Anthropometrics & Energy
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#CBD5E1' }}>
                      <div>Age / Gender: <strong style={{ color: '#FFF' }}>{selectedUserDetail.clinicalAssessment?.anthropometrics?.age || 26} y/o • {selectedUserDetail.clinicalAssessment?.anthropometrics?.gender}</strong></div>
                      <div>Height & Weight: <strong style={{ color: '#FFF' }}>{selectedUserDetail.clinicalAssessment?.anthropometrics?.heightCm} cm • {selectedUserDetail.clinicalAssessment?.anthropometrics?.weightKg} kg</strong></div>
                      <div>BMI: <strong style={{ color: '#38BDF8' }}>{selectedUserDetail.clinicalAssessment?.anthropometrics?.bmi}</strong> ({selectedUserDetail.clinicalAssessment?.anthropometrics?.bmiCategory})</div>
                      <div>Basal Metabolic Rate (BMR): <strong style={{ color: '#FF9E7D' }}>{selectedUserDetail.clinicalAssessment?.energyExpenditure?.bmr} kcal</strong></div>
                      <div>Total Daily Energy (TDEE): <strong style={{ color: '#FCD34D' }}>{selectedUserDetail.clinicalAssessment?.energyExpenditure?.tdee} kcal</strong></div>
                    </div>
                  </div>

                  {/* Dietary Restrictions Card */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '18px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={18} /> Declared Restriction Barriers
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      <div>Confirmed Allergies: 
                        <strong style={{ color: '#FCA5A5', marginLeft: '6px' }}>
                          {Array.isArray(selectedUserDetail.clinicalAssessment?.dietaryCategories?.confirmedAllergies)
                            ? selectedUserDetail.clinicalAssessment.dietaryCategories.confirmedAllergies.join(', ')
                            : (selectedUserDetail.clinicalAssessment?.dietaryCategories?.confirmedAllergies || 'None Declared')}
                        </strong>
                      </div>
                      <div>Intolerances: 
                        <strong style={{ color: '#FDE68A', marginLeft: '6px' }}>
                          {Array.isArray(selectedUserDetail.clinicalAssessment?.dietaryCategories?.intolerances)
                            ? selectedUserDetail.clinicalAssessment.dietaryCategories.intolerances.join(', ')
                            : (selectedUserDetail.clinicalAssessment?.dietaryCategories?.intolerances || 'None')}
                        </strong>
                      </div>
                      <div>Disliked Foods: 
                        <span style={{ color: '#CBD5E1', marginLeft: '6px' }}>
                          {Array.isArray(selectedUserDetail.clinicalAssessment?.dietaryCategories?.dislikedFoods)
                            ? selectedUserDetail.clinicalAssessment.dietaryCategories.dislikedFoods.join(', ')
                            : (selectedUserDetail.clinicalAssessment?.dietaryCategories?.dislikedFoods || 'None')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Practical Living Context Card */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '16px', padding: '18px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={18} /> Practical Context & Adherence
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      <div>Food Budget: <strong style={{ color: '#FFF' }}>{selectedUserDetail.clinicalAssessment?.practicalContext?.foodBudget || 'Standard'}</strong></div>
                      <div>Cooking Facilities: <strong style={{ color: '#FFF' }}>{selectedUserDetail.clinicalAssessment?.practicalContext?.cookingFacilities || 'Full Kitchen'}</strong></div>
                      <div>Calorie Adherence Rate: <strong style={{ color: '#34D399' }}>92%</strong></div>
                      <div>Protein Target Adherence: <strong style={{ color: '#38BDF8' }}>88%</strong></div>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* =============================================================== */}
            {/* VIEW 7: FOOD DATABASE & VERIFIED CATALOG */}
            {/* =============================================================== */}
            {activeTab === 'food_db' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ position: 'relative', minWidth: '280px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      placeholder="Search food database..." 
                      value={foodSearchQuery}
                      onChange={e => setFoodSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['All', 'Plant Protein', 'Dairy / Protein', 'Seafood', 'Whole Grain'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFoodCatFilter(c)}
                        style={{ padding: '6px 12px', borderRadius: '8px', background: foodCatFilter === c ? 'rgba(52, 211, 153, 0.25)' : 'rgba(0,0,0,0.3)', border: foodCatFilter === c ? '1px solid #34D399' : '1px solid rgba(255,255,255,0.1)', color: foodCatFilter === c ? '#34D399' : '#CBD5E1', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {(foodDbItems.length > 0 ? foodDbItems : VERIFIED_MASTER_FOODS).map((item, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.category}
                        </span>
                        <strong style={{ color: '#FF9E7D', fontSize: '0.85rem' }}>{item.calories} kcal</strong>
                      </div>
                      <strong style={{ color: '#FFF', fontSize: '0.92rem', display: 'block', marginBottom: '4px' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                        P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g • Serving: {item.servingSize}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 8: SYMPTOM DIARY LOGS */}
            {/* =============================================================== */}
            {activeTab === 'symptoms' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} style={{ color: '#EF4444' }} />
                  <span>Client Symptom Diary & Food Flare Logs</span>
                </h3>

                {symptomLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No symptom flare events reported by assigned clients.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {symptomLogs.map((log, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ color: '#FDA4AF', fontSize: '0.94rem' }}>{log.foodTrigger || log.loggedMealTitle || 'Reported Food Item'}</strong>
                            <span style={{ fontSize: '0.7rem', background: '#EF4444', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                              Severity: {log.severity || log.severityRating || 3}/5
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#CBD5E1' }}>
                            Client: {log.userEmail} • Notes: "{log.notes || log.symptomNotes || 'Gastrointestinal discomfort'}"
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSymptom(log);
                            setSpecialistCommentInput('');
                          }}
                          style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>
                          Review & Annotate
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </main>

      {/* =================================================================== */}
      {/* MODAL: AI SHUFFLED PREVIEW MODAL */}
      {/* =================================================================== */}
      {shuffledPreviewModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#1d0718', border: '1.5px solid #EC4899', borderRadius: '20px', padding: '28px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: '#F472B6' }} />
                  <span>AI Shuffled Daily Meal Schedule</span>
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#F472B6' }}>
                  Client: {shuffledPreviewModal.plan?.userName || shuffledPreviewModal.plan?.userEmail} • Date: {shuffledPreviewModal.date}
                </span>
              </div>
              <button onClick={() => setShuffledPreviewModal(prev => ({ ...prev, isOpen: false }))} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {shuffledPreviewModal.error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.82rem' }}>
                {shuffledPreviewModal.error}
              </div>
            )}

            {shuffledPreviewModal.success && (
              <div style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34D399', color: '#34D399', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.82rem' }}>
                {shuffledPreviewModal.success}
              </div>
            )}

            {shuffledPreviewModal.loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#CBD5E1' }}>Generating optimal AI meal rotation...</div>
            ) : shuffledPreviewModal.schedule && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#CBD5E1' }}>
                  <span>Total Calories: <strong style={{ color: '#FF9E7D' }}>{shuffledPreviewModal.schedule.scheduledTotals?.calories} kcal</strong></span>
                  <span>Protein: <strong style={{ color: '#38BDF8' }}>{shuffledPreviewModal.schedule.scheduledTotals?.protein}g</strong></span>
                  <span>Carbs: <strong style={{ color: '#FCD34D' }}>{shuffledPreviewModal.schedule.scheduledTotals?.carbs}g</strong></span>
                  <span>Fat: <strong style={{ color: '#F472B6' }}>{shuffledPreviewModal.schedule.scheduledTotals?.fat}g</strong></span>
                </div>

                {(shuffledPreviewModal.schedule.slots || []).map((slot, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#F472B6', fontWeight: 800 }}>{slot.slotName} • {slot.scheduledTime}</span>
                      <strong style={{ display: 'block', color: '#FFF', fontSize: '0.88rem' }}>{slot.title}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{slot.servingSize}</span>
                    </div>
                    <strong style={{ color: '#FF9E7D', fontSize: '0.84rem' }}>{slot.prescribedCalories} kcal</strong>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => handleReshufflePreviewModal(true)}
                style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.2)', border: '1px solid #EC4899', color: '#F472B6', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} />
                <span>AI Re-shuffle</span>
              </button>

              <button
                type="button"
                onClick={handleSaveModalScheduleToClient}
                style={{ padding: '9px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: 'none', color: '#FFF', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}>
                Save & Publish to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ALLERGY-AWARE SUBSTITUTION PICKER */}
      {/* =================================================================== */}
      {showSubModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#1d0718', border: '1px solid #38BDF8', borderRadius: '18px', padding: '28px', maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>Allergy-Aware Food Substitutions</h3>
              <button onClick={() => setShowSubModal(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '16px' }}>
              Select a verified, whole-food alternative matching all declared client safety constraints:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeSubstitutions.map((sub, i) => (
                <div 
                  key={i}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <div>
                    <strong style={{ color: '#38BDF8', fontSize: '0.88rem' }}>{sub.to}</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#CBD5E1' }}>{sub.benefit}</p>
                    <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 700 }}>✓ {sub.safetyNote}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleApplySubstitution(sub)}
                    style={{ padding: '6px 12px', borderRadius: '8px', background: '#38BDF8', border: 'none', color: '#12030F', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: SYMPTOM REVIEW ANNOTATION */}
      {/* =================================================================== */}
      {selectedSymptom && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: '#1d0718', border: '2px solid #EF4444', borderRadius: '20px', padding: '30px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.2)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Review Food Flare Event</h3>
                  <span style={{ fontSize: '0.76rem', color: '#FCA5A5' }}>Client: {selectedSymptom.userEmail}</span>
                </div>
              </div>
              <button onClick={() => setSelectedSymptom(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.5' }}>
              <div>Trigger Food: <strong style={{ color: '#FDA4AF' }}>{selectedSymptom.foodTrigger || selectedSymptom.loggedMealTitle}</strong></div>
              <div>Reported Category: <strong style={{ color: '#FFF' }}>{selectedSymptom.symptomCategory || selectedSymptom.symptomType}</strong> (Severity {selectedSymptom.severity || selectedSymptom.severityRating}/5)</div>
            </div>

            <textarea 
              rows={4}
              placeholder="Enter comprehensive clinical advice, dietary modifications, or elimination guidance..."
              value={specialistCommentInput}
              onChange={e => setSpecialistCommentInput(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FFF', fontSize: '0.86rem', marginBottom: '18px', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setSelectedSymptom(null)}
                style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                type="button" 
                disabled={savingSymptomReview || !specialistCommentInput.trim()}
                onClick={() => handleReviewSymptom(selectedSymptom.id || selectedSymptom._id)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: (savingSymptomReview || !specialistCommentInput.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (savingSymptomReview || !specialistCommentInput.trim()) ? 0.6 : 1
                }}>
                {savingSymptomReview ? 'Saving...' : 'Save & Send to Client'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Nutritionist Password & Account Modal */}
      <TrainerPasswordModal 
        isOpen={showPasswordModal}
        role="NUTRITIONIST"
        isMandatory={isInitialNutritionistPassword}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => setShowPasswordModal(false)}
      />

      <Footer />
    </div>
  );
}
