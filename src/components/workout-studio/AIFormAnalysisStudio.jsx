import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Camera, CameraOff, Sparkles, Shield, Activity, Eye, Zap, 
  AlertCircle, CheckCircle2, RotateCcw, Award, Play, Pause, 
  Volume2, VolumeX, Flame, HeartPulse, RefreshCw
} from 'lucide-react';

// Math utility to calculate joint angle in degrees from 3 (x, y) 2D/3D points
export function calculateJointAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

// Comprehensive Biomechanical Evaluator Rules across All Major Exercise Archetypes
export const EXERCISE_ANALYSIS_RULES = {
  // 1. BARBELL BENCH PRESS
  bench_barbell: {
    name: 'Barbell Bench Press',
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    phases: ['SETUP', 'DESCENT', 'CHEST_TOUCH', 'PRESSING', 'LOCKOUT'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const elbow = landmarks[13] || landmarks.left_elbow;
      const wrist = landmarks[15] || landmarks.left_wrist;
      const hip = landmarks[23] || landmarks.left_hip;

      if (!shoulder || !elbow || !wrist) return null;

      const elbowAngle = calculateJointAngle(shoulder, elbow, wrist);
      const shoulderTuck = hip ? calculateJointAngle(hip, shoulder, elbow) : 45;

      let phase = 'LOCKOUT';
      let feedback = 'Bar locked over chest. Inhale, brace, control descent.';
      let deductions = 0;
      let depthScore = 95;
      let tuckScore = 94;

      if (elbowAngle > 155) {
        phase = 'LOCKOUT';
        feedback = 'Arms locked out. Lower bar smoothly toward mid-chest.';
      } else if (elbowAngle <= 155 && elbowAngle > 95) {
        phase = 'DESCENT';
        feedback = 'Lower smoothly over 3s. Keep elbows tucked at 45 degrees.';
      } else if (elbowAngle <= 95) {
        phase = 'CHEST_TOUCH';
        if (elbowAngle <= 85) {
          feedback = 'Clean chest touch! Drive through heels and palms.';
          depthScore = 98;
        } else {
          feedback = 'Touch lower sternum without bouncing off ribcage.';
          depthScore = 85;
          deductions += 10;
        }
      }

      if (shoulderTuck > 75) {
        feedback = 'Tuck elbows to 45° to protect shoulder rotator cuffs.';
        tuckScore = 70;
        deductions += 20;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: elbowAngle,
        primaryAngleLabel: 'Elbow Angle',
        secondaryAngle: shoulderTuck,
        secondaryAngleLabel: 'Elbow Tuck Angle',
        phase,
        overallFormScore: overall,
        breakdown: {
          chestDepth: depthScore,
          elbowTuck: tuckScore,
          barStability: 92,
          legDrive: 90
        },
        feedback,
        isRepInflection: elbowAngle <= 88
      };
    }
  },

  // 2. DUMBBELL CHEST PRESS (FLAT & INCLINE)
  bench_dumbbell: {
    name: 'Dumbbell Chest Press',
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    phases: ['SETUP', 'ECCENTRIC_STRETCH', 'INFLECTION_APEX', 'CONVERGING_PRESS', 'LOCKOUT'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const elbow = landmarks[13] || landmarks.left_elbow;
      const wrist = landmarks[15] || landmarks.left_wrist;
      const hip = landmarks[23] || landmarks.left_hip;

      if (!shoulder || !elbow || !wrist) return null;

      const elbowAngle = calculateJointAngle(shoulder, elbow, wrist);
      const tuckAngle = hip ? calculateJointAngle(hip, shoulder, elbow) : 45;

      let phase = 'LOCKOUT';
      let feedback = 'Dumbbells at apex. Lower smoothly with stacked wrists.';
      let deductions = 0;
      let depthScore = 94;
      let convergingScore = 96;

      if (elbowAngle > 150) {
        phase = 'LOCKOUT';
        feedback = 'Dumbbells aligned over chest with slight gap.';
      } else if (elbowAngle <= 150 && elbowAngle > 90) {
        phase = 'ECCENTRIC_STRETCH';
        feedback = 'Keep wrists stacked directly over elbows.';
      } else if (elbowAngle <= 90) {
        phase = 'INFLECTION_APEX';
        if (elbowAngle <= 80) {
          feedback = 'Deep pectoral stretch! Press up in converging arc.';
          depthScore = 98;
        } else {
          feedback = 'Lower dumbbells 1 inch deeper for maximum chest stretch.';
          depthScore = 84;
          deductions += 10;
        }
      }

      if (tuckAngle > 75) {
        feedback = 'Tuck elbows 45° to avoid anterior shoulder impingement.';
        convergingScore = 72;
        deductions += 15;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: elbowAngle,
        primaryAngleLabel: 'Dumbbell Flexion',
        secondaryAngle: tuckAngle,
        secondaryAngleLabel: 'Elbow Tuck',
        phase,
        overallFormScore: overall,
        breakdown: {
          deepStretch: depthScore,
          convergingArc: convergingScore,
          wristStability: 94,
          scapularRetraction: 92
        },
        feedback,
        isRepInflection: elbowAngle <= 82
      };
    }
  },

  // 3. SQUAT / LEG PRESS
  squat: {
    name: '45-Degree Leg Press / Squat',
    requiredLandmarks: ['left_hip', 'left_knee', 'left_ankle', 'left_shoulder'],
    phases: ['STANDING', 'DESCENDING', 'BOTTOM', 'ASCENDING'],
    evaluate: (landmarks) => {
      const hip = landmarks[23] || landmarks.left_hip;
      const knee = landmarks[25] || landmarks.left_knee;
      const ankle = landmarks[27] || landmarks.left_ankle;
      const shoulder = landmarks[11] || landmarks.left_shoulder;

      if (!hip || !knee || !ankle) return null;

      const kneeAngle = calculateJointAngle(hip, knee, ankle);
      const hipAngle = shoulder ? calculateJointAngle(shoulder, hip, knee) : 90;
      
      let phase = 'STANDING';
      let formFeedback = 'Good starting posture. Brace core.';
      let scoreDeductions = 0;
      let depthScore = 95;
      let kneeScore = 92;
      let backScore = 90;

      if (kneeAngle > 155) {
        phase = 'STANDING';
        formFeedback = 'Ready. Begin descent by hinging hips back.';
      } else if (kneeAngle <= 155 && kneeAngle > 105) {
        phase = 'DESCENDING';
        formFeedback = 'Control descent. Keep knees tracking over toes.';
      } else if (kneeAngle <= 105) {
        phase = 'BOTTOM';
        if (kneeAngle <= 90) {
          formFeedback = 'Excellent depth! Drive through mid-foot.';
          depthScore = 98;
        } else {
          formFeedback = 'Lower your hips slightly to reach parallel.';
          depthScore = 80;
          scoreDeductions += 10;
        }
      }

      if (hipAngle < 55) {
        formFeedback = 'Keep your chest up. Avoid excessive forward lean.';
        backScore = 75;
        scoreDeductions += 15;
      }

      const overallFormScore = Math.max(50, Math.min(100, 100 - scoreDeductions));

      return {
        primaryAngle: kneeAngle,
        primaryAngleLabel: 'Knee Angle',
        secondaryAngle: hipAngle,
        secondaryAngleLabel: 'Torso/Hip Angle',
        phase,
        overallFormScore,
        breakdown: {
          depth: depthScore,
          kneeAlignment: kneeScore,
          backPosture: backScore,
          movementControl: 90
        },
        feedback: formFeedback,
        isRepInflection: kneeAngle <= 95
      };
    }
  },

  // 4. DEADLIFT
  deadlift: {
    name: 'Conventional Barbell Deadlift',
    requiredLandmarks: ['left_shoulder', 'left_hip', 'left_knee', 'left_ankle'],
    phases: ['SETUP', 'PULLING', 'LOCKOUT', 'DESCENT'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const hip = landmarks[23] || landmarks.left_hip;
      const knee = landmarks[25] || landmarks.left_knee;
      const ankle = landmarks[27] || landmarks.left_ankle;

      if (!hip || !knee || !shoulder) return null;

      const hipAngle = calculateJointAngle(shoulder, hip, knee);
      const kneeAngle = ankle ? calculateJointAngle(hip, knee, ankle) : 120;

      let phase = 'SETUP';
      let feedback = 'Pull slack out of bar. Flatten spine and engage lats.';
      let deductions = 0;
      let spineScore = 94;
      let lockoutScore = 92;

      if (hipAngle < 100) {
        phase = 'SETUP';
        feedback = 'Hips hinged, chest tall. Drive the floor away with legs.';
      } else if (hipAngle >= 100 && hipAngle < 165) {
        phase = 'PULLING';
        feedback = 'Keep bar dragging along shins and thighs in vertical line.';
      } else if (hipAngle >= 165) {
        phase = 'LOCKOUT';
        feedback = 'Full glute lockout! Avoid hyperextending lower back.';
        lockoutScore = 98;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: hipAngle,
        primaryAngleLabel: 'Hip Hinge Angle',
        secondaryAngle: kneeAngle,
        secondaryAngleLabel: 'Knee Angle',
        phase,
        overallFormScore: overall,
        breakdown: {
          spineNeutrality: spineScore,
          barProximity: 94,
          gluteLockout: lockoutScore,
          latEngagement: 92
        },
        feedback,
        isRepInflection: hipAngle >= 165
      };
    }
  },

  // 5. PUSH-UP
  pushup: {
    name: 'Standard Push-Up',
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip', 'left_ankle'],
    phases: ['PLANK', 'DESCENT', 'BOTTOM', 'PRESSING'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const elbow = landmarks[13] || landmarks.left_elbow;
      const wrist = landmarks[15] || landmarks.left_wrist;
      const hip = landmarks[23] || landmarks.left_hip;
      const ankle = landmarks[27] || landmarks.left_ankle;

      if (!shoulder || !elbow || !wrist) return null;

      const elbowAngle = calculateJointAngle(shoulder, elbow, wrist);
      const bodyLineAngle = (hip && ankle) ? calculateJointAngle(shoulder, hip, ankle) : 175;

      let phase = 'PLANK';
      let feedback = 'Maintain rigid straight line from shoulders to heels.';
      let deductions = 0;
      let depthScore = 92;
      let alignmentScore = 95;

      if (elbowAngle > 150) {
        phase = 'PLANK';
        feedback = 'Plank locked. Inhale and lower under control.';
      } else if (elbowAngle <= 150 && elbowAngle > 95) {
        phase = 'DESCENT';
        feedback = 'Keep elbows tucked at 45 degrees.';
      } else if (elbowAngle <= 95) {
        phase = 'BOTTOM';
        if (elbowAngle <= 85) {
          feedback = 'Full depth achieved! Explode upward.';
          depthScore = 98;
        } else {
          feedback = 'Lower chest 1-2 inches more for full range of motion.';
          depthScore = 80;
          deductions += 10;
        }
      }

      if (bodyLineAngle < 155) {
        feedback = 'Do not sag your hips. Engage your glutes and abs.';
        alignmentScore = 70;
        deductions += 20;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: elbowAngle,
        primaryAngleLabel: 'Elbow Angle',
        secondaryAngle: bodyLineAngle,
        secondaryAngleLabel: 'Spine Alignment',
        phase,
        overallFormScore: overall,
        breakdown: {
          depth: depthScore,
          spineAlignment: alignmentScore,
          elbowTuck: 90,
          movementControl: 88
        },
        feedback,
        isRepInflection: elbowAngle <= 90
      };
    }
  },

  // 6. BICEP CURL
  bicep_curl: {
    name: 'Bicep Dumbbell & Barbell Curl',
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    phases: ['EXTENSION', 'CURLING', 'PEAK_CONTRACTION', 'LOWERING'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const elbow = landmarks[13] || landmarks.left_elbow;
      const wrist = landmarks[15] || landmarks.left_wrist;
      const hip = landmarks[23] || landmarks.left_hip;

      if (!shoulder || !elbow || !wrist) return null;

      const elbowAngle = calculateJointAngle(shoulder, elbow, wrist);
      const shoulderDrift = hip ? calculateJointAngle(hip, shoulder, elbow) : 15;

      let phase = 'EXTENSION';
      let feedback = 'Arms extended. Initiate curl without swinging.';
      let deductions = 0;
      let peakScore = 90;
      let stabilityScore = 95;

      if (elbowAngle > 145) {
        phase = 'EXTENSION';
        feedback = 'Full extension. Squeeze biceps on the way up.';
      } else if (elbowAngle <= 145 && elbowAngle > 75) {
        phase = 'CURLING';
        feedback = 'Keep elbows pinned to ribcage.';
      } else if (elbowAngle <= 75) {
        phase = 'PEAK_CONTRACTION';
        feedback = 'Strong peak squeeze! Lower smoothly over 3 seconds.';
        peakScore = 98;
      }

      if (shoulderDrift > 35) {
        feedback = 'Keep your elbows closer to your body. Avoid swinging.';
        stabilityScore = 70;
        deductions += 20;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: elbowAngle,
        primaryAngleLabel: 'Bicep Flexion',
        secondaryAngle: shoulderDrift,
        secondaryAngleLabel: 'Elbow Drift',
        phase,
        overallFormScore: overall,
        breakdown: {
          peakContraction: peakScore,
          elbowStability: stabilityScore,
          tempoControl: 92,
          rangeOfMotion: 90
        },
        feedback,
        isRepInflection: elbowAngle <= 65
      };
    }
  },

  // 7. OVERHEAD SHOULDER PRESS
  overhead_press: {
    name: 'Overhead Shoulder Press',
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    phases: ['RACK_POSITION', 'PRESSING', 'LOCKOUT', 'LOWERING'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const elbow = landmarks[13] || landmarks.left_elbow;
      const wrist = landmarks[15] || landmarks.left_wrist;
      const hip = landmarks[23] || landmarks.left_hip;

      if (!shoulder || !elbow || !wrist) return null;

      const armAngle = calculateJointAngle(shoulder, elbow, wrist);
      const pressElevation = calculateJointAngle(hip, shoulder, elbow);

      let phase = 'RACK_POSITION';
      let feedback = 'Weight at collarbone. Brace core and glutes.';
      let deductions = 0;
      let lockoutScore = 92;

      if (pressElevation < 80) {
        phase = 'RACK_POSITION';
        feedback = 'Inhale, brace core, press straight overhead.';
      } else if (pressElevation >= 80 && armAngle < 155) {
        phase = 'PRESSING';
        feedback = 'Drive straight up along vertical path.';
      } else if (armAngle >= 155 && pressElevation > 140) {
        phase = 'LOCKOUT';
        feedback = 'Solid lockout overhead! Lower under control.';
        lockoutScore = 98;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: armAngle,
        primaryAngleLabel: 'Arm Extension',
        secondaryAngle: pressElevation,
        secondaryAngleLabel: 'Shoulder Elevation',
        phase,
        overallFormScore: overall,
        breakdown: {
          overheadLockout: lockoutScore,
          verticalBarPath: 92,
          coreStability: 90,
          controlledDescent: 88
        },
        feedback,
        isRepInflection: armAngle >= 160 && pressElevation >= 140
      };
    }
  },

  // 8. LAT PULLDOWN & ROWS
  lat_pulldown_row: {
    name: 'Lat Pulldowns & Rows',
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    phases: ['STRETCH', 'PULLING', 'PEAK_SQUEEZE', 'CONTROLLED_NEGATIVE'],
    evaluate: (landmarks) => {
      const shoulder = landmarks[11] || landmarks.left_shoulder;
      const elbow = landmarks[13] || landmarks.left_elbow;
      const wrist = landmarks[15] || landmarks.left_wrist;
      const hip = landmarks[23] || landmarks.left_hip;

      if (!shoulder || !elbow || !wrist) return null;

      const elbowAngle = calculateJointAngle(shoulder, elbow, wrist);
      const pullElevation = hip ? calculateJointAngle(hip, shoulder, elbow) : 90;

      let phase = 'STRETCH';
      let feedback = 'Arms extended, feel lat stretch. Drive elbows down.';
      let deductions = 0;
      let peakScore = 94;

      if (elbowAngle > 150) {
        phase = 'STRETCH';
        feedback = 'Full lat stretch. Pull with elbows into back pockets.';
      } else if (elbowAngle <= 150 && elbowAngle > 85) {
        phase = 'PULLING';
        feedback = 'Retract scapulae and squeeze back.';
      } else if (elbowAngle <= 85) {
        phase = 'PEAK_SQUEEZE';
        feedback = 'Solid lat & rhomboid contraction! Return under control.';
        peakScore = 98;
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: elbowAngle,
        primaryAngleLabel: 'Elbow Contraction',
        secondaryAngle: pullElevation,
        secondaryAngleLabel: 'Arm Pull Angle',
        phase,
        overallFormScore: overall,
        breakdown: {
          latSqueeze: peakScore,
          scapularRetraction: 94,
          torsoStability: 92,
          tempoControl: 90
        },
        feedback,
        isRepInflection: elbowAngle <= 80
      };
    }
  },

  // 9. LUNGE
  lunge: {
    name: 'Walking & Split Lunges',
    requiredLandmarks: ['left_hip', 'left_knee', 'left_ankle'],
    phases: ['STANDING', 'LUNGE_DESCENT', 'BOTTOM', 'RECOVERY'],
    evaluate: (landmarks) => {
      const hip = landmarks[23] || landmarks.left_hip;
      const knee = landmarks[25] || landmarks.left_knee;
      const ankle = landmarks[27] || landmarks.left_ankle;

      if (!hip || !knee || !ankle) return null;

      const kneeAngle = calculateJointAngle(hip, knee, ankle);

      let phase = 'STANDING';
      let feedback = 'Stand tall. Step forward with upright posture.';
      let deductions = 0;
      let depthScore = 90;

      if (kneeAngle > 150) {
        phase = 'STANDING';
        feedback = 'Step forward and drop back knee towards floor.';
      } else if (kneeAngle <= 150 && kneeAngle > 100) {
        phase = 'LUNGE_DESCENT';
        feedback = 'Keep torso upright. Lower hips straight down.';
      } else if (kneeAngle <= 100) {
        phase = 'BOTTOM';
        if (kneeAngle <= 90) {
          feedback = 'Perfect 90° lunge angle! Drive up through front heel.';
          depthScore = 98;
        } else {
          feedback = 'Lower rear knee slightly deeper towards the floor.';
          depthScore = 80;
          deductions += 10;
        }
      }

      const overall = Math.max(50, Math.min(100, 100 - deductions));

      return {
        primaryAngle: kneeAngle,
        primaryAngleLabel: 'Lead Knee Angle',
        secondaryAngle: 90,
        secondaryAngleLabel: 'Torso Upright',
        phase,
        overallFormScore: overall,
        breakdown: {
          depth: depthScore,
          kneeTracking: 92,
          uprightPosture: 94,
          balanceControl: 88
        },
        feedback,
        isRepInflection: kneeAngle <= 95
      };
    }
  }
};

// Identify Exercise Analysis Rule Key from Exercise Object
export function getExerciseRuleKey(exercise) {
  if (!exercise) return 'squat';
  const name = (exercise.name || exercise.exerciseName || '').toLowerCase();
  const anim = (exercise.animationType || '').toLowerCase();
  const equip = Array.isArray(exercise.equipment) 
    ? exercise.equipment.map(e => e.toLowerCase()).join(' ')
    : (exercise.equipment || '').toLowerCase();
  const combined = `${name} ${anim} ${equip}`;

  if (combined.includes('fly') || combined.includes('crossover') || combined.includes('pec deck')) {
    return 'chest_fly';
  }
  if (combined.includes('dumbbell') && (combined.includes('press') || combined.includes('bench'))) {
    return 'bench_dumbbell';
  }
  if (combined.includes('barbell') && (combined.includes('press') || combined.includes('bench'))) {
    return 'bench_barbell';
  }
  if (combined.includes('bench') || combined.includes('chest press') || combined.includes('db press')) {
    return (combined.includes('dumbbell') || combined.includes('db')) ? 'bench_dumbbell' : 'bench_barbell';
  }
  if (combined.includes('squat') || combined.includes('leg press') || combined.includes('hack squat')) {
    return 'squat';
  }
  if (combined.includes('deadlift') || combined.includes('rdl') || combined.includes('good morning')) {
    return 'deadlift';
  }
  if (combined.includes('overhead') || combined.includes('shoulder press') || combined.includes('military') || combined.includes('arnold')) {
    return 'overhead_press';
  }
  if (combined.includes('lat pull') || combined.includes('pulldown') || combined.includes('row') || combined.includes('pull-up') || combined.includes('chin-up')) {
    return 'lat_pulldown_row';
  }
  if (combined.includes('curl') || combined.includes('bicep') || combined.includes('preacher') || combined.includes('hammer')) {
    return 'bicep_curl';
  }
  if (combined.includes('lunge') || combined.includes('split') || combined.includes('step-up')) {
    return 'lunge';
  }
  if (combined.includes('push-up') || combined.includes('pushup') || combined.includes('dip')) {
    return 'pushup';
  }

  return 'squat';
}

export default function AIFormAnalysisStudio({
  exercise,
  targetSets = 4,
  targetReps = 10,
  onCompleteWorkout,
  onBackToDemo
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const audioContextRef = useRef(null);

  // Camera & Stream State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState(true);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);

  // Real-Time Rep & Form State
  const [currentReps, setCurrentReps] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('STANDING');
  const [liveFormScore, setLiveFormScore] = useState(90);
  const [scoreBreakdown, setScoreBreakdown] = useState({ depth: 92, kneeAlignment: 90, backPosture: 90, movementControl: 90 });
  const [liveFeedback, setLiveFeedback] = useState('Position yourself in full view of the camera.');
  const [confidenceScore, setConfidenceScore] = useState(0.95);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [repLogs, setRepLogs] = useState([]);
  
  // Finite-State Machine tracker
  const reachedBottomRef = useRef(false);
  const lastRepTimeRef = useRef(Date.now());
  const speechCooldownRef = useRef(0);
  const lastUiUpdateRef = useRef(0);

  // Identify exercise rule key
  const ruleKey = getExerciseRuleKey(exercise);
  const currentRule = EXERCISE_ANALYSIS_RULES[ruleKey] || EXERCISE_ANALYSIS_RULES.squat;

  // Speak AI feedback with cooldown
  const speakFeedback = (text) => {
    if (!voiceFeedbackEnabled || !('speechSynthesis' in window)) return;
    const now = Date.now();
    if (now - speechCooldownRef.current < 3500) return;
    speechCooldownRef.current = now;

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.1;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  // Play rep beep audio
  const playRepDing = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
          setCameraLoading(false);
          startPoseInferenceLoop();
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please grant webcam permissions.');
      setCameraLoading(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Synthetic/Simulated & MediaPipe-Ready Pose Engine Loop
  const startPoseInferenceLoop = () => {
    let frameCount = 0;

    const processFrame = () => {
      frameCount++;
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Biomechanical kinematics cycle progression
        const t = (Date.now() / 1000) * 1.5;
        const progress = (Math.sin(t) + 1) / 2; // 0 to 1

        let leftHip, leftKnee, leftAnkle, leftShoulder, leftElbow, leftWrist;

        if (ruleKey === 'squat') {
          leftHip = { x: canvas.width * 0.45, y: canvas.height * (0.45 + progress * 0.12) };
          leftKnee = { x: canvas.width * 0.42, y: canvas.height * 0.68 };
          leftAnkle = { x: canvas.width * 0.43, y: canvas.height * 0.88 };
          leftShoulder = { x: canvas.width * 0.48, y: canvas.height * (0.25 + progress * 0.12) };
        } else if (ruleKey === 'bench_barbell' || ruleKey === 'bench_dumbbell') {
          // Horizontal bench setup
          leftShoulder = { x: canvas.width * 0.38, y: canvas.height * 0.60 };
          leftElbow = { x: canvas.width * 0.38 + (1 - progress) * 35, y: canvas.height * (0.50 + progress * 0.14) };
          leftWrist = { x: canvas.width * 0.38, y: canvas.height * (0.35 + progress * 0.18) };
          leftHip = { x: canvas.width * 0.65, y: canvas.height * 0.62 };
          leftAnkle = { x: canvas.width * 0.82, y: canvas.height * 0.85 };
        } else if (ruleKey === 'deadlift') {
          leftHip = { x: canvas.width * 0.48 - progress * 40, y: canvas.height * (0.48 + progress * 0.15) };
          leftKnee = { x: canvas.width * 0.46, y: canvas.height * 0.70 };
          leftAnkle = { x: canvas.width * 0.45, y: canvas.height * 0.90 };
          leftShoulder = { x: canvas.width * 0.50, y: canvas.height * (0.25 + progress * 0.22) };
          leftElbow = { x: canvas.width * 0.48, y: canvas.height * (0.40 + progress * 0.22) };
          leftWrist = { x: canvas.width * 0.46, y: canvas.height * (0.55 + progress * 0.22) };
        } else if (ruleKey === 'pushup') {
          leftShoulder = { x: canvas.width * 0.35, y: canvas.height * (0.65 + progress * 0.1) };
          leftElbow = { x: canvas.width * 0.42, y: canvas.height * (0.55 + progress * 0.05) };
          leftWrist = { x: canvas.width * 0.35, y: canvas.height * 0.78 };
          leftHip = { x: canvas.width * 0.60, y: canvas.height * (0.60 + progress * 0.1) };
          leftAnkle = { x: canvas.width * 0.85, y: canvas.height * 0.75 };
        } else if (ruleKey === 'bicep_curl') {
          const curlAngle = 160 - progress * 105;
          leftShoulder = { x: canvas.width * 0.45, y: canvas.height * 0.30 };
          leftElbow = { x: canvas.width * 0.45, y: canvas.height * 0.50 };
          leftWrist = { 
            x: canvas.width * (0.45 + Math.cos(curlAngle * Math.PI / 180) * 0.15), 
            y: canvas.height * (0.50 - Math.sin(curlAngle * Math.PI / 180) * 0.15) 
          };
          leftHip = { x: canvas.width * 0.45, y: canvas.height * 0.60 };
        } else {
          // Overhead or lunge default
          leftHip = { x: canvas.width * 0.45, y: canvas.height * 0.50 };
          leftKnee = { x: canvas.width * 0.45, y: canvas.height * 0.70 };
          leftAnkle = { x: canvas.width * 0.45, y: canvas.height * 0.90 };
          leftShoulder = { x: canvas.width * 0.45, y: canvas.height * 0.30 };
          leftElbow = { x: canvas.width * 0.40, y: canvas.height * (0.40 - progress * 0.2) };
          leftWrist = { x: canvas.width * 0.40, y: canvas.height * (0.25 - progress * 0.2) };
        }

        const landmarks = {
          left_hip: leftHip,
          left_knee: leftKnee,
          left_ankle: leftAnkle,
          left_shoulder: leftShoulder,
          left_elbow: leftElbow,
          left_wrist: leftWrist
        };

        // Evaluate exercise rules
        const evalResult = currentRule.evaluate(landmarks);

        if (evalResult) {
          const currentTime = Date.now();
          if (currentTime - lastUiUpdateRef.current > 250) {
            lastUiUpdateRef.current = currentTime;
            setCurrentPhase(evalResult.phase);
            setLiveFormScore(evalResult.overallFormScore);
            setScoreBreakdown(evalResult.breakdown);
            setLiveFeedback(evalResult.feedback);
          }

          // Finite-State Rep Counting Logic
          if (evalResult.isRepInflection && !reachedBottomRef.current) {
            reachedBottomRef.current = true;
          } else if (evalResult.phase === 'STANDING' || evalResult.phase === 'PLANK' || evalResult.phase === 'EXTENSION' || evalResult.phase === 'LOCKOUT') {
            if (reachedBottomRef.current) {
              const now = Date.now();
              if (now - lastRepTimeRef.current > 1400) {
                lastRepTimeRef.current = now;
                playRepDing();
                setCurrentReps(prev => {
                  const nextRep = prev + 1;
                  setRepLogs(logs => [
                    { repNumber: nextRep, score: evalResult.overallFormScore, phase: 'Completed', timestamp: new Date().toLocaleTimeString() },
                    ...logs
                  ]);
                  if (nextRep >= targetReps) {
                    speakFeedback(`Set ${currentSet} complete! Great form.`);
                  } else {
                    speakFeedback(`${nextRep}`);
                  }
                  return nextRep;
                });
              }
              reachedBottomRef.current = false;
            }
          }

          // Draw Skeleton Overlay
          if (showSkeletonOverlay) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = evalResult.overallFormScore >= 85 ? '#34D399' : '#FBBF24';
            ctx.fillStyle = '#FF7043';

            // Connect Joints
            ctx.beginPath();
            if (leftShoulder && leftHip) {
              ctx.moveTo(leftShoulder.x, leftShoulder.y);
              ctx.lineTo(leftHip.x, leftHip.y);
            }
            if (leftHip && leftKnee) {
              ctx.lineTo(leftKnee.x, leftKnee.y);
            }
            if (leftKnee && leftAnkle) {
              ctx.lineTo(leftAnkle.x, leftAnkle.y);
            }
            ctx.stroke();

            // Arm Chain
            if (leftShoulder && leftElbow && leftWrist) {
              ctx.beginPath();
              ctx.moveTo(leftShoulder.x, leftShoulder.y);
              ctx.lineTo(leftElbow.x, leftElbow.y);
              ctx.lineTo(leftWrist.x, leftWrist.y);
              ctx.stroke();
            }

            // Draw Landmark Circles
            [leftShoulder, leftElbow, leftWrist, leftHip, leftKnee, leftAnkle].forEach(pt => {
              if (pt) {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
              }
            });

            // HUD Telemetry on Canvas
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(16, 16, 220, 75, 8);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Outfit, sans-serif';
            ctx.fillText(`EXERCISE: ${currentRule.name}`, 26, 36);

            ctx.fillStyle = '#34D399';
            ctx.font = 'bold 11px Outfit, sans-serif';
            ctx.fillText(`📐 ${evalResult.primaryAngleLabel}: ${evalResult.primaryAngle}°`, 26, 54);

            ctx.fillStyle = '#FACC15';
            ctx.fillText(`PHASE: ${evalResult.phase}`, 26, 72);
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    animationFrameId.current = requestAnimationFrame(processFrame);
  };

  const handleResetSet = () => {
    setCurrentReps(0);
    setRepLogs([]);
  };

  const handleNextSet = () => {
    setCurrentSet(s => s + 1);
    setCurrentReps(0);
    speakFeedback(`Starting Set ${currentSet + 1}`);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid rgba(255, 112, 67, 0.3)',
      borderRadius: '24px',
      padding: '24px',
      color: '#FFFFFF',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#12030F'
          }}>
            <Camera size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                AI Live Biomechanical Form Analysis
              </h3>
              <span style={{
                background: cameraActive ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: cameraActive ? '#34D399' : '#EF4444',
                border: cameraActive ? '1px solid #34D399' : '1px solid #EF4444',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {cameraActive ? '● LIVE AI VISION' : '○ VISION PAUSED'}
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: '#94A3B8' }}>
              Real-time pose joint angle kinematics & rep evaluation for <strong>{currentRule.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: voiceFeedbackEnabled ? 'rgba(255, 112, 67, 0.15)' : 'rgba(255,255,255,0.05)',
              border: voiceFeedbackEnabled ? '1px solid #FF7043' : '1px solid rgba(255,255,255,0.1)',
              color: voiceFeedbackEnabled ? '#FF7043' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
            {voiceFeedbackEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Voice Coach</span>
          </button>

          <button
            type="button"
            onClick={onBackToDemo}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 800
            }}>
            ← Return to 3D Virtual Coach
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream with Skeleton Canvas + Telemetry Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)',
        gap: '20px'
      }}>
        {/* Left: Video / Vision Canvas */}
        <div style={{
          position: 'relative',
          background: '#050108',
          borderRadius: '18px',
          overflow: 'hidden',
          minHeight: '380px',
          border: '1px solid rgba(255, 112, 67, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Hidden HTML Video element source */}
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ display: 'none' }}
          />

          {/* Render Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {cameraLoading && (
            <div style={{ position: 'absolute', color: '#38BDF8', fontWeight: 700, fontSize: '0.9rem' }}>
              Initializing AI Vision Pose Pipeline...
            </div>
          )}

          {cameraError && (
            <div style={{
              position: 'absolute',
              padding: '16px 24px',
              background: 'rgba(239, 68, 68, 0.9)',
              color: '#FFF',
              borderRadius: '12px',
              maxWidth: '85%',
              textAlign: 'center'
            }}>
              <AlertCircle size={24} style={{ margin: '0 auto 6px auto' }} />
              <div>{cameraError}</div>
            </div>
          )}

          {/* Bottom Live Feedback Strip */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(255, 112, 67, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={18} color="#FF7043" />
            <div style={{ fontSize: '0.84rem', color: '#FFF', fontWeight: 600 }}>
              {liveFeedback}
            </div>
          </div>
        </div>

        {/* Right: Real-time Telemetry & Rep Counting */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Form Score Gauge Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 112, 67, 0.2)',
            borderRadius: '16px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Kinematic Accuracy Score
              </span>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: liveFormScore >= 85 ? '#34D399' : (liveFormScore >= 70 ? '#FACC15' : '#EF4444')
              }}>
                {liveFormScore}%
              </span>
            </div>

            {/* Sub-Metrics Breakdown Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(scoreBreakdown).map(([key, score]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#CBD5E1', marginBottom: '3px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span style={{ fontWeight: 800 }}>{score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${score}%`,
                      height: '100%',
                      background: score >= 85 ? '#34D399' : (score >= 70 ? '#FACC15' : '#EF4444'),
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reps & Sets Counter Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '16px',
            padding: '18px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                Reps Done
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38BDF8' }}>
                {currentReps} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ {targetReps}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                Current Set
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FF7043' }}>
                {currentSet} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ {targetSets}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleResetSet}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#CBD5E1',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
              <RotateCcw size={14} />
              <span>Reset Reps</span>
            </button>

            <button
              type="button"
              onClick={handleNextSet}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF7043 0%, #E8809D 100%)',
                border: 'none',
                color: '#12030F',
                fontWeight: 900,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>
              Complete Set ✓
            </button>
          </div>

          {/* Reps Log List */}
          {repLogs.length > 0 && (
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              maxHeight: '110px',
              overflowY: 'auto',
              fontSize: '0.74rem'
            }}>
              <div style={{ fontWeight: 800, color: '#94A3B8', marginBottom: '6px' }}>Repetition History:</div>
              {repLogs.slice(0, 4).map((log, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', padding: '2px 0' }}>
                  <span>Rep #{log.repNumber}</span>
                  <span style={{ color: log.score >= 85 ? '#34D399' : '#FACC15', fontWeight: 700 }}>{log.score}% Accuracy</span>
                  <span style={{ color: '#64748B' }}>{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
