import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, User, Database, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header style={{
      height: '74px',
      position: 'fixed',
      top: 0,
      right: 0,
      left: '260px',
      zIndex: 90,
      background: 'rgba(18, 3, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', margin: '2px 0 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#4ade80', fontWeight: 600 }}>
            <Database size={14} /> MongoDB Port 27017
          </span>
          <span style={{ color: 'var(--glass-border)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
            <Cpu size={14} /> FastAPI Port 8000
          </span>
        </div>

        <NavLink
          to="/admin/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            background: 'rgba(250, 204, 21, 0.1)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            padding: '6px 14px',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#facc15',
            color: '#12030f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.8rem'
          }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
              {user?.fullName || 'System Admin'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#facc15', fontWeight: 600 }}>
              {user?.email || 'admin@smartfit.com'}
            </div>
          </div>
        </NavLink>
      </div>
    </header>
  );
}
