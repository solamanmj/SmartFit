import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Sparkles, UserPlus, Target, Cpu, LineChart, RefreshCw } from 'lucide-react';

export default function HowItWorks({ onOpenGetStarted }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Create Profile',
      icon: UserPlus,
      subtitle: 'Input biometric markers & activity history',
      description: 'Quickly set up your profile by detailing age, weight, target metrics, dietary preferences, available gym equipment, and historical activity data.',
      highlights: [
        'Biometric data integration',
        'Dietary preference mapping',
        'Health & injury history assessment'
      ]
    },
    {
      num: '02',
      title: 'Set Fitness Goals',
      icon: Target,
      subtitle: 'Define target timelines & milestones',
      description: 'Choose whether your primary focus is hyper-trophy muscle gain, fat loss, athletic endurance, or overall longevity. SmartFit configures your roadmap.',
      highlights: [
        'Custom body composition targets',
        'Weekly commitment scheduling',
        'Intelligent goal breakdown'
      ]
    },
    {
      num: '03',
      title: 'Receive Recommendations',
      icon: Cpu,
      subtitle: 'Instant AI workout & meal generation',
      description: 'Our proprietary Explainable AI generates hyper-personalized daily workout splits, calorie-macronutrient targets, and optimal rest schedules.',
      highlights: [
        'Adaptive daily workout plans',
        'Precision macro meal guides',
        'Rest & recovery score optimization'
      ]
    },
    {
      num: '04',
      title: 'Track Your Progress',
      icon: LineChart,
      subtitle: 'Log workouts, meals & physiological signals',
      description: 'Seamlessly log sets, reps, heart rate, sleep quality, and daily energy levels. SmartFit analyzes patterns in real-time.',
      highlights: [
        'One-tap workout logger',
        'Automated macro tracking',
        'Visual transformation timelines'
      ]
    },
    {
      num: '05',
      title: 'SmartFit Adapts',
      icon: RefreshCw,
      subtitle: 'Continuous neural feedback loops',
      description: 'Hit a plateau or missed a workout? SmartFit dynamically recalculates your upcoming weeks to keep you progressing safely without burnout.',
      highlights: [
        'Auto-progressive overload adjustment',
        'Dynamic deload week calculation',
        'Real-time plateau prevention'
      ]
    }
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <section id="how-it-works" className="how-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="badge">
            Simple 5-Step Process
          </span>
          <h2 className="section-title">
            How <span className="gradient-peach-rose">SmartFit Works</span>
          </h2>
          <p className="section-desc">
            A seamless journey from initial goal-setting to continuous, AI-driven physiological adaptation.
          </p>
        </div>

        {/* Interactive Steps Layout */}
        <div className="how-interactive-container">
          {/* Step Timeline Buttons */}
          <div className="steps-list">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`step-item ${activeStep === idx ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <span className="step-number">{step.num}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={20} style={{ color: activeStep === idx ? 'var(--peach-primary)' : 'var(--text-subtle)' }} />
                    <span className="step-title-text">{step.title}</span>
                  </div>
                  <ChevronRight className="step-arrow" size={20} />
                </div>
              );
            })}
          </div>

          {/* Interactive Preview Panel */}
          <div className="glass-card step-preview-card">
            <div className="badge step-preview-badge">
              <Sparkles size={14} /> Step {currentStep.num} Preview
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="why-icon-wrap" style={{ width: '56px', height: '56px' }}>
                <StepIcon size={28} />
              </div>
              <div>
                <h3 className="step-preview-title gradient-text">
                  {currentStep.title}
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--peach-soft)', fontWeight: 600 }}>
                  {currentStep.subtitle}
                </span>
              </div>
            </div>

            <p className="step-preview-desc">
              {currentStep.description}
            </p>

            <div className="step-features-list">
              {currentStep.highlights.map((item, i) => (
                <div key={i} className="step-feature-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {steps.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    onClick={() => setActiveStep(dotIdx)}
                    style={{
                      width: activeStep === dotIdx ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeStep === dotIdx ? 'var(--peach-primary)' : 'rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: '0.3s'
                    }}
                  />
                ))}
              </div>

              <button onClick={onOpenGetStarted} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                Start Step {currentStep.num}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
