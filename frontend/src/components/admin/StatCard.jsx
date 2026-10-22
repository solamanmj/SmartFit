import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = '#facc15', subtext }) {
  return (
    <div className="glass-card" style={{
      padding: '22px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
          {value !== undefined ? value : '...'}
        </h3>
        {subtext && (
          <span style={{ fontSize: '0.75rem', color: color, marginTop: '4px', display: 'block', fontWeight: 600 }}>
            {subtext}
          </span>
        )}
      </div>

      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.15)`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
    </div>
  );
}
