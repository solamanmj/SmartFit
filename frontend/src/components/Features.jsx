import React from 'react';
import { Dumbbell, Utensils, BarChart3, Bot, Target, HelpCircle, ArrowUpRight } from 'lucide-react';

export default function Features({ onSelectFeature }) {
  const featuresList = [
    {
      id: 'workout',
      icon: '🏋️',
      lucideIcon: Dumbbell,
      title: 'Workout',
      subtitle: 'Dynamic AI Coaching',
      description: 'Customized workouts that dynamically adjust set counts, weights, and recovery times based on real-time muscle fatigue & biometric feedback.',
      tag: 'Personalized'
    },
    {
      id: 'nutrition',
      icon: '🥗',
      lucideIcon: Utensils,
      title: 'Nutrition',
      subtitle: 'Macro & Meal Precision',
      description: 'Tailored nutritional recommendations aligned with your metabolic rate, dietary preferences, and target caloric deficit/surplus goals.',
      tag: 'Adaptive'
    },
    {
      id: 'progress',
      icon: '📊',
      lucideIcon: BarChart3,
      title: 'Progress',
      subtitle: 'Biometric Analytics',
      description: 'Comprehensive performance dashboards with predictive milestone forecasts, strength progression curves, and body metric tracking.',
      tag: 'Real-time'
    },
    {
      id: 'ai',
      icon: '🤖',
      lucideIcon: Bot,
      title: 'AI Intelligence',
      subtitle: 'Deep Learning Core',
      description: 'Powered by advanced neural models trained on millions of biometric data points to deliver optimal fitness optimization.',
      tag: 'Autonomous'
    },
    {
      id: 'goals',
      icon: '🎯',
      lucideIcon: Target,
      title: 'Goals',
      subtitle: 'Milestone Tracking',
      description: 'Smart goal setting that breaks down long-term body transformations into daily actionable micro-habits and achievements.',
      tag: 'Targeted'
    },
    {
      id: 'xai',
      icon: '🔍',
      lucideIcon: HelpCircle,
      title: 'XAI (Explainable AI)',
      subtitle: 'Transparent AI Insights',
      description: 'No black boxes. Understand *why* each workout intensity or meal recommendation was selected for your current physiological state.',
      tag: 'Transparent'
    }
  ];

  return (
    <section id="why-smartfit" className="why-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">Why SmartFit?</span>
          <h2 className="section-title">
            Engineered for <span className="gradient-peach-rose">Peak Results</span>
          </h2>
          <p className="section-desc">
            SmartFit combines cutting-edge machine learning with exercise science to transform how you train, eat, and recover.
          </p>
        </div>

        <div className="why-grid">
          {featuresList.map((item) => (
            <div 
              key={item.id} 
              className="glass-card why-card"
              onClick={() => onSelectFeature && onSelectFeature(item)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="why-icon-wrap">
                  <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                </div>
                <span className="why-card-tag">{item.tag}</span>
              </div>

              <div>
                <h3 className="why-card-title">{item.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--peach-soft)', fontWeight: 600, marginTop: '2px' }}>
                  {item.subtitle}
                </div>
              </div>

              <p className="why-card-text">{item.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--peach-primary)', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
                <span>Learn how it works</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
