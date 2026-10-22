import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { Utensils, Plus, Trash2, Edit } from 'lucide-react';
import { fetchAdminNutritionApi, saveAdminNutritionApi, deleteAdminNutritionApi } from '../../services/adminApi';

export default function AdminNutrition() {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    calories: 200,
    proteinGrams: 25.0,
    carbGrams: 10.0,
    fatGrams: 5.0,
    category: 'Poultry',
    dietaryCategory: 'Standard Balanced'
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminNutritionApi();
    setFoodList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      calories: 200,
      proteinGrams: 25.0,
      carbGrams: 10.0,
      fatGrams: 5.0,
      category: 'Poultry',
      dietaryCategory: 'Standard Balanced'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      calories: item.calories || 200,
      proteinGrams: item.proteinGrams || 0,
      carbGrams: item.carbGrams || 0,
      fatGrams: item.fatGrams || 0,
      category: item.category || 'General',
      dietaryCategory: item.dietaryCategory || 'Standard Balanced'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = editingItem ? { ...editingItem, ...formData } : formData;
    const saved = await saveAdminNutritionApi(payload);
    if (editingItem) {
      setFoodList(prev => prev.map(f => f.id === saved.id ? saved : f));
    } else {
      setFoodList(prev => [...prev, saved]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete food item "${name}" from MongoDB database?`)) {
      await deleteAdminNutritionApi(id);
      setFoodList(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredList = foodList.filter(f =>
    (f.name && f.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Nutrition Database Management" subtitle="Manage food dataset, calorie profiles, and macro splits for SmartFit AI Nutrition Engine." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Utensils size={24} style={{ color: '#f43f5e' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Nutritional Items Dataset</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    MongoDB `smartfit_db.nutrition_foods` ({filteredList.length} Items)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search food item or category..." />
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
                  <span>Add Food Item</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>Food Name</th>
                    <th style={{ padding: '12px 14px' }}>Calories</th>
                    <th style={{ padding: '12px 14px' }}>Protein (g)</th>
                    <th style={{ padding: '12px 14px' }}>Carbs (g)</th>
                    <th style={{ padding: '12px 14px' }}>Fat (g)</th>
                    <th style={{ padding: '12px 14px' }}>Food Category</th>
                    <th style={{ padding: '12px 14px' }}>Dietary Alignment</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        {loading ? 'Loading food dataset...' : 'No food items found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((f, idx) => (
                      <tr key={f.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>
                          {f.name}
                        </td>
                        <td style={{ padding: '14px', color: '#facc15', fontWeight: 700 }}>
                          {f.calories} kcal
                        </td>
                        <td style={{ padding: '14px', color: '#ff9e7d', fontWeight: 700 }}>
                          {f.proteinGrams}g
                        </td>
                        <td style={{ padding: '14px', color: '#facc15' }}>
                          {f.carbGrams}g
                        </td>
                        <td style={{ padding: '14px', color: '#38bdf8' }}>
                          {f.fatGrams}g
                        </td>
                        <td style={{ padding: '14px' }}>
                          {f.category}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: 'rgba(244, 63, 94, 0.15)',
                            color: '#f43f5e',
                            padding: '4px 8px',
                            borderRadius: '10px',
                            fontSize: '0.78rem'
                          }}>
                            {f.dietaryCategory}
                          </span>
                        </td>
                        <td style={{ padding: '14px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(f)}
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
                            onClick={() => handleDelete(f.id, f.name)}
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

          {/* Add / Edit Food Item Modal */}
          {showModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}>
              <div className="glass-card" style={{ padding: '32px', maxWidth: '520px', width: '100%', background: '#1d0718' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', marginTop: 0, marginBottom: '20px' }}>
                  {editingItem ? 'Edit Food Item Record' : 'Add Food Item to Dataset'}
                </h3>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="form-label">Food Item Name</label>
                    <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Calories (kcal)</label>
                      <input type="number" className="form-input" value={formData.calories} onChange={e => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <div>
                      <label className="form-label">Protein (g)</label>
                      <input type="number" step="0.1" className="form-input" value={formData.proteinGrams} onChange={e => setFormData({ ...formData, proteinGrams: parseFloat(e.target.value) || 0 })} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Carbohydrates (g)</label>
                      <input type="number" step="0.1" className="form-input" value={formData.carbGrams} onChange={e => setFormData({ ...formData, carbGrams: parseFloat(e.target.value) || 0 })} required />
                    </div>
                    <div>
                      <label className="form-label">Fats (g)</label>
                      <input type="number" step="0.1" className="form-input" value={formData.fatGrams} onChange={e => setFormData({ ...formData, fatGrams: parseFloat(e.target.value) || 0 })} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Category</label>
                      <input type="text" className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Dietary Alignment</label>
                      <input type="text" className="form-input" value={formData.dietaryCategory} onChange={e => setFormData({ ...formData, dietaryCategory: e.target.value })} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>Save Food Item</button>
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
