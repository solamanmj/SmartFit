import React from 'react';
import { Search, CheckCircle2, Play, Dumbbell, Sparkles, Clock, Flame } from 'lucide-react';

export default function ExercisePlaylist({ 
  exercises = [], 
  activeExerciseId, 
  completedExercises = {}, 
  onSelectExercise,
  searchQuery,
  onSearchChange,
  splitName = 'Push Split'
}) {
  const displayedExercises = exercises.filter(ex => {
    if (!searchQuery || !searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = ex.name?.toLowerCase().includes(q);
    const catMatch = ex.category?.toLowerCase().includes(q) || ex.splitName?.toLowerCase().includes(q);
    const muscleMatch = ex.primaryMuscles?.some(m => m.toLowerCase().includes(q)) || ex.targetMuscle?.toLowerCase().includes(q);
    return nameMatch || catMatch || muscleMatch;
  });

  return (
    <div style={{
      background: 'rgba(29, 7, 24, 0.75)',
      border: '1px solid rgba(255, 158, 125, 0.2)',
      borderRadius: '18px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--peach-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
            2. Split Exercise Playlist
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: '2px 0 0 0' }}>
            {splitName}
          </h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 800, background: 'rgba(52, 211, 153, 0.12)', padding: '3px 9px', borderRadius: '8px' }}>
          {Object.keys(completedExercises).filter(k => completedExercises[k]).length} / {exercises.length} Done
        </span>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          type="text"
          placeholder="Filter movements or muscles..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px 9px 34px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 158, 125, 0.25)',
            color: '#FFF',
            fontSize: '0.82rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Exercise List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto',
        maxHeight: '480px',
        paddingRight: '4px'
      }}>
        {displayedExercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8', fontSize: '0.85rem' }}>
            No exercises found matching "{searchQuery}".
          </div>
        ) : (
          displayedExercises.map((ex, idx) => {
            const isSelected = (activeExerciseId === ex.id || activeExerciseId === ex.name);
            const isDone = !!completedExercises[ex.id || ex.name];

            return (
              <div
                key={ex.id || ex.name || idx}
                onClick={() => onSelectExercise(ex)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(255, 112, 67, 0.25) 0%, rgba(35, 8, 28, 0.85) 100%)' 
                    : 'rgba(0, 0, 0, 0.35)',
                  border: isSelected 
                    ? '1.5px solid var(--peach-primary)' 
                    : isDone 
                      ? '1px solid rgba(52, 211, 153, 0.4)' 
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isDone 
                      ? '#34D399' 
                      : isSelected 
                        ? '#FF7043' 
                        : 'rgba(255, 255, 255, 0.1)',
                    color: isDone || isSelected ? '#12030F' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {isDone ? '✓' : idx + 1}
                  </div>

                  <div>
                    <h4 style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: isSelected ? '#FFF' : '#E2C9D6'
                    }}>
                      {ex.name}
                    </h4>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.12)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        {ex.primaryMuscles?.[0] || ex.targetMuscle || 'Pectorals'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#FFB8A1' }}>
                        {ex.sets || 4} × {ex.reps || '8-10'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? '#FF7043' : 'rgba(255, 158, 125, 0.12)',
                      color: isSelected ? '#12030F' : 'var(--peach-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                    <Play size={12} fill={isSelected ? '#12030F' : 'var(--peach-primary)'} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
