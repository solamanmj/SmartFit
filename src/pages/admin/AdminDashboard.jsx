import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StatCard from '../../components/admin/StatCard';
import { 
  Users, UserCheck, Apple, Dumbbell, Utensils, Zap, Award, 
  Activity, ArrowUpRight
} from 'lucide-react';
import { fetchAdminStatsApi } from '../../services/adminApi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 17,
    activeUsers: 17,
    totalTrainers: 3,
    totalNutritionists: 2,
    totalExercises: 5,
    totalNutritionItems: 5,
    workoutRecommendationsGenerated: 142,
    nutritionRecommendationsGenerated: 185,
    mongoDbStatus: 'CONNECTED',
    fastApiStatus: 'ONLINE'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchAdminStatsApi();
      if (data) {
        setStats(data);
      }
    };
    loadStats();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Executive Overview" subtitle="Real-time MongoDB platform metrics & system statistics." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          {/* 8 Summary KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <StatCard title="Total Users" value={stats?.totalUsers ?? 17} icon={Users} color="#facc15" subtext="MongoDB Records" />
            <StatCard title="Active Users" value={stats?.activeUsers ?? 17} icon={Activity} color="#4ade80" subtext="Active Accounts" />
            <StatCard title="Personal Trainers" value={stats?.totalTrainers ?? 3} icon={UserCheck} color="#38bdf8" subtext="Certified Staff" />
            <StatCard title="Clinical Nutritionists" value={stats?.totalNutritionists ?? 2} icon={Apple} color="#ff9e7d" subtext="Licensed Dietitians" />

            <StatCard title="Exercise DB Items" value={stats?.totalExercises ?? 5} icon={Dumbbell} color="#a855f7" subtext="ML Workout Pool" />
            <StatCard title="Food Dataset Items" value={stats?.totalNutritionItems ?? 5} icon={Utensils} color="#f43f5e" subtext="Nutrition Dataset" />
            <StatCard title="Workout Recs" value={stats?.workoutRecommendationsGenerated ?? 142} icon={Zap} color="#facc15" subtext="Generated via ML" />
            <StatCard title="Nutrition Recs" value={stats?.nutritionRecommendationsGenerated ?? 185} icon={Award} color="#4ade80" subtext="Generated via AI" />
          </div>

          {/* Core Navigation Shortcuts */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} style={{ color: '#facc15' }} />
              Admin Portal Management Modules
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Link to="/admin/users" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1rem' }}>User Directory</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>Search, review details, or remove user accounts.</p>
                </div>
                <ArrowUpRight size={20} style={{ color: '#facc15' }} />
              </Link>

              <Link to="/admin/trainers" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1rem' }}>Trainers Directory</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>Manage fitness trainers & specializations.</p>
                </div>
                <ArrowUpRight size={20} style={{ color: '#38bdf8' }} />
              </Link>

              <Link to="/admin/nutritionists" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1rem' }}>Nutritionists Directory</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>Manage clinical dietitians & qualifications.</p>
                </div>
                <ArrowUpRight size={20} style={{ color: '#ff9e7d' }} />
              </Link>

              <Link to="/admin/exercises" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1rem' }}>Exercise Database</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>Manage workout exercises used by Scikit-Learn.</p>
                </div>
                <ArrowUpRight size={20} style={{ color: '#a855f7' }} />
              </Link>

              <Link to="/admin/nutrition" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1rem' }}>Food Dataset</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>Manage nutritional macro profiles & food items.</p>
                </div>
                <ArrowUpRight size={20} style={{ color: '#f43f5e' }} />
              </Link>

              <Link to="/admin/recommendations" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1rem' }}>ML Model Status</h4>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>Monitor Scikit-Learn accuracy & XAI engine.</p>
                </div>
                <ArrowUpRight size={20} style={{ color: '#4ade80' }} />
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
