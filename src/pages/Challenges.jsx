import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Users, Award } from 'lucide-react';
import { fetchChallenges } from '../services/api';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [joined, setJoined] = useState({});

  useEffect(() => {
    fetchChallenges().then(res => setChallenges(res));
  }, []);

  const toggleJoin = (id) => {
    setJoined(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '130px', paddingBottom: '80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div className="badge" style={{ marginBottom: '8px' }}>
            <Trophy size={14} /> SmartFit Community Quests & Gamification
          </div>
          <h1 className="gradient-peach-rose" style={{ fontSize: '2.4rem' }}>
            Community Challenges & XP Rewards
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
            Join global consistency quests, earn XP points, and level up your SmartFit rank.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {challenges.map(item => (
            <div key={item.id} className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge" style={{ fontSize: '0.8rem' }}>{item.category}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--peach-soft)', fontWeight: 700 }}>⏳ {item.daysLeft} Days Left</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '6px' }}>{item.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.875rem', color: 'var(--text-subtle)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> {item.participants.toLocaleString()} Athletes Joined</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={16} style={{ color: 'var(--peach-primary)' }} /> Reward: {item.reward}</span>
                </div>
              </div>

              <button
                onClick={() => toggleJoin(item.id)}
                className={joined[item.id] ? "btn-secondary" : "btn-primary"}
                style={{ width: '100%', marginTop: 'auto' }}
              >
                {joined[item.id] ? (
                  <span style={{ color: 'var(--peach-light)' }}>✓ Joined Challenge</span>
                ) : (
                  <span>Join Challenge (+{item.reward})</span>
                )}
              </button>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
