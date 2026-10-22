package com.smartfit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    private final List<Map<String, Object>> splitsList = new ArrayList<>();
    private final List<Map<String, Object>> exercisesDatabase = new ArrayList<>();

    public ExerciseController() {
        initSplits();
        initExercises();
    }

    private void initSplits() {
        splitsList.add(createSplit("full_body", "Full Body", "General & Hypertrophy", "Zap", 6, "Total kinetic chain stimulation recruiting major compound muscle groups in a single balanced session."));
        splitsList.add(createSplit("push", "Push", "Chest, Shoulders & Triceps", "Flame", 6, "Anterior chain pressing mechanics targeting pectorals, anterior/lateral deltoids, and triceps."));
        splitsList.add(createSplit("pull", "Pull", "Back, Rear Delts & Biceps", "Activity", 6, "Posterior upper kinetic chain movements emphasizing lats, rhomboids, trapezius, and elbow flexors."));
        splitsList.add(createSplit("legs", "Legs", "Quads, Hamstrings & Calves", "Dumbbell", 6, "Lower body foundation split focusing on knee extension, hip hinge, and plantarflexion power."));
        splitsList.add(createSplit("upper_body", "Upper Body", "Thoracic & Arm Musculature", "Layers", 6, "Synergistic upper body hypertrophy protocol pairing horizontal/vertical push-pull patterns."));
        splitsList.add(createSplit("lower_body", "Lower Body", "Pelvic & Lower Extremity", "Target", 6, "Glute-quad-hamstring overload with dedicated core and unilateral stabilizer work."));
        splitsList.add(createSplit("chest", "Chest", "Pectoralis Major & Minor", "Award", 5, "Targeted clavicular and sternal pectoral hypertrophy via compound presses and flyes."));
        splitsList.add(createSplit("back", "Back", "Lats, Traps & Rhomboids", "ShieldCheck", 5, "V-taper and spinal erector development using vertical and horizontal pulling vectors."));
        splitsList.add(createSplit("shoulders", "Shoulders", "3D Deltoid Complex", "Sparkles", 5, "Tri-planar shoulder development targeting anterior, lateral, and posterior heads."));
        splitsList.add(createSplit("arms", "Arms", "Biceps & Triceps", "Dumbbell", 5, "Direct arm hypertrophy maximizing long/short biceps and all 3 triceps heads."));
        splitsList.add(createSplit("core", "Core", "Abs & Obliques", "Zap", 5, "360-degree spinal stabilization, anti-rotation, and abdominal rectus conditioning."));
        splitsList.add(createSplit("glutes", "Glutes", "Glute Max, Medius & Minimus", "Flame", 5, "Hip extension, abduction, and posterior chain explosive power development."));
        splitsList.add(createSplit("cardio", "Cardio", "Metabolic & VO2 Max", "HeartPulse", 5, "High-efficiency aerobic and anaerobic conditioning protocols for caloric expenditure."));
        splitsList.add(createSplit("mobility", "Mobility & Stretching", "Fascial & Joint Health", "Activity", 5, "Dynamic myofascial release, joint decompression, and active range of motion recovery."));
    }

    private Map<String, Object> createSplit(String id, String name, String category, String icon, int count, String description) {
        Map<String, Object> split = new HashMap<>();
        split.put("id", id);
        split.put("name", name);
        split.put("category", category);
        split.put("icon", icon);
        split.put("count", count);
        split.put("description", description);
        return split;
    }

    private void initExercises() {
        // Barbell Bench Press
        Map<String, Object> benchPress = new HashMap<>();
        benchPress.put("id", "ex-bench-press");
        benchPress.put("name", "Barbell Bench Press");
        benchPress.put("splitId", "push");
        benchPress.put("splitName", "Push");
        benchPress.put("category", "Chest, Shoulders & Triceps");
        benchPress.put("movementType", "Compound Horizontal Push");
        benchPress.put("primaryMuscles", List.of("Mid Sternal Pectoralis Major", "Anterior Deltoids"));
        benchPress.put("secondaryMuscles", List.of("Triceps Brachii", "Serratus Anterior", "Rotator Cuff"));
        benchPress.put("equipment", List.of("Barbell", "Flat Bench", "Weight Plates"));
        benchPress.put("difficulty", "Intermediate");
        benchPress.put("sets", 4);
        benchPress.put("reps", "8-10");
        benchPress.put("restSeconds", 90);
        benchPress.put("tempo", "3-1-1");
        benchPress.put("recommendedAngle", "side");
        benchPress.put("animationType", "flat_bench");
        benchPress.put("setupAngle", 0);
        benchPress.put("coachSpeech", "Set up with eyes under the barbell. Retract and depress your scapulae firmly into the bench. Maintain a 45-degree elbow tuck. Inhale, lower the bar smoothly over 3 seconds to touch mid-chest, pause briefly at the stretch, and press explosively back to lockout.");
        benchPress.put("phases", List.of(
            Map.of("phaseNumber", 1, "name", "Setup & Scapular Retraction", "cue", "Lie flat, pinch shoulder blades together, plant feet firmly into the floor.", "durationSecs", 2),
            Map.of("phaseNumber", 2, "name", "Unrack & Core Brace", "cue", "Unrack bar directly over shoulders, take a diaphragmatic breath and brace abs 360 degrees.", "durationSecs", 2),
            Map.of("phaseNumber", 3, "name", "Controlled 3s Eccentric Descent", "cue", "Lower bar smoothly along a slight J-curve toward your lower sternum with 45° tucked elbows.", "durationSecs", 3),
            Map.of("phaseNumber", 4, "name", "Bottom Chest Touch & Stretch", "cue", "Lightly kiss the bar to your chest without bouncing or losing upper back tension.", "durationSecs", 1),
            Map.of("phaseNumber", 5, "name", "Concentric Explosive Drive", "cue", "Drive through your palms and heels, pressing the bar upward and slightly back toward eye line.", "durationSecs", 1),
            Map.of("phaseNumber", 6, "name", "Lockout & Pectoral Squeeze", "cue", "Lock out elbows with strong chest contraction without rounding shoulders forward.", "durationSecs", 1),
            Map.of("phaseNumber", 7, "name", "Reset & Rep Preparation", "cue", "Stabilize the bar, exhale at top, and prepare the next repetition cadence.", "durationSecs", 1)
        ));
        benchPress.put("formCues", List.of(
            "Maintain a 45-degree elbow angle relative to torso.",
            "Keep shoulder blades pinched tight into the bench.",
            "Drive heels into the floor for leg drive stability.",
            "Do not bounce the barbell off your sternum."
        ));
        benchPress.put("estimatedCaloriesBurned", 130);
        exercisesDatabase.add(benchPress);

        // Barbell Squat
        Map<String, Object> squat = new HashMap<>();
        squat.put("id", "ex-barbell-squat");
        squat.put("name", "Barbell Back Squat");
        squat.put("splitId", "legs");
        squat.put("splitName", "Legs");
        squat.put("category", "Quads, Hamstrings & Calves");
        squat.put("movementType", "Compound Knee Extension & Hip Hinge");
        squat.put("primaryMuscles", List.of("Quadriceps (Rectus Femoris, Vastus Lateralis)", "Gluteus Maximus"));
        squat.put("secondaryMuscles", List.of("Hamstrings", "Erector Spinae", "Transverse Abdominis", "Adductors"));
        squat.put("equipment", List.of("Barbell", "Squat Rack", "Weight Plates"));
        squat.put("difficulty", "Advanced");
        squat.put("sets", 4);
        squat.put("reps", "6-8");
        squat.put("restSeconds", 120);
        squat.put("tempo", "3-1-X");
        squat.put("recommendedAngle", "45");
        squat.put("animationType", "squat");
        squat.put("setupAngle", 45);
        squat.put("coachSpeech", "Step under the bar, rest it securely on your upper traps. Unrack, take two steps back, establish shoulder-width stance with toes slightly flared. Brace your core, hinge at hips and break at knees simultaneously. Descend below parallel keeping chest proud, then drive through the mid-foot explosively back to standing.");
        squat.put("phases", List.of(
            Map.of("phaseNumber", 1, "name", "Barbell Rack Alignment", "cue", "Position bar comfortably on upper trapezius with tight shoulder blade squeeze.", "durationSecs", 2),
            Map.of("phaseNumber", 2, "name", "Stance & Foot Rooting", "cue", "Step back, shoulder-width stance, screw feet into the floor creating hip torque.", "durationSecs", 2),
            Map.of("phaseNumber", 3, "name", "Intra-Abdominal Brace", "cue", "Inhale deep diaphragmatic breath into abdomen and lock ribcage down.", "durationSecs", 1),
            Map.of("phaseNumber", 4, "name", "Controlled Descent Below Parallel", "cue", "Sit hips down and back between ankles over 3 seconds until hip crease is below knee cap.", "durationSecs", 3),
            Map.of("phaseNumber", 5, "name", "Bottom Hole Stabilization", "cue", "Maintain proud chest and neutral spine with knees tracking over toes.", "durationSecs", 1),
            Map.of("phaseNumber", 6, "name", "Explosive Ground Drive", "cue", "Drive floor away through midfoot and heels, firing glutes and quads together.", "durationSecs", 1),
            Map.of("phaseNumber", 7, "name", "Top Lockout & Exhale", "cue", "Stand tall with full hip extension without hyperextending lumbar spine.", "durationSecs", 1)
        ));
        squat.put("formCues", List.of(
            "Drive knees outwards in line with toes throughout the movement.",
            "Descend until hip crease is below top of knee cap.",
            "Maintain neutral spine; avoid lower back rounding (butt wink).",
            "Keep weight distributed evenly across midfoot and heels."
        ));
        squat.put("estimatedCaloriesBurned", 160);
        exercisesDatabase.add(squat);

        // Pull-Up / Lat Pulldown
        Map<String, Object> pullUp = new HashMap<>();
        pullUp.put("id", "ex-pull-up");
        pullUp.put("name", "Strict Pull-Up");
        pullUp.put("splitId", "pull");
        pullUp.put("splitName", "Pull");
        pullUp.put("category", "Back, Rear Delts & Biceps");
        pullUp.put("movementType", "Compound Vertical Pull");
        pullUp.put("primaryMuscles", List.of("Latissimus Dorsi", "Teres Major"));
        pullUp.put("secondaryMuscles", List.of("Biceps Brachii", "Brachialis", "Rhomboids", "Lower Trapezius", "Core"));
        pullUp.put("equipment", List.of("Pull-Up Bar"));
        pullUp.put("difficulty", "Intermediate");
        pullUp.put("sets", 4);
        pullUp.put("reps", "8-12");
        pullUp.put("restSeconds", 90);
        pullUp.put("tempo", "2-1-1");
        pullUp.put("recommendedAngle", "rear");
        pullUp.put("animationType", "pullup");
        pullUp.put("setupAngle", 180);
        pullUp.put("coachSpeech", "Hang from the bar with palms facing away, slightly wider than shoulder width. Depress your scapulae to engage the lats. Pull your chest toward the bar, leading with your elbows driving down toward your hips. Clear your chin over the bar with zero swinging, pause, and lower under complete control.");
        pullUp.put("phases", List.of(
            Map.of("phaseNumber", 1, "name", "Dead Hang Grip Setup", "cue", "Full extension hang with pronated grip and active grip tension.", "durationSecs", 2),
            Map.of("phaseNumber", 2, "name", "Scapular Depression", "cue", "Pull shoulder blades down and back, engaging lats before bending elbows.", "durationSecs", 1),
            Map.of("phaseNumber", 3, "name", "Concentric Lat Drive", "cue", "Drive elbows downward and backward toward back pockets.", "durationSecs", 2),
            Map.of("phaseNumber", 4, "name", "Chin-Over-Bar Peak", "cue", "Clear chin above bar with upper chest touching bar; squeeze lats tightly.", "durationSecs", 1),
            Map.of("phaseNumber", 5, "name", "Controlled Eccentric Lowering", "cue", "Lower over 2 to 3 seconds with full resistance and zero momentum swing.", "durationSecs", 2),
            Map.of("phaseNumber", 6, "name", "Full Lat Stretch Reset", "cue", "Return to active dead hang stretch and prepare next repetition.", "durationSecs", 1)
        ));
        pullUp.put("formCues", List.of(
            "Initiate each rep by pulling shoulder blades down before bending elbows.",
            "Drive elbows straight down into floor; avoid rounding shoulders forward.",
            "Avoid kipping or swinging legs to generate momentum.",
            "Achieve full arm extension at bottom for maximal lat stretch."
        ));
        pullUp.put("estimatedCaloriesBurned", 110);
        exercisesDatabase.add(pullUp);

        // Overhead Press
        Map<String, Object> ohp = new HashMap<>();
        ohp.put("id", "ex-overhead-press");
        ohp.put("name", "Standing Overhead Barbell Press");
        ohp.put("splitId", "shoulders");
        ohp.put("splitName", "Shoulders");
        ohp.put("category", "3D Deltoid Complex");
        ohp.put("movementType", "Compound Vertical Push");
        ohp.put("primaryMuscles", List.of("Anterior Deltoids", "Lateral Deltoids"));
        ohp.put("secondaryMuscles", List.of("Triceps Brachii", "Upper Trapezius", "Core", "Gluteus Maximus"));
        ohp.put("equipment", List.of("Barbell", "Power Rack"));
        ohp.put("difficulty", "Advanced");
        ohp.put("sets", 4);
        ohp.put("reps", "8-10");
        ohp.put("restSeconds", 90);
        ohp.put("tempo", "2-0-1");
        ohp.put("recommendedAngle", "front");
        ohp.put("animationType", "standing_press");
        ohp.put("setupAngle", 0);
        ohp.put("coachSpeech", "Stand tall with bar racked across anterior deltoids and clavicles. Squeeze glutes and abs firmly. Clear your chin by pulling head back slightly, press the bar in a straight vertical line overhead, and push your head through the window at top lockout.");
        ohp.put("phases", List.of(
            Map.of("phaseNumber", 1, "name", "Rack Position & Grip", "cue", "Bar across collarbones, forearms vertical, full grip outside shoulders.", "durationSecs", 2),
            Map.of("phaseNumber", 2, "name", "Glute & Core Lockdown", "cue", "Squeeze glutes rock hard, brace abdominal wall to prevent lumbar hyperextension.", "durationSecs", 1),
            Map.of("phaseNumber", 3, "name", "Head Retraction & Press", "cue", "Tilt head slightly back and press bar straight vertically upward.", "durationSecs", 1),
            Map.of("phaseNumber", 4, "name", "Head Through Window Lockout", "cue", "Lock elbows overhead with bar centered over midfoot and ears.", "durationSecs", 1),
            Map.of("phaseNumber", 5, "name", "Controlled Eccentric Return", "cue", "Lower under control back to clavicular resting shelf.", "durationSecs", 2)
        ));
        ohp.put("formCues", List.of(
            "Keep glutes squeezed throughout to protect the lumbar spine.",
            "Press in a vertical line, tucking head slightly back to clear chin.",
            "Push head through window at top lockout with bar over ears."
        ));
        ohp.put("estimatedCaloriesBurned", 120);
        exercisesDatabase.add(ohp);

        // Barbell Deadlift
        Map<String, Object> deadlift = new HashMap<>();
        deadlift.put("id", "ex-barbell-deadlift");
        deadlift.put("name", "Conventional Barbell Deadlift");
        deadlift.put("splitId", "full_body");
        deadlift.put("splitName", "Full Body");
        deadlift.put("category", "General & Hypertrophy");
        deadlift.put("movementType", "Compound Posterior Hip Hinge");
        deadlift.put("primaryMuscles", List.of("Gluteus Maximus", "Hamstrings", "Erector Spinae"));
        deadlift.put("secondaryMuscles", List.of("Latissimus Dorsi", "Trapezius", "Forearm Flexors", "Quadriceps"));
        deadlift.put("equipment", List.of("Barbell", "Weight Plates", "Chalk / Straps"));
        deadlift.put("difficulty", "Advanced");
        deadlift.put("sets", 4);
        deadlift.put("reps", "5-8");
        deadlift.put("restSeconds", 120);
        deadlift.put("tempo", "2-1-X");
        deadlift.put("recommendedAngle", "side");
        deadlift.put("animationType", "deadlift");
        deadlift.put("setupAngle", 90);
        deadlift.put("coachSpeech", "Stand with feet hip-width apart, bar over midfoot. Hinge at hips to grip the bar. Pull slack out of the barbell, squeeze armpits to lock lats, and drive the floor away with legs until hips and knees lock out simultaneously.");
        deadlift.put("phases", List.of(
            Map.of("phaseNumber", 1, "name", "Midfoot Stance Alignment", "cue", "Shins one inch from bar, feet hip-width under bar.", "durationSecs", 2),
            Map.of("phaseNumber", 2, "name", "Hinge & Grip", "cue", "Bend at hips with flat back, grip bar just outside knees.", "durationSecs", 2),
            Map.of("phaseNumber", 3, "name", "Slack Pull & Lat Wedge", "cue", "Pull chest proud, click bar against plates, engage lats.", "durationSecs", 1),
            Map.of("phaseNumber", 4, "name", "Ground Push Leg Drive", "cue", "Push floor away keeping bar dragging along shins.", "durationSecs", 2),
            Map.of("phaseNumber", 5, "name", "Hip Lockout", "cue", "Stand tall, squeeze glutes at top without leaning backward.", "durationSecs", 1),
            Map.of("phaseNumber", 6, "name", "Hinged Eccentric Lowering", "cue", "Hinge hips back and slide bar down thighs to floor.", "durationSecs", 2)
        ));
        deadlift.put("formCues", List.of(
            "Pull all slack out of the bar before lifting.",
            "Keep barbell dragging directly against shins and thighs.",
            "Maintain flat neutral spine; avoid rounding lumbar vertebrae.",
            "Lock hips and knees simultaneously at the top."
        ));
        deadlift.put("estimatedCaloriesBurned", 180);
        exercisesDatabase.add(deadlift);

        // Bicep Curl
        Map<String, Object> curl = new HashMap<>();
        curl.put("id", "ex-bicep-curl");
        curl.put("name", "Standing Barbell Bicep Curl");
        curl.put("splitId", "arms");
        curl.put("splitName", "Arms");
        curl.put("category", "Biceps & Triceps");
        curl.put("movementType", "Isolation Elbow Flexion");
        curl.put("primaryMuscles", List.of("Biceps Brachii (Long & Short Heads)"));
        curl.put("secondaryMuscles", List.of("Brachialis", "Brachioradialis", "Forearm Flexors"));
        curl.put("equipment", List.of("EZ Curl Bar / Barbell"));
        curl.put("difficulty", "Beginner");
        curl.put("sets", 3);
        curl.put("reps", "10-12");
        curl.put("restSeconds", 60);
        curl.put("tempo", "2-1-1");
        curl.put("recommendedAngle", "front");
        curl.put("animationType", "bicep_curl");
        curl.put("setupAngle", 0);
        curl.put("coachSpeech", "Stand with feet shoulder-width apart, holding barbell with supinated grip. Pin your elbows tight against your ribs. Curl the weight upward focusing on squeezing biceps peak, hold for 1 second, then lower under control over 2 seconds.");
        curl.put("phases", List.of(
            Map.of("phaseNumber", 1, "name", "Supinated Grip Setup", "cue", "Underhand grip shoulder-width, stand tall with chest proud.", "durationSecs", 1),
            Map.of("phaseNumber", 2, "name", "Elbow Pinning", "cue", "Tuck elbows firmly to ribcage; eliminate torso swinging.", "durationSecs", 1),
            Map.of("phaseNumber", 3, "name", "Concentric Curl", "cue", "Contract biceps and curl bar toward upper chest.", "durationSecs", 1),
            Map.of("phaseNumber", 4, "name", "Peak Contraction Squeeze", "cue", "Squeeze biceps hard for 1 full second at top.", "durationSecs", 1),
            Map.of("phaseNumber", 5, "name", "Controlled Eccentric Lower", "cue", "Lower the bar smoothly over 2 full seconds to full extension.", "durationSecs", 2)
        ));
        curl.put("formCues", List.of(
            "Keep elbows fixed in place without drifting forward.",
            "Do not lean back or use momentum to swing the weight.",
            "Achieve full stretch at the bottom of each repetition."
        ));
        curl.put("estimatedCaloriesBurned", 80);
        exercisesDatabase.add(curl);
    }

    @GetMapping("/splits")
    public ResponseEntity<?> getSplits() {
        // Compute actual count per split
        List<Map<String, Object>> result = splitsList.stream().map(s -> {
            String sid = (String) s.get("id");
            long actual = exercisesDatabase.stream().filter(e -> sid.equalsIgnoreCase((String) e.get("splitId"))).count();
            Map<String, Object> copy = new HashMap<>(s);
            copy.put("count", actual > 0 ? (int) actual : (int) s.get("count"));
            return copy;
        }).collect(Collectors.toList());

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("splits", result);
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    public ResponseEntity<?> getExercises(
            @RequestParam(required = false) String splitId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String difficulty) {

        List<Map<String, Object>> filtered = exercisesDatabase.stream().filter(ex -> {
            if (splitId != null && !splitId.isEmpty() && !"all".equalsIgnoreCase(splitId)) {
                String sId = (String) ex.get("splitId");
                if (sId == null || !sId.equalsIgnoreCase(splitId)) return false;
            }
            if (category != null && !category.isEmpty()) {
                String cat = (String) ex.get("category");
                if (cat == null || !cat.toLowerCase().contains(category.toLowerCase())) return false;
            }
            if (difficulty != null && !difficulty.isEmpty()) {
                String diff = (String) ex.get("difficulty");
                if (diff == null || !diff.toLowerCase().contains(difficulty.toLowerCase())) return false;
            }
            if (search != null && !search.isEmpty()) {
                String name = (String) ex.get("name");
                String mType = (String) ex.get("movementType");
                boolean matchName = name != null && name.toLowerCase().contains(search.toLowerCase());
                boolean matchType = mType != null && mType.toLowerCase().contains(search.toLowerCase());
                if (!matchName && !matchType) return false;
            }
            return true;
        }).collect(Collectors.toList());

        // If split filter returned empty, return all exercises for that split or fallback to database
        if (filtered.isEmpty() && (splitId == null || "all".equalsIgnoreCase(splitId))) {
            filtered = new ArrayList<>(exercisesDatabase);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("count", filtered.size());
        resp.put("exercises", filtered);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{idOrName}")
    public ResponseEntity<?> getExerciseByIdOrName(@PathVariable String idOrName) {
        Optional<Map<String, Object>> found = exercisesDatabase.stream().filter(e -> {
            String id = (String) e.get("id");
            String name = (String) e.get("name");
            return (id != null && id.equalsIgnoreCase(idOrName)) ||
                   (name != null && name.equalsIgnoreCase(idOrName)) ||
                   (name != null && name.toLowerCase().replace(" ", "-").contains(idOrName.toLowerCase()));
        }).findFirst();

        if (found.isPresent()) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("exercise", found.get());
            return ResponseEntity.ok(resp);
        }

        // Return first exercise as safe fallback
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("exercise", exercisesDatabase.get(0));
        return ResponseEntity.ok(resp);
    }
}
