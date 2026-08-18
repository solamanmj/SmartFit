import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, LayoutDashboard, Users, UserCheck, Apple, Dumbbell, 
  Utensils, Cpu, BarChart3, MessageSquareText, LogOut, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Registered Users', icon: Users },
    { path: '/admin/trainers', label: 'Personal Trainers', icon: UserCheck },
    { path: '/admin/nutritionists', label: 'Clinical Nutritionists', icon: Apple },
    { path: '/admin/exercises', label: 'Exercise Repository', icon: Dumbbell },
    { path: '/admin/nutrition', label: 'Food Dataset', icon: Utensils },
    { path: '/admin/recommendations', label: 'ML Model Evaluation', icon: Cpu },
    { path: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
    { path: '/admin/feedback', label: 'Feedback Stream', icon: MessageSquareText },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(18, 3, 15, 0.95)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)'
    }}>
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#12030f',
          boxShadow: '0 4px 12px rgba(250, 204, 21, 0.3)'
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
            SmartFit <span style={{ color: '#facc15' }}>ADMIN</span>
          </h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Executive Control Portal
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '10px',
                color: isActive ? '#12030f' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '12px',
          fontSize: '0.78rem',
          color: 'var(--text-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: 600, marginBottom: '4px' }}>
            <Activity size={14} /> MongoDB smartfit_db
          </div>
          <div>Status: Fully Connected</div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: '0.2s'
          }}
        >
          <LogOut size={16} />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </aside>
  );
}
