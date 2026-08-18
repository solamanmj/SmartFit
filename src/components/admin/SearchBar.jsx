import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
      <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          paddingLeft: '38px',
          fontSize: '0.85rem',
          paddingTop: '8px',
          paddingBottom: '8px',
          background: 'rgba(255,255,255,0.06)'
        }}
      />
    </div>
  );
}
