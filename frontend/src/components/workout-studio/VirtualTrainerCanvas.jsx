import React, { useRef, useEffect } from 'react';
import { getExerciseDetails } from '../../data/exerciseSeedData';

// Classify exercise movement archetype with high precision
export const getExerciseMovementType = (exercise) => {
  if (!exercise) return 'squat';
  
  const n = (exercise.name || '').toLowerCase();
  const c = (exercise.category || '').toLowerCase();
  const m = (exercise.movementType || '').toLowerCase();
  const a = (exercise.animationType || '').toLowerCase();

  // 1. Explicit Animation Type Match
  if (a && a !== 'undefined') {
    if (a === 'chest_fly') return 'chest_fly';
    if (a === 'dips') return 'dips';
    if (a === 'pull_up') return 'pull_up';
    if (a === 'pushup') return 'pushup';
    if (a === 'hip_thrust') return 'hip_thrust';
    if (a === 'incline_bench') return 'incline_bench';
    if (a === 'flat_bench') return 'flat_bench';
    if (a === 'squat') return 'squat';
    if (a === 'deadlift') return 'deadlift';
    if (a === 'lat_pulldown') return 'lat_pulldown';
    if (a === 'barbell_row') return 'barbell_row';
    if (a === 'overhead_press') return 'overhead_press';
    if (a === 'lateral_raise') return 'lateral_raise';
    if (a === 'bicep_curl') return 'bicep_curl';
    if (a === 'overhead_tricep') return 'overhead_tricep';
    if (a === 'tricep_pushdown') return 'tricep_pushdown';
    if (a === 'tricep_extension') {
      if (n.includes('overhead') || n.includes('rope') || n.includes('skull') || n.includes('french')) return 'overhead_tricep';
      return 'tricep_pushdown';
    }
    if (a === 'face_pull') return 'face_pull';
    if (a === 'shrugs') return 'shrugs';
    if (a === 'hanging_leg_raise') return 'hanging_leg_raise';
    if (a === 'calf_raise') return 'calf_raise';
    if (a === 'leg_extension') return 'leg_extension';
    if (a === 'lunge') return 'lunge';
    if (a === 'plank') return 'plank';
  }

  // 2. High-Priority Name Disambiguation
  // Overhead Triceps (Must precede Overhead Press)
  if (n.includes('overhead tricep') || n.includes('overhead cable tricep') || n.includes('rope extension') || n.includes('skull crusher') || n.includes('french press') || (n.includes('tricep') && (n.includes('overhead') || n.includes('extension')))) {
    return 'overhead_tricep';
  }
  // Tricep Pushdowns
  if (n.includes('tricep pushdown') || n.includes('tricep pressdown') || (n.includes('tricep') && !n.includes('overhead'))) {
    return 'tricep_pushdown';
  }
  // Cable Chest Flyes & Pec Deck
  if (n.includes('cable fly') || n.includes('standing fly') || n.includes('pec deck') || n.includes('chest fly') || n.includes('cable crossover') || n.includes('flyes') || n.includes('fly')) {
    return 'chest_fly';
  }
  // Face Pulls & Shrugs
  if (n.includes('face pull')) return 'face_pull';
  if (n.includes('shrug')) return 'shrugs';
  if (n.includes('dip')) return 'dips';
  if (n.includes('pull-up') || n.includes('chin-up') || n.includes('pullup') || n.includes('chinup')) return 'pull_up';
  if (n.includes('lat pull') || n.includes('pulldown')) return 'lat_pulldown';
  if (n.includes('row') || n.includes('renegade')) return 'barbell_row';
  if (n.includes('incline bench') || n.includes('incline dumbbell press') || n.includes('incline press')) return 'incline_bench';
  if (n.includes('push-up') || n.includes('pushup')) return 'pushup';
  if (n.includes('bench') || n.includes('chest press')) return 'flat_bench';
  if (n.includes('hip thrust') || n.includes('glute bridge')) return 'hip_thrust';
  if (n.includes('deadlift') || n.includes('rdl') || n.includes('good morning') || n.includes('swing')) return 'deadlift';
  if (n.includes('calf') || n.includes('heel raise')) return 'calf_raise';
  if (n.includes('leg extension') || n.includes('leg curl') || n.includes('hamstring curl')) return 'leg_extension';
  if (n.includes('lunge') || n.includes('step-up') || n.includes('split squat')) return 'lunge';
  if (n.includes('squat') || n.includes('leg press') || n.includes('hack squat')) return 'squat';
  if (n.includes('lateral raise') || n.includes('front raise') || n.includes('side delt')) return 'lateral_raise';
  if (n.includes('overhead') || n.includes('shoulder press') || n.includes('military') || n.includes('arnold')) return 'overhead_press';
  if (n.includes('hammer curl') || n.includes('bicep') || n.includes('curl') || n.includes('preacher')) return 'bicep_curl';
  if (n.includes('hanging leg') || n.includes('hanging knee')) return 'hanging_leg_raise';
  if (n.includes('plank') || n.includes('rollout') || n.includes('twist') || n.includes('crunch') || n.includes('russian')) return 'plank';

  return 'squat';
};

export default function VirtualTrainerCanvas({
  exercise,
  isPlaying = true,
  cameraAngle = 'side', // 'side' | 'front' | 'rear' | 'isometric' | '45°' | '45-degree'
  tempoSpeed = 1.0,
  muscleHeatmapActive = true,
  formMode = 'correct', // 'correct' | 'mistake'
  currentPhaseIndex = 0,
  onPhaseChange,
  onRepComplete
}) {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastPhaseRef = useRef(-1);

  // Hydrate full enriched exercise metadata
  const enrichedExercise = getExerciseDetails(exercise);
  const movementType = getExerciseMovementType(enrichedExercise);

  // Normalize camera angle
  let normalizedAngle = (cameraAngle || enrichedExercise.recommendedAngle || 'side').toLowerCase();
  if (normalizedAngle === '45°' || normalizedAngle === '45-degree') normalizedAngle = 'isometric';

  // Main Canvas Biomechanical Kinematics Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let startTime = performance.now();
    let repCycleDuration = 4000 / tempoSpeed;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform before scaling
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (now) => {
      const width = canvas.getBoundingClientRect().width;
      const height = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. KINEMATIC CYCLE PROGRESS (Smooth Harmonic Oscillation)
      // -------------------------------------------------------------
      let cycleProgress = 0;
      if (isPlaying) {
        const elapsed = (now - startTime) % repCycleDuration;
        cycleProgress = elapsed / repCycleDuration;
      } else {
        cycleProgress = 0.5; // Frozen at peak tension inflection point
      }

      // Smooth cosine easing (0 = starting/lockout, 1 = maximum eccentric inflection apex)
      const t = (1 - Math.cos(cycleProgress * Math.PI * 2)) / 2;

      // Phase identification & notification
      let phaseIdx = 0;
      let phaseName = '1. Setup & Posture Alignment';
      if (cycleProgress < 0.15) {
        phaseIdx = 0; phaseName = '1. Setup & Scapular Lock';
      } else if (cycleProgress < 0.50) {
        phaseIdx = 1; phaseName = '2. Eccentric Controlled Descent (3s)';
      } else if (cycleProgress < 0.60) {
        phaseIdx = 2; phaseName = '3. Inflection Stretch Apex';
      } else if (cycleProgress < 0.88) {
        phaseIdx = 3; phaseName = '4. Concentric Power Drive';
      } else {
        phaseIdx = 4; phaseName = '5. Lockout & Peak Contraction';
      }

      if (phaseIdx !== lastPhaseRef.current) {
        lastPhaseRef.current = phaseIdx;
        if (onPhaseChange) onPhaseChange(phaseIdx, phaseName);
        if (phaseIdx === 4 && onRepComplete) onRepComplete();
      }

      // -------------------------------------------------------------
      // 2. BACKGROUND 3D BIOMECHANICAL STUDIO & STAGE PLATFORM
      // -------------------------------------------------------------
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2 - 40, 30, width / 2, height / 2, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, '#1a0b22');
      bgGrad.addColorStop(0.45, '#0f0414');
      bgGrad.addColorStop(1, '#050108');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Perspective Floor Grid Lines & Biomechanical Stage Platform
      ctx.save();
      const floorY = height * 0.86;

      // Stage glow oval
      const stageGrad = ctx.createRadialGradient(width / 2, floorY, 10, width / 2, floorY, width * 0.45);
      stageGrad.addColorStop(0, 'rgba(255, 112, 67, 0.18)');
      stageGrad.addColorStop(0.5, 'rgba(255, 112, 67, 0.05)');
      stageGrad.addColorStop(1, 'rgba(255, 112, 67, 0)');
      ctx.fillStyle = stageGrad;
      ctx.beginPath();
      ctx.ellipse(width / 2, floorY + 10, width * 0.42, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Perspective floor grid lines
      ctx.strokeStyle = 'rgba(255, 112, 67, 0.14)';
      ctx.lineWidth = 1;
      for (let i = -7; i <= 7; i++) {
        ctx.beginPath();
        ctx.moveTo(width / 2 + i * 24, floorY - 70);
        ctx.lineTo(width / 2 + i * 85, height + 20);
        ctx.stroke();
      }
      for (let y = floorY - 60; y < height + 10; y += 18) {
        ctx.beginPath();
        ctx.moveTo(width * 0.05, y);
        ctx.lineTo(width * 0.95, y);
        ctx.stroke();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 3. EXERCISE-SPECIFIC PROCEDURAL SKELETAL & APPARATUS ARTICULATION
      // -------------------------------------------------------------
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2;

      // Real-time calculated joint angle & telemetry states
      let primaryAngleDeg = 90;
      let primaryAngleLabel = 'JOINT FLEXION';
      let formAccuracyScore = formMode === 'mistake' ? 68 : 98;
      let trajectoryStatus = formMode === 'mistake' ? 'COLLAPSED / FAULT' : 'OPTIMAL / ACCURATE';
      let mistakeDescription = '';

      // Base drawing colors
      const boneColor = formMode === 'mistake' ? '#FCA5A5' : '#FFFFFF';
      const jointColor = formMode === 'mistake' ? '#EF4444' : '#FF7043';
      const barColor = '#FACC15';
      const cableColor = 'rgba(250, 204, 21, 0.85)';
      const machineColor = 'rgba(255, 255, 255, 0.35)';

      // =============================================================
      // 1. CHEST FLY: CABLE STANDING CHEST FLY / PEC DECK / DUMBBELL FLY
      // =============================================================
      if (movementType === 'chest_fly') {
        const towerLeftX = centerX - 145;
        const towerRightX = centerX + 145;
        const pulleyY = centerY - 25;

        // Dual Cable Machine Towers
        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(towerLeftX, centerY - 140);
        ctx.lineTo(towerLeftX, floorY);
        ctx.moveTo(towerRightX, centerY - 140);
        ctx.lineTo(towerRightX, floorY);
        ctx.stroke();

        // Pulleys
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(towerLeftX, pulleyY, 7, 0, Math.PI * 2);
        ctx.arc(towerRightX, pulleyY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Standing Athlete with Staggered Stance & 15° Forward Lean
        const leadFootX = centerX + 18;
        const leadFootY = floorY;
        const rearFootX = centerX - 28;
        const rearFootY = floorY;

        const hipX = centerX - 5;
        const hipY = floorY - 110;

        const torsoLean = formMode === 'mistake' ? (15 - t * 25) : 12;
        const shoulderX = hipX + torsoLean;
        const shoulderY = hipY - 70;
        const headX = shoulderX + 6;
        const headY = shoulderY - 20;

        // Legs & Spine
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(leadFootX, leadFootY);
        ctx.lineTo(hipX + 10, hipY);
        ctx.moveTo(rearFootX, rearFootY);
        ctx.lineTo(hipX - 10, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        // Hugging Arc (t = 0 Squeeze in Front, t = 1 Stretch to Sides)
        const armSpan = 25 + t * 70;
        const elbowBendMistake = formMode === 'mistake' ? 35 : 0;
        const handLeftX = shoulderX - armSpan + (formMode === 'mistake' ? 15 : 0);
        const handRightX = shoulderX + armSpan - (formMode === 'mistake' ? 15 : 0);
        const handY = shoulderY + 20 + t * 10;

        const elbowLeftX = (shoulderX + handLeftX) / 2 - 12 - elbowBendMistake;
        const elbowLeftY = shoulderY + 12 + t * 6;
        const elbowRightX = (shoulderX + handRightX) / 2 + 12 + elbowBendMistake;
        const elbowRightY = shoulderY + 12 + t * 6;

        // Cables from Pulleys to Handles
        ctx.strokeStyle = cableColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(towerLeftX, pulleyY);
        ctx.lineTo(handLeftX, handY);
        ctx.moveTo(towerRightX, pulleyY);
        ctx.lineTo(handRightX, handY);
        ctx.stroke();

        // Arms
        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX - 12, shoulderY);
        ctx.lineTo(elbowLeftX, elbowLeftY);
        ctx.lineTo(handLeftX, handY);
        ctx.moveTo(shoulderX + 12, shoulderY);
        ctx.lineTo(elbowRightX, elbowRightY);
        ctx.lineTo(handRightX, handY);
        ctx.stroke();

        // Handles
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.arc(handLeftX, handY, 6, 0, Math.PI * 2);
        ctx.arc(handRightX, handY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Joints
        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowLeftX, elbowLeftY, 5, 0, Math.PI * 2);
        ctx.arc(elbowRightX, elbowRightY, 5, 0, Math.PI * 2);
        ctx.fill();

        const adductionAngle = Math.round(25 + t * 115);
        primaryAngleDeg = adductionAngle;
        primaryAngleLabel = 'CHEST ADDUCTION ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Bending Elbows into a Press & Jerking Torso Backwards'
          : '✓ Controlled Hugging Arc with Fixed Soft Elbows & 1s Peak Squeeze';
      }

      // =============================================================
      // 2. OVERHEAD TRICEPS EXTENSION (CABLE ROPE / DUMBBELL / SKULL CRUSHER)
      // =============================================================
      else if (movementType === 'overhead_tricep') {
        const towerX = centerX - 125;
        const pulleyY = centerY - 95;

        // High Cable Tower Behind Lifter
        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(towerX, centerY - 140);
        ctx.lineTo(towerX, floorY);
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(towerX, pulleyY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Standing Athlete with Forward Staggered Stance (30° forward pitch)
        const leadFootX = centerX + 40;
        const leadFootY = floorY;
        const rearFootX = centerX - 25;
        const rearFootY = floorY;

        const hipX = centerX;
        const hipY = floorY - 110;

        const shoulderX = hipX + 26;
        const shoulderY = hipY - 65;
        const headX = shoulderX + 8;
        const headY = shoulderY - 16;

        // Upper Arms Pinned Beside Head & Angled Forward (Humerus)
        const elbowX = shoulderX + 22 + (formMode === 'mistake' ? 18 : 0);
        const elbowY = shoulderY - 26 + (formMode === 'mistake' ? 15 : 0);

        // Forearm Kinematics:
        // t = 1 (Deep Stretch behind head): hand near pulley/ear
        // t = 0 (Lockout forward/upward): arms extended fully forward
        const extAngle = (formMode === 'mistake' ? -0.2 : 0.4) + (1 - t) * 1.8;
        const forearmLen = 52;
        const handX = elbowX + Math.cos(extAngle - Math.PI / 2) * forearmLen;
        const handY = elbowY + Math.sin(extAngle - Math.PI / 2) * forearmLen;

        // Cable running from pulley to hands
        ctx.strokeStyle = cableColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(towerX, pulleyY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Legs & Torso Skeleton
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(leadFootX, leadFootY);
        ctx.lineTo(hipX + 8, hipY);
        ctx.moveTo(rearFootX, rearFootY);
        ctx.lineTo(hipX - 8, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        // Head
        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        // Upper Arm & Forearm
        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Rope Attachment & Knots
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.arc(handX, handY, 6, 0, Math.PI * 2);
        ctx.arc(handX + 6, handY + 6, 4, 0, Math.PI * 2);
        ctx.fill();

        // Joints
        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.fill();

        const tricepAngle = Math.round(55 + (1 - t) * 120);
        primaryAngleDeg = tricepAngle;
        primaryAngleLabel = 'TRICEPS EXTENSION ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Flaring Elbows Wide & Excessive Lower Back Arching'
          : '✓ Elbows Pinned Beside Ears, Deep Overhead Stretch, Flaring Rope at Lockout';
      }

      // =============================================================
      // 3. TRICEPS PUSHDOWN (CABLE STRAIGHT BAR / ROPE PUSHDOWN)
      // =============================================================
      else if (movementType === 'tricep_pushdown') {
        const towerX = centerX + 115;
        const pulleyY = centerY - 130;

        // High Cable Machine in front
        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(towerX, centerY - 150);
        ctx.lineTo(towerX, floorY);
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(towerX, pulleyY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Athlete Standing with Slight Forward Hinge
        const footX = centerX - 30;
        const footY = floorY;
        const hipX = footX - 5;
        const hipY = footY - 120;
        const shoulderX = hipX + 12;
        const shoulderY = hipY - 75;
        const headX = shoulderX + 4;
        const headY = shoulderY - 20;

        // Upper Arm Pinned to Ribcage
        const elbowX = shoulderX + 6 + (formMode === 'mistake' ? 22 : 0);
        const elbowY = shoulderY + 52 + (formMode === 'mistake' ? -15 : 0);

        // Forearm pushes down: t = 1 (90° flexion), t = 0 (Full Lockout downward)
        const pushAngle = (Math.PI / 2) + (1 - t) * 1.55;
        const handX = elbowX + Math.cos(pushAngle) * 50;
        const handY = elbowY + Math.sin(pushAngle) * 50;

        // Cable to Hand
        ctx.strokeStyle = cableColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(towerX, pulleyY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Skeleton
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Handle
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(handX - 8, handY - 4, 16, 8);

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.fill();

        const pushdownAngle = Math.round(80 + (1 - t) * 95);
        primaryAngleDeg = pushdownAngle;
        primaryAngleLabel = 'TRICEPS PUSHDOWN ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Elbows Swinging Forward & Using Shoulder Bodyweight Momentum'
          : '✓ Pinned Elbows at Ribs, Complete Lockout Downward, Controlled Return';
      }

      // =============================================================
      // 4. DIPS: PARALLEL BAR DIPS / WEIGHTED DIPS
      // =============================================================
      else if (movementType === 'dips') {
        const barLeftX = centerX - 45;
        const barRightX = centerX + 45;
        const barHeightY = centerY + 10;

        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(barLeftX - 25, barHeightY);
        ctx.lineTo(barRightX + 25, barHeightY);
        ctx.stroke();

        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(barLeftX, barHeightY);
        ctx.lineTo(barLeftX, floorY);
        ctx.moveTo(barRightX, barHeightY);
        ctx.lineTo(barRightX, floorY);
        ctx.stroke();

        const dipDipOffset = t * 55;
        const handX = centerX;
        const handY = barHeightY;

        const forwardLean = formMode === 'mistake' ? 0 : 18;
        const shoulderX = centerX - 5 + forwardLean;
        const shoulderY = barHeightY - 70 + dipDipOffset;
        const headX = shoulderX + 8;
        const headY = shoulderY - 20;

        const hipX = shoulderX - forwardLean;
        const hipY = shoulderY + 65;

        const kneeX = hipX - 28;
        const kneeY = hipY + 35;
        const footX = kneeX + 15;
        const footY = kneeY + 25;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        const elbowX = shoulderX - 24 - (formMode === 'mistake' ? 22 : 0);
        const elbowY = (shoulderY + handY) / 2 - 5 + t * 15;

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(handX, handY, 6, 0, Math.PI * 2);
        ctx.fill();

        const dipAngle = Math.round(175 - t * 85);
        primaryAngleDeg = dipAngle;
        primaryAngleLabel = 'DIP ELBOW ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Flaring Elbows Wide & Shrugging Traps Into Neck'
          : '✓ 20° Forward Lean, 90° Elbow Depth, Full Tricep & Pectoral Lockout';
      }

      // =============================================================
      // 5. PULL-UP / CHIN-UP
      // =============================================================
      else if (movementType === 'pull_up') {
        const barY = centerY - 120;
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(centerX - 80, barY);
        ctx.lineTo(centerX + 80, barY);
        ctx.stroke();

        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 80, barY);
        ctx.lineTo(centerX - 80, centerY - 160);
        ctx.moveTo(centerX + 80, barY);
        ctx.lineTo(centerX + 80, centerY - 160);
        ctx.stroke();

        const hangOffset = t * 65;
        const handX = centerX - 35;
        const handRightX = centerX + 35;
        const handY = barY;

        const shoulderY = barY + 30 + hangOffset;
        const shoulderX = centerX;
        const headX = centerX;
        const headY = shoulderY - 18;

        const hipX = centerX - (formMode === 'mistake' ? 25 : 5);
        const hipY = shoulderY + 70;
        const kneeX = hipX - 15;
        const kneeY = hipY + 35;
        const footX = kneeX + 10;
        const footY = kneeY + 25;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        const elbowX = centerX - 38 - (1 - t) * 15;
        const elbowRightX = centerX + 38 + (1 - t) * 15;
        const elbowY = shoulderY + (1 - t) * 20;

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.moveTo(handRightX, handY);
        ctx.lineTo(elbowRightX, elbowY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.arc(handRightX, handRightY, 5, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(elbowRightX, elbowRightY, 6, 0, Math.PI * 2);
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.fill();

        const pullAngle = Math.round(75 + t * 95);
        primaryAngleDeg = pullAngle;
        primaryAngleLabel = 'LAT PULL ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Kipping / Using Leg Momentum & Incomplete Chin Clearance'
          : '✓ Full Dead-Hang Stretch to Strict Sternum-to-Bar Pull';
      }

      // =============================================================
      // 6. PUSH-UP
      // =============================================================
      else if (movementType === 'pushup') {
        const footX = centerX - 110;
        const footY = floorY;
        const handX = centerX + 40;
        const handY = floorY;

        const pushOffset = (1 - t) * 35;
        const shoulderX = handX;
        const shoulderY = handY - 55 + pushOffset;
        const headX = shoulderX + 22;
        const headY = shoulderY - 6;

        const hipSag = formMode === 'mistake' ? 25 : 0;
        const hipX = (footX + shoulderX) / 2;
        const hipY = (footY + shoulderY) / 2 + hipSag;

        const elbowX = handX - 25 - (1 - t) * 10;
        const elbowY = shoulderY - 10 + (1 - t) * 15;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(footX, footY, 5, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.fill();

        const elbowAngle = Math.round(90 + t * 85);
        primaryAngleDeg = elbowAngle;
        primaryAngleLabel = 'PUSHUP ELBOW ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Sagging Lumbar Spine & Flaring Elbows 90°'
          : '✓ Rigid Core Plank, 45° Elbow Tuck, Full Chest-to-Floor ROM';
      }

      // =============================================================
      // 7. HIP THRUST
      // =============================================================
      else if (movementType === 'hip_thrust') {
        const benchX = centerX - 60;
        const benchY = centerY + 30;

        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(benchX - 40, benchY);
        ctx.lineTo(benchX + 20, benchY);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(benchX - 30, benchY);
        ctx.lineTo(benchX - 30, floorY);
        ctx.moveTo(benchX + 10, benchY);
        ctx.lineTo(benchX + 10, floorY);
        ctx.stroke();

        const footX = centerX + 60;
        const footY = floorY;

        const hipThrustY = centerY + 55 - (1 - t) * 45;
        const hipX = centerX - 10;

        const shoulderX = benchX;
        const shoulderY = benchY - 10;
        const headX = shoulderX - 18;
        const headY = shoulderY - 8;

        const kneeX = footX - 5;
        const kneeY = hipThrustY - 5;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipThrustY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = barColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(hipX - 35, hipThrustY - 8);
        ctx.lineTo(hipX + 35, hipThrustY - 8);
        ctx.stroke();
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(hipX - 38, hipThrustY - 30, 8, 44);
        ctx.fillRect(hipX + 30, hipThrustY - 30, 8, 44);

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(footX, footY, 5, 0, Math.PI * 2);
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.arc(hipX, hipThrustY, 6, 0, Math.PI * 2);
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.fill();

        const extensionAngle = Math.round(115 + (1 - t) * 65);
        primaryAngleDeg = extensionAngle;
        primaryAngleLabel = 'HIP EXTENSION ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Hyperextending Lower Back & Feet Too Close/Far'
          : '✓ Neutral Spine Tabletop Lockout with 2s Glute Squeeze';
      }

      // =============================================================
      // 8A. INCLINE BENCH PRESS (35°-45° INCLINE BARBELL / DUMBBELL PRESS)
      // =============================================================
      else if (movementType === 'incline_bench') {
        // 1. Dedicated Incline Bench Frame & Pads
        const benchBaseY = floorY;
        const seatX = centerX + 18;
        const seatY = centerY + 42;
        const seatFrontX = seatX + 36;
        const seatFrontY = seatY - 8; // 15° upward angled seat pad

        const backrestTopX = centerX - 65;
        const backrestTopY = centerY - 55; // 35°-40° incline backrest pad

        // Floor Support Frame & Upright Column
        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        // Base runner on gym floor
        ctx.moveTo(centerX - 95, benchBaseY);
        ctx.lineTo(centerX + 80, benchBaseY);
        // Vertical seat support post
        ctx.moveTo(seatX, seatY);
        ctx.lineTo(seatX, benchBaseY);
        // Diagonal support under incline backrest
        ctx.moveTo((seatX + backrestTopX) / 2, (seatY + backrestTopY) / 2);
        ctx.lineTo(centerX - 42, benchBaseY);
        // Rear barbell rack upright
        ctx.moveTo(centerX - 80, benchBaseY);
        ctx.lineTo(centerX - 80, centerY - 95);
        ctx.stroke();

        // Barbell Rack Pegs / Catchers
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 86, centerY - 80);
        ctx.lineTo(centerX - 70, centerY - 80);
        ctx.lineTo(centerX - 70, centerY - 88);
        ctx.stroke();

        // Padded Bench Cushion: Backrest + Seat Pad
        ctx.strokeStyle = 'rgba(255, 112, 67, 0.7)';
        ctx.lineWidth = 9;
        ctx.beginPath();
        // Seat Pad
        ctx.moveTo(seatX - 5, seatY);
        ctx.lineTo(seatFrontX, seatFrontY);
        // Backrest Pad (35°-40° Incline)
        ctx.moveTo(seatX - 5, seatY);
        ctx.lineTo(backrestTopX, backrestTopY);
        ctx.stroke();

        // 2. Athlete Skeleton on Incline Bench
        const hipLift = formMode === 'mistake' ? 22 : 0;
        const hipX = seatX - 2;
        const hipY = seatY - 10 - hipLift;

        const kneeX = seatFrontX + 8;
        const kneeY = seatFrontY + 28;
        const footX = kneeX + 5;
        const footY = benchBaseY;

        // Torso resting firmly along the incline pad
        const shoulderX = centerX - 42;
        const shoulderY = centerY - 25;
        const headX = backrestTopX + 12;
        const headY = backrestTopY + 2;

        // Legs (Femur + Tibia + Feet Planted on Floor)
        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipY);
        if (formMode === 'mistake') {
          // Excessive hyperextended lumbar arch off the seat
          ctx.quadraticCurveTo(hipX - 15, hipY - 35, shoulderX, shoulderY);
        } else {
          ctx.lineTo(shoulderX, shoulderY);
        }
        ctx.stroke();

        // Head resting back on pad
        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        // 3. Barbell Trajectory & Upper Clavicular Chest Alignment
        // Lockout directly above upper chest / eye line
        const barLockoutX = shoulderX + 38;
        const barLockoutY = shoulderY - 65;
        // Touch point: upper chest / clavicle
        const barTouchX = shoulderX + 18;
        const barTouchY = shoulderY + 5;

        const currentBarX = barLockoutX + t * (barTouchX - barLockoutX);
        const currentBarY = barLockoutY + t * (barTouchY - barLockoutY);

        // Elbow articulation: 45° tuck in correct form, flared wide in mistake
        const elbowFlare = formMode === 'mistake' ? -26 : 14;
        const elbowX = (shoulderX + currentBarX) / 2 + elbowFlare;
        const elbowY = Math.max(shoulderY + 12, (shoulderY + currentBarY) / 2 + (1 - t) * 12);

        // Arms (Humerus + Forearm)
        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(currentBarX, currentBarY);
        ctx.stroke();

        // Glowing Joint Pivots
        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(currentBarX, currentBarY, 5, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.arc(footX, footY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Barbell with Weight Plates
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(currentBarX - 48, currentBarY);
        ctx.lineTo(currentBarX + 48, currentBarY);
        ctx.stroke();

        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(currentBarX - 52, currentBarY - 24, 8, 48);
        ctx.fillRect(currentBarX + 44, currentBarY - 24, 8, 48);

        const inclineElbowAngle = Math.round(75 + (1 - t) * 100);
        primaryAngleDeg = inclineElbowAngle;
        primaryAngleLabel = 'INCLINE ELBOW ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: 90° Elbow Flare Impinging Rotator Cuff & Glutes Lifting Off Incline Seat'
          : '✓ 35° Incline, Scapulae Retracted on Pad, Lower to Upper Clavicle with 45° Elbows';
      }

      // =============================================================
      // 8B. FLAT BENCH PRESS (BARBELL / DUMBBELL FLAT BENCH)
      // =============================================================
      else if (movementType === 'flat_bench') {
        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        const benchX1 = centerX - 120;
        const benchY1 = centerY + 40;
        const benchX2 = centerX + 110;
        const benchY2 = centerY + 40;
        ctx.moveTo(benchX1, benchY1);
        ctx.lineTo(benchX2, benchY2);
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(benchX1 + 20, benchY1);
        ctx.lineTo(benchX1 + 20, floorY);
        ctx.moveTo(benchX2 - 20, benchY2);
        ctx.lineTo(benchX2 - 20, floorY);
        ctx.stroke();

        const headX = benchX1 + 25;
        const headY = benchY1 - 18;
        const shoulderX = benchX1 + 65;
        const shoulderY = benchY1 - 10;
        const hipX = benchX2 - 35;
        const hipY = benchY2 - 10;

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        const kneeX = hipX + 45;
        const kneeY = hipY + 30;
        const footX = kneeX - 10;
        const footY = floorY;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        const barLockoutY = shoulderY - 80;
        const barChestY = shoulderY - 8;
        const currentBarY = barLockoutY + t * (barChestY - barLockoutY);
        const currentBarX = shoulderX + (1 - t) * 8;

        let elbowFlareOffset = formMode === 'mistake' ? -25 : 18;
        const elbowX = (shoulderX + currentBarX) / 2 + elbowFlareOffset;
        const elbowY = Math.max(shoulderY + 12, (shoulderY + currentBarY) / 2 + (1 - t) * 10);

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(currentBarX, currentBarY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(currentBarX, currentBarY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = barColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(currentBarX - 50, currentBarY);
        ctx.lineTo(currentBarX + 50, currentBarY);
        ctx.stroke();

        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(currentBarX - 52, currentBarY - 26, 8, 52);
        ctx.fillRect(currentBarX + 44, currentBarY - 26, 8, 52);

        const elbowAngle = Math.round(75 + (1 - t) * 100);
        primaryAngleDeg = elbowAngle;
        primaryAngleLabel = 'ELBOW ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: 90° Elbow Flare Impinging Rotator Cuff & Butt Off Bench'
          : '✓ 45° Elbow Tuck, Retracted Scapulae, Smooth J-Curve Trajectory';
      }

      // =============================================================
      // 9. SQUAT
      // =============================================================
      else if (movementType === 'squat') {
        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 90, centerY - 140);
        ctx.lineTo(centerX - 90, floorY);
        ctx.moveTo(centerX + 90, centerY - 140);
        ctx.lineTo(centerX + 90, floorY);
        ctx.stroke();

        const footX = centerX - 10;
        const footY = floorY;

        const kneeX = footX - 30 * t;
        const kneeY = footY - 70 + t * 15;

        const hipX = footX - 55 * t;
        const hipY = kneeY - 75 + t * 65;

        const torsoLeanFactor = formMode === 'mistake' ? 1.4 : 1.0;
        const shoulderX = hipX + 20 - 45 * t * torsoLeanFactor;
        const shoulderY = hipY - 75 - 10 * t;

        const headX = shoulderX + 5;
        const headY = shoulderY - 22;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        const barX = shoulderX;
        const barY = shoulderY + 4;
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(barX - 45, barY);
        ctx.lineTo(barX + 45, barY);
        ctx.stroke();

        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(barX - 48, barY - 30, 8, 60);
        ctx.fillRect(barX + 40, barY - 30, 8, 60);

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY + 8);
        ctx.lineTo(barX - 8, barY + 12);
        ctx.lineTo(barX, barY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(footX, footY, 5, 0, Math.PI * 2);
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.fill();

        const kneeAngle = Math.round(180 - t * 92);
        primaryAngleDeg = kneeAngle;
        primaryAngleLabel = 'KNEE ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Knee Valgus Collapse & Excessive Forward Spine Flexion'
          : '✓ Hip Crease Below Knee Parallel, Knees Tracking Toes, Core Braced';
      }

      // =============================================================
      // 10. DEADLIFT
      // =============================================================
      else if (movementType === 'deadlift') {
        const footX = centerX - 10;
        const footY = floorY;

        const kneeX = footX - 12 - 10 * t;
        const kneeY = footY - 70;
        const hipX = footX - 15 - 65 * t;
        const hipY = kneeY - 65 + 25 * t;

        const shoulderX = hipX + 45 + 25 * t + (formMode === 'mistake' ? -20 : 0);
        const shoulderY = hipY - 65 + 35 * t;
        const headX = shoulderX + 15;
        const headY = shoulderY - 18;

        const barX = footX - 2 + (formMode === 'mistake' ? 28 : 0);
        const barY = footY - 15 - (1 - t) * 95;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipY);
        if (formMode === 'mistake') {
          ctx.quadraticCurveTo(hipX + 10, hipY - 40, shoulderX, shoulderY);
        } else {
          ctx.lineTo(shoulderX, shoulderY);
        }
        ctx.stroke();

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(barX, barY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = barColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(barX - 45, barY);
        ctx.lineTo(barX + 45, barY);
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.fillRect(barX - 48, barY - 35, 9, 70);
        ctx.fillRect(barX + 39, barY - 35, 9, 70);

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(footX, footY, 5, 0, Math.PI * 2);
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(barX, barY, 5, 0, Math.PI * 2);
        ctx.fill();

        const hipAngle = Math.round(175 - t * 90);
        primaryAngleDeg = hipAngle;
        primaryAngleLabel = 'HIP HINGE ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Spinal Lumbar Flexion & Bar Drifting Away from Shins'
          : '✓ Neutral Spine, Bar Hugging Shins, Full Glute Lockout';
      }

      // =============================================================
      // 11. LAT PULLDOWN & ROWS
      // =============================================================
      else if (movementType === 'lat_pulldown' || movementType === 'barbell_row') {
        const isPulldown = movementType === 'lat_pulldown';
        if (isPulldown) {
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - 35, centerY + 25);
          ctx.lineTo(centerX + 35, centerY + 25);
          ctx.moveTo(centerX, centerY + 25);
          ctx.lineTo(centerX, floorY);
          ctx.stroke();

          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 150);
          ctx.lineTo(centerX, centerY - 130);
          ctx.stroke();

          const hipX = centerX - 10;
          const hipY = centerY + 18;
          const shoulderX = hipX + 8 - 12 * (formMode === 'mistake' ? 2.5 : 0.8);
          const shoulderY = hipY - 70;
          const headX = shoulderX + 4;
          const headY = shoulderY - 20;

          const barRestY = centerY - 130;
          const barChestY = shoulderY + 8;
          const currentBarY = barRestY + t * (barChestY - barRestY);
          const currentBarX = shoulderX + 5;

          const elbowX = shoulderX - 25 - (1 - t) * 15;
          const elbowY = shoulderY + 20 * t;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX + 30, floorY);
          ctx.lineTo(hipX + 30, hipY - 10);
          ctx.lineTo(hipX, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(currentBarX, currentBarY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = barColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(currentBarX - 60, currentBarY - 6);
          ctx.lineTo(currentBarX - 45, currentBarY);
          ctx.lineTo(currentBarX + 45, currentBarY);
          ctx.lineTo(currentBarX + 60, currentBarY - 6);
          ctx.stroke();

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
          ctx.arc(currentBarX, currentBarY, 5, 0, Math.PI * 2);
          ctx.fill();

          const pullAngle = Math.round(170 - t * 100);
          primaryAngleDeg = pullAngle;
          primaryAngleLabel = 'ELBOW PULL ANGLE';
          mistakeDescription = formMode === 'mistake'
            ? '⚠ ERROR: Behind-the-Neck Pull & Severe Torso Swinging Momentum'
            : '✓ 10° Torso Angle, Pulling Bar to Clavicle, Squeezing Lats';
        } else {
          const footX = centerX - 10;
          const footY = floorY;
          const kneeX = footX - 15;
          const kneeY = footY - 70;
          const hipX = footX - 45;
          const hipY = kneeY - 50;
          const shoulderX = hipX + 50;
          const shoulderY = hipY - 35;
          const headX = shoulderX + 16;
          const headY = shoulderY - 14;

          const barX = shoulderX - 10;
          const barY = floorY - 50 - t * 45;
          const elbowX = shoulderX - 20 - t * 25;
          const elbowY = shoulderY - 10 - t * 15;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(footX, footY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(hipX, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(barX, barY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = barColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(barX - 45, barY);
          ctx.lineTo(barX + 45, barY);
          ctx.stroke();

          const rowAngle = Math.round(165 - t * 95);
          primaryAngleDeg = rowAngle;
          primaryAngleLabel = 'ROW CONTRACTION';
          mistakeDescription = formMode === 'mistake'
            ? '⚠ ERROR: Standing Too Upright & Bouncing Torso'
            : '✓ 45° Torso Angle, Pulling to Navel, Retracting Rhomboids';
        }
      }

      // =============================================================
      // 12. OVERHEAD PRESS & LATERAL RAISES
      // =============================================================
      else if (movementType === 'overhead_press' || movementType === 'lateral_raise') {
        const isLateral = movementType === 'lateral_raise';
        const footX = centerX - 8;
        const footY = floorY;
        const hipX = footX - 6;
        const hipY = footY - 120;
        const shoulderX = hipX + 4;
        const shoulderY = hipY - 75;
        const headX = shoulderX + 4;
        const headY = shoulderY - 20;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        if (isLateral) {
          const armAngle = (15 + t * 75) * (Math.PI / 180);
          const armLen = 75;
          const handX = shoulderX + Math.cos(armAngle) * armLen * (normalizedAngle === 'front' ? 1 : 0.85);
          const handY = shoulderY - Math.sin(armAngle) * armLen + (formMode === 'mistake' ? -15 : 0);

          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(handX - 8, handY - 14, 16, 28);

          primaryAngleDeg = Math.round(15 + t * 75);
          primaryAngleLabel = 'ABDUCTION ANGLE';
          mistakeDescription = formMode === 'mistake'
            ? '⚠ ERROR: Torso Momentum Swing & Shrugging Traps Into Neck'
            : '✓ Smooth Scapular Abduction to Parallel with Slight Elbow Bend';
        } else {
          const barY = (shoulderY + 6) - t * 75;
          const barX = shoulderX + 8 - t * 6;

          const elbowX = shoulderX + (1 - t) * 16;
          const elbowY = (shoulderY + 28) - t * 45;

          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(barX, barY);
          ctx.stroke();

          ctx.strokeStyle = barColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(barX - 45, barY);
          ctx.lineTo(barX + 45, barY);
          ctx.stroke();

          primaryAngleDeg = Math.round(80 + t * 95);
          primaryAngleLabel = 'SHOULDER PRESS';
          mistakeDescription = formMode === 'mistake'
            ? '⚠ ERROR: Lower Back Hyperextension & Bar Pushed Forward'
            : '✓ Vertical Bar Path Clearing Nose, Glutes & Abs Clamped';
        }
      }

      // =============================================================
      // 13. BICEP CURLS
      // =============================================================
      else if (movementType === 'bicep_curl') {
        const footX = centerX - 10;
        const footY = floorY;
        const hipX = footX - 5;
        const hipY = footY - 120;
        const shoulderX = hipX + 4;
        const shoulderY = hipY - 75;
        const headX = shoulderX + 4;
        const headY = shoulderY - 20;

        const elbowX = shoulderX + 4 + (formMode === 'mistake' ? 25 : 0);
        const elbowY = shoulderY + 55;

        let handAngle = Math.PI / 2 - t * 2.1;
        const handX = elbowX + Math.cos(handAngle) * 55;
        const handY = elbowY + Math.sin(handAngle) * 55;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(handX - 10, handY - 10, 20, 20);

        primaryAngleDeg = Math.round(180 - t * 135);
        primaryAngleLabel = 'BICEPS FLEXION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Elbows Floating Forward & Torso Rocking'
          : '✓ Pinned Elbows, Supinated Wrists, Full Peak Squeeze';
      }

      // =============================================================
      // 14. LUNGE / STEP-UP
      // =============================================================
      else if (movementType === 'lunge') {
        const leadFootX = centerX + 45;
        const leadFootY = floorY;
        const trailFootX = centerX - 65;
        const trailFootY = floorY;

        const leadKneeX = leadFootX + (formMode === 'mistake' ? 35 : 5);
        const leadKneeY = leadFootY - 65 + t * 35;

        const trailKneeX = trailFootX + 15;
        const trailKneeY = trailFootY - 65 + t * 50;

        const hipX = centerX - 10;
        const hipY = leadKneeY - 55 + t * 10;

        const shoulderX = hipX + 4;
        const shoulderY = hipY - 75;
        const headX = shoulderX + 4;
        const headY = shoulderY - 18;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(leadFootX, leadFootY);
        ctx.lineTo(leadKneeX, leadKneeY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(trailKneeX, trailKneeY);
        ctx.lineTo(trailFootX, trailFootY);
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = Math.round(140 - t * 50);
        primaryAngleLabel = 'LEAD KNEE ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Lead Knee Shearing Excessively Past Toes with Heel Lifting'
          : '✓ 90° Front Knee & 90° Rear Knee, Upright Torso Balance';
      }

      // =============================================================
      // 15. FACE PULL (CABLE ROPE TO EYES)
      // =============================================================
      else if (movementType === 'face_pull') {
        const towerX = centerX + 130;
        const pulleyY = centerY - 40;

        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(towerX, centerY - 140);
        ctx.lineTo(towerX, floorY);
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(towerX, pulleyY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Staggered stance athlete leaning slightly back
        const leadFootX = centerX - 25;
        const rearFootX = centerX - 65;
        const hipX = centerX - 40;
        const hipY = floorY - 110;

        const shoulderX = hipX - 5;
        const shoulderY = hipY - 65;
        const headX = shoulderX + 4;
        const headY = shoulderY - 18;

        // Hands pulling rope to eye level
        const handX = headX + 16 + (1 - t) * 55;
        const handY = headY + (1 - t) * 12;

        const elbowX = shoulderX - 18 + t * 5;
        const elbowY = shoulderY - 16;

        ctx.strokeStyle = cableColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(towerX, pulleyY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(leadFootX, floorY);
        ctx.lineTo(hipX + 8, hipY);
        ctx.moveTo(rearFootX, floorY);
        ctx.lineTo(hipX - 8, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = Math.round(70 + t * 90);
        primaryAngleLabel = 'REAR DELT ROTATION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Elbows Drooping Low & Yanking with Lower Back Momentum'
          : '✓ High Elbows, External Shoulder Rotation, Squeeze Rear Delts to Forehead';
      }

      // =============================================================
      // 16. SHRUGS (DUMBBELL / BARBELL TRAP ELEVATION)
      // =============================================================
      else if (movementType === 'shrugs') {
        const footX = centerX - 10;
        const footY = floorY;
        const hipX = footX - 4;
        const hipY = footY - 120;

        const trapElevation = t * 18;
        const shoulderX = hipX + 4;
        const shoulderY = hipY - 75 - trapElevation;
        const headX = shoulderX + 4;
        const headY = hipY - 95;

        const handX = shoulderX + 18;
        const handY = hipY - 20 - trapElevation;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(handX - 8, handY - 14, 16, 28);

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = Math.round(90 + t * 45);
        primaryAngleLabel = 'TRAP ELEVATION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Rolling Shoulders in Circles & Craning Neck Forward'
          : '✓ Pure Vertical Scapular Elevation with 2s Peak Trapezius Squeeze';
      }

      // =============================================================
      // 17. HANGING LEG / KNEE RAISES
      // =============================================================
      else if (movementType === 'hanging_leg_raise') {
        const barY = centerY - 120;
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(centerX - 60, barY);
        ctx.lineTo(centerX + 60, barY);
        ctx.stroke();

        const handX = centerX;
        const handY = barY;
        const shoulderX = centerX;
        const shoulderY = barY + 45;
        const headX = centerX;
        const headY = shoulderY - 18;

        const hipX = centerX - t * 15;
        const hipY = shoulderY + 70;

        const legFlex = t * 1.5;
        const kneeX = hipX + Math.sin(legFlex) * 45;
        const kneeY = hipY + Math.cos(legFlex) * 45;
        const footX = kneeX + Math.sin(legFlex * 0.8) * 40;
        const footY = kneeY + Math.cos(legFlex * 0.8) * 40;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = Math.round(180 - t * 95);
        primaryAngleLabel = 'CORE / HIP FLEXION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Torso Swinging Momentum & Arching Lower Back'
          : '✓ Posterior Pelvic Tilt, Flexing Knees to Sternum with Controlled Negative';
      }

      // =============================================================
      // 18. CALF RAISES
      // =============================================================
      else if (movementType === 'calf_raise') {
        const blockY = floorY - 8;
        ctx.fillStyle = '#64748B';
        ctx.fillRect(centerX - 35, blockY, 70, 8);

        const heelElevation = t * 24;
        const footX = centerX - 5;
        const footY = blockY - heelElevation;
        const ankleAngle = Math.round(90 + t * 45);

        const kneeX = footX - 5;
        const kneeY = footY - 70;
        const hipX = kneeX - 4;
        const hipY = kneeY - 75;
        const shoulderX = hipX + 4;
        const shoulderY = hipY - 75;
        const headX = shoulderX + 4;
        const headY = shoulderY - 20;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(footX, footY, 6, 0, Math.PI * 2);
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = ankleAngle;
        primaryAngleLabel = 'PLANTARFLEXION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Bouncing at Bottom & Incomplete Extension at Top'
          : '✓ Deep Eccentric Stretch Below Block, Explosive Plantarflexion & 2s Peak Hold';
      }

      // =============================================================
      // 19. LEG EXTENSION / LEG CURL
      // =============================================================
      else if (movementType === 'leg_extension') {
        const seatX = centerX - 15;
        const seatY = centerY + 30;

        ctx.strokeStyle = machineColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(seatX - 35, seatY);
        ctx.lineTo(seatX + 25, seatY);
        ctx.moveTo(seatX - 30, seatY);
        ctx.lineTo(seatX - 45, seatY - 55);
        ctx.stroke();

        const hipX = seatX - 25;
        const hipY = seatY - 10;
        const kneeX = seatX + 25;
        const kneeY = seatY;

        const extAngle = (1 - t) * (Math.PI / 2);
        const shinLen = 65;
        const footX = kneeX + Math.cos(extAngle) * shinLen;
        const footY = kneeY + Math.sin(extAngle) * shinLen;

        const shoulderX = hipX - 12;
        const shoulderY = hipY - 70;
        const headX = shoulderX + 4;
        const headY = shoulderY - 18;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        // Roller Pad
        ctx.fillStyle = '#FF7043';
        ctx.beginPath();
        ctx.arc(footX, footY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
        ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = Math.round(90 + t * 90);
        primaryAngleLabel = 'KNEE EXTENSION ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Kicking Explosively with Momentum & Butt Lifting Off Pad'
          : '✓ Strict Quadriceps Contraction, Full 180° Lockout with Controlled 3s Negative';
      }

      // =============================================================
      // 20. PLANK / CORE
      // =============================================================
      else {
        const footX = centerX - 100;
        const footY = floorY - 10;
        const elbowX = centerX + 70;
        const elbowY = floorY - 10;

        const hipSag = formMode === 'mistake' ? 28 : 0;
        const hipX = (footX + elbowX) / 2 - 15;
        const hipY = (footY + elbowY) / 2 - 12 + hipSag;

        const shoulderX = elbowX - 5;
        const shoulderY = elbowY - 25;
        const headX = shoulderX + 18;
        const headY = shoulderY - 6;

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        primaryAngleDeg = formMode === 'mistake' ? 152 : 180;
        primaryAngleLabel = 'SPINAL ALIGNMENT';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Lumbar Spine Sagging & Lost Pelvic Neutrality'
          : '✓ Straight Rigid Line from Head to Heels with Posterior Pelvic Tilt';
      }

      ctx.restore();

      // -------------------------------------------------------------
      // 4. BIOMECHANICAL HEATMAP GLOW & CONTRACTION PULSE
      // -------------------------------------------------------------
      if (muscleHeatmapActive) {
        ctx.save();
        const glowIntensity = formMode === 'mistake' ? 0.38 : (0.18 + 0.35 * t);
        const glowGrad = ctx.createRadialGradient(
          centerX, centerY, 30,
          centerX, centerY, width * 0.45
        );
        if (formMode === 'mistake') {
          glowGrad.addColorStop(0, `rgba(239, 68, 68, ${glowIntensity})`);
          glowGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.08)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          glowGrad.addColorStop(0, `rgba(255, 112, 67, ${glowIntensity})`);
          glowGrad.addColorStop(0.5, 'rgba(232, 128, 157, 0.12)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 5. CYBER-SPORT HUD TELEMETRY OVERLAY & ACCURACY METRICS
      // -------------------------------------------------------------
      ctx.save();

      const badgeX = 18;
      const badgeY = 16;
      ctx.fillStyle = formMode === 'mistake' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = formMode === 'mistake' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(badgeX, badgeY, 150, 26, 6);
      } else {
        ctx.rect(badgeX, badgeY, 150, 26);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = formMode === 'mistake' ? '#FCA5A5' : '#34D399';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(formMode === 'mistake' ? '⚠ FAULT DEMO' : '✓ ACCURATE DEMO', badgeX + 10, badgeY + 17);

      const titleText = enrichedExercise?.name || 'Exercise Demonstration';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(titleText, width - 18, badgeY + 14);

      ctx.fillStyle = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.fillText(`ACCURACY: ${formAccuracyScore}% • ${trajectoryStatus}`, width - 18, badgeY + 30);

      const telemetryX = width - 185;
      const telemetryY = 52;
      ctx.fillStyle = 'rgba(18, 3, 15, 0.85)';
      ctx.strokeStyle = formMode === 'mistake' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(telemetryX, telemetryY, 167, 26, 6);
      } else {
        ctx.rect(telemetryX, telemetryY, 167, 26);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = formMode === 'mistake' ? '#FCA5A5' : '#38BDF8';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`📐 ${primaryAngleLabel}: ${primaryAngleDeg}°`, telemetryX + 10, telemetryY + 17);

      if (mistakeDescription) {
        const bannerW = Math.min(width - 40, 560);
        const bannerH = 36;
        const bannerX = (width - bannerW) / 2;
        const bannerY = height - 85;

        ctx.fillStyle = formMode === 'mistake' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.9)';
        ctx.strokeStyle = formMode === 'mistake' ? '#FCA5A5' : '#6EE7B7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 8);
        } else {
          ctx.rect(bannerX, bannerY, bannerW, bannerH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(mistakeDescription, width / 2, bannerY + 22);
      }

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`SmartFit Virtual Trainer • ${enrichedExercise.category || 'Biomechanical'} Demonstration`, width / 2, height - 16);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, tempoSpeed, muscleHeatmapActive, formMode, enrichedExercise?.name, cameraAngle, movementType]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '440px',
          display: 'block',
          borderRadius: '20px'
        }}
      />
    </div>
  );
}
