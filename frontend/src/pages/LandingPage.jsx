import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { FeatureModal } from '../components/Modals';

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const scrollToFeatures = () => {
    const el = document.getElementById('why-smartfit');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page-root">
      <Navbar />
      <Hero onOpenGetStarted={handleGetStartedClick} onScrollToFeatures={scrollToFeatures} />
      <Features onSelectFeature={(feature) => setSelectedFeature(feature)} />
      <HowItWorks onOpenGetStarted={handleGetStartedClick} />
      <CTA onOpenGetStarted={handleGetStartedClick} />
      <Footer />
      <FeatureModal feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
    </div>
  );
}
