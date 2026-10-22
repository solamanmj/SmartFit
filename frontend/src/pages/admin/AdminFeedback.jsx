import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import SearchBar from '../../components/admin/SearchBar';
import { MessageSquareText, Star } from 'lucide-react';
import { fetchAdminFeedbackApi } from '../../services/adminApi';

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminFeedbackApi();
    setFeedbackList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = feedbackList.filter(f =>
    (f.userEmail && f.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.comments && f.comments.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="User Feedback Monitoring" subtitle="Monitor user feedback, ratings, and adaptive recommendation quality." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquareText size={24} style={{ color: '#4ade80' }} />
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Recommendation Feedback Stream</h2>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    MongoDB `smartfit_db.feedback` ({filteredList.length} User Ratings)
                  </p>
                </div>
              </div>

              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search comments or email..." />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--peach-soft)' }}>
                    <th style={{ padding: '12px 14px' }}>User Email</th>
                    <th style={{ padding: '12px 14px' }}>Rating</th>
                    <th style={{ padding: '12px 14px' }}>Category</th>
                    <th style={{ padding: '12px 14px' }}>Module Type</th>
                    <th style={{ padding: '12px 14px' }}>Feedback Comments</th>
                    <th style={{ padding: '12px 14px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
                        {loading ? 'Loading feedback entries...' : 'No feedback records available.'}
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#4ade80' }}>
                          {item.userEmail}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#facc15' }}>
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} size={15} fill="#facc15" />
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>
                          {item.feedbackCategory}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            background: item.recommendationType === 'WORKOUT' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                            color: item.recommendationType === 'WORKOUT' ? '#facc15' : '#38bdf8',
                            padding: '4px 8px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {item.recommendationType}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: '#fff' }}>
                          "{item.comments}"
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-subtle)' }}>
                          {item.createdAt}
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
    </div>
  );
}
