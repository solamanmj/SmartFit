import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogOut, User, Bell } from 'lucide-react';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-brand">
        <div className="admin-brand-icon">
          <Shield size={20} className="text-peach" />
        </div>
        <div className="admin-brand-text">
          <span className="admin-title">SmartFit</span>
          <span className="admin-subtitle">ADMIN CONTROL PANEL</span>
        </div>
      </div>

      <div className="admin-navbar-actions">
        <div className="admin-notification-badge" title="Notifications">
          <Bell size={18} />
          <span className="dot"></span>
        </div>

        <div className="admin-user-profile">
          <div className="admin-avatar">
            <User size={18} />
          </div>
          <div className="admin-user-info">
            <span className="admin-name">{user?.fullName || 'Administrator'}</span>
            <span className="admin-role">SYSTEM ADMIN</span>
          </div>
        </div>

        <button onClick={handleLogout} className="admin-logout-btn" title="Sign out of Admin Panel">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
