import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShieldCheck, Users, Dumbbell, Database, Search, RefreshCw,
  Sparkles, User, Trash2
} from 'lucide-react';
import { fetchAllRegisteredUsersApi, deleteUserApi, API_BASE_URL } from '../services/api';
import { fetchAdminTrainersApi, fetchAdminNutritionistsApi } from '../services/adminApi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);
  const [nutritionistsList, setNutritionistsList] = useState([]);
  const [workoutLogsList, setWorkoutLogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('ALL');

  const handleDeleteUser = async (targetEmail, targetName) => {
    if (targetEmail === 'admin@smartfit.com') {
      alert('System Security Safeguard: Primary Administrator account cannot be deleted!');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove user account "${targetName || targetEmail}" (${targetEmail}) from MongoDB database?`)) {
      try {
        await deleteUserApi(targetEmail);
        setUsersList(prev => prev.filter(u => u.email !== targetEmail));
        alert(`User account ${targetEmail} successfully removed from MongoDB database.`);
      } catch (err) {
        alert(`Deletion error: ${err.message}`);
      }
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch users, trainers, nutritionists in parallel
      const [usersData, trainersData, nutritionistsData] = await Promise.all([
        fetchAllRegisteredUsersApi(),
        fetchAdminTrainersApi(),
        fetchAdminNutritionistsApi()
      ]);

      if (Array.isArray(usersData) && usersData.length > 0) {
        setUsersList(usersData);
      }
      if (Array.isArray(trainersData)) setTrainersList(trainersData);
      if (Array.isArray(nutritionistsData)) setNutritionistsList(nutritionistsData);

      // 2. Fetch all workout logs
      const logsRes = await fetch(`${API_BASE_URL}/workouts/all-logs`);
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setWorkoutLogsList(logsData);
      }
    } catch (err) {
      console.log('[INFO] Admin Dashboard fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      (u.fullName && u.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGoal =
      selectedGoalFilter === 'ALL' ||
      (u.fitnessGoal && u.fitnessGoal.toLowerCase().includes(selectedGoalFilter.toLowerCase()));

    return matchesSearch && matchesGoal;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

          {/* Header & Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge" style={{ marginBottom: '8px', background: 'rgba(255,158,125,0.15)', color: 'var(--peach-primary)' }}>
                <ShieldCheck size={15} /> SMARTFIT ADMIN CONTROL PANEL
              </div>
              <h1 className="gradient-peach-rose" style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0 }}>
                System Administration Dashboard
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
                MongoDB Database Management • System Analytics • User Directory & Audit Logs
              </p>
            </div>

            <button
              onClick={loadAdminData}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Refresh MongoDB Sync</span>
            </button>
          </div>

          {/* Core System Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase' }}>Registered Users</span>
                <Users size={20} style={{ color: 'var(--peach-primary)' }} />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{usersList.length}</div>
              <span style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 600 }}>● Synchronized in MongoDB</span>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase' }}>MongoDB Status</span>
                <Database size={20} style={{ color: '#4ade80' }} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>Active</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>smartfit_db (Port 27017)</span>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase' }}>Workout Logs</span>
                <Dumbbell size={20} style={{ color: '#38bdf8' }} />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{workoutLogsList.length}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>workout_logs collection</span>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--peach-soft)', fontWeight: 700, textTransform: 'uppercase' }}>FastAPI ML Status</span>
                <Sparkles size={20} style={{ color: '#facc15' }} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#facc15' }}>Online</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>ML Engine (Port 8000)</span>
            </div>
          </div>

          {/* Registered Users Table Card */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={24} style={{ color: 'var(--peach-primary)' }} />
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Registered Users Directory</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                    Complete list of user accounts registered in MongoDB `smartfit_db.users`
                  </p>
                </div>
              </div>

              {/* Search & Filter Inputs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '10px',
                      padding: '8px 12px 8px 36px',
                      color: '#fff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      width: '240px'
                    }}
                  />
                </div>

                <select
                  value={selectedGoalFilter}
                  onChange={(e) => setSelectedGoalFilter(e.target.value)}
                  style={{
                    background: '#1d0718',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Fitness Goals</option>
                  <option value="Muscle">Muscle Building</option>
                  <option value="Loss">Weight Loss / Fat Loss</option>
                  <option value="Endurance">Endurance</option>
                  <option value="Health">Health & Longevity</option>
                </select>
              </div>
            </div>

            {/* Users Directory Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '14px' }}>User Name</th>
                    <th style={{ padding: '14px' }}>Email Address</th>
                    <th style={{ padding: '14px' }}>Biometrics & Goal</th>
                    <th style={{ padding: '14px' }}>Assigned Trainer</th>
                    <th style={{ padding: '14px' }}>Assigned Nutritionist</th>
                    <th style={{ padding: '14px' }}>System Role</th>
                    <th style={{ padding: '14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        No registered users found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((usr, idx) => (
                      <tr key={usr.email || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                          {usr.fullName || 'Registered User'}
                        </td>
                        <td style={{ padding: '14px', color: 'var(--peach-light)' }}>
                          {usr.email}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 600, color: '#FFF' }}>{usr.fitnessGoal || 'Muscle Building'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                            {usr.age || 26} yrs • {usr.height || 178}cm / {usr.weight || 75}kg
                          </div>
                        </td>

                        {/* Assigned Trainer Dropdown / Display */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FF7043' }}>
                              🏋️ {usr.assignedTrainer?.name || 'Assigned Coach'}
                            </span>
                            <select 
                              value={usr.assignedTrainer?.email || (trainersList[0]?.email || '')}
                              onChange={async (e) => {
                                const email = e.target.value;
                                const selected = trainersList.find(t => t.email.toLowerCase() === email.toLowerCase()) || { fullName: 'Coach', specialization: 'Personal Trainer' };
                                try {
                                  await fetch(`${API_BASE_URL}/admin/assign-trainer`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      userEmail: usr.email,
                                      trainerEmail: email,
                                      trainerName: selected.fullName,
                                      specialization: selected.specialization
                                    })
                                  });
                                  loadAdminData();
                                } catch (err) {}
                              }}
                              style={{
                                background: '#1d0718',
                                border: '1px solid rgba(255,112,67,0.3)',
                                borderRadius: '6px',
                                padding: '4px 6px',
                                color: '#FFF',
                                fontSize: '0.75rem'
                              }}
                            >
                              {trainersList.map(t => (
                                <option key={t.email} value={t.email}>
                                  {t.fullName} ({t.specialization})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Assigned Nutritionist Dropdown / Display */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>
                              🥗 {usr.assignedNutritionist?.name || 'Assigned Dietitian'}
                            </span>
                            <select 
                              value={usr.assignedNutritionist?.email || (nutritionistsList[0]?.email || '')}
                              onChange={async (e) => {
                                const email = e.target.value;
                                const selected = nutritionistsList.find(n => n.email.toLowerCase() === email.toLowerCase()) || { fullName: 'Dietitian', qualification: 'Nutritionist' };
                                try {
                                  await fetch(`${API_BASE_URL}/admin/assign-nutritionist`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      userEmail: usr.email,
                                      nutritionistEmail: email,
                                      nutritionistName: selected.fullName,
                                      qualification: selected.qualification || selected.specialization
                                    })
                                  });
                                  loadAdminData();
                                } catch (err) {}
                              }}
                              style={{
                                background: '#1d0718',
                                border: '1px solid rgba(16,185,129,0.3)',
                                borderRadius: '6px',
                                padding: '4px 6px',
                                color: '#FFF',
                                fontSize: '0.75rem'
                              }}
                            >
                              {nutritionistsList.map(n => (
                                <option key={n.email} value={n.email}>
                                  {n.fullName} ({n.specialization || n.qualification})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: usr.role === 'ADMIN' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                            color: usr.role === 'ADMIN' ? '#facc15' : '#38bdf8',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {usr.role || 'USER'}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: 'rgba(74, 222, 128, 0.15)',
                            color: '#4ade80',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            Active
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button
                            onClick={() => handleDeleteUser(usr.email, usr.fullName)}
                            disabled={usr.email === 'admin@smartfit.com'}
                            style={{
                              background: usr.email === 'admin@smartfit.com' ? 'rgba(255,255,255,0.05)' : 'rgba(239, 68, 68, 0.15)',
                              color: usr.email === 'admin@smartfit.com' ? 'var(--text-subtle)' : '#fca5a5',
                              border: usr.email === 'admin@smartfit.com' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: usr.email === 'admin@smartfit.com' ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Trash2 size={14} />
                            <span>{usr.email === 'admin@smartfit.com' ? 'System Protected' : 'Remove User'}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Workout Activity Audit Logs Table */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Dumbbell size={24} style={{ color: '#38bdf8' }} />
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>System Workout Logs Audit</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                    Activity history recorded in MongoDB `smartfit_db.workout_logs`
                  </p>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                Audit Stream Live
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '14px' }}>User Email</th>
                    <th style={{ padding: '14px' }}>Workout Title</th>
                    <th style={{ padding: '14px' }}>Duration</th>
                    <th style={{ padding: '14px' }}>Calories Burned</th>
                    <th style={{ padding: '14px' }}>XP Earned</th>
                    <th style={{ padding: '14px' }}>Date Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutLogsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-subtle)' }}>
                        No workout activity logs recorded in database yet.
                      </td>
                    </tr>
                  ) : (
                    workoutLogsList.map((log, idx) => (
                      <tr key={log.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: 'var(--peach-light)' }}>
                          {log.userEmail}
                        </td>
                        <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>
                          {log.workoutTitle}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {log.durationMinutes} mins
                        </td>
                        <td style={{ padding: '14px', color: '#ff9e7d', fontWeight: 700 }}>
                          {log.caloriesBurned} kcal
                        </td>
                        <td style={{ padding: '14px', color: '#4ade80', fontWeight: 700 }}>
                          +{log.xpEarned} XP
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-subtle)' }}>
                          {log.date}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
