import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { Apple, Plus, Trash2, Edit } from 'lucide-react';
import { fetchAdminNutritionistsApi, saveAdminNutritionistApi, deleteAdminNutritionistApi } from '../../services/adminApi';

export default function AdminNutritionists() {
  const [nutritionistsList, setNutritionistsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    qualification: 'M.Sc. Clinical Nutrition',
    specialization: 'High-Protein & Metabolic Diets',
    experienceYears: 6,
    status: 'ACTIVE'
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminNutritionistsApi();
    setNutritionistsList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      fullName: '',
      email: '',
      qualification: 'M.Sc. Clinical Nutrition',
      specialization: 'High-Protein & Metabolic Diets',
      experienceYears: 6,
      status: 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (n) => {
    setEditingItem(n);
    setFormData({
      fullName: n.fullName || '',
      email: n.email || '',
      qualification: n.qualification || '',
      specialization: n.specialization || '',
      experienceYears: n.experienceYears || 6,
      status: n.status || 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = editingItem ? { ...editingItem, ...formData } : formData;
    const saved = await saveAdminNutritionistApi(payload);
    if (editingItem) {
      setNutritionistsList(prev => prev.map(n => n.id === saved.id ? saved : n));
    } else {
      setNutritionistsList(prev => [...prev, saved]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove nutritionist "${name}"?`)) {
      await deleteAdminNutritionistApi(id);
      setNutritionistsList(prev => prev.filter(n => n.id !== id));
    }
  };

  const filteredList = nutritionistsList.filter(n =>
    (n.fullName && n.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (n.email && n.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Nutritionist Management" subtitle="Manage registered clinical nutritionists & dietitians." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Apple size={24} style={{ color: '#ff9e7d' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Registered Dietitians & Nutritionists</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    MongoDB `smartfit_db.nutritionists` ({filteredList.length} Entries)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search nutritionist name or email..." />
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
                  <span>Add Nutritionist</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>Nutritionist Name</th>
                    <th style={{ padding: '12px 14px' }}>Email Address</th>
                    <th style={{ padding: '12px 14px' }}>Qualification</th>
                    <th style={{ padding: '12px 14px' }}>Specialization</th>
                    <th style={{ padding: '12px 14px' }}>Experience</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        {loading ? 'Loading nutritionists list...' : 'No nutritionists registered.'}
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((n, idx) => (
                      <tr key={n.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                          {n.fullName}
                        </td>
                        <td style={{ padding: '14px', color: '#ff9e7d' }}>
                          {n.email}
                        </td>
                        <td style={{ padding: '14px', color: '#fff' }}>
                          {n.qualification}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {n.specialization}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {n.experienceYears} Years
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: n.status === 'ACTIVE' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: n.status === 'ACTIVE' ? '#4ade80' : '#fca5a5',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {n.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(n)}
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
                            onClick={() => handleDelete(n.id, n.fullName)}
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

          {/* Add / Edit Nutritionist Modal */}
          {showModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '500px', width: '100%', background: '#1d0718' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '20px' }}>
                  {editingItem ? 'Edit Nutritionist Profile' : 'Add Licensed Nutritionist'}
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
                    <label className="form-label">Academic Qualification</label>
                    <input type="text" className="form-input" value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} required />
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
                      <label className="form-label">Account Status</label>
                      <select className="form-input" style={{ background: '#12030f' }} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>Save Profile</button>
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
