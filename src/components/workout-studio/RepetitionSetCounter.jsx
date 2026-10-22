import React, { useState } from 'react';
import { 
  CheckSquare, ArrowRight, ArrowLeft, RefreshCw, 
  Flame, Award, Dumbbell, Clock, ShieldCheck, Check 
} from 'lucide-react';

export default function RepetitionSetCounter({
  exercise,
  currentSet = 1,
  totalSets = 4,
  currentRep = 0,
  targetReps = 10,
  onCompleteSet,
  onPrevExercise,
  onNextExercise,
  isFirstExercise,
  isLastExercise,
  setsCompleted = []
}) {
  const [loggedWeight, setLoggedWeight] = useState(exercise?.weight || '75');

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(82, 21, 65, 0.35) 0%, rgba(29, 7, 24, 0.9) 100%)',
      border: '1px solid rgba(255, 158, 125, 0.25)',
      borderRadius: '18px',
      padding: '20px 24px',
      marginBottom: '20px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
    }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--peach-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
            Live Workout Tracking & Progression
          </div>
          <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>
            {exercise?.name || 'Movement'}
          </h3>
        </div>

        {/* Set Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: totalSets }).map((_, sIdx) => {
            const setNum = sIdx + 1;
            const isDone = setsCompleted.includes(setNum);
            const isCurrent = setNum === currentSet;

            return (
              <div
                key={setNum}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isDone 
                    ? '#34D399' 
                    : isCurrent 
                      ? 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)' 
                      : 'rgba(255, 255, 255, 0.08)',
                  color: isDone || isCurrent ? '#12030F' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  border: isCurrent ? '1.5px solid #FFB8A1' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                {isDone ? '✓' : `S${setNum}`}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sets, Reps, Weight & Rest Target */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        
        {/* Set Indicator */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Current Set</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FF7043', marginTop: '2px' }}>
            {currentSet} <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>/ {totalSets}</span>
          </div>
        </div>

        {/* Rep Indicator */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Live Reps</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#38BDF8', marginTop: '2px' }}>
            {currentRep < 10 ? `0${currentRep}` : currentRep} <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>/ {targetReps}</span>
          </div>
        </div>

        {/* Weight Load */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Prescribed Load</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FACC15', marginTop: '2px' }}>
            {exercise?.weight || 'Prescribed Load'}
          </div>
        </div>

        {/* Rest Target */}
        <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Between-Set Rest</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>
            {exercise?.restSeconds || 90}s
          </div>
        </div>

      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Prev Button */}
        <button
          type="button"
          onClick={onPrevExercise}
          disabled={isFirstExercise}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: isFirstExercise ? '#64748B' : '#CBD5E1',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: isFirstExercise ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
          <ArrowLeft size={14} />
          <span>Previous</span>
        </button>

        {/* Complete Set Button */}
        <button
          type="button"
          onClick={() => onCompleteSet(currentSet)}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
            border: 'none',
            color: '#12030F',
            fontWeight: 900,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)'
          }}>
          <CheckSquare size={16} />
          <span>Complete Set {currentSet} & Start Rest</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNextExercise}
          disabled={isLastExercise}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: isLastExercise ? '#64748B' : '#CBD5E1',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: isLastExercise ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
          <span>Next</span>
          <ArrowRight size={14} />
        </button>

      </div>

    </div>
  );
}
