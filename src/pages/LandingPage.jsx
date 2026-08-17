import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
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
      navigate('/dashboard');
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

      {/* 3. FEATURES (WHY SMARTFIT?) */}
      <Features 
        onSelectFeature={(feature) => setSelectedFeature(feature)} 
      />

      {/* 4. HOW IT WORKS */}
      <HowItWorks 
        onOpenGetStarted={handleGetStartedClick} 
      />

      {/* 5. CTA */}
      <CTA 
        onOpenGetStarted={handleGetStartedClick} 
      />

      {/* 6. FOOTER */}
      <Footer />

      {/* FEATURE DETAIL MODAL */}
      <FeatureModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  );
}

