import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Utensils,
  TrendingUp,
  Award,
  Apple,
  Sparkles,
  BarChart3,
  MessageSquare,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <ShieldCheck size={18} className="text-peach" />
        <span>NAVIGATION</span>
      </div>

      <nav className="admin-sidebar-menu">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div className="admin-menu-section">USER MANAGEMENT</div>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/workout-logs"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Dumbbell size={18} />
          <span>Workout Logs</span>
        </NavLink>

        <NavLink
          to="/admin/nutrition-logs"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Utensils size={18} />
          <span>Nutrition Logs</span>
        </NavLink>

        <NavLink
          to="/admin/progress"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <TrendingUp size={18} />
          <span>User Progress</span>
        </NavLink>

        <div className="admin-menu-section">PROFESSIONAL MANAGEMENT</div>

        <NavLink
          to="/admin/trainers"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Award size={18} />
          <span>Trainers</span>
        </NavLink>

        <NavLink
          to="/admin/nutritionists"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Apple size={18} />
          <span>Nutritionists</span>
        </NavLink>

        <div className="admin-menu-section">DATA MANAGEMENT</div>

        <NavLink
          to="/admin/exercises"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Dumbbell size={18} />
          <span>Exercise Database</span>
        </NavLink>

        <NavLink
          to="/admin/nutrition"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Utensils size={18} />
          <span>Nutrition Database</span>
        </NavLink>

        <div className="admin-menu-section">AI & ANALYTICS</div>

        <NavLink
          to="/admin/recommendations"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={18} />
          <span>Recommendations</span>
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <BarChart3 size={18} />
          <span>Platform Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/feedback"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>User Feedback</span>
        </NavLink>

        <div className="admin-menu-section">SYSTEM</div>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Admin Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}
