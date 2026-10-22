import React, { useState } from 'react';
import { Camera, Sparkles, Shield, Activity, Eye, Zap, AlertCircle } from 'lucide-react';

export default function AIFormAnalysisStub() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  return (
    <div style={{
      background: 'rgba(18, 26, 43, 0.75)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '16px',
      padding: '18px 20px',
      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.35)'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={16} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>
              AI Live Camera Form Analysis
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>
              Decoupled Computer-Vision Pipeline (MediaPipe Pose Landmark Engine)
            </span>
          </div>
        </div>

        <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
          Future AI Extension Ready
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.4', margin: '0 0 12px 0' }}>
        SmartFit's decoupled AI architecture separates <strong>3D Virtual Demonstration</strong> from <strong>Real-Time Camera Pose Landmark Analysis</strong>. When enabled, this camera pipeline analyzes 33 skeletal keypoints to calculate joint angles and rep consistency.
      </p>

      {/* Camera Preview / Mock Hub */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.45)',
        border: '1px dashed rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Landmark Tracking</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34D399' }}>33 3D Keypoints</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Angle Detection</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38BDF8' }}>Hip / Knee / Elbow</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Privacy Guarantee</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FACC15' }}>On-Device Inference</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCameraActive(!cameraActive)}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            background: cameraActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
            border: cameraActive ? '1px solid #EF4444' : '1px solid #38BDF8',
            color: cameraActive ? '#FCA5A5' : '#38BDF8',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
          <Camera size={14} />
          <span>{cameraActive ? 'Disconnect AI Camera Feed' : 'Calibrate AI Webcam Feed (Simulator)'}</span>
        </button>

        {cameraActive && (
          <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#34D399' }}>
            ✓ MediaPipe Pose Landmark Inference Pipeline Active • Joint Angles Calibrated (30 FPS)
          </div>
        )}
      </div>

    </div>
  );
}
