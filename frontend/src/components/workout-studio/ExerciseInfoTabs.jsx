import React, { useState } from 'react';
import { 
  Info, CheckCircle2, AlertTriangle, Layers, ShieldCheck, 
  Dumbbell, Clock, Flame, Sparkles, Activity, Shield,
  Compass, Award, Footprints, Target
} from 'lucide-react';

export default function ExerciseInfoTabs({ exercise }) {
  const [activeTab, setActiveTab] = useState('overview');

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'biomechanics', label: 'Biomechanics & Stance', icon: Compass },
    { id: 'instructions', label: 'Step-by-Step', icon: Layers },
    { id: 'tips', label: 'Form Cues', icon: CheckCircle2 },
    { id: 'mistakes', label: 'Mistakes vs Fixes', icon: AlertTriangle },
    { id: 'muscles', label: 'Muscles & Safety', icon: Activity }
  ];

  if (!exercise) return null;

  return (
    <div style={{
      background: 'rgba(29, 7, 24, 0.85)',
      border: '1px solid rgba(255, 158, 125, 0.2)',
      borderRadius: '18px',
      padding: '20px 24px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
    }}>
      
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        borderBottom: '1px solid rgba(255, 158, 125, 0.2)',
        paddingBottom: '12px',
        marginBottom: '18px',
        scrollbarWidth: 'none'
      }}>
        {TABS.map(tab => {
          const isSelected = activeTab === tab.id;
          const IconComp = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '10px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(255, 112, 67, 0.25) 0%, rgba(232, 128, 157, 0.18) 100%)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: isSelected ? '1px solid var(--peach-primary)' : '1px solid transparent',
                color: isSelected ? '#FF9E7D' : '#CBD5E1',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}>
              <IconComp size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Biomechanical Verification Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(52, 211, 153, 0.12) 0%, rgba(18, 3, 15, 0.6) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#34D399" />
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#34D399' }}>
                  {exercise.formValidationStatus || 'Verified Biomechanics'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>
                  {exercise.reviewerNotes || 'Barbell horizontal alignment and multi-plane joint kinematics verified by SmartFit Biomechanics Lab.'}
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(52, 211, 153, 0.2)',
              color: '#34D399',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 800,
              whiteSpace: 'nowrap'
            }}>
              PASS 100%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Split Category</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FF7043', marginTop: '2px' }}>{exercise.splitName || 'Push Split'}</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Movement Vector</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{exercise.movementType || 'Compound Push'}</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Difficulty Tier</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: exercise.difficulty === 'Advanced' ? '#EF4444' : '#34D399', marginTop: '2px' }}>
                {exercise.difficulty || 'Intermediate'}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px 14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Equipment Required</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                {Array.isArray(exercise.equipment) ? exercise.equipment.join(', ') : (exercise.equipment || 'Gym Equipment')}
              </div>
            </div>
          </div>

          {/* Coach Audio Speech Script */}
          {exercise.coachSpeech && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12) 0%, rgba(35, 8, 28, 0.8) 100%)',
              border: '1px solid rgba(255, 112, 67, 0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '0.86rem',
              color: '#FFF',
              lineHeight: '1.5'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#FFB8A1', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                Coach Marcus Directives & Biomechanical Commentary:
              </div>
              <em>"{exercise.coachSpeech}"</em>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: BIOMECHANICS & STANCE */}
      {activeTab === 'biomechanics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 158, 125, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF7043', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <Footprints size={14} /> Foot Placement & Stance Width
              </div>
              <div style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                {exercise.startingPosition?.footStance || 'Shoulder-width stance, feet firmly planted with 3 points of tripod contact (heel, 1st MTP, 5th MTP).'}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 158, 125, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <Dumbbell size={14} /> Grip Width & Hand Alignment
              </div>
              <div style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                {exercise.startingPosition?.handGrip || 'Pronated secure grip with thumbs wrapped, wrists neutral directly stacked over elbows.'}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 158, 125, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Target size={14} /> Starting Posture & Spine Alignment
            </div>
            <div style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.4' }}>
              {exercise.startingPosition?.posture || 'Maintain a rigid neutral spinal column, retract scapulae firmly, and brace intra-abdominal wall.'}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 158, 125, 0.15)' }}>
            <div style={{ fontSize: '0.82rem', color: '#FFB8A1', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              Range of Motion & Kinematic Path
            </div>
            <div style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.4' }}>
              {exercise.rangeOfMotionGuidance?.fullRomDescription || 'Travel through complete anatomical active range of motion without compensating at lumbar spine or shoulder capsular stability.'}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: HOW TO PERFORM */}
      {activeTab === 'instructions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(exercise.instructions || []).map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#FF7043',
                  color: '#12030F',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.5' }}>
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* Breathing Protocol */}
          {exercise.breathingInstructions && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.84rem',
              color: '#BAE6FD',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Activity size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
              <div>
                <strong>Diaphragmatic Breathing Cadence:</strong> {exercise.breathingInstructions}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 3: FORM TIPS */}
      {activeTab === 'tips' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(exercise.formCues || exercise.proTips || [
            'Maintain continuous time-under-tension on the target fibers.',
            'Keep your spine rigid and core braced 360 degrees.',
            'Never rush the 3-second negative eccentric descent.'
          ]).map((cue, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.86rem',
                color: '#E2E8F0',
                lineHeight: '1.4'
              }}>
              <CheckCircle2 size={16} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{typeof cue === 'string' ? cue : cue.cue || cue}</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 4: COMMON MISTAKES */}
      {activeTab === 'mistakes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(exercise.commonMistakes || []).map((m, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontWeight: 800, fontSize: '0.92rem' }}>
                <AlertTriangle size={16} />
                <span>{typeof m === 'string' ? m : m.mistake}</span>
              </div>
              {typeof m === 'object' && m.correction && (
                <div style={{ fontSize: '0.82rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Correction:</strong> {m.correction}
                </div>
              )}
              {typeof m === 'object' && m.whyItMatters && (
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  <strong>Risk:</strong> {m.whyItMatters}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 5: MUSCLES */}
      {activeTab === 'muscles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#FF9E7D', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              Primary Target Agonists (Prime Movers)
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(exercise.primaryMuscles || ['Pectoralis Major']).map((m, i) => (
                <span
                  key={i}
                  style={{
                    background: '#FF7043',
                    color: '#12030F',
                    fontWeight: 900,
                    fontSize: '0.84rem',
                    padding: '4px 12px',
                    borderRadius: '8px'
                  }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              Secondary Synergists & Stabilizers
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(exercise.secondaryMuscles || ['Anterior Deltoids', 'Triceps Brachii']).map((m, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(56, 189, 248, 0.18)',
                    color: '#38BDF8',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    padding: '4px 12px',
                    borderRadius: '8px'
                  }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 6: SAFETY */}
      {activeTab === 'safety' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {(exercise.safetyNotes || [
            'Warm up joint capsules thoroughly before loading working sets.',
            'Use safety pins and spotters on heavy compound lifts.',
            'Discontinue movement if sharp, pinching pain occurs in joint.'
          ]).map((note, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#E2C9D6',
                border: '1px solid rgba(255, 158, 125, 0.15)'
              }}>
              <ShieldCheck size={16} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{note}</span>
            </div>
          ))}

          {/* Educational Disclaimer */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px dashed rgba(255, 158, 125, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '0.75rem',
            color: '#94A3B8',
            lineHeight: '1.4'
          }}>
            <strong>SmartFit Educational & Demonstration Notice:</strong> This interactive 3D virtual human demonstration is designed strictly for biomechanical education, posture alignment, and form cue mastery. It does not replace medical consultation or in-person evaluation by a licensed healthcare professional.
          </div>

        </div>
      )}

    </div>
  );
}
