import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Utensils, Sparkles, Droplets, CheckCircle2, Flame, Award, Apple, 
  Check, ArrowRight, ShieldCheck, HeartPulse, Info, RefreshCw, X,
  FileText, Sliders, MessageSquare, Send, Calendar, Clock, Trophy,
  ChevronRight, AlertCircle, Plus, PieChart, Shield, Lock, RotateCcw,
  CheckSquare, Medal, Activity, FileCheck2, ShieldAlert, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getConversationMessages, sendChatMessage } from '../services/chatService';
import { 
  fetchUserNutritionProgressApi, 
  completeNutritionDayApi,
  fetchUserDietaryProfileApi,
  fetchUserSymptomLogsApi,
  logUserSymptomEventApi,
  fetchClientMealScheduleApi,
  logClientMealSlotApi
} from '../services/api';

// ============================================================================
// DEFAULT NUTRITION PERIODIZATION PHASES
// ============================================================================
const DEFAULT_NUTRITION_PHASES = [
  { phase: '1', days: 'Days 1-7', title: 'Metabolic Priming & Gut Adaptation', focus: 'Hydration discipline, steady blood glucose, prebiotic & probiotic integration' },
  { phase: '2', days: 'Days 8-14', title: 'Hypertrophic Protein & Anabolic Timing', focus: 'Optimal 1.6-2.2g/kg protein distribution and post-workout amino acid recovery' },
  { phase: '3', days: 'Days 15-21', title: 'Glycogen Storage & Micronutrient Precision', focus: 'Complex low-GI carbs for CNS output, magnesium, zinc, and electrolyte balance' },
  { phase: '4', days: 'Days 22-30', title: 'Metabolic Flexibility & Energy Mastery', focus: 'Peak metabolic efficiency, lean mass preservation, and sustainable lifestyle adherence' }
];

const DEFAULT_NUTRITION_PRESCRIPTION = {
  prescriptionId: 'RX-NUT-2026-SV42',
  issuedDate: 'September 23, 2026',
  approvalStatus: 'APPROVED_AND_ACTIVE',
  targetGoal: 'Hypertrophic Lean Mass & Recovery',
  dietaryCategory: 'High-Protein Performance Balanced',
  targetCalories: 2450,
  proteinGrams: 165,
  carbGrams: 260,
  fatGrams: 65,
  hydrationLiters: 3.5,
  dietitianNotes: 'Metabolic blueprint calibrated to optimize muscle protein synthesis (MPS) and replenish intramuscular glycogen without visceral fat accumulation.',
  phases: DEFAULT_NUTRITION_PHASES
};

// ============================================================================
// 30-DAY COMPREHENSIVE PERIODIZED DIETITIAN MEAL PLANS REPOSITORY
// ============================================================================
const GENERATE_30_DAY_NUTRITION_PLANS = (dietCategory = 'Standard Balanced') => {
  const plans = {};
  const pref = (dietCategory || '').toLowerCase();

  let dailyMealTemplates = [];

  if (pref.includes('veg') && !pref.includes('non') && !pref.includes('vegan')) {
    // -------------------------------------------------------------------------
    // 100% VEGETARIAN HIGH-PROTEIN PERIODIZED MEAL TEMPLATES
    // -------------------------------------------------------------------------
    dailyMealTemplates = [
      {
        focusTheme: 'Vegetarian Muscle Anabolism & Paneer-Soya Power Split',
        rationale: 'High-biological-value vegetarian proteins (Paneer, Soya chunks, Greek yogurt) paired with complex low-GI carbs.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'High-Protein Low-Fat Paneer Bhurji with Sprouted Wheat Toast',
            timing: '07:30 AM • Anabolic Awakening',
            calories: 520,
            protein: 38,
            carbs: 56,
            fats: 14,
            dietitianCue: 'Low-fat paneer delivers slow-digesting micellar casein to sustain nitrogen retention.',
            ingredients: ['160g Low-Fat Fresh Paneer', '2 Slices Sprouted Whole Wheat Toast', 'Baby Spinach & Turmeric', '200ml Unsweetened Almond Milk'],
            micronutrients: 'Calcium (420mg), Vitamin B12 (1.9mcg), Phosphorus (310mg)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: '0% Greek Yogurt with Blueberries & Raw Californian Walnuts',
            timing: '10:45 AM • Cortisol Buffer',
            calories: 290,
            protein: 24,
            carbs: 22,
            fats: 11,
            dietitianCue: 'Live cultures optimize gut microbiome tight junctions and amino acid assimilation.',
            ingredients: ['180g 0% Greek Yogurt', '60g Fresh Blueberries', '15g Raw Walnuts', 'Ceylon Cinnamon'],
            micronutrients: 'Probiotics (15B CFU), Magnesium (75mg), Vitamin K (35mcg)'
          },
          {
            type: 'LUNCH',
            title: 'Spiced Soya Chunks & Tricolor Quinoa Harvest Bowl with Steamed Greens',
            timing: '01:30 PM • Midday Glycogen Fuel',
            calories: 680,
            protein: 52,
            carbs: 72,
            fats: 14,
            dietitianCue: 'Soya chunks offer 52g protein per 100g dry weight, matching the leucine threshold of whey.',
            ingredients: ['75g Dry Soya Chunks (38g Protein)', '1 Cup Cooked Tricolor Quinoa', '150g Steamed Broccoli', 'Cucumber Mint Greek Raita'],
            micronutrients: 'Iron (6.8mg), Potassium (820mg), Folate (160mcg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Sprouted Moong & Oats Protein Pancake with Pure Honey Glaze',
            timing: '04:30 PM • 60 Mins Before Training',
            calories: 280,
            protein: 16,
            carbs: 48,
            fats: 4,
            dietitianCue: 'Sprouting triples the bioavailable folate and enzymes for rapid non-bloating digestion.',
            ingredients: ['50g Sprouted Moong Flour', '30g Rolled Oats Flour', '1 Tsp Raw Forest Honey', 'Pinch Himalayan Pink Salt'],
            micronutrients: 'Potassium (410mg), Vitamin C (18mg), B-Complex'
          },
          {
            type: 'DINNER',
            title: 'Grilled Organic Paneer Steak with Sprouted Moong Dal & Sweet Potato',
            timing: '08:00 PM • Evening MPS & Tissue Repair',
            calories: 650,
            protein: 44,
            carbs: 52,
            fats: 16,
            dietitianCue: 'Synergistic pairing of dairy casein and legume amino acids guarantees a complete DIAAS score.',
            ingredients: ['160g Grilled Herb Paneer', '1 Bowl Sprouted Yellow Moong Dal', '160g Roasted Japanese Sweet Potato', 'Steamed Asparagus'],
            micronutrients: 'Zinc (4.8mg), Calcium (380mg), Vitamin A (920mcg)'
          }
        ]
      },
      {
        focusTheme: 'Plant & Dairy Synergistic Endurance & Recovery Split',
        rationale: 'Clean complex carbs from quinoa and sprouted lentils with bioavailable whey/casein matrix.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'Rolled Oats & Whey Isolate Bowl with Chia Seeds & Almonds',
            timing: '07:30 AM • Fast + Slow Protein Awakening',
            calories: 510,
            protein: 40,
            carbs: 62,
            fats: 12,
            dietitianCue: 'Whey isolate delivers immediate leucine while beta-glucan oats maintain steady glycemic output.',
            ingredients: ['80g Whole Rolled Oats', '1 Scoop Whey/Plant Protein Isolate', '15g Chia Seeds', '60g Raspberries', 'Almond Milk'],
            micronutrients: 'Manganese (1.5mg), Vitamin C (25mg), Iron (4.1mg)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: 'Cottage Cheese with Crisp Green Apple Slices & Pumpkin Seeds',
            timing: '10:45 AM • Zinc & Slow Casein Release',
            calories: 280,
            protein: 22,
            carbs: 24,
            fats: 10,
            dietitianCue: 'Pumpkin seeds provide dense bioavailable zinc for cellular repair.',
            ingredients: ['140g Low-Fat Cottage Cheese', '1 Sliced Crisp Green Apple', '15g Raw Pumpkin Seeds'],
            micronutrients: 'Zinc (3.4mg), Magnesium (95mg), Potassium (340mg)'
          },
          {
            type: 'LUNCH',
            title: 'Organic Tofu & Edamame Quinoa Buddha Bowl with Tahini Glaze',
            timing: '01:30 PM • Plant Protein Hypertrophy Peak',
            calories: 690,
            protein: 48,
            carbs: 70,
            fats: 16,
            dietitianCue: 'Organic firm tofu and edamame provide all 9 essential amino acids in optimal ratios.',
            ingredients: ['180g Organic Extra Firm Tofu', '80g Shelled Edamame', '1 Cup Cooked Tricolor Quinoa', 'Steamed Baby Kale & Tahini Dressing'],
            micronutrients: 'Iron (5.8mg), Calcium (290mg), Vitamin K (180mcg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Artisanal Brown Rice Cakes with Creamy Almond Butter & Strawberries',
            timing: '04:30 PM • Instant Cellular ATP Recharge',
            calories: 260,
            protein: 8,
            carbs: 38,
            fats: 9,
            dietitianCue: 'Puffed brown rice enables rapid gastric clearance and steady glucose surge.',
            ingredients: ['2 Organic Brown Rice Cakes', '15g Raw Almond Butter', '4 Sliced Fresh Strawberries'],
            micronutrients: 'Vitamin C (32mg), Manganese (0.7mg), Phosphorus (110mg)'
          },
          {
            type: 'DINNER',
            title: 'Slow-Simmered Black Lentil Dal (Makhani Style) with Brown Rice & Paneer',
            timing: '08:00 PM • Micronutrient Density & Satiety',
            calories: 660,
            protein: 42,
            carbs: 64,
            fats: 14,
            dietitianCue: 'Black urad lentils and brown rice form a complete protein with high prebiotic resistant starch.',
            ingredients: ['1 Bowl Black Lentil & Tomato Dal (no heavy cream)', '100g Grilled Paneer Cubes', '1 Cup Steamed Brown Rice', 'Roasted Cumin Green Beans'],
            micronutrients: 'Iron (6.2mg), Magnesium (110mg), Potassium (740mg)'
          }
        ]
      },
      {
        focusTheme: 'Alkalizing Green Micronutrient & Vegetarian Glycogen Reload',
        rationale: 'High chlorophyll leafy greens, sprouted moong, and organic dairy for complete recovery.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'Sprouted Moong & Spinach Crepe (Cheela) with Mint Yogurt Dip',
            timing: '07:30 AM • Complex Protein & Folate',
            calories: 480,
            protein: 34,
            carbs: 54,
            fats: 12,
            dietitianCue: 'Moong cheela provides 100% bioavailable plant protein with near-zero saturated fat.',
            ingredients: ['1 Cup Sprouted Green Moong Batter', '50g Grated Low-Fat Paneer', 'Baby Spinach & Ginger', '100g 0% Greek Yogurt Dip'],
            micronutrients: 'Folate (210mcg), Vitamin C (40mg), Iron (4.9mg)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: 'Roasted Spiced Chickpeas (Chana) with Raw Californian Almonds',
            timing: '10:45 AM • Satiety & Sustained Focus',
            calories: 270,
            protein: 16,
            carbs: 28,
            fats: 11,
            dietitianCue: 'Roasted chickpeas deliver slow-fermenting prebiotic fiber to support gut microbiome.',
            ingredients: ['70g Dry Roasted Chickpeas', '15g Raw Almonds', 'Chat Masala & Lemon Squeeze'],
            micronutrients: 'Dietary Fiber (9g), Magnesium (80mg), Copper (0.4mg)'
          },
          {
            type: 'LUNCH',
            title: 'Paneer Tikka & Chickpea Harvest Bowl with Fragrant Basmati Rice',
            timing: '01:30 PM • High Fast-Twitch Muscle Fuel',
            calories: 710,
            protein: 50,
            carbs: 76,
            fats: 16,
            dietitianCue: 'Tandoori-spiced paneer with chickpeas provides sustained nitrogen balance throughout afternoon.',
            ingredients: ['150g Low-Fat Spiced Paneer', '1/2 Cup Boiled Chickpeas', '1 Cup Steamed Aged Basmati', 'Grilled Bell Peppers & Onions'],
            micronutrients: 'Calcium (410mg), Zinc (4.5mg), Vitamin B6 (0.9mg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Medjool Dates Stuffed with Raw Almond Butter & Sea Salt',
            timing: '04:30 PM • Rapid Nitric Oxide Glucose Catalyst',
            calories: 260,
            protein: 6,
            carbs: 48,
            fats: 7,
            dietitianCue: 'Natural glucose/fructose from dates enters bloodstream in 15 minutes for explosive sets.',
            ingredients: ['2 Large Medjool Dates', '15g Creamy Almond Butter', 'Pinch Himalayan Salt'],
            micronutrients: 'Potassium (340mg), Copper (0.3mg), Fiber (4g)'
          },
          {
            type: 'DINNER',
            title: 'High-Protein Soya Granule Keema with Whole Wheat Phulkas & Salad',
            timing: '08:00 PM • Nighttime Muscle Protein Synthesis',
            calories: 640,
            protein: 48,
            carbs: 58,
            fats: 13,
            dietitianCue: 'Soya granules deliver ultra-dense essential amino acids with high glutamine for recovery.',
            ingredients: ['70g Dry Soya Granules cooked with Peas & Tomatoes', '2 Soft 100% Whole Wheat Phulkas', '1 Cup Cucumber Tomato Salad', 'Mint Dressing'],
            micronutrients: 'Iron (7.5mg), Potassium (890mg), Phosphorus (360mg)'
          }
        ]
      }
    ];
  } else if (pref.includes('vegan')) {
    // -------------------------------------------------------------------------
    // 100% VEGAN (PLANT-BASED) PERIODIZED MEAL TEMPLATES
    // -------------------------------------------------------------------------
    dailyMealTemplates = [
      {
        focusTheme: '100% Plant-Based Hypertrophy & Clean Muscle Synthesis',
        rationale: 'Complete amino acid spectrum derived exclusively from organic tofu, tempeh, pea protein, and lentils.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'Organic Tofu & Turmeric Scramble with Sliced Avocado & Sprouted Toast',
            timing: '07:30 AM • Plant Anabolic Awakening',
            calories: 490,
            protein: 34,
            carbs: 48,
            fats: 18,
            dietitianCue: 'Nutritional yeast delivers bio-fermented Vitamin B12 and complete savory umami amino acids.',
            ingredients: ['200g Organic Firm Tofu', '2 Tbsp Nutritional Yeast', '1/2 Hass Avocado', '2 Slices Sprouted Ezekiel Toast'],
            micronutrients: 'Vitamin B12 (4.8mcg), Iron (5.2mg), Calcium (280mg)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: 'Sprouted Pea & Rice Protein Shake with Almond Butter & Blueberries',
            timing: '10:45 AM • Leucine & Amino Catalyst',
            calories: 280,
            protein: 28,
            carbs: 22,
            fats: 9,
            dietitianCue: 'Pea + Brown Rice protein ratio (70:30) mirrors the exact BCAA amino acid profile of whey isolate.',
            ingredients: ['1 Scoop Organic Pea/Rice Protein', '250ml Unsweetened Almond Milk', '15g Almond Butter', '50g Fresh Blueberries'],
            micronutrients: 'BCAAs (5.6g), Magnesium (95mg), Iron (4.1mg)'
          },
          {
            type: 'LUNCH',
            title: 'Marinated Tempeh & Edamame Quinoa Buddha Bowl with Tahini-Lemon Glaze',
            timing: '01:30 PM • Complete Plant Protein Power',
            calories: 690,
            protein: 50,
            carbs: 68,
            fats: 18,
            dietitianCue: 'Fermented organic tempeh has superior bioavailability, zero phytic acid, and 31g protein per serving.',
            ingredients: ['160g Organic Tempeh', '80g Shelled Edamame', '1 Cup Tricolor Quinoa', 'Steamed Baby Kale & Sesame Tahini'],
            micronutrients: 'Prebiotic Fiber (14g), Iron (6.5mg), Zinc (4.8mg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Organic Medjool Dates with Crushed Walnuts & Sea Salt',
            timing: '04:30 PM • 60 Mins Before Training',
            calories: 260,
            protein: 5,
            carbs: 50,
            fats: 7,
            dietitianCue: 'Natural whole-food glucose fuels high intensity lifts without insulin crashes.',
            ingredients: ['2 Large Medjool Dates', '15g Raw Crushed Walnuts', 'Sprinkle Pink Salt'],
            micronutrients: 'Potassium (350mg), Copper (0.3mg), Fiber (4.2g)'
          },
          {
            type: 'DINNER',
            title: 'Black Bean & Red Lentil High-Protein Stew with Roasted Sweet Potatoes',
            timing: '08:00 PM • Plant MPS & Cellular Repair',
            calories: 640,
            protein: 42,
            carbs: 72,
            fats: 12,
            dietitianCue: 'Slow-simmered lentils and black beans provide resistant starch to fuel microbiome butyrate synthesis.',
            ingredients: ['1 Cup Red Lentils & Black Beans Stew', '160g Roasted Sweet Potato Cubes', '20g Raw Hemp Heart Seeds', 'Steamed Asparagus'],
            micronutrients: 'Omega-3 ALA (3.2g), Folate (280mcg), Magnesium (140mg)'
          }
        ]
      }
    ];
  } else if (pref.includes('pescatarian')) {
    // -------------------------------------------------------------------------
    // PESCATARIAN (WILD SEAFOOD + PLANT / DAIRY) MEAL TEMPLATES
    // -------------------------------------------------------------------------
    dailyMealTemplates = [
      {
        focusTheme: 'Pescatarian Omega-3 EPA/DHA & Lean Marine Muscle Split',
        rationale: 'Wild salmon, Pacific cod, and Greek yogurt for optimal recovery and connective tissue repair.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'Wild Smoked Salmon & Egg White Scramble on Artisanal Sourdough',
            timing: '07:30 AM • Marine Awakening',
            calories: 510,
            protein: 42,
            carbs: 48,
            fats: 14,
            dietitianCue: 'Smoked wild salmon delivers pure marine Omega-3s to prime cognitive sharpness.',
            ingredients: ['70g Wild Alaskan Smoked Salmon', '4 Pasture Egg Whites + 1 Whole Egg', '1 Slice Sourdough', '1/2 Sliced Avocado'],
            micronutrients: 'Omega-3 EPA/DHA (1.8g), Vitamin D (780 IU), Vitamin B12 (3.5mcg)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: '0% Greek Yogurt with Blueberries & Raw Californian Walnuts',
            timing: '10:45 AM • Sustained Nitrogen Balance',
            calories: 280,
            protein: 24,
            carbs: 22,
            fats: 11,
            dietitianCue: 'Casein matrix with polyphenol-rich berries.',
            ingredients: ['180g 0% Greek Yogurt', '50g Fresh Blueberries', '15g Raw Walnuts'],
            micronutrients: 'Probiotics (15B CFU), Calcium (280mg)'
          },
          {
            type: 'LUNCH',
            title: 'Pan-Seared Pacific Cod Harvest Bowl with Wild Rice & Charred Broccolini',
            timing: '01:30 PM • Ultra-Lean Iodine Fuel',
            calories: 680,
            protein: 52,
            carbs: 70,
            fats: 14,
            dietitianCue: 'Pacific cod provides 98% pure protein with natural iodine to support thyroid T3 conversion.',
            ingredients: ['200g Pacific Cod Fillet', '1 Cup Cooked Wild Rice Blend', '150g Charred Broccolini', 'Extra Virgin Olive Oil & Lemon'],
            micronutrients: 'Iodine (130mcg), Selenium (45mcg), Phosphorus (310mg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Brown Rice Cakes with Almond Butter & Sliced Banana',
            timing: '04:30 PM • Rapid Glycogen Shuttling',
            calories: 260,
            protein: 7,
            carbs: 46,
            fats: 8,
            dietitianCue: 'Clean medium and fast-burning carbohydrates.',
            ingredients: ['2 Brown Rice Cakes', '15g Almond Butter', '1/2 Banana'],
            micronutrients: 'Potassium (320mg), Manganese (0.6mg)'
          },
          {
            type: 'DINNER',
            title: 'Oven-Baked Alaskan Salmon Fillet with Japanese Sweet Potatoes & Asparagus',
            timing: '08:00 PM • Evening Tissue Regeneration',
            calories: 660,
            protein: 46,
            carbs: 52,
            fats: 18,
            dietitianCue: 'Astaxanthin in wild sockeye shields sarcolemma membranes against oxidative training stress.',
            ingredients: ['180g Wild Sockeye Salmon', '180g Roasted Sweet Potato Cubes', '140g Steamed Asparagus', 'Rosemary Glaze'],
            micronutrients: 'Omega-3 (2.4g), Astaxanthin (2.2mg), Vitamin D (890 IU)'
          }
        ]
      }
    ];
  } else {
    // -------------------------------------------------------------------------
    // STANDARD BALANCED (LEAN POULTRY, MEAT, SALMON, EGGS, OATS)
    // -------------------------------------------------------------------------
    dailyMealTemplates = [
      {
        focusTheme: 'Hypertrophy & High-Protein Anabolic Split',
        rationale: 'Elevated branched-chain amino acids (BCAAs) with complex slow-burning oats and salmon.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'Power Oats with Greek Yogurt & Wild Berries',
            timing: '07:30 AM • Anabolic Awakening',
            calories: 520,
            protein: 38,
            carbs: 64,
            fats: 12,
            dietitianCue: 'Rich in beta-glucans and slow-digesting casein/whey proteins. Keeps insulin stable.',
            ingredients: ['80g Rolled Whole Oats', '200g 0% Fat Greek Yogurt', '1 Scoop Whey Isolate', '60g Blueberries', '10g Chia Seeds'],
            micronutrients: 'Vitamin C (45mg), Calcium (320mg), Iron (3.8mg)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: 'Raw Almonds & Green Apple with Cottage Cheese',
            timing: '10:45 AM • Cortisol Buffer',
            calories: 310,
            protein: 22,
            carbs: 26,
            fats: 14,
            dietitianCue: 'Monounsaturated fatty acids support hormone production and sustained mental clarity.',
            ingredients: ['120g Low-Fat Cottage Cheese', '20g Raw Organic Almonds', '1 Crisp Green Apple', 'Ceylon Cinnamon'],
            micronutrients: 'Magnesium (85mg), Potassium (310mg), Vitamin E (6.2mg)'
          },
          {
            type: 'LUNCH',
            title: 'Grilled Herb Chicken Breast & Quinoa Harvest Bowl',
            timing: '01:30 PM • Midday Glycogen Fuel',
            calories: 680,
            protein: 52,
            carbs: 72,
            fats: 16,
            dietitianCue: 'Complete amino acid profile paired with complex slow-burning quinoa fibers.',
            ingredients: ['180g Grilled Chicken Breast', '1 Cup Cooked Tricolor Quinoa', '150g Steamed Broccoli', '1/2 Hass Avocado', 'Olive Oil & Lemon Dressing'],
            micronutrients: 'Zinc (4.2mg), Vitamin B6 (1.1mg), Folate (140mcg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Whole Grain Sourdough with Banana & Honey Glaze',
            timing: '04:30 PM • 60 Mins Before Training',
            calories: 280,
            protein: 9,
            carbs: 54,
            fats: 4,
            dietitianCue: 'Fast and medium-chain glucose sources to elevate blood glucose and intramuscular ATP.',
            ingredients: ['1 Slice Artisanal Whole Wheat Sourdough', '1 Medium Banana', '1 Tsp Raw Forest Honey', 'Pinch of Himalayan Salt'],
            micronutrients: 'Potassium (480mg), Sodium (180mg), Vitamin B1 (0.3mg)'
          },
          {
            type: 'DINNER',
            title: 'Pan-Seared Wild Atlantic Salmon & Sweet Potato Mash',
            timing: '08:00 PM • Evening MPS & Tissue Repair',
            calories: 660,
            protein: 44,
            carbs: 48,
            fats: 18,
            dietitianCue: 'High Omega-3 DHA/EPA concentration down-regulates post-workout joint inflammation.',
            ingredients: ['170g Wild Salmon Fillet', '200g Baked Japanese Sweet Potato', '120g Steamed Asparagus', 'Rosemary Seasoning'],
            micronutrients: 'Omega-3 EPA/DHA (2.1g), Vitamin D (850 IU), Selenium (42mcg)'
          }
        ]
      },
      {
        focusTheme: 'Low-Glycemic Energy & Clean Endurance Split',
        rationale: 'Steady sustained energy release to power aerobic endurance and CNS stamina.',
        meals: [
          {
            type: 'BREAKFAST',
            title: 'Pasture-Raised Scrambled Eggs with Avocado Toast',
            timing: '07:30 AM • Lipid & Choline Priming',
            calories: 490,
            protein: 32,
            carbs: 38,
            fats: 22,
            dietitianCue: 'Egg yolks contain bioactive choline and lutein for neurological focus.',
            ingredients: ['3 Whole Organic Eggs', '1 Slice Sprouted Ezekiel Bread', '1/2 Sliced Avocado', 'Cherry Tomatoes & Microgreens'],
            micronutrients: 'Choline (350mg), Lutein (250mcg), Vitamin A (780 IU)'
          },
          {
            type: 'MID-MORNING SNACK',
            title: 'Whey Protein Isolate with Walnuts & Dark Cocoa',
            timing: '10:45 AM • Nitric Oxide Support',
            calories: 290,
            protein: 28,
            carbs: 14,
            fats: 12,
            dietitianCue: 'Polyphenols in raw cacao boost endothelial blood flow and oxygen transport.',
            ingredients: ['1 Scoop Hydrolyzed Whey', '250ml Unsweetened Almond Milk', '15g Raw Walnuts', '1 Tsp 100% Cacao Powder'],
            micronutrients: 'Flavanols (200mg), Magnesium (95mg), Copper (0.4mg)'
          },
          {
            type: 'LUNCH',
            title: 'Grass-Fed Sirloin Steak with Brown Rice & Grilled Asparagus',
            timing: '01:30 PM • Heme Iron & Creatine Synthesis',
            calories: 710,
            protein: 56,
            carbs: 68,
            fats: 18,
            dietitianCue: 'Bioavailable heme iron and natural creatine recharge red blood cell oxygenation.',
            ingredients: ['170g Lean Sirloin Steak', '1 Cup Steamed Brown Rice', '140g Grilled Asparagus', '1 Tsp Ghee / Garlic Herb'],
            micronutrients: 'Heme Iron (5.1mg), Vitamin B12 (3.8mcg), Zinc (6.5mg)'
          },
          {
            type: 'PRE-WORKOUT ENERGY',
            title: 'Rice Cakes with Almond Butter & Strawberry Slices',
            timing: '04:30 PM • Rapid Glycogen Shuttling',
            calories: 260,
            protein: 8,
            carbs: 36,
            fats: 10,
            dietitianCue: 'High-GI puffed rice delivers instant fuel without gastrointestinal distress.',
            ingredients: ['2 Organic Brown Rice Cakes', '15g Raw Almond Butter', '4 Sliced Fresh Strawberries'],
            micronutrients: 'Vitamin C (35mg), Manganese (0.8mg), Phosphorus (110mg)'
          },
          {
            type: 'DINNER',
            title: 'Oven-Baked Turkey Breast with Roasted Butternut Squash',
            timing: '08:00 PM • Tryptophan & Serotonin Sleep Induction',
            calories: 620,
            protein: 48,
            carbs: 52,
            fats: 12,
            dietitianCue: 'Tryptophan in turkey facilitates REM sleep cycles and growth hormone release.',
            ingredients: ['180g Lean Turkey Breast', '200g Roasted Butternut Squash Cubes', '150g Steamed Green Beans', 'Thyme Herb Glaze'],
            micronutrients: 'Tryptophan (420mg), Vitamin A (1200mcg), Potassium (680mg)'
          }
        ]
      }
    ];
  }

  for (let day = 1; day <= 30; day++) {
    const templateIndex = (day - 1) % dailyMealTemplates.length;
    const base = dailyMealTemplates[templateIndex];
    const weekNumber = Math.ceil(day / 7);
    const isMasterDay = day === 30;

    let phaseName = 'Phase 1: Metabolic Priming';
    if (weekNumber === 2) phaseName = 'Phase 2: Hypertrophic Surplus';
    if (weekNumber === 3) phaseName = 'Phase 3: Glycogen Storage';
    if (weekNumber >= 4) phaseName = 'Phase 4: Metabolic Mastery & Titan Milestone';

    plans[day] = {
      dayNumber: day,
      dayTitle: isMasterDay ? `Day 30: Peak ${dietCategory} Protocol` : `Day ${day}: ${base.focusTheme}`,
      weekLabel: `Week ${weekNumber} • Day ${day} of 30`,
      phaseLabel: phaseName,
      rationale: isMasterDay ? 'Final milestone day: 100% adherence to record your peak metabolic score!' : base.rationale,
      meals: base.meals.map((m, mIdx) => ({
        ...m,
        id: `d${day}-meal${mIdx + 1}`
      }))
    };
  }

  return plans;
};

export default function Nutrition() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = (user?.email || 'default_user').trim().toLowerCase();

  // Dietitian Profile
  const assignedDietitian = (user?.assignedNutritionist && typeof user.assignedNutritionist === 'object') ? {
    name: user.assignedNutritionist.name || 'Sruthy Varghese (M.Sc)',
    email: user.assignedNutritionist.email || 'sruthy@example.com',
    role: user.assignedNutritionist.qualification || 'Head Clinical Dietitian & Sports Nutritionist (M.Sc)',
    certifications: 'M.Sc. Clinical Nutrition, Precision Nutrition L2, CISSN Sports Nutrition',
    experience: '8+ Years Elite Athlete Dietetics',
    avatar: user.assignedNutritionist.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    verificationCode: 'RD-94810-SRUTHY'
  } : {
    name: 'Sruthy Varghese (M.Sc)',
    email: 'sruthy@example.com',
    role: 'Head Clinical Dietitian & Sports Nutritionist (M.Sc)',
    certifications: 'M.Sc. Clinical Nutrition, Precision Nutrition L2, CISSN Sports Nutrition',
    experience: '8+ Years Elite Athlete Dietetics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    verificationCode: 'RD-94810-SRUTHY'
  };

  // Prescription Manifest State
  const [prescriptionMeta, setPrescriptionMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_nutrition_prescription`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_NUTRITION_PRESCRIPTION,
            dietaryCategory: parsed.dietaryCategory || user?.dietaryPreference || 'Standard Balanced',
            ...parsed,
            phases: Array.isArray(parsed.phases) && parsed.phases.length > 0 ? parsed.phases : DEFAULT_NUTRITION_PHASES
          };
        }
      }
      return {
        ...DEFAULT_NUTRITION_PRESCRIPTION,
        dietaryCategory: user?.dietaryPreference || 'Standard Balanced'
      };
    } catch (e) {
      return {
        ...DEFAULT_NUTRITION_PRESCRIPTION,
        dietaryCategory: user?.dietaryPreference || 'Standard Balanced'
      };
    }
  });

  // 30-Day Progressive Nutrition Plans (Tailored specifically to user's dietary preference)
  const [allPlans, setAllPlans] = useState(() => {
    const initialDiet = prescriptionMeta?.dietaryCategory || user?.dietaryPreference || 'Standard Balanced';
    return GENERATE_30_DAY_NUTRITION_PLANS(initialDiet);
  });

  // Completed Nutrition Days Map { 1: true, 2: true ... }
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_nutrition_completed_days_map`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Completed Timestamps
  const [completedTimestamps, setCompletedTimestamps] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_nutrition_completed_timestamps`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Calculate highest unlocked day (Day N requires Day N-1 to be completed)
  const completedCount = Object.keys(completedDays).filter(d => completedDays[d]).length;
  const maxUnlockedDay = Math.min(30, completedCount + 1);

  // Active Day Tracker (defaults to Day 1 for new user or from query param / storage)
  const [activeDay, setActiveDay] = useState(() => {
    const params = new URLSearchParams(location.search);
    const dayParam = params.get('day');
    if (dayParam) {
      const p = parseInt(dayParam, 10);
      if (!isNaN(p) && p >= 1 && p <= 30) {
        return Math.min(maxUnlockedDay, p);
      }
    }
    const saved = localStorage.getItem(`smartfit_${userEmail}_nutrition_active_day`);
    const parsed = saved ? parseInt(saved, 10) : 1;
    return Math.min(maxUnlockedDay, Math.max(1, parsed));
  });

  // Consumed Meals for Active Day { 'd1-meal1': true, ... }
  const [consumedMeals, setConsumedMeals] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_meals_day_${activeDay}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Hydration State for Active Day
  const [waterDrunkMl, setWaterDrunkMl] = useState(() => {
    try {
      const saved = localStorage.getItem(`smartfit_${userEmail}_water_day_${activeDay}`);
      return saved ? parseInt(saved, 10) : 2250;
    } catch (e) {
      return 2250;
    }
  });

  // UI / Modal States
  const [logging, setLogging] = useState(false);
  const [alertBanner, setAlertBanner] = useState('');
  const [logSuccess, setLogSuccess] = useState(null);
  const [selectedMealDetail, setSelectedMealDetail] = useState(null);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [calibrateModal, setCalibrateModal] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [dietitianChatOpen, setDietitianChatOpen] = useState(false);
  const [achievementData, setAchievementData] = useState(null);
  const [lockedDayModal, setLockedDayModal] = useState(null);
  const [cycleCompletedModal, setCycleCompletedModal] = useState(false);

  // Symptom Logging & Clinical Flare State
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [symptomLogs, setSymptomLogs] = useState([]);
  const [symptomSubmitting, setSymptomSubmitting] = useState(false);
  const [symptomSuccessNote, setSymptomSuccessNote] = useState('');
  const [symptomForm, setSymptomForm] = useState({
    foodTrigger: '',
    symptomCategory: 'SKIN_ECZEMA',
    severity: 2,
    onsetLatencyMins: 45,
    notes: '',
    mealId: ''
  });

  // Client Dietary Profile & Confirmed Restrictions
  const [dietaryProfile, setDietaryProfile] = useState(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Calibration Form State
  const [customGoal, setCustomGoal] = useState(prescriptionMeta?.targetGoal || 'Hypertrophic Lean Mass & Recovery');
  const [customDiet, setCustomDiet] = useState(prescriptionMeta?.dietaryCategory || user?.dietaryPreference || 'Standard Balanced');
  const [customCals, setCustomCals] = useState(prescriptionMeta?.targetCalories || 2450);

  // Load Dietary Profile & Symptom Logs
  useEffect(() => {
    const email = (user?.email || 'aby@example.com').trim().toLowerCase();
    
    // Load cached symptom logs first
    try {
      const cached = localStorage.getItem(`smartfit_${email}_symptom_logs`);
      if (cached) {
        setSymptomLogs(JSON.parse(cached));
      }
    } catch (e) {}

    if (user?.email) {
      fetchUserDietaryProfileApi(user.email).then(profile => {
        if (profile) setDietaryProfile(profile);
      }).catch(err => console.warn('Dietary profile fetch:', err));

      fetchUserSymptomLogsApi(user.email).then(logs => {
        if (Array.isArray(logs) && logs.length > 0) {
          setSymptomLogs(logs);
          try {
            localStorage.setItem(`smartfit_${email}_symptom_logs`, JSON.stringify(logs));
          } catch (e) {}
        }
      }).catch(err => console.warn('Symptom logs fetch:', err));
    }
  }, [user?.email]);

  const handleLogSymptom = async (e) => {
    e?.preventDefault();
    if (!symptomForm.foodTrigger.trim()) return;
    setSymptomSubmitting(true);
    const email = (user?.email || 'aby@example.com').trim().toLowerCase();
    const name = user?.name || user?.fullName || email.split('@')[0];

    const newLogItem = {
      id: `symp-${Date.now()}`,
      userEmail: email,
      userName: name,
      foodTrigger: symptomForm.foodTrigger.trim(),
      loggedMealTitle: symptomForm.foodTrigger.trim(),
      symptomCategory: symptomForm.symptomCategory,
      symptomType: symptomForm.symptomCategory,
      severity: Number(symptomForm.severity),
      severityRating: Number(symptomForm.severity),
      onsetLatencyMins: Number(symptomForm.onsetLatencyMins),
      notes: symptomForm.notes.trim(),
      symptomNotes: symptomForm.notes.trim(),
      mealId: symptomForm.mealId || `d${activeDay}-meal`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().substring(0, 10),
      requiresClinicalReview: true,
      reviewedBySpecialist: false,
      reviewedByNutritionist: false,
      specialistComments: '',
      nutritionistNotes: ''
    };

    try {
      const payload = {
        userEmail: email,
        userName: name,
        foodTrigger: newLogItem.foodTrigger,
        loggedMealTitle: newLogItem.foodTrigger,
        symptomCategory: newLogItem.symptomCategory,
        severity: newLogItem.severity,
        onsetLatencyMins: newLogItem.onsetLatencyMins,
        notes: newLogItem.notes,
        mealId: newLogItem.mealId
      };
      
      const res = await logUserSymptomEventApi(payload);
      const savedLog = (res && res.log) ? res.log : newLogItem;

      setSymptomLogs(prev => {
        const updated = [savedLog, ...prev.filter(p => p.id !== savedLog.id)];
        try {
          localStorage.setItem(`smartfit_${email}_symptom_logs`, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      // Synchronize to global symptom store for Nutritionist review queue
      try {
        const globalLogs = JSON.parse(localStorage.getItem('smartfit_symptom_logs_global') || '[]');
        const mergedGlobal = [savedLog, ...globalLogs.filter(g => g.id !== savedLog.id && g._id !== savedLog._id)];
        localStorage.setItem('smartfit_symptom_logs_global', JSON.stringify(mergedGlobal));
      } catch (e) {}

      setSymptomSuccessNote(`✓ Food reaction '${savedLog.foodTrigger}' recorded and transmitted to your clinical nutritionist.`);
      setSymptomForm({
        foodTrigger: '',
        symptomCategory: 'SKIN_ECZEMA',
        severity: 2,
        onsetLatencyMins: 45,
        notes: '',
        mealId: ''
      });
      setTimeout(() => setSymptomSuccessNote(''), 6000);
    } catch (err) {
      console.warn('Symptom log network note, saved to local cache:', err);
      // Fallback local save
      setSymptomLogs(prev => [newLogItem, ...prev]);
      try {
        localStorage.setItem(`smartfit_${email}_symptom_logs`, JSON.stringify([newLogItem, ...symptomLogs]));
        const globalLogs = JSON.parse(localStorage.getItem('smartfit_symptom_logs_global') || '[]');
        localStorage.setItem('smartfit_symptom_logs_global', JSON.stringify([newLogItem, ...globalLogs]));
      } catch (e) {}
      setSymptomSuccessNote(`✓ Food reaction '${newLogItem.foodTrigger}' recorded and queued for nutritionist review.`);
      setTimeout(() => setSymptomSuccessNote(''), 6000);
    } finally {
      setSymptomSubmitting(false);
    }
  };

  // Phase 6 - Client Daily Meal Schedule (Published by assigned nutritionist)
  const [dailySchedule, setDailySchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [slotLogModal, setSlotLogModal] = useState(null); // { slot, status, portionPct, substitutedWith, notes }

  // Fetch client daily meal schedule from backend (Phases 5 & 6)
  useEffect(() => {
    const email = (user?.email || 'aby@example.com').trim().toLowerCase();
    const dateStr = new Date().toISOString().substring(0, 10);
    
    const loadSchedule = () => {
      setScheduleLoading(true);
      fetchClientMealScheduleApi(email, dateStr).then(sched => {
        if (sched && Array.isArray(sched.slots) && sched.slots.length > 0) {
          setDailySchedule(sched);
        }
      }).catch(err => {
        console.warn('Daily meal schedule fetch note:', err);
      }).finally(() => {
        setScheduleLoading(false);
      });
    };

    loadSchedule();

    const handleNutritionUpdate = () => {
      loadSchedule();
    };

    window.addEventListener('smartfit_nutrition_update', handleNutritionUpdate);
    return () => {
      window.removeEventListener('smartfit_nutrition_update', handleNutritionUpdate);
    };
  }, [user?.email, activeDay]);

  const handleLogSlotConsumption = async (slotId, status = 'COMPLETED', portionPct = 100, subWith = null, notes = '') => {
    const email = (user?.email || 'aby@example.com').trim().toLowerCase();
    const dateStr = dailySchedule?.date || new Date().toISOString().substring(0, 10);
    try {
      const res = await logClientMealSlotApi({
        userEmail: email,
        date: dateStr,
        slotId,
        consumptionStatus: status,
        actualPortionEatenPct: portionPct,
        substitutedWith: subWith,
        clientFeedbackNotes: notes
      });
      if (res && res.schedule) {
        setDailySchedule(res.schedule);
      }
    } catch (err) {
      console.warn('Log meal slot consumption error:', err);
    }
  };

  // Convert dailySchedule slots into unified meal card format (Phase 6)
  const activeScheduleMeals = (dailySchedule && Array.isArray(dailySchedule.slots) && dailySchedule.slots.length > 0)
    ? dailySchedule.slots.map((s, idx) => ({
        id: s.slotId || `slot-${idx}`,
        slotId: s.slotId,
        type: s.slotName || (s.slotId ? s.slotId.toUpperCase().replace('_', ' ') : `MEAL #${idx + 1}`),
        title: s.title || 'Nutritious Approved Meal',
        timing: s.scheduledTime ? `${s.scheduledTime} • Approved Daily Schedule` : 'Scheduled Time',
        calories: s.prescribedCalories || 400,
        protein: s.prescribedProtein || 25,
        carbs: s.prescribedCarbs || 45,
        fats: s.prescribedFat || 12,
        dietitianCue: s.description || (s.preparationInstructions ? `Prep: ${s.preparationInstructions}` : 'Personalized meal approved by your assigned clinical nutritionist.'),
        ingredients: s.ingredients || [],
        preparationInstructions: s.preparationInstructions || '',
        servingSize: s.servingSize || '1 serving',
        allowedSubstitutions: s.allowedSubstitutions || [],
        consumptionStatus: s.consumptionStatus || 'PENDING',
        actualPortionEatenPct: s.actualPortionEatenPct || 0,
        substitutedWith: s.substitutedWith || null,
        clientFeedbackNotes: s.clientFeedbackNotes || '',
        isScheduleSlot: true
      }))
    : null;

  // Current Plan & Meals
  const currentPlan = allPlans?.[activeDay] || allPlans?.[1] || {
    dayNumber: 1,
    dayTitle: 'Day 1: Hypertrophy & High-Protein Anabolic Split',
    weekLabel: 'Week 1 • Day 1 of 30',
    phaseLabel: 'Phase 1: Metabolic Priming',
    rationale: 'Elevated branched-chain amino acids (BCAAs) with complex slow-burning oats and salmon.',
    meals: []
  };
  const currentMeals = activeScheduleMeals || currentPlan.meals || [];

  // Sync state when switching active day
  useEffect(() => {
    try {
      const savedMeals = localStorage.getItem(`smartfit_${userEmail}_meals_day_${activeDay}`);
      setConsumedMeals(savedMeals ? JSON.parse(savedMeals) : {});
      const savedWater = localStorage.getItem(`smartfit_${userEmail}_water_day_${activeDay}`);
      setWaterDrunkMl(savedWater ? parseInt(savedWater, 10) : 2250);
    } catch (e) {
      setConsumedMeals({});
      setWaterDrunkMl(2250);
    }
    localStorage.setItem(`smartfit_${userEmail}_nutrition_active_day`, activeDay.toString());
    setAlertBanner('');
  }, [activeDay, userEmail]);

  // Sync state when user switches or URL query param changes
  useEffect(() => {
    const email = (user?.email || 'default_user').trim().toLowerCase();
    
    const params = new URLSearchParams(location.search);
    const dayParam = params.get('day');
    
    let localMap = {};
    try {
      const savedMap = localStorage.getItem(`smartfit_${email}_nutrition_completed_days_map`);
      if (savedMap) localMap = JSON.parse(savedMap);
    } catch (e) {}

    const localCount = Object.keys(localMap).filter(d => localMap[d]).length;
    const localMax = Math.min(30, localCount + 1);

    if (dayParam) {
      const p = parseInt(dayParam, 10);
      if (!isNaN(p) && p >= 1 && p <= 30) {
        setActiveDay(Math.min(localMax, p));
      }
    } else {
      const savedActive = localStorage.getItem(`smartfit_${email}_nutrition_active_day`);
      const p = savedActive ? parseInt(savedActive, 10) : 1;
      setActiveDay(Math.min(localMax, Math.max(1, p)));
    }

    setCompletedDays(localMap);

    if (user?.email) {
      fetchUserNutritionProgressApi(user.email).then(data => {
        if (data && Array.isArray(data.completedNutritionDays)) {
          const map = {};
          data.completedNutritionDays.forEach(d => { map[d] = true; });
          setCompletedDays(map);
          try {
            localStorage.setItem(`smartfit_${email}_nutrition_completed_days_map`, JSON.stringify(map));
          } catch (e) {}

          const count = data.completedNutritionDays.length;
          const maxAllowed = Math.min(30, count + 1);
          const backendActive = data.activeNutritionDay || maxAllowed;

          if (!dayParam) {
            const finalDay = Math.min(maxAllowed, Math.max(1, backendActive));
            setActiveDay(finalDay);
            localStorage.setItem(`smartfit_${email}_nutrition_active_day`, finalDay.toString());
          }
        }
      }).catch(err => {
        console.warn('Backend nutrition progress fetch note:', err);
      });
    }
  }, [user?.email, location.search]);

  // Save consumed meals & water intake for active day
  useEffect(() => {
    localStorage.setItem(`smartfit_${userEmail}_meals_day_${activeDay}`, JSON.stringify(consumedMeals));
    localStorage.setItem(`smartfit_${userEmail}_water_day_${activeDay}`, waterDrunkMl.toString());
  }, [consumedMeals, waterDrunkMl, activeDay, userEmail]);

  // Load chat messages when dietitian chat modal is opened and listen for real-time replies
  useEffect(() => {
    const clientEmail = (user?.email || 'aby@example.com').trim().toLowerCase();
    const dietitianEmail = (assignedDietitian.email || 'sruthy@example.com').trim().toLowerCase();

    const loadChat = () => {
      const msgs = getConversationMessages(clientEmail, dietitianEmail);
      setChatMessages(msgs);
    };

    if (dietitianChatOpen) {
      loadChat();
    }

    const handleChatUpdate = (e) => {
      const msg = e?.detail;
      if (!msg) {
        loadChat();
        return;
      }
      if (
        (msg.clientEmail === clientEmail && msg.specialistEmail === dietitianEmail) ||
        (msg.senderEmail === clientEmail || msg.recipientEmail === clientEmail)
      ) {
        loadChat();
      }
    };

    window.addEventListener('smartfit_chat_update', handleChatUpdate);
    return () => {
      window.removeEventListener('smartfit_chat_update', handleChatUpdate);
    };
  }, [dietitianChatOpen, user?.email, assignedDietitian.email]);

  useEffect(() => {
    if (dietitianChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, dietitianChatOpen]);

  const handleSendDietitianMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const clientEmail = (user?.email || 'aby@example.com').trim().toLowerCase();
    const clientName = user?.fullName || user?.name || clientEmail.split('@')[0];
    const dietitianEmail = (assignedDietitian.email || 'sruthy@example.com').trim().toLowerCase();
    const textToSend = chatInput.trim();

    sendChatMessage({
      clientEmail,
      specialistEmail: dietitianEmail,
      specialistRole: 'NUTRITIONIST',
      senderEmail: clientEmail,
      senderName: clientName,
      senderRole: 'USER',
      recipientEmail: dietitianEmail,
      recipientName: assignedDietitian.name,
      recipientRole: 'NUTRITIONIST',
      text: textToSend
    });

    setChatInput('');
    const updated = getConversationMessages(clientEmail, dietitianEmail);
    setChatMessages(updated);
  };

  const toggleMealConsumed = async (mealId) => {
    if (activeScheduleMeals) {
      const targetSlot = activeScheduleMeals.find(m => m.id === mealId);
      if (targetSlot) {
        const isDone = targetSlot.consumptionStatus === 'COMPLETED';
        const nextStatus = isDone ? 'PENDING' : 'COMPLETED';
        const nextPct = isDone ? 0 : 100;
        await handleLogSlotConsumption(targetSlot.slotId, nextStatus, nextPct);
        return;
      }
    }
    setConsumedMeals(prev => {
      const updated = { ...prev, [mealId]: !prev[mealId] };
      return updated;
    });
    setAlertBanner('');
  };

  const handleCompleteAllMeals = async () => {
    if (activeScheduleMeals) {
      for (const s of activeScheduleMeals) {
        await handleLogSlotConsumption(s.slotId, 'COMPLETED', 100);
      }
      return;
    }
    const all = {};
    currentMeals.forEach(m => {
      all[m.id] = true;
    });
    setConsumedMeals(all);
    setAlertBanner('');
  };

  const handleAddWater = (ml) => {
    setWaterDrunkMl(prev => Math.min(5000, prev + ml));
  };

  // Real-time Macro Totals
  const totalPrescribedCalories = currentMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalPrescribedProtein = currentMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalPrescribedCarbs = currentMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalPrescribedFats = currentMeals.reduce((acc, m) => acc + (m.fats || 0), 0);

  const consumedCount = currentMeals.filter(m => !!consumedMeals[m.id]).length;
  const adherencePercent = currentMeals.length > 0 ? Math.round((consumedCount / currentMeals.length) * 100) : 0;
  const isDayFullyConsumed = (consumedCount === currentMeals.length && currentMeals.length > 0) || !!completedDays[activeDay];

  const consumedCalories = currentMeals.reduce((acc, m) => consumedMeals[m.id] ? acc + m.calories : acc, 0);
  const consumedProtein = currentMeals.reduce((acc, m) => consumedMeals[m.id] ? acc + m.protein : acc, 0);
  const consumedCarbs = currentMeals.reduce((acc, m) => consumedMeals[m.id] ? acc + m.carbs : acc, 0);
  const consumedFats = currentMeals.reduce((acc, m) => consumedMeals[m.id] ? acc + m.fats : acc, 0);

  // Handle Day Selection with Strict Sequential Progression Lock
  const handleSelectDay = (dayNum) => {
    if (dayNum > maxUnlockedDay) {
      setLockedDayModal({
        targetDay: dayNum,
        requiredDay: maxUnlockedDay,
        reason: `Sequential Nutrition Progression Locked: You cannot skip to Day ${dayNum} without consuming all prescribed meals for Day ${maxUnlockedDay} and fulfilling your metabolic timing.`
      });
      return;
    }
    setActiveDay(dayNum);
  };

  // Handle Calibration
  const handleCalibrateNutrition = () => {
    setCalibrating(true);
    setTimeout(() => {
      const newPlans = GENERATE_30_DAY_NUTRITION_PLANS(customDiet);

      const updatedMeta = {
        ...prescriptionMeta,
        targetGoal: customGoal,
        dietaryCategory: customDiet,
        targetCalories: parseInt(customCals, 10) || 2450,
        issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        approvalStatus: 'APPROVED_AND_ACTIVE',
        prescriptionId: `RX-NUT-${Math.floor(1000 + Math.random() * 9000)}-${assignedDietitian.name.split(' ')[0].toUpperCase()}`
      };

      setAllPlans(newPlans);
      setPrescriptionMeta(updatedMeta);
      localStorage.setItem(`smartfit_${userEmail}_nutrition_prescription`, JSON.stringify(updatedMeta));
      setCalibrating(false);
      setCalibrateModal(false);
      setLogSuccess(`✓ Dietitian ${assignedDietitian.name} has approved and certified your updated ${customDiet} Nutrition Protocol!`);
    }, 1000);
  };

  // Handle Log & Advance Day
  const handleLogDailyNutrition = async () => {
    // ENFORCE: All meals must be marked as eaten before unlocking next day!
    if (consumedCount < currentMeals.length) {
      setAlertBanner(`⚠️ Incomplete Meals: You have only consumed ${consumedCount} of ${currentMeals.length} prescribed meals for Day ${activeDay}. Mark all meals as eaten to unlock Day ${Math.min(30, activeDay + 1)}.`);
      window.scrollTo({ top: 380, behavior: 'smooth' });
      return;
    }

    setLogging(true);
    setAlertBanner('');
    setLogSuccess(null);
    const nowTimestamp = Date.now();

    const payload = {
      email: userEmail,
      caloriesConsumed: consumedCalories,
      proteinGrams: consumedProtein,
      adherencePercentage: adherencePercent,
      mealsLogged: consumedCount,
      waterDrunkMl,
      dayNumber: activeDay
    };

    try {
      await completeNutritionDayApi(payload);
    } catch (err) {
      console.warn('Backend complete nutrition day note:', err);
    }

    setLogging(false);
    
    // 1. Mark active day completed in nutrition map
    const newCompletedMap = { ...completedDays, [activeDay]: true };
    const newTimestamps = { ...completedTimestamps, [activeDay]: nowTimestamp };
    setCompletedDays(newCompletedMap);
    setCompletedTimestamps(newTimestamps);
    localStorage.setItem(`smartfit_${userEmail}_nutrition_completed_days_map`, JSON.stringify(newCompletedMap));
    localStorage.setItem(`smartfit_${userEmail}_nutrition_completed_timestamps`, JSON.stringify(newTimestamps));

    // 2. Check if 30-Day Nutrition Cycle is finished
    if (activeDay === 30) {
      setCycleCompletedModal(true);
    } else {
      const nextDay = activeDay + 1;
      setLogSuccess(`✓ Day ${activeDay} Nutrition Completed & Logged! Day ${nextDay} is now Unlocked 🎉`);
      
      setAchievementData({
        dayNumber: activeDay,
        nextDay,
        planTitle: currentPlan.dayTitle,
        calories: consumedCalories,
        protein: consumedProtein,
        adherence: adherencePercent,
        water: (waterDrunkMl / 1000).toFixed(1),
        xp: Math.round(consumedCalories / 3),
        dietitianName: assignedDietitian.name
      });

      setActiveDay(nextDay);
      localStorage.setItem(`smartfit_${userEmail}_nutrition_active_day`, nextDay.toString());
    }
  };

  const handleRestartCycle = () => {
    setActiveDay(1);
    setCompletedDays({});
    setCompletedTimestamps({});
    for (let d = 1; d <= 30; d++) {
      localStorage.removeItem(`smartfit_${userEmail}_meals_day_${d}`);
      localStorage.removeItem(`smartfit_${userEmail}_water_day_${d}`);
    }
    localStorage.setItem(`smartfit_${userEmail}_nutrition_active_day`, '1');
    localStorage.setItem(`smartfit_${userEmail}_nutrition_completed_days_map`, JSON.stringify({}));
    localStorage.setItem(`smartfit_${userEmail}_nutrition_completed_timestamps`, JSON.stringify({}));
    setCycleCompletedModal(false);
    setAlertBanner('');
    setLogSuccess('30-Day Nutrition Cycle Reset. Day 1 is now active for your next progression level.');
  };

  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#12030F', color: '#FFFFFF' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

          {/* Success Notification Alert */}
          {logSuccess && (
            <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.18)', border: '1px solid #34D399', color: '#34D399', padding: '14px 20px', borderRadius: '12px', fontSize: '0.92rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(52, 211, 153, 0.25)' }}>
              <CheckCircle2 size={20} /> {logSuccess}
            </div>
          )}

          {/* Warning / Incomplete Meal Validation Alert */}
          {alertBanner && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.18)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '14px 20px', borderRadius: '12px', fontSize: '0.92rem', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="#EF4444" />
                <span>{alertBanner}</span>
              </div>
              <button
                onClick={handleCompleteAllMeals}
                style={{ background: '#EF4444', border: 'none', color: '#FFF', fontWeight: 800, fontSize: '0.8rem', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                Check All Meals Eaten
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. OFFICIAL CLINICAL DIETITIAN PRESCRIPTION & VERIFICATION HEADER */}
          {/* ========================================================================= */}
          <div style={{
            padding: '24px 28px',
            marginBottom: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(29, 7, 24, 0.95) 100%)',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.18)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={assignedDietitian.avatar} 
                  alt={assignedDietitian.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }}
                />
                <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#10B981', color: '#12030F', borderRadius: '50%', padding: '3px', border: '2px solid #12030F' }}>
                  <ShieldCheck size={12} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.74rem', background: 'rgba(52, 211, 153, 0.2)', color: '#34D399', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} /> CERTIFIED DIETITIAN PRESCRIPTION
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                    ID: {prescriptionMeta?.prescriptionId || 'RX-NUT-2026-SV42'}
                  </span>
                  {dietaryProfile?.confirmedAllergens && dietaryProfile.confirmedAllergens.length > 0 && (
                    <span style={{ fontSize: '0.74rem', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldAlert size={12} /> {dietaryProfile.confirmedAllergens.length} Confirmed Allergen Filter(s) Active
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: '0 0 2px 0', fontWeight: 800 }}>
                  Prescribed by {assignedDietitian.name}
                </h3>

                <p style={{ color: '#A7F3D0', fontSize: '0.82rem', margin: 0 }}>
                  {assignedDietitian.role} • <span style={{ color: '#CBD5E1' }}>{assignedDietitian.certifications}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSymptomModalOpen(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.18)',
                  border: '1px solid #F43F5E',
                  color: '#FDA4AF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Activity size={15} />
                <span>Log Food Reaction / Flare</span>
              </button>

              <button
                onClick={() => setPrescriptionModal(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#A7F3D0',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <FileText size={15} />
                <span>View Dietitian Certificate</span>
              </button>

              <button
                onClick={() => setCalibrateModal(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Sliders size={15} />
                <span>Calibrate Macros</span>
              </button>

              <button
                onClick={() => setDietitianChatOpen(true)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  background: '#10B981',
                  border: 'none',
                  color: '#12030F',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <MessageSquare size={15} />
                <span>Ask Dietitian</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. 30-DAY NUTRITION PROGRESS TRACKER & SEQUENTIAL LOCK SELECTOR BAR */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '24px 28px', 
            marginBottom: '26px', 
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.35)', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(29, 7, 24, 0.92) 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={20} color="#10B981" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  30-Day Sequential Nutrition Progression Cycle
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#4ADE80', fontWeight: 700, background: 'rgba(74,222,128,0.12)', padding: '3px 10px', borderRadius: '10px' }}>
                  {completedCount}/30 Days Adhered ({progressPercent}%)
                </span>
                <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.15)', padding: '3px 10px', borderRadius: '10px' }}>
                  Unlocked: Up to Day {maxUnlockedDay}
                </span>
              </div>
            </div>

            {/* Cycle Progress Bar */}
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #38BDF8)', transition: 'width 0.4s ease' }} />
            </div>

            {/* 30-Day Grid Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(32px, 1fr))', gap: '6px' }}>
              {Array.from({ length: 30 }, (_, i) => {
                const dayNum = i + 1;
                const isSelected = activeDay === dayNum;
                const isDone = !!completedDays[dayNum];
                const isLocked = dayNum > maxUnlockedDay;

                return (
                  <button
                    key={dayNum}
                    onClick={() => handleSelectDay(dayNum)}
                    title={isLocked ? `Locked: Complete Day ${maxUnlockedDay} meals first` : (isDone ? `Day ${dayNum} Nutrition Completed` : `Day ${dayNum} In Progress`)}
                    style={{
                      height: '38px',
                      borderRadius: '8px',
                      border: isSelected 
                        ? '2px solid #10B981' 
                        : (isDone 
                            ? '1px solid #34D399' 
                            : (isLocked 
                                ? '1px solid rgba(255,255,255,0.06)' 
                                : '1px solid rgba(16,185,129,0.35)')),
                      backgroundColor: isSelected 
                        ? '#10B981' 
                        : (isDone 
                            ? 'rgba(16,185,129,0.18)' 
                            : (isLocked 
                                ? 'rgba(255,255,255,0.02)' 
                                : 'rgba(16,185,129,0.08)')),
                      color: isSelected 
                        ? '#12030F' 
                        : (isDone 
                            ? '#34D399' 
                            : (isLocked 
                                ? 'rgba(255,255,255,0.25)' 
                                : '#FFF')),
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1px',
                      transition: 'all 0.2s ease',
                      opacity: isLocked ? 0.45 : 1
                    }}>
                    {isDone ? (
                      <Check size={12} strokeWidth={3} />
                    ) : isLocked ? (
                      <Lock size={11} />
                    ) : (
                      <span>{dayNum}</span>
                    )}
                    <span style={{ fontSize: '0.62rem', lineHeight: 1 }}>{isDone ? `${dayNum}` : ''}</span>
                  </button>
                );
              })}
            </div>

            {/* Progression Rules Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.76rem', color: '#E2C9D6', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#34D399', display: 'inline-block' }} /> Adhered
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10B981', display: 'inline-block' }} /> Active Day
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} /> 🔒 Sequential Lock
                </span>
              </div>
              <span style={{ color: '#A7F3D0', fontWeight: 700 }}>
                💡 Sequential Adherence Enforced: Mark all meals eaten for Day {activeDay} to unlock Day {Math.min(30, activeDay + 1)}.
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. PRIMARY DIETITIAN BLUEPRINT BANNER FOR ACTIVE DAY */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '28px 32px', 
            marginBottom: '26px', 
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.45)', 
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(35,8,28,0.85) 100%)',
            boxShadow: '0 10px 35px rgba(16,185,129,0.18)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#10B981', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Utensils size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {dailySchedule ? (
                      <>
                        <span style={{ backgroundColor: '#10B981', color: '#12030F', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                          📅 {dailySchedule.date || 'Today'}
                        </span>
                        <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                          RX #{dailySchedule.prescriptionId || 'CUSTOM'} • Rev {dailySchedule.prescriptionVersion || 1}
                        </span>
                        <span style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                          Status: {dailySchedule.status || 'PUBLISHED'}
                        </span>
                        <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 700 }}>
                          ✓ Approved by {dailySchedule.nutritionistName || assignedDietitian.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ backgroundColor: '#10B981', color: '#12030F', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                          {currentPlan.weekLabel}
                        </span>
                        <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                          {currentPlan.phaseLabel}
                        </span>
                        <span style={{ 
                          backgroundColor: (prescriptionMeta?.dietaryCategory || user?.dietaryPreference || '').toLowerCase().includes('veg') ? 'rgba(74,222,128,0.2)' : 'rgba(255,158,125,0.2)', 
                          color: (prescriptionMeta?.dietaryCategory || user?.dietaryPreference || '').toLowerCase().includes('veg') ? '#4ADE80' : '#FF9E7D', 
                          fontSize: '0.72rem', 
                          fontWeight: 800, 
                          padding: '3px 8px', 
                          borderRadius: '6px',
                          border: (prescriptionMeta?.dietaryCategory || user?.dietaryPreference || '').toLowerCase().includes('veg') ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,158,125,0.4)'
                        }}>
                          {prescriptionMeta?.dietaryCategory || user?.dietaryPreference || 'Standard Balanced'}
                        </span>
                        <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 700 }}>
                          ✓ Dietitian Certified
                        </span>
                      </>
                    )}
                  </div>

                  <h2 style={{ fontSize: '1.5rem', color: '#FFF', margin: '0 0 6px 0', fontWeight: 800 }}>
                    {dailySchedule ? `Daily Approved Schedule (${dailySchedule.date})` : currentPlan.dayTitle}
                  </h2>

                  <p style={{ color: '#E2C9D6', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', lineHeight: '1.5', maxWidth: '720px' }}>
                    "{dailySchedule ? `Personalized daily nutrition schedule verified and published by ${dailySchedule.nutritionistName || assignedDietitian.name}.` : currentPlan.rationale}"
                  </p>
                </div>
              </div>

              {/* Day Macro Targets Overview */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Energy Goal</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ADE80' }}>{totalPrescribedCalories} kcal</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Target Protein</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38BDF8' }}>{totalPrescribedProtein}g</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Adherence</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FACC15' }}>{adherencePercent}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. REAL-TIME MACRONUTRIENT & HYDRATION TRACKER BAR */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '24px 28px', 
            marginBottom: '26px', 
            borderRadius: '20px',
            border: '1px solid rgba(255, 158, 125, 0.25)', 
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.4) 0%, rgba(29, 7, 24, 0.9) 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PieChart size={20} color="var(--peach-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  Day {activeDay} Macronutrient Consumption & Water Status
                </h3>
              </div>
              <span style={{ fontSize: '0.84rem', color: '#34D399', fontWeight: 800, background: 'rgba(52,211,153,0.12)', padding: '4px 12px', borderRadius: '10px' }}>
                {consumedCount} of {currentMeals.length} Prescribed Meals Eaten
              </span>
            </div>

            {/* Macro Progress Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700 }}>Energy Intake</span>
                  <strong style={{ color: '#4ADE80' }}>{consumedCalories} / {totalPrescribedCalories} kcal</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((consumedCalories / totalPrescribedCalories) * 100))}%`, height: '100%', background: '#4ADE80', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700 }}>Protein Synthesis</span>
                  <strong style={{ color: '#38BDF8' }}>{consumedProtein} / {totalPrescribedProtein}g</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((consumedProtein / totalPrescribedProtein) * 100))}%`, height: '100%', background: '#38BDF8', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700 }}>Glycogen Carbs</span>
                  <strong style={{ color: '#FACC15' }}>{consumedCarbs} / {totalPrescribedCarbs}g</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((consumedCarbs / totalPrescribedCarbs) * 100))}%`, height: '100%', background: '#FACC15', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 700 }}>Essential Lipids</span>
                  <strong style={{ color: '#FF7043' }}>{consumedFats} / {totalPrescribedFats}g</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, Math.round((consumedFats / totalPrescribedFats) * 100))}%`, height: '100%', background: '#FF7043', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            </div>

            {/* Hydration Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>DAY {activeDay} HYDRATION STATUS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                    {(waterDrunkMl / 1000).toFixed(2)}L / {prescriptionMeta?.hydrationLiters || 3.5}L Logged
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleAddWater(250)} style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  +250ml Glass
                </button>
                <button onClick={() => handleAddWater(500)} style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38BDF8', color: '#38BDF8', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  +500ml Shaker
                </button>
                <button onClick={() => setWaterDrunkMl(0)} style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1', fontSize: '0.82rem', cursor: 'pointer' }}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. PRESCRIBED DAILY MEAL TIMELINE & NUTRITIONAL CHECKLIST */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                  Day {activeDay} Meal Protocol ({currentMeals.length} Targeted Feedings)
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  Check off each meal as consumed to complete Day {activeDay} and unlock Day {Math.min(30, activeDay + 1)}.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: consumedCount === currentMeals.length ? '#4ADE80' : '#FFB8A1', fontWeight: 800, background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: '10px' }}>
                  {consumedCount} / {currentMeals.length} Meals Eaten
                </span>
                <button
                  onClick={handleCompleteAllMeals}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid #34D399',
                    color: '#34D399',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <CheckSquare size={14} />
                  <span>Check All Meals Done</span>
                </button>
              </div>
            </div>

            {currentMeals.map((meal, idx) => {
              const isConsumed = meal.isScheduleSlot 
                ? (meal.consumptionStatus === 'COMPLETED' || meal.consumptionStatus === 'PARTIALLY_EATEN' || meal.consumptionStatus === 'SUBSTITUTED')
                : !!consumedMeals[meal.id];

              return (
                <div 
                  key={meal.id || idx}
                  style={{
                    padding: '24px 28px',
                    borderRadius: '18px',
                    border: isConsumed ? '1px solid #10B981' : '1px solid rgba(255, 158, 125, 0.2)',
                    background: isConsumed ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(29,7,24,0.85) 100%)' : 'rgba(29,7,24,0.75)',
                    transition: 'all 0.25s ease'
                  }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                          MEAL #{idx + 1} • {meal.type}
                        </span>
                        <span style={{ color: '#CBD5E1', fontSize: '0.76rem' }}>
                          ⏰ {meal.timing}
                        </span>
                        {meal.servingSize && (
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#E2C9D6', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}>
                            Portion: {meal.servingSize}
                          </span>
                        )}
                        {meal.isScheduleSlot && (
                          <>
                            {meal.consumptionStatus === 'COMPLETED' && (
                              <span style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                ✓ 100% CONSUMED
                              </span>
                            )}
                            {meal.consumptionStatus === 'PARTIALLY_EATEN' && (
                              <span style={{ backgroundColor: 'rgba(250,204,21,0.2)', color: '#FACC15', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                ⚠️ {meal.actualPortionEatenPct}% EATEN
                              </span>
                            )}
                            {meal.consumptionStatus === 'SUBSTITUTED' && (
                              <span style={{ backgroundColor: 'rgba(168,85,247,0.2)', color: '#C084FC', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                🔄 SUBSTITUTED {meal.substitutedWith ? `(${meal.substitutedWith})` : ''}
                              </span>
                            )}
                            {meal.consumptionStatus === 'SKIPPED' && (
                              <span style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#EF4444', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                                ✕ SKIPPED
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: '4px 0 0 0' }}>
                        {meal.title}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => setSelectedMealDetail(meal)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: 'rgba(16,185,129,0.12)',
                          border: '1px solid #10B981',
                          color: '#A7F3D0',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                        <Apple size={14} />
                        <span>Recipe & Ingredients</span>
                      </button>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ADE80' }}>
                          {meal.calories} <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dietitian Clinical Note */}
                  {meal.dietitianCue && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10B981', marginBottom: '16px', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#A7F3D0' }}>Dietitian Mechanism:</strong> {meal.dietitianCue}
                    </div>
                  )}

                  {/* Macros & Toggle Action Bar */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                      <span>Protein: <strong style={{ color: '#38BDF8' }}>{meal.protein}g</strong></span>
                      <span>Carbs: <strong style={{ color: '#FACC15' }}>{meal.carbs}g</strong></span>
                      <span>Fats: <strong style={{ color: '#FF7043' }}>{meal.fats}g</strong></span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {meal.isScheduleSlot && (
                        <button
                          onClick={() => setSlotLogModal({
                            slot: meal,
                            status: meal.consumptionStatus || 'COMPLETED',
                            portionPct: meal.actualPortionEatenPct || 100,
                            substitutedWith: meal.substitutedWith || '',
                            notes: meal.clientFeedbackNotes || ''
                          })}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            background: 'rgba(56, 189, 248, 0.12)',
                            color: '#38BDF8',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                          <Edit3 size={14} />
                          <span>Log Portion / Notes</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleMealConsumed(meal.id)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          border: isConsumed ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.2)',
                          background: isConsumed ? '#10B981' : 'rgba(255,255,255,0.04)',
                          color: isConsumed ? '#12030F' : '#FFF',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}>
                        {isConsumed && <Check size={14} strokeWidth={3} />}
                        <span>{isConsumed ? 'Consumed ✓' : 'Mark as Eaten'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 6. FINISH & LOG DAY NUTRITION BANNER */}
          {/* ========================================================================= */}
          <div style={{ 
            padding: '28px 32px', 
            borderRadius: '20px',
            border: isDayFullyConsumed ? '2px solid #10B981' : '1px solid rgba(16,185,129,0.35)', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(29, 7, 24, 0.95) 100%)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isDayFullyConsumed ? '#10B981' : '#38BDF8', textTransform: 'uppercase' }}>
                  {isDayFullyConsumed ? '✓ ALL MEALS CONSUMED' : 'DAY IN PROGRESS'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  ({consumedCount}/{currentMeals.length} meals logged)
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                Complete & Log Day {activeDay} Nutrition
              </h3>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Fulfilling all meals verifies your daily adherence score, awards Nutrition XP, and unlocks Day {Math.min(30, activeDay + 1)}.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {completedDays[activeDay] ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.92rem', background: 'rgba(16,185,129,0.15)', padding: '10px 18px', borderRadius: '12px' }}>
                    ✓ Day {activeDay} Nutrition Adhered
                  </span>
                  {activeDay < 30 && (
                    <button
                      onClick={() => setActiveDay(activeDay + 1)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10B981 0%, #38BDF8 100%)',
                        border: 'none',
                        color: '#12030F',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                      <span>Proceed to Day {activeDay + 1}</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogDailyNutrition}
                  disabled={logging}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    background: consumedCount === currentMeals.length ? 'linear-gradient(135deg, #10B981 0%, #38BDF8 100%)' : 'rgba(16,185,129,0.15)',
                    border: consumedCount === currentMeals.length ? 'none' : '1px solid rgba(16,185,129,0.35)',
                    color: consumedCount === currentMeals.length ? '#12030F' : '#A7F3D0',
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    cursor: logging ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: consumedCount === currentMeals.length ? '0 6px 20px rgba(16,185,129,0.4)' : 'none'
                  }}>
                  <CheckCircle2 size={18} />
                  <span>{logging ? 'Logging...' : `Complete Day ${activeDay} & Unlock Day ${Math.min(30, activeDay + 1)}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODAL 1: OFFICIAL DIETITIAN PRESCRIPTION CERTIFICATE */}
          {/* ========================================================================= */}
          {prescriptionModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '36px', maxWidth: '680px', width: '100%', background: '#1d0718', border: '2px solid #10B981', borderRadius: '22px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ background: '#10B981', color: '#12030F', fontSize: '0.72rem', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
                        OFFICIAL NUTRITION PRESCRIPTION
                      </span>
                      <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 800 }}>
                        ✓ STATUS: CLINICALLY APPROVED
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.6rem', color: '#FFF', margin: '4px 0 0 0', fontWeight: 900 }}>
                      30-Day Periodized Nutrition Blueprint
                    </h2>
                  </div>
                  <button onClick={() => setPrescriptionModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={22} />
                  </button>
                </div>

                {/* Athlete & Dietitian Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Athlete Profile</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{user?.fullName || 'John Doe'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#A7F3D0', marginTop: '2px' }}>Goal: {prescriptionMeta?.targetGoal}</div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>Plan: {prescriptionMeta?.dietaryCategory}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Prescribing Dietitian</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>{assignedDietitian.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#A7F3D0', marginTop: '2px' }}>{assignedDietitian.role}</div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>ID: {prescriptionMeta?.prescriptionId}</div>
                  </div>
                </div>

                {/* 4 Nutritional Mesocycles */}
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#FFF', fontWeight: 800, marginBottom: '10px' }}>
                    4-Phase Nutritional Periodization Architecture
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(prescriptionMeta?.phases || DEFAULT_NUTRITION_PHASES).map((ph, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '10px', borderLeft: `3px solid ${idx === 0 ? '#10B981' : idx === 1 ? '#38BDF8' : idx === 2 ? '#FACC15' : '#FF7043'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFF' }}>
                            Phase {ph.phase}: {ph.title} <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>({ph.days})</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '2px' }}>
                            {ph.focus}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#34D399', fontWeight: 800, background: 'rgba(52,211,153,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietitian Clinical Directives */}
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px dashed #10B981', padding: '14px', borderRadius: '12px', marginBottom: '22px', fontSize: '0.84rem', color: '#E2C9D6', lineHeight: '1.5' }}>
                  <strong style={{ color: '#A7F3D0' }}>Dietitian Clinical Directives:</strong> "{prescriptionMeta?.dietitianNotes || DEFAULT_NUTRITION_PRESCRIPTION.dietitianNotes}"
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Digitally Certified on {prescriptionMeta?.issuedDate || 'September 23, 2026'}
                  </div>
                  <button onClick={() => setPrescriptionModal(false)} className="btn-primary" style={{ padding: '8px 24px' }}>
                    Acknowledge & Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 2: LOCKED DAY NOTIFICATION POPUP */}
          {/* ========================================================================= */}
          {lockedDayModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '32px', maxWidth: '480px', width: '100%', background: '#1d0718', border: '2px solid #10B981', borderRadius: '18px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Lock size={30} />
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: '0 0 8px 0', fontWeight: 800 }}>
                  🔒 Day {lockedDayModal.targetDay} Nutrition is Locked
                </h3>

                <p style={{ color: '#E2C9D6', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                  {lockedDayModal.reason}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.84rem', color: '#38BDF8', textAlign: 'left' }}>
                  <strong>Next Action:</strong> Navigate to <strong>Day {lockedDayModal.requiredDay}</strong>, mark all {allPlans?.[lockedDayModal.requiredDay]?.meals?.length || 5} prescribed meals as eaten, and log your day.
                </div>

                <button
                  onClick={() => {
                    setActiveDay(lockedDayModal.requiredDay);
                    setLockedDayModal(null);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px' }}>
                  Go to Active Day {lockedDayModal.requiredDay}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 3: CALIBRATE & REQUEST DIETITIAN PROTOCOL APPROVAL */}
          {/* ========================================================================= */}
          {calibrateModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '36px', maxWidth: '520px', width: '100%', background: '#1d0718', border: '2px solid #10B981', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                      Calibrate Nutrition Protocol
                    </h3>
                    <p style={{ color: '#A7F3D0', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                      Request updated dietitian macro & meal parameters
                    </p>
                  </div>
                  <button onClick={() => setCalibrateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>Primary Nutritional Goal</label>
                    <select 
                      value={customGoal} 
                      onChange={e => setCustomGoal(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.3)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Hypertrophic Lean Mass & Recovery">Hypertrophic Lean Mass & Recovery</option>
                      <option value="Metabolic Fat Shred & Glycogen Depletion">Metabolic Fat Shred & Glycogen Depletion</option>
                      <option value="Clean Plant-Based Strength">Clean Plant-Based Strength</option>
                      <option value="High-Performance Athletic Energy">High-Performance Athletic Energy</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>Dietary Preference Blueprint</label>
                    <select 
                      value={customDiet} 
                      onChange={e => setCustomDiet(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.3)', color: '#FFF', fontSize: '0.9rem' }}>
                      <option value="Vegetarian">🌱 100% Vegetarian (Paneer, Soya, Greek Yogurt, Moong Dal)</option>
                      <option value="Vegan">🌿 Vegan (100% Plant-Based Tofu, Tempeh & Pea Protein)</option>
                      <option value="Pescatarian">🐟 Pescatarian (Wild Salmon, Cod & Plant/Dairy)</option>
                      <option value="High Protein Keto">🥑 High Protein Keto / Low Carb</option>
                      <option value="Standard Balanced">⚡ Standard Balanced (Lean Poultry, Meat & Salmon)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>Calibrated Daily Calorie Target (kcal)</label>
                    <input 
                      type="number" 
                      value={customCals}
                      onChange={e => setCustomCals(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.3)', color: '#FFF', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setCalibrateModal(false)} style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button 
                    onClick={handleCalibrateNutrition} 
                    disabled={calibrating}
                    className="btn-primary" 
                    style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {calibrating ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
                    <span>{calibrating ? 'Reviewing with Dietitian...' : 'Request Dietitian Sign-off'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 4: MEAL INGREDIENTS & RECIPE DETAIL */}
          {/* ========================================================================= */}
          {selectedMealDetail && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '32px', maxWidth: '540px', width: '100%', background: '#1d0718', border: '1px solid #10B981', borderRadius: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                    {selectedMealDetail.title}
                  </h3>
                  <button onClick={() => setSelectedMealDetail(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Calories</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ADE80' }}>{selectedMealDetail.calories} kcal</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Protein</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38BDF8' }}>{selectedMealDetail.protein}g</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Carbs</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FACC15' }}>{selectedMealDetail.carbs}g</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Fats</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FF7043' }}>{selectedMealDetail.fats}g</div>
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Prescribed Whole Food Ingredients:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.6' }}>
                    {selectedMealDetail.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(16,185,129,0.1)', borderLeft: '3px solid #10B981', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem', color: '#CBD5E1' }}>
                  <strong style={{ color: '#A7F3D0' }}>Micronutrient Matrix:</strong> {selectedMealDetail.micronutrients}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setSelectedMealDetail(null)} className="btn-primary" style={{ padding: '8px 22px' }}>
                    Got It
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 4B: MEAL SLOT CONSUMPTION & SUBSTITUTION LOGGER (Phase 6) */}
          {/* ========================================================================= */}
          {slotLogModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1150, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '28px 32px', maxWidth: '540px', width: '100%', background: '#1d0718', border: '2px solid #38BDF8', borderRadius: '22px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      {slotLogModal.slot.type} • {slotLogModal.slot.timing}
                    </span>
                    <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: '6px 0 2px 0', fontWeight: 800 }}>
                      Log Consumption & Portion
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>
                      {slotLogModal.slot.title} ({slotLogModal.slot.calories} kcal)
                    </p>
                  </div>
                  <button onClick={() => setSlotLogModal(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Consumption Status Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#E2C9D6', fontWeight: 700, marginBottom: '8px' }}>
                    Consumption Status:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'COMPLETED', label: '✓ 100% Eaten', color: '#10B981' },
                      { id: 'PARTIALLY_EATEN', label: '⚠️ Partially Eaten', color: '#FACC15' },
                      { id: 'SUBSTITUTED', label: '🔄 Substituted', color: '#C084FC' },
                      { id: 'SKIPPED', label: '✕ Skipped Meal', color: '#EF4444' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSlotLogModal(prev => ({
                          ...prev,
                          status: st.id,
                          portionPct: st.id === 'COMPLETED' ? 100 : (st.id === 'SKIPPED' ? 0 : (prev.portionPct || 50))
                        }))}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: slotLogModal.status === st.id ? `2px solid ${st.color}` : '1px solid rgba(255,255,255,0.1)',
                          background: slotLogModal.status === st.id ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.3)',
                          color: slotLogModal.status === st.id ? st.color : '#CBD5E1',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}>
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portion % Slider if Partially Eaten */}
                {slotLogModal.status === 'PARTIALLY_EATEN' && (
                  <div style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ color: '#E2C9D6', fontWeight: 700 }}>Actual Portion Consumed:</span>
                      <strong style={{ color: '#FACC15' }}>{slotLogModal.portionPct}%</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[25, 50, 75].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setSlotLogModal(prev => ({ ...prev, portionPct: pct }))}
                          style={{
                            flex: 1,
                            padding: '6px',
                            borderRadius: '8px',
                            border: slotLogModal.portionPct === pct ? '1.5px solid #FACC15' : '1px solid rgba(255,255,255,0.1)',
                            background: slotLogModal.portionPct === pct ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
                            color: slotLogModal.portionPct === pct ? '#FACC15' : '#FFF',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}>
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Substituted Selection */}
                {slotLogModal.status === 'SUBSTITUTED' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#E2C9D6', fontWeight: 700, marginBottom: '6px' }}>
                      Substituted With:
                    </label>
                    {slotLogModal.slot.allowedSubstitutions && slotLogModal.slot.allowedSubstitutions.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        {slotLogModal.slot.allowedSubstitutions.map((sub, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSlotLogModal(prev => ({ ...prev, substitutedWith: sub }))}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              border: slotLogModal.substitutedWith === sub ? '1px solid #C084FC' : '1px solid rgba(255,255,255,0.1)',
                              background: slotLogModal.substitutedWith === sub ? 'rgba(192, 132, 252, 0.2)' : 'rgba(0,0,0,0.3)',
                              color: slotLogModal.substitutedWith === sub ? '#C084FC' : '#CBD5E1',
                              cursor: 'pointer'
                            }}>
                            ✓ {sub}
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Specify substitution item..."
                      value={slotLogModal.substitutedWith}
                      onChange={e => setSlotLogModal(prev => ({ ...prev, substitutedWith: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFF',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                )}

                {/* Feedback Note to Nutritionist */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#E2C9D6', fontWeight: 700, marginBottom: '6px' }}>
                    Feedback / Dietary Notes for Specialist:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Felt full halfway through, substituted paneer with tofu, enjoyed the seasoning..."
                    value={slotLogModal.notes}
                    onChange={e => setSlotLogModal(prev => ({ ...prev, notes: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.82rem',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSlotLogModal(null)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#CBD5E1',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleLogSlotConsumption(
                        slotLogModal.slot.slotId,
                        slotLogModal.status || 'COMPLETED',
                        slotLogModal.portionPct || 100,
                        slotLogModal.substitutedWith || null,
                        slotLogModal.notes || ''
                      );
                      setSlotLogModal(null);
                    }}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10B981 0%, #38BDF8 100%)',
                      border: 'none',
                      color: '#12030F',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}>
                    Save Consumption Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 5: DEDICATED DIETITIAN CONSULTATION & CHAT MODAL */}
          {/* ========================================================================= */}
          {dietitianChatOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '24px 28px', maxWidth: '520px', width: '100%', background: '#1d0718', border: '1px solid #10B981', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '620px', maxHeight: '90vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={assignedDietitian.avatar} alt={assignedDietitian.name} style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #10B981' }} />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0, fontWeight: 800 }}>{assignedDietitian.name}</h4>
                      <span style={{ fontSize: '0.74rem', color: '#4ADE80' }}>● Online • Clinical Nutrition Desk</span>
                    </div>
                  </div>
                  <button onClick={() => setDietitianChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Quick Action Discussion Chips */}
                <div style={{ display: 'flex', gap: '6px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setChatInput("Could we review today's meal schedule and portions?")}
                    style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.15)', color: '#A7F3D0', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                    💬 Discuss Today's Meals
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput("I would like to request an alternative substitution for today's meal.")}
                    style={{ fontSize: '0.72rem', background: 'rgba(56,189,248,0.15)', color: '#BAE6FD', border: '1px solid rgba(56,189,248,0.3)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                    🔄 Request Substitution
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput("Could you please review my recent meal intake and symptom logs?")}
                    style={{ fontSize: '0.72rem', background: 'rgba(250,204,21,0.15)', color: '#FEF08A', border: '1px solid rgba(250,204,21,0.3)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                    📋 Request Review
                  </button>
                </div>

                {/* Chat message history stream */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginTop: '60px' }}>
                      Ask {assignedDietitian.name} any question regarding meal timing, calorie targets, or food substitutions.
                    </div>
                  ) : (
                    chatMessages.map((m, idx) => {
                      const isMe = m.senderRole === 'USER' || m.senderEmail === (user?.email || 'aby@example.com');
                      return (
                        <div key={m.id || idx} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '80%',
                            padding: '10px 14px',
                            borderRadius: '14px',
                            background: isMe ? '#10B981' : 'rgba(255,255,255,0.08)',
                            color: isMe ? '#12030F' : '#FFF',
                            fontWeight: isMe ? 700 : 400,
                            fontSize: '0.86rem',
                            lineHeight: '1.4'
                          }}>
                          <div>{m.text}</div>
                          <div style={{ fontSize: '0.68rem', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                            {m.timestamp || 'Just now'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input box */}
              <form onSubmit={handleSendDietitianMessage} style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={`Ask ${assignedDietitian.name.split(' ')[0]} a question...`}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16,185,129,0.3)', color: '#FFF', fontSize: '0.88rem' }}
                />
                <button type="submit" style={{ padding: '10px 16px', borderRadius: '10px', background: '#10B981', border: 'none', color: '#12030F', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

          {/* ========================================================================= */}
          {/* MODAL 6: LOG ACHIEVEMENT CELEBRATION */}
          {/* ========================================================================= */}
          {achievementData && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '36px', maxWidth: '480px', width: '100%', background: '#1d0718', border: '2px solid #34D399', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(52,211,153,0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Trophy size={36} />
                </div>

                <h3 style={{ fontSize: '1.5rem', color: '#FFF', margin: '0 0 6px 0', fontWeight: 800 }}>
                  Day {achievementData.dayNumber} Nutrition Completed!
                </h3>
                <p style={{ color: '#A7F3D0', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                  {achievementData.planTitle}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Total Energy</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4ADE80' }}>{achievementData.calories} kcal</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Protein Logged</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38BDF8' }}>{achievementData.protein}g</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(52,211,153,0.1)', border: '1px solid #34D399', padding: '14px', borderRadius: '12px', marginBottom: '22px', fontSize: '0.86rem', color: '#FFF', textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <HeartPulse size={16} /> Day {achievementData.nextDay} Unlocked
                  </div>
                  <div style={{ color: '#E2C9D6', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    🌱 Daily nutrition adherence of {achievementData.adherence}% recorded. Intracellular hydration logged at {achievementData.water}L. <strong>Day {achievementData.nextDay}</strong> nutrition protocol is now accessible!
                  </div>
                </div>

                <button 
                  onClick={() => setAchievementData(null)}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
                  Continue to Day {achievementData.nextDay}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 7: 30-DAY PROGRAM TITAN CYCLE COMPLETION */}
          {/* ========================================================================= */}
          {cycleCompletedModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(15px)'
            }}>
              <div style={{ padding: '40px', maxWidth: '540px', width: '100%', background: '#1d0718', border: '2px solid #34D399', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(52,211,153,0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Award size={42} />
                </div>

                <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: '0 0 8px 0', fontWeight: 800 }}>
                  👑 30-DAY METABOLIC NUTRITION MASTER!
                </h2>
                <p style={{ color: '#A7F3D0', fontSize: '0.95rem', margin: '0 0 20px 0', fontWeight: 700 }}>
                  You have successfully adhered to all 30 days of your Clinical Dietitian's nutrition split!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Total Energy</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ADE80' }}>73,500+ kcal</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Total Protein</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8' }}>4,950g</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Adherence</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FACC15' }}>100%</div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Ready to restart your 30-day nutrition progression with optimized caloric baselines?
                </p>

                <button 
                  onClick={handleRestartCycle}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <RotateCcw size={18} />
                  <span>Restart 30-Day Nutrition Cycle</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL 8: FOOD REACTION & SYMPTOM FLARE DIARY */}
          {/* ========================================================================= */}
          {symptomModalOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '20px', backdropFilter: 'blur(12px)'
            }}>
              <div style={{ padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#1d0718', border: '2px solid #F43F5E', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244,63,94,0.18)', color: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Activity size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                        Food Reaction & Symptom Diary
                      </h3>
                      <p style={{ color: '#FDA4AF', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                        Report suspected triggers directly to your clinical nutritionist
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSymptomModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                {symptomSuccessNote && (
                  <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34D399', color: '#34D399', padding: '12px 16px', borderRadius: '10px', fontSize: '0.86rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} /> {symptomSuccessNote}
                  </div>
                )}

                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '20px', lineHeight: '1.5' }}>
                  <strong style={{ color: '#F43F5E' }}>Clinical Guideline:</strong> Logged reactions are recorded as client-reported observations. They will be reviewed by your assigned nutritionist to guide elimination trials or clinical referral. <em>(SmartFit does not algorithmically diagnose allergies or systemic diseases).</em>
                </div>

                <form onSubmit={handleLogSymptom} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                      Suspected Food or Meal Ingested *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Scrambled eggs with cheese, almond butter, soy sauce"
                      value={symptomForm.foodTrigger}
                      onChange={e => setSymptomForm(prev => ({ ...prev, foodTrigger: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(244,63,94,0.35)', color: '#FFF', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                        Reaction Category
                      </label>
                      <select 
                        value={symptomForm.symptomCategory}
                        onChange={e => setSymptomForm(prev => ({ ...prev, symptomCategory: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(244,63,94,0.35)', color: '#FFF', fontSize: '0.88rem' }}>
                        <option value="SKIN_ECZEMA">Skin / Eczema / Hives / Flushing</option>
                        <option value="GI_DISTRESS">Digestive Discomfort / Bloating / Cramps</option>
                        <option value="ENERGY_CRASH">Severe Fatigue / Energy Crash / Brain Fog</option>
                        <option value="HEADACHE_MIGRAINE">Headache / Migraine</option>
                        <option value="RESPIRATORY">Congestion / Sneezing / Sinus</option>
                        <option value="JOINT_PAIN">Joint Pain / Inflammation</option>
                        <option value="OTHER">Other Unverified Symptom</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                        Severity (Scale 1 to 5)
                      </label>
                      <select 
                        value={symptomForm.severity}
                        onChange={e => setSymptomForm(prev => ({ ...prev, severity: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(244,63,94,0.35)', color: '#FFF', fontSize: '0.88rem' }}>
                        <option value="1">1 - Very Mild (Barely noticeable)</option>
                        <option value="2">2 - Mild (Noticeable, manageable)</option>
                        <option value="3">3 - Moderate (Uncomfortable)</option>
                        <option value="4">4 - High (Significant distress)</option>
                        <option value="5">5 - Severe (Urgent clinical review)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                        Onset Delay (Minutes After Meal)
                      </label>
                      <input 
                        type="number"
                        min="1"
                        max="1440"
                        value={symptomForm.onsetLatencyMins}
                        onChange={e => setSymptomForm(prev => ({ ...prev, onsetLatencyMins: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(244,63,94,0.35)', color: '#FFF', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                        Associated Meal ID
                      </label>
                      <select 
                        value={symptomForm.mealId}
                        onChange={e => setSymptomForm(prev => ({ ...prev, mealId: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(244,63,94,0.35)', color: '#FFF', fontSize: '0.88rem' }}>
                        <option value="">-- General / Off-Plan Food --</option>
                        {currentMeals.map((m, i) => (
                          <option key={m.id || i} value={m.id}>Meal #{i+1}: {m.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '6px', fontWeight: 700 }}>
                      Symptom Description & Context
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Describe what happened, physical sensations, skin appearance, or timing..."
                      value={symptomForm.notes}
                      onChange={e => setSymptomForm(prev => ({ ...prev, notes: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(244,63,94,0.35)', color: '#FFF', fontSize: '0.88rem', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                    <button 
                      type="button"
                      onClick={() => setSymptomModalOpen(false)}
                      style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={symptomSubmitting}
                      style={{
                        padding: '10px 24px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                        border: 'none',
                        color: '#FFF',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                      {symptomSubmitting ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
                      <span>{symptomSubmitting ? 'Logging...' : 'Transmit to Nutritionist'}</span>
                    </button>
                  </div>
                </form>

                {/* Past Reported Symptoms */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '18px' }}>
                  <h4 style={{ fontSize: '1rem', color: '#FFF', margin: '0 0 12px 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck2 size={16} color="#FDA4AF" />
                    <span>Reported Symptom History ({symptomLogs.length})</span>
                  </h4>

                  {symptomLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                      No symptom flare events recorded. You have a clean tolerability history.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                      {symptomLogs.map((log, idx) => (
                        <div key={log.id || idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', borderLeft: `3px solid ${log.severity >= 4 ? '#EF4444' : '#F59E0B'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, color: '#FFF', fontSize: '0.86rem' }}>
                              {log.foodTrigger} ({log.symptomCategory})
                            </span>
                            <span style={{ fontSize: '0.74rem', background: log.reviewedByNutritionist ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)', color: log.reviewedByNutritionist ? '#34D399' : '#FBBF24', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                              {log.reviewedByNutritionist ? '✓ Reviewed by Nutritionist' : '⏳ Pending Review'}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '0.78rem', color: '#CBD5E1' }}>
                            {log.notes || 'No additional note'} • Severity: {log.severity}/5 • Delay: {log.onsetLatencyMins || 45}m
                          </p>
                          {log.nutritionistNotes && (
                            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.76rem', color: '#A7F3D0' }}>
                              <strong>Nutritionist Note:</strong> {log.nutritionistNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
