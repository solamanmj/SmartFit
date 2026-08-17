import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAINutritionPlan } from '../services/api';

export default function Nutrition() {
  const { user } = useAuth();
  const [nutrition, setNutrition] = useState(null);

  useEffect(() => {
    fetchAINutritionPlan(user).then(data => setNutrition(data));
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge" style={{ marginBottom: '8px' }}>
              <Utensils size={14} /> SmartFit AI Nutrition & Macro Guide
            </div>
            <h1 className="gradient-peach-rose" style={{ fontSize: '2.4rem' }}>
              Metabolic Meal Breakdown
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
              Dietary Preference: <strong style={{ color: 'var(--peach-light)' }}>{user?.dietaryPreference || 'Standard Balanced'}</strong>
            </p>
          </div>
        </div>

        {nutrition ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>DAILY CALORIES</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.targetCalories || nutrition.dailyCalorieTarget} kcal</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Target Energy Goal</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>PROTEIN</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.proteinGrams || nutrition.proteinTargetGrams}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>4 kcal / gram</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>CARBOHYDRATES</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.carbGrams || nutrition.carbohydrateTargetGrams}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>4 kcal / gram</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>FATS</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.fatGrams || nutrition.fatTargetGrams}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>9 kcal / gram</div>
              </div>
            </div>

            {/* Explainable AI (XAI) Rationale */}
            {nutrition.explanation && nutrition.explanation.length > 0 && (
              <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', background: 'rgba(255, 158, 125, 0.06)' }}>
                <h3 className="gradient-peach-rose" style={{ fontSize: '1.25rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔍</span> Explainable AI (XAI) Model Insights
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                  {nutrition.explanation.map((item, idx) => (
                    <li key={idx} style={{ lineHeight: '1.5' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="glass-card" style={{ padding: '36px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.6rem', marginBottom: '24px' }}>
                Recommended Meal Schedule
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {nutrition.meals && nutrition.meals.map((meal, index) => (
                  <div key={meal.id || index} style={{ background: 'rgba(255,255,255,0.04)', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: meal.foods && meal.foods.length > 0 ? '12px' : '0' }}>
                      <div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--peach-primary)', fontWeight: 700 }}>{meal.type || meal.mealType}</div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginTop: '4px' }}>{meal.title}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--peach-light)', fontSize: '0.95rem' }}>
                        {meal.calories} kcal <br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{meal.macros}</span>
                      </div>
                    </div>

                    {/* Food Items Breakdown if present */}
                    {meal.foods && meal.foods.length > 0 && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        {meal.foods.map((food, fIdx) => (
                          <div key={fIdx} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem' }}>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{food.name} <span style={{ color: 'var(--peach-soft)', fontSize: '0.78rem' }}>({food.portion})</span></div>
                            <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', marginTop: '3px' }}>
                              {food.calories} kcal • {food.protein}g P • {food.carbohydrates}g C • {food.fat}g F
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>Loading AI Nutrition Plan...</div>
        )}

      </main>

      <Footer />
    </div>
  );
}
