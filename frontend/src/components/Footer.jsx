import React, { useState } from 'react';
import { Activity, Send, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#home" className="brand-logo">
              <div className="logo-icon-box">
                <Activity size={22} />
              </div>
              <span>
                Smart<span className="gradient-peach-rose">Fit</span>
              </span>
            </a>
            <p className="footer-brand-desc">
              Next-generation fitness and nutrition optimization platform powered by Explainable Artificial Intelligence.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#why-smartfit" className="footer-link">AI Workouts</a></li>
              <li><a href="#why-smartfit" className="footer-link">Nutrition Plans</a></li>
              <li><a href="#why-smartfit" className="footer-link">Explainable AI (XAI)</a></li>
              <li><a href="#how-it-works" className="footer-link">Methodology</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works" className="footer-link">About SmartFit</a></li>
              <li><a href="#home" className="footer-link">Research</a></li>
              <li><a href="#home" className="footer-link">Privacy Policy</a></li>
              <li><a href="#home" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Stay Informed</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', marginBottom: '14px' }}>
              Subscribe to get the latest fitness research & AI algorithm updates.
            </p>
            {subscribed ? (
              <div style={{ color: 'var(--peach-light)', fontSize: '0.9rem', fontWeight: 600, padding: '10px', background: 'rgba(255, 158, 125, 0.15)', borderRadius: '12px' }}>
                ✓ Subscribed successfully! Welcome to SmartFit.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 18px' }}>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SmartFit Inc. All rights reserved. Built for intelligent peak performance.
          </div>

          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn"><Twitter size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn"><Instagram size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn"><Linkedin size={18} /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
