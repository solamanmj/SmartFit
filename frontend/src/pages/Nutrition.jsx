import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Utensils, Sparkles, CheckCircle2, Flame, Apple } from 'lucide-react';
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
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.targetCalories} kcal</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Target Energy Goal</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>PROTEIN</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.proteinGrams}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>4 kcal / gram</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>CARBOHYDRATES</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.carbGrams}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>4 kcal / gram</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700 }}>FATS</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{nutrition.fatGrams}g</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>9 kcal / gram</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '36px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.6rem', marginBottom: '24px' }}>
                Recommended Meal Schedule
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {nutrition.meals.map(meal => (
                  <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--peach-primary)', fontWeight: 700 }}>{meal.type}</div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginTop: '4px' }}>{meal.title}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--peach-light)', fontSize: '0.95rem' }}>
                      {meal.calories} kcal <br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{meal.macros}</span>
                    </div>
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
