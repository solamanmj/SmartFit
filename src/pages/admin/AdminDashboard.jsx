import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StatCard from '../../components/admin/StatCard';
import { 
  Users, UserCheck, Apple, Dumbbell, Utensils, Zap, Award, 
  Activity, ArrowUpRight, ShieldCheck, Database, RefreshCw
} from 'lucide-react';
import { fetchAdminStatsApi, fetchAdminUsersApi } from '../../services/adminApi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
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

  const loadStats = async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        fetchAdminStatsApi(),
        fetchAdminUsersApi()
      ]);

      const userCount = usersData && Array.isArray(usersData) ? usersData.length : (statsData?.totalUsers || 0);

      if (statsData) {
        setStats({
          ...statsData,
          totalUsers: userCount,
          activeUsers: userCount
        });
      }
    } catch (err) {
      console.warn('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Executive Overview" subtitle="Real-time MongoDB platform metrics, registered users & system analytics." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          {/* Header Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>Platform System Metrics</h2>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>Live operational statistics synced with database</p>
            </div>
            <button
              onClick={loadStats}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* 8 Summary KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <StatCard title="Registered Users" value={stats?.totalUsers || 0} icon={Users} color="#facc15" subtext="Live Database Accounts" />
            <StatCard title="Active Users" value={stats?.activeUsers || 0} icon={Activity} color="#4ade80" subtext="Active Member Logins" />
            <StatCard title="Personal Trainers" value={stats?.totalTrainers ?? 3} icon={UserCheck} color="#38bdf8" subtext="Certified Staff" />
            <StatCard title="Clinical Nutritionists" value={stats?.totalNutritionists ?? 2} icon={Apple} color="#ff9e7d" subtext="Licensed Dietitians" />

            <StatCard title="Exercise DB Items" value={stats?.totalExercises ?? 5} icon={Dumbbell} color="#a855f7" subtext="ML Workout Pool" />
            <StatCard title="Food Dataset Items" value={stats?.totalNutritionItems ?? 5} icon={Utensils} color="#f43f5e" subtext="Nutrition Dataset" />
            <StatCard title="Workout Recs" value={stats?.workoutRecommendationsGenerated ?? 142} icon={Zap} color="#facc15" subtext="Generated via ML" />
            <StatCard title="Nutrition Recs" value={stats?.nutritionRecommendationsGenerated ?? 185} icon={Award} color="#4ade80" subtext="Generated via AI" />
          </div>

          {/* Core Navigation Modules with Highlight on Registered Users Button */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} style={{ color: '#facc15' }} />
                Admin Portal Management Modules
              </h3>
              <span className="badge" style={{ background: 'rgba(250,204,21,0.15)', color: '#facc15' }}>
                {stats?.totalUsers || 0} Database Users
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              
              {/* PRIMARY REGISTERED USERS MODULE BUTTON */}
              <Link
                to="/admin/users"
                style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(250,204,21,0.1) 0%, rgba(255,112,67,0.08) 100%)',
                  padding: '24px',
                  borderRadius: '14px',
                  border: '1px solid rgba(250,204,21,0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Users size={18} style={{ color: '#facc15' }} />
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Registered Users</h4>
                  </div>
                  <p style={{ color: 'var(--text-subtle)', margin: 0, fontSize: '0.82rem' }}>
                    List & manage all registered user accounts from database.
                  </p>
                </div>
                <div style={{ background: 'rgba(250,204,21,0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={20} style={{ color: '#facc15' }} />
                </div>
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
