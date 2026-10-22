import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { user } = useAuth();

  const adminProfile = user || {
    fullName: 'System Administrator',
    email: 'admin@smartfit.com',
    role: 'ADMIN'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <AdminSidebar />
      <AdminNavbar title="Administrator Profile" subtitle="Account credentials, security privileges, and system administration status." />

      <main style={{ flex: 1, marginLeft: '260px', paddingTop: '98px', paddingBottom: '60px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div className="glass-card" style={{ padding: '36px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                color: '#12030f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                <ShieldCheck size={36} />
              </div>

              <div>
                <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 4px 0' }}>
                  {adminProfile.fullName || 'System Administrator'}
                </h2>
                <p style={{ color: '#facc15', fontSize: '0.92rem', margin: 0, fontWeight: 600 }}>
                  {adminProfile.email || 'admin@smartfit.com'} • Standalone Admin Executive
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.92rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Security Role</span>
                <span style={{ color: '#facc15', fontWeight: 800, fontSize: '1.1rem' }}>ADMIN</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Session Privilege</span>
                <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Full System Access
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: '#facc15' }} />
              Administrator Security Governance
            </h3>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
              This Admin Portal is hosted on dedicated standalone routes (`/admin/*`) with complete separation from user portal navigation.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
