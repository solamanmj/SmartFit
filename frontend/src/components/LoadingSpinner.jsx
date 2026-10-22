import React from 'react';

const LoadingSpinner = ({ message = "Loading SmartFit AI..." }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-gradient, #090d16)',
      color: '#fff',
      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(18, 26, 43, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 158, 125, 0.2)',
        borderRadius: '24px',
        padding: '40px 50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 158, 125, 0.15)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Animated Brand Logo / Spinner Ring */}
        <div style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          marginBottom: '24px'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(255, 158, 125, 0.15)',
            borderTopColor: '#ff9e7d',
            borderRightColor: '#ff6b4a',
            animation: 'smartfitSpin 0.9s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'
          }} />
          <div style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 158, 125, 0.2), rgba(255, 107, 74, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            ⚡
          </div>
        </div>

        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 30%, var(--peach-soft, #ffc4b0))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          SmartFit AI
        </h3>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          {message}
        </p>

        {/* Pulse Bar */}
        <div style={{
          marginTop: '20px',
          width: '120px',
          height: '4px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '40%',
            background: 'linear-gradient(90deg, #ff9e7d, #ff6b4a)',
            borderRadius: '4px',
            animation: 'smartfitPulseBar 1.5s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes smartfitSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes smartfitPulseBar {
          0% { left: -40%; }
          50% { left: 100%; }
          100% { left: -40%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
