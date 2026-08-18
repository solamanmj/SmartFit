import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { Users, Trash2, Eye } from 'lucide-react';
import { fetchAdminUsersApi, deleteAdminUserApi } from '../../services/adminApi';

const DEFAULT_USERS = [
  { id: '1', fullName: 'Aby Varghese', email: 'aby@example.com', fitnessGoal: 'Muscle Building', dietaryPreference: 'High Protein', role: 'USER', age: 26, weightKg: 74, heightCm: 178 },
  { id: '2', fullName: 'Sruthy Varghese', email: 'sruthy@example.com', fitnessGoal: 'Weight Loss', dietaryPreference: 'Vegetarian', role: 'USER', age: 24, weightKg: 60, heightCm: 165 },
  { id: '3', fullName: 'Alex Morgan', email: 'alex@example.com', fitnessGoal: 'Endurance', dietaryPreference: 'Standard Balanced', role: 'USER', age: 28, weightKg: 70, heightCm: 175 },
  { id: '4', fullName: 'System Administrator', email: 'admin@smartfit.com', fitnessGoal: 'Platform Governance', dietaryPreference: 'Standard', role: 'ADMIN', age: 30, weightKg: 75, heightCm: 180 }
];

export default function AdminUsers() {
  const [usersList, setUsersList] = useState(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    const data = await fetchAdminUsersApi();
    if (data && data.length > 0) {
      setUsersList(data);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (email, name) => {
    if (window.confirm(`Are you sure you want to permanently remove user "${name || email}" from MongoDB smartfit_db?`)) {
      await deleteAdminUserApi(email);
      setUsersList(prev => prev.filter(u => u.email !== email));
    }
  };

  const filteredUsers = usersList.filter(u => 
    (u.fullName && u.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.fitnessGoal && u.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="User Directory & Management" subtitle="View and manage all registered users stored in MongoDB smartfit_db.users collection." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={24} style={{ color: '#facc15' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Registered Database Users</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    MongoDB `smartfit_db.users` ({filteredUsers.length} Users Listed)
                  </p>
                </div>
              </div>

              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search name, email, or goal..." />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>User Name</th>
                    <th style={{ padding: '12px 14px' }}>Email Address</th>
                    <th style={{ padding: '12px 14px' }}>Fitness Goal</th>
                    <th style={{ padding: '12px 14px' }}>Dietary Pref.</th>
                    <th style={{ padding: '12px 14px' }}>Role</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        No users match search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => (
                      <tr key={u.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                          {u.fullName || u.name || 'SmartFit User'}
                        </td>
                        <td style={{ padding: '14px', color: '#4ade80' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {u.fitnessGoal || 'Muscle Building'}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {u.dietaryPreference || 'Standard'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: u.role === 'ADMIN' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: u.role === 'ADMIN' ? '#facc15' : 'var(--text-muted)',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {u.role || 'USER'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            style={{
                              background: 'rgba(255,255,255,0.08)',
                              border: '1px solid var(--glass-border)',
                              color: '#fff',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.email, u.fullName)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#fca5a5',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Details Modal */}
          {selectedUser && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '480px', width: '100%', background: '#1d0718' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '18px' }}>
                  User Profile Overview
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div><strong style={{ color: '#fff' }}>Name:</strong> {selectedUser.fullName || 'SmartFit User'}</div>
                  <div><strong style={{ color: '#fff' }}>Email:</strong> {selectedUser.email}</div>
                  <div><strong style={{ color: '#fff' }}>Fitness Goal:</strong> {selectedUser.fitnessGoal || 'Muscle Building'}</div>
                  <div><strong style={{ color: '#fff' }}>Dietary Preference:</strong> {selectedUser.dietaryPreference || 'Standard'}</div>
                  <div><strong style={{ color: '#fff' }}>Age:</strong> {selectedUser.age || 25} yrs</div>
                  <div><strong style={{ color: '#fff' }}>Weight:</strong> {selectedUser.weightKg || 70} kg</div>
                  <div><strong style={{ color: '#fff' }}>Height:</strong> {selectedUser.heightCm || 175} cm</div>
                  <div><strong style={{ color: '#fff' }}>Account Role:</strong> {selectedUser.role || 'USER'}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button onClick={() => setSelectedUser(null)} className="btn-primary" style={{ padding: '8px 20px' }}>
                    Close
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
