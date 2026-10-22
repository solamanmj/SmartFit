import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { Dumbbell, Plus, Trash2, Edit } from 'lucide-react';
import { fetchAdminExercisesApi, saveAdminExerciseApi, deleteAdminExerciseApi } from '../../services/adminApi';

export default function AdminExercises() {
  const [exercisesList, setExercisesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    workoutType: 'Hypertrophy',
    muscleGroup: 'Chest & Triceps',
    difficulty: 'Intermediate',
    equipmentNeeded: 'Dumbbells & Bench',
    durationMinutes: 15,
    estimatedCaloriesBurned: 140,
    instructions: 'Perform with strict form and full range of motion.'
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminExercisesApi();
    setExercisesList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      workoutType: 'Hypertrophy',
      muscleGroup: 'Chest & Triceps',
      difficulty: 'Intermediate',
      equipmentNeeded: 'Dumbbells & Bench',
      durationMinutes: 15,
      estimatedCaloriesBurned: 140,
      instructions: 'Perform with strict form and full range of motion.'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      workoutType: item.workoutType || 'Hypertrophy',
      muscleGroup: item.muscleGroup || '',
      difficulty: item.difficulty || 'Intermediate',
      equipmentNeeded: item.equipmentNeeded || '',
      durationMinutes: item.durationMinutes || 15,
      estimatedCaloriesBurned: item.estimatedCaloriesBurned || 140,
      instructions: item.instructions || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = editingItem ? { ...editingItem, ...formData } : formData;
    const saved = await saveAdminExerciseApi(payload);
    if (editingItem) {
      setExercisesList(prev => prev.map(ex => ex.id === saved.id ? saved : ex));
    } else {
      setExercisesList(prev => [...prev, saved]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete exercise "${name}" from MongoDB database?`)) {
      await deleteAdminExerciseApi(id);
      setExercisesList(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const filteredList = exercisesList.filter(ex =>
    (ex.name && ex.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Exercise Database Management" subtitle="Maintain exercise database used by SmartFit ML Workout Recommendation Engine." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Dumbbell size={24} style={{ color: '#a855f7' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Exercise Repository</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    MongoDB `smartfit_db.exercises` ({filteredList.length} Items)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search exercise name or muscle..." />
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
                  <span>Add Exercise</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>Exercise Name</th>
                    <th style={{ padding: '12px 14px' }}>Type</th>
                    <th style={{ padding: '12px 14px' }}>Muscle Group</th>
                    <th style={{ padding: '12px 14px' }}>Difficulty</th>
                    <th style={{ padding: '12px 14px' }}>Equipment</th>
                    <th style={{ padding: '12px 14px' }}>Duration</th>
                    <th style={{ padding: '12px 14px' }}>Est. Calories</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        {loading ? 'Loading exercise repository...' : 'No exercises found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((ex, idx) => (
                      <tr key={ex.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                          {ex.name}
                        </td>
                        <td style={{ padding: '14px', color: '#a855f7', fontWeight: 600 }}>
                          {ex.workoutType}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {ex.muscleGroup}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: 'rgba(250, 204, 21, 0.15)',
                            color: '#facc15',
                            padding: '4px 8px',
                            borderRadius: '10px',
                            fontSize: '0.78rem'
                          }}>
                            {ex.difficulty}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {ex.equipmentNeeded}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {ex.durationMinutes} mins
                        </td>
                        <td style={{ padding: '14px', color: '#ff9e7d', fontWeight: 700 }}>
                          {ex.estimatedCaloriesBurned} kcal
                        </td>
                        <td style={{ padding: '14px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(ex)}
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
                            onClick={() => handleDelete(ex.id, ex.name)}
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
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Exercise Modal */}
          {showModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '520px', width: '100%', background: '#1d0718' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '20px' }}>
                  {editingItem ? 'Edit Exercise Record' : 'Add New Exercise to DB'}
                </h3>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="form-label">Exercise Name</label>
                    <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Workout Type</label>
                      <input type="text" className="form-input" value={formData.workoutType} onChange={e => setFormData({ ...formData, workoutType: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Muscle Group</label>
                      <input type="text" className="form-input" value={formData.muscleGroup} onChange={e => setFormData({ ...formData, muscleGroup: e.target.value })} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Difficulty</label>
                      <select className="form-input" style={{ background: '#12030f' }} value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Equipment</label>
                      <input type="text" className="form-input" value={formData.equipmentNeeded} onChange={e => setFormData({ ...formData, equipmentNeeded: e.target.value })} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Duration (Mins)</label>
                      <input type="number" className="form-input" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <div>
                      <label className="form-label">Est. Calories Burned</label>
                      <input type="number" className="form-input" value={formData.estimatedCaloriesBurned} onChange={e => setFormData({ ...formData, estimatedCaloriesBurned: parseInt(e.target.value) || 0 })} required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Exercise Instructions</label>
                    <textarea className="form-input" rows={3} value={formData.instructions} onChange={e => setFormData({ ...formData, instructions: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>Save Exercise</button>
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
