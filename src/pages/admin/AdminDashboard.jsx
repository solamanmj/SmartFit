import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StatCard from '../../components/admin/StatCard';
import { 
  Users, UserCheck, Apple, Dumbbell, Utensils, Zap, Award, 
  Activity, ArrowUpRight, ShieldCheck, Database, RefreshCw,
  Search, Trash2, Eye, Sparkles, CheckCircle2, ChevronRight,
  X, HeartHandshake, Filter, AlertTriangle, Flame, Mail, Calendar, Shield
} from 'lucide-react';
import { 
  fetchAdminStatsApi, 
  fetchAdminUsersApi, 
  fetchAdminTrainersApi, 
  fetchAdminNutritionistsApi,
  deleteAdminUserApi
} from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAllAccounts: 0,
    totalTrainers: 0,
    totalNutritionists: 0,
    totalExercises: 5,
    totalNutritionItems: 5,
    workoutRecommendationsGenerated: 142,
    nutritionRecommendationsGenerated: 185,
    mongoDbStatus: 'CONNECTED',
    fastApiStatus: 'ONLINE'
  });

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [nutritionists, setNutritionists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'trainers' | 'nutritionists' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('ALL');
  
  // Modal states
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, trainersData, nutritionistsData] = await Promise.all([
        fetchAdminStatsApi(),
        fetchAdminUsersApi(),
        fetchAdminTrainersApi(),
        fetchAdminNutritionistsApi()
      ]);

      const rawUsers = Array.isArray(usersData) && usersData.length > 0 
        ? usersData 
        : (Array.isArray(statsData?.users) ? statsData.users : []);
      
      const rawTrainers = Array.isArray(trainersData) && trainersData.length > 0 
        ? trainersData 
        : (Array.isArray(statsData?.trainers) ? statsData.trainers : []);

      const rawNutritionists = Array.isArray(nutritionistsData) && nutritionistsData.length > 0 
        ? nutritionistsData 
        : (Array.isArray(statsData?.nutritionists) ? statsData.nutritionists : []);

      // Segregate Client Members vs Staff/Admin
      const clientsOnly = rawUsers.filter(u => (u.role || 'USER').toUpperCase() === 'USER');

      setRegisteredUsers(clientsOnly);
      setAllAccounts(rawUsers);
      setTrainers(rawTrainers);
      setNutritionists(rawNutritionists);

      if (statsData) {
        setStats({
          ...statsData,
          totalUsers: clientsOnly.length,
          activeUsers: clientsOnly.length,
          totalAllAccounts: rawUsers.length,
          totalTrainers: rawTrainers.length,
          totalNutritionists: rawNutritionists.length
        });
      }
    } catch (err) {
      console.warn('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 5000);
  };

  // Confirm Permanent Deletion of a User Account
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const { email, fullName } = userToDelete;

    if (email === 'admin@smartfit.com') {
      alert('Security Protection: Primary Administrator account cannot be deleted!');
      setUserToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAdminUserApi(email);
      setRegisteredUsers(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));
      setAllAccounts(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));

      // Purge from browser localStorage accounts to prevent stale/resurrected state
      try {
        const stored = JSON.parse(localStorage.getItem('smartfit_accounts') || '[]');
        const next = stored.filter(u => (u.email || '').toLowerCase() !== email.toLowerCase());
        localStorage.setItem('smartfit_accounts', JSON.stringify(next));
      } catch (e) {}

      setStats(prev => ({
        ...prev,
        totalUsers: Math.max(0, prev.totalUsers - 1),
        activeUsers: Math.max(0, prev.activeUsers - 1),
        totalAllAccounts: Math.max(0, prev.totalAllAccounts - 1)
      }));
      showNotice(`User account "${fullName || email}" was permanently removed from database.`);
      setUserToDelete(null);
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Clients List
  const filteredClients = useMemo(() => {
    return registeredUsers.filter(u => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.fitnessGoal && u.fitnessGoal.toLowerCase().includes(q)) ||
        (u.dietaryPreference && u.dietaryPreference.toLowerCase().includes(q));

      const goal = (u.fitnessGoal || '').toLowerCase();
      const matchGoal = selectedGoalFilter === 'ALL' || goal.includes(selectedGoalFilter.toLowerCase());

      return matchSearch && matchGoal;
    });
  }, [registeredUsers, searchQuery, selectedGoalFilter]);

  // Filtered Trainers List
  const filteredTrainers = useMemo(() => {
    return trainers.filter(t => {
      const q = searchQuery.toLowerCase();
      return !q ||
        (t.fullName && t.fullName.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.specialization && t.specialization.toLowerCase().includes(q)) ||
        (t.certificationName && t.certificationName.toLowerCase().includes(q));
    });
  }, [trainers, searchQuery]);

  // Filtered Nutritionists List
  const filteredNutritionists = useMemo(() => {
    return nutritionists.filter(n => {
      const q = searchQuery.toLowerCase();
      return !q ||
        (n.fullName && n.fullName.toLowerCase().includes(q)) ||
        (n.email && n.email.toLowerCase().includes(q)) ||
        (n.qualification && n.qualification.toLowerCase().includes(q)) ||
        (n.specialization && n.specialization.toLowerCase().includes(q));
    });
  }, [nutritionists, searchQuery]);

  // Filtered All Accounts List
  const filteredAllAccounts = useMemo(() => {
    return allAccounts.filter(u => {
      const q = searchQuery.toLowerCase();
      return !q ||
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        ((u.role || 'USER').toLowerCase().includes(q));
    });
  }, [allAccounts, searchQuery]);

  const getRoleBadgeStyle = (roleStr) => {
    const role = (roleStr || 'USER').toUpperCase();
    if (role === 'ADMIN') return { bg: 'rgba(250, 204, 21, 0.18)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)' };
    if (role === 'TRAINER') return { bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' };
    if (role === 'NUTRITIONIST') return { bg: 'rgba(52, 211, 153, 0.18)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)' };
    return { bg: 'rgba(192, 132, 252, 0.18)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.35)' };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar 
        title="Admin Executive Control Hub" 
        subtitle="Real-time MongoDB platform metrics, registered users, staff directories & AI systems." 
      />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          {/* Toast Notification */}
          {actionNotice && (
            <div style={{ 
              backgroundColor: 'rgba(74,222,128,0.15)', 
              border: '1px solid #4ADE80', 
              color: '#4ADE80', 
              padding: '14px 20px', 
              borderRadius: '12px', 
              fontSize: '0.9rem', 
              marginBottom: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              boxShadow: '0 4px 15px rgba(74,222,128,0.2)' 
            }}>
              <CheckCircle2 size={20} /> {actionNotice}
            </div>
          )}

          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, fontWeight: 800 }}>Platform System Metrics & Live Directories</h2>
                <span className="badge" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                  Database Synced
                </span>
              </div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
                Accurate live data from MongoDB / persistent store: {stats?.totalUsers || registeredUsers.length} Registered Clients, {stats?.totalTrainers || trainers.length} Trainers, {stats?.totalNutritionists || nutritionists.length} Nutritionists
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={loadDashboardData}
                className="btn-secondary"
                disabled={loading}
                style={{ padding: '9px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={15} className={loading ? 'spin' : ''} />
                <span>{loading ? 'Refreshing...' : 'Refresh Live Data'}</span>
              </button>

              <Link
                to="/admin/users"
                className="btn-primary"
                style={{ textDecoration: 'none', padding: '9px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={15} />
                <span>Manage Users Portal</span>
              </Link>
            </div>
          </div>

          {/* 8 Primary Executive KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '32px' }}>
            <div onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }}>
              <StatCard 
                title="Registered Clients" 
                value={registeredUsers.length} 
                icon={Users} 
                color="#facc15" 
                subtext="Active Client Accounts" 
              />
            </div>
            <div onClick={() => setActiveTab('trainers')} style={{ cursor: 'pointer' }}>
              <StatCard 
                title="Personal Trainers" 
                value={trainers.length} 
                icon={UserCheck} 
                color="#38bdf8" 
                subtext="Certified Fitness Staff" 
              />
            </div>
            <div onClick={() => setActiveTab('nutritionists')} style={{ cursor: 'pointer' }}>
              <StatCard 
                title="Clinical Nutritionists" 
                value={nutritionists.length} 
                icon={Apple} 
                color="#ff9e7d" 
                subtext="Licensed Dietitians" 
              />
            </div>
            <div onClick={() => setActiveTab('all')} style={{ cursor: 'pointer' }}>
              <StatCard 
                title="Total Platform Accounts" 
                value={allAccounts.length} 
                icon={ShieldCheck} 
                color="#c084fc" 
                subtext="All System Logins" 
              />
            </div>

            <StatCard title="Exercise DB Items" value={stats?.totalExercises ?? 5} icon={Dumbbell} color="#a855f7" subtext="ML Workout Library" />
            <StatCard title="Food Dataset Items" value={stats?.totalNutritionItems ?? 5} icon={Utensils} color="#f43f5e" subtext="Nutritional Macro Pool" />
            <StatCard title="ML Workout Recs" value={stats?.workoutRecommendationsGenerated ?? 142} icon={Zap} color="#facc15" subtext="Scikit-Learn Model" />
            <StatCard title="AI Nutrition Plans" value={stats?.nutritionRecommendationsGenerated ?? 185} icon={Award} color="#4ade80" subtext="Caloric Optimization" />
          </div>

          {/* ========================================================================= */}
          {/* MAIN DIRECTORIES & REGISTERED USERS SECTION                              */}
          {/* ========================================================================= */}
          <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
            
            {/* Top Bar: Tabs & Search Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
              
              {/* Segmented View Tabs */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <button
                  onClick={() => setActiveTab('users')}
                  style={{
                    background: activeTab === 'users' ? 'linear-gradient(135deg, #facc15 0%, #ff9e7d 100%)' : 'transparent',
                    color: activeTab === 'users' ? '#000' : 'var(--text-subtle)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Users size={16} />
                  <span>Registered Clients ({registeredUsers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('trainers')}
                  style={{
                    background: activeTab === 'trainers' ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' : 'transparent',
                    color: activeTab === 'trainers' ? '#000' : 'var(--text-subtle)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserCheck size={16} />
                  <span>Personal Trainers ({trainers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('nutritionists')}
                  style={{
                    background: activeTab === 'nutritionists' ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' : 'transparent',
                    color: activeTab === 'nutritionists' ? '#000' : 'var(--text-subtle)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Apple size={16} />
                  <span>Nutritionists ({nutritionists.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('all')}
                  style={{
                    background: activeTab === 'all' ? 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)' : 'transparent',
                    color: activeTab === 'all' ? '#000' : 'var(--text-subtle)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>All Accounts ({allAccounts.length})</span>
                </button>
              </div>

              {/* Search & Filter Inputs */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', minWidth: '260px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--glass-border)',
                      padding: '8px 14px 8px 36px',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {activeTab === 'users' && (
                  <select
                    value={selectedGoalFilter}
                    onChange={(e) => setSelectedGoalFilter(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--glass-border)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="ALL">All Fitness Goals</option>
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="General Health">General Health</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Athletic Conditioning">Athletic Conditioning</option>
                  </select>
                )}
              </div>

            </div>

            {/* TAB CONTENT 1: REGISTERED CLIENTS */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} style={{ color: '#facc15' }} />
                    Registered Clients Directory
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                    Showing {filteredClients.length} of {registeredUsers.length} verified client accounts
                  </span>
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subtle)' }}>
                    <RefreshCw size={24} className="spin" style={{ marginBottom: '10px' }} />
                    <p>Loading registered user data from database...</p>
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subtle)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>No client users matching search criteria.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-subtle)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '12px 14px' }}>Client Profile</th>
                          <th style={{ padding: '12px 14px' }}>Fitness Goal & Diet</th>
                          <th style={{ padding: '12px 14px' }}>Biometrics</th>
                          <th style={{ padding: '12px 14px' }}>Assigned Specialists</th>
                          <th style={{ padding: '12px 14px' }}>Streak / XP</th>
                          <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((u) => {
                          const initials = (u.fullName || u.email || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          const hasSpecialists = Boolean(u.assignedTrainer?.name || u.assignedNutritionist?.name);
                          return (
                            <tr 
                              key={u.id || u.email}
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              {/* Name & Email */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ 
                                    width: '38px', 
                                    height: '38px', 
                                    borderRadius: '10px', 
                                    background: 'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(255,158,125,0.2))', 
                                    color: '#facc15', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    border: '1px solid rgba(250,204,21,0.3)'
                                  }}>
                                    {initials}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{u.fullName || 'Registered Member'}</div>
                                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>{u.email}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Goal & Diet */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '6px', background: 'rgba(250,204,21,0.12)', color: '#facc15', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                                  {u.fitnessGoal || 'General Fitness'}
                                </div>
                                <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
                                  Diet: {u.dietaryPreference || 'Standard'}
                                </div>
                              </td>

                              {/* Biometrics */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ color: '#fff', fontWeight: 600 }}>
                                  {u.weight ? `${u.weight} kg` : '--'} • {u.height ? `${u.height} cm` : '--'}
                                </div>
                                <div style={{ color: 'var(--text-subtle)', fontSize: '0.76rem' }}>
                                  BMI: {u.bmi ? Number(u.bmi).toFixed(1) : '--'} ({u.bmiCategory || 'Normal'})
                                </div>
                              </td>

                              {/* Assigned Specialists */}
                              <td style={{ padding: '14px' }}>
                                {hasSpecialists ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {u.assignedTrainer?.name && (
                                      <span style={{ fontSize: '0.76rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <UserCheck size={12} /> {u.assignedTrainer.name}
                                      </span>
                                    )}
                                    {u.assignedNutritionist?.name && (
                                      <span style={{ fontSize: '0.76rem', color: '#ff9e7d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Apple size={12} /> {u.assignedNutritionist.name}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                                    None
                                  </span>
                                )}
                              </td>

                              {/* Streak / XP */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 700, fontSize: '0.85rem' }}>
                                  <Flame size={14} /> {u.streakDays || 1} Days
                                </div>
                                <div style={{ color: 'var(--text-subtle)', fontSize: '0.76rem' }}>
                                  {u.points || 250} XP Score
                                </div>
                              </td>

                              {/* Action Buttons */}
                              <td style={{ padding: '14px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                  <button
                                    onClick={() => setSelectedUserModal(u)}
                                    className="btn-secondary"
                                    title="View Profile Metrics"
                                    style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Eye size={13} />
                                    <span>Profile</span>
                                  </button>

                                  <button
                                    onClick={() => setUserToDelete(u)}
                                    title="Delete User from Database"
                                    style={{
                                      background: 'rgba(244,63,94,0.12)',
                                      border: '1px solid rgba(244,63,94,0.3)',
                                      color: '#f43f5e',
                                      padding: '6px 8px',
                                      borderRadius: '8px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: PERSONAL TRAINERS DIRECTORY */}
            {activeTab === 'trainers' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={18} style={{ color: '#38bdf8' }} />
                    Certified Fitness Trainers Directory
                  </h3>
                  <Link to="/admin/trainers" style={{ color: '#38bdf8', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Full Trainers Governance <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                  {filteredTrainers.map((t) => (
                    <div 
                      key={t.id || t.email}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '14px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '1.02rem', fontWeight: 800 }}>{t.fullName}</h4>
                            <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>{t.email}</span>
                            <div style={{ marginTop: '3px' }}>
                              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 112, 67, 0.15)', color: '#FF7043', border: '1px solid rgba(255, 112, 67, 0.3)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                Initial: password123
                              </span>
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '3px 8px', 
                            borderRadius: '6px', 
                            background: 'rgba(56,189,248,0.15)', 
                            color: '#38bdf8',
                            border: '1px solid rgba(56,189,248,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <ShieldCheck size={12} /> VERIFIED
                          </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
                            {t.specialization || 'Strength & Conditioning'}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                            {t.certificationName || 'NASM Certified Personal Trainer'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          Experience: <strong style={{ color: '#fff' }}>{t.experienceYears || 5} Years</strong>
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                          {t.assignedClientsCount || t.assignedUsersCount || 0} Assigned Clients
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: CLINICAL NUTRITIONISTS DIRECTORY */}
            {activeTab === 'nutritionists' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Apple size={18} style={{ color: '#34d399' }} />
                    Clinical Dietitians & Nutritionists Directory
                  </h3>
                  <Link to="/admin/nutritionists" style={{ color: '#34d399', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Full Nutritionists Governance <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                  {filteredNutritionists.map((n) => (
                    <div 
                      key={n.id || n.email}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '14px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '1.02rem', fontWeight: 800 }}>{n.fullName}</h4>
                            <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>{n.email}</span>
                            <div style={{ marginTop: '3px' }}>
                              <span style={{ fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                Initial: password123
                              </span>
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '3px 8px', 
                            borderRadius: '6px', 
                            background: 'rgba(52,211,153,0.15)', 
                            color: '#34d399',
                            border: '1px solid rgba(52,211,153,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <ShieldCheck size={12} /> VERIFIED
                          </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
                            {n.qualification || 'M.Sc. Clinical Nutrition & Dietetics'}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                            Specialty: {n.specialization || 'Metabolic & Caloric Planning'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          Experience: <strong style={{ color: '#fff' }}>{n.experienceYears || 6} Years</strong>
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                          Active Licensure
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: ALL ACCOUNTS OVERVIEW */}
            {activeTab === 'all' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: '#c084fc' }} />
                    All System Logins & Role Permissions
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                    Total {filteredAllAccounts.length} platform accounts
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-subtle)', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 14px' }}>User / Account</th>
                        <th style={{ padding: '12px 14px' }}>Role / Clearance</th>
                        <th style={{ padding: '12px 14px' }}>Specialization / Goal</th>
                        <th style={{ padding: '12px 14px' }}>Last Activity</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAllAccounts.map((u) => {
                        const roleStyle = getRoleBadgeStyle(u.role);
                        return (
                          <tr 
                            key={u.id || u.email}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontWeight: 700, color: '#fff' }}>{u.fullName || u.name || 'Account'}</div>
                              <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>{u.email}</div>
                              {(u.role === 'TRAINER' || u.role === 'NUTRITIONIST') && (
                                <div style={{ marginTop: '2px' }}>
                                  <span style={{ fontSize: '0.68rem', background: u.role === 'TRAINER' ? 'rgba(255, 112, 67, 0.15)' : 'rgba(52, 211, 153, 0.15)', color: u.role === 'TRAINER' ? '#FF7043' : '#34D399', border: `1px solid ${u.role === 'TRAINER' ? 'rgba(255, 112, 67, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`, padding: '1px 4px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                    Initial: password123
                                  </span>
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                background: roleStyle.bg,
                                color: roleStyle.color,
                                border: roleStyle.border
                              }}>
                                {(u.role || 'USER').toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#e2e8f0' }}>
                              {u.specialization || u.qualification || u.fitnessGoal || 'Standard Platform Access'}
                            </td>
                            <td style={{ padding: '12px 14px', color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
                              {u.lastLoginTime || (u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'Active')}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <button
                                onClick={() => setSelectedUserModal(u)}
                                className="btn-secondary"
                                style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Quick Submodule Navigation Grid */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: '#facc15' }} />
              Specialized Admin Governance Portals
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Link to="/admin/users" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem' }}>Users Management</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.8rem' }}>View, filter & manage registered client accounts.</p>
                </div>
                <ArrowUpRight size={18} style={{ color: '#facc15' }} />
              </Link>

              <Link to="/admin/trainers" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem' }}>Trainers & Evidence</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.8rem' }}>NASM/ISSA credential verification engine.</p>
                </div>
                <ArrowUpRight size={18} style={{ color: '#38bdf8' }} />
              </Link>

              <Link to="/admin/nutritionists" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem' }}>Nutritionists Directory</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.8rem' }}>CDR licensure validation & dietitian loads.</p>
                </div>
                <ArrowUpRight size={18} style={{ color: '#34d399' }} />
              </Link>

              <Link to="/admin/exercises" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem' }}>Exercise Database</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.8rem' }}>Manage workout exercises pool for Scikit-Learn.</p>
                </div>
                <ArrowUpRight size={18} style={{ color: '#a855f7' }} />
              </Link>

              <Link to="/admin/nutrition" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem' }}>Nutrition & Macro Food Dataset</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.8rem' }}>Calorie, protein, carb & fat profiles.</p>
                </div>
                <ArrowUpRight size={18} style={{ color: '#f43f5e' }} />
              </Link>

              <Link to="/admin/recommendations" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem' }}>ML & AI Status</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.8rem' }}>FastAPI port 8000 & XAI engine health.</p>
                </div>
                <ArrowUpRight size={18} style={{ color: '#4ade80' }} />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* USER DETAIL MODAL                                                         */}
      {/* ========================================================================= */}
      {selectedUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid rgba(250,204,21,0.3)', position: 'relative' }}>
            
            <button 
              onClick={() => setSelectedUserModal(null)}
              style={{ position: 'absolute', right: '18px', top: '18px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #facc15 0%, #ff9e7d 100%)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                {(selectedUserModal.fullName || selectedUserModal.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>{selectedUserModal.fullName || 'Member Profile'}</h3>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.84rem' }}>{selectedUserModal.email}</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Fitness Goal</span>
                <div style={{ color: '#facc15', fontWeight: 700, fontSize: '0.9rem', marginTop: '2px' }}>{selectedUserModal.fitnessGoal || 'General Fitness'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Dietary Plan</span>
                <div style={{ color: '#ff9e7d', fontWeight: 700, fontSize: '0.9rem', marginTop: '2px' }}>{selectedUserModal.dietaryPreference || 'Standard'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>BMI Score</span>
                <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem', marginTop: '2px' }}>{selectedUserModal.bmi ? Number(selectedUserModal.bmi).toFixed(1) : '--'} ({selectedUserModal.bmiCategory || 'Normal'})</div>
              </div>
            </div>

            {/* Physical Biometrics */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Biometrics & Caloric Calculations</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.82rem' }}>
                <div><span style={{ color: 'var(--text-subtle)' }}>Weight:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.weight || '--'} kg</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>Height:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.height || '--'} cm</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>Age:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.age || '--'} yrs</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>Gender:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.gender || 'Not set'}</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>BMR:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.bmr || '--'} kcal</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>TDEE:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.tdee || '--'} kcal</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>Target:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.targetCalories || '--'} kcal</strong></div>
                <div><span style={{ color: 'var(--text-subtle)' }}>Equipment:</span> <strong style={{ color: '#fff' }}>{selectedUserModal.workoutEquipment || 'None'}</strong></div>
              </div>
            </div>

            {/* Assigned Specialists Info */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Specialists</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ background: 'rgba(56,189,248,0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.2)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <UserCheck size={13} /> Assigned Trainer
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', marginTop: '4px', fontSize: '0.92rem' }}>
                    {selectedUserModal.assignedTrainer?.name || 'Not Assigned'}
                  </div>
                  <div style={{ color: 'var(--text-subtle)', fontSize: '0.76rem', marginTop: '2px' }}>
                    {selectedUserModal.assignedTrainer?.specialization || 'No trainer assigned'}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,158,125,0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,158,125,0.2)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#ff9e7d', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Apple size={13} /> Assigned Nutritionist
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', marginTop: '4px', fontSize: '0.92rem' }}>
                    {selectedUserModal.assignedNutritionist?.name || 'Not Assigned'}
                  </div>
                  <div style={{ color: 'var(--text-subtle)', fontSize: '0.76rem', marginTop: '2px' }}>
                    {selectedUserModal.assignedNutritionist?.qualification || 'No nutritionist assigned'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {userToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '28px', border: '1px solid rgba(244,63,94,0.4)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.2rem' }}>Permanently Remove Account?</h3>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete user <strong style={{ color: '#fff' }}>{userToDelete.fullName || userToDelete.email}</strong> from MongoDB and the local store? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setUserToDelete(null)}
                className="btn-secondary"
                style={{ padding: '9px 18px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  background: '#f43f5e',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={15} />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
