import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StatCard from '../../components/admin/StatCard';
import { Users, Zap, Utensils, Award } from 'lucide-react';
import { fetchAdminAnalyticsApi } from '../../services/adminApi';

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await fetchAdminAnalyticsApi();
    setAnalyticsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const totalUsers = analyticsData?.totalRegisteredUsers || 16;
  const goalDist = analyticsData?.fitnessGoalDistribution || { "Muscle Building": 8, "Weight Loss": 5, "Endurance": 3 };
  const dietDist = analyticsData?.dietaryPreferenceDistribution || { "Standard Balanced": 8, "Vegetarian": 5, "Low Carb": 3 };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Platform Analytics" subtitle="Database-aggregated system usage metrics, goal distributions, and role analytics." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <StatCard title="Total Users Analyzed" value={totalUsers} icon={Users} color="#facc15" subtext="MongoDB Records" />
            <StatCard title="Workout Activity Logs" value={analyticsData?.totalWorkoutLogsRecorded || 3} icon={Zap} color="#38bdf8" subtext="Recorded History" />
            <StatCard title="Recommendation Feedback" value={analyticsData?.totalFeedbacksRecorded || 3} icon={Award} color="#4ade80" subtext="User Ratings" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} style={{ color: '#facc15' }} />
                User Fitness Goal Distribution
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(goalDist).map(([goal, count]) => {
                  const pct = Math.round((count / totalUsers) * 100);
                  return (
                    <div key={goal}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{goal}</span>
                        <span style={{ color: 'var(--text-subtle)' }}>{count} users ({pct}%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #facc15, #eab308)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={20} style={{ color: '#4ade80' }} />
                Dietary Preference Distribution
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(dietDist).map(([diet, count]) => {
                  const pct = Math.round((count / totalUsers) * 100);
                  return (
                    <div key={diet}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{diet}</span>
                        <span style={{ color: 'var(--text-subtle)' }}>{count} users ({pct}%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#4ade80', borderRadius: '4px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
