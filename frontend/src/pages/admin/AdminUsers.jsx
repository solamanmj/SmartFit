import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { 
  Users, Trash2, Eye, ShieldCheck, CheckCircle2, 
  RefreshCw, AlertTriangle, X, Award, HeartHandshake 
} from 'lucide-react';
import { 
  fetchAdminUsersApi, 
  deleteAdminUserApi, 
  fetchAdminTrainersApi, 
  fetchAdminNutritionistsApi, 
  assignCareTeamApi 
} from '../../services/adminApi';

export default function AdminUsers() {
  const [usersList, setUsersList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);
  const [nutritionistsList, setNutritionistsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [goalFilter, setGoalFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [users, trainers, nutritionists] = await Promise.all([
        fetchAdminUsersApi(),
        fetchAdminTrainersApi(),
        fetchAdminNutritionistsApi()
      ]);

      if (users && Array.isArray(users)) setUsersList(users);
      if (trainers && Array.isArray(trainers)) setTrainersList(trainers);
      if (nutritionists && Array.isArray(nutritionists)) setNutritionistsList(nutritionists);
    } catch (e) {
      console.warn('Error loading admin governance data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Manual Trainer Reassignment
  const handleAssignTrainer = async (userEmail, trainerEmail, trainerName, specialization) => {
    try {
      await assignCareTeamApi({
        userEmail,
        trainerEmail,
        trainerName,
        specialization
      });
      setUsersList(prev => prev.map(u => 
        u.email === userEmail ? { ...u, assignedTrainer: { email: trainerEmail, name: trainerName, specialization } } : u
      ));
      setAssignSuccess(`Assigned Coach "${trainerName}" (${specialization}) to ${userEmail} successfully.`);
      setTimeout(() => setAssignSuccess(''), 4000);
    } catch (e) {
      console.warn('Error assigning trainer:', e);
    }
  };

  // Manual Nutritionist Reassignment
  const handleAssignNutritionist = async (userEmail, nutritionistEmail, nutritionistName, qualification) => {
    try {
      await assignCareTeamApi({
        userEmail,
        nutritionistEmail,
        nutritionistName,
        qualification
      });
      setUsersList(prev => prev.map(u => 
        u.email === userEmail ? { ...u, assignedNutritionist: { email: nutritionistEmail, name: nutritionistName, qualification } } : u
      ));
      setAssignSuccess(`Assigned Dietitian "${nutritionistName}" (${qualification}) to ${userEmail} successfully.`);
      setTimeout(() => setAssignSuccess(''), 4000);
    } catch (e) {
      console.warn('Error assigning nutritionist:', e);
    }
  };

  // Confirm Permanent Deletion from Database
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const { email, fullName } = userToDelete;

    if (email === 'admin@smartfit.com') {
      alert('System Security Guard: Primary Administrator account cannot be deleted!');
      setUserToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAdminUserApi(email);
      setUsersList(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));

      // Purge from browser localStorage accounts to prevent stale/resurrected state
      try {
        const stored = JSON.parse(localStorage.getItem('smartfit_accounts') || '[]');
        const next = stored.filter(u => (u.email || '').toLowerCase() !== email.toLowerCase());
        localStorage.setItem('smartfit_accounts', JSON.stringify(next));
      } catch (e) {}

      setAssignSuccess(`User account "${fullName || email}" (${email}) was permanently removed from database.`);
      setTimeout(() => setAssignSuccess(''), 5000);
      setUserToDelete(null);
    } catch (err) {
      alert('Failed to remove user from database: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.fitnessGoal && u.fitnessGoal.toLowerCase().includes(q)) ||
      (u.dietaryPreference && u.dietaryPreference.toLowerCase().includes(q));
    
    const userRole = (u.role || 'USER').toUpperCase();
    const matchesRole = roleFilter === 'ALL' || userRole === roleFilter;

    const userGoal = (u.fitnessGoal || '').toLowerCase();
    const matchesGoal = goalFilter === 'ALL' || userGoal.includes(goalFilter.toLowerCase());

    return matchesSearch && matchesRole && matchesGoal;
  });

  const getRoleBadgeStyle = (roleStr) => {
    const role = (roleStr || 'USER').toUpperCase();
    if (role === 'ADMIN') return { bg: 'rgba(250, 204, 21, 0.2)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)' };
    if (role === 'TRAINER') return { bg: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' };
    if (role === 'NUTRITIONIST') return { bg: 'rgba(52, 211, 153, 0.2)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)' };
    return { bg: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)' };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="User Directory & Specialist Governance" subtitle="Manage registered database users, assigned specialists, and account removals." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {assignSuccess && (
            <div style={{ backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid #4ADE80', color: '#4ADE80', padding: '14px 20px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(74,222,128,0.2)' }}>
              <CheckCircle2 size={20} /> {assignSuccess}
            </div>
          )}

          {/* Top Quick Stats Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Total Users</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{usersList.length}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56,189,248,0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Enrolled Trainers</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38BDF8' }}>{trainersList.length}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(52,211,153,0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartHandshake size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Enrolled Nutritionists</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>{nutritionistsList.length}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(232, 128, 157, 0.15)', color: 'var(--peach-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase' }}>Registered Clients</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--peach-light)' }}>{usersList.filter(u => (u.role || 'USER').toUpperCase() === 'USER').length}</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>Registered Users & Specialist Directory</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    View and manage all registered client accounts, trainers, and clinical nutritionists.
                  </p>
                </div>
              </div>

              {/* Action Buttons & Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    background: '#12030f',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">Clients (Users)</option>
                  <option value="TRAINER">Personal Trainers</option>
                  <option value="NUTRITIONIST">Nutritionists</option>
                  <option value="ADMIN">Administrators</option>
                </select>

                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value)}
                  style={{
                    background: '#12030f',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Goals</option>
                  <option value="Health">Health & Longevity</option>
                  <option value="Muscle">Muscle Building</option>
                  <option value="Loss">Fat / Weight Loss</option>
                  <option value="Athletic">Athletic Performance</option>
                  <option value="Endurance">Cardio Endurance</option>
                </select>

                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search user, goal, or diet..." />

                <button
                  onClick={loadAllData}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Sync with Live Database"
                >
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '14px 16px' }}>User & Contact</th>
                    <th style={{ padding: '14px 16px' }}>Fitness Goal & Diet</th>
                    <th style={{ padding: '14px 16px' }}>Assigned Fitness Trainer</th>
                    <th style={{ padding: '14px 16px' }}>Assigned Clinical Nutritionist</th>
                    <th style={{ padding: '14px 16px' }}>Role</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-subtle)' }}>
                        {loading ? 'Fetching registered users...' : 'No users found matching criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => {
                      const badge = getRoleBadgeStyle(u.role);
                      const initial = (u.fullName || u.email || 'U').charAt(0).toUpperCase();
                      const isClient = !u.role || u.role === 'USER';
                      const isAdmin = (u.email || '').toLowerCase() === 'admin@smartfit.com';

                      return (
                        <tr key={u._id || u.id || u.email || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                          
                          {/* User Info */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: u.role === 'ADMIN' ? 'linear-gradient(135deg, #facc15, #ca8a04)' : 'linear-gradient(135deg, var(--peach-primary), var(--rose-primary))',
                                color: u.role === 'ADMIN' ? '#12030f' : '#fff',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                                flexShrink: 0
                              }}>
                                {initial}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#fff' }}>{u.fullName || u.name || 'SmartFit User'}</div>
                                <div style={{ color: '#38BDF8', fontSize: '0.78rem' }}>{u.email}</div>
                                {(u.role === 'TRAINER' || u.role === 'NUTRITIONIST') && (
                                  <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      background: u.role === 'TRAINER' ? 'rgba(255, 112, 67, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                                      color: u.role === 'TRAINER' ? '#FF7043' : '#34D399',
                                      border: `1px solid ${u.role === 'TRAINER' ? 'rgba(255, 112, 67, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      fontFamily: 'monospace'
                                    }}>
                                      Initial: password123
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Goal & Dietary Preference */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content' }}>
                                🎯 {u.fitnessGoal || 'General Health'}
                              </span>
                              <span style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34d399', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, width: 'fit-content' }}>
                                🥗 {u.dietaryPreference || 'Standard Balanced'}
                              </span>
                            </div>
                          </td>

                          {/* Assigned Trainer Dropdown */}
                          <td style={{ padding: '14px 16px' }}>
                            {!isClient ? (
                              <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>Staff Member</span>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '0.82rem', color: '#FF7043', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>🏋️</span>
                                  <span>{u.assignedTrainer?.name || 'Assigned Coach'}</span>
                                </div>
                                <select
                                  value={u.assignedTrainer?.email || (trainersList[0]?.email || '')}
                                  onChange={(e) => {
                                    const selectedEmail = e.target.value;
                                    const selectedObj = trainersList.find(t => t.email.toLowerCase() === selectedEmail.toLowerCase());
                                    if (selectedObj) {
                                      handleAssignTrainer(u.email, selectedObj.email, selectedObj.fullName, selectedObj.specialization);
                                    }
                                  }}
                                  style={{
                                    background: '#12030f',
                                    border: '1px solid #FF7043',
                                    color: '#FFB8A1',
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    maxWidth: '220px'
                                  }}
                                >
                                  {trainersList.map(tr => (
                                    <option key={tr.email} value={tr.email}>
                                      {tr.fullName} ({tr.specialization})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </td>

                          {/* Assigned Nutritionist Dropdown */}
                          <td style={{ padding: '14px 16px' }}>
                            {!isClient ? (
                              <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>Staff Member</span>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>🥗</span>
                                  <span>{u.assignedNutritionist?.name || 'Assigned Dietitian'}</span>
                                </div>
                                <select
                                  value={u.assignedNutritionist?.email || (nutritionistsList[0]?.email || '')}
                                  onChange={(e) => {
                                    const selectedEmail = e.target.value;
                                    const selectedObj = nutritionistsList.find(n => n.email.toLowerCase() === selectedEmail.toLowerCase());
                                    if (selectedObj) {
                                      handleAssignNutritionist(u.email, selectedObj.email, selectedObj.fullName, selectedObj.qualification || selectedObj.specialization);
                                    }
                                  }}
                                  style={{
                                    background: '#12030f',
                                    border: '1px solid #10B981',
                                    color: '#A7F3D0',
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    maxWidth: '220px'
                                  }}
                                >
                                  {nutritionistsList.map(nu => (
                                    <option key={nu.email} value={nu.email}>
                                      {nu.fullName} ({nu.specialization || nu.qualification})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </td>

                          {/* Role */}
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              background: badge.bg,
                              color: badge.color,
                              border: badge.border,
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              letterSpacing: '0.5px'
                            }}>
                              {u.role ? u.role.toUpperCase() : 'USER'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                              <button
                                onClick={() => setSelectedUser(u)}
                                style={{
                                  background: 'rgba(255,255,255,0.08)',
                                  border: '1px solid var(--glass-border)',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.78rem',
                                  transition: 'all 0.2s'
                                }}
                                title="Inspect User Profile & Specialist Assignment"
                              >
                                <Eye size={13} />
                                <span>Details</span>
                              </button>

                              {isAdmin ? (
                                <span style={{
                                  background: 'rgba(250, 204, 21, 0.12)',
                                  border: '1px solid rgba(250, 204, 21, 0.3)',
                                  color: '#facc15',
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <ShieldCheck size={12} /> Root Admin
                                </span>
                              ) : (
                                <button
                                  onClick={() => setUserToDelete(u)}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.35)',
                                    color: '#fca5a5',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600
                                  }}
                                  title={`Remove ${u.fullName || u.email} from database`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* USER DETAILS & SPECIALIST ASSIGNMENT MODAL */}
          {/* ========================================================================= */}
          {selectedUser && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(10px)'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '640px', width: '100%', background: '#1d0718', border: '1px solid var(--peach-primary)', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={24} style={{ color: '#FF7043' }} />
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                      User Profile & Specialist Assignment
                    </h3>
                  </div>
                  <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Profile Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div><strong style={{ color: '#fff' }}>Full Name:</strong> {selectedUser.fullName || 'SmartFit User'}</div>
                  <div><strong style={{ color: '#fff' }}>Email:</strong> {selectedUser.email}</div>
                  <div><strong style={{ color: '#fff' }}>Primary Goal:</strong> <span style={{ color: '#FACC15', fontWeight: 700 }}>{selectedUser.fitnessGoal || 'General Health'}</span></div>
                  <div><strong style={{ color: '#fff' }}>Diet Preference:</strong> <span style={{ color: '#34D399', fontWeight: 700 }}>{selectedUser.dietaryPreference || 'Standard Balanced'}</span></div>
                  <div><strong style={{ color: '#fff' }}>Equipment:</strong> {selectedUser.workoutEquipment || 'Standard Access'}</div>
                  <div><strong style={{ color: '#fff' }}>Biometrics:</strong> {selectedUser.age || 26} yrs • {selectedUser.weight || 75} kg (BMI {selectedUser.bmi || 24})</div>
                </div>

                {/* Assignment Form Controls */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#FF7043', fontWeight: 700, marginBottom: '6px' }}>
                      🏋️ Assign Personal Trainer
                    </label>
                    <select
                      value={selectedUser.assignedTrainer?.email || ''}
                      onChange={(e) => {
                        const email = e.target.value;
                        const t = trainersList.find(x => x.email.toLowerCase() === email.toLowerCase());
                        setSelectedUser({
                          ...selectedUser,
                          assignedTrainer: t ? { email: t.email, name: t.fullName, specialization: t.specialization } : { email, name: email.split('@')[0], specialization: 'Coach' }
                        });
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#2a0d24', color: '#fff', border: '1px solid rgba(255,112,67,0.4)', fontSize: '0.88rem' }}
                    >
                      {trainersList.map(t => (
                        <option key={t.email} value={t.email}>
                          {t.fullName} — {t.specialization} ({t.experienceYears} yrs exp)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#10B981', fontWeight: 700, marginBottom: '6px' }}>
                      🥗 Assign Clinical Nutritionist
                    </label>
                    <select
                      value={selectedUser.assignedNutritionist?.email || ''}
                      onChange={(e) => {
                        const email = e.target.value;
                        const n = nutritionistsList.find(x => x.email.toLowerCase() === email.toLowerCase());
                        setSelectedUser({
                          ...selectedUser,
                          assignedNutritionist: n ? { email: n.email, name: n.fullName, qualification: n.qualification || n.specialization } : { email, name: email.split('@')[0], qualification: 'Dietitian' }
                        });
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#2a0d24', color: '#fff', border: '1px solid rgba(16,185,129,0.4)', fontSize: '0.88rem' }}
                    >
                      {nutritionistsList.map(n => (
                        <option key={n.email} value={n.email}>
                          {n.fullName} — {n.specialization || n.qualification}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button onClick={() => setSelectedUser(null)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const trainer = selectedUser.assignedTrainer || { email: trainersList[0]?.email, name: trainersList[0]?.fullName, specialization: trainersList[0]?.specialization };
                      const nutritionist = selectedUser.assignedNutritionist || { email: nutritionistsList[0]?.email, name: nutritionistsList[0]?.fullName, qualification: nutritionistsList[0]?.qualification };
                      
                      try {
                        await assignCareTeamApi({
                          userEmail: selectedUser.email,
                          trainerEmail: trainer.email,
                          trainerName: trainer.name,
                          specialization: trainer.specialization,
                          nutritionistEmail: nutritionist.email,
                          nutritionistName: nutritionist.name,
                          qualification: nutritionist.qualification
                        });
                        setUsersList(prev => prev.map(u => u.email === selectedUser.email ? { ...u, assignedTrainer: trainer, assignedNutritionist: nutritionist } : u));
                        setAssignSuccess(`Specialists updated: Coach ${trainer.name} & Dietitian ${nutritionist.name} assigned to ${selectedUser.fullName || selectedUser.email}`);
                        setTimeout(() => setAssignSuccess(''), 5000);
                        setSelectedUser(null);
                      } catch (err) {
                        alert('Assignment failed: ' + err.message);
                      }
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 22px', fontSize: '0.88rem', fontWeight: 800 }}
                  >
                    Save Custom Assignment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deletion confirmation modal */}
          {userToDelete && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '20px', backdropFilter: 'blur(8px)'
            }}>
              <div className="glass-card" style={{
                padding: '32px', maxWidth: '500px', width: '100%',
                background: '#1f0614', border: '1px solid #ef4444', borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 800 }}>
                      Remove User from Database?
                    </h3>
                    <p style={{ color: 'var(--text-subtle)', fontSize: '0.86rem', margin: 0, lineHeight: 1.4 }}>
                      Are you sure you want to permanently delete this user account from database?
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '14px', marginBottom: '20px', fontSize: '0.86rem'
                }}>
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Name: </span>
                    <strong style={{ color: '#fff' }}>{userToDelete.fullName || 'SmartFit User'}</strong>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Email: </span>
                    <strong style={{ color: '#4ade80' }}>{userToDelete.email}</strong>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Fitness Goal: </span>
                    <span style={{ color: '#facc15', fontWeight: 600 }}>{userToDelete.fitnessGoal || 'General Health'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Role: </span>
                    <span style={{ color: '#c084fc', fontWeight: 700 }}>{userToDelete.role || 'USER'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={() => setUserToDelete(null)}
                    disabled={isDeleting}
                    className="btn-secondary"
                    style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    disabled={isDeleting}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      border: 'none',
                      color: '#fff',
                      padding: '9px 20px',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw size={14} className="spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        <span>Confirm & Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
