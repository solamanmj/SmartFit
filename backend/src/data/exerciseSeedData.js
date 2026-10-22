export const WORKOUT_SPLITS_LIST = [
  { id: 'full_body', name: 'Full Body', category: 'General & Hypertrophy', icon: 'Zap', count: 6, description: 'Total kinetic chain stimulation recruiting major compound muscle groups in a single balanced session.' },
  { id: 'push', name: 'Push', category: 'Chest, Shoulders & Triceps', icon: 'Flame', count: 6, description: 'Anterior chain pressing mechanics targeting pectorals, anterior/lateral deltoids, and triceps.' },
  { id: 'pull', name: 'Pull', category: 'Back, Rear Delts & Biceps', icon: 'Activity', count: 6, description: 'Posterior upper kinetic chain movements emphasizing lats, rhomboids, trapezius, and elbow flexors.' },
  { id: 'legs', name: 'Legs', category: 'Quads, Hamstrings & Calves', icon: 'Dumbbell', count: 6, description: 'Lower body foundation split focusing on knee extension, hip hinge, and plantarflexion power.' },
  { id: 'upper_body', name: 'Upper Body', category: 'Thoracic & Arm Musculature', icon: 'Layers', count: 6, description: 'Synergistic upper body hypertrophy protocol pairing horizontal/vertical push-pull patterns.' },
  { id: 'lower_body', name: 'Lower Body', category: 'Pelvic & Lower Extremity', icon: 'Target', count: 6, description: 'Glute-quad-hamstring overload with dedicated core and unilateral stabilizer work.' },
  { id: 'chest', name: 'Chest', category: 'Pectoralis Major & Minor', icon: 'Award', count: 5, description: 'Targeted clavicular and sternal pectoral hypertrophy via compound presses and flyes.' },
  { id: 'back', name: 'Back', category: 'Lats, Traps & Rhomboids', icon: 'ShieldCheck', count: 5, description: 'V-taper and spinal erector development using vertical and horizontal pulling vectors.' },
  { id: 'shoulders', name: 'Shoulders', category: '3D Deltoid Complex', icon: 'Sparkles', count: 5, description: 'Tri-planar shoulder development targeting anterior, lateral, and posterior heads.' },
  { id: 'arms', name: 'Arms', category: 'Biceps & Triceps', icon: 'Dumbbell', count: 5, description: 'Direct arm hypertrophy maximizing long/short biceps and all 3 triceps heads.' },
  { id: 'core', name: 'Core', category: 'Abs & Obliques', icon: 'Zap', count: 5, description: '360-degree spinal stabilization, anti-rotation, and abdominal rectus conditioning.' },
  { id: 'glutes', name: 'Glutes', category: 'Glute Max, Medius & Minimus', icon: 'Flame', count: 5, description: 'Hip extension, abduction, and posterior chain explosive power development.' },
  { id: 'cardio', name: 'Cardio', category: 'Metabolic & VO2 Max', icon: 'HeartPulse', count: 5, description: 'High-efficiency aerobic and anaerobic conditioning protocols for caloric expenditure.' },
  { id: 'mobility', name: 'Mobility & Stretching', category: 'Fascial & Joint Health', icon: 'Activity', count: 5, description: 'Dynamic myofascial release, joint decompression, and active range of motion recovery.' }
];

export const INITIAL_EXERCISES_DATABASE = [
  // -------------------------------------------------------------
  // 1. PUSH SPLIT
  // -------------------------------------------------------------
  {
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
      { phaseNumber: 6, name: 'Lockout & Pectoral Squeeze', cue: 'Lock out elbows with strong chest contraction without rounding shoulders forward.', durationSecs: 1 },
      { phaseNumber: 7, name: 'Reset & Rep Preparation', cue: 'Stabilize the bar, exhale at top, and prepare the next repetition cadence.', durationSecs: 1 }
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
    safetyNotes: [
      'Always use safety spotter arms or a reliable spotter when lifting heavy loads.',
      'Do not use a thumbless suicide grip; wrap thumbs securely around the knurling.'
    ],
    estimatedCaloriesBurned: 130
  },
  {
    name: 'Incline Dumbbell Press',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Compound Horizontal/Incline Push',
    primaryMuscles: ['Upper Clavicular Pectoralis Major'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    equipment: ['Adjustable Bench (30°)', 'Dumbbells'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '10-12',
    restSeconds: 75,
    tempo: '3-0-1',
    recommendedAngle: '45-degree',
    animationType: 'incline_bench',
    setupAngle: 30,
    coachSpeech: 'Adjust bench to 30 degrees. Kick dumbbells up to shoulder level. Keep wrists stacked above elbows and press up in a slight converging arc without clanging weights.',
    phases: [
      { phaseNumber: 1, name: 'Bench Incline Setup', cue: 'Set bench to 30-45 degrees; sit back with dumbbells rested on knees.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Kick-Up & Shoulder Set', cue: 'Kick dumbbells up one by one to shoulder height with elbows tucked at 45°.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Eccentric Negative Descent', cue: 'Lower dumbbells smoothly to upper chest line over 3 seconds feeling deep upper pec stretch.', durationSecs: 3 },
      { phaseNumber: 4, name: 'Inflection Stretch Apex', cue: 'Hold the deep stretch position briefly with elbows under wrists.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Concentric Power Press', cue: 'Press dumbbells up in a converging arc toward center line above upper chest.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Peak Contraction', cue: 'Squeeze upper pectorals hard without banging dumbbells together.', durationSecs: 1 },
      { phaseNumber: 7, name: 'Reset & Tempo Cadence', cue: 'Control the turnaround smoothly into the next eccentric descent.', durationSecs: 1 }
    ],
    instructions: [
      'Set an incline bench to 30 degrees for optimal upper clavicular pectoral isolation.',
      'Kick dumbbells up onto shoulders and lean back into the incline backrest.',
      'Retract shoulder blades and plant feet firmly.',
      'Lower dumbbells slowly until you feel a deep stretch in the upper chest.',
      'Press dumbbells upward in a slight converging arc, stopping just short of locking elbows.'
    ],
    breathingInstructions: 'Inhale steadily on the descent; exhale as you drive the dumbbells upward.',
    formCues: [
      'Keep incline at 30° to 45°—steeper transfers load to front delts.',
      'Stack wrists directly over elbows throughout the movement.',
      'Keep head and back flat against the incline pad.'
    ],
    commonMistakes: [
      {
        mistake: 'Incline angle too steep (>45°)',
        correction: 'Set bench to 30 degrees so the load stays on upper pectorals rather than front shoulders.',
        whyItMatters: 'Too steep converts the lift into a pure overhead shoulder press.',
        visualWarning: 'Bench positioned upright at 60-70 degrees.'
      },
      {
        mistake: 'Clanging dumbbells at the top',
        correction: 'Stop dumbbells 2-3 inches apart at the apex to preserve continuous mechanical tension.',
        whyItMatters: 'Banging weights releases muscle tension and wears down dumbbell coating.',
        visualWarning: 'Dumbbells collide sharply at top lockout.'
      }
    ],
    safetyNotes: ['When completing your set, bring knees up and lower dumbbells back to thighs under control.'],
    estimatedCaloriesBurned: 115
  },
  {
    name: 'Overhead Shoulder Press',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Vertical Push',
    primaryMuscles: ['Anterior Deltoids', 'Lateral Deltoids'],
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core Stabilizers'],
    equipment: ['Barbell', 'Squat Rack / Bench', 'Weight Plates'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '3-0-1',
    recommendedAngle: 'side',
    animationType: 'shoulder_press',
    setupAngle: 0,
    coachSpeech: 'Stand with feet shoulder-width. Grip bar just outside shoulders. Squeeze glutes and brace core. Press bar straight up, tilting head back slightly to clear chin, then push head through at lockout.',
    phases: [
      { phaseNumber: 1, name: 'Standing Stance & Grip', cue: 'Grip bar shoulder-width, elbows slightly in front of bar, chest proud.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Core & Glute Tightness', cue: 'Squeeze glutes hard and brace abs to prevent hyperextending lumbar spine.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Chin Clearance Arc', cue: 'Tilt chin back slightly so barbell travels along a direct vertical path.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Vertical Drive', cue: 'Drive bar powerfully toward ceiling extending arms overhead.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Head-Through Lockout', cue: 'Push head forward through window of arms, locking out shoulders with active traps.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Controlled Descent', cue: 'Lower bar under control back to clavicle resting position.', durationSecs: 3 },
      { phaseNumber: 7, name: 'Reset & Rep Repetition', cue: 'Stabilize rack position and prepare next rep.', durationSecs: 1 }
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
    formCues: [
      'Squeeze glutes to protect your lower back from overarching.',
      'Keep bar path as close to your face as safely possible.',
      'Lock out with arms directly aligned over ears and mid-foot.'
    ],
    commonMistakes: [
      {
        mistake: 'Excessive lower back hyperextension',
        correction: 'Squeeze glutes and tighten abs like getting punched to maintain a neutral spine.',
        whyItMatters: 'Arching backwards turns the lift into an incline bench and strains lumbar vertebrae.',
        visualWarning: 'Torso leaning heavily backward during the overhead drive.'
      },
      {
        mistake: 'Pressing bar too far forward in front of face',
        correction: 'Keep vertical bar trajectory directly over mid-foot balance line.',
        whyItMatters: 'Bar drifting forward creates a massive lever arm, overloading shoulder joints.',
        visualWarning: 'Bar traveling in a wide diagonal loop away from body.'
      }
    ],
    safetyNotes: ['Do not use leg drive unless performing push presses; keep strict posture.'],
    estimatedCaloriesBurned: 120
  },
  {
    name: 'Dumbbell Lateral Raise',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Isolation Abduction',
    primaryMuscles: ['Lateral Deltoids (Side Delts)'],
    secondaryMuscles: ['Anterior Delts', 'Supraspinatus', 'Upper Traps'],
    equipment: ['Dumbbells'],
    difficulty: 'Beginner',
    sets: 4,
    reps: '12-15',
    restSeconds: 60,
    tempo: '2-1-2',
    recommendedAngle: 'front',
    animationType: 'lateral_raise',
    setupAngle: 0,
    coachSpeech: 'Stand tall with slight torso lean. Lead with your elbows, raising dumbbells in the scapular plane (30 degrees forward) until upper arms are parallel to the floor. Hold for one second, then lower slowly.',
    phases: [
      { phaseNumber: 1, name: 'Starting Posture', cue: 'Stand with dumbbells at sides, slight hinge at hips, soft elbow bend.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Scapular Plane Angle', cue: 'Position arms 30 degrees in front of direct side plane (scapular plane).', durationSecs: 1 },
      { phaseNumber: 3, name: 'Elbow-Led Abduction', cue: 'Raise weights by leading with elbows, keeping hands level or slightly below elbows.', durationSecs: 2 },
      { phaseNumber: 4, name: 'Apex Isometric Hold', cue: 'Hold parallel to floor for 1 full second squeezing the lateral delts.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Controlled 2s Negative', cue: 'Resist gravity lowering weights over 2 controlled seconds.', durationSecs: 2 },
      { phaseNumber: 6, name: 'Tension Retention Bottom', cue: 'Stop just short of dumbbells touching thighs to keep continuous side delt tension.', durationSecs: 1 }
    ],
    instructions: [
      'Hold light dumbbells with a neutral grip and hinge forward 10-15 degrees at your hips.',
      'Maintain a slight 15-degree bend in your elbows throughout the movement.',
      'Raise the dumbbells upward and slightly forward in your scapular plane (30° forward).',
      'Lead with your elbows until your upper arms reach horizontal shoulder height.',
      'Pause for 1 second at the top, then lower smoothly under complete control.'
    ],
    breathingInstructions: 'Exhale as you raise the dumbbells up; inhale smoothly on the descent.',
    formCues: [
      'Pour water visual: Pinkies slightly higher than thumbs or hands level with elbows.',
      'Do not shrug traps toward ears.',
      'Do not use swinging hips/momentum to heave weights up.'
    ],
    commonMistakes: [
      {
        mistake: 'Using body swing / hip heave',
        correction: 'Reduce weight by 20-30% and perform strict standing raises without torso swinging.',
        whyItMatters: 'Momentum transfers load to traps and lower back instead of side deltoids.',
        visualWarning: 'Torso rocking aggressively back and forth on each rep.'
      },
      {
        mistake: 'Shrugging shoulders into ears',
        correction: 'Keep shoulder blades depressed down and push dumbbells outward toward walls.',
        whyItMatters: 'Shrugging shifts tension away from lateral deltoids onto the upper trapezius.',
        visualWarning: 'Trapezius bunching up around neck.'
      }
    ],
    safetyNotes: ['Do not raise weights higher than shoulder horizontal plane to prevent subacromial pinch.'],
    estimatedCaloriesBurned: 85
  },
  {
    name: 'Triceps Rope Pushdown',
    splitId: 'push',
    splitName: 'Push',
    category: 'Chest, Shoulders & Triceps',
    movementType: 'Triceps Isolation',
    primaryMuscles: ['Triceps Brachii (Lateral & Medial Heads)'],
    secondaryMuscles: ['Triceps Long Head', 'Forearm Extensors'],
    equipment: ['Cable Machine', 'Rope Attachment'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '12-15',
    restSeconds: 60,
    tempo: '2-1-2',
    recommendedAngle: 'side',
    animationType: 'tricep_extension',
    setupAngle: 0,
    coachSpeech: 'Pin elbows firmly against your ribs. Hinge forward slightly. Push the rope straight down and flare the ends outward at full extension, locking in peak triceps contraction.',
    phases: [
      { phaseNumber: 1, name: 'Elbow Pinning Setup', cue: 'Grip rope attachment, pin elbows firmly to sides of ribcage.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Slight Torso Lean', cue: 'Hinge forward roughly 10 degrees with soft knees and braced core.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Downward Extension', cue: 'Push rope down smoothly using only elbow joint extension.', durationSecs: 2 },
      { phaseNumber: 4, name: 'Rope Flare & Peak Squeeze', cue: 'Flare rope ends apart at bottom and hold hard triceps lockout for 1 second.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Controlled 2s Negative Return', cue: 'Allow forearms to rise back to 90 degrees while keeping upper arms motionless.', durationSecs: 2 },
      { phaseNumber: 6, name: 'Reset & Rep Cadence', cue: 'Maintain pinned elbows and repeat.', durationSecs: 1 }
    ],
    instructions: [
      'Attach a rope to a high cable pulley and grip both rope ends with thumbs pointing up.',
      'Step back slightly, hinge forward 10 degrees, and pin elbows securely against your torso.',
      'Extend your elbows downward, pushing the rope toward the floor.',
      'At full extension, flare the rope ends outward and contract triceps hard for 1 second.',
      'Return the rope upward smoothly until forearms are slightly above 90 degrees.'
    ],
    breathingInstructions: 'Exhale as you push and flare the rope down; inhale as hands return upward.',
    formCues: [
      'Upper arms must remain stationary like door hinges.',
      'Flare rope ends apart at the bottom for lateral triceps peak contraction.',
      'Do not allow elbows to drift forward or backward during reps.'
    ],
    commonMistakes: [
      {
        mistake: 'Elbows floating forward and back',
        correction: 'Lock upper arms stationary against your ribs throughout the entire set.',
        whyItMatters: 'Moving elbows turns isolation triceps into a lat pull movement.',
        visualWarning: 'Elbows swinging forward on the return and pulling back on extension.'
      }
    ],
    safetyNotes: ['Maintain neutral wrists; do not cock wrists excessively at the bottom.'],
    estimatedCaloriesBurned: 80
  },

  // -------------------------------------------------------------
  // 2. PULL SPLIT
  // -------------------------------------------------------------
  {
    name: 'Conventional Barbell Deadlift',
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
    name: 'Wide-Grip Lat Pulldown',
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
    formCues: [
      'Lead with elbows, not hands.',
      'Never pull behind the neck—pull strictly to front upper chest.',
      'Keep torso angle stable; do not swing back and forth.'
    ],
    commonMistakes: [
      {
        mistake: 'Pulling bar behind the neck',
        correction: 'Pull bar strictly to your upper chest in front of your chin.',
        whyItMatters: 'Behind-neck pulldowns force extreme cervical spine flexion and shoulder impingement.',
        visualWarning: 'Bar pulled down behind head with neck craned forward.'
      },
      {
        mistake: 'Swinging torso backward to heave weight',
        correction: 'Maintain a rigid, slight 10-degree torso lean using only your back muscles to pull.',
        whyItMatters: 'Swinging turns a lat exercise into a momentum-driven lower back extension.',
        visualWarning: 'Upper body violently rocking 45 degrees back on each rep.'
      }
    ],
    safetyNotes: ['Keep wrists neutral over the bar; do not bend wrists into flexion.'],
    estimatedCaloriesBurned: 115
  },
  {
    name: 'Bent-Over Barbell Row',
    splitId: 'pull',
    splitName: 'Pull',
    category: 'Back, Posterior Chain & Biceps',
    movementType: 'Horizontal Compound Pull',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Mid & Lower Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoids', 'Erector Spinae'],
    equipment: ['Barbell', 'Weight Plates'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    tempo: '2-1-1',
    recommendedAngle: 'side',
    animationType: 'barbell_row',
    setupAngle: 0,
    coachSpeech: 'Hinge hips back to a 45-degree angle with flat back. Pull the bar toward your belly button, driving elbows high and pinching shoulder blades together at the top.',
    phases: [
      { phaseNumber: 1, name: 'Hinge Posture Setup', cue: 'Feet shoulder-width, hinge hips back until torso is 45° with flat spine.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Arm Hang & Core Brace', cue: 'Arms hang straight with overhand grip outside knees, core braced tightly.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Elbow-Drive Row', cue: 'Drive elbows back toward ceiling, pulling bar smoothly toward belly button.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Scapular Retraction Pinch', cue: 'Squeeze shoulder blades together hard at top contraction for 1 full second.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Controlled 2s Negative Descent', cue: 'Lower bar smoothly back to full arm hang without rounding lower back.', durationSecs: 2 }
    ],
    instructions: [
      'Grip the barbell with an overhand grip slightly wider than shoulder width.',
      'Unlock knees and hinge at hips until your torso is approximately 45 degrees to the floor.',
      'Keep your chest proud and spine neutral.',
      'Pull the bar toward your lower ribcage / navel by driving elbows behind you.',
      'Squeeze your shoulder blades together at the apex, then lower under complete control.'
    ],
    breathingInstructions: 'Exhale as you pull the bar into your torso; inhale as you lower the barbell.',
    formCues: [
      'Pull with your elbows, thinking about pinching a pencil between shoulder blades.',
      'Keep neck in neutral alignment with your spine.',
      'Do not stand upright during reps—maintain the 45-degree hinge.'
    ],
    commonMistakes: [
      {
        mistake: 'Standing too upright during rows',
        correction: 'Maintain a 45-degree hip hinge throughout the entire set.',
        whyItMatters: 'Standing upright turns the row into an upright shrug, reducing lat activation.',
        visualWarning: 'Torso nearly vertical at 80 degrees during rows.'
      }
    ],
    safetyNotes: ['Keep lower back arched and rigid; drop weight if spinal integrity wavers.'],
    estimatedCaloriesBurned: 130
  },
  {
    name: 'Standing EZ-Bar Bicep Curl',
    splitId: 'pull',
    splitName: 'Pull',
    category: 'Back, Posterior Chain & Biceps',
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
    formCues: [
      'Pin elbows to torso—do not let them drift forward to rest weight at top.',
      'Keep wrists rigid; do not curl wrists inward.',
      'Eliminate lower back swinging.'
    ],
    commonMistakes: [
      {
        mistake: 'Torso swinging / momentum heave',
        correction: 'Stand firmly against a wall or brace core tightly to isolate elbow flexion.',
        whyItMatters: 'Swinging eliminates eccentric biceps tension and risks lumbar hyperextension.',
        visualWarning: 'Torso rocking backward violently on every curl repetition.'
      }
    ],
    safetyNotes: ['EZ-bar reduces wrist strain compared to straight bars; choose comfortable camber angle.'],
    estimatedCaloriesBurned: 80
  },

  // -------------------------------------------------------------
  // 3. LEGS SPLIT
  // -------------------------------------------------------------
  {
    name: 'Barbell Back Squat',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Compound Knee & Hip Extensor',
    primaryMuscles: ['Quadriceps Femoris', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductor Magnus', 'Soleus & Gastrocnemius', 'Core'],
    equipment: ['Squat Rack', 'Barbell', 'Weight Plates'],
    difficulty: 'Advanced',
    sets: 4,
    reps: '8-10',
    restSeconds: 120,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'squat',
    setupAngle: 0,
    coachSpeech: 'Rest bar securely on upper traps. Step back with feet shoulder-width, toes angled slightly out. Inhale and brace your core 360 degrees. Hinge hips and knees simultaneously, sinking down to parallel depth with knees tracking over toes. Drive through whole foot to stand tall.',
    phases: [
      { phaseNumber: 1, name: 'Bar Placement & Unrack', cue: 'Position bar across upper trapezius shelf, unrack with tall chest and take two steps back.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Stance & Core 360 Brace', cue: 'Feet shoulder-width, toes turned 15° out, take massive diaphragmatic breath and brace abs.', durationSecs: 2 },
      { phaseNumber: 3, name: 'Controlled 3s Descent', cue: 'Break at hips and knees simultaneously, lowering over 3s with chest tall and knees tracking over toes.', durationSecs: 3 },
      { phaseNumber: 4, name: 'Parallel Bottom Depth', cue: 'Hit parallel depth where hip crease is slightly below knee level while maintaining flat spine.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Concentric Floor Drive', cue: 'Drive through whole foot (tripod foot) pushing the floor away explosively.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Lockout & Glute Squeeze', cue: 'Stand tall locking hips and knees with active glutes without hyperextending.', durationSecs: 1 },
      { phaseNumber: 7, name: 'Reset & Rep Preparation', cue: 'Exhale at top, re-establish 360 brace, and prepare next repetition.', durationSecs: 1 }
    ],
    instructions: [
      'Step under the racked barbell and position it across your upper trapezius (high bar).',
      'Unrack the bar and take two clean steps back into a shoulder-width stance.',
      'Turn toes slightly outward (15 to 30 degrees) to allow natural hip flexion.',
      'Take a deep belly breath and brace your core tightly (Valsalva maneuver).',
      'Hinge hips back and bend knees, descending smoothly until hip crease reaches knee level.',
      'Drive powerfully through your heels and mid-foot to return to full standing position.'
    ],
    breathingInstructions: 'Inhale deeply into your abdomen before descending; hold pressure through bottom turn; exhale past the sticking point.',
    formCues: [
      'Keep chest tall and proud throughout descent.',
      'Knees must track in line with your 2nd and 3rd toes—never let them cave inward.',
      'Maintain full contact with heels, big toe, and pinky toe (tripod foot).'
    ],
    commonMistakes: [
      {
        mistake: 'Knee valgus (knees caving inward)',
        correction: 'Push knees outward actively along your toe line during both descent and ascent.',
        whyItMatters: 'Knee collapse places severe shear stress on the ACL and meniscus.',
        visualWarning: 'Knees buckling inward toward each other at bottom of squat.'
      },
      {
        mistake: 'Excessive forward torso lean / Good Morning Squat',
        correction: 'Keep chest upright, elbows pulled under bar, and drive hips forward under shoulders.',
        whyItMatters: 'Excessive lean turns the squat into a lower back strain and loses quad recruitment.',
        visualWarning: 'Torso collapsing forward with hips rising much faster than shoulders.'
      },
      {
        mistake: 'Heels lifting off the ground',
        correction: 'Elevate heels with Olympic lifting shoes or plates, and focus on sitting hips between heels.',
        whyItMatters: 'Lifting heels reduces balance and overloads patellar tendon.',
        visualWarning: 'Heels coming off floor, shifting all weight onto toes.'
      }
    ],
    safetyNotes: ['Always set safety catch bars at just below your parallel squat depth.'],
    estimatedCaloriesBurned: 155
  },
  {
    name: 'Romanian Dumbbell Deadlift (RDL)',
    splitId: 'legs',
    splitName: 'Legs',
    category: 'Quads, Hamstrings & Calves',
    movementType: 'Hip Hinge Hypertrophy',
    primaryMuscles: ['Hamstrings (Biceps Femoris & Semitendinosus)', 'Gluteus Maximus'],
    secondaryMuscles: ['Erector Spinae', 'Adductors', 'Grip Forearms'],
    equipment: ['Dumbbells', 'Mat'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '10-12',
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
      { phaseNumber: 5, name: 'Glute Drive Forward', cue: 'Drive hips forward, squeezing glutes to return to standing lockout.', durationSecs: 1 },
      { phaseNumber: 6, name: 'Lockout & Reset', cue: 'Stand tall with neutral pelvis and prepare next rep.', durationSecs: 1 }
    ],
    instructions: [
      'Hold a pair of dumbbells in front of your thighs with a neutral/overhand grip.',
      'Set feet hip-width apart and establish a slight bend in your knees.',
      'Push your hips backward while maintaining a flat back and proud chest.',
      'Allow the dumbbells to slide down the front of your legs until you feel a deep stretch in hamstrings.',
      'Drive your hips forward and contract your glutes to return to standing.'
    ],
    breathingInstructions: 'Inhale on the 3-second descent as hips hinge back; exhale as you drive hips forward to lockout.',
    formCues: [
      'Movement is pure hip hinge—knees stay softly bent at a fixed angle.',
      'Keep dumbbells skimming close to shins.',
      'Stop descent when hips stop moving backward; do not reach with lower back.'
    ],
    commonMistakes: [
      {
        mistake: 'Rounding lower spine to reach floor',
        correction: 'Stop descent as soon as hips reach maximum backward travel (usually mid-shin).',
        whyItMatters: 'Reaching lower bends the lumbar spine under load rather than loading hamstrings.',
        visualWarning: 'Spine curving forward into flexion at bottom.'
      }
    ],
    safetyNotes: ['Keep shoulder blades retracted and lats tight so dumbbells do not drift away from body.'],
    estimatedCaloriesBurned: 135
  },
  {
    name: 'Walking Dumbbell Lunge',
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
    formCues: [
      'Keep torso upright with slight forward lean for glute bias.',
      'Front knee must track over toes without bowing inward.',
      'Do not let trailing knee slam into the hard floor.'
    ],
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

  // -------------------------------------------------------------
  // 4. FULL BODY / CORE / MOBILITY / CARDIO SPLITS
  // -------------------------------------------------------------
  {
    name: 'Kettlebell Russian Swing',
    splitId: 'cardio',
    splitName: 'Cardio',
    category: 'Metabolic & VO2 Max',
    movementType: 'Explosive Hip Hinge',
    primaryMuscles: ['Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Erector Spinae', 'Lats', 'Core', 'Cardiovascular System'],
    equipment: ['Kettlebell'],
    difficulty: 'Intermediate',
    sets: 4,
    reps: '20 Reps',
    restSeconds: 60,
    tempo: '1-0-1',
    recommendedAngle: 'side',
    animationType: 'deadlift',
    setupAngle: 0,
    coachSpeech: 'Stand over kettlebell. Hinge hips back, hike kettlebell between legs. Snap hips forward explosively driving the kettlebell to chest height using glute power, not arm lifting.',
    phases: [
      { phaseNumber: 1, name: 'Hike Setup', cue: 'Stand half step behind bell, hinge at hips and tilt kettlebell back toward you.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Back Hike', cue: 'Hike kettlebell high between upper thighs close to groin with flat back.', durationSecs: 1 },
      { phaseNumber: 3, name: 'Explosive Hip Snap', cue: 'Drive feet into floor and snap hips forward violently to standing plank.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Float Apex', cue: 'Kettlebell floats weightlessly to chest height propelled purely by hip drive.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Hinge Catch & Recoil', cue: 'Wait for bell to fall close to hips before hinging back into next hike.', durationSecs: 1 }
    ],
    instructions: [
      'Stand with feet slightly wider than shoulder-width, kettlebell one foot in front of you.',
      'Hinge at hips, reach forward with both hands, and tilt kettlebell toward you.',
      'Hike the kettlebell back between your upper thighs like a football snap.',
      'Snap your hips forward violently, squeezing glutes and standing tall in a plank.',
      'Allow the kettlebell to float to chest level with relaxed arms.',
      'Guide the kettlebell back between your thighs as hips hinge back, repeating rhythmically.'
    ],
    breathingInstructions: 'Inhale sharply on the back hike; exhale with a sharp hiss as you snap hips forward.',
    formCues: [
      'This is a hip hinge power movement, not a squat.',
      'Arms are purely ropes/cables—never front raise the bell with shoulders.',
      'Lock glutes and abs hard at the top standing plank.'
    ],
    commonMistakes: [
      {
        mistake: 'Squatting instead of hinging',
        correction: 'Keep knees softly bent and push hips horizontally backward rather than dropping hips down.',
        whyItMatters: 'Squatting ruins hip power generation and strains knees.',
        visualWarning: 'Knees bending deeply into a front squat pattern.'
      }
    ],
    safetyNotes: ['Keep a firm double overhand grip on the kettlebell handle.'],
    estimatedCaloriesBurned: 140
  },
  {
    name: 'Ab Wheel Rollout',
    splitId: 'core',
    splitName: 'Core',
    category: 'Abs & Obliques',
    movementType: 'Anti-Extension Core',
    primaryMuscles: ['Rectus Abdominis (Deep Core)'],
    secondaryMuscles: ['Transverse Abdominis', 'Lats', 'Serratus Anterior'],
    equipment: ['Ab Wheel Roller', 'Knee Mat'],
    difficulty: 'Advanced',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    tempo: '3-1-1',
    recommendedAngle: 'side',
    animationType: 'plank',
    setupAngle: 0,
    coachSpeech: 'Kneel with hands on ab wheel under shoulders. Tuck pelvis and round upper back slightly. Roll the wheel forward smoothly extending your body. Pull back using abdominal contraction, not hip pulling.',
    phases: [
      { phaseNumber: 1, name: 'Kneeling Hollow Body Setup', cue: 'Kneel on mat, grip handles under shoulders, tuck pelvis into posterior pelvic tilt.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Controlled Rollout Descent', cue: 'Roll wheel forward slowly, extending hips and arms in straight line over 3 seconds.', durationSecs: 3 },
      { phaseNumber: 3, name: 'Max Anti-Extension Stretch', cue: 'Hold near floor without letting lumbar spine sag or hyperextend.', durationSecs: 1 },
      { phaseNumber: 4, name: 'Abdominal Pull-Back', cue: 'Contract abs forcefully to pull wheel back under shoulders.', durationSecs: 1 },
      { phaseNumber: 5, name: 'Reset Hollow Position', cue: 'Re-establish posterior tilt and repeat.', durationSecs: 1 }
    ],
    instructions: [
      'Kneel on a comfortable mat with hands grasping the ab wheel handles directly under shoulders.',
      'Round your upper back slightly and tuck your pelvis into a hollow-body position.',
      'Roll the wheel forward smoothly, allowing hips and torso to extend toward the floor.',
      'Maintain continuous abdominal bracing without letting your lower back sag.',
      'Pull back by crunching your abs and bringing the wheel back under your chest.'
    ],
    breathingInstructions: 'Inhale as you roll forward into the extension; exhale forcefully as you pull the wheel back.',
    formCues: [
      'Keep pelvis tucked under (posterior pelvic tilt).',
      'Do not allow lower back to dip or sway into extension.',
      'Pull back using abdominal flex, not by sitting hips back onto heels.'
    ],
    commonMistakes: [
      {
        mistake: 'Sagging lower back (lumbar hyperextension)',
        correction: 'Shorten your rollout distance until core can maintain a locked hollow body posture.',
        whyItMatters: 'Sagging transfers immense shear force directly into lumbar vertebrae.',
        visualWarning: 'Stomach sagging toward floor with arched lower spine.'
      }
    ],
    safetyNotes: ['Start with partial rollouts against a wall stop before attempting full extension.'],
    estimatedCaloriesBurned: 75
  },
  {
    name: 'World Greatest Stretch Flow',
    splitId: 'mobility',
    splitName: 'Mobility & Stretching',
    category: 'Fascial & Joint Health',
    movementType: 'Multi-Planar Joint Mobility',
    primaryMuscles: ['Hip Flexors', 'Thoracic Spine', 'Hamstrings', 'Adductors'],
    secondaryMuscles: ['Ankles', 'Glutes', 'Shoulder Girdle'],
    equipment: ['Exercise Mat'],
    difficulty: 'Beginner',
    sets: 3,
    reps: '5 Reps / Side',
    restSeconds: 45,
    tempo: '3-2-2',
    recommendedAngle: '45-degree',
    animationType: 'lunge',
    setupAngle: 0,
    coachSpeech: 'Step into a deep runner lunge. Place both hands inside front foot. Lower inside elbow toward instep for a deep hip opener, then rotate arm up toward ceiling following with your eyes to open thoracic spine.',
    phases: [
      { phaseNumber: 1, name: 'Deep Runner Lunge', cue: 'Step right foot forward into deep lunge, hands on floor inside front foot.', durationSecs: 2 },
      { phaseNumber: 2, name: 'Elbow-to-Instep Sink', cue: 'Sink inside right elbow toward floor near right instep feeling deep hip flexor stretch.', durationSecs: 3 },
      { phaseNumber: 3, name: 'Thoracic Spine Rotation', cue: 'Rotate right hand up toward ceiling opening chest and following hand with eyes.', durationSecs: 2 },
      { phaseNumber: 4, name: 'Apex Rotation Breath', cue: 'Hold open chest stretch for 2 deep nasal breaths.', durationSecs: 2 },
      { phaseNumber: 5, name: 'Hamstring Rockback', cue: 'Place hand down, rock hips back to straighten front leg for hamstring stretch.', durationSecs: 2 },
      { phaseNumber: 6, name: 'Switch Sides', cue: 'Step back to plank and switch to opposite leg.', durationSecs: 2 }
    ],
    instructions: [
      'Start in a push-up plank position on a comfortable mat.',
      'Step your right foot forward outside your right hand into a deep runner lunge.',
      'Drop your right elbow down toward the inside of your right ankle and hold for 2 seconds.',
      'Rotate your right arm and chest up toward the ceiling, following your hand with your eyes.',
      'Place your right hand back down, shift hips back, and extend your front knee for a hamstring stretch.',
      'Return to plank and repeat on the left side.'
    ],
    breathingInstructions: 'Breathe deeply through your nose; expand your ribcage on the rotational reach.',
    formCues: [
      'Keep back leg active and knee elevated off floor if possible.',
      'Rotate from your mid-back (thoracic spine), not just the shoulder joint.',
      'Move with smooth, continuous cadence.'
    ],
    commonMistakes: [
      {
        mistake: 'Cranying neck without thoracic spine rotation',
        correction: 'Rotate your entire ribcage toward ceiling rather than just throwing your arm back.',
        whyItMatters: 'Opening from the mid-back mobilizes thoracic vertebrae.',
        visualWarning: 'Chest facing floor while arm is pulled back awkwardly.'
      }
    ],
    safetyNotes: ['If hip mobility is restricted, rest back knee on floor for extra stability.'],
    estimatedCaloriesBurned: 45
  }
];
