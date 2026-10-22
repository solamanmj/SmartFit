import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Sparkles, ShieldCheck, HeartPulse, Droplets, Dumbbell, Utensils,
  Award, Clock, Check, Info, Flame, Search, ChevronRight, X,
  Shield, CheckCircle2, Zap, Sun, Moon, Sunrise, Coffee, AlertCircle,
  ExternalLink, Layers, ArrowRight, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// COMPREHENSIVE CLINICAL SUPPLEMENT RECOMMENDATION CATALOG
// ============================================================================
const SUPPLEMENT_CATALOG = [
  {
    id: 'supp-1',
    name: 'Whey Protein Isolate / Hydrolyzed',
    badge: 'MUSCLE PROTEIN SYNTHESIS (MPS)',
    category: 'Muscle & Strength',
    icon: Dumbbell,
    accentColor: '#FF7043',
    rating: '5.0 / 5.0 (Clinical Standard)',
    shortDesc: 'Rapidly absorbing ultra-pure whey protein with a complete essential amino acid and leucine profile.',
    keyBenefit: 'Accelerates post-exercise muscle tissue repair, promotes lean hypertrophy, and helps hit daily protein targets.',
    recommendedDosage: '25g - 30g Protein (1 Level Scoop)',
    whenToConsume: 'Within 30–60 minutes post-workout, or as a high-protein mid-morning snack between meals.',
    howToConsume: 'Mix 1 scoop with 250–300ml cold water or milk in a shaker bottle. Can also be blended into oatmeal or morning smoothies.',
    keyCompounds: [
      'Leucine (2.7g - Primary MPS Trigger)',
      'Total BCAAs (5.5g)',
      'L-Glutamine (4.2g)',
      'Zero Added Sugar & Low Lactose'
    ],
    dietitianNote: 'Whey protein isolate undergoes cross-flow microfiltration to remove almost all fats and lactose, making it ideal for fast gastric emptying after resistance training.'
  },
  {
    id: 'supp-2',
    name: 'Clean Caloric Mass Gainer',
    badge: 'HYPERTROPHY CALORIC SURPLUS',
    category: 'Muscle & Strength',
    icon: Flame,
    accentColor: '#F59E0B',
    rating: '4.8 / 5.0',
    shortDesc: 'Nutrient-dense complex carbohydrate and multi-stage protein matrix formulated for hardgainers and high-metabolic athletes.',
    keyBenefit: 'Allows athletes to conveniently achieve an optimal 350-500 kcal surplus without excessive stomach fullness or digestive bloat.',
    recommendedDosage: '1 - 2 Scoops (yielding 500 - 800 kcal & 45g+ Protein)',
    whenToConsume: 'Post-workout on heavy compound lifting days, or between breakfast and lunch as an energy-dense meal bridge.',
    howToConsume: 'Blend with 400ml whole milk, 1 banana, and 1 tbsp natural peanut butter for sustained slow-burning glycogen delivery.',
    keyCompounds: [
      'Complex Oat Flour & Maltodextrin',
      'Whey Isolate + Micellar Casein Matrix',
      'Medium-Chain Triglycerides (MCT Fats)',
      'Digestive Enzyme Complex (DigeZyme®)'
    ],
    dietitianNote: 'Recommended primarily for ectomorphs or athletes struggling to hit high caloric targets through solid whole foods alone. Focus on clean carbohydrate sources.'
  },
  {
    id: 'supp-3',
    name: 'Creatine Monohydrate (Creapure®)',
    badge: 'ATP REGENERATION & 1RM POWER',
    category: 'Muscle & Strength',
    icon: Zap,
    accentColor: '#38BDF8',
    rating: '5.0 / 5.0 (Gold Standard)',
    shortDesc: 'The single most extensively researched sports nutrition compound for absolute strength, power, and cellular hydration.',
    keyBenefit: 'Replenishes intramuscular phosphocreatine stores to rapidly regenerate ATP during high-intensity lifting sets.',
    recommendedDosage: '3g - 5g Daily (1 Level Scoop)',
    whenToConsume: 'Every day with consistency — either in your post-workout shake or in the morning with a meal. No complex loading phase required.',
    howToConsume: 'Dissolve in room-temperature water, 100% fruit juice, or add directly into your protein shake. Ensure at least 3.5L daily hydration.',
    keyCompounds: [
      '100% Ultra-Pure Micronized Creatine Monohydrate (5,000mg)',
      'Zero Fillers or Excipients',
      'Creapure® 99.95% Purity Standard'
    ],
    dietitianNote: 'Creatine draws water into the muscle cell sarcoplasm (intracellular hydration), which directly increases muscle mechanical tension and protein synthesis.'
  },
  {
    id: 'supp-4',
    name: 'Multi-Nutrient Daily Vitamins & Minerals',
    badge: 'MICRONUTRIENT & METABOLIC HEALTH',
    category: 'Health & Micronutrients',
    icon: Sparkles,
    accentColor: '#10B981',
    rating: '4.9 / 5.0',
    shortDesc: 'Complete clinical spectrum of bioactive vitamins, chelated minerals, and co-factors designed for training demands.',
    keyBenefit: 'Bridges daily nutritional gaps, regulates metabolic enzyme function, bolsters immune defenses, and prevents micronutrient deficiencies.',
    recommendedDosage: '1 - 2 Tablets / Capsules Daily',
    whenToConsume: 'In the morning with breakfast.',
    howToConsume: 'Take with a whole meal containing healthy dietary fats (eggs, avocado, or nuts) to maximize the absorption of fat-soluble vitamins (A, D3, E, K2).',
    keyCompounds: [
      'Vitamin D3 (2,000 IU) & Vitamin K2 MK-7 (100mcg)',
      'High-Absorption B-Complex (B1, B2, B6, B12, Folate)',
      'Chelated Zinc, Selenium & Chromium',
      'Antioxidant Citrus Bioflavonoids'
    ],
    dietitianNote: 'High training volume increases metabolic turnover of water-soluble B vitamins and antioxidants. A quality multivitamin acts as nutritional insurance.'
  },
  {
    id: 'supp-5',
    name: 'Triple Strength Omega-3 Fish Oil',
    badge: 'ANTI-INFLAMMATORY & JOINT HEALTH',
    category: 'Recovery & Sleep',
    icon: HeartPulse,
    accentColor: '#EC4899',
    rating: '5.0 / 5.0',
    shortDesc: 'Molecularly distilled wild marine oil delivering high concentrations of active EPA and DHA essential fatty acids.',
    keyBenefit: 'Reduces exercise-induced joint inflammation, supports cardiovascular arterial elasticity, and preserves brain lipid membranes.',
    recommendedDosage: '1 - 2 Softgels (yielding 1,000mg - 1,200mg combined EPA + DHA)',
    whenToConsume: 'With your largest meal of the day (lunch or dinner).',
    howToConsume: 'Swallow whole with cold water during a meal to avoid fishy burps.',
    keyCompounds: [
      'Eicosapentaenoic Acid (EPA: 600mg)',
      'Docosahexaenoic Acid (DHA: 400mg)',
      'Natural d-Alpha Tocopherol (Vitamin E antioxidant preservation)'
    ],
    dietitianNote: 'Omega-3 fatty acids incorporate directly into the phospholipid bilayer of muscle cell membranes, improving nutrient sensitivity and recovery rate.'
  },
  {
    id: 'supp-6',
    name: 'ZMA (Chelated Zinc, Magnesium & B6)',
    badge: 'DEEP REM SLEEP & MUSCLE RECOVERY',
    category: 'Recovery & Sleep',
    icon: Moon,
    accentColor: '#8B5CF6',
    rating: '4.9 / 5.0',
    shortDesc: 'Synergistic nighttime mineral formula designed to promote parasympathetic central nervous system relaxation.',
    keyBenefit: 'Facilitates Stage-4 deep restorative sleep, prevents nocturnal muscle cramps, and supports nighttime testosterone production.',
    recommendedDosage: '1 - 2 Capsules (yielding 300mg Magnesium & 20mg Zinc)',
    whenToConsume: '30–45 minutes before bedtime on an empty stomach.',
    howToConsume: 'Take with a glass of water. Avoid taking simultaneously with dairy products or calcium supplements, as calcium competes with zinc/magnesium for absorption.',
    keyCompounds: [
      'Magnesium Bisglycinate / Aspartate (300mg - High Bioavailability)',
      'Zinc Mono-L-Methionine & Picolinate (20mg)',
      'Vitamin B6 Pyridoxine HCl (10.5mg)'
    ],
    dietitianNote: 'Athletes lose significant zinc and magnesium through sweat. Taking chelated magnesium at night lowers cortisol and promotes deeper sleep wave patterns.'
  },
  {
    id: 'supp-7',
    name: 'Organic Ashwagandha (KSM-66® Extract)',
    badge: 'CORTISOL CONTROL & ADAPTOGENIC RECOVERY',
    category: 'Recovery & Sleep',
    icon: ShieldCheck,
    accentColor: '#14B8A6',
    rating: '4.9 / 5.0',
    shortDesc: 'Standardized full-spectrum root extract clinically proven to balance endocrine hormone pathways and manage systemic stress.',
    keyBenefit: 'Down-regulates elevated serum cortisol, reduces psychological training stress, and enhances natural sleep architecture.',
    recommendedDosage: '300mg - 600mg Standardized Root Extract (minimum 5% Withanolides)',
    whenToConsume: 'Either in the morning with breakfast or in the evening with dinner.',
    howToConsume: 'Take 1 capsule with warm water or herbal tea after a meal.',
    keyCompounds: [
      'KSM-66® Organic Ashwagandha Root (600mg)',
      'Standardized Bioactive Withanolides (30mg)',
      'Zero Leaf Adulterants'
    ],
    dietitianNote: 'Double-blind trials demonstrate that KSM-66 ashwagandha significantly lowers chronic cortisol levels and enhances recovery from high-volume resistance training.'
  },
  {
    id: 'supp-8',
    name: 'Clean Pre-Workout & Nitric Oxide Catalyst',
    badge: 'VASODILATION & CNS PERFORMANCE',
    category: 'Energy & Pre-Workout',
    icon: Activity,
    accentColor: '#EF4444',
    rating: '4.8 / 5.0',
    shortDesc: 'Clinical pre-training formulation combining blood-flow vasodilation catalysts with smooth, crash-free focus.',
    keyBenefit: 'Elevates nitric oxide production for enhanced muscular pumps, buffers lactic acid buildup, and sharpens training intensity.',
    recommendedDosage: '1 Level Scoop (15g)',
    whenToConsume: '20–30 minutes prior to your resistance training or high-intensity workout.',
    howToConsume: 'Mix with 250–300ml cold water on a relatively light stomach. Do not take within 5 hours of sleep if containing caffeine.',
    keyCompounds: [
      'L-Citrulline Malate 2:1 (6,000mg - Nitric Oxide Pump)',
      'Beta-Alanine (3,200mg - Lactic Acid Buffer)',
      'Betaine Anhydrous (2,000mg - Power Output)',
      'Natural Caffeine / Theanine (175mg / 100mg - Smooth Focus)'
    ],
    dietitianNote: 'L-Citrulline bypasses liver metabolism to directly elevate plasma arginine levels, resulting in superior vasodilation and oxygen delivery to working muscle tissue.'
  }
];

// Chronological Daily Stacking Timeline
const DAILY_STACK_TIMELINE = [
  {
    timeOfDay: '07:30 AM • Morning Breakfast',
    icon: Sunrise,
    accent: '#F59E0B',
    supplements: ['Multi-Nutrient Vitamins & Minerals', 'Organic Ashwagandha (KSM-66®)'],
    purpose: 'Cellular priming, fat-soluble vitamin absorption, and daytime cortisol balance.'
  },
  {
    timeOfDay: '04:30 PM • 30 Mins Pre-Workout',
    icon: Zap,
    accent: '#EF4444',
    supplements: ['Clean Pre-Workout Catalyst'],
    purpose: 'Vasodilation, increased nitric oxide blood flow, and mental focus.'
  },
  {
    timeOfDay: '06:00 PM • Post-Workout Window',
    icon: Dumbbell,
    accent: '#FF7043',
    supplements: ['Whey Protein Isolate', 'Creatine Monohydrate (3-5g)', 'Clean Mass Gainer (if bulking)'],
    purpose: 'Immediate muscle protein synthesis (MPS) stimulation and phosphocreatine reload.'
  },
  {
    timeOfDay: '08:00 PM • Evening Dinner',
    icon: Utensils,
    accent: '#10B981',
    supplements: ['Triple Strength Omega-3 Fish Oil'],
    purpose: 'Absorption of EPA/DHA fatty acids to down-regulate post-workout joint inflammation.'
  },
  {
    timeOfDay: '10:30 PM • 30 Mins Before Sleep',
    icon: Moon,
    accent: '#8B5CF6',
    supplements: ['ZMA (Zinc, Magnesium & B6)'],
    purpose: 'Deep Stage-4 REM sleep induction, parasympathetic relaxation, and nocturnal repair.'
  }
];

export default function Challenges() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { id: 'ALL', label: 'All Supplements' },
    { id: 'Muscle & Strength', label: '🏋️ Muscle & Strength' },
    { id: 'Recovery & Sleep', label: '🌙 Recovery & Sleep' },
    { id: 'Health & Micronutrients', label: '🥗 Health & Micronutrients' },
    { id: 'Energy & Pre-Workout', label: '⚡ Energy & Pre-Workout' }
  ];

  const filteredCatalog = SUPPLEMENT_CATALOG.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.keyBenefit.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trainerName = user?.assignedTrainer?.name || 'Coach Marcus Vance (CSCS)';
  const dietitianName = user?.assignedNutritionist?.name || 'Sruthy Varghese (M.Sc Dietetics)';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#12030F', color: '#FFFFFF' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '110px', paddingBottom: '90px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

          {/* ========================================================================= */}
          {/* 1. EXECUTIVE HERO HEADER */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.45) 0%, rgba(29, 7, 24, 0.95) 100%)',
            border: '1px solid rgba(255, 158, 125, 0.25)',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '24px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--peach-primary)', background: 'rgba(255, 158, 125, 0.15)', border: '1px solid rgba(255, 158, 125, 0.35)', padding: '2px 9px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> CLINICAL ADVISOR
                </span>
                <span style={{ fontSize: '0.74rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.12)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  Evidence-Based Recommendations
                </span>
              </div>

              <h1 style={{ 
                fontSize: '2.3rem', 
                fontWeight: 900, 
                margin: '4px 0', 
                background: 'linear-gradient(135deg, #FFFFFF 20%, #FFD9CB 60%, #FF9E7D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                Precision Supplement Guide & Recommendations
              </h1>

              <p style={{ color: '#E2C9D6', fontSize: '0.88rem', margin: 0 }}>
                Curated dietary and performance supplement recommendations verified by <strong>{dietitianName}</strong> and <strong>{trainerName}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/workout')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 112, 67, 0.15)',
                  border: '1px solid #FF7043',
                  color: '#FFB8A1',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Dumbbell size={15} />
                <span>Workout Desk</span>
              </button>

              <button
                onClick={() => navigate('/nutrition')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#A7F3D0',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <Utensils size={15} />
                <span>Nutrition Desk</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. IMPORTANT CLINICAL DISCLAIMER BANNER (PURELY RECOMMENDATIONS) */}
          {/* ========================================================================= */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            padding: '16px 22px',
            marginBottom: '26px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.15)'
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#38BDF8', color: '#12030F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Info size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38BDF8', marginBottom: '2px' }}>
                Clinical Recommendation Notice & Health Disclaimer
              </div>
              <div style={{ fontSize: '0.82rem', color: '#E2C9D6', lineHeight: '1.4' }}>
                All supplements listed on this page are <strong>purely optional dietary recommendations</strong> provided to assist in muscle recovery, micronutrient fulfillment, and athletic performance. <strong>They are not mandatory for your fitness transformation.</strong> A well-calibrated whole-food diet and consistent periodized training remain your primary foundation.
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. CHRONOLOGICAL DAILY TIMING & STACKING TIMELINE */}
          {/* ========================================================================= */}
          <div style={{
            background: 'rgba(29, 7, 24, 0.75)',
            border: '1px solid rgba(255, 158, 125, 0.25)',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Clock size={20} color="var(--peach-primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                Optimal Daily Consumption Timing Schedule
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {DAILY_STACK_TIMELINE.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.accent}40`,
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${item.accent}20`, color: item.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconComponent size={15} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: item.accent }}>{item.timeOfDay}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                        {item.supplements.map((s, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>
                            • {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      {item.purpose}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. SEARCH & CATEGORY FILTER BAR */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid var(--peach-primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: isSelected ? 'rgba(255,158,125,0.2)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? 'var(--peach-light)' : '#B392A5',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                placeholder="Search supplements..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 36px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,158,125,0.3)',
                  color: '#FFF',
                  fontSize: '0.85rem'
                }}
              />
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. PRODUCT RECOMMENDATION CARDS GRID */}
          {/* ========================================================================= */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px', marginBottom: '36px' }}>
            {filteredCatalog.map(item => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.id}
                  style={{
                    background: 'rgba(29, 7, 24, 0.85)',
                    border: `1px solid ${item.accentColor}40`,
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: `0 8px 30px ${item.accentColor}15`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}>
                  
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${item.accentColor}20`, color: item.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComp size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', background: `${item.accentColor}20`, color: item.accentColor, padding: '2px 7px', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
                          {item.badge}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: '4px 0 0 0' }}>
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                    {item.shortDesc}
                  </p>

                  {/* Key Recommendation Specifications */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Recommended Dosage:</span>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: item.accentColor, marginTop: '2px' }}>{item.recommendedDosage}</div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>When to Take:</span>
                      <div style={{ fontSize: '0.84rem', color: '#F1F5F9', marginTop: '2px' }}>⏰ {item.whenToConsume}</div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>How to Consume:</span>
                      <div style={{ fontSize: '0.84rem', color: '#E2C9D6', marginTop: '2px' }}>🥣 {item.howToConsume}</div>
                    </div>
                  </div>

                  {/* Dietitian Clinical Cue */}
                  <div style={{ background: `${item.accentColor}10`, borderLeft: `3px solid ${item.accentColor}`, padding: '10px 12px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                    <strong style={{ color: item.accentColor }}>Clinical Mechanism:</strong> {item.dietitianNote}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedProduct(item)}
                    style={{
                      marginTop: 'auto',
                      padding: '11px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${item.accentColor}50`,
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}>
                    <Info size={15} />
                    <span>View Product Composition</span>
                  </button>

                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* MODAL: FULL INGREDIENT & SCIENTIFIC SPECIFICATION */}
          {/* ========================================================================= */}
          {selectedProduct && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ padding: '32px', maxWidth: '540px', width: '100%', background: '#1d0718', border: `2px solid ${selectedProduct.accentColor}`, borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', background: `${selectedProduct.accentColor}20`, color: selectedProduct.accentColor, padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      {selectedProduct.badge}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: '4px 0 0 0', fontWeight: 800 }}>
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Primary Athletic Purpose</div>
                  <p style={{ color: '#E2C9D6', fontSize: '0.88rem', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    {selectedProduct.keyBenefit}
                  </p>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Key Active Ingredients & Bioavailability:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.6' }}>
                    {selectedProduct.keyCompounds.map((comp, i) => (
                      <li key={i}>{comp}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', marginBottom: '22px', fontSize: '0.82rem', color: '#E2C9D6', lineHeight: '1.5' }}>
                  <strong style={{ color: selectedProduct.accentColor }}>Prescription Directive:</strong> Take {selectedProduct.recommendedDosage} {selectedProduct.whenToConsume.toLowerCase()}. {selectedProduct.howToConsume}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setSelectedProduct(null)} className="btn-primary" style={{ padding: '9px 24px' }}>
                    Close Product Guide
                  </button>
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
