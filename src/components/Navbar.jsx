import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, Sparkles, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const handleSectionClick = (e, sectionId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" onClick={handleHomeClick} className="brand-logo">
          <div className="logo-icon-box">
            <Activity size={24} />
          </div>
          <span>
            Smart<span className="gradient-peach-rose">Fit</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <ul className="nav-menu">
          <li>
            <Link to="/" onClick={handleHomeClick} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          {user ? (
            <>
              {user.role?.toUpperCase() === 'TRAINER' && (
                <li>
                  <Link to="/trainer-dashboard" className={`nav-link ${location.pathname === '/trainer-dashboard' ? 'active' : ''}`} style={{ color: '#FF7043', fontWeight: 700 }}>
                    🏋️ Trainer Portal
                  </Link>
                </li>
              )}
              {user.role?.toUpperCase() === 'NUTRITIONIST' && (
                <li>
                  <Link to="/nutritionist-dashboard" className={`nav-link ${location.pathname === '/nutritionist-dashboard' ? 'active' : ''}`} style={{ color: '#10B981', fontWeight: 700 }}>
                    🥗 Nutrition Portal
                  </Link>
                </li>
              )}
              {user.role?.toUpperCase() === 'ADMIN' && (
                <li>
                  <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} style={{ color: '#C084FC', fontWeight: 700 }}>
                    🛡️ Admin Console
                  </Link>
                </li>
              )}
              {(!user.role || user.role === 'USER') && (
                <>
                  <li>
                    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/workout-studio" className={`nav-link ${location.pathname === '/workout-studio' ? 'active' : ''}`} style={{ color: 'var(--peach-primary)', fontWeight: 800 }}>
                      ⚡ 3D Studio
                    </Link>
                  </li>
                  <li>
                    <Link to="/workout" className={`nav-link ${location.pathname === '/workout' ? 'active' : ''}`}>
                      Workouts
                    </Link>
                  </li>
                  <li>
                    <Link to="/nutrition" className={`nav-link ${location.pathname === '/nutrition' ? 'active' : ''}`}>
                      Nutrition
                    </Link>
                  </li>
                  <li>
                    <Link to="/nutritionist-dashboard" className={`nav-link ${location.pathname === '/nutritionist-dashboard' ? 'active' : ''}`} style={{ color: '#34D399', fontWeight: 700 }}>
                      🥗 Nutritionist
                    </Link>
                  </li>
                  <li>
                    <Link to="/progress" className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}>
                      Progress
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/supplements" 
                      className={`nav-link ${location.pathname === '/supplements' || location.pathname === '/challenges' ? 'active' : ''}`}
                    >
                      Supplements
                    </Link>
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li>
                <a href="#role-access" onClick={(e) => handleSectionClick(e, 'role-access')} className="nav-link" style={{ color: 'var(--peach-primary)', fontWeight: 600 }}>
                  Role Access
                </a>
              </li>
              <li>
                <Link to="/nutritionist-dashboard" className="nav-link" style={{ color: '#10B981', fontWeight: 700 }}>
                  🥗 Nutritionist Portal
                </Link>
              </li>
              <li>
                <Link to="/trainer-dashboard" className="nav-link" style={{ color: '#FF7043', fontWeight: 700 }}>
                  🏋️ Trainer Portal
                </Link>
              </li>
              <li>
                <a href="#why-smartfit" onClick={(e) => handleSectionClick(e, 'why-smartfit')} className="nav-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => handleSectionClick(e, 'how-it-works')} className="nav-link">
                  How It Works
                </a>
              </li>
            </>
          )}
        </ul>

        {/* Right Actions: Auth State Switcher */}
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/profile" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <User size={16} />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: 'rgba(255, 120, 120, 0.3)', color: '#ff9e9e' }}
                title="Log Out Session"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>

              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--peach-primary), var(--rose-accent))', color: '#12030f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                <User size={16} />
                <span>Login</span>
              </Link>

              <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
                <span>Get Started</span>
                <Sparkles size={16} />
              </Link>
            </>
          )}

          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={handleHomeClick} className="nav-link">Home</Link>
          {user ? (
            <>
              {user.role?.toUpperCase() === 'TRAINER' && (
                <Link to="/trainer-dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FF7043', fontWeight: 700 }}>
                  🏋️ Trainer Portal
                </Link>
              )}
              {user.role?.toUpperCase() === 'NUTRITIONIST' && (
                <Link to="/nutritionist-dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#10B981', fontWeight: 700 }}>
                  🥗 Nutrition Portal
                </Link>
              )}
              {user.role?.toUpperCase() === 'ADMIN' && (
                <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#C084FC', fontWeight: 700 }}>
                  🛡️ Admin Console
                </Link>
              )}
              {(!user.role || user.role === 'USER') && (
                <>
                  <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/workout-studio" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--peach-primary)', fontWeight: 800 }}>⚡ 3D Studio</Link>
                  <Link to="/workout" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Workouts</Link>
                  <Link to="/nutrition" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Nutrition</Link>
                  <Link to="/nutritionist-dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#34D399', fontWeight: 700 }}>🥗 Nutritionist Portal</Link>
                  <Link to="/progress" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Progress</Link>
                  <Link to="/supplements" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Supplements</Link>
                </>
              )}
              <Link to="/profile" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Profile Settings</Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ color: '#ff9e9e' }}>
                <LogOut size={16} />
                <span>Logout Session</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/nutritionist-dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#10B981', fontWeight: 700 }}>🥗 Nutritionist Portal</Link>
              <Link to="/trainer-dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#FF7043', fontWeight: 700 }}>🏋️ Trainer Portal</Link>
              <a href="#why-smartfit" className="nav-link" onClick={(e) => handleSectionClick(e, 'why-smartfit')}>Features</a>
              <a href="#how-it-works" className="nav-link" onClick={(e) => handleSectionClick(e, 'how-it-works')}>How It Works</a>
              <Link to="/login" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
