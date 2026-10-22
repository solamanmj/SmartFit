import React, { useRef, useEffect } from 'react';
import { getExerciseDetails } from '../../data/exerciseSeedData';

// Classify exercise movement archetype with high precision
export const getExerciseMovementType = (exercise) => {
  if (!exercise) return 'squat';
  
  const n = (exercise.name || '').toLowerCase();
  const c = (exercise.category || '').toLowerCase();
  const m = (exercise.movementType || '').toLowerCase();
  const a = (exercise.animationType || '').toLowerCase();

  // 1. High-Priority Name Disambiguation (Always takes precedence over default or inherited attributes)
  if (n.includes('cable fly') || n.includes('standing fly') || n.includes('pec deck') || n.includes('chest fly') || n.includes('cable crossover') || n.includes('flyes') || n.includes('fly')) {
    return 'chest_fly';
  }
  if (n.includes('overhead tricep') || n.includes('overhead cable tricep') || n.includes('rope extension') || n.includes('skull crusher') || n.includes('french press') || (n.includes('tricep') && (n.includes('overhead') || n.includes('extension')))) {
    return 'overhead_tricep';
  }
  if (n.includes('tricep pushdown') || n.includes('tricep pressdown') || (n.includes('tricep') && !n.includes('overhead'))) {
    return 'tricep_pushdown';
  }
  if (n.includes('face pull')) return 'face_pull';
  if (n.includes('shrug')) return 'shrugs';
  if (n.includes('dip')) return 'dips';
  if (n.includes('pull-up') || n.includes('chin-up') || n.includes('pullup') || n.includes('chinup')) return 'pull_up';
  if (n.includes('incline') && (n.includes('press') || n.includes('bench') || n.includes('barbell') || n.includes('db') || n.includes('dumbbell') || n.includes('chest')) && !n.includes('curl') && !n.includes('row')) {
    return 'incline_bench';
  }
  if (n.includes('incline press') || n.includes('incline bench') || n.includes('incline db')) {
    return 'incline_bench';
  }
  if (n.includes('push-up') || n.includes('pushup')) return 'pushup';
  if (n.includes('bench') || n.includes('chest press') || n.includes('db press')) return 'flat_bench';
  if (n.includes('renegade') || n.includes('row')) return 'barbell_row';
  if (n.includes('hip thrust') || n.includes('glute bridge')) return 'hip_thrust';
  if (n.includes('rdl') || (n.includes('deadlift') && n.includes('romanian'))) return 'deadlift';
  if (n.includes('deadlift') || n.includes('good morning')) return 'deadlift';
  if (n.includes('calf') || n.includes('heel raise')) return 'calf_raise';
  if (n.includes('hamstring curl') || n.includes('leg curl') || n.includes('lying curl') || n.includes('seated leg curl')) return 'hamstring_curl';
  if (n.includes('leg extension')) return 'leg_extension';
  if (n.includes('leg press') || n.includes('sled press') || n.includes('hack squat')) return 'leg_press';
  if (n.includes('lunge') || n.includes('step-up') || n.includes('split squat')) return 'lunge';
  if (n.includes('squat')) return 'squat';
  if (n.includes('ab wheel') || n.includes('wheel rollout') || n.includes('rollout')) return 'ab_wheel';
  if (n.includes('russian') || n.includes('twist') || n.includes('rotational core')) return 'russian_twist';
  if (n.includes('lateral raise') || n.includes('front raise') || n.includes('side delt')) return 'lateral_raise';
  if (n.includes('overhead') || n.includes('shoulder press') || n.includes('military') || n.includes('arnold')) return 'overhead_press';
  if (n.includes('hammer curl') || n.includes('bicep') || n.includes('curl') || n.includes('preacher')) return 'bicep_curl';
  if (n.includes('hanging leg') || n.includes('hanging knee')) return 'hanging_leg_raise';
  if (n.includes('plank') || n.includes('crunch') || n.includes('slam')) return 'plank';

  // 2. Explicit Animation Type Match (For custom or database-defined models)
  if (a && a !== 'undefined') {
    if (a === 'chest_fly') return 'chest_fly';
    if (a === 'dips') return 'dips';
    if (a === 'pull_up') return 'pull_up';
    if (a === 'pushup') return 'pushup';
    if (a === 'hip_thrust') return 'hip_thrust';
    if (a === 'incline_bench') return 'incline_bench';
    if (a === 'flat_bench') return 'flat_bench';
    if (a === 'leg_press') return 'leg_press';
    if (a === 'squat') return 'squat';
    if (a === 'deadlift') return 'deadlift';
    if (a === 'lat_pulldown') return 'lat_pulldown';
    if (a === 'barbell_row') return 'barbell_row';
    if (a === 'overhead_press') return 'overhead_press';
    if (a === 'lateral_raise') return 'lateral_raise';
    if (a === 'bicep_curl') return 'bicep_curl';
    if (a === 'overhead_tricep') return 'overhead_tricep';
    if (a === 'tricep_pushdown') return 'tricep_pushdown';
    if (a === 'face_pull') return 'face_pull';
    if (a === 'shrugs') return 'shrugs';
    if (a === 'hanging_leg_raise') return 'hanging_leg_raise';
    if (a === 'calf_raise') return 'calf_raise';
    if (a === 'hamstring_curl' || a === 'leg_curl') return 'hamstring_curl';
    if (a === 'ab_wheel' || a === 'rollout') return 'ab_wheel';
    if (a === 'russian_twist' || a === 'twist') return 'russian_twist';
    if (a === 'leg_extension') return 'leg_extension';
    if (a === 'lunge') return 'lunge';
    if (a === 'plank') return 'plank';
  }

  return 'squat';
};

// Classify equipment type with high precision
export const getExerciseEquipmentType = (exercise) => {
  if (!exercise) return 'barbell';
  const name = (exercise.name || '').toLowerCase();
  const equip = Array.isArray(exercise.equipment) 
    ? exercise.equipment.map(e => e.toLowerCase()).join(' ')
    : (exercise.equipment || '').toLowerCase();

  // Name overrides take highest priority to avoid inheritance errors
  if (name.includes('ab wheel') || name.includes('wheel') || name.includes('rollout')) return 'ab_wheel';
  if (name.includes('plate') || name.includes('twist') || equip.includes('plate') || equip.includes('weight plate')) return 'plate';
  if (name.includes('leg press') || name.includes('sled') || name.includes('leg curl') || name.includes('hamstring curl') || name.includes('leg extension')) return 'machine';
  if (name.includes('cable') || name.includes('pulley') || name.includes('crossover') || name.includes('flyes') || name.includes('fly')) return 'cable';
  if (name.includes('dumbbell') || name.includes('db') || name.includes('dumbbells')) return 'dumbbell';
  if (name.includes('kettlebell') || name.includes('kb')) return 'kettlebell';
  if (name.includes('bodyweight') || name.includes('pull-up') || name.includes('push-up') || name.includes('pushup') || name.includes('dip')) return 'bodyweight';
  if (name.includes('barbell') || name.includes('olympic') || name.includes('ez-bar') || name.includes('ez bar')) return 'barbell';

  // Equipment array fallback
  if (equip.includes('plate') || equip.includes('weight plate')) return 'plate';
  if (equip.includes('leg press') || equip.includes('machine')) return 'machine';
  if (equip.includes('cable') || equip.includes('pulley')) return 'cable';
  if (equip.includes('dumbbell') || equip.includes('db')) return 'dumbbell';
  if (equip.includes('kettlebell') || equip.includes('kb')) return 'kettlebell';
  if (equip.includes('bodyweight') || equip.includes('pull-up bar') || equip.includes('dip')) return 'bodyweight';
  if (equip.includes('barbell') || equip.includes('olympic') || equip.includes('bar')) return 'barbell';

  return 'barbell';
};

// ============================================================================
// DRAWING UTILITIES: AUTHENTIC EQUIPMENT RENDERING
// ============================================================================

// 1. Draw Side-Profile Olympic Barbell Plate & Hub (Cross-Section)
function drawBarbellSide(ctx, x, y, { isMistake = false, plateColor = '#EF4444' } = {}) {
  ctx.save();
  ctx.fillStyle = isMistake ? '#EF4444' : plateColor;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner recessed plate face
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.fill();

  // Chrome Olympic sleeve hub collar
  ctx.fillStyle = '#E2E8F0';
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Center bar pin
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Weight text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 7px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('20KG', x, y - 9);
  ctx.restore();
}

// 2. Draw Front-Facing Olympic Barbell with Weight Plates & Collars
function drawBarbellFront(ctx, startX, endX, y, { isMistake = false, plateColor = '#EF4444' } = {}) {
  ctx.save();
  // Main Bar
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(endX, y);
  ctx.stroke();

  // Knurling center marks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  const mid = (startX + endX) / 2;
  ctx.beginPath();
  ctx.moveTo(mid - 30, y - 2);
  ctx.lineTo(mid - 30, y + 2);
  ctx.moveTo(mid + 30, y - 2);
  ctx.lineTo(mid + 30, y + 2);
  ctx.stroke();

  // Left Olympic Bumper Plates & Sleeve Collar
  const plateWidth = 9;
  const plateHeight = 56;
  ctx.fillStyle = isMistake ? '#EF4444' : plateColor;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.2;

  // Left Outer Plates
  ctx.fillRect(startX - 18, y - plateHeight / 2, plateWidth, plateHeight);
  ctx.strokeRect(startX - 18, y - plateHeight / 2, plateWidth, plateHeight);
  ctx.fillRect(startX - 28, y - (plateHeight - 8) / 2, plateWidth - 2, plateHeight - 8);
  // Left Sleeve Collar
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(startX - 8, y - 6, 8, 12);

  // Right Outer Plates
  ctx.fillStyle = isMistake ? '#EF4444' : plateColor;
  ctx.fillRect(endX + 10, y - plateHeight / 2, plateWidth, plateHeight);
  ctx.strokeRect(endX + 10, y - plateHeight / 2, plateWidth, plateHeight);
  ctx.fillRect(endX + 20, y - (plateHeight - 8) / 2, plateWidth - 2, plateHeight - 8);
  // Right Sleeve Collar
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(endX, y - 6, 8, 12);

  ctx.restore();
}

// 3. Draw Authentic Horizontal Hexagonal Dumbbell (Left/Right Weight Heads with Center Grip)
function drawDumbbellHorizontal(ctx, x, y, { isMistake = false, angle = 0, size = 1.0, weightText = '28' } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(size, size);

  // Chrome Steel Center Handle (Horizontal)
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(13, 0);
  ctx.stroke();

  // Knurling Grip Texture in center
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-6, -2);
  ctx.lineTo(-6, 2);
  ctx.moveTo(0, -2);
  ctx.lineTo(0, 2);
  ctx.moveTo(6, -2);
  ctx.lineTo(6, 2);
  ctx.stroke();

  // Dual Hexagonal Rubber Weight Heads (Left & Right)
  const headColor = isMistake ? '#EF4444' : '#1E293B';
  ctx.fillStyle = headColor;
  ctx.strokeStyle = isMistake ? '#FCA5A5' : '#38BDF8';
  ctx.lineWidth = 1.5;

  // Left Weight Bell (Hex Head on Left side of handle)
  ctx.beginPath();
  ctx.roundRect(-24, -13, 11, 26, 3);
  ctx.fill();
  ctx.stroke();

  // Right Weight Bell (Hex Head on Right side of handle)
  ctx.beginPath();
  ctx.roundRect(13, -13, 11, 26, 3);
  ctx.fill();
  ctx.stroke();

  // Weight Numbers on Heads
  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 7px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(weightText, -18.5, 3);
  ctx.fillText(weightText, 18.5, 3);

  ctx.restore();
}

// 4. Draw Authentic Handheld Weight Plate (Olympic Disc with Grip Slots & Center Ring)
function drawWeightPlateDisc(ctx, x, y, { isMistake = false, angle = 0, size = 1.0, weightText = '10KG', radius = 22 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(size, size);

  // Outer Cast Iron / Rubber Bumper Rim
  const rimColor = isMistake ? '#EF4444' : '#1E293B';
  const borderColor = isMistake ? '#FCA5A5' : '#38BDF8';
  ctx.fillStyle = rimColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Recessed Inner Face
  ctx.fillStyle = isMistake ? 'rgba(127, 29, 29, 0.8)' : '#0F172A';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dual Ergonomic Hand Grip Slots (Cutouts on left & right)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 0.8;
  // Left Slot
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(-radius * 0.65, -radius * 0.22, radius * 0.28, radius * 0.44, 2);
  } else {
    ctx.rect(-radius * 0.65, -radius * 0.22, radius * 0.28, radius * 0.44);
  }
  ctx.fill();
  ctx.stroke();

  // Right Slot
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(radius * 0.37, -radius * 0.22, radius * 0.28, radius * 0.44, 2);
  } else {
    ctx.rect(radius * 0.37, -radius * 0.22, radius * 0.28, radius * 0.44);
  }
  ctx.fill();
  ctx.stroke();

  // Stainless Olympic Center Sleeve Ring & Bore Hole
  ctx.fillStyle = '#CBD5E1';
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#050108';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Weight Text Label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 6.5px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(weightText, 0, -radius * 0.35);

  ctx.restore();
}

export default function VirtualTrainerCanvas({
  exercise,
  activeExercise,
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
  const currentTargetExercise = exercise || activeExercise;
  const enrichedExercise = getExerciseDetails(currentTargetExercise);
  const movementType = getExerciseMovementType(enrichedExercise);
  const equipmentType = getExerciseEquipmentType(enrichedExercise);

  const isDumbbell = equipmentType === 'dumbbell' || 
    (enrichedExercise.name || '').toLowerCase().includes('dumbbell') ||
    (enrichedExercise.name || '').toLowerCase().includes('db');

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
      // 3. PROCEDURAL SKELETON & APPARATUS ARTICULATION
      // -------------------------------------------------------------
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2;

      // Real-time calculated joint angle & telemetry states
      let primaryAngleDeg = 90;
      let primaryAngleLabel = 'JOINT FLEXION';
      let formAccuracyScore = formMode === 'mistake' ? 64 : 98;
      let trajectoryStatus = formMode === 'mistake' ? 'COLLAPSED / FAULT' : 'OPTIMAL / ACCURATE';
      let mistakeDescription = '';

      // Base drawing colors
      const boneColor = formMode === 'mistake' ? '#FCA5A5' : '#FFFFFF';
      const jointColor = formMode === 'mistake' ? '#EF4444' : '#FF7043';
      const armColor = formMode === 'mistake' ? '#EF4444' : '#38BDF8';
      const cableColor = 'rgba(250, 204, 21, 0.85)';
      const machineColor = 'rgba(255, 255, 255, 0.35)';

      // =============================================================
      // 1. CHEST FLY: CABLE STANDING CHEST FLY / PEC DECK / DUMBBELL FLY
      // =============================================================
      if (movementType === 'chest_fly') {
        const isSideView = normalizedAngle === 'side';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isFrontView = normalizedAngle === 'front' || (!isSideView && !isRearView && !isIsoView);

        if (isSideView) {
          // =========================================================
          // SIDE PERSPECTIVE: Staggered Stance Profile, Sagittal Arc
          // =========================================================
          const towerX = centerX - 140;
          const pulleyY = centerY - 50;

          // Single Side Cable Tower Column & Weight Stack
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(towerX, centerY - 150);
          ctx.lineTo(towerX, floorY);
          ctx.moveTo(towerX - 25, floorY);
          ctx.lineTo(towerX + 25, floorY);
          ctx.stroke();

          // Pulley Wheel & Swivel
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(towerX, pulleyY, 8, 0, Math.PI * 2);
          ctx.fill();

          // Staggered Stance Lower Body in Profile
          const leadFootX = centerX + 26;
          const leadFootY = floorY;
          const rearFootX = centerX - 32;
          const rearFootY = floorY;
          const hipX = centerX - 6;
          const hipY = floorY - 112;

          // Torso with 15° forward athletic lean
          const torsoSway = formMode === 'mistake' ? (20 - t * 30) : 14;
          const shoulderX = hipX + torsoSway;
          const shoulderY = hipY - 72;
          const headX = shoulderX + 8;
          const headY = shoulderY - 20;

          // Skeleton Legs & Spine
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          // Lead leg
          ctx.moveTo(leadFootX, leadFootY);
          ctx.lineTo(leadFootX - 10, leadFootY - 45); // Knee
          ctx.lineTo(hipX + 8, hipY);
          // Rear leg
          ctx.moveTo(rearFootX, rearFootY);
          ctx.lineTo(rearFootX - 6, rearFootY - 50); // Knee
          ctx.lineTo(hipX - 8, hipY);
          // Torso Spine
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Head
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Arm Arc Path in Profile: From deep stretch back (t=1) to full forward squeeze (t=0)
          const reachForward = (1 - t) * 62;
          const handX = shoulderX + 12 + reachForward;
          const handY = shoulderY + 22 + (1 - t) * 6;

          const elbowFlare = formMode === 'mistake' ? -20 : 12;
          const elbowX = (shoulderX + handX) / 2 - 8 + (formMode === 'mistake' ? -15 : 0);
          const elbowY = shoulderY + 16 + t * 8;

          // Cable line from rear pulley to hand
          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(towerX, pulleyY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          // Arm (Shoulder -> Elbow -> Hand)
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          // D-Handle Grip in hand
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handX, handY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Joint Pivot Nodes
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowX, elbowY, 5, 0, Math.PI * 2);
          ctx.arc(handX, handY, 5, 0, Math.PI * 2);
          ctx.fill();

        } else if (isRearView) {
          // =========================================================
          // REAR PERSPECTIVE: Posterior Scapular Retraction & Hugging Arc
          // =========================================================
          const towerLeftX = centerX - 150;
          const towerRightX = centerX + 150;
          const pulleyY = centerY - 30;

          // Dual Towers
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

          // Posterior view stance
          const footLeftX = centerX - 24;
          const footRightX = centerX + 24;
          const hipX = centerX;
          const hipY = floorY - 108;
          const shoulderX = centerX;
          const shoulderY = hipY - 72;
          const headX = centerX;
          const headY = shoulderY - 18;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(footLeftX, floorY);
          ctx.lineTo(hipX - 10, hipY);
          ctx.moveTo(footRightX, floorY);
          ctx.lineTo(hipX + 10, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Head facing away
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Back Scapular V-Taper
          const scapulaSpread = 14 + t * 18; // Scapulae pinch/retract on t=1 (deep stretch)
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(shoulderX - scapulaSpread, shoulderY + 12);
          ctx.lineTo(shoulderX, hipY - 20);
          ctx.moveTo(shoulderX + scapulaSpread, shoulderY + 12);
          ctx.lineTo(shoulderX, hipY - 20);
          ctx.stroke();

          // Arms opening and hugging forward
          const armSpan = 22 + t * 76;
          const handLeftX = shoulderX - armSpan;
          const handRightX = shoulderX + armSpan;
          const handY = shoulderY + 24 + t * 8;

          const elbowLeftX = shoulderX - (armSpan * 0.65) - 10;
          const elbowLeftY = shoulderY + 14 + t * 6;
          const elbowRightX = shoulderX + (armSpan * 0.65) + 10;
          const elbowRightY = shoulderY + 14 + t * 6;

          // Cables from towers to hands
          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(towerLeftX, pulleyY);
          ctx.lineTo(handLeftX, handY);
          ctx.moveTo(towerRightX, pulleyY);
          ctx.lineTo(handRightX, handY);
          ctx.stroke();

          // Arms
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 16, shoulderY);
          ctx.lineTo(elbowLeftX, elbowLeftY);
          ctx.lineTo(handLeftX, handY);
          ctx.moveTo(shoulderX + 16, shoulderY);
          ctx.lineTo(elbowRightX, elbowRightY);
          ctx.lineTo(handRightX, handY);
          ctx.stroke();

          // Handles
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handLeftX, handY, 6, 0, Math.PI * 2);
          ctx.arc(handRightX, handY, 6, 0, Math.PI * 2);
          ctx.fill();

        } else if (isIsoView) {
          // =========================================================
          // ISOMETRIC / 45° DYNAMIC PERSPECTIVE: 3D Depth & Projection
          // =========================================================
          const towerLeftX = centerX - 160;
          const towerLeftY = centerY - 45;
          const towerRightX = centerX + 130;
          const towerRightY = centerY - 15;

          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          // Far Left Tower
          ctx.moveTo(towerLeftX, towerLeftY - 110);
          ctx.lineTo(towerLeftX, floorY - 20);
          // Near Right Tower
          ctx.moveTo(towerRightX, towerRightY - 130);
          ctx.lineTo(towerRightX, floorY + 10);
          ctx.stroke();

          // Pulleys
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(towerLeftX, towerLeftY, 7, 0, Math.PI * 2);
          ctx.arc(towerRightX, towerRightY, 7, 0, Math.PI * 2);
          ctx.fill();

          // Angled 45° athlete stance
          const leadFootX = centerX + 15;
          const leadFootY = floorY + 8;
          const rearFootX = centerX - 35;
          const rearFootY = floorY - 14;

          const hipX = centerX - 10;
          const hipY = floorY - 110;
          const shoulderX = hipX + 16;
          const shoulderY = hipY - 70;
          const headX = shoulderX + 6;
          const headY = shoulderY - 18;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(leadFootX, leadFootY);
          ctx.lineTo(hipX + 8, hipY);
          ctx.moveTo(rearFootX, rearFootY);
          ctx.lineTo(hipX - 8, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Depth-scaled arms
          const armSpanFar = 18 + t * 60;
          const armSpanNear = 28 + t * 80;
          const handFarX = shoulderX - armSpanFar;
          const handFarY = shoulderY + 14 + t * 8;
          const handNearX = shoulderX + armSpanNear;
          const handNearY = shoulderY + 26 + t * 10;

          const elbowFarX = (shoulderX + handFarX) / 2 - 8;
          const elbowFarY = shoulderY + 8 + t * 4;
          const elbowNearX = (shoulderX + handNearX) / 2 + 14;
          const elbowNearY = shoulderY + 18 + t * 6;

          // Cables
          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(towerLeftX, towerLeftY);
          ctx.lineTo(handFarX, handFarY);
          ctx.moveTo(towerRightX, towerRightY);
          ctx.lineTo(handNearX, handNearY);
          ctx.stroke();

          // Arms
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 10, shoulderY - 4);
          ctx.lineTo(elbowFarX, elbowFarY);
          ctx.lineTo(handFarX, handFarY);
          ctx.moveTo(shoulderX + 10, shoulderY + 4);
          ctx.lineTo(elbowNearX, elbowNearY);
          ctx.lineTo(handNearX, handNearY);
          ctx.stroke();

          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handFarX, handFarY, 5.5, 0, Math.PI * 2);
          ctx.arc(handNearX, handNearY, 6.5, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // =========================================================
          // FRONT PERSPECTIVE: Direct Coronal View, Symmetrical Pectoral Squeeze
          // =========================================================
          const towerLeftX = centerX - 155;
          const towerRightX = centerX + 155;
          const pulleyY = centerY - 25;

          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(towerLeftX, centerY - 140);
          ctx.lineTo(towerLeftX, floorY);
          ctx.moveTo(towerRightX, centerY - 140);
          ctx.lineTo(towerRightX, floorY);
          ctx.stroke();

          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(towerLeftX, pulleyY, 7, 0, Math.PI * 2);
          ctx.arc(towerRightX, pulleyY, 7, 0, Math.PI * 2);
          ctx.fill();

          // Symmetrical front stance
          const footLeftX = centerX - 26;
          const footRightX = centerX + 26;
          const hipX = centerX;
          const hipY = floorY - 110;
          const shoulderX = centerX;
          const shoulderY = hipY - 70;
          const headX = centerX;
          const headY = shoulderY - 18;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(footLeftX, floorY);
          ctx.lineTo(hipX - 10, hipY);
          ctx.moveTo(footRightX, floorY);
          ctx.lineTo(hipX + 10, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Horizontal Adduction Arc
          const armSpan = 20 + t * 80;
          const elbowBendMistake = formMode === 'mistake' ? 35 : 0;
          const handLeftX = shoulderX - armSpan + (formMode === 'mistake' ? 15 : 0);
          const handRightX = shoulderX + armSpan - (formMode === 'mistake' ? 15 : 0);
          const handY = shoulderY + 22 + t * 8;

          const elbowLeftX = (shoulderX + handLeftX) / 2 - 14 - elbowBendMistake;
          const elbowLeftY = shoulderY + 12 + t * 6;
          const elbowRightX = (shoulderX + handRightX) / 2 + 14 + elbowBendMistake;
          const elbowRightY = shoulderY + 12 + t * 6;

          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(towerLeftX, pulleyY);
          ctx.lineTo(handLeftX, handY);
          ctx.moveTo(towerRightX, pulleyY);
          ctx.lineTo(handRightX, handY);
          ctx.stroke();

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 14, shoulderY);
          ctx.lineTo(elbowLeftX, elbowLeftY);
          ctx.lineTo(handLeftX, handY);
          ctx.moveTo(shoulderX + 14, shoulderY);
          ctx.lineTo(elbowRightX, elbowRightY);
          ctx.lineTo(handRightX, handY);
          ctx.stroke();

          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handLeftX, handY, 6, 0, Math.PI * 2);
          ctx.arc(handRightX, handY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowLeftX, elbowLeftY, 5, 0, Math.PI * 2);
          ctx.arc(elbowRightX, elbowRightY, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        const adductionAngle = Math.round(25 + t * 115);
        primaryAngleDeg = adductionAngle;
        primaryAngleLabel = isSideView ? 'SAGITTAL REACH ANGLE' : (isRearView ? 'SCAPULAR RETRACTION' : 'CHEST ADDUCTION ANGLE');
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Bending Elbows into a Press & Jerking Torso Backwards'
          : `✓ ${isSideView ? 'Sagittal Profile: Neutral Torso with Controlled Forward Arc' : (isRearView ? 'Posterior Scapular Protraction at Peak 1s Squeeze' : 'Coronal View: Symmetrical Hugging Arc with Fixed Soft Elbows')}`;
      }

      // =============================================================
      // 2. OVERHEAD TRICEPS EXTENSION
      // =============================================================
      else if (movementType === 'overhead_tricep') {
        const towerX = centerX - 125;
        const pulleyY = centerY - 95;

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

        const elbowX = shoulderX + 22 + (formMode === 'mistake' ? 18 : 0);
        const elbowY = shoulderY - 26 + (formMode === 'mistake' ? 15 : 0);

        const extAngle = (formMode === 'mistake' ? -0.2 : 0.4) + (1 - t) * 1.8;
        const forearmLen = 52;
        const handX = elbowX + Math.cos(extAngle - Math.PI / 2) * forearmLen;
        const handY = elbowY + Math.sin(extAngle - Math.PI / 2) * forearmLen;

        ctx.strokeStyle = cableColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(towerX, pulleyY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(leadFootX, leadFootY);
        ctx.lineTo(hipX + 8, hipY);
        ctx.moveTo(rearFootX, rearFootY);
        ctx.lineTo(hipX - 8, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        ctx.fillStyle = boneColor;
        ctx.beginPath();
        ctx.arc(headX, headY, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = armColor;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.arc(handX, handY, 6, 0, Math.PI * 2);
        ctx.arc(handX + 6, handY + 6, 4, 0, Math.PI * 2);
        ctx.fill();

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
      // 3. TRICEPS PUSHDOWN
      // =============================================================
      else if (movementType === 'tricep_pushdown') {
        const towerX = centerX + 115;
        const pulleyY = centerY - 130;

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

        const footX = centerX - 30;
        const footY = floorY;
        const hipX = footX - 5;
        const hipY = footY - 120;
        const shoulderX = hipX + 12;
        const shoulderY = hipY - 75;
        const headX = shoulderX + 4;
        const headY = shoulderY - 20;

        const elbowX = shoulderX + 6 + (formMode === 'mistake' ? 22 : 0);
        const elbowY = shoulderY + 52 + (formMode === 'mistake' ? -15 : 0);

        const pushAngle = (Math.PI / 2) + (1 - t) * 1.55;
        const handX = elbowX + Math.cos(pushAngle) * 50;
        const handY = elbowY + Math.sin(pushAngle) * 50;

        ctx.strokeStyle = cableColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(towerX, pulleyY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

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

        ctx.strokeStyle = armColor;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

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
      // 4. DIPS
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

        ctx.strokeStyle = armColor;
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

        ctx.strokeStyle = armColor;
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
        ctx.arc(handRightX, handY, 5, 0, Math.PI * 2);
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.arc(elbowRightX, elbowY, 6, 0, Math.PI * 2);
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

        ctx.strokeStyle = armColor;
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

        drawBarbellSide(ctx, hipX, hipThrustY - 8, { isMistake: formMode === 'mistake' });

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
      // 8A. INCLINE BENCH PRESS (30° SHALLOW RECLINE & HORIZONTAL DUMBBELLS)
      // =============================================================
      else if (movementType === 'incline_bench') {
        const isFrontView = normalizedAngle === 'front';

        if (isFrontView) {
          // FRONT PERSPECTIVE: 30° Reclined Incline Bench Press
          const benchTopY = centerY - 45;
          const benchBottomY = centerY + 65;

          // 30° Incline Backrest Pad
          ctx.fillStyle = 'rgba(255, 112, 67, 0.2)';
          ctx.strokeStyle = 'rgba(255, 112, 67, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(centerX - 36, benchTopY, 72, benchBottomY - benchTopY, 8);
          ctx.fill();
          ctx.stroke();

          // Torso & Head reclined on 30° pad
          const headX = centerX;
          const headY = benchTopY + 14;
          const shoulderX = centerX;
          const shoulderY = benchTopY + 44;
          const hipX = centerX;
          const hipY = benchBottomY - 12;

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

          // Incline Press trajectory (perpendicular to 30° chest, not straight overhead)
          const pressRange = 58;
          const handY = (shoulderY + 12) - (1 - t) * pressRange;

          if (isDumbbell) {
            // Horizontal Dumbbell Converging Incline Press
            const armSpread = 62 + t * 38; // wide at chest (t=1), converging (t=0)
            const handLeftX = shoulderX - armSpread;
            const handRightX = shoulderX + armSpread;

            const elbowLeftX = shoulderX - armSpread - (formMode === 'mistake' ? 22 : 6);
            const elbowLeftY = shoulderY + 28 - (1 - t) * (pressRange * 0.45);
            const elbowRightX = shoulderX + armSpread + (formMode === 'mistake' ? 22 : 6);
            const elbowRightY = shoulderY + 28 - (1 - t) * (pressRange * 0.45);

            // Arms
            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX - 18, shoulderY);
            ctx.lineTo(elbowLeftX, elbowLeftY);
            ctx.lineTo(handLeftX, handY);
            ctx.moveTo(shoulderX + 18, shoulderY);
            ctx.lineTo(elbowRightX, elbowRightY);
            ctx.lineTo(handRightX, handY);
            ctx.stroke();

            // Horizontal Dumbbells in each hand
            drawDumbbellHorizontal(ctx, handLeftX, handY, { isMistake: formMode === 'mistake', angle: (1 - t) * 0.15 });
            drawDumbbellHorizontal(ctx, handRightX, handY, { isMistake: formMode === 'mistake', angle: -(1 - t) * 0.15 });
          } else {
            // Barbell Incline Press
            const gripWidth = 85;
            const handLeftX = shoulderX - gripWidth;
            const handRightX = shoulderX + gripWidth;

            const elbowLeftX = handLeftX - (formMode === 'mistake' ? 25 : 8);
            const elbowLeftY = shoulderY + 26 - (1 - t) * (pressRange * 0.42);
            const elbowRightX = handRightX + (formMode === 'mistake' ? 25 : 8);
            const elbowRightY = shoulderY + 26 - (1 - t) * (pressRange * 0.42);

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX - 20, shoulderY);
            ctx.lineTo(elbowLeftX, elbowLeftY);
            ctx.lineTo(handLeftX, handY);
            ctx.moveTo(shoulderX + 20, shoulderY);
            ctx.lineTo(elbowRightX, elbowRightY);
            ctx.lineTo(handRightX, handY);
            ctx.stroke();

            drawBarbellFront(ctx, handLeftX - 35, handRightX + 35, handY, { isMistake: formMode === 'mistake' });
          }
        } else {
          // SIDE PERSPECTIVE: 30° Shallow Incline Bench Press (Slight downward angle)
          const benchBaseY = floorY;
          const seatX = centerX + 55;
          const seatY = centerY + 38;
          const seatFrontX = seatX + 35;
          const seatFrontY = seatY - 8;

          // Backrest Top: gentle 30° recline from horizontal
          const backrestTopX = centerX - 85;
          const backrestTopY = centerY - 16;

          // Floor Support Frame
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - 105, benchBaseY);
          ctx.lineTo(centerX + 90, benchBaseY);
          // Vertical seat support post
          ctx.moveTo(seatX, seatY);
          ctx.lineTo(seatX, benchBaseY);
          // Incline diagonal support strut under 30° pad
          ctx.moveTo((seatX + backrestTopX) / 2 + 5, (seatY + backrestTopY) / 2 + 2);
          ctx.lineTo(centerX - 35, benchBaseY);
          if (!isDumbbell) {
            // Barbell rack post
            ctx.moveTo(centerX - 95, benchBaseY);
            ctx.lineTo(centerX - 95, centerY - 60);
          }
          ctx.stroke();

          // Padded Bench Cushions (30° Shallow Incline Backrest + Seat Pad)
          ctx.strokeStyle = 'rgba(255, 112, 67, 0.75)';
          ctx.lineWidth = 9;
          ctx.beginPath();
          // Seat Pad
          ctx.moveTo(seatX - 5, seatY);
          ctx.lineTo(seatFrontX, seatFrontY);
          // Incline 30° Backrest Pad
          ctx.moveTo(seatX - 5, seatY);
          ctx.lineTo(backrestTopX, backrestTopY);
          ctx.stroke();

          // Athlete Skeleton resting on 30° Incline Bench
          const hipLift = formMode === 'mistake' ? 18 : 0;
          const hipX = seatX - 2;
          const hipY = seatY - 10 - hipLift;
          const kneeX = seatFrontX + 8;
          const kneeY = seatFrontY + 28;
          const footX = kneeX + 5;
          const footY = benchBaseY;

          const shoulderX = centerX - 30;
          const shoulderY = centerY + 2;
          const headX = backrestTopX + 16;
          const headY = backrestTopY - 6;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(footX, footY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(hipX, hipY);
          if (formMode === 'mistake') {
            ctx.quadraticCurveTo(hipX - 15, hipY - 25, shoulderX, shoulderY);
          } else {
            ctx.lineTo(shoulderX, shoulderY);
          }
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Press trajectory: Perpendicular to 30° inclined chest (to upper clavicle notch)
          const barLockoutX = shoulderX + 24;
          const barLockoutY = shoulderY - 60;
          const barTouchX = shoulderX + 10;
          const barTouchY = shoulderY + 8;

          const currentBarX = barLockoutX + t * (barTouchX - barLockoutX);
          const currentBarY = barLockoutY + t * (barTouchY - barLockoutY);

          const elbowFlare = formMode === 'mistake' ? -22 : 12;
          const elbowX = (shoulderX + currentBarX) / 2 + elbowFlare;
          const elbowY = Math.max(shoulderY + 14, (shoulderY + currentBarY) / 2 + (1 - t) * 10);

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(currentBarX, currentBarY);
          ctx.stroke();

          // Equipment Render: Horizontal Dumbbell vs Barbell
          if (isDumbbell) {
            drawDumbbellHorizontal(ctx, currentBarX, currentBarY, { isMistake: formMode === 'mistake', angle: (1 - t) * 0.12 });
          } else {
            drawBarbellSide(ctx, currentBarX, currentBarY, { isMistake: formMode === 'mistake' });
          }

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
          ctx.arc(currentBarX, currentBarY, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        const inclineElbowAngle = Math.round(75 + (1 - t) * 100);
        primaryAngleDeg = inclineElbowAngle;
        primaryAngleLabel = isDumbbell ? 'DUMBBELL INCLINE ANGLE' : 'INCLINE BARBELL ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: 90° Elbow Flare Impinging Rotator Cuff & Glutes Lifting Off Seat'
          : `✓ 30° Reclined Incline, Retracted Scapulae, Lower ${isDumbbell ? 'Dumbbells' : 'Bar'} to Clavicle with 45° Elbows`;
      }

      // =============================================================
      // 8B. FLAT BENCH PRESS (BARBELL VS DUMBBELL)
      // =============================================================
      else if (movementType === 'flat_bench') {
        const isFrontView = normalizedAngle === 'front';

        if (isFrontView) {
          const benchTopY = centerY - 45;
          const benchBottomY = centerY + 65;

          ctx.fillStyle = 'rgba(255, 112, 67, 0.2)';
          ctx.strokeStyle = 'rgba(255, 112, 67, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(centerX - 35, benchTopY, 70, benchBottomY - benchTopY, 8);
          ctx.fill();
          ctx.stroke();

          const headX = centerX;
          const headY = benchTopY + 14;
          const shoulderX = centerX;
          const shoulderY = benchTopY + 45;
          const hipX = centerX;
          const hipY = benchBottomY - 12;

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

          const pressRange = 72;
          const handY = (shoulderY + 6) - (1 - t) * pressRange;

          if (isDumbbell) {
            const armSpread = 54 + t * 42;
            const handLeftX = shoulderX - armSpread;
            const handRightX = shoulderX + armSpread;

            const elbowLeftX = shoulderX - armSpread - (formMode === 'mistake' ? 22 : 6);
            const elbowLeftY = shoulderY + 25 - (1 - t) * (pressRange * 0.48);
            const elbowRightX = shoulderX + armSpread + (formMode === 'mistake' ? 22 : 6);
            const elbowRightY = shoulderY + 25 - (1 - t) * (pressRange * 0.48);

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX - 18, shoulderY);
            ctx.lineTo(elbowLeftX, elbowLeftY);
            ctx.lineTo(handLeftX, handY);
            ctx.moveTo(shoulderX + 18, shoulderY);
            ctx.lineTo(elbowRightX, elbowRightY);
            ctx.lineTo(handRightX, handY);
            ctx.stroke();

            drawDumbbellHorizontal(ctx, handLeftX, handY, { isMistake: formMode === 'mistake', angle: (1 - t) * 0.18 });
            drawDumbbellHorizontal(ctx, handRightX, handY, { isMistake: formMode === 'mistake', angle: -(1 - t) * 0.18 });
          } else {
            const gripWidth = 88;
            const handLeftX = shoulderX - gripWidth;
            const handRightX = shoulderX + gripWidth;

            const elbowLeftX = handLeftX - (formMode === 'mistake' ? 26 : 8);
            const elbowLeftY = shoulderY + 24 - (1 - t) * (pressRange * 0.45);
            const elbowRightX = handRightX + (formMode === 'mistake' ? 26 : 8);
            const elbowRightY = shoulderY + 24 - (1 - t) * (pressRange * 0.45);

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX - 20, shoulderY);
            ctx.lineTo(elbowLeftX, elbowLeftY);
            ctx.lineTo(handLeftX, handY);
            ctx.moveTo(shoulderX + 20, shoulderY);
            ctx.lineTo(elbowRightX, elbowRightY);
            ctx.lineTo(handRightX, handY);
            ctx.stroke();

            drawBarbellFront(ctx, handLeftX - 35, handRightX + 35, handY, { isMistake: formMode === 'mistake' });
          }
        } else {
          // SIDE PERSPECTIVE: Flat Bench Press
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

          ctx.strokeStyle = armColor;
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

          if (isDumbbell) {
            drawDumbbellHorizontal(ctx, currentBarX, currentBarY, { isMistake: formMode === 'mistake' });
          } else {
            drawBarbellSide(ctx, currentBarX, currentBarY, { isMistake: formMode === 'mistake' });
          }
        }

        const elbowAngle = Math.round(75 + (1 - t) * 100);
        primaryAngleDeg = elbowAngle;
        primaryAngleLabel = isDumbbell ? 'DUMBBELL ELBOW ANGLE' : 'BARBELL ELBOW ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: 90° Elbow Flare Impinging Rotator Cuff & Butt Off Bench'
          : `✓ 45° Elbow Tuck, Retracted Scapulae, Smooth ${isDumbbell ? 'Converging Dumbbell' : 'Barbell J-Curve'} Trajectory`;
      }

      // =============================================================
      // 9. SQUAT
      // =============================================================
      else if (movementType === 'squat') {
        const isFrontView = normalizedAngle === 'front';

        if (isFrontView) {
          const barY = centerY - 60 + t * 65;
          const footLeftX = centerX - 45;
          const footRightX = centerX + 45;
          const footY = floorY;

          const kneeLeftX = footLeftX - (formMode === 'mistake' ? -15 : 20 * t);
          const kneeLeftY = footY - 70 + t * 25;
          const kneeRightX = footRightX + (formMode === 'mistake' ? -15 : 20 * t);
          const kneeRightY = footY - 70 + t * 25;

          const hipY = kneeLeftY - 65 + t * 50;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(footLeftX, footY);
          ctx.lineTo(kneeLeftX, kneeLeftY);
          ctx.lineTo(centerX - 12, hipY);
          ctx.lineTo(centerX, hipY - 75);
          ctx.moveTo(footRightX, footY);
          ctx.lineTo(kneeRightX, kneeRightY);
          ctx.lineTo(centerX + 12, hipY);
          ctx.lineTo(centerX, hipY - 75);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(centerX, hipY - 95, 14, 0, Math.PI * 2);
          ctx.fill();

          drawBarbellFront(ctx, centerX - 100, centerX + 100, barY, { isMistake: formMode === 'mistake' });
        } else {
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

          drawBarbellSide(ctx, barX, barY, { isMistake: formMode === 'mistake' });

          ctx.strokeStyle = armColor;
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
        }

        const kneeAngle = Math.round(180 - t * 92);
        primaryAngleDeg = kneeAngle;
        primaryAngleLabel = 'KNEE ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Knee Valgus Collapse & Excessive Forward Spine Flexion'
          : '✓ Hip Crease Below Knee Parallel, Knees Tracking Toes, Core Braced';
      }

      // =============================================================
      // 9B. 45-DEGREE SLED LEG PRESS (PROFESSIONAL 4-ANGLE MACHINE BIOMECHANICS)
      // =============================================================
      else if (movementType === 'leg_press') {
        const isFrontView = normalizedAngle === 'front';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isSideView = normalizedAngle === 'side' || (!isFrontView && !isRearView && !isIsoView);

        if (isFrontView) {
          // =========================================================
          // FRONT PERSPECTIVE: Bilateral Quad Tracking & Diamond Footplate
          // =========================================================
          const frameWidth = 190;
          const chassisTopY = centerY - 140;
          const chassisBotY = floorY;

          // Machine Frame Dual Guide Columns
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - frameWidth / 2, chassisTopY);
          ctx.lineTo(centerX - frameWidth / 2, chassisBotY);
          ctx.moveTo(centerX + frameWidth / 2, chassisTopY);
          ctx.lineTo(centerX + frameWidth / 2, chassisBotY);
          // Overhead Crossbeam & Base Crossbeam
          ctx.moveTo(centerX - frameWidth / 2 - 10, chassisTopY + 10);
          ctx.lineTo(centerX + frameWidth / 2 + 10, chassisTopY + 10);
          ctx.moveTo(centerX - frameWidth / 2 - 15, chassisBotY);
          ctx.lineTo(centerX + frameWidth / 2 + 15, chassisBotY);
          ctx.stroke();

          // Reclined Backrest Pad (Behind athlete)
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 42, centerY - 80, 84, 130, 8);
          ctx.fill();
          ctx.stroke();

          // Sled Platform Travel along vertical/incline line
          const sledTravelY = centerY - 15 + t * 50; // Descends toward athlete on flexion
          const footplateWidth = 120;

          // Diamond Footplate
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(centerX - footplateWidth / 2, sledTravelY - 14, footplateWidth, 28, 4);
          ctx.fill();
          ctx.stroke();

          // Diamond grip pattern lines on footplate
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
          ctx.lineWidth = 1;
          for (let gx = -45; gx <= 45; gx += 15) {
            ctx.beginPath();
            ctx.moveTo(centerX + gx - 10, sledTravelY - 10);
            ctx.lineTo(centerX + gx + 10, sledTravelY + 10);
            ctx.stroke();
          }

          // Olympic Plate Weight Horns on Sled Sides
          const leftHornX = centerX - footplateWidth / 2 - 8;
          const rightHornX = centerX + footplateWidth / 2 + 8;
          drawBarbellSide(ctx, leftHornX - 16, sledTravelY, { isMistake: formMode === 'mistake', plateColor: '#EF4444' });
          drawBarbellSide(ctx, rightHornX + 16, sledTravelY, { isMistake: formMode === 'mistake', plateColor: '#EF4444' });

          // Athlete Upper Body Seated
          const hipX = centerX;
          const hipY = centerY + 45;
          const shoulderX = centerX;
          const shoulderY = hipY - 75;
          const headX = centerX;
          const headY = shoulderY - 20;

          // Head & Torso
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // Side Grip Handles beside hips
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(hipX - 38, hipY - 15);
          ctx.lineTo(hipX - 38, hipY + 15);
          ctx.moveTo(hipX + 38, hipY - 15);
          ctx.lineTo(hipX + 38, hipY + 15);
          ctx.stroke();

          // Arms gripping side handles
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(hipX - 38, hipY);
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(hipX + 38, hipY);
          ctx.stroke();

          // Bilateral Lower Extremity (Quads & Knees)
          const footSpread = 32;
          const footLeftX = centerX - footSpread;
          const footRightX = centerX + footSpread;
          const footY = sledTravelY;

          // Knee Valgus check: good form keeps knees over 2nd toe; mistake collapses knees inward
          const kneeSpread = formMode === 'mistake' ? (20 - t * 12) : (38 + t * 14);
          const kneeLeftX = centerX - kneeSpread;
          const kneeRightX = centerX + kneeSpread;
          const kneeY = (hipY + footY) / 2 + (formMode === 'mistake' ? -5 : 4);

          // Legs
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          // Left Leg (Hip -> Knee -> Foot)
          ctx.moveTo(hipX - 12, hipY);
          ctx.lineTo(kneeLeftX, kneeY);
          ctx.lineTo(footLeftX, footY);
          // Right Leg (Hip -> Knee -> Foot)
          ctx.moveTo(hipX + 12, hipY);
          ctx.lineTo(kneeRightX, kneeY);
          ctx.lineTo(footRightX, footY);
          ctx.stroke();

          // Quad Contraction Overlay (Vastus Medialis & Lateralis)
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(hipX - 10, hipY - 4);
          ctx.lineTo(kneeLeftX, kneeY);
          ctx.moveTo(hipX + 10, hipY - 4);
          ctx.lineTo(kneeRightX, kneeY);
          ctx.stroke();

          // Joint Pivots
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(kneeLeftX, kneeY, 6, 0, Math.PI * 2);
          ctx.arc(kneeRightX, kneeY, 6, 0, Math.PI * 2);
          ctx.arc(footLeftX, footY, 5, 0, Math.PI * 2);
          ctx.arc(footRightX, footY, 5, 0, Math.PI * 2);
          ctx.arc(hipX - 12, hipY, 5, 0, Math.PI * 2);
          ctx.arc(hipX + 12, hipY, 5, 0, Math.PI * 2);
          ctx.fill();

        } else if (isRearView) {
          // =========================================================
          // REAR PERSPECTIVE: Posterior Spine Stability & Hip Alignment
          // =========================================================
          const chassisTopY = centerY - 140;
          const chassisBotY = floorY;

          // Machine Rear Frame Columns & Cross Braces
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - 80, chassisTopY);
          ctx.lineTo(centerX - 80, chassisBotY);
          ctx.moveTo(centerX + 80, chassisTopY);
          ctx.lineTo(centerX + 80, chassisBotY);
          ctx.moveTo(centerX - 95, chassisTopY + 15);
          ctx.lineTo(centerX + 95, chassisTopY + 15);
          ctx.moveTo(centerX - 95, chassisBotY);
          ctx.lineTo(centerX + 95, chassisBotY);
          // Diagonal Support X-Brace
          ctx.moveTo(centerX - 80, chassisTopY + 20);
          ctx.lineTo(centerX + 80, chassisBotY - 40);
          ctx.moveTo(centerX + 80, chassisTopY + 20);
          ctx.lineTo(centerX - 80, chassisBotY - 40);
          ctx.stroke();

          // Sled Platform pushing upward/forward
          const sledTravelY = centerY - 25 + t * 45;
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(centerX - 55, sledTravelY - 12, 110, 24, 4);
          ctx.fill();
          ctx.stroke();

          // Weight Horns on Flanks
          drawBarbellSide(ctx, centerX - 75, sledTravelY, { isMistake: formMode === 'mistake', plateColor: '#EF4444' });
          drawBarbellSide(ctx, centerX + 75, sledTravelY, { isMistake: formMode === 'mistake', plateColor: '#EF4444' });

          // Athlete Back firmly against backrest pad
          const hipX = centerX;
          const hipY = centerY + 45;
          const shoulderX = centerX;
          const shoulderY = hipY - 75;
          const headX = centerX;
          const headY = shoulderY - 20;

          // Backrest Pad
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 38, shoulderY - 10, 76, 120, 6);
          ctx.fill();
          ctx.stroke();

          // Posterior Spine Line
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // Head facing forward away from viewer
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Glute / Posterior Chain Highlight
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(hipX - 22, hipY + 8);
          ctx.lineTo(hipX + 22, hipY + 8);
          ctx.stroke();

        } else if (isIsoView) {
          // =========================================================
          // ISOMETRIC 3D PERSPECTIVE: 45° Rail Incline with Depth
          // =========================================================
          const originX = centerX - 80;
          const originY = floorY - 20;

          // 45° Incline Dual Tubular Steel Guide Rails
          const railLen = 190;
          const railAngle = -Math.PI / 4; // -45 degrees
          const dx = Math.cos(railAngle) * railLen;
          const dy = Math.sin(railAngle) * railLen;

          const rail1StartX = originX + 20;
          const rail1StartY = originY;
          const rail1EndX = rail1StartX + dx;
          const rail1EndY = rail1StartY + dy;

          const rail2StartX = originX - 10;
          const rail2StartY = originY + 15;
          const rail2EndX = rail2StartX + dx;
          const rail2EndY = rail2StartY + dy;

          // Chassis Base Frame
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(originX - 45, floorY);
          ctx.lineTo(rail1EndX + 20, floorY);
          ctx.moveTo(rail1EndX, rail1EndY);
          ctx.lineTo(rail1EndX, floorY);
          ctx.moveTo(rail2EndX, rail2EndY);
          ctx.lineTo(rail2EndX, floorY);
          // Dual Rails
          ctx.moveTo(rail1StartX, rail1StartY);
          ctx.lineTo(rail1EndX, rail1EndY);
          ctx.moveTo(rail2StartX, rail2StartY);
          ctx.lineTo(rail2EndX, rail2EndY);
          ctx.stroke();

          // Moving Sled along Rails
          const sledRatio = 0.75 - t * 0.40; // 0.75 at apex, 0.35 at inflection
          const sledX = rail1StartX + dx * sledRatio;
          const sledY = rail1StartY + dy * sledRatio;

          // Diamond Footplate (Angled 3D Plane)
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(sledX - 25, sledY - 25);
          ctx.lineTo(sledX + 15, sledY + 15);
          ctx.lineTo(sledX - 15, sledY + 35);
          ctx.lineTo(sledX - 55, sledY - 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Olympic Plate Horn & Plates on Sled
          drawBarbellSide(ctx, sledX + 18, sledY - 12, { isMistake: formMode === 'mistake', plateColor: '#EF4444' });

          // Reclined Backrest & Seat
          const seatBaseX = originX - 15;
          const seatBaseY = originY - 10;
          const backrestTopX = seatBaseX - 45;
          const backrestTopY = seatBaseY - 55;

          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(seatBaseX, seatBaseY);
          ctx.lineTo(backrestTopX, backrestTopY);
          ctx.lineTo(backrestTopX - 15, backrestTopY + 10);
          ctx.lineTo(seatBaseX - 15, seatBaseY + 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Athlete
          const hipX = seatBaseX - 8;
          const hipY = seatBaseY - 4;
          const shoulderX = backrestTopX + 5;
          const shoulderY = backrestTopY + 5;
          const headX = shoulderX - 10;
          const headY = shoulderY - 12;

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // Legs driving to footplate
          const footX = sledX - 15;
          const footY = sledY + 5;
          const kneeX = (hipX + footX) / 2 + (1 - t) * 12;
          const kneeY = (hipY + footY) / 2 - 25 - t * 8;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 5, 0, Math.PI * 2);
          ctx.arc(footX, footY, 4, 0, Math.PI * 2);
          ctx.arc(hipX, hipY, 5, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // =========================================================
          // SIDE PERSPECTIVE (PRIMARY / DEFAULT): Authentic 45° Sled & Reclined Athlete
          // =========================================================
          const frameBaseLeftX = centerX - 165;
          const frameBaseRightX = centerX + 135;
          const baseFloorY = floorY;

          // 1. Heavy Machine Chassis Base Runners along floor
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(frameBaseLeftX, baseFloorY);
          ctx.lineTo(frameBaseRightX, baseFloorY);
          // Rubber Floor Stabilizer Foot Pads
          ctx.moveTo(frameBaseLeftX, baseFloorY - 4);
          ctx.lineTo(frameBaseLeftX + 25, baseFloorY - 4);
          ctx.moveTo(frameBaseRightX - 25, baseFloorY - 4);
          ctx.lineTo(frameBaseRightX, baseFloorY - 4);
          ctx.stroke();

          // 2. 45-Degree Dual Heavy Steel Guide Rails
          const railBotX = centerX - 35;
          const railBotY = baseFloorY - 35;
          const railTopX = centerX + 115;
          const railTopY = baseFloorY - 185;

          // Dual parallel chrome guide rails
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(railBotX, railBotY);
          ctx.lineTo(railTopX, railTopY);
          ctx.moveTo(railBotX + 8, railBotY + 8);
          ctx.lineTo(railTopX + 8, railTopY + 8);
          ctx.stroke();

          // Heavy Frame Vertical/Diagonal Support Pillar under Upper Rail
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(railTopX, railTopY);
          ctx.lineTo(centerX + 95, baseFloorY);
          ctx.moveTo(railBotX, railBotY);
          ctx.lineTo(centerX - 45, baseFloorY);
          // Safety Stop Bumpers with Heavy Rubber Shock Absorbers
          ctx.moveTo(railTopX - 6, railTopY + 6);
          ctx.lineTo(railTopX + 12, railTopY - 12);
          ctx.stroke();

          // Safety Rack Locking Teeth along underside of rail
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 2;
          for (let step = 0; step < 7; step++) {
            const tx = railBotX + 15 + step * 18;
            const ty = railBotY - 15 - step * 18;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx + 6, ty + 6);
            ctx.stroke();
          }

          // 3. Reclined High-Density Seat & Backrest Frame
          const seatBaseX = centerX - 78;
          const seatBaseY = baseFloorY - 35;
          const seatFrontX = centerX - 42;
          const seatFrontY = baseFloorY - 32;
          const backrestTopX = centerX - 148;
          const backrestTopY = baseFloorY - 105;

          // Structural Backrest Steel Spine
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(centerX - 110, baseFloorY);
          ctx.lineTo(backrestTopX + 10, backrestTopY + 10);
          ctx.stroke();

          // Reclined Padded Backrest Cushion (45° Incline Angle)
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          // 45° Backrest Rectangle Cushion
          ctx.moveTo(seatBaseX, seatBaseY);
          ctx.lineTo(backrestTopX, backrestTopY);
          ctx.lineTo(backrestTopX - 10, backrestTopY + 10);
          ctx.lineTo(seatBaseX - 10, seatBaseY + 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Seat Bottom Cushion
          ctx.beginPath();
          ctx.moveTo(seatBaseX, seatBaseY);
          ctx.lineTo(seatFrontX, seatFrontY);
          ctx.lineTo(seatFrontX, seatFrontY + 12);
          ctx.lineTo(seatBaseX - 6, seatBaseY + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Headrest Pad at Top of Backrest
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(backrestTopX - 14, backrestTopY - 14, 22, 18, 4);
          ctx.fill();
          ctx.stroke();

          // Side Safety Handles & Release Lever beside Hips
          const handlePivotX = centerX - 72;
          const handlePivotY = baseFloorY - 40;
          const handleKnobX = centerX - 62;
          const handleKnobY = baseFloorY - 55;

          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(handlePivotX, handlePivotY);
          ctx.lineTo(handleKnobX, handleKnobY);
          ctx.stroke();

          // Knurled Yellow Grip Knob
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handleKnobX, handleKnobY, 5, 0, Math.PI * 2);
          ctx.fill();

          // 4. Moving Sled Carriage Kinematics along 45° Linear Rails
          // At apex extension (t = 0), sled is at top of stroke (distance = 125px from bottom)
          // At bottom inflection (t = 1), sled descends down to 90° knee depth (distance = 45px from bottom)
          const sledTravelOffset = (1 - t) * 65;
          const sledX = (railBotX + 40) + sledTravelOffset * Math.SQRT1_2;
          const sledY = (railBotY - 40) - sledTravelOffset * Math.SQRT1_2;

          // Sled Linear Bearing Sleeve encasing Rails
          ctx.fillStyle = '#475569';
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(sledX - 14, sledY - 14, 28, 28, 4);
          ctx.fill();
          ctx.stroke();

          // Heavy-Duty Diamond Footplate Platform (Perpendicular to 45° Rail Vector)
          const plateHalfLen = 28;
          const pTopX = sledX - plateHalfLen * Math.SQRT1_2;
          const pTopY = sledY - plateHalfLen * Math.SQRT1_2;
          const pBotX = sledX + plateHalfLen * Math.SQRT1_2;
          const pBotY = sledY + plateHalfLen * Math.SQRT1_2;

          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(pTopX, pTopY);
          ctx.lineTo(pBotX, pBotY);
          ctx.stroke();

          // Footplate Diamond Steel Grip Ribs
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pTopX + 2, pTopY + 2);
          ctx.lineTo(pBotX - 2, pBotY - 2);
          ctx.stroke();

          // Sled Weight Plate Horn & Dual 20KG Olympic Weight Plates
          const plateHornX = sledX + 16;
          const plateHornY = sledY - 16;

          // Outer 20KG Olympic Plate
          drawBarbellSide(ctx, plateHornX, plateHornY, { isMistake: formMode === 'mistake', plateColor: '#EF4444' });
          // Second Olympic Plate slightly behind for depth
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(plateHornX + 6, plateHornY - 6, 24, 0, Math.PI * 2);
          ctx.stroke();

          // 5. Athlete Biomechanics & Articulation
          // Pelvis / Butt:
          // Good Form: Butt glued firmly to seat backrest at (centerX - 75, baseFloorY - 42)
          // Mistake Form: Pelvis peels off backrest pad by 18px (butt wink / lumbar flexion danger)
          const pelvicLift = formMode === 'mistake' ? (t * 18) : 0;
          const hipX = (centerX - 75) + pelvicLift * 0.7;
          const hipY = (baseFloorY - 42) - pelvicLift * 0.7;

          // Torso & Head
          const shoulderX = centerX - 132;
          const shoulderY = baseFloorY - 96;
          const headX = centerX - 146;
          const headY = baseFloorY - 110;

          // Athlete Head resting on headrest
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Torso Spine Column
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          if (formMode === 'mistake' && t > 0.4) {
            // Lumbar Flexion / Butt Wink Rounding Warning Arc
            ctx.quadraticCurveTo(hipX - 10, hipY - 25, hipX, hipY);
          } else {
            ctx.lineTo(hipX, hipY);
          }
          ctx.stroke();

          // Arms: Shoulder -> Elbow -> Hand grasping side safety handle
          const handX = handleKnobX;
          const handY = handleKnobY;
          const elbowX = hipX - 12;
          const elbowY = hipY - 24;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX + 4, shoulderY + 8);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(handX, handY);
          ctx.stroke();

          // Feet planted firmly on diamond footplate
          const footX = sledX - 10;
          const footY = sledY - 10;

          // Knee Articulation:
          // In full extension (t = 0): Safe micro-bend knee angle (~175°).
          // In bottom inflection (t = 1): Perfect 90° knee angle.
          let kneeX, kneeY;
          if (formMode === 'mistake') {
            // Hyperextended at top (t=0) or collapsed
            const apexKneeOffsetX = (1 - t) * 14;
            kneeX = (hipX + footX) / 2 + 10 - apexKneeOffsetX;
            kneeY = (hipY + footY) / 2 - 28 - t * 24;
          } else {
            kneeX = (hipX + footX) / 2 + 12 - t * 4;
            kneeY = (hipY + footY) / 2 - 32 - t * 20;
          }

          // Lower Extremity Bones: Femur (Thigh) & Tibia (Shin)
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // Quadriceps Muscle Activation Highlight (Vastus Lateralis & Rectus Femoris)
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(hipX + 2, hipY - 6);
          ctx.lineTo(kneeX - 2, kneeY - 6);
          ctx.stroke();

          // Foot on plate
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(footX - 8, footY + 8);
          ctx.lineTo(footX + 8, footY - 8);
          ctx.stroke();

          // Joint Pivot Discs
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(kneeX, kneeY, 7, 0, Math.PI * 2);
          ctx.arc(footX, footY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowX, elbowY, 5, 0, Math.PI * 2);
          ctx.arc(handX, handY, 5, 0, Math.PI * 2);
          ctx.fill();

          // Visual Indicator of Pelvic Tilt Warning in Mistake Mode
          if (formMode === 'mistake' && t > 0.5) {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.fillText('⚠ BUTT WINK / LUMBAR PEELING', hipX - 60, hipY - 28);
          }
        }

        const kneeAngle = Math.round(175 - t * 85);
        primaryAngleDeg = kneeAngle;
        primaryAngleLabel = 'KNEE ANGLE (SLED 45°)';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Pelvis Peeling Off Backrest Pad & Violent Knee Hyperextension'
          : '✓ Pelvis Glued to Backrest, 90° Controlled Knee Flexion, Soft Lockout at Apex';
      }

      // =============================================================
      // 10. DEADLIFT
      // =============================================================
      else if (movementType === 'deadlift') {
        const isFrontView = normalizedAngle === 'front';

        if (isFrontView) {
          const barY = floorY - 15 - (1 - t) * 95;
          const footLeftX = centerX - 35;
          const footRightX = centerX + 35;
          const hipY = floorY - 120 + t * 40;
          const shoulderY = hipY - 75 + t * 20;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(footLeftX, floorY);
          ctx.lineTo(footLeftX - 5, floorY - 65);
          ctx.lineTo(centerX, hipY);
          ctx.moveTo(footRightX, floorY);
          ctx.lineTo(footRightX + 5, floorY - 65);
          ctx.lineTo(centerX, hipY);
          ctx.lineTo(centerX, shoulderY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(centerX, shoulderY - 18, 14, 0, Math.PI * 2);
          ctx.fill();

          const handLeftX = footLeftX - 18;
          const handRightX = footRightX + 18;
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(centerX - 18, shoulderY);
          ctx.lineTo(handLeftX, barY);
          ctx.moveTo(centerX + 18, shoulderY);
          ctx.lineTo(handRightX, barY);
          ctx.stroke();

          drawBarbellFront(ctx, handLeftX - 30, handRightX + 30, barY, { isMistake: formMode === 'mistake' });
        } else {
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
          const barY = floorY - 15 - (1 - t) * 95;

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

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(barX, barY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          drawBarbellSide(ctx, barX, barY, { isMistake: formMode === 'mistake' });

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(footX, footY, 5, 0, Math.PI * 2);
          ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(barX, barY, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        const hipAngle = Math.round(175 - t * 90);
        primaryAngleDeg = hipAngle;
        primaryAngleLabel = 'HIP HINGE ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Spinal Lumbar Flexion & Bar Drifting Away from Shins'
          : '✓ Neutral Spine, Bar Hugging Shins, Full Glute Lockout';
      }

      // =============================================================
      // 11A. WIDE-GRIP LAT PULLDOWN (PROFESSIONAL 4-ANGLE BIOMECHANICS)
      // =============================================================
      else if (movementType === 'lat_pulldown') {
        const isSideView = normalizedAngle === 'side';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isFrontView = normalizedAngle === 'front' || (!isSideView && !isRearView && !isIsoView);

        if (isFrontView || isRearView) {
          // =========================================================
          // FRONT & REAR PERSPECTIVE: Wide Symmetrical Lat Activation
          // =========================================================
          const machineTopY = centerY - 150;
          const seatY = centerY + 30;
          const thighPadY = seatY - 26;

          // Lat Pulldown Overhead Tower Frame
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          // Central Vertical Guide Column
          ctx.moveTo(centerX, machineTopY);
          ctx.lineTo(centerX, floorY);
          // Overhead Boom Crossbar
          ctx.moveTo(centerX - 95, machineTopY + 8);
          ctx.lineTo(centerX + 95, machineTopY + 8);
          // Seat Pad
          ctx.moveTo(centerX - 35, seatY);
          ctx.lineTo(centerX + 35, seatY);
          // Thigh Hold-Down Rollers (Padded)
          ctx.moveTo(centerX - 42, thighPadY);
          ctx.lineTo(centerX + 42, thighPadY);
          ctx.stroke();

          // Thigh Roller Pads
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(centerX - 44, thighPadY - 6, 36, 12, 4);
          ctx.roundRect(centerX + 8, thighPadY - 6, 36, 12, 4);
          ctx.fill();
          ctx.stroke();

          // Top Pulley Wheel
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(centerX, machineTopY + 8, 7, 0, Math.PI * 2);
          ctx.fill();

          // Seated Athlete Body
          const hipX = centerX;
          const hipY = seatY - 10;
          const shoulderX = centerX;
          const shoulderY = hipY - 72;
          const headX = centerX;
          const headY = shoulderY - 18;

          // Legs locked under thigh pads
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          // Left Leg
          ctx.moveTo(centerX - 24, floorY);
          ctx.lineTo(centerX - 24, thighPadY);
          ctx.lineTo(hipX - 10, hipY);
          // Right Leg
          ctx.moveTo(centerX + 24, floorY);
          ctx.lineTo(centerX + 24, thighPadY);
          ctx.lineTo(hipX + 10, hipY);
          // Torso
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Head (Facing front or facing away)
          ctx.fillStyle = isRearView ? '#64748B' : boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          if (isRearView) {
            // V-Taper Latissimus Dorsi Muscle Contraction Highlight in Rear View
            const latSpread = 16 + (1 - t) * 18;
            ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(shoulderX - latSpread, shoulderY + 12);
            ctx.lineTo(shoulderX - 4, hipY - 14);
            ctx.moveTo(shoulderX + latSpread, shoulderY + 12);
            ctx.lineTo(shoulderX + 4, hipY - 14);
            ctx.stroke();
          }

          // Wide Lat Pulldown Bar Trajectory
          const barTopY = machineTopY + 28;
          const barChestY = shoulderY + 6;
          const currentBarY = barTopY + t * (barChestY - barTopY);
          const barWidth = 160;

          // Central Steel Cable from top pulley to center of bar
          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(centerX, machineTopY + 8);
          ctx.lineTo(centerX, currentBarY);
          ctx.stroke();

          // Wide Lat Bar (Ergonomic contoured angled drop ends)
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.moveTo(centerX - barWidth / 2, currentBarY + 10);
          ctx.lineTo(centerX - barWidth / 2 + 20, currentBarY);
          ctx.lineTo(centerX + barWidth / 2 - 20, currentBarY);
          ctx.lineTo(centerX + barWidth / 2, currentBarY + 10);
          ctx.stroke();

          // Arms: Grip on outer angled handles -> Elbows driving downward
          const handLeftX = centerX - barWidth / 2 + 15;
          const handRightX = centerX + barWidth / 2 - 15;
          const handY = currentBarY + 3;

          const elbowSpread = (barWidth / 2) - 10 - t * 18;
          const elbowY = shoulderY + 12 + t * 24;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          // Left Arm
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(shoulderX - elbowSpread, elbowY);
          ctx.lineTo(handLeftX, handY);
          // Right Arm
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(shoulderX + elbowSpread, elbowY);
          ctx.lineTo(handRightX, handY);
          ctx.stroke();

          // Hands & Grip Nodes
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handLeftX, handY, 5.5, 0, Math.PI * 2);
          ctx.arc(handRightX, handY, 5.5, 0, Math.PI * 2);
          ctx.fill();

          // Joint Pivot Nodes
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(shoulderX - elbowSpread, elbowY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX + elbowSpread, elbowY, 5, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // =========================================================
          // SIDE & ISOMETRIC PERSPECTIVE: Sagittal Pull & Torso Angle
          // =========================================================
          const towerX = centerX - 45;
          const machineTopY = centerY - 150;
          const seatY = centerY + 32;
          const thighPadY = seatY - 26;

          // Lat Pulldown Side Frame & Overhead Boom
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          // Main Vertical Tower Post
          ctx.moveTo(towerX - 35, machineTopY);
          ctx.lineTo(towerX - 35, floorY);
          // Overhead Cantilever Boom over athlete
          ctx.moveTo(towerX - 35, machineTopY + 8);
          ctx.lineTo(centerX + 18, machineTopY + 8);
          // Seat Support
          ctx.moveTo(towerX - 35, seatY);
          ctx.lineTo(centerX + 25, seatY);
          // Floor base
          ctx.moveTo(towerX - 60, floorY);
          ctx.lineTo(centerX + 50, floorY);
          ctx.stroke();

          // Thigh Hold-Down Roller
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 4, thighPadY - 8, 24, 16, 6);
          ctx.fill();
          ctx.stroke();

          // Top Pulley
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(centerX + 16, machineTopY + 8, 7, 0, Math.PI * 2);
          ctx.fill();

          // Seated Lifter with fixed 10-15° thoracic arch
          const hipX = centerX - 12;
          const hipY = seatY - 10;
          const torsoLean = formMode === 'mistake' ? (-32 + t * 45) : -14;
          const shoulderX = hipX + torsoLean;
          const shoulderY = hipY - 72;
          const headX = shoulderX + 8;
          const headY = shoulderY - 18;

          // Legs
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(centerX + 18, floorY);
          ctx.lineTo(centerX + 14, thighPadY);
          ctx.lineTo(hipX, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Bar Path from overhead stretch to upper collarbone
          const barTopY = machineTopY + 30;
          const barChestY = shoulderY + 8;
          const currentBarY = barTopY + t * (barChestY - barTopY);
          const currentBarX = centerX + 16 - t * 6;

          // Cable
          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(centerX + 16, machineTopY + 8);
          ctx.lineTo(currentBarX, currentBarY);
          ctx.stroke();

          // Wide Bar Profile
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(currentBarX - 16, currentBarY - 2);
          ctx.lineTo(currentBarX + 16, currentBarY + 2);
          ctx.stroke();

          // Arms in Profile (Driving elbows down & back)
          const elbowFlare = formMode === 'mistake' ? 24 : -18;
          const elbowX = shoulderX + elbowFlare;
          const elbowY = shoulderY + 12 + t * 18;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(currentBarX, currentBarY);
          ctx.stroke();

          // Joint Pivot Nodes
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowX, elbowY, 5, 0, Math.PI * 2);
          ctx.arc(currentBarX, currentBarY, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        const pullAngle = Math.round(170 - t * 95);
        primaryAngleDeg = pullAngle;
        primaryAngleLabel = isFrontView ? 'FRONTAL LAT DEPRESSION' : (isRearView ? 'SCAPULAR RETRACTION' : 'TORSO INCLINE ANGLE');
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Severe Torso Rocking Momentum & Pulling Behind Neck'
          : `✓ ${isFrontView ? 'Front View: Pulling Wide Bar Symmetrically to Clavicle' : (isRearView ? 'Rear View: Driving Elbows Down, Full V-Taper Lat Squeeze' : 'Side View: Strict 10° Torso Arch, Elbows Leading Smoothly')}`;
      }

      // =============================================================
      // 11B. BENT-OVER BARBELL & DUMBBELL ROWS
      // =============================================================
      else if (movementType === 'barbell_row') {
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

        ctx.strokeStyle = armColor;
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

        if (isDumbbell) {
          drawDumbbellHorizontal(ctx, barX, barY, { isMistake: formMode === 'mistake' });
        } else {
          drawBarbellSide(ctx, barX, barY, { isMistake: formMode === 'mistake' });
        }

        const rowAngle = Math.round(165 - t * 95);
        primaryAngleDeg = rowAngle;
        primaryAngleLabel = 'ROW CONTRACTION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Standing Too Upright & Bouncing Torso'
          : `✓ 45° Torso Angle, Pulling ${isDumbbell ? 'Dumbbells' : 'Bar'} to Navel, Retracting Rhomboids`;
      }

      // =============================================================
      // 12. OVERHEAD PRESS & LATERAL RAISES
      // =============================================================
      else if (movementType === 'overhead_press' || movementType === 'lateral_raise') {
        const isLateral = movementType === 'lateral_raise';
        const isFrontView = normalizedAngle === 'front' || normalizedAngle === 'rear';
        const isRear = normalizedAngle === 'rear';

        if (isFrontView) {
          // FRONT & REAR PERSPECTIVE: Symmetrical Bilateral Press / Raise
          const footLeftX = centerX - 25;
          const footRightX = centerX + 25;
          const hipX = centerX;
          const hipY = floorY - 118;
          const shoulderX = centerX;
          const shoulderY = hipY - 76;
          const headX = centerX;
          const headY = shoulderY - 18;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(footLeftX, floorY);
          ctx.lineTo(hipX - 10, hipY);
          ctx.moveTo(footRightX, floorY);
          ctx.lineTo(hipX + 10, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.fillStyle = isRear ? '#64748B' : boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          if (isLateral) {
            const spread = 28 + t * 62;
            const handLeftX = shoulderX - spread;
            const handRightX = shoulderX + spread;
            const handY = shoulderY + 28 - t * 40;

            const elbowLeftX = shoulderX - (spread * 0.6) - 8;
            const elbowLeftY = shoulderY + 18 - t * 24;
            const elbowRightX = shoulderX + (spread * 0.6) + 8;
            const elbowRightY = shoulderY + 18 - t * 24;

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX - 18, shoulderY);
            ctx.lineTo(elbowLeftX, elbowLeftY);
            ctx.lineTo(handLeftX, handY);
            ctx.moveTo(shoulderX + 18, shoulderY);
            ctx.lineTo(elbowRightX, elbowRightY);
            ctx.lineTo(handRightX, handY);
            ctx.stroke();

            drawDumbbellHorizontal(ctx, handLeftX, handY, { isMistake: formMode === 'mistake' });
            drawDumbbellHorizontal(ctx, handRightX, handY, { isMistake: formMode === 'mistake' });

            primaryAngleDeg = Math.round(15 + t * 75);
            primaryAngleLabel = 'ABDUCTION ANGLE';
            mistakeDescription = formMode === 'mistake'
              ? '⚠ ERROR: Torso Momentum Swing & Shrugging Traps Into Neck'
              : '✓ Smooth Scapular Abduction to Parallel with Soft Elbows';
          } else {
            // Overhead Press (Front/Rear View)
            const pressTravel = t * 75;
            const handY = shoulderY + 14 - pressTravel;
            const gripWidth = isDumbbell ? 54 : 70;
            const handLeftX = shoulderX - gripWidth;
            const handRightX = shoulderX + gripWidth;

            const elbowSpread = gripWidth + (formMode === 'mistake' ? 22 : 4) - t * 10;
            const elbowY = shoulderY + 34 - (pressTravel * 0.6);

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX - 18, shoulderY);
            ctx.lineTo(shoulderX - elbowSpread, elbowY);
            ctx.lineTo(handLeftX, handY);
            ctx.moveTo(shoulderX + 18, shoulderY);
            ctx.lineTo(shoulderX + elbowSpread, elbowY);
            ctx.lineTo(handRightX, handY);
            ctx.stroke();

            if (isDumbbell) {
              drawDumbbellHorizontal(ctx, handLeftX, handY, { isMistake: formMode === 'mistake' });
              drawDumbbellHorizontal(ctx, handRightX, handY, { isMistake: formMode === 'mistake' });
            } else {
              drawBarbellFront(ctx, handLeftX - 35, handRightX + 35, handY, { isMistake: formMode === 'mistake' });
            }

            primaryAngleDeg = Math.round(80 + t * 95);
            primaryAngleLabel = isDumbbell ? 'DB SHOULDER PRESS' : 'BARBELL MILITARY PRESS';
            mistakeDescription = formMode === 'mistake'
              ? '⚠ ERROR: Uneven Press & Asymmetric Lockout'
              : `✓ Coronal Symmetry: Smooth Vertical ${isDumbbell ? 'Dumbbells' : 'Barbell'} Drive Over Crown`;
          }
        } else {
          // SIDE & ISOMETRIC PERSPECTIVE: Sagittal Bar Path & Spinal Neutrality
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
            const handX = shoulderX + Math.cos(armAngle) * armLen * 0.85;
            const handY = shoulderY - Math.sin(armAngle) * armLen + (formMode === 'mistake' ? -15 : 0);

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX, shoulderY);
            ctx.lineTo(handX, handY);
            ctx.stroke();

            drawDumbbellHorizontal(ctx, handX, handY, { isMistake: formMode === 'mistake' });

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

            ctx.strokeStyle = armColor;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(shoulderX, shoulderY);
            ctx.lineTo(elbowX, elbowY);
            ctx.lineTo(barX, barY);
            ctx.stroke();

            if (isDumbbell) {
              drawDumbbellHorizontal(ctx, barX, barY, { isMistake: formMode === 'mistake' });
            } else {
              drawBarbellSide(ctx, barX, barY, { isMistake: formMode === 'mistake' });
            }

            primaryAngleDeg = Math.round(80 + t * 95);
            primaryAngleLabel = isDumbbell ? 'DB SHOULDER PRESS' : 'BARBELL MILITARY PRESS';
            mistakeDescription = formMode === 'mistake'
              ? '⚠ ERROR: Lower Back Hyperextension & Pushing Forward'
              : `✓ Vertical ${isDumbbell ? 'Dumbbell' : 'Bar'} Path Clearing Nose, Glutes & Abs Clamped`;
          }
        }
      }

      // =============================================================
      // 13. BICEP CURLS
      // =============================================================
      else if (movementType === 'bicep_curl') {
        const isFrontView = normalizedAngle === 'front' || normalizedAngle === 'rear';
        const isRear = normalizedAngle === 'rear';

        if (isFrontView) {
          // FRONT / REAR VIEW: Symmetrical Bilateral Bicep Curls
          const footLeftX = centerX - 25;
          const footRightX = centerX + 25;
          const hipX = centerX;
          const hipY = floorY - 120;
          const shoulderX = centerX;
          const shoulderY = hipY - 76;
          const headX = centerX;
          const headY = shoulderY - 18;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(footLeftX, floorY);
          ctx.lineTo(hipX - 8, hipY);
          ctx.moveTo(footRightX, floorY);
          ctx.lineTo(hipX + 8, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          ctx.fillStyle = isRear ? '#64748B' : boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Pinned Elbows at sides
          const elbowLeftX = shoulderX - 32;
          const elbowRightX = shoulderX + 32;
          const elbowY = shoulderY + 44;

          const curlLift = t * 50;
          const handY = elbowY + 36 - curlLift;
          const handSpread = 32 + (1 - t) * 4;
          const handLeftX = shoulderX - handSpread;
          const handRightX = shoulderX + handSpread;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(elbowLeftX, elbowY);
          ctx.lineTo(handLeftX, handY);
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(elbowRightX, elbowY);
          ctx.lineTo(handRightX, handY);
          ctx.stroke();

          if (isDumbbell) {
            drawDumbbellHorizontal(ctx, handLeftX, handY, { isMistake: formMode === 'mistake' });
            drawDumbbellHorizontal(ctx, handRightX, handY, { isMistake: formMode === 'mistake' });
          } else {
            drawBarbellFront(ctx, handLeftX - 30, handRightX + 30, handY, { isMistake: formMode === 'mistake' });
          }

          primaryAngleDeg = Math.round(180 - t * 135);
          primaryAngleLabel = 'BICEPS FLEXION';
          mistakeDescription = formMode === 'mistake'
            ? '⚠ ERROR: Elbows Floating Forward & Torso Rocking'
            : `✓ Front View: Symmetrical Forearm Supination & Strict Peak ${isDumbbell ? 'Dumbbells' : 'Barbell'} Contraction`;
        } else {
          // SIDE & ISOMETRIC VIEW: Profile View with Elbow Pinned
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

          ctx.strokeStyle = armColor;
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

          if (isDumbbell) {
            drawDumbbellHorizontal(ctx, handX, handY, { isMistake: formMode === 'mistake', angle: handAngle - Math.PI / 2 });
          } else {
            drawBarbellSide(ctx, handX, handY, { isMistake: formMode === 'mistake' });
          }

          primaryAngleDeg = Math.round(180 - t * 135);
          primaryAngleLabel = 'BICEPS FLEXION';
          mistakeDescription = formMode === 'mistake'
            ? '⚠ ERROR: Elbows Floating Forward & Torso Rocking'
            : `✓ Side View: Pinned Elbows, Supinated Wrists, Full Peak ${isDumbbell ? 'Dumbbell' : 'Barbell'} Squeeze`;
        }
      }

      // =============================================================
      // 14. WALKING DUMBBELL LUNGES / SPLIT SQUATS (4-ANGLE BIOMECHANICS)
      // =============================================================
      else if (movementType === 'lunge') {
        const isFrontView = normalizedAngle === 'front';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isSideView = normalizedAngle === 'side' || (!isFrontView && !isRearView && !isIsoView);

        if (isFrontView) {
          // =========================================================
          // FRONT PERSPECTIVE: True Hip-Width Staggered Tracks & Pure Coronal Tracking
          // =========================================================
          // Hips drop vertically on lunge descent
          const hipStandY = floorY - 125;
          const hipLungeY = floorY - 76;
          const hipY = hipStandY + t * (hipLungeY - hipStandY);
          const hipX = centerX;

          // Upper Body: Torso & Head
          const shoulderX = centerX;
          const shoulderY = hipY - 74;
          const headX = centerX;
          const headY = shoulderY - 18;

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // Level Pelvis Bar (Hip-Width Base)
          const hipTrackWidth = 24;
          const leadHipX = centerX - hipTrackWidth;
          const trailHipX = centerX + hipTrackWidth;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(leadHipX, hipY);
          ctx.lineTo(trailHipX, hipY);
          ctx.stroke();

          // Stance Floor Tracks (Parallel train tracks for stability)
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(leadHipX, floorY);
          ctx.lineTo(leadHipX, floorY - 140);
          ctx.moveTo(trailHipX, floorY);
          ctx.lineTo(trailHipX, floorY - 140);
          ctx.stroke();
          ctx.setLineDash([]);

          // 1. REAR TRAILING LEG (Viewer Right Track)
          // Trailing femur drops vertically down; knee hovers 1 inch off floor at t = 1
          const trailKneeStandY = (hipStandY + floorY) / 2;
          const trailKneeLungeY = floorY - 14;
          const trailKneeY = trailKneeStandY + t * (trailKneeLungeY - trailKneeStandY);
          const trailFootX = trailHipX;
          const trailFootY = floorY;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(trailHipX, hipY);
          ctx.lineTo(trailHipX, trailKneeY);
          ctx.lineTo(trailFootX, trailFootY);
          ctx.stroke();

          // Rear Toe Contact
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(trailFootX - 6, trailFootY - 4);
          ctx.lineTo(trailFootX + 6, trailFootY);
          ctx.stroke();

          // 2. FRONT LEAD LEG (Viewer Left Track)
          // Front knee bends down in pure coronal alignment over 2nd toe; shin remains vertical
          const leadFootX = leadHipX;
          const leadFootY = floorY;
          const leadKneeStandY = (hipStandY + floorY) / 2;
          const leadKneeLungeY = floorY - 58;
          const leadKneeY = leadKneeStandY + t * (leadKneeLungeY - leadKneeStandY);

          // Valgus fault check: in mistake mode, front knee collapses inward
          const leadKneeX = formMode === 'mistake' ? (leadHipX + t * 18) : leadHipX;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(leadHipX, hipY);
          ctx.lineTo(leadKneeX, leadKneeY);
          ctx.lineTo(leadFootX, leadFootY);
          ctx.stroke();

          // Lead Front Foot (Flat on floor)
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(leadFootX - 12, leadFootY);
          ctx.lineTo(leadFootX + 12, leadFootY);
          ctx.stroke();

          // Active Lead Quadriceps Contraction Highlight
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(leadHipX, hipY - 2);
          ctx.lineTo(leadKneeX, leadKneeY - 2);
          ctx.stroke();

          // 3. DUAL DUMBBELLS (Hanging symmetrically outside hips)
          const armLeftX = leadHipX - 26;
          const armRightX = trailHipX + 26;
          const handY = hipY + 18;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(armLeftX, shoulderY + 36);
          ctx.lineTo(armLeftX, handY);
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(armRightX, shoulderY + 36);
          ctx.lineTo(armRightX, handY);
          ctx.stroke();

          drawDumbbellHorizontal(ctx, armLeftX, handY, { isMistake: formMode === 'mistake' });
          drawDumbbellHorizontal(ctx, armRightX, handY, { isMistake: formMode === 'mistake' });

          // Joint Pivot Nodes
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(leadHipX, hipY, 5, 0, Math.PI * 2);
          ctx.arc(leadKneeX, leadKneeY, 6, 0, Math.PI * 2);
          ctx.arc(leadFootX, leadFootY, 5, 0, Math.PI * 2);
          ctx.arc(trailHipX, hipY, 5, 0, Math.PI * 2);
          ctx.arc(trailHipX, trailKneeY, 5, 0, Math.PI * 2);
          ctx.arc(trailFootX, trailFootY, 4, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.fill();

          if (formMode === 'mistake') {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ KNEE VALGUS COLLAPSE (MEDIAL BUCKLE)', leadKneeX, leadKneeY - 14);
          }

        } else if (isRearView) {
          // =========================================================
          // REAR PERSPECTIVE: Posterior Spinal Neutrality & Glute Contraction
          // =========================================================
          const hipStandY = floorY - 125;
          const hipLungeY = floorY - 76;
          const hipY = hipStandY + t * (hipLungeY - hipStandY);
          const hipX = centerX;
          const shoulderX = centerX;
          const shoulderY = hipY - 74;
          const headX = centerX;
          const headY = shoulderY - 18;

          // Head facing away
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Posterior Spine Column
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // Pelvis
          const hipTrackWidth = 24;
          const leadHipX = centerX - hipTrackWidth;
          const trailHipX = centerX + hipTrackWidth;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(leadHipX, hipY);
          ctx.lineTo(trailHipX, hipY);
          ctx.stroke();

          // Glute Max Contraction on lead leg
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(leadHipX - 8, hipY + 4);
          ctx.lineTo(leadHipX + 8, hipY + 8);
          ctx.stroke();

          // Legs
          const trailKneeStandY = (hipStandY + floorY) / 2;
          const trailKneeLungeY = floorY - 14;
          const trailKneeY = trailKneeStandY + t * (trailKneeLungeY - trailKneeStandY);

          const leadKneeStandY = (hipStandY + floorY) / 2;
          const leadKneeLungeY = floorY - 58;
          const leadKneeY = leadKneeStandY + t * (leadKneeLungeY - leadKneeStandY);

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          // Lead Leg (Left)
          ctx.moveTo(leadHipX, hipY);
          ctx.lineTo(leadHipX, leadKneeY);
          ctx.lineTo(leadHipX, floorY);
          // Trail Leg (Right)
          ctx.moveTo(trailHipX, hipY);
          ctx.lineTo(trailHipX, trailKneeY);
          ctx.lineTo(trailHipX, floorY);
          ctx.stroke();

          // Dumbbells
          const armLeftX = leadHipX - 26;
          const armRightX = trailHipX + 26;
          const handY = hipY + 18;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(armLeftX, handY);
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(armRightX, handY);
          ctx.stroke();

          drawDumbbellHorizontal(ctx, armLeftX, handY, { isMistake: formMode === 'mistake' });
          drawDumbbellHorizontal(ctx, armRightX, handY, { isMistake: formMode === 'mistake' });

        } else if (isIsoView) {
          // =========================================================
          // ISOMETRIC 3D PERSPECTIVE: Clear Spatial 3D Box Lunge Depth
          // =========================================================
          const hipStandY = floorY - 125;
          const hipLungeY = floorY - 76;
          const hipY = hipStandY + t * (hipLungeY - hipStandY);
          const hipX = centerX - 10;
          const shoulderX = hipX + 4;
          const shoulderY = hipY - 74;
          const headX = shoulderX + 6;
          const headY = shoulderY - 18;

          // Head & Torso
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // 3D Staggered Box Stride
          const leadFootX = centerX + 52;
          const leadFootY = floorY - 6;
          const trailFootX = centerX - 62;
          const trailFootY = floorY + 8;

          // Front Knee (90° vertical shin)
          const leadKneeX = leadFootX - 4 + (formMode === 'mistake' ? 22 : 0);
          const leadKneeY = floorY - 58 + (1 - t) * 45;

          // Rear Knee (90° hovering 1 inch off floor)
          const trailKneeX = hipX - 10;
          const trailKneeY = floorY - 14 + (1 - t) * 55;

          // Rear Leg (Background depth)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(hipX - 12, hipY);
          ctx.lineTo(trailKneeX, trailKneeY);
          ctx.lineTo(trailFootX, trailFootY);
          ctx.stroke();

          // Lead Leg (Foreground)
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX + 12, hipY);
          ctx.lineTo(leadKneeX, leadKneeY);
          ctx.lineTo(leadFootX, leadFootY);
          ctx.stroke();

          // Dual Dumbbells in 3D perspective
          const handLeadX = hipX + 16;
          const handLeadY = hipY + 18;
          const handTrailX = hipX - 16;
          const handTrailY = hipY + 14;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX + 6, shoulderY);
          ctx.lineTo(handLeadX, handLeadY);
          ctx.moveTo(shoulderX - 6, shoulderY);
          ctx.lineTo(handTrailX, handTrailY);
          ctx.stroke();

          drawDumbbellHorizontal(ctx, handTrailX, handTrailY, { isMistake: formMode === 'mistake' });
          drawDumbbellHorizontal(ctx, handLeadX, handLeadY, { isMistake: formMode === 'mistake' });

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(leadKneeX, leadKneeY, 6, 0, Math.PI * 2);
          ctx.arc(leadFootX, leadFootY, 5, 0, Math.PI * 2);
          ctx.arc(trailKneeX, trailKneeY, 5, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // =========================================================
          // SIDE PERSPECTIVE (PRIMARY / DEFAULT): Textbook Double 90° Box Lunge
          // =========================================================
          const baseFloorY = floorY;
          const leadFootX = centerX + 50;
          const trailFootX = centerX - 60;

          // Walking Stride Ground Track & Footprint Markers
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(centerX - 130, baseFloorY + 2);
          ctx.lineTo(centerX + 130, baseFloorY + 2);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.beginPath();
          ctx.ellipse(leadFootX, baseFloorY + 2, 15, 4, 0, 0, Math.PI * 2);
          ctx.ellipse(trailFootX, baseFloorY + 2, 10, 3, 0, 0, Math.PI * 2);
          ctx.fill();

          // Hip Height Trajectory: Drops straight down during eccentric descent (t = 1)
          const hipStandY = baseFloorY - 128;
          const hipLungeY = baseFloorY - 76;
          const hipY = hipStandY + t * (hipLungeY - hipStandY);
          const hipX = centerX - 5;

          // Torso & Head: Tall upright spine perpendicular to floor
          const trunkLean = formMode === 'mistake' ? (t * 22) : 0;
          const shoulderX = hipX + 2 + trunkLean;
          const shoulderY = hipY - 74;
          const headX = shoulderX + 4;
          const headY = shoulderY - 18;

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          if (formMode === 'mistake' && t > 0.4) {
            ctx.quadraticCurveTo(hipX + 8, hipY - 35, hipX, hipY);
          } else {
            ctx.lineTo(hipX, hipY);
          }
          ctx.stroke();

          // 1. REAR TRAILING LEG: Drops vertically down; knee hovers 1 inch off floor at 90°
          const trailKneeStandX = hipX - 16;
          const trailKneeStandY = baseFloorY - 65;
          const trailKneeLungeX = hipX; // Directly under hip (pure vertical rear femur)
          const trailKneeLungeY = baseFloorY - 14; // Hovers 1 inch off floor

          const trailKneeX = trailKneeStandX + t * (trailKneeLungeX - trailKneeStandX);
          const trailKneeY = trailKneeStandY + t * (trailKneeLungeY - trailKneeStandY);
          const trailFootY = baseFloorY;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(hipX - 6, hipY);
          ctx.lineTo(trailKneeX, trailKneeY);
          ctx.lineTo(trailFootX, trailFootY);
          ctx.stroke();

          // Rear Foot planted on ball of toes
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(trailFootX - 6, trailFootY - 6);
          ctx.lineTo(trailFootX + 8, trailFootY);
          ctx.stroke();

          // 2. FRONT LEAD LEG: Pure vertical shin stack at 90° knee angle
          let leadKneeX, leadKneeY, leadFootPlantY;
          if (formMode === 'mistake') {
            const kneeShearPastToes = t * 36;
            leadKneeX = leadFootX + kneeShearPastToes;
            leadKneeY = baseFloorY - 65 + t * 15;
            leadFootPlantY = baseFloorY - (t * 14); // Heel lifts
          } else {
            // Textbook vertical shin: knee directly over ankle
            leadKneeX = leadFootX;
            leadKneeY = baseFloorY - 60;
            leadFootPlantY = baseFloorY;
          }

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX + 6, hipY);
          ctx.lineTo(leadKneeX, leadKneeY);
          ctx.lineTo(leadFootX, leadFootPlantY);
          ctx.stroke();

          // Front Foot flat on floor
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(leadFootX - 14, leadFootPlantY);
          ctx.lineTo(leadFootX + 14, leadFootPlantY);
          ctx.stroke();

          // Visual Double 90-Degree Right-Angle Guides (When in deep lunge t > 0.6)
          if (formMode !== 'mistake' && t > 0.6) {
            ctx.save();
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 1.5;
            // Front Knee 90° Square Box
            ctx.strokeRect(leadKneeX - 10, leadKneeY + 2, 10, 10);
            ctx.fillStyle = '#38BDF8';
            ctx.font = 'bold 8px Outfit, sans-serif';
            ctx.fillText('90° SHIN', leadKneeX + 6, leadKneeY + 8);

            // Rear Knee 90° Square Box
            ctx.strokeRect(trailKneeX - 2, trailKneeY - 12, 10, 10);
            ctx.fillText('90° HOVER 1"', trailKneeX - 45, trailKneeY - 4);
            ctx.restore();
          }

          // Muscle Contraction Highlights (Quads & Glutes)
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(hipX + 8, hipY - 6);
          ctx.lineTo(leadKneeX - 2, leadKneeY - 6);
          ctx.moveTo(hipX - 4, hipY + 2);
          ctx.lineTo(hipX + 12, hipY + 8);
          ctx.stroke();

          // 3. DUAL ARMS & DUMBBELLS
          const armX = hipX + 2 + trunkLean * 0.5;
          const handY = hipY + 20;

          // Far Arm & Dumbbell
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 4, shoulderY + 6);
          ctx.lineTo(armX - 6, shoulderY + 38);
          ctx.lineTo(armX - 6, handY - 4);
          ctx.stroke();
          drawDumbbellHorizontal(ctx, armX - 6, handY - 4, { isMistake: formMode === 'mistake' });

          // Near Arm & Dumbbell
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX + 4, shoulderY + 6);
          ctx.lineTo(armX + 6, shoulderY + 38);
          ctx.lineTo(armX + 6, handY);
          ctx.stroke();
          drawDumbbellHorizontal(ctx, armX + 6, handY, { isMistake: formMode === 'mistake' });

          // Joint Pivots
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(leadKneeX, leadKneeY, 7, 0, Math.PI * 2);
          ctx.arc(leadFootX, leadFootPlantY, 5, 0, Math.PI * 2);
          ctx.arc(trailKneeX, trailKneeY, 6, 0, Math.PI * 2);
          ctx.arc(trailFootX, trailFootY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.fill();

          if (formMode === 'mistake' && t > 0.4) {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('⚠ KNEE SHEAR PAST TOES & HEEL LIFT', leadKneeX - 35, leadKneeY - 16);
          }
        }

        const leadKneeAngle = Math.round(170 - t * 80);
        primaryAngleDeg = leadKneeAngle;
        primaryAngleLabel = 'LEAD KNEE ANGLE (90°/90°)';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Short Stride Shearing Front Knee Past Toes & Front Heel Lifting'
          : '✓ 90° Front Knee & 90° Rear Knee (Hover 1" Off Floor), Vertical Front Shin, Upright Torso';
      }

      // =============================================================
      // 14B. LYING HAMSTRING LEG CURL (PROFESSIONAL 4-ANGLE MACHINE BIOMECHANICS)
      // =============================================================
      else if (movementType === 'hamstring_curl') {
        const isFrontView = normalizedAngle === 'front';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isSideView = normalizedAngle === 'side' || (!isFrontView && !isRearView && !isIsoView);

        if (isFrontView) {
          // =========================================================
          // FRONT PERSPECTIVE: Prone View from Machine Head with Symmetrical Heel Curl
          // =========================================================
          const benchTopY = centerY + 10;
          const benchWidth = 90;

          // Machine Base Frame & Weight Stack Tower on Side
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          // Front Support Column
          ctx.moveTo(centerX, benchTopY + 20);
          ctx.lineTo(centerX, floorY);
          // Floor base runner
          ctx.moveTo(centerX - 110, floorY);
          ctx.lineTo(centerX + 110, floorY);
          // Side Weight Stack Column (Left flank)
          ctx.moveTo(centerX - 95, centerY - 120);
          ctx.lineTo(centerX - 95, floorY);
          ctx.moveTo(centerX - 115, floorY);
          ctx.lineTo(centerX - 75, floorY);
          ctx.stroke();

          // Prone Bench Pad (Viewed from front)
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(centerX - benchWidth / 2, benchTopY - 10, benchWidth, 40, 8);
          ctx.fill();
          ctx.stroke();

          // Front Hand Support Grip Handles (Below head)
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 38, benchTopY + 12);
          ctx.lineTo(centerX - 38, benchTopY + 36);
          ctx.moveTo(centerX + 38, benchTopY + 12);
          ctx.lineTo(centerX + 38, benchTopY + 36);
          ctx.stroke();

          // Athlete Prone Torso & Head
          const headX = centerX;
          const headY = benchTopY - 18;
          const shoulderX = centerX;
          const shoulderY = benchTopY;

          // Head resting face down/neutral
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Torso on pad
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(centerX, benchTopY + 10);
          ctx.stroke();

          // Arms gripping front handles
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(centerX - 38, benchTopY + 22);
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(centerX + 38, benchTopY + 22);
          ctx.stroke();

          // Symmetrical Leg Curl Lever & Roller Pad (Rising behind body as t increases)
          const rollerY = (benchTopY + 15) - t * 65;
          const rollerWidth = 100;

          // Lever arms swinging up
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 42, benchTopY + 15);
          ctx.lineTo(centerX - 42, rollerY);
          ctx.moveTo(centerX + 42, benchTopY + 15);
          ctx.lineTo(centerX + 42, rollerY);
          ctx.stroke();

          // Cushioned Roller Pad across calves
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(centerX - rollerWidth / 2, rollerY - 10, rollerWidth, 20, 6);
          ctx.fill();
          ctx.stroke();

          // Bilateral Lower Legs curled behind
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          // Left Leg
          ctx.moveTo(centerX - 20, benchTopY + 15);
          ctx.lineTo(centerX - 20, rollerY);
          // Right Leg
          ctx.moveTo(centerX + 20, benchTopY + 15);
          ctx.lineTo(centerX + 20, rollerY);
          ctx.stroke();

          // Hamstring Peak Squeeze Glow
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 24, benchTopY + 5);
          ctx.lineTo(centerX - 24, rollerY + 5);
          ctx.moveTo(centerX + 24, benchTopY + 5);
          ctx.lineTo(centerX + 24, rollerY + 5);
          ctx.stroke();

          // Joint Pivot Nodes
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(centerX - 20, rollerY, 5, 0, Math.PI * 2);
          ctx.arc(centerX + 20, rollerY, 5, 0, Math.PI * 2);
          ctx.arc(centerX - 38, benchTopY + 22, 4, 0, Math.PI * 2);
          ctx.arc(centerX + 38, benchTopY + 22, 4, 0, Math.PI * 2);
          ctx.fill();

        } else if (isRearView) {
          // =========================================================
          // REAR PERSPECTIVE: Direct Posterior View of Bilateral Hamstrings
          // =========================================================
          const benchTopY = centerY + 15;
          const rollerY = (benchTopY + 10) - t * 70;
          const rollerWidth = 110;

          // Machine Rear Frame Columns
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - 60, benchTopY);
          ctx.lineTo(centerX - 60, floorY);
          ctx.moveTo(centerX + 60, benchTopY);
          ctx.lineTo(centerX + 60, floorY);
          ctx.moveTo(centerX - 80, floorY);
          ctx.lineTo(centerX + 80, floorY);
          ctx.stroke();

          // Bench Pad Surface
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(centerX - 50, benchTopY - 12, 100, 24, 6);
          ctx.fill();
          ctx.stroke();

          // Moving Roller Pad across heels
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(centerX - rollerWidth / 2, rollerY - 10, rollerWidth, 20, 6);
          ctx.fill();
          ctx.stroke();

          // Bilateral Lower Legs curling upward
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(centerX - 22, benchTopY);
          ctx.lineTo(centerX - 22, rollerY);
          ctx.moveTo(centerX + 22, benchTopY);
          ctx.lineTo(centerX + 22, rollerY);
          ctx.stroke();

          // Posterior Biceps Femoris / Hamstring Contraction Highlight
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(centerX - 24, benchTopY - 4);
          ctx.lineTo(centerX - 24, rollerY + 4);
          ctx.moveTo(centerX + 24, benchTopY - 4);
          ctx.lineTo(centerX + 24, rollerY + 4);
          ctx.stroke();

          // Feet / Soles of shoes
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 30, rollerY - 12);
          ctx.lineTo(centerX - 14, rollerY - 12);
          ctx.moveTo(centerX + 14, rollerY - 12);
          ctx.lineTo(centerX + 30, rollerY - 12);
          ctx.stroke();

          // Rotating Cam Disc on Machine Axis
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.arc(centerX - 58, benchTopY, 12, 0, Math.PI * 2);
          ctx.arc(centerX + 58, benchTopY, 12, 0, Math.PI * 2);
          ctx.fill();

        } else if (isIsoView) {
          // =========================================================
          // ISOMETRIC 3D PERSPECTIVE: Spatial Apparatus & Cam Motion
          // =========================================================
          const originX = centerX - 50;
          const originY = centerY + 15;

          // 3D Angled Prone Bench
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(originX - 90, originY - 15);
          ctx.lineTo(originX + 60, originY);
          ctx.lineTo(originX + 45, originY + 20);
          ctx.lineTo(originX - 105, originY + 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Frame Legs
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(originX - 90, originY - 15);
          ctx.lineTo(originX - 90, floorY);
          ctx.moveTo(originX + 60, originY);
          ctx.lineTo(originX + 60, floorY);
          ctx.stroke();

          // Prone Athlete
          const headX = originX - 95;
          const headY = originY - 26;
          const hipX = originX;
          const hipY = originY - 6;
          const kneeX = originX + 50;
          const kneeY = originY;

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(headX + 8, headY + 8);
          ctx.lineTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.stroke();

          // 3D Curled Roller Position
          const curlRad = 0.15 + t * 2.0;
          const leverLen = 65;
          const rollerX = kneeX - Math.cos(curlRad) * (leverLen * 0.7);
          const rollerY = kneeY - Math.sin(curlRad) * (leverLen * 0.9);

          // Lower leg curling
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(kneeX, kneeY);
          ctx.lineTo(rollerX, rollerY);
          ctx.stroke();

          // Roller Pad Cylinder
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(rollerX, rollerY, 14, 8, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 5, 0, Math.PI * 2);
          ctx.arc(rollerX, rollerY, 4, 0, Math.PI * 2);
          ctx.arc(hipX, hipY, 5, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // =========================================================
          // SIDE PERSPECTIVE (PRIMARY / DEFAULT): Authentic Lying Leg Curl Machine & Prone Biomechanics
          // =========================================================
          const baseFloorY = floorY;
          const benchBaseY = baseFloorY - 68;

          // 1. Heavy Gym Machine Base Chassis
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - 165, baseFloorY);
          ctx.lineTo(centerX + 135, baseFloorY);
          // Rubber Foot Pads
          ctx.moveTo(centerX - 165, baseFloorY - 4);
          ctx.lineTo(centerX - 140, baseFloorY - 4);
          ctx.moveTo(centerX + 110, baseFloorY - 4);
          ctx.lineTo(centerX + 135, baseFloorY - 4);
          ctx.stroke();

          // 2. Weight Stack Tower Column on Left
          const towerLeftX = centerX - 160;
          const towerTopY = centerY - 130;
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(towerLeftX, towerTopY);
          ctx.lineTo(towerLeftX, baseFloorY);
          ctx.moveTo(towerLeftX + 24, towerTopY);
          ctx.lineTo(towerLeftX + 24, baseFloorY);
          ctx.moveTo(towerLeftX - 10, towerTopY);
          ctx.lineTo(towerLeftX + 34, towerTopY);
          ctx.stroke();

          // Weight Stack Plates
          ctx.fillStyle = '#334155';
          for (let p = 0; p < 7; p++) {
            const py = baseFloorY - 20 - p * 11;
            ctx.fillRect(towerLeftX + 2, py, 20, 9);
          }

          // 3. Angled Prone Bench Frame (15° Hip Angle Decompression)
          const benchFrontX = centerX - 140;
          const benchHipApexX = centerX - 42;
          const benchKneeX = centerX + 24;

          const benchApexY = benchBaseY - 8;
          const benchFrontY = benchBaseY + 6;
          const benchKneeY = benchBaseY;

          // Bench Steel Structural Posts
          ctx.strokeStyle = machineColor;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(benchFrontX + 25, benchFrontY);
          ctx.lineTo(benchFrontX + 25, baseFloorY);
          ctx.moveTo(benchHipApexX, benchApexY);
          ctx.lineTo(benchHipApexX, baseFloorY);
          ctx.moveTo(benchKneeX - 10, benchKneeY);
          ctx.lineTo(benchKneeX - 10, baseFloorY);
          ctx.stroke();

          // Angled High-Density Prone Bench Pads
          ctx.fillStyle = '#1E293B';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;

          // Torso Pad (Angled down toward front)
          ctx.beginPath();
          ctx.moveTo(benchFrontX, benchFrontY);
          ctx.lineTo(benchHipApexX, benchApexY);
          ctx.lineTo(benchHipApexX, benchApexY + 12);
          ctx.lineTo(benchFrontX, benchFrontY + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Thigh Pad (Angled down toward knee pivot)
          ctx.beginPath();
          ctx.moveTo(benchHipApexX, benchApexY);
          ctx.lineTo(benchKneeX, benchKneeY);
          ctx.lineTo(benchKneeX, benchKneeY + 12);
          ctx.lineTo(benchHipApexX, benchApexY + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Front Support Handles for Pelvic Lock
          const handleX = benchFrontX - 6;
          const handleY = benchFrontY + 18;
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(benchFrontX + 8, benchFrontY + 4);
          ctx.lineTo(handleX, handleY);
          ctx.stroke();

          // Knurled Yellow Grip Knob
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(handleX, handleY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // 4. Machine Knee Axis Pivot & Rotating Lever Cam
          const pivotX = benchKneeX + 4;
          const pivotY = benchKneeY + 2;

          // Machine Pivot Axis Housing
          ctx.fillStyle = '#0F172A';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(pivotX, pivotY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Steel Cable from Cam to Weight Stack
          ctx.strokeStyle = cableColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY - 10);
          ctx.lineTo(towerLeftX + 24, towerTopY + 20);
          ctx.stroke();

          // 5. Lever Arm & Cushioned Roller Pad Kinematics
          const curlAngleRad = 0.12 + t * 2.15;
          const leverLen = 78;
          const rollerX = pivotX + Math.cos(curlAngleRad) * leverLen;
          const rollerY = pivotY - Math.sin(curlAngleRad) * leverLen;

          // Steel Lever Arm
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY);
          ctx.lineTo(rollerX, rollerY);
          ctx.stroke();

          // Cushioned Roller Pad (Resting on back of lower calves / Achilles)
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(rollerX, rollerY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FACC15';
          ctx.beginPath();
          ctx.arc(rollerX, rollerY, 4, 0, Math.PI * 2);
          ctx.fill();

          // 6. Athlete Prone Biomechanics & Muscle Articulation
          const pelvicLift = formMode === 'mistake' ? (t * 18) : 0;
          const hipX = benchHipApexX;
          const hipY = (benchApexY - 4) - pelvicLift;

          // Torso & Head
          const shoulderX = benchFrontX + 20;
          const shoulderY = benchFrontY - 2;
          const headX = benchFrontX - 8;
          const headY = benchFrontY - 14;

          // Head resting in neutral alignment
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Torso / Spine
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          if (formMode === 'mistake' && t > 0.4) {
            ctx.quadraticCurveTo(hipX - 15, hipY + 12, hipX, hipY);
          } else {
            ctx.lineTo(hipX, hipY);
          }
          ctx.stroke();

          // Arms: Shoulder down to hand gripping front support handle
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(shoulderX - 10, shoulderY + 14);
          ctx.lineTo(handleX, handleY);
          ctx.stroke();

          // Thigh (Femur): Hip to Knee at machine pivot
          const kneeX = pivotX;
          const kneeY = pivotY;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.stroke();

          // Lower Leg (Tibia): Knee to Ankle / Foot underneath roller pad
          const ankleX = rollerX;
          const ankleY = rollerY;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(kneeX, kneeY);
          ctx.lineTo(ankleX, ankleY);
          ctx.stroke();

          // Foot pointing with plantar flexion
          const footAngle = curlAngleRad + Math.PI / 2;
          const toeX = ankleX + Math.cos(footAngle) * 16;
          const toeY = ankleY - Math.sin(footAngle) * 16;

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(ankleX, ankleY);
          ctx.lineTo(toeX, toeY);
          ctx.stroke();

          // Hamstring Muscle Contraction Highlight (Biceps Femoris & Semitendinosus)
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(hipX + 2, hipY - 6);
          ctx.lineTo(kneeX - 4, kneeY - 6);
          ctx.stroke();

          // Visual Arc Guide for Knee Flexion (When curling)
          if (formMode !== 'mistake' && t > 0.4) {
            ctx.save();
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(pivotX, pivotY, leverLen, 0.1, curlAngleRad);
            ctx.stroke();
            ctx.fillStyle = '#38BDF8';
            ctx.font = 'bold 8px Outfit, sans-serif';
            ctx.fillText('PEAK HAMSTRING SQUEEZE', rollerX - 45, rollerY - 14);
            ctx.restore();
          }

          // Joint Pivot Discs
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(kneeX, kneeY, 7, 0, Math.PI * 2);
          ctx.arc(ankleX, ankleY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(handleX, handleY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Visual Warning for Mistake Mode
          if (formMode === 'mistake' && t > 0.4) {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ BUTT & HIPS LIFTING OFF BENCH (LUMBAR ARCH)', hipX, hipY - 22);
          }
        }

        const kneeAngle = Math.round(170 - t * 125);
        primaryAngleDeg = kneeAngle;
        primaryAngleLabel = 'HAMSTRING CURL ANGLE';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Pelvis Peeling Off Bench & Lower Back Hyperextending to Cheat Weight'
          : '✓ Pelvis Glued to Bench, Knees Aligned with Pivot Axis, Strict 1s Peak Hamstring Squeeze';
      }

      // =============================================================
      // 14C. AB WHEEL ROLLOUT (PROFESSIONAL 4-ANGLE ANTI-EXTENSION BIOMECHANICS)
      // =============================================================
      else if (movementType === 'ab_wheel') {
        const isFrontView = normalizedAngle === 'front';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isSideView = normalizedAngle === 'side' || (!isFrontView && !isRearView && !isIsoView);

        if (isFrontView) {
          // =========================================================
          // FRONT PERSPECTIVE: Coronal View of Rolling Wheel & Symmetric Core Brace
          // =========================================================
          const matY = floorY;

          // Kneeling Mat under knees
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 48, matY - 6, 96, 12, 4);
          ctx.fill();
          ctx.stroke();

          // Torso height drops forward as wheel rolls toward viewer
          const torsoDropY = floorY - 65 + t * 32;
          const shoulderX = centerX;
          const shoulderY = torsoDropY - 30;
          const headX = centerX;
          const headY = shoulderY - 18;

          // Knees on Mat (Left & Right)
          const kneeLeftX = centerX - 22;
          const kneeRightX = centerX + 22;

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(kneeLeftX, matY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.moveTo(kneeRightX, matY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Head facing front
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Rolling Ab Wheel Apparatus (Growing in perspective as it rolls toward camera)
          const wheelRadius = 16 + t * 8;
          const wheelY = floorY - wheelRadius;
          const wheelX = centerX;
          const handleSpan = 38 + t * 14;

          // Ab Wheel Central Tire (Tread & Rim)
          ctx.fillStyle = '#0F172A';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner Wheel Rim Spoke Pattern
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(wheelX, wheelY, wheelRadius * 0.55, 0, Math.PI * 2);
          ctx.stroke();

          // Wheel Axle & Side Handles
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(wheelX - handleSpan, wheelY);
          ctx.lineTo(wheelX + handleSpan, wheelY);
          ctx.stroke();

          // Knurled Rubber Grip End Caps
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(wheelX - handleSpan, wheelY, 4.5, 0, Math.PI * 2);
          ctx.arc(wheelX + handleSpan, wheelY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Arms extending from shoulders down to wheel handles
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 18, shoulderY);
          ctx.lineTo(wheelX - handleSpan + 8, wheelY);
          ctx.moveTo(shoulderX + 18, shoulderY);
          ctx.lineTo(wheelX + handleSpan - 8, wheelY);
          ctx.stroke();

          // Active Core / Rectus Abdominis Muscle Contraction Glow
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - 10, shoulderY + 8);
          ctx.lineTo(centerX - 10, matY - 14);
          ctx.moveTo(centerX + 10, shoulderY + 8);
          ctx.lineTo(centerX + 10, matY - 14);
          ctx.stroke();

          // Joint Pivot Nodes
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(shoulderX - 18, shoulderY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX + 18, shoulderY, 5, 0, Math.PI * 2);
          ctx.arc(wheelX - handleSpan + 8, wheelY, 4, 0, Math.PI * 2);
          ctx.arc(wheelX + handleSpan - 8, wheelY, 4, 0, Math.PI * 2);
          ctx.fill();

        } else if (isRearView) {
          // =========================================================
          // REAR PERSPECTIVE: Posterior Spinal Alignment & Latissimus Dorsi Tie-In
          // =========================================================
          const matY = floorY;

          // Knee Mat
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(centerX - 45, matY - 6, 90, 12, 4);
          ctx.fill();
          ctx.stroke();

          // Knees planted on mat
          const kneeLeftX = centerX - 20;
          const kneeRightX = centerX + 20;

          // Pelvis / Glute Tuck (Posterior Pelvic Tilt)
          const hipY = floorY - 45 - (1 - t) * 30;
          const hipX = centerX;

          // Spine extending forward away from camera
          const shoulderY = floorY - 25 - (1 - t) * 45;
          const shoulderX = centerX;
          const headX = centerX;
          const headY = shoulderY - 16;

          // Legs: Knees on mat, feet flat behind
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(kneeLeftX, matY);
          ctx.lineTo(hipX - 14, hipY);
          ctx.moveTo(kneeRightX, matY);
          ctx.lineTo(hipX + 14, hipY);
          ctx.stroke();

          // Posterior Spine Line
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Head facing away
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Lats / Scapular Depressor Contraction Highlights
          const latSpread = 16 + t * 8;
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(shoulderX - latSpread, shoulderY + 4);
          ctx.lineTo(hipX - 6, hipY - 6);
          ctx.moveTo(shoulderX + latSpread, shoulderY + 4);
          ctx.lineTo(hipX + 6, hipY - 6);
          ctx.stroke();

          // Arms extending forward to wheel
          const wheelY = floorY - 14;
          const wheelLeftX = centerX - 28;
          const wheelRightX = centerX + 28;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX - 16, shoulderY);
          ctx.lineTo(wheelLeftX, wheelY);
          ctx.moveTo(shoulderX + 16, shoulderY);
          ctx.lineTo(wheelRightX, wheelY);
          ctx.stroke();

        } else if (isIsoView) {
          // =========================================================
          // ISOMETRIC 3D PERSPECTIVE: 3D Rollout Vector & Depth
          // =========================================================
          const matX = centerX - 85;
          const matY = floorY;

          // 3D Kneeling Mat
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(matX - 25, matY - 4);
          ctx.lineTo(matX + 25, matY - 4);
          ctx.lineTo(matX + 15, matY + 6);
          ctx.lineTo(matX - 35, matY + 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Knees on Mat
          const kneeX = matX;
          const kneeY = matY - 4;

          // Rollout Travel Vector in 3D
          const startWheelX = matX + 45;
          const endWheelX = centerX + 85;
          const currentWheelX = startWheelX + t * (endWheelX - startWheelX);
          const currentWheelY = floorY - 12;

          // Hips & Spine
          const hipX = kneeX + 18 + t * 38;
          const hipY = floorY - 55 + t * 32;

          const shoulderX = hipX + 32 + t * 36;
          const shoulderY = floorY - 48 + t * 26;

          const headX = shoulderX + 10;
          const headY = shoulderY - 12;

          // Head & Torso
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(kneeX, kneeY);
          ctx.lineTo(hipX, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Arms to wheel
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(currentWheelX, currentWheelY);
          ctx.stroke();

          // 3D Ab Wheel
          ctx.fillStyle = '#0F172A';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(currentWheelX, currentWheelY, 14, 8, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 5, 0, Math.PI * 2);
          ctx.arc(hipX, hipY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 5, 0, Math.PI * 2);
          ctx.arc(currentWheelX, currentWheelY, 4, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // =========================================================
          // SIDE PERSPECTIVE (PRIMARY / DEFAULT): Anti-Extension Hollow Body & Wheel Rollout
          // =========================================================
          const baseFloorY = floorY;

          // 1. Floor Extension Distance Guide (Ruler Markers)
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(centerX - 130, baseFloorY + 2);
          ctx.lineTo(centerX + 130, baseFloorY + 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // 2. Kneeling Foam Mat on Floor
          const matStartX = centerX - 120;
          const matEndX = centerX - 45;
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(matStartX, baseFloorY - 6, matEndX - matStartX, 10, 4);
          ctx.fill();
          ctx.stroke();

          // 3. Kneeling Stance Anchors
          const kneeX = centerX - 75;
          const kneeY = baseFloorY - 6;
          const footX = kneeX - 38;
          const footY = baseFloorY;

          // Lower Leg / Shin flat on mat
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(footX, footY);
          ctx.lineTo(kneeX, kneeY);
          ctx.stroke();

          // Feet / Toes pointed back
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(footX - 8, footY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // 4. Wheel Rollout Kinematics along Floor
          const wheelStartX = centerX - 10;
          const wheelEndX = centerX + 95;
          const wheelX = wheelStartX + t * (wheelEndX - wheelStartX);
          const wheelRadius = 15;
          const wheelY = baseFloorY - wheelRadius;

          // Dynamic Rolling Spokes Animation based on roll position
          const rollRotation = (wheelX - wheelStartX) * 0.15;

          // Ab Wheel Outer Rubber Tire
          ctx.fillStyle = '#0F172A';
          ctx.strokeStyle = '#FACC15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Wheel Hub Center
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.arc(wheelX, wheelY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Rotating Wheel Spokes
          ctx.save();
          ctx.translate(wheelX, wheelY);
          ctx.rotate(rollRotation);
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
          ctx.lineWidth = 1.5;
          for (let sp = 0; sp < 4; sp++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, wheelRadius - 2);
            ctx.stroke();
          }
          ctx.restore();

          // Side Handle Knurled Bar
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(wheelX, wheelY, 3, 0, Math.PI * 2);
          ctx.fill();

          // 5. Athlete Biomechanics: Hollow-Body Plank vs Lumbar Sagging
          const hipStartX = kneeX + 22;
          const hipStartY = baseFloorY - 58;
          const hipEndX = kneeX + 62;
          const hipEndY = formMode === 'mistake' ? (baseFloorY - 12) : (baseFloorY - 26);

          const hipX = hipStartX + t * (hipEndX - hipStartX);
          const hipY = hipStartY + t * (hipEndY - hipStartY);

          const shoulderStartX = wheelStartX + 2;
          const shoulderStartY = baseFloorY - 60;
          const shoulderEndX = hipEndX + 45;
          const shoulderEndY = baseFloorY - 26;

          const shoulderX = shoulderStartX + t * (shoulderEndX - shoulderStartX);
          const shoulderY = shoulderStartY + t * (shoulderEndY - shoulderStartY);

          // Head Trajectory
          const headX = shoulderX - 4 + t * 14;
          const headY = shoulderY - 16;

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Thigh (Femur): Knee to Hip
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(kneeX, kneeY);
          ctx.lineTo(hipX, hipY);
          ctx.stroke();

          // Torso / Spine
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          if (formMode === 'mistake' && t > 0.3) {
            ctx.quadraticCurveTo((hipX + shoulderX) / 2, baseFloorY - 6, shoulderX, shoulderY);
          } else {
            ctx.lineTo(shoulderX, shoulderY);
          }
          ctx.stroke();

          // Arms: Shoulder straight to wheel handle
          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(wheelX, wheelY);
          ctx.stroke();

          // Active Core / Rectus Abdominis Muscle Highlight
          ctx.strokeStyle = formMode === 'mistake' ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(hipX + 2, hipY - 6);
          ctx.lineTo(shoulderX - 4, shoulderY - 6);
          ctx.stroke();

          // Joint Pivot Discs
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(wheelX, wheelY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Visual Indicator of Core Lock vs Lumbar Sag
          if (formMode === 'mistake' && t > 0.4) {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ LUMBAR SAG / CORE COLLAPSE', (hipX + shoulderX) / 2, baseFloorY - 2);
          } else if (t > 0.6) {
            ctx.fillStyle = '#38BDF8';
            ctx.font = 'bold 8px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✓ HOLLOW-BODY CORE BRACE', (hipX + shoulderX) / 2, hipY - 14);
          }
        }

        const hipExtensionAngle = Math.round(80 + t * 95);
        primaryAngleDeg = hipExtensionAngle;
        primaryAngleLabel = 'HIP EXTENSION (ANTI-EXTENSION)';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Lower Back Sagging / Lumbar Hyperextension & Over-Reaching'
          : '✓ Posterior Pelvic Tilt, Locked Hollow-Body Plank, Strong Abdominal Pullback';
      }

      // =============================================================
      // 15. FACE PULL
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

        const leadFootX = centerX - 25;
        const rearFootX = centerX - 65;
        const hipX = centerX - 40;
        const hipY = floorY - 110;

        const shoulderX = hipX - 5;
        const shoulderY = hipY - 65;
        const headX = shoulderX + 4;
        const headY = shoulderY - 18;

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

        ctx.strokeStyle = armColor;
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
      // 16. SHRUGS
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

        ctx.strokeStyle = armColor;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        if (isDumbbell) {
          drawDumbbellHorizontal(ctx, handX, handY, { isMistake: formMode === 'mistake' });
        } else {
          drawBarbellSide(ctx, handX, handY, { isMistake: formMode === 'mistake' });
        }

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

        ctx.strokeStyle = armColor;
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
      // 20. RUSSIAN PLATE TWIST / ROTATIONAL CORE OBLIQUES
      // =============================================================
      else if (movementType === 'russian_twist') {
        const isSideView = normalizedAngle === 'side';
        const isRearView = normalizedAngle === 'rear';
        const isIsoView = normalizedAngle === 'isometric';
        const isFrontView = normalizedAngle === 'front' || (!isSideView && !isRearView && !isIsoView);

        // Sinusoidal rotation cycle: -1.0 (full left) -> 0 (center) -> +1.0 (full right)
        const rot = Math.sin(cycleProgress * Math.PI * 2);
        const absRot = Math.abs(rot);

        // Base Exercise Mat on floor
        const matY = floorY - 6;

        if (isSideView) {
          // =========================================================
          // SIDE PERSPECTIVE: Sagittal V-Sit, 45° Torso Lean, Elevated Shins
          // =========================================================
          ctx.fillStyle = '#1E1B4B';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(centerX - 120, matY - 4, 240, 10, 4);
          } else {
            ctx.rect(centerX - 120, matY - 4, 240, 10);
          }
          ctx.fill();
          ctx.stroke();

          // Glute Base
          const hipX = centerX - 25;
          const hipY = matY - 8;

          // Torso Lean (Correct 45° straight spine vs Mistake kyphotic slouch)
          const isMistake = formMode === 'mistake';
          const shoulderLeanX = isMistake ? -48 : -68;
          const shoulderLeanY = isMistake ? -65 : -78;

          const shoulderX = hipX + shoulderLeanX;
          const shoulderY = hipY + shoulderLeanY;
          const headX = shoulderX - 12;
          const headY = shoulderY - 18;

          // Legs: Thigh to Knee to Elevated Feet (V-Sit)
          const kneeX = hipX + 55;
          const kneeY = hipY - 50;
          const footX = kneeX + 42;
          const footY = isMistake ? (matY - 2) : (hipY - 25); // In mistake mode, feet dropped on mat

          // Draw Legs
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // Draw Spine
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          if (isMistake) {
            // Kyphotic slouching curve
            ctx.quadraticCurveTo(hipX - 25, hipY - 35, shoulderX, shoulderY);
          } else {
            // Rigid 45° posture
            ctx.lineTo(shoulderX, shoulderY);
          }
          ctx.stroke();

          // Head
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Active Abdominal / Core Glow line
          ctx.strokeStyle = isMistake ? '#EF4444' : '#FF7043';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(hipX + 2, hipY - 6);
          ctx.lineTo(shoulderX + 4, shoulderY + 4);
          ctx.stroke();

          // Hand / Arm & Plate Trajectory (Depth Oscillation)
          const plateX = hipX + (rot > 0 ? (rot * 24) : (rot * 32));
          const plateY = hipY - 18 + absRot * 14;

          const elbowX = (shoulderX + plateX) / 2 + 10;
          const elbowY = (shoulderY + plateY) / 2 - 8;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(plateX, plateY);
          ctx.stroke();

          // Weight Plate (Side-Profile Elliptical Disc)
          drawWeightPlateDisc(ctx, plateX, plateY, {
            isMistake,
            angle: rot * 0.35,
            size: 0.95 + rot * 0.15,
            weightText: '10KG'
          });

          // Joints
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
          ctx.arc(footX, footY, 5, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(elbowX, elbowY, 5, 0, Math.PI * 2);
          ctx.arc(plateX, plateY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Form Annotations
          if (isMistake) {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ FEET GROUNDED & LOWER BACK SLOUCH', centerX, matY - 70);
          } else {
            ctx.fillStyle = '#38BDF8';
            ctx.font = 'bold 8.5px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✓ 45° V-SIT & HOVERING HEELS', centerX, matY - 70);
          }
        }

        else if (isRearView) {
          // =========================================================
          // REAR PERSPECTIVE: Posterior Spinal Rotation, Rear Obliques & Lats
          // =========================================================
          ctx.fillStyle = '#1E1B4B';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(centerX - 100, matY - 6, 200, 14, 5);
          } else {
            ctx.rect(centerX - 100, matY - 6, 200, 14);
          }
          ctx.fill();
          ctx.stroke();

          const hipX = centerX;
          const hipY = matY - 22;

          const isMistake = formMode === 'mistake';
          const thoracicRot = isMistake ? (rot * 0.1) : (rot * 0.65);

          const chestY = hipY - 68;
          const shoulderSpan = 44;
          const leftShoulderX = hipX - Math.cos(thoracicRot) * shoulderSpan + (isMistake ? 0 : rot * 10);
          const leftShoulderY = chestY + (isMistake ? 0 : rot * 8);
          const rightShoulderX = hipX + Math.cos(thoracicRot) * shoulderSpan + (isMistake ? 0 : rot * 10);
          const rightShoulderY = chestY - (isMistake ? 0 : rot * 8);

          const headX = hipX + (isMistake ? 0 : rot * 8);
          const headY = chestY - 24;

          // Feet elevated ahead
          const leftKneeX = hipX - 26;
          const leftKneeY = hipY - 45;
          const rightKneeX = hipX + 26;
          const rightKneeY = hipY - 45;

          const leftFootX = leftKneeX - 10;
          const leftFootY = isMistake ? matY : (leftKneeY + 18);
          const rightFootX = rightKneeX + 10;
          const rightFootY = isMistake ? matY : (rightKneeY + 18);

          // Draw Lower Legs in background
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(hipX - 10, hipY);
          ctx.lineTo(leftKneeX, leftKneeY);
          ctx.lineTo(leftFootX, leftFootY);
          ctx.moveTo(hipX + 10, hipY);
          ctx.lineTo(rightKneeX, rightKneeY);
          ctx.lineTo(rightFootX, rightFootY);
          ctx.stroke();

          // Spinal Column
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo((leftShoulderX + rightShoulderX) / 2, (leftShoulderY + rightShoulderY) / 2);
          ctx.stroke();

          // Scapula / Shoulder Girdle Line
          ctx.beginPath();
          ctx.moveTo(leftShoulderX, leftShoulderY);
          ctx.lineTo(rightShoulderX, rightShoulderY);
          ctx.stroke();

          // Head (Occipital view)
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Contracting Rear Oblique / Erector Spinae Glow
          if (!isMistake && absRot > 0.25) {
            ctx.strokeStyle = '#FF7043';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            if (rot > 0) {
              // Right torso flank squeeze
              ctx.moveTo(hipX + 6, hipY - 4);
              ctx.lineTo(rightShoulderX - 6, rightShoulderY + 8);
            } else {
              // Left torso flank squeeze
              ctx.moveTo(hipX - 6, hipY - 4);
              ctx.lineTo(leftShoulderX + 6, leftShoulderY + 8);
            }
            ctx.stroke();
          }

          // Arms & Plate
          const plateX = hipX + rot * 72;
          const plateY = hipY - 14 + absRot * 16;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(leftShoulderX, leftShoulderY);
          ctx.lineTo(plateX - 10, plateY);
          ctx.moveTo(rightShoulderX, rightShoulderY);
          ctx.lineTo(plateX + 10, plateY);
          ctx.stroke();

          drawWeightPlateDisc(ctx, plateX, plateY, {
            isMistake,
            angle: rot * 0.4,
            size: 0.95,
            weightText: '10KG'
          });

          // Joints
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(leftShoulderX, leftShoulderY, 6, 0, Math.PI * 2);
          ctx.arc(rightShoulderX, rightShoulderY, 6, 0, Math.PI * 2);
          ctx.arc(plateX, plateY, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        else if (isIsoView) {
          // =========================================================
          // ISOMETRIC PERSPECTIVE: 3D Angled Matrix V-Sit & Dynamic Torso Arc
          // =========================================================
          ctx.save();
          // Isometric Mat Platform
          ctx.fillStyle = '#1E1B4B';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(centerX - 110, matY + 12);
          ctx.lineTo(centerX - 20, matY - 20);
          ctx.lineTo(centerX + 110, matY - 10);
          ctx.lineTo(centerX + 20, matY + 22);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          const hipX = centerX - 10;
          const hipY = matY - 12;

          const isMistake = formMode === 'mistake';
          const thoracicRot = isMistake ? (rot * 0.1) : (rot * 0.65);

          const shoulderX = hipX - 40 + (isMistake ? 0 : rot * 12);
          const shoulderY = hipY - 65 + (isMistake ? 0 : rot * 8);
          const headX = shoulderX - 10;
          const headY = shoulderY - 18;

          const kneeX = hipX + 45;
          const kneeY = hipY - 42;
          const footX = kneeX + 35;
          const footY = isMistake ? matY : (kneeY + 14);

          // Skeleton
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(shoulderX, shoulderY);
          ctx.stroke();

          // Head
          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // Plate Sweep
          const plateX = hipX + rot * 65;
          const plateY = hipY - 12 + absRot * 18;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(plateX, plateY);
          ctx.stroke();

          drawWeightPlateDisc(ctx, plateX, plateY, {
            isMistake,
            angle: rot * 0.45,
            size: 0.95,
            weightText: '10KG'
          });

          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(kneeX, kneeY, 6, 0, Math.PI * 2);
          ctx.arc(shoulderX, shoulderY, 6, 0, Math.PI * 2);
          ctx.arc(plateX, plateY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        else {
          // =========================================================
          // FRONT PERSPECTIVE (RECOMMENDED): Bilateral V-Sit, Full Oblique Rotation
          // =========================================================
          // 1. Sleek Studio Floor Mat
          ctx.fillStyle = '#1E1B4B';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(centerX - 110, matY - 6, 220, 16, 6);
          } else {
            ctx.rect(centerX - 110, matY - 6, 220, 16);
          }
          ctx.fill();
          ctx.stroke();

          // Mat Brand Stencil
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.font = 'bold 8px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('SMARTFIT CORE ZONE', centerX, matY + 6);

          // 2. Glute / Pelvic Anchor
          const hipX = centerX;
          const hipY = matY - 26;

          const isMistake = formMode === 'mistake';

          // 3. Lower Body: V-Sit Hovering Knees & Elevated Feet
          const leftKneeX = centerX - 38;
          const leftKneeY = matY - 62;
          const rightKneeX = centerX + 38;
          const rightKneeY = matY - 62;

          const leftFootX = centerX - 20;
          const leftFootY = isMistake ? (matY - 2) : (matY - 36);
          const rightFootX = centerX + 20;
          const rightFootY = isMistake ? (matY - 2) : (matY - 36);

          // Draw Thighs & Shins (Femur / Tibia)
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          // Left Leg
          ctx.moveTo(hipX - 10, hipY);
          ctx.lineTo(leftKneeX, leftKneeY);
          ctx.lineTo(leftFootX, leftFootY);
          // Right Leg
          ctx.moveTo(hipX + 10, hipY);
          ctx.lineTo(rightKneeX, rightKneeY);
          ctx.lineTo(rightFootX, rightFootY);
          ctx.stroke();

          // Feet Discs
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(leftFootX, leftFootY, 5, 0, Math.PI * 2);
          ctx.arc(rightFootX, rightFootY, 5, 0, Math.PI * 2);
          ctx.arc(leftKneeX, leftKneeY, 6, 0, Math.PI * 2);
          ctx.arc(rightKneeX, rightKneeY, 6, 0, Math.PI * 2);
          ctx.fill();

          // 4. Thoracic Rotation & Shoulders
          const thoracicRot = isMistake ? (rot * 0.08) : (rot * 0.65);
          const chestCenterY = hipY - 72;
          const chestCenterX = hipX + (isMistake ? 0 : rot * 16);

          const shoulderSpan = 46;
          const leftShoulderX = chestCenterX - Math.cos(thoracicRot) * shoulderSpan;
          const leftShoulderY = chestCenterY - Math.sin(thoracicRot) * 12;
          const rightShoulderX = chestCenterX + Math.cos(thoracicRot) * shoulderSpan;
          const rightShoulderY = chestCenterY + Math.sin(thoracicRot) * 12;

          // Spine Column Line
          ctx.strokeStyle = boneColor;
          ctx.lineWidth = 9;
          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(chestCenterX, chestCenterY);
          ctx.stroke();

          // Shoulder Girdle Clavicle Line
          ctx.beginPath();
          ctx.moveTo(leftShoulderX, leftShoulderY);
          ctx.lineTo(rightShoulderX, rightShoulderY);
          ctx.stroke();

          // Head Trajectory (Turns slightly towards the plate)
          const headX = chestCenterX + (isMistake ? 0 : rot * 10);
          const headY = chestCenterY - 22;

          ctx.fillStyle = boneColor;
          ctx.beginPath();
          ctx.arc(headX, headY, 13, 0, Math.PI * 2);
          ctx.fill();

          // 5. Dynamic Oblique Activation Muscle Highlights
          if (!isMistake && absRot > 0.15) {
            ctx.strokeStyle = '#FF7043';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            if (rot > 0) {
              // Right Oblique Wall Contraction
              ctx.moveTo(hipX + 8, hipY - 6);
              ctx.lineTo(rightShoulderX - 4, rightShoulderY + 6);
            } else {
              // Left Oblique Wall Contraction
              ctx.moveTo(hipX - 8, hipY - 6);
              ctx.lineTo(leftShoulderX + 4, leftShoulderY + 6);
            }
            ctx.stroke();
          }

          // 6. Arms & Weight Plate Articulation
          const plateX = chestCenterX + (isMistake ? (rot * 65) : (rot * 70));
          const plateY = hipY - 12 + absRot * 18;

          const leftElbowX = (leftShoulderX + plateX - 12) / 2 - (rot < 0 ? 8 : 4);
          const leftElbowY = (leftShoulderY + plateY) / 2;
          const rightElbowX = (rightShoulderX + plateX + 12) / 2 + (rot > 0 ? 8 : 4);
          const rightElbowY = (rightShoulderY + plateY) / 2;

          ctx.strokeStyle = armColor;
          ctx.lineWidth = 7;
          ctx.beginPath();
          // Left Arm
          ctx.moveTo(leftShoulderX, leftShoulderY);
          ctx.lineTo(leftElbowX, leftElbowY);
          ctx.lineTo(plateX - 12, plateY);
          // Right Arm
          ctx.moveTo(rightShoulderX, rightShoulderY);
          ctx.lineTo(rightElbowX, rightElbowY);
          ctx.lineTo(plateX + 12, plateY);
          ctx.stroke();

          // 7. Olympic Weight Plate Disc
          drawWeightPlateDisc(ctx, plateX, plateY, {
            isMistake,
            angle: rot * 0.45,
            size: 1.0,
            weightText: '10KG'
          });

          // Shoulder & Elbow & Wrist Joint Discs
          ctx.fillStyle = jointColor;
          ctx.beginPath();
          ctx.arc(hipX, hipY, 6, 0, Math.PI * 2);
          ctx.arc(leftShoulderX, leftShoulderY, 6, 0, Math.PI * 2);
          ctx.arc(rightShoulderX, rightShoulderY, 6, 0, Math.PI * 2);
          ctx.arc(leftElbowX, leftElbowY, 5, 0, Math.PI * 2);
          ctx.arc(rightElbowX, rightElbowY, 5, 0, Math.PI * 2);
          ctx.arc(plateX - 12, plateY, 4, 0, Math.PI * 2);
          ctx.arc(plateX + 12, plateY, 4, 0, Math.PI * 2);
          ctx.fill();

          // 8. Visual Cues & Mistake Warnings
          if (isMistake) {
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 9px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ ARM-ONLY SWING (TORSO STATIC & FEET DROPPED)', centerX, matY - 95);
          } else if (absRot > 0.5) {
            ctx.fillStyle = '#38BDF8';
            ctx.font = 'bold 8.5px Outfit, sans-serif';
            ctx.textAlign = 'center';
            const sideStr = rot > 0 ? 'RIGHT OBLIQUE SQUEEZE' : 'LEFT OBLIQUE SQUEEZE';
            ctx.fillText(`✓ ${sideStr} (±45° THORACIC ROTATION)`, centerX, matY - 95);
          }
        }

        primaryAngleDeg = Math.round(absRot * 45);
        primaryAngleLabel = 'OBLIQUE / TORSO ROTATION';
        mistakeDescription = formMode === 'mistake'
          ? '⚠ ERROR: Swinging Arms Only Without Torso Rotation & Slouching Lower Back'
          : '✓ 45° V-Sit, Elevated Hovering Feet, Full Ribcage Rotation Touching Beside Hip';
      }

      // =============================================================
      // 21. PLANK / CORE
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
      const equipLabel = isDumbbell ? 'Dumbbells' : (equipmentType === 'plate' ? 'Weight Plate' : (equipmentType === 'ab_wheel' ? 'Ab Roller' : (equipmentType === 'cable' ? 'Cables' : (equipmentType === 'bodyweight' ? 'Bodyweight' : 'Barbell'))));
      ctx.fillText(`SmartFit Virtual Trainer • ${enrichedExercise.category || 'Biomechanical'} Demonstration (${equipLabel})`, width / 2, height - 16);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, tempoSpeed, muscleHeatmapActive, formMode, enrichedExercise?.name, cameraAngle, movementType, isDumbbell, equipmentType]);

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
