import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RoleBasedAccessSection from '../components/RoleBasedAccessSection';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { FeatureModal } from '../components/Modals';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const scrollToFeatures = () => {
    const el = document.getElementById('why-smartfit');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStartedClick = () => {
    if (user) {
      if (user.role === 'TRAINER') navigate('/trainer-dashboard');
      else if (user.role === 'NUTRITIONIST') navigate('/nutritionist-dashboard');
      else if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="landing-page-root">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO */}
      <Hero
        onOpenGetStarted={handleGetStartedClick}
        onScrollToFeatures={scrollToFeatures}
      />

      {/* 3. ROLE-BASED ACCESS & LOGIN SECTION */}
      <RoleBasedAccessSection />

      {/* 4. FEATURES (WHY SMARTFIT?) */}
      <Features 
        onSelectFeature={(feature) => setSelectedFeature(feature)} 
      />

      {/* 5. HOW IT WORKS */}
      <HowItWorks 
        onOpenGetStarted={handleGetStartedClick} 
      />

      {/* 6. CTA */}
      <CTA 
        onOpenGetStarted={handleGetStartedClick} 
      />

      {/* 7. FOOTER */}
      <Footer />

      {/* FEATURE DETAIL MODAL */}
      <FeatureModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  );
}
