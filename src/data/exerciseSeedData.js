// SmartFit Biomechanics Lab - Comprehensive 14-Split Exercise Database & Kinematic Masterclass

export const WORKOUT_SPLITS_LIST = [
  { id: 'all', name: 'All Workouts', category: 'Studio Library (30 Certified)', icon: 'Sparkles', count: 30, description: 'Interactive 3D virtual human demonstration and kinematic analysis for all 30 certified exercises.' },
  { id: 'full_body', name: 'Full Body', category: 'General & Hypertrophy', icon: 'Zap', count: 6, description: 'Total kinetic chain stimulation recruiting major compound muscle groups in a single balanced session.' },
  { id: 'push', name: 'Push', category: 'Chest, Shoulders & Triceps', icon: 'Flame', count: 6, description: 'Anterior chain pressing mechanics targeting pectorals, anterior/lateral deltoids, and triceps.' },
  { id: 'pull', name: 'Pull', category: 'Back, Rear Delts & Biceps', icon: 'Activity', count: 5, description: 'Posterior upper kinetic chain movements emphasizing lats, rhomboids, trapezius, and elbow flexors.' },
  { id: 'legs', name: 'Legs', category: 'Quads, Hamstrings & Calves', icon: 'Dumbbell', count: 8, description: 'Lower body foundation split focusing on knee extension, hip hinge, and plantarflexion power.' },
  { id: 'upper_body', name: 'Upper Body', category: 'Thoracic & Arm Musculature', icon: 'Layers', count: 6, description: 'Synergistic upper body hypertrophy protocol pairing horizontal/vertical push-pull patterns.' },
  { id: 'lower_body', name: 'Lower Body', category: 'Pelvic & Lower Extremity', icon: 'Target', count: 6, description: 'Glute-quad-hamstring overload with dedicated core and unilateral stabilizer work.' },
  { id: 'chest', name: 'Chest', category: 'Pectoralis Major & Minor', icon: 'Award', count: 6, description: 'Targeted clavicular and sternal pectoral hypertrophy via compound presses and flyes.' },
  { id: 'back', name: 'Back', category: 'Lats, Traps & Rhomboids', icon: 'ShieldCheck', count: 2, description: 'V-taper and spinal erector development using vertical and horizontal pulling vectors.' },
  { id: 'shoulders', name: 'Shoulders', category: '3D Deltoid Complex', icon: 'Sparkles', count: 4, description: 'Tri-planar shoulder development targeting anterior, lateral, and posterior heads.' },
  { id: 'arms', name: 'Arms', category: 'Biceps & Triceps', icon: 'Dumbbell', count: 3, description: 'Direct arm hypertrophy maximizing long/short biceps and all 3 triceps heads.' },
  { id: 'core', name: 'Core', category: 'Abs & Obliques', icon: 'Zap', count: 4, description: '360-degree spinal stabilization, anti-rotation, and abdominal rectus conditioning.' },
  { id: 'glutes', name: 'Glutes', category: 'Glute Max, Medius & Minimus', icon: 'Flame', count: 1, description: 'Hip extension, abduction, and posterior chain explosive power development.' }
];

export const INITIAL_EXERCISES_DATABASE = [
  // =========================================================================
  // 1. CHEST / BENCH / PRESSES
  // =========================================================================
  {
    id: 'ex-bench-barbell',
    name: 'Barbell Bench Press',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Compound Horizontal Push',
    primaryMuscles: ['Mid Sternal Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior', 'Rotator Cuff'],
    equipment: ['Barbell', 'Flat Bench', 'Weight Plates'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'flat_bench',
    setupAngle: 0,
    coachSpeech: 'Set up with eyes under the barbell. Retract and depress your scapulae firmly into the bench. Maintain a 45-degree elbow tuck. Inhale, lower the bar smoothly over 3 seconds to touch mid-chest, pause briefly at the stretch, and press explosively back to lockout.',
    phases: [
      { phaseNumber: 1, name: 'Setup & Scapular Retraction', cue: 'Lie flat, pinch shoulder blades together, plant feet firmly into the floor.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Unrack & Core Brace', cue: 'Unrack bar directly over shoulders, take a diaphragmatic breath and brace abs 360 degrees.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Controlled 3s Eccentric Descent', cue: 'Lower bar smoothly along a slight J-curve toward your lower sternum with 45° tucked elbows.', durationSecs: 3 },
      { phaseNumber: 4, name: 'Bottom Chest Touch & Stretch', cue: 'Lightly kiss the bar to your chest without bouncing or losing upper back tension.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Concentric Explosive Drive', cue: 'Drive through your palms and heels, pressing the bar upward and slightly back toward eye line.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Lockout & Pectoral Squeeze', cue: 'Lock out elbows with strong chest contraction without rounding shoulders forward.', durationSecs: 1 }
    ],
    instructions: [
      'Lie flat on the bench with your eyes aligned underneath the racked barbell.',
      'Grip the bar slightly wider than shoulder-width with wrapped thumbs and straight wrists.',
      'Pull your shoulder blades together and drive your heels into the floor.',
      'Unrack the barbell and establish full stability over your chest.',
      'Lower the bar under control over 3 seconds until it touches your lower-to-mid sternum.',
      'Press the bar powerfully upward along an arc back over your shoulders.'
    ],
    breathingInstructions: 'Inhale deeply and expand your ribcage on the 3-second descent; hold brief tension at chest touch; exhale forcefully on the concentric press.',
    formCues: [
      'Maintain a 45-degree elbow angle relative to torso.',
      'Keep shoulder blades pinched tight into the bench.',
      'Drive heels into the floor for leg drive stability.',
      'Do not bounce the barbell off your sternum.'
    ],
    commonMistakes: [
      {
        mistake: 'Flaring elbows at 90 degrees',
        correction: 'Tuck elbows at roughly 45 degrees to preserve the rotator cuff and shoulder capsule.',
        whyItMatters: '90-degree flare places extreme shear force on the anterior shoulder ligaments.',
        visualWarning: 'Elbows flared wide, causing anterior shoulder impingement.'
      },
      {
        mistake: 'Bouncing bar off ribcage',
        correction: 'Pause for a controlled millisecond at chest touch using muscle tension rather than bone rebound.',
        whyItMatters: 'Bouncing eliminates time-under-tension and risks sternum bruising.',
        visualWarning: 'Bar rebounds forcefully off chest with lost back tightness.'
      },
      {
        mistake: 'Lifting hips/glutes off bench',
        correction: 'Keep glutes in solid contact with the bench pad throughout the entire movement.',
        whyItMatters: 'Excessive lumbar arching reduces chest fiber recruitment and strains the lower back.',
        visualWarning: 'Pelvis lifts high off the bench during the push phase.'
      }
    ],
    safetyNotes: ['Always use safety spotter arms or a reliable spotter when lifting heavy loads.'],
    estimatedCaloriesBurned: 130
  },
  {
    id: 'ex-incline-barbell-bench',
    name: 'Incline Barbell Bench Press',
    splitId: 'chest',
    splitName: 'Chest',
    category: 'Pectoralis Major & Minor',
    movementType: 'Compound Incline Push',
    primaryMuscles: ['Upper Clavicular Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
    equipment: ['Incline Bench (30°)', 'Barbell', 'Weight Plates'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'incline_bench',
    setupAngle: 30,
    coachSpeech: 'Set bench to 30 degrees. Grip barbell slightly wider than shoulders. Lower bar smoothly to clavicle notch over 3 seconds and drive upward with explosive power.',
    phases: [
      { phaseNumber: 1, name: 'Incline Setup & Scapular Lock', cue: 'Position bench at 30 degrees, retract scapulae firmly into the incline pad.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Unrack & Upper Chest Path', cue: 'Unrack bar over collarbone line, inhale and brace abdominal wall.', durationSecs: 2 },
      { phaseNumber: 3, name: '3s Controlled Clavicular Descent', cue: 'Lower bar smoothly to clavicle line with elbows tucked at 45 degrees.', durationSecs: 3 },
      { phaseNumber: 4, name: 'Stretch & Inflection Pause', cue: 'Hold 1s stretch at clavicle without bouncing.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Concentric Clavicular Drive', cue: 'Press bar upward and slightly back toward eye line.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Lockout & Reset', cue: 'Squeeze upper chest hard at full extension.', durationSecs: 1 }
    ],
    instructions: [
      'Set incline bench angle to 30 degrees for maximal clavicular head stimulation.',
      'Unrack barbell with shoulder blades pinched back and down.',
      'Lower bar in a controlled 3-second path to upper chest / clavicle area.',
      'Press upward in a smooth arc back to starting overhead position.'
    ],
    breathingInstructions: 'Inhale on the 3-second descent; hold pressure at bottom; exhale upon driving the bar up.',
    formCues: ['Keep incline at 30° to avoid overworking front deltoids.', 'Maintain 45° elbow tuck.', 'Keep feet anchored.'],
    commonMistakes: [
      {
        mistake: 'Setting incline too steep (>45°)',
        correction: 'Keep bench at 30 degrees to target upper chest rather than front shoulders.',
        whyItMatters: 'Steep angles convert the lift into an overhead shoulder press.',
        visualWarning: 'Bench positioned too upright.'
      }
    ],
    safetyNotes: ['Never drop bar quickly to chest; maintain constant muscle tension.'],
    estimatedCaloriesBurned: 130
  },
  {
    id: 'ex-incline-db-press',
    name: 'Incline Dumbbell Press',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Compound Incline Push',
    primaryMuscles: ['Upper Clavicular Pectoralis Major'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    equipment: ['Adjustable Bench (30°)', 'Dumbbells'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '10-12',
    restSeconds: 75,
    tempo: '3-0-1',
    recommendedAngle: 'side',
    animationType: 'incline_bench',
    setupAngle: 30,
    coachSpeech: 'Adjust bench to 30 degrees. Kick dumbbells up to shoulder level. Keep wrists stacked above elbows and press up in a slight converging arc without clanging weights.',
    phases: [
      { phaseNumber: 1, name: 'Bench Incline Setup', cue: 'Set bench to 30 degrees; sit back with dumbbells rested on knees.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Kick-Up & Shoulder Set', cue: 'Kick dumbbells up to shoulder height with elbows tucked at 45°.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Eccentric Negative Descent', cue: 'Lower dumbbells smoothly to upper chest line over 3 seconds feeling deep upper pec stretch.', durationSecs: 3 },
      { phaseNumber: 4, name: 'Inflection Stretch Apex', cue: 'Hold the deep stretch position briefly with elbows under wrists.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Concentric Power Press', cue: 'Press dumbbells up in a converging arc toward center line above upper chest.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Peak Contraction', cue: 'Squeeze upper pectorals hard without banging dumbbells together.', durationSecs: 1 }
    ],
    instructions: [
      'Set an incline bench to 30 degrees for optimal upper clavicular pectoral isolation.',
      'Kick dumbbells up onto shoulders and lean back into the incline backrest.',
      'Retract shoulder blades and plant feet firmly.',
      'Lower dumbbells slowly until you feel a deep stretch in the upper chest.',
      'Press dumbbells upward in a slight converging arc, stopping just short of locking elbows.'
    ],
    breathingInstructions: 'Inhale steadily on the descent; exhale as you drive the dumbbells upward.',
    formCues: ['Keep incline at 30°.', 'Stack wrists directly over elbows.', 'Avoid clanging weights together.'],
    commonMistakes: [
      {
        mistake: 'Clanging dumbbells at the top',
        correction: 'Stop dumbbells 2-3 inches apart at the apex to preserve continuous mechanical tension.',
        whyItMatters: 'Banging weights releases muscle tension and wears down dumbbell coating.',
        visualWarning: 'Dumbbells collide sharply at top lockout.'
      }
    ],
    safetyNotes: ['Lower dumbbells back to knees under control at end of set.'],
    estimatedCaloriesBurned: 115
  },
  {
    id: 'ex-flat-db-press',
    name: 'Flat Dumbbell Chest Press',
    splitId: 'chest',
    splitName: 'Chest',
    category: 'Pectoralis Major & Minor',
    movementType: 'Compound Horizontal Push',
    primaryMuscles: ['Mid Sternal Pectoralis Major'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    equipment: ['Flat Bench', 'Dumbbells'],
    difficulty: 'Intermediate',
    sets: 3,
    reps: '10-12',
    restSeconds: 75,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'flat_bench',
    setupAngle: 0,
    coachSpeech: 'Lie flat with dumbbells directly over chest. Lower dumbbells with elbows tucked at 45 degrees, feeling deep pectoral stretch, and press up smoothly.',
    phases: [
      { phaseNumber: 1, name: 'Setup & Grip', cue: 'Lie flat, pinch shoulder blades, hold dumbbells over chest.', durationSecs: 2 },
      { phaseNumber: 2, name: '3s Eccentric Lowering', cue: 'Lower dumbbells smoothly along chest line with elbows at 45°.', durationSecs: 3 },
      { phaseNumber: 3, name: 'Stretch Pause', cue: 'Pause 1s at deep pectoral stretch.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Concentric Press', cue: 'Drive dumbbells up in converging arc to chest apex.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Squeeze & Reset', cue: 'Hold peak chest squeeze and repeat.', durationSecs: 1 }
    ],
    instructions: [
      'Lie flat on the bench holding dumbbells over mid-chest.',
      'Retract shoulder blades and plant feet firmly.',
      'Lower dumbbells under control over 3 seconds until level with chest.',
      'Press upward in a converging arc and squeeze pecs at the top.'
    ],
    breathingInstructions: 'Inhale on the way down; exhale as you push up.',
    formCues: ['45° elbow angle.', 'Keep wrists neutral and stacked over elbows.', 'Maintain arched chest.'],
    commonMistakes: [
      {
        mistake: 'Flaring elbows 90 degrees',
        correction: 'Tuck elbows at 45 degrees to save shoulder joints.',
        whyItMatters: 'Flaring impinges rotator cuff tendons.',
        visualWarning: 'Elbows perpendicular to torso.'
      }
    ],
    safetyNotes: ['Never drop dumbbells to the side when done; bring knees up to receive them.'],
    estimatedCaloriesBurned: 110
  },
  {
    id: 'ex-cable-flyes',
    name: 'Cable Standing Chest Flyes',
    splitId: 'chest',
    splitName: 'Chest',
    category: 'Pectoralis Major & Minor',
    movementType: 'Isolation Adduction',
    primaryMuscles: ['Pectoralis Major (Sternal & Clavicular)'],
    secondaryMuscles: ['Anterior Deltoids', 'Biceps Short Head'],
    equipment: ['Dual Cable Machine', 'Single D-Handles'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    tempo: '2-1-1',
    recommendedAngle: 'front',
    animationType: 'chest_fly',
    setupAngle: 0,
    coachSpeech: 'Set pulleys to shoulder height. Stagger stance with slight forward lean. Hug a wide barrel, bringing hands together in front of sternum and hold 1 second peak squeeze.',
    phases: [
      { phaseNumber: 1, name: 'Staggered Stance Setup', cue: 'Step forward into staggered stance, slight forward torso lean, soft elbows.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Hug Arc', cue: 'Bring hands together in a wide hugging arc to meet in front of mid-chest.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Peak Contraction Squeeze', cue: 'Squeeze inner pectoral fibers hard for 1 full second.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 2s Eccentric Stretch', cue: 'Open arms wide smoothly feeling deep stretch across chest.', durationSecs: 2 }
    ],
    instructions: [
      'Set cable pulleys at mid-chest height.',
      'Grip handles, take a step forward into a staggered stance, and lean slightly forward.',
      'Keep a slight fixed bend in your elbows throughout the movement.',
      'Bring handles together in front of your chest like hugging a large tree.',
      'Pause and squeeze chest muscles for 1 second, then open arms smoothly under control.'
    ],
    breathingInstructions: 'Exhale as hands come together in front; inhale as arms open to stretch.',
    formCues: ['Maintain fixed soft elbow bend.', 'Do not turn movement into a press.', 'Squeeze chest hard at front.'],
    commonMistakes: [
      {
        mistake: 'Bending and extending elbows like a press',
        correction: 'Keep elbows locked at a constant 15-degree bend throughout.',
        whyItMatters: 'Pressing recruits triceps instead of isolating pectorals.',
        visualWarning: 'Elbows flexing and extending dynamically.'
      }
    ],
    safetyNotes: ['Do not let cables pull arms too far backward past shoulder plane.'],
    estimatedCaloriesBurned: 90
  },
  {
    id: 'ex-dips',
    name: 'Dips / Weighted Dips',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Compound Vertical Push',
    primaryMuscles: ['Lower Sternal Pectoralis', 'Triceps Brachii'],
    secondaryMuscles: ['Anterior Deltoids', 'Core Stabilizers'],
    equipment: ['Parallel Dip Station', 'Dip Belt (Optional)'],
    difficulty: 'Intermediate',
    sets: 3,
    reps: '10-12',
    restSeconds: 90,
    tempo: '3-0-1',
    recommendedAngle: 'side',
    animationType: 'dips',
    setupAngle: 0,
    coachSpeech: 'Mount dip bars with locked arms. Lean torso forward 20 degrees for chest bias. Lower down over 3 seconds until elbows reach 90 degrees, then press back up explosively.',
    phases: [
      { phaseNumber: 1, name: 'Top Support Lockout', cue: 'Lock arms on parallel bars, depress shoulders, cross ankles.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Forward Torso Lean', cue: 'Lean torso forward roughly 20 degrees for pectoral emphasis.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Controlled 3s Descent', cue: 'Lower body smoothly until upper arms are parallel to floor (90° elbow bend).', durationSecs: 3 },
      { phaseNumber: 4, name: 'Concentric Press', cue: 'Drive through palms extending arms back to top lockout.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Top Squeeze', cue: 'Squeeze triceps and lower chest at top.', durationSecs: 1 }
    ],
    instructions: [
      'Grip the parallel bars and push yourself up to the starting locked-arm position.',
      'Lean your torso forward slightly (20°) to target chest fibers.',
      'Lower your body over 3 seconds until your elbows reach a 90-degree angle.',
      'Press powerfully upward through your palms to return to full arm extension.'
    ],
    breathingInstructions: 'Inhale on the controlled descent; exhale as you push up to lockout.',
    formCues: ['Lean forward for chest emphasis.', 'Stop at 90° elbow flexion.', 'Keep shoulders packed down.'],
    commonMistakes: [
      {
        mistake: 'Descending too deep (>90° elbow bend)',
        correction: 'Stop descent when upper arms are parallel to floor to protect anterior shoulder capsule.',
        whyItMatters: 'Extreme depth overstretches the rotator cuff under full bodyweight.',
        visualWarning: 'Shoulders dipping far below elbow level.'
      }
    ],
    safetyNotes: ['Avoid dipping too deep if you have previous shoulder impingement.'],
    estimatedCaloriesBurned: 85
  },

  // =========================================================================
  // 2. BACK / PULL / ROWS / DEADLIFTS
  // =========================================================================
  {
    id: 'ex-deadlift-conv',
    name: 'Conventional Barbell Deadlifts',
    splitId: 'pull',
    splitName: 'Pull',
    category: 'Back, Posterior Chain & Biceps',
    movementType: 'Compound Hip Hinge',
    primaryMuscles: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearms (Grip)', 'Core'],
    equipment: ['Barbell', 'Bumper/Weight Plates'],
    difficulty: 'Advanced',
    sets: 4,
    reps: '6-8',
    restSeconds: 120,
    tempo: '2-1-1',
    recommendedAngle: 'side',
    animationType: 'deadlift',
    setupAngle: 0,
    coachSpeech: 'Step up with bar over mid-foot. Hinge at hips and grip the bar. Pull your chest up, engage your lats like squeezing oranges in armpits, and drive the floor away through your heels.',
    phases: [
      { phaseNumber: 1, name: 'Mid-Foot Stance Setup', cue: 'Feet hip-width, barbell cutting directly over middle of shoelaces 1 inch from shins.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Hinge & Grip Placement', cue: 'Hinge hips back, grip bar just outside shins without moving the bar.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Shins to Bar & Chest Up', cue: 'Bring shins forward until touching bar, pull chest tall, flatten spine.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Lat Engagement & Slack Pull', cue: 'Squeeze oranges in armpits to lock lats, pull the slack click out of the barbell.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Leg Drive & Floor Push', cue: 'Drive feet into floor like a leg press, keeping bar dragging along shins.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Hip Lockout & Glute Squeeze', cue: 'Stand tall, squeeze glutes to lock hips without hyperextending lower back.', durationSecs: 1 },
      { phaseNumber: 7, name: 'Hinge Descent Return', cue: 'Push hips back first, lower bar over knees, and return softly to floor.', durationSecs: 2 }
    ],
    instructions: [
      'Stand with feet hip-width apart and the barbell over your mid-foot (1 inch from shins).',
      'Hinge back at your hips and grip the bar just outside your knees with straight arms.',
      'Drop hips until shins lightly touch the bar, pull your chest up, and flatten your spine.',
      'Pull the slack out of the bar and squeeze your lats tightly.',
      'Drive the floor away with your legs, keeping the bar touching your shins and thighs.',
      'Lock out hips by squeezing glutes at the top without leaning back.'
    ],
    breathingInstructions: 'Take a massive diaphragmatic breath and brace core at bottom; exhale as you reach full standing lockout.',
    formCues: [
      'Keep bar in continuous contact with legs throughout the lift.',
      'Pull slack out of the barbell before launching the pull.',
      'Maintain rigid neutral spine—never allow lumbar rounding.'
    ],
    commonMistakes: [
      {
        mistake: 'Cat-back lumbar spine rounding',
        correction: 'Pull chest tall, lock lats, and hinge from hips with rigid neutral lower spine.',
        whyItMatters: 'Lumbar flexion under heavy deadlift loads puts spinal discs at extreme risk.',
        visualWarning: 'Lower back severely curved outward into spinal flexion.'
      },
      {
        mistake: 'Bar drifting away from shins',
        correction: 'Engage lats to drag the barbell along shins and thighs in a straight vertical line.',
        whyItMatters: 'Drift increases shear force on lumbar spine and ruins mechanical leverage.',
        visualWarning: 'Bar floating 3-4 inches in front of shins during initial pull.'
      }
    ],
    safetyNotes: ['Never hitch the bar onto thighs at lockout; lift in one smooth continuous drive.'],
    estimatedCaloriesBurned: 160
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Wide-Grip Lat Pulldowns',
    splitId: 'pull',
    splitName: 'Pull',
    category: 'Back, Posterior Chain & Biceps',
    movementType: 'Vertical Compound Pull',
    primaryMuscles: ['Latissimus Dorsi (Outer Lats)'],
    secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Rhomboids', 'Rear Delts'],
    equipment: ['Lat Pulldown Machine', 'Wide Bar'],
    difficulty: 'Beginner',
    sets: 4,
    reps: '10-12',
    restSeconds: 75,
    tempo: '3-1-1',
    recommendedAngle: 'rear',
    animationType: 'lat_pulldown',
    setupAngle: 0,
    coachSpeech: 'Grip bar wider than shoulder-width. Sit under knee pads with tall posture. Pull bar toward collarbone by driving elbows straight down into back pockets. Squeeze shoulder blades and control the stretch up.',
    phases: [
      { phaseNumber: 1, name: 'Thigh Pad & Grip Setup', cue: 'Adjust thigh pads snug, take wide overhand grip on bar curve.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Scapular Depression Priming', cue: 'Depress shoulder blades down before bending elbows to initiate with lats.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Concentric Pull & Elbow Drive', cue: 'Drive elbows down and back toward hip pockets, pulling bar to upper chest.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Peak Squeeze & Sternum Arch', cue: 'Touch bar to upper chest with proud ribcage and hold 1 second lat squeeze.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Controlled 3s Eccentric Return', cue: 'Resist weight smoothly over 3 seconds feeling lats stretch all the way up.', durationSecs: 3 },
      { phaseNumber: 6, name: 'Full Overhead Lat Stretch', cue: 'Allow lats to reach full stretch at apex without letting shoulders disengage.', durationSecs: 1 }
    ],
    instructions: [
      'Adjust the thigh pads so your legs are snug and anchored with flat feet.',
      'Take an overhand grip on the angled ends of the wide bar.',
      'Sit tall with a slight 10-15 degree backward lean and proud chest.',
      'Depress shoulder blades downward and drive elbows down into your ribs.',
      'Pull the bar smoothly to your upper collarbone area and pause for 1 second.',
      'Control the ascent over 3 full seconds until your arms reach a complete lat stretch.'
    ],
    breathingInstructions: 'Inhale on the stretch at the top; exhale forcefully as you drive elbows down to chest.',
    formCues: ['Lead with elbows, not hands.', 'Never pull behind neck.', 'Keep torso angle stable.'],
    commonMistakes: [
      {
        mistake: 'Pulling bar behind the neck',
        correction: 'Pull bar strictly to your upper chest in front of your chin.',
        whyItMatters: 'Behind-neck pulldowns force extreme cervical spine flexion and shoulder impingement.',
        visualWarning: 'Bar pulled down behind head with neck craned forward.'
      }
    ],
    safetyNotes: ['Keep wrists neutral over the bar.'],
    estimatedCaloriesBurned: 115
  },
  {
    id: 'ex-chest-sup-row',
    name: 'Chest-Supported Dumbbell Rows',
    splitId: 'back',
    splitName: 'Back',
    category: 'Lats, Traps & Rhomboids',
    movementType: 'Horizontal Compound Pull',
    primaryMuscles: ['Mid-Back Rhomboids', 'Latissimus Dorsi', 'Middle Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Rear Delts', 'Brachialis'],
    equipment: ['Incline Bench (30-45°)', 'Dumbbells'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '10-12',
    restSeconds: 75,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'barbell_row',
    setupAngle: 30,
    coachSpeech: 'Lie prone on incline bench. Let dumbbells hang with straight arms. Pull elbows up and back toward hip crease, pinching rhomboids tightly at the top.',
    phases: [
      { phaseNumber: 1, name: 'Prone Bench Setup', cue: 'Rest chest on 30-45° incline bench, arms hanging straight.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Elbow-Led Row', cue: 'Pull elbows back toward hips squeezing mid-back muscles.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Peak Scapular Pinch', cue: 'Pinch shoulder blades hard at top for 1 second.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 3s Descent', cue: 'Lower dumbbells smoothly to full stretch without lifting chest off bench.', durationSecs: 3 }
    ],
    instructions: [
      'Set incline bench to 30 to 45 degrees and lie face down with chest supported on pad.',
      'Hold a dumbbell in each hand with neutral palms.',
      'Pull your elbows back toward your hip pockets.',
      'Pinch your shoulder blades together at the apex and hold for 1 second.',
      'Lower dumbbells slowly back to full hang.'
    ],
    breathingInstructions: 'Exhale as you row dumbbells upward; inhale as you lower the weights.',
    formCues: ['Pull elbows toward hips, not straight up.', 'Keep chest glued to pad.', 'Squeeze rhomboids at top.'],
    commonMistakes: [
      {
        mistake: 'Lifting chest off pad using lower back extension',
        correction: 'Keep chest glued firmly to the incline pad throughout.',
        whyItMatters: 'Arching off the pad removes isolation from upper back.',
        visualWarning: 'Chest lifting 4 inches off the bench.'
      }
    ],
    safetyNotes: ['Chest support completely offloads lower back strain.'],
    estimatedCaloriesBurned: 105
  },
  {
    id: 'ex-barbell-row',
    name: 'Bent-Over Barbell Row',
    splitId: 'pull',
    splitName: 'Pull',
    category: 'Back, Posterior Chain & Biceps',
    movementType: 'Horizontal Compound Pull',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Mid Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Rear Delts', 'Spinal Erectors'],
    equipment: ['Barbell', 'Weight Plates'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '2-1-1',
    recommendedAngle: 'side',
    animationType: 'barbell_row',
    setupAngle: 0,
    coachSpeech: 'Hinge hips back to 45 degrees with flat spine. Pull bar to belly button by driving elbows high, squeezing shoulder blades at top.',
    phases: [
      { phaseNumber: 1, name: 'Hinge Setup', cue: 'Hinge hips back 45 degrees with flat spine, arms hanging straight.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Row', cue: 'Drive elbows back pulling bar to navel.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Peak Pinch', cue: 'Hold 1s scapular contraction at ribcage.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Eccentric Return', cue: 'Lower bar smoothly to full arm hang.', durationSecs: 2 }
    ],
    instructions: [
      'Grip barbell slightly wider than shoulders.',
      'Hinge at hips until torso is 45 degrees to floor with flat back.',
      'Pull bar toward lower ribcage / navel.',
      'Squeeze shoulder blades together, then lower under control.'
    ],
    breathingInstructions: 'Exhale on the pull; inhale on the lower.',
    formCues: ['Keep spine locked at 45°.', 'Drive elbows back.', 'Do not bounce torso.'],
    commonMistakes: [
      {
        mistake: 'Standing too upright',
        correction: 'Maintain 45-degree hinge throughout set.',
        whyItMatters: 'Standing upright turns row into a shrug.',
        visualWarning: 'Torso nearly vertical at 80 degrees.'
      }
    ],
    safetyNotes: ['Keep lower back rigid throughout.'],
    estimatedCaloriesBurned: 130
  },
  {
    id: 'ex-barbell-shrugs',
    name: 'Heavy Barbell Shrugs',
    splitId: 'back',
    splitName: 'Back',
    category: 'Lats, Traps & Rhomboids',
    movementType: 'Scapular Elevation',
    primaryMuscles: ['Upper Trapezius'],
    secondaryMuscles: ['Levator Scapulae', 'Forearms (Grip)'],
    equipment: ['Barbell', 'Weight Plates'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    tempo: '2-2-1',
    recommendedAngle: 'front',
    animationType: 'overhead_press',
    setupAngle: 0,
    coachSpeech: 'Stand tall holding barbell in front. Elevate shoulders straight up toward ears in a direct vertical line. Squeeze traps hard for 2 full seconds and lower slowly. Never roll shoulders.',
    phases: [
      { phaseNumber: 1, name: 'Standing Grip & Posture', cue: 'Stand tall, grip bar shoulder-width, arms straight, chest up.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Vertical Elevation', cue: 'Shrug shoulders straight up toward ears.', durationSecs: 1 },
      { phaseNumber: 3, name: '2s Peak Contraction', cue: 'Hold intense 2-second squeeze at top apex.', durationSecs: 2 },
      { phaseNumber: 4, name: 'Controlled Descent', cue: 'Lower shoulders down smoothly to full stretch.', durationSecs: 2 }
    ],
    instructions: [
      'Hold a barbell with shoulder-width overhand grip in front of thighs.',
      'Stand tall with neutral neck and shoulders depressed.',
      'Elevate shoulders directly toward ears in a straight vertical path.',
      'Hold peak squeeze for 2 seconds at the top.',
      'Lower shoulders smoothly back to resting position.'
    ],
    breathingInstructions: 'Exhale as you shrug up; hold breath during top squeeze; inhale on descent.',
    formCues: ['Shrug straight up and down.', 'Never roll shoulders backward.', 'Keep arms straight.'],
    commonMistakes: [
      {
        mistake: 'Rolling shoulders in circles',
        correction: 'Elevate straight up and down in a pure vertical line.',
        whyItMatters: 'Rolling causes cervical and shoulder joint grinding without adding trap stimulus.',
        visualWarning: 'Shoulders rotating in circular rolling motions.'
      }
    ],
    safetyNotes: ['Use lifting straps if grip fatigues before upper traps.'],
    estimatedCaloriesBurned: 85
  },

  // =========================================================================
  // 3. LEGS / SQUATS / LUNGES / POSTERIOR CHAIN
  // =========================================================================
  {
    id: 'ex-leg-press-45',
    name: '45-Degree Leg Press',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Compound Sled Extensor',
    primaryMuscles: ['Quadriceps (Vastus Lateralis & Medialis)', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductor Magnus'],
    equipment: ['45-Degree Leg Press Machine', 'Weight Plates'],
    difficulty: 'Beginner',
    sets: 4,
    reps: '10-12',
    restSeconds: 90,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'leg_press',
    setupAngle: 45,
    coachSpeech: 'Place feet shoulder-width on sled. Disengage safety levers. Lower sled smoothly until knees form 90 degrees without letting lower back lift from pad. Press sled back up without locking knees.',
    phases: [
      { phaseNumber: 1, name: 'Sled & Foot Placement', cue: 'Sit deep into seat, place feet shoulder-width in middle of sled plate.', durationSecs: 2 },
      { phaseNumber: 2, name: '3s Eccentric Sled Descent', cue: 'Lower sled smoothly over 3 seconds until knees reach 90 degrees.', durationSecs: 3 },
      { phaseNumber: 3, name: 'Inflection Depth Check', cue: 'Ensure lower back stays glued to backrest pad.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Concentric Leg Drive', cue: 'Drive through whole foot pressing sled upward stopping just short of knee lockout.', durationSecs: 1 }
    ],
    instructions: [
      'Sit comfortably on the leg press machine and place feet shoulder-width on sled platform.',
      'Disengage the safety levers and grasp the side support handles.',
      'Lower the sled platform under control over 3 seconds until knees form a 90-degree angle.',
      'Drive forcefully through mid-foot and heels to press sled back to starting position.',
      'Never lock out knees violently at the top.'
    ],
    breathingInstructions: 'Inhale as sled descends toward you; exhale forcefully as you press the sled away.',
    formCues: ['Keep lower back glued to backrest pad.', 'Do not lock knees at apex.', 'Feet shoulder-width.'],
    commonMistakes: [
      {
        mistake: 'Pelvis curling up off backrest pad (butt wink on leg press)',
        correction: 'Stop descent before pelvis lifts to keep lumbar spine protected.',
        whyItMatters: 'Pelvic tilt under heavy leg press loads severely compresses lower lumbar discs.',
        visualWarning: 'Lower back peeling off seat at bottom of movement.'
      }
    ],
    safetyNotes: ['Never lock knees completely straight; keep a micro-bend at top extension.'],
    estimatedCaloriesBurned: 135
  },
  {
    id: 'ex-walking-lunges',
    name: 'Walking Dumbbell Lunges',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Unilateral Knee & Hip Extensor',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core & Balance Stabilizers'],
    equipment: ['Dumbbells'],
    difficulty: 'Intermediate',
    sets: 3,
    reps: '12 Reps / Leg',
    restSeconds: 75,
    tempo: '2-0-1',
    recommendedAngle: 'side',
    animationType: 'lunge',
    setupAngle: 0,
    coachSpeech: 'Hold dumbbells at sides with tall posture. Take a long step forward, lowering trailing knee smoothly until one inch off floor. Keep front knee stacked over ankle. Drive through front heel to step forward.',
    phases: [
      { phaseNumber: 1, name: 'Standing Posture Setup', cue: 'Stand tall with dumbbells at sides, core braced, gaze forward.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Forward Stride', cue: 'Take a long controlled step forward landing softly on whole front foot.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Controlled Descent', cue: 'Lower body vertically until trailing knee is 1 inch off floor with both knees at 90°.', durationSecs: 2 },
      { phaseNumber: 4, name: 'Front Knee Alignment Check', cue: 'Ensure front knee stays stacked directly over ankle without collapsing inward.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Front Heel Drive', cue: 'Drive through front heel and mid-foot pushing up and stepping smoothly into next stride.', durationSecs: 1 }
    ],
    instructions: [
      'Stand with dumbbells in hands hanging naturally at sides.',
      'Take a comfortable, long step forward with your right foot.',
      'Lower your hips straight down until both knees form 90-degree angles.',
      'Your back knee should hover roughly 1 inch above the floor.',
      'Drive through the front right heel to rise and step directly forward with left leg.'
    ],
    breathingInstructions: 'Inhale as you step and lower into lunge; exhale as you drive up through front heel.',
    formCues: ['Keep torso upright.', 'Front knee tracks over toes without collapsing.', 'Back knee hovers 1 inch off floor.'],
    commonMistakes: [
      {
        mistake: 'Short stride causing front knee over-travel',
        correction: 'Take a longer stride so front shin remains close to vertical.',
        whyItMatters: 'Too short strides spike patellar tendon pressure on front knee.',
        visualWarning: 'Front knee pushed excessively past toes with heel lifting.'
      }
    ],
    safetyNotes: ['Maintain adequate step width (hip-width) for dynamic lateral balance.'],
    estimatedCaloriesBurned: 120
  },
  {
    id: 'ex-leg-extensions',
    name: 'Leg Extensions (Drop Set on final)',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Quad Isolation Extension',
    primaryMuscles: ['Quadriceps Femoris (Rectus Femoris, Vastus Medialis)'],
    secondaryMuscles: ['Patellar Tendon Stabilizers'],
    equipment: ['Leg Extension Machine'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '15 Reps',
    restSeconds: 60,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'squat',
    setupAngle: 0,
    coachSpeech: 'Adjust seat so knee joint aligns with machine pivot. Extend legs upward smoothly until fully straight. Squeeze quads hard for 1 second, then lower over 3 controlled seconds.',
    phases: [
      { phaseNumber: 1, name: 'Machine Pivot Alignment', cue: 'Align knee joints with pivot point, pad resting on lower shins.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Extension', cue: 'Extend legs upward flexing quadriceps.', durationSecs: 1 },
      { phaseNumber: 3, name: '1s Quad Lock Squeeze', cue: 'Hold full extension with hard quad contraction.', durationSecs: 1 },
      { phaseNumber: 4, name: '3s Controlled Lowering', cue: 'Lower weight stack slowly over 3 seconds resisting gravity.', durationSecs: 3 }
    ],
    instructions: [
      'Sit on machine with back flat against backrest and pad rested on lower shins.',
      'Grip side handles and extend knees upward smoothly.',
      'Squeeze quadriceps hard at full extension for 1 second.',
      'Lower the weight smoothly over 3 seconds.'
    ],
    breathingInstructions: 'Exhale as you extend legs up; inhale as you lower the weight.',
    formCues: ['Align knee with machine pivot axis.', '1s peak squeeze at top.', '3s slow negative.'],
    commonMistakes: [
      {
        mistake: 'Kicking weight up with explosive momentum',
        correction: 'Use a smooth 1-second concentric lift and pause at top.',
        whyItMatters: 'Kicking stresses knee joint and reduces quad muscle tension.',
        visualWarning: 'Weight stack banging violently.'
      }
    ],
    safetyNotes: ['Ensure pad rests above ankles, not on toes.'],
    estimatedCaloriesBurned: 80
  },
  {
    id: 'ex-lying-leg-curls',
    name: 'Lying Hamstring Leg Curls',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Knee Flexor Isolation',
    primaryMuscles: ['Hamstrings (Biceps Femoris, Semitendinosus, Semimembranosus)'],
    secondaryMuscles: ['Gastrocnemius (Calf Assist)', 'Gluteus Medius (Pelvic Stabilizer)'],
    equipment: ['Lying Leg Curl Machine', 'Weight Stack'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '12-15 Reps',
    restSeconds: 60,
    tempo: '2-1-2',
    recommendedAngle: 'side',
    animationType: 'hamstring_curl',
    setupAngle: 0,
    coachSpeech: 'Lie prone on the machine bench with angled hip pivot. Position roller pad just below calves above Achilles tendons. Grip front handles to brace pelvis down. Curl heels smoothly toward glutes, pausing 1 second at peak contraction without arching lower back. Lower weight under 2s control.',
    phases: [
      { phaseNumber: 1, name: 'Prone Setup & Pelvic Lock', cue: 'Lie flat, hips pressed into angled bench, roller pad on lower calves, grip front handles.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Heel Curl', cue: 'Curl heels upward and toward glutes flexing hamstrings.', durationSecs: 2 },
      { phaseNumber: 3, name: '1s Peak Hamstring Squeeze', cue: 'Hold full contraction at apex, keeping pelvis glued to bench.', durationSecs: 1 },
      { phaseNumber: 4, name: '2s Controlled Eccentric Extension', cue: 'Lower legs smoothly back to starting position maintaining hamstring tension.', durationSecs: 2 }
    ],
    instructions: [
      'Lie face down on the leg curl machine with the bench angle aligning your hip joint.',
      'Adjust the padded roller lever so it rests comfortably against the back of your lower calves (just above Achilles).',
      'Grip the side/front support handles firmly to anchor your hips to the bench.',
      'Contract your hamstrings to curl the roller smoothly upward toward your buttocks.',
      'Hold the peak squeeze for 1 second at the top of the contraction.',
      'Lower the weight back down slowly over 2-3 seconds without letting the weight stack slam.'
    ],
    breathingInstructions: 'Exhale as you curl heels upward toward glutes; inhale smoothly as you lower the weight.',
    formCues: ['Keep hips/pelvis glued to the bench.', 'Do not arch lower back.', '1-second peak squeeze at top.', 'Smooth controlled negative.'],
    commonMistakes: [
      {
        mistake: 'Hips lifting off bench into lumbar hyperextension',
        correction: 'Anchor pelvis down and hold front handles tight to isolate hamstrings.',
        whyItMatters: 'Lifting hips shifts load away from hamstrings into lower back spinal compression.',
        visualWarning: 'Butt lifting up off bench pad during curl.'
      }
    ],
    safetyNotes: ['Ensure roller pad rests on lower calves, not heel bone or tendon insertion.'],
    estimatedCaloriesBurned: 90
  },
  {
    id: 'ex-rdl-dumbbells',
    name: 'Romanian Dumbbell Deadlifts (RDL)',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Hip Hinge Hypertrophy',
    primaryMuscles: ['Hamstrings (Biceps Femoris & Semitendinosus)', 'Gluteus Maximus'],
    secondaryMuscles: ['Erector Spinae', 'Adductors', 'Grip Forearms'],
    equipment: ['Dumbbells', 'Mat'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '10 Reps',
    restSeconds: 90,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'deadlift',
    setupAngle: 0,
    coachSpeech: 'Stand tall with dumbbells resting on thighs. Unlock knees slightly. Push hips straight back as if trying to touch a wall behind you. Keep dumbbells gliding down shins until deep hamstring stretch. Squeeze glutes to stand.',
    phases: [
      { phaseNumber: 1, name: 'Tall Stance & Soft Knees', cue: 'Feet hip-width, stand tall, unlock knees with soft 15° bend.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Hip Hinge Initiation', cue: 'Push hips straight backward toward wall behind you with rigid flat spine.', durationSecs: 2 },
      { phaseNumber: 3, name: '3s Hamstring Stretch Descent', cue: 'Glide dumbbells close along thighs down to mid-shin level feeling maximal hamstring load.', durationSecs: 3 },
      { phaseNumber: 4, name: 'Apex Stretch Pause', cue: 'Pause for 1 second at maximum hamstring tension without rounding spine.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Glute Drive Forward', cue: 'Drive hips forward, squeezing glutes to return to standing lockout.', durationSecs: 1 }
    ],
    instructions: [
      'Hold a pair of dumbbells in front of your thighs with a neutral/overhand grip.',
      'Set feet hip-width apart and establish a slight bend in your knees.',
      'Push your hips backward while maintaining a flat back and proud chest.',
      'Allow the dumbbells to slide down the front of your legs until you feel a deep stretch in hamstrings.',
      'Drive your hips forward and contract your glutes to return to standing.'
    ],
    breathingInstructions: 'Inhale on the 3-second descent as hips hinge back; exhale as you drive hips forward to lockout.',
    formCues: ['Pure hip hinge.', 'Keep dumbbells skimming close to shins.', 'Flat back throughout.'],
    commonMistakes: [
      {
        mistake: 'Rounding lower spine to reach floor',
        correction: 'Stop descent as soon as hips reach maximum backward travel (usually mid-shin).',
        whyItMatters: 'Reaching lower bends the lumbar spine under load rather than loading hamstrings.',
        visualWarning: 'Spine curving forward into flexion at bottom.'
      }
    ],
    safetyNotes: ['Keep shoulder blades retracted and lats tight.'],
    estimatedCaloriesBurned: 135
  },
  {
    id: 'ex-glute-hip-thrusts',
    name: 'Barbell Glute Hip Thrusts',
    splitId: 'glutes',
    splitName: 'Glutes',
    category: 'Glute Max, Medius & Minimus',
    movementType: 'Hip Extension Overload',
    primaryMuscles: ['Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Quadriceps', 'Core'],
    equipment: ['Bench', 'Barbell', 'Barbell Pad'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '10-12',
    restSeconds: 90,
    tempo: '2-1-1',
    recommendedAngle: 'side',
    animationType: 'deadlift',
    setupAngle: 0,
    coachSpeech: 'Rest upper back against bench. Position padded bar across hip crease. Drive through heels, extending hips up until thighs and torso form straight horizontal tabletop. Squeeze glutes hard at top.',
    phases: [
      { phaseNumber: 1, name: 'Bench & Bar Placement', cue: 'Shoulder blades on bench, bar over hip crease with cushion pad, feet flat.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Heel Drive & Hip Extension', cue: 'Drive through heels pushing hips up toward ceiling.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Horizontal Tabletop Squeeze', cue: 'Hold peak hip extension with full glute contraction and chin tucked.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled Descent', cue: 'Lower hips smoothly back down toward floor.', durationSecs: 2 }
    ],
    instructions: [
      'Sit on the floor with upper back against bench and loaded barbell across hips.',
      'Place feet flat on floor shoulder-width apart.',
      'Drive through your heels to raise your hips until torso and thighs form a straight horizontal line.',
      'Squeeze glutes forcefully for 1 second at top lockout with chin tucked forward.',
      'Lower hips back toward floor under control.'
    ],
    breathingInstructions: 'Exhale as you drive hips up to tabletop; inhale on the descent.',
    formCues: ['Keep chin tucked to maintain neutral pelvis.', 'Drive through heels.', 'Full horizontal tabletop at top.'],
    commonMistakes: [
      {
        mistake: 'Hyperextending lumbar spine at top',
        correction: 'Tuck chin and ribs down, squeezing glutes to achieve neutral hip lockout.',
        whyItMatters: 'Overarching lower back strains lumbar vertebrae instead of isolating glutes.',
        visualWarning: 'Head thrown backward with arched lower back.'
      }
    ],
    safetyNotes: ['Always use a thick barbell pad across hips for comfort and joint protection.'],
    estimatedCaloriesBurned: 140
  },
  {
    id: 'ex-lying-leg-curls',
    name: 'Lying Leg Hamstring Curls',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Hamstring Knee Flexor Isolation',
    primaryMuscles: ['Hamstring Biceps Femoris (Short & Long Heads)'],
    secondaryMuscles: ['Gastrocnemius (Calves)'],
    equipment: ['Lying Leg Curl Machine'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '12 Reps',
    restSeconds: 60,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'deadlift',
    setupAngle: 0,
    coachSpeech: 'Lie prone on machine with pad against lower calves. Curl heels smoothly toward glutes without arching lower back. Squeeze hamstrings at top for 1 second and lower slowly over 3 seconds.',
    phases: [
      { phaseNumber: 1, name: 'Prone Setup', cue: 'Lie flat on bench, pad behind lower calves, knees just off pad edge.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Knee Flexion', cue: 'Curl heels up toward glutes using hamstring flex.', durationSecs: 1 },
      { phaseNumber: 3, name: '1s Peak Contraction', cue: 'Hold top flexion for 1 full second squeezing hamstrings.', durationSecs: 1 },
      { phaseNumber: 4, name: '3s Eccentric Lowering', cue: 'Lower weight slowly over 3 seconds resisting gravity.', durationSecs: 3 }
    ],
    instructions: [
      'Lie face down on the leg curl bench with pad resting against lower calves.',
      'Grip side handles and brace hips firmly into the bench pad.',
      'Curl heels toward your glutes by flexing knees.',
      'Hold peak contraction for 1 second, then lower slowly over 3 seconds.'
    ],
    breathingInstructions: 'Exhale as you curl heels up; inhale as you lower the weight.',
    formCues: ['Keep hips pressed down into pad.', 'Do not arch lower back.', 'Controlled 3-second negative.'],
    commonMistakes: [
      {
        mistake: 'Hips lifting off bench to cheat weight',
        correction: 'Keep hips pressed firmly into pad throughout.',
        whyItMatters: 'Lifting hips uses lower back momentum and loses hamstring isolation.',
        visualWarning: 'Hips rising off pad on concentric curl.'
      }
    ],
    safetyNotes: ['Keep ankles dorsiflexed (toes pulled toward shins) for optimal hamstring recruitment.'],
    estimatedCaloriesBurned: 80
  },
  {
    id: 'ex-standing-calf-raises',
    name: 'Standing Calf Raises',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Ankle Plantarflexion',
    primaryMuscles: ['Gastrocnemius', 'Soleus'],
    secondaryMuscles: ['Tibialis Posterior', 'Foot Stabilizers'],
    equipment: ['Calf Raise Machine / Step & Dumbbells'],
    difficulty: 'Beginner',
    sets: 4,
    reps: '15-20',
    restSeconds: 60,
    tempo: '2-2-1',
    recommendedAngle: 'rear',
    animationType: 'squat',
    setupAngle: 0,
    coachSpeech: 'Stand on balls of feet with heels hanging off ledge. Drop heels down for a deep 2-second stretch, then rise up high on big toes and hold 2 seconds peak calf contraction.',
    phases: [
      { phaseNumber: 1, name: 'Step Platform Setup', cue: 'Balls of feet on step edge, heels hanging free, knees straight.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Deep Stretch Bottom', cue: 'Lower heels below step level feeling deep calf stretch for 2s.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Plantarflexion Rise', cue: 'Push through balls of feet rising up as high as possible.', durationSecs: 1 },
      { phaseNumber: 4, name: '2s Peak Squeeze', cue: 'Hold top apex on toes squeezing calves hard for 2 seconds.', durationSecs: 2 }
    ],
    instructions: [
      'Place balls of feet on edge of platform with heels hanging off.',
      'Lower heels down smoothly to achieve full calf stretch.',
      'Drive through balls of big toes to elevate heels as high as possible.',
      'Squeeze calves hard at the apex for 2 seconds before lowering slowly.'
    ],
    breathingInstructions: 'Exhale as you rise up onto toes; inhale as you lower heels down.',
    formCues: ['Full 2s stretch at bottom.', 'High peak rise onto balls of feet.', 'No bouncing.'],
    commonMistakes: [
      {
        mistake: 'Bouncing quickly without stretching or squeezing',
        correction: 'Pause for 2 seconds at the bottom stretch and 2 seconds at the top contraction.',
        whyItMatters: 'Bouncing uses Achilles tendon elasticity rather than training calf muscle fibers.',
        visualWarning: 'Rapid bouncing up and down.'
      }
    ],
    safetyNotes: ['Keep knees straight but unlocked.'],
    estimatedCaloriesBurned: 65
  },

  // =========================================================================
  // 4. SHOULDERS / OVERHEAD / DELTS / RAISES
  // =========================================================================
  {
    id: 'ex-shoulder-press-barbell',
    name: 'Overhead Shoulder Press',
    splitId: 'shoulders',
    splitName: 'Shoulders',
    category: '3D Deltoid Complex',
    movementType: 'Vertical Compound Push',
    primaryMuscles: ['Anterior Deltoids', 'Lateral Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core Stabilizers'],
    equipment: ['Barbell', 'Squat Rack / Bench', 'Weight Plates'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '3-0-1',
    recommendedAngle: 'side',
    animationType: 'overhead_press',
    setupAngle: 0,
    coachSpeech: 'Stand with feet shoulder-width. Grip bar just outside shoulders. Squeeze glutes and brace core. Press bar straight up, tilting head back slightly to clear chin, then push head through at lockout.',
    phases: [
      { phaseNumber: 1, name: 'Standing Stance & Grip', cue: 'Grip bar shoulder-width, elbows slightly in front of bar, chest proud.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Core & Glute Tightness', cue: 'Squeeze glutes hard and brace abs to prevent hyperextending lumbar spine.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Chin Clearance Arc', cue: 'Tilt chin back slightly so barbell travels along a direct vertical path.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Vertical Drive', cue: 'Drive bar powerfully toward ceiling extending arms overhead.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Head-Through Lockout', cue: 'Push head forward through window of arms, locking out shoulders with active traps.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Controlled Descent', cue: 'Lower bar under control back to clavicle resting position.', durationSecs: 3 }
    ],
    instructions: [
      'Grip the barbell just outside shoulder width with forearms perpendicular to the floor.',
      'Rest the bar across your front clavicle area with elbows angled forward.',
      'Brace your core tightly and squeeze glutes to form a rigid kinetic foundation.',
      'Press the bar vertically overhead, tilting your head back slightly to let the bar pass your chin.',
      'Once the bar passes your head, move your head through the arms and lock out with shrugged traps.',
      'Lower the bar under control over 3 seconds back to the starting clavicle shelf.'
    ],
    breathingInstructions: 'Take a deep belly breath before pressing; exhale near full overhead lockout.',
    formCues: ['Squeeze glutes.', 'Keep bar path directly vertical.', 'Head through at lockout.'],
    commonMistakes: [
      {
        mistake: 'Excessive lower back hyperextension',
        correction: 'Squeeze glutes and tighten abs to maintain a neutral spine.',
        whyItMatters: 'Arching backwards strains lumbar vertebrae.',
        visualWarning: 'Torso leaning heavily backward during overhead drive.'
      }
    ],
    safetyNotes: ['Do not use leg drive unless performing push presses.'],
    estimatedCaloriesBurned: 120
  },
  {
    id: 'ex-seated-db-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    splitId: 'shoulders',
    splitName: 'Shoulders',
    category: '3D Deltoid Complex',
    movementType: 'Vertical Push',
    primaryMuscles: ['Anterior Deltoids', 'Lateral Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius'],
    equipment: ['Dumbbells', 'Upright Bench (75-80°)'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '3-0-1',
    recommendedAngle: 'isometric',
    animationType: 'overhead_press',
    setupAngle: 75,
    coachSpeech: 'Sit with back supported on upright bench. Hold dumbbells at shoulder level with elbows angled 30 degrees in front. Press up in slight converging arc and lower slowly.',
    phases: [
      { phaseNumber: 1, name: 'Seated Setup', cue: 'Sit firmly against backrest, dumbbells at ear height with 30° elbow angle.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Vertical Converging Press', cue: 'Press dumbbells up in slight converging arc toward ceiling.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Top Lockout Squeeze', cue: 'Lock out shoulders at apex without clanging dumbbells.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 3s Negative', cue: 'Lower dumbbells smoothly back to ear height.', durationSecs: 3 }
    ],
    instructions: [
      'Sit on an upright bench with dumbbells at shoulder height.',
      'Angle elbows slightly forward (scapular plane, 30°).',
      'Press dumbbells overhead until arms are extended.',
      'Lower weights smoothly over 3 seconds back to ear level.'
    ],
    breathingInstructions: 'Exhale as you press up; inhale on the controlled lowering.',
    formCues: ['Elbows angled 30° in front.', 'Keep back flat against seat.', 'Control the negative.'],
    commonMistakes: [
      {
        mistake: 'Flaring elbows 90 degrees out to side',
        correction: 'Bring elbows 30 degrees in front of direct side plane into scapular plane.',
        whyItMatters: 'Protects the rotator cuff from subacromial impingement.',
        visualWarning: 'Elbows flared wide behind shoulder plane.'
      }
    ],
    safetyNotes: ['Lower weights to knees under control when set completes.'],
    estimatedCaloriesBurned: 110
  },
  {
    id: 'ex-lateral-raises-cable',
    name: 'Standing Cable Lateral Raises',
    splitId: 'shoulders',
    splitName: 'Shoulders',
    category: '3D Deltoid Complex',
    movementType: 'Isolation Abduction',
    primaryMuscles: ['Lateral Deltoids (Side Delts)'],
    secondaryMuscles: ['Anterior Delts', 'Supraspinatus'],
    equipment: ['Cable Machine', 'Single D-Handle'],
    difficulty: 'Beginner',
    sets: 4,
    reps: '12-15',
    restSeconds: 60,
    tempo: '2-1-2',
    recommendedAngle: 'front',
    animationType: 'lateral_raise',
    setupAngle: 0,
    coachSpeech: 'Set cable pulley to lowest position. Pull handle across body raising arm to horizontal shoulder line. Lead with elbow, hold 1s peak squeeze, and lower slowly.',
    phases: [
      { phaseNumber: 1, name: 'Cable Setup & Grip', cue: 'Set low cable, stand side-on, grip handle across body with soft elbow.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Scapular Plane Abduction', cue: 'Raise handle out to side in scapular plane leading with elbow.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Horizontal Shoulder Apex', cue: 'Hold arm at horizontal shoulder height for 1 second side delt squeeze.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 2s Negative', cue: 'Lower handle smoothly under continuous cable tension.', durationSecs: 2 }
    ],
    instructions: [
      'Set low cable pulley and stand sideways to machine.',
      'Grip handle with outside hand across your body.',
      'Raise arm out to the side leading with your elbow up to shoulder height.',
      'Hold the peak contraction for 1 second, then lower under complete control.'
    ],
    breathingInstructions: 'Exhale as you raise arm; inhale as you lower the cable.',
    formCues: ['Lead with elbow.', 'Scapular plane (30° forward).', 'Continuous cable tension.'],
    commonMistakes: [
      {
        mistake: 'Shrugging upper traps into neck',
        correction: 'Depress shoulder blades down and push handle outward toward wall.',
        whyItMatters: 'Shrugging shifts tension away from lateral delts onto traps.',
        visualWarning: 'Traps bunching up around neck.'
      }
    ],
    safetyNotes: ['Do not raise arm higher than horizontal shoulder plane.'],
    estimatedCaloriesBurned: 85
  },
  {
    id: 'ex-face-pulls',
    name: 'Face Pulls with External Rotation',
    splitId: 'shoulders',
    splitName: 'Shoulders',
    category: '3D Deltoid Complex',
    movementType: 'Rear Delt & External Rotator Pull',
    primaryMuscles: ['Rear Deltoids (Posterior Delts)', 'Infraspinatus & Teres Minor'],
    secondaryMuscles: ['Rhomboids', 'Mid Trapezius'],
    equipment: ['Cable Machine', 'Rope Attachment'],
    difficulty: 'Beginner',
    sets: 4,
    reps: '15 Reps',
    restSeconds: 60,
    tempo: '2-2-1',
    recommendedAngle: 'side',
    animationType: 'chest_fly',
    setupAngle: 0,
    coachSpeech: 'Set rope at eye level with thumbs pointing back. Pull rope toward forehead while spreading hands apart and rotating wrists back (double biceps pose). Hold 2s squeeze.',
    phases: [
      { phaseNumber: 1, name: 'Rope Setup & Thumbs-Back Grip', cue: 'Grip rope ends with thumbs pointing backward, step back with slight lean.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Pull to Forehead', cue: 'Pull rope toward eyes/forehead driving elbows high and wide.', durationSecs: 1 },
      { phaseNumber: 3, name: 'External Rotation & Spread', cue: 'Rotate hands backward spreading rope ends apart like a double bicep pose.', durationSecs: 1 },
      { phaseNumber: 4, name: '2s Rotator Cuff Squeeze', cue: 'Hold peak contraction for 2 full seconds.', durationSecs: 2 },
      { phaseNumber: 5, name: 'Controlled Return', cue: 'Extend arms smoothly back to full stretch.', durationSecs: 2 }
    ],
    instructions: [
      'Attach rope to cable at eye height.',
      'Grip rope ends with thumbs pointing backward toward your face.',
      'Step back, pull rope toward your eyes while driving elbows high and back.',
      'Externally rotate your shoulders at the end so thumbs point behind you.',
      'Hold the contraction for 2 seconds, then return under control.'
    ],
    breathingInstructions: 'Exhale as you pull and rotate rope; inhale on the controlled return.',
    formCues: ['Thumbs point backward at end.', 'Drive elbows high and wide.', '2s peak contraction.'],
    commonMistakes: [
      {
        mistake: 'Pulling rope down toward chest without rotation',
        correction: 'Pull toward eyes and rotate thumbs backward.',
        whyItMatters: 'Without external rotation, you miss rotator cuff strengthening.',
        visualWarning: 'Rope pulled straight down to chest.'
      }
    ],
    safetyNotes: ['Focus on light-to-moderate resistance and immaculate technique.'],
    estimatedCaloriesBurned: 80
  },

  // =========================================================================
  // 5. ARMS / BICEPS / TRICEPS
  // =========================================================================
  {
    id: 'ex-ez-bicep-curls',
    name: 'Standing EZ-Bar Bicep Curls',
    splitId: 'arms',
    splitName: 'Arms',
    category: 'Biceps & Triceps',
    movementType: 'Biceps Isolation',
    primaryMuscles: ['Biceps Brachii (Long & Short Heads)'],
    secondaryMuscles: ['Brachialis', 'Brachioradialis', 'Forearm Flexors'],
    equipment: ['EZ-Curl Bar', 'Weight Plates'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    tempo: '3-0-1',
    recommendedAngle: 'front',
    animationType: 'bicep_curl',
    setupAngle: 0,
    coachSpeech: 'Stand tall with elbows pinned to your sides. Grip the ergonomic curves of the EZ bar. Curl the weight up smoothly squeezing biceps at the top. Lower slowly over three seconds without swinging your torso.',
    phases: [
      { phaseNumber: 1, name: 'Grip & Posture Setup', cue: 'Stand upright, grip EZ bar on inner camber angles, pin elbows to ribs.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Arc Curl', cue: 'Curl bar upward in smooth arc toward shoulders using only biceps flex.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Peak Squeeze Apex', cue: 'Contract biceps hard at peak flexion for 1 second without elbows floating forward.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 3s Negative Descent', cue: 'Lower bar slowly over 3 seconds fully resisting gravity.', durationSecs: 3 },
      { phaseNumber: 5, name: 'Full Extension Triceps Flex', cue: 'Reach full arm extension at bottom, flex triceps briefly to reset full range.', durationSecs: 1 }
    ],
    instructions: [
      'Grip the EZ-curl bar on the inner angled grips with palms facing upward and inward.',
      'Stand with feet shoulder-width, chest tall, and elbows pinned to your sides.',
      'Curl the barbell upward toward your chest by flexing your elbows.',
      'Hold the top peak contraction for 1 second without letting elbows drift forward.',
      'Lower the weight over 3 seconds until arms are fully extended.'
    ],
    breathingInstructions: 'Exhale as you curl the weight up; inhale deeply on the 3-second lowering phase.',
    formCues: ['Pin elbows to torso.', 'No body swing.', '3s slow eccentric.'],
    commonMistakes: [
      {
        mistake: 'Torso swinging / momentum heave',
        correction: 'Stand firmly against a wall or brace core tightly to isolate elbow flexion.',
        whyItMatters: 'Swinging eliminates eccentric biceps tension and risks lumbar hyperextension.',
        visualWarning: 'Torso rocking backward violently on every curl repetition.'
      }
    ],
    safetyNotes: ['EZ-bar reduces wrist strain compared to straight bars.'],
    estimatedCaloriesBurned: 80
  },
  {
    id: 'ex-incline-hammer-curls',
    name: 'Incline Dumbbell Hammer Curls',
    splitId: 'arms',
    splitName: 'Arms',
    category: 'Biceps & Triceps',
    movementType: 'Brachialis & Biceps Isolation',
    primaryMuscles: ['Brachialis', 'Biceps Brachii (Long Head)', 'Brachioradialis'],
    secondaryMuscles: ['Forearm Extensors / Flexors'],
    equipment: ['Adjustable Bench (45-60°)', 'Dumbbells'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'bicep_curl',
    setupAngle: 45,
    coachSpeech: 'Set bench to 45 degrees. Lie back holding dumbbells with neutral palms facing each other. Curl weights smoothly while keeping upper arms pinned perpendicular to floor.',
    phases: [
      { phaseNumber: 1, name: 'Incline Setup & Neutral Palms', cue: 'Lie back on 45° bench, arms hanging straight with palms facing inward.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Hammer Arc', cue: 'Curl dumbbells upward with palms facing each other throughout the arc.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Peak Brachialis Squeeze', cue: 'Hold 1s contraction at top without moving upper arms forward.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 3s Negative Descent', cue: 'Lower dumbbells slowly over 3 seconds to full stretch.', durationSecs: 3 }
    ],
    instructions: [
      'Set incline bench to 45 degrees and lie back with head supported.',
      'Hold dumbbells with neutral palms facing each other (hammer grip).',
      'Curl dumbbells upward while keeping upper arms fixed vertically.',
      'Squeeze the brachialis and forearms at the top, then lower over 3 seconds.'
    ],
    breathingInstructions: 'Exhale as you curl dumbbells up; inhale on the controlled 3-second descent.',
    formCues: ['Keep palms facing each other throughout.', 'Upper arms motionless.', 'Full stretch at bottom.'],
    commonMistakes: [
      {
        mistake: 'Supinating wrists during curl',
        correction: 'Keep palms facing inward directly at each other throughout the entire range.',
        whyItMatters: 'Neutral hammer grip isolates the brachialis for arm thickness.',
        visualWarning: 'Wrists rotating outward during curl.'
      }
    ],
    safetyNotes: ['Maintain controlled tempo to avoid elbow tendon strain.'],
    estimatedCaloriesBurned: 75
  },
  {
    id: 'ex-overhead-triceps-cable',
    name: 'Overhead Cable Triceps Rope Extension',
    splitId: 'arms',
    splitName: 'Arms',
    category: 'Biceps & Triceps',
    movementType: 'Triceps Long Head Isolation',
    primaryMuscles: ['Triceps Brachii (Long Head)'],
    secondaryMuscles: ['Triceps Lateral & Medial Heads', 'Core Stabilizers'],
    equipment: ['Cable Machine', 'Rope Attachment'],
    difficulty: 'Intermediate',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'tricep_extension',
    setupAngle: 0,
    coachSpeech: 'Face away from cable with rope held behind head. Stagger stance with forward torso lean. Keep elbows pinned beside ears and extend arms forward, flaring rope ends at full extension.',
    phases: [
      { phaseNumber: 1, name: 'Overhead Stance & Lean', cue: 'Step forward in staggered stance, rope behind head, elbows pointing forward beside ears.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Concentric Overhead Extension', cue: 'Extend elbows forward and upward extending arms fully.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Rope Flare & Long Head Squeeze', cue: 'Flare rope ends apart at lockout and squeeze triceps long head hard for 1s.', durationSecs: 1 },
      { phaseNumber: 4, name: '3s Controlled Deep Stretch', cue: 'Bend elbows smoothly over 3 seconds feeling deep stretch behind head.', durationSecs: 3 }
    ],
    instructions: [
      'Attach rope to high pulley, turn around and hold rope behind your head.',
      'Take a staggered step forward and lean torso forward 30 degrees.',
      'Keep upper arms stationary beside your head.',
      'Extend forearms forward and outward, flaring rope ends at full extension.',
      'Return slowly over 3 seconds to a deep triceps stretch.'
    ],
    breathingInstructions: 'Exhale as you extend arms forward; inhale on the 3-second stretch return.',
    formCues: ['Keep upper arms stationary beside head.', 'Flare rope at lockout.', 'Feel deep stretch behind head.'],
    commonMistakes: [
      {
        mistake: 'Flaring elbows wide out to sides',
        correction: 'Keep elbows tucked pointing forward beside ears.',
        whyItMatters: 'Flaring elbows takes tension off the triceps long head.',
        visualWarning: 'Elbows pointing wide away from head.'
      }
    ],
    safetyNotes: ['Brace core tightly to avoid overarching lumbar spine.'],
    estimatedCaloriesBurned: 80
  },

  // =========================================================================
  // 6. CORE / ABS / STRENGTH ENDURANCE
  // =========================================================================
  {
    id: 'ex-hanging-leg-raises',
    name: 'Hanging Leg Raises',
    splitId: 'core',
    splitName: 'Core',
    category: 'Abs & Obliques',
    movementType: 'Hip & Spinal Flexion Core',
    primaryMuscles: ['Rectus Abdominis (Lower Abs)'],
    secondaryMuscles: ['Hip Flexors (Iliopsoas)', 'Obliques', 'Forearm Grip'],
    equipment: ['Pull-Up Bar'],
    difficulty: 'Advanced',
    sets: 3,
    reps: '15 Reps',
    restSeconds: 60,
    tempo: '2-1-2',
    recommendedAngle: 'side',
    animationType: 'plank',
    setupAngle: 0,
    coachSpeech: 'Hang from pull-up bar with active shoulders. Posteriorly tilt pelvis and raise legs smoothly to 90 degrees without swinging. Hold 1s squeeze and lower under control.',
    phases: [
      { phaseNumber: 1, name: 'Dead Hang & Active Shoulders', cue: 'Grip bar shoulder-width, engage lats, eliminate body swing.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Pelvic Curl & Leg Elevation', cue: 'Roll pelvis upward and raise legs smoothly to horizontal 90°.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Peak Lower Ab Squeeze', cue: 'Hold horizontal position for 1 second squeezing lower abdominal wall.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Controlled 2s Negative Return', cue: 'Lower legs slowly over 2 seconds without using momentum.', durationSecs: 2 }
    ],
    instructions: [
      'Hang from a pull-up bar with overhand grip and active shoulders.',
      'Tilt your pelvis backward and raise legs smoothly until parallel to the floor.',
      'Pause for 1 second at the top, focusing on curling your pelvis upward toward ribs.',
      'Lower legs under control without swinging back and forth.'
    ],
    breathingInstructions: 'Exhale forcefully as you raise legs; inhale as you lower them down.',
    formCues: ['Curl pelvis toward ribs.', 'Eliminate swinging.', 'Control the negative.'],
    commonMistakes: [
      {
        mistake: 'Using hip swing momentum',
        correction: 'Pause at bottom of each rep and curl pelvis upward using lower abs.',
        whyItMatters: 'Momentum bypasses rectus abdominis activation.',
        visualWarning: 'Body swinging back and forth like a pendulum.'
      }
    ],
    safetyNotes: ['Bend knees if straight leg raises strain hip flexors or lower back.'],
    estimatedCaloriesBurned: 65
  },
  {
    id: 'ex-ab-wheel-rollout',
    name: 'Ab Wheel Rollouts',
    splitId: 'core',
    splitName: 'Core',
    category: 'Abs & Obliques',
    movementType: 'Anti-Extension Core',
    primaryMuscles: ['Rectus Abdominis (Deep Core)'],
    secondaryMuscles: ['Transverse Abdominis', 'Lats', 'Serratus Anterior'],
    equipment: ['Ab Wheel Roller', 'Knee Mat'],
    difficulty: 'Advanced',
    sets: 3,
    reps: '12 Reps',
    restSeconds: 60,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'ab_wheel',
    setupAngle: 0,
    coachSpeech: 'Kneel with hands on ab wheel under shoulders. Tuck pelvis and round upper back slightly. Roll the wheel forward smoothly extending your body. Pull back using abdominal contraction, not hip pulling.',
    phases: [
      { phaseNumber: 1, name: 'Kneeling Hollow Body Setup', cue: 'Kneel on mat, grip handles under shoulders, tuck pelvis into posterior pelvic tilt.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Controlled Rollout Descent', cue: 'Roll wheel forward slowly, extending hips and arms in straight line over 3 seconds.', durationSecs: 3 },
      { phaseNumber: 3, name: 'Max Anti-Extension Stretch', cue: 'Hold near floor without letting lumbar spine sag or hyperextend.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Abdominal Pull-Back', cue: 'Contract abs forcefully to pull wheel back under shoulders.', durationSecs: 1 }
    ],
    instructions: [
      'Kneel on a comfortable mat with hands grasping the ab wheel handles directly under shoulders.',
      'Round your upper back slightly and tuck your pelvis into a hollow-body position.',
      'Roll the wheel forward smoothly, allowing hips and torso to extend toward the floor.',
      'Maintain continuous abdominal bracing without letting your lower back sag.',
      'Pull back by crunching your abs and bringing the wheel back under your chest.'
    ],
    breathingInstructions: 'Inhale as you roll forward into the extension; exhale forcefully as you pull the wheel back.',
    formCues: ['Posterior pelvic tilt.', 'Never let lower back sag.', 'Pull back with abs.'],
    commonMistakes: [
      {
        mistake: 'Sagging lower back (lumbar hyperextension)',
        correction: 'Shorten rollout distance until core can maintain a locked hollow body posture.',
        whyItMatters: 'Sagging transfers shear force directly into lumbar vertebrae.',
        visualWarning: 'Stomach sagging toward floor with arched lower spine.'
      }
    ],
    safetyNotes: ['Start with partial rollouts before attempting full extension.'],
    estimatedCaloriesBurned: 65
  },
  {
    id: 'ex-russian-plate-twists',
    name: 'Russian Plate Twists',
    splitId: 'core',
    splitName: 'Core',
    category: 'Abs & Obliques',
    movementType: 'Rotational Core Conditioning',
    primaryMuscles: ['Internal & External Obliques'],
    secondaryMuscles: ['Rectus Abdominis', 'Hip Flexors'],
    equipment: ['Weight Plate / Dumbbell', 'Mat'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '20 Reps',
    restSeconds: 60,
    tempo: '1-0-1',
    recommendedAngle: 'front',
    animationType: 'russian_twist',
    setupAngle: 0,
    coachSpeech: 'Sit on mat with knees bent and feet elevated 3 inches. Lean torso back 45 degrees. Rotate weight plate from side to side touching floor lightly beside hip.',
    phases: [
      { phaseNumber: 1, name: 'V-Sit Elevated Setup', cue: 'Sit on mat, elevate heels 3 inches off floor, lean torso back 45 degrees.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Torso Rotation Right', cue: 'Rotate shoulders and plate smoothly to right hip area.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Torso Rotation Left', cue: 'Rotate shoulders across center to left hip area under control.', durationSecs: 1 }
    ],
    instructions: [
      'Sit on the floor with knees bent and feet elevated slightly off the floor.',
      'Lean your torso back to a 45-degree angle to engage your core.',
      'Hold a weight plate or dumbbell in front of your chest.',
      'Rotate your torso from side to side, bringing the weight close to the floor beside your hips.'
    ],
    breathingInstructions: 'Breathe steadily in rhythmic cadence with each rotational twist.',
    formCues: ['Rotate with shoulders and torso, not just moving arms.', 'Keep chest proud at 45°.', 'Elevate heels.'],
    commonMistakes: [
      {
        mistake: 'Moving only arms without rotating ribcage',
        correction: 'Rotate your entire chest and ribcage from side to side.',
        whyItMatters: 'Obliques require true spinal rotation to activate.',
        visualWarning: 'Torso facing forward while arms swing side to side.'
      }
    ],
    safetyNotes: ['Keep lower spine neutral; do not slouch.'],
    estimatedCaloriesBurned: 60
  },
  {
    id: 'ex-weighted-plank',
    name: 'Weighted Plank Hold',
    splitId: 'core',
    splitName: 'Core',
    category: 'Abs & Obliques',
    movementType: 'Isometric Core Bracing',
    primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
    secondaryMuscles: ['Glutes', 'Serratus Anterior', 'Shoulders'],
    equipment: ['Weight Plate', 'Exercise Mat'],
    difficulty: 'Intermediate',
    sets: 3,
    reps: '60 Seconds',
    restSeconds: 60,
    tempo: 'Isometric',
    recommendedAngle: 'side',
    animationType: 'plank',
    setupAngle: 0,
    coachSpeech: 'Rest on forearms under shoulders. Form a straight board from head to heels. Squeeze glutes, tuck pelvis, and brace abs like taking a punch.',
    phases: [
      { phaseNumber: 1, name: 'Plank Alignment Setup', cue: 'Elbows under shoulders, toes on floor, body in straight horizontal line.', durationSecs: 2 },
      { phaseNumber: 2, name: '360 Core & Glute Lock', cue: 'Squeeze glutes, tuck pelvis into posterior tilt, drive forearms into floor.', durationSecs: 60 }
    ],
    instructions: [
      'Place forearms on the mat directly under shoulders.',
      'Extend legs straight behind you, resting on toes.',
      'Maintain a straight line from your ears through shoulders, hips, and heels.',
      'Squeeze glutes and abdominal wall forcefully throughout the hold duration.'
    ],
    breathingInstructions: 'Take deep, controlled diaphragmatic breaths while maintaining abdominal wall stiffness.',
    formCues: ['Straight line from shoulders to heels.', 'Do not let hips sag or pike up.', 'Squeeze glutes.'],
    commonMistakes: [
      {
        mistake: 'Hips sagging toward floor',
        correction: 'Tuck pelvis under and squeeze glutes hard.',
        whyItMatters: 'Sagging strains the lower back.',
        visualWarning: 'Hips dipping down toward mat.'
      }
    ],
    safetyNotes: ['End set if lower back begins to ache or sag.'],
    estimatedCaloriesBurned: 60
  }
];

// Helper: Fast and reliable exercise details resolver with intelligent token scoring
export function getExerciseDetails(exerciseOrName) {
  if (!exerciseOrName) return INITIAL_EXERCISES_DATABASE[0];

  const nameToSearch = (typeof exerciseOrName === 'string' ? exerciseOrName : (exerciseOrName.name || exerciseOrName.id || '')).trim().toLowerCase();

  // 1. Direct exact or ID match
  let match = INITIAL_EXERCISES_DATABASE.find(ex => {
    const exName = ex.name.toLowerCase();
    const exId = ex.id.toLowerCase();
    return exName === nameToSearch || exId === nameToSearch;
  });

  // 2. High-Accuracy Token Scoring Match
  if (!match) {
    const searchTokens = nameToSearch.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length > 2 && !['and', 'with', 'the', 'for', 'sets', 'reps'].includes(t));
    let bestScore = 0;
    let bestCandidate = null;

    for (const ex of INITIAL_EXERCISES_DATABASE) {
      const exName = ex.name.toLowerCase();
      const exTokens = exName.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length > 2);
      
      let score = 0;
      for (const st of searchTokens) {
        if (exTokens.includes(st)) {
          score += 2;
        } else if (exName.includes(st)) {
          score += 1;
        }
      }

      // Strong bonus for matching key biomechanical nouns
      if (nameToSearch.includes('fly') && ex.animationType === 'chest_fly') score += 5;
      if (nameToSearch.includes('incline') && ex.animationType === 'incline_bench') score += 4;
      if (nameToSearch.includes('dip') && ex.animationType === 'dips') score += 5;
      if ((nameToSearch.includes('push-up') || nameToSearch.includes('pushup')) && ex.animationType === 'pushup') score += 5;
      if (nameToSearch.includes('hammer') && ex.id === 'ex-incline-hammer-curls') score += 4;
      if (nameToSearch.includes('face pull') && ex.id === 'ex-face-pulls') score += 5;
      if ((nameToSearch.includes('twist') || nameToSearch.includes('russian')) && ex.animationType === 'russian_twist') score += 5;
      if ((nameToSearch.includes('rollout') || nameToSearch.includes('wheel')) && ex.animationType === 'ab_wheel') score += 5;

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = ex;
      }
    }

    if (bestScore >= 2) {
      match = bestCandidate;
    }
  }

  // 3. Fallback Biomechanical Keyword Matcher
  if (!match) {
    if (nameToSearch.includes('fly') || nameToSearch.includes('flyes') || nameToSearch.includes('crossover') || nameToSearch.includes('pec deck')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-cable-flyes');
    } else if (nameToSearch.includes('dip') || nameToSearch.includes('dips')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-dips');
    } else if (nameToSearch.includes('push-up') || nameToSearch.includes('pushup')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-pushups') || INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-weighted-plank');
    } else if (nameToSearch.includes('incline') && (nameToSearch.includes('db') || nameToSearch.includes('dumbbell'))) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-incline-db-press');
    } else if (nameToSearch.includes('incline')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-incline-barbell-bench');
    } else if ((nameToSearch.includes('flat') || nameToSearch.includes('chest')) && (nameToSearch.includes('db') || nameToSearch.includes('dumbbell'))) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-flat-db-press');
    } else if (nameToSearch.includes('bench') || nameToSearch.includes('chest press')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-bench-barbell');
    } else if (nameToSearch.includes('rdl') || (nameToSearch.includes('deadlift') && nameToSearch.includes('romanian'))) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-rdl-dumbbells');
    } else if (nameToSearch.includes('deadlift')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-deadlift-conv');
    } else if (nameToSearch.includes('pulldown') || nameToSearch.includes('lat pull')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-lat-pulldown');
    } else if (nameToSearch.includes('chest-supported') || (nameToSearch.includes('dumbbell') && nameToSearch.includes('row')) || nameToSearch.includes('renegade')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-chest-sup-row');
    } else if (nameToSearch.includes('row')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-barbell-row');
    } else if (nameToSearch.includes('seated') && (nameToSearch.includes('shoulder') || nameToSearch.includes('overhead'))) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-seated-db-shoulder-press');
    } else if (nameToSearch.includes('shoulder press') || nameToSearch.includes('overhead press') || nameToSearch.includes('military')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-shoulder-press-barbell');
    } else if (nameToSearch.includes('lateral raise') || nameToSearch.includes('side delt')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-lateral-raises-cable');
    } else if (nameToSearch.includes('face pull')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-face-pulls');
    } else if (nameToSearch.includes('hammer curl') || (nameToSearch.includes('hammer') && nameToSearch.includes('curl'))) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-incline-hammer-curls');
    } else if (nameToSearch.includes('bicep') || nameToSearch.includes('curl')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-ez-bicep-curls');
    } else if (nameToSearch.includes('tricep') || nameToSearch.includes('pushdown') || nameToSearch.includes('rope extension')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-overhead-triceps-cable');
    } else if (nameToSearch.includes('leg press')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-leg-press-45');
    } else if (nameToSearch.includes('lunge') || nameToSearch.includes('split squat') || nameToSearch.includes('farmer') || nameToSearch.includes('walk') || nameToSearch.includes('carry')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-walking-lunges');
    } else if (nameToSearch.includes('leg extension')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-leg-extensions');
    } else if (nameToSearch.includes('leg curl') || nameToSearch.includes('hamstring curl')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-lying-leg-curls');
    } else if (nameToSearch.includes('calf') || nameToSearch.includes('heel raise')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-standing-calf-raises');
    } else if (nameToSearch.includes('hip thrust') || nameToSearch.includes('glute bridge')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-glute-hip-thrusts');
    } else if (nameToSearch.includes('shrug')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-barbell-shrugs');
    } else if (nameToSearch.includes('hanging leg') || nameToSearch.includes('knee raise')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-hanging-leg-raises');
    } else if (nameToSearch.includes('ab wheel') || nameToSearch.includes('rollout')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-ab-wheel-rollout');
    } else if (nameToSearch.includes('twist') || nameToSearch.includes('russian')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-russian-plate-twists');
    } else if (nameToSearch.includes('plank') || nameToSearch.includes('slam')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-weighted-plank');
    } else if (nameToSearch.includes('swing') || nameToSearch.includes('kettlebell')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-rdl-dumbbells');
    } else if (nameToSearch.includes('squat') || nameToSearch.includes('leg press')) {
      match = INITIAL_EXERCISES_DATABASE.find(e => e.id === 'ex-leg-press-45');
    }
  }

  // Base fallback if still not matched
  const base = match || INITIAL_EXERCISES_DATABASE[0];

  // If input was an object with custom properties (sets, reps, cue, etc.), merge them carefully
  if (typeof exerciseOrName === 'object') {
    return {
      ...base,
      ...exerciseOrName,
      // Ensure key biomechanical attributes default to matched base if not provided in input
      animationType: exerciseOrName.animationType || base.animationType,
      recommendedAngle: exerciseOrName.recommendedAngle || base.recommendedAngle,
      equipment: exerciseOrName.equipment || base.equipment,
      phases: (exerciseOrName.phases && exerciseOrName.phases.length > 0) ? exerciseOrName.phases : base.phases,
      instructions: (exerciseOrName.instructions && exerciseOrName.instructions.length > 0) ? exerciseOrName.instructions : base.instructions,
      commonMistakes: (exerciseOrName.commonMistakes && exerciseOrName.commonMistakes.length > 0) ? exerciseOrName.commonMistakes : base.commonMistakes,
      formCues: (exerciseOrName.formCues && exerciseOrName.formCues.length > 0) ? exerciseOrName.formCues : base.formCues,
      primaryMuscles: (exerciseOrName.primaryMuscles && exerciseOrName.primaryMuscles.length > 0) ? exerciseOrName.primaryMuscles : base.primaryMuscles,
      coachSpeech: exerciseOrName.coachSpeech || base.coachSpeech
    };
  }

  return base;
}
