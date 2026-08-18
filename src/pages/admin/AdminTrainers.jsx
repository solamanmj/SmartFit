import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { UserCheck, Plus, Trash2, Edit } from 'lucide-react';
import { fetchAdminTrainersApi, saveAdminTrainerApi, deleteAdminTrainerApi } from '../../services/adminApi';

const DEFAULT_TRAINERS = [
  { id: '1', fullName: 'Marcus Vance', email: 'marcus.trainer@smartfit.com', specialization: 'Hypertrophy & Strength Conditioning', experienceYears: 8, assignedClientsCount: 14, status: 'ACTIVE' },
  { id: '2', fullName: 'Sarah Jenkins', email: 'sarah.trainer@smartfit.com', specialization: 'Cardio Endurance & Calisthenics', experienceYears: 6, assignedClientsCount: 12, status: 'ACTIVE' },
  { id: '3', fullName: 'David Kim', email: 'david.trainer@smartfit.com', specialization: 'Athletic Mobility & Functional Training', experienceYears: 5, assignedClientsCount: 9, status: 'ACTIVE' }
];

export default function AdminTrainers() {
  const [trainersList, setTrainersList] = useState(DEFAULT_TRAINERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: 'Hypertrophy & Strength Conditioning',
    experienceYears: 5,
    assignedClientsCount: 10,
    status: 'ACTIVE'
  });

  const loadTrainers = async () => {
    const data = await fetchAdminTrainersApi();
    if (data && data.length > 0) {
      setTrainersList(data);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const handleOpenAdd = () => {
    setEditingTrainer(null);
    setFormData({
      fullName: '',
      email: '',
      specialization: 'Hypertrophy & Strength Conditioning',
      experienceYears: 5,
      assignedClientsCount: 10,
      status: 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      fullName: trainer.fullName || '',
      email: trainer.email || '',
      specialization: trainer.specialization || '',
      experienceYears: trainer.experienceYears || 5,
      assignedClientsCount: trainer.assignedClientsCount || 0,
      status: trainer.status || 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = editingTrainer ? { ...editingTrainer, ...formData } : formData;
    const saved = await saveAdminTrainerApi(payload);
    if (editingTrainer) {
      setTrainersList(prev => prev.map(t => t.id === saved.id ? saved : t));
    } else {
      setTrainersList(prev => [...prev, saved]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove trainer "${name}"?`)) {
      await deleteAdminTrainerApi(id);
      setTrainersList(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTrainers = trainersList.filter(t =>
    (t.fullName && t.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Trainer Management" subtitle="Manage certified personal trainers & assigned user workloads." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <UserCheck size={24} style={{ color: '#38bdf8' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Certified Personal Trainers</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    MongoDB `smartfit_db.trainers` ({filteredTrainers.length} Entries)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search trainer name or email..." />
                <button
                  onClick={handleOpenAdd}
                  style={{
                    background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                    color: '#12030f',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Trainer</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>Trainer Name</th>
                    <th style={{ padding: '12px 14px' }}>Email Address</th>
                    <th style={{ padding: '12px 14px' }}>Specialization</th>
                    <th style={{ padding: '12px 14px' }}>Experience</th>
                    <th style={{ padding: '12px 14px' }}>Clients</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        No trainers registered.
                      </td>
                    </tr>
                  ) : (
                    filteredTrainers.map((t, idx) => (
                      <tr key={t.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                          {t.fullName}
                        </td>
                        <td style={{ padding: '14px', color: '#38bdf8' }}>
                          {t.email}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {t.specialization}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {t.experienceYears} Years
                        </td>
                        <td style={{ padding: '14px', color: '#facc15', fontWeight: 700 }}>
                          {t.assignedClientsCount} Users
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: t.status === 'ACTIVE' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: t.status === 'ACTIVE' ? '#4ade80' : '#fca5a5',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(t)}
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
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(t.id, t.fullName)}
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

          {/* Add / Edit Modal */}
          {showModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '500px', width: '100%', background: '#1d0718' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '20px' }}>
                  {editingTrainer ? 'Edit Trainer Record' : 'Add Certified Personal Trainer'}
                </h3>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Specialization</label>
                    <input type="text" className="form-input" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Experience (Years)</label>
                      <input type="number" className="form-input" value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <div>
                      <label className="form-label">Status</label>
                      <select className="form-input" style={{ background: '#12030f' }} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>Save Trainer</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
