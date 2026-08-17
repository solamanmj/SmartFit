import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart3, TrendingUp, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { fetchProgressAnalytics } from '../services/api';

export default function Progress() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProgressAnalytics().then(res => setData(res));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div className="badge" style={{ marginBottom: '8px' }}>
            <BarChart3 size={14} /> SmartFit Biometric Analytics
          </div>
          <h1 className="gradient-peach-rose" style={{ fontSize: '2.4rem' }}>
            Progress & Transformation Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
            Real-time biometric curves, body composition trends & strength progression logs.
          </p>
        </div>

        {data ? (
          <div>
            {/* Weight History Table/Card */}
            <div className="glass-card" style={{ padding: '36px', marginBottom: '32px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
                📉 Body Weight & Fat Loss History
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {data.weightHistory.map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,158,125,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--peach-soft)', fontWeight: 700 }}>{item.date}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>{item.weight} kg</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Body Fat: {item.bodyFat}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strength Progression Table */}
            <div className="glass-card" style={{ padding: '36px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
                🏋️ Progressive Overload Strength Curves
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.strengthProgress.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '20px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{item.exercise}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Starting Baseline: {item.start}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--peach-light)', fontSize: '1.2rem' }}>{item.current}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--peach-primary)', fontWeight: 700 }}>Total Gain: {item.gain}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>Loading Progress Analytics...</div>
        )}

      </main>

      <Footer />
    </div>
  );
}
