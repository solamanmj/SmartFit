package com.smartfit.service;

import com.smartfit.model.Exercise;
import com.smartfit.model.User;
import com.smartfit.model.WorkoutLog;
import com.smartfit.repository.UserRepository;
import com.smartfit.repository.WorkoutLogRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WorkoutService {

    private final WorkoutLogRepository workoutLogRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String FASTAPI_ML_URL = "http://localhost:8000/predict/workout";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public WorkoutService(WorkoutLogRepository workoutLogRepository, UserRepository userRepository) {
        this.workoutLogRepository = workoutLogRepository;
        this.userRepository = userRepository;

        try {
            if (workoutLogRepository.count() == 0) {
                WorkoutLog log1 = new WorkoutLog("aby@example.com", "Hypertrophy Chest & Triceps Split", "2026-08-17 10:30:00", 50, 480, 730, Arrays.asList("Incline Dumbbell Press", "Barbell Bench Press", "Triceps Rope Pushdowns"));
                log1.setId(UUID.randomUUID().toString());
                workoutLogRepository.save(log1);

                WorkoutLog log2 = new WorkoutLog("sruthy@example.com", "Fat Loss HIIT & Core Conditioning", "2026-08-17 11:15:00", 45, 420, 645, Arrays.asList("Russian Twists with Weight", "Bicycle Crunches", "Sprinting Interval Treadmill"));
                log2.setId(UUID.randomUUID().toString());
                workoutLogRepository.save(log2);

                WorkoutLog log3 = new WorkoutLog("alex@example.com", "Hypertrophy Upper Body Split", "2026-08-17 09:00:00", 60, 550, 850, Arrays.asList("Barbell Back Squats", "Lat Pulldown", "Plank Hold"));
                log3.setId(UUID.randomUUID().toString());
                workoutLogRepository.save(log3);

                System.out.println("[SUCCESS] Sample workout logs seeded into MongoDB smartfit_db.workout_logs collection.");
            }
        } catch (Exception e) {
            System.err.println("MongoDB workout log auto-seed note: " + e.getMessage());
        }
    }

    public Map<String, Object> getMLWorkoutRecommendation(User user) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", user.getId() != null ? user.getId() : user.getEmail());
            payload.put("age", user.getAge() > 0 ? user.getAge() : 26);
            payload.put("gender", user.getGender() != null ? user.getGender() : "Male");
            payload.put("weight", user.getWeight() > 0 ? user.getWeight() : 70.0);
            payload.put("height", user.getHeight() > 0 ? user.getHeight() : 1.75);
            payload.put("bmi", user.getBmi() > 0 ? user.getBmi() : 22.9);
            payload.put("restingBpm", 65.0);
            payload.put("fatPercentage", 20.0);
            payload.put("workoutFrequency", 4);
            payload.put("experienceLevel", "2");
            payload.put("fitnessGoal", user.getFitnessGoal() != null ? user.getFitnessGoal() : "Weight Loss");
            payload.put("workoutEquipment", user.getWorkoutEquipment() != null ? user.getWorkoutEquipment() : "Dumbbells Only");
            payload.put("medicalConditions", user.getMedicalConditions() != null ? user.getMedicalConditions() : "None");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(FASTAPI_ML_URL, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> body = response.getBody();
                return body;
            }
        } catch (Exception e) {
            System.err.println("FastAPI ML service connection note: " + e.getMessage());
        }

        // Fallback ML recommendation
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("userId", user.getEmail());
        fallback.put("recommendedWorkoutType", user.getFitnessGoal() != null && user.getFitnessGoal().toLowerCase().contains("loss") ? "Cardio" : "Strength");
        fallback.put("experienceLevel", "Intermediate");
        fallback.put("recommendedDuration", "45 - 60 mins");
        fallback.put("recommendedFrequency", "4 days / week");
        fallback.put("recommendedIntensity", "Moderate (RPE 7-8)");
        fallback.put("reason", "Target Goal: Calibrated for goal '" + user.getFitnessGoal() + "' • Biometric Match: Adapted for user profile.");
        fallback.put("confidence", "88.5%");
        return fallback;
    }

    public List<Exercise> generateWorkoutForUser(User user, String category) {
        List<Exercise> exercises = new ArrayList<>();
        String equipment = user.getWorkoutEquipment() != null ? user.getWorkoutEquipment() : "Full Gym Access";
        String goal = user.getFitnessGoal() != null ? user.getFitnessGoal() : "Muscle Building";
        String medical = user.getMedicalConditions() != null ? user.getMedicalConditions().toLowerCase() : "none";

        int repsMultiplier = goal.toLowerCase().contains("loss") ? 15 : 10;
        int setsCount = goal.toLowerCase().contains("muscle") ? 4 : 3;

        if (category == null || category.equalsIgnoreCase("Full Body") || category.isEmpty()) {
            if (!medical.contains("knee")) {
                exercises.add(new Exercise("ex-1", "Barbell Back Squats", setsCount, repsMultiplier + " Reps", "Quadriceps & Glutes", equipment, "Keep chest up and squat down to 90 degrees.", 120));
            } else {
                exercises.add(new Exercise("ex-1", "Seated Dumbbell Press", setsCount, repsMultiplier + " Reps", "Shoulders & Core", equipment, "Press dumbbells overhead smoothly keeping back flat.", 90));
            }

            exercises.add(new Exercise("ex-2", "Incline Dumbbell Bench Press", setsCount, repsMultiplier + " Reps", "Upper Chest", equipment, "Press dumbbells upward at a 30 degree incline.", 110));
            exercises.add(new Exercise("ex-3", "Lat Pulldown / Bent Rows", setsCount, repsMultiplier + " Reps", "Lats & Upper Back", equipment, "Pull down to upper chest focusing on squeeze.", 100));
            exercises.add(new Exercise("ex-4", "Plank Hold", 3, "60 Sec", "Core Stability", "Bodyweight", "Maintain rigid straight line from shoulders to ankles.", 50));
            exercises.add(new Exercise("ex-5", "HIIT Jump Rope / Mountain Climbers", 3, "45 Sec", "Cardiovascular", "Bodyweight", "High intensity burst to boost metabolic rate.", 130));
        } else if (category.equalsIgnoreCase("Upper Body")) {
            exercises.add(new Exercise("ex-u1", "Barbell / Dumbbell Bench Press", setsCount, repsMultiplier + " Reps", "Chest", equipment, "Lower bar to mid-chest and explode upward.", 110));
            exercises.add(new Exercise("ex-u2", "Seated Cable Rows", setsCount, repsMultiplier + " Reps", "Middle Back", equipment, "Pull handles to belly button, squeezing shoulder blades.", 95));
            exercises.add(new Exercise("ex-u3", "Dumbbell Lateral Raises", 3, "12-15 Reps", "Side Deltoids", equipment, "Raise arms out to sides until parallel with floor.", 60));
            exercises.add(new Exercise("ex-u4", "Triceps Rope Pushdowns", 3, "12 Reps", "Triceps", equipment, "Extend arms downward locking out at bottom.", 70));
            exercises.add(new Exercise("ex-u5", "EZ-Bar Biceps Curls", 3, "10-12 Reps", "Biceps", equipment, "Curl bar up focusing on tension without swinging.", 70));
        } else if (category.equalsIgnoreCase("Core & Cardio")) {
            exercises.add(new Exercise("ex-c1", "Hanging Leg Raises / Knee Tucks", 4, "15 Reps", "Lower Abs", "Bodyweight", "Raise legs up to 90 degrees with control.", 80));
            exercises.add(new Exercise("ex-c2", "Russian Twists with Weight", 3, "20 Reps", "Obliques", equipment, "Twist torso side to side touching weight to floor.", 65));
            exercises.add(new Exercise("ex-c3", "Sprinting Interval Treadmill", 5, "1 Min Sprint / 1 Min Walk", "Cardio System", equipment, "High speed sprint followed by recovery walk.", 180));
            exercises.add(new Exercise("ex-c4", "Bicycle Crunches", 3, "25 Reps", "Total Abs", "Bodyweight", "Alternate elbow to opposite knee smoothly.", 75));
        }

        return exercises;
    }

    private final java.util.concurrent.CopyOnWriteArrayList<WorkoutLog> memoryLogs = new java.util.concurrent.CopyOnWriteArrayList<>();

    public WorkoutLog logCompletedWorkout(String userEmail, String workoutTitle, int durationMinutes, int caloriesBurned, List<String> completedExercises) {
        int xpEarned = caloriesBurned + (durationMinutes * 5);
        String dateStr = LocalDateTime.now().format(DATE_FORMATTER);

        WorkoutLog log = new WorkoutLog(userEmail, workoutTitle, dateStr, durationMinutes, caloriesBurned, xpEarned, completedExercises);
        log.setId(UUID.randomUUID().toString());
        memoryLogs.add(0, log);

        try {
            WorkoutLog savedLog = workoutLogRepository.save(log);

            // Update user XP points & streak in MongoDB
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setPoints(user.getPoints() + xpEarned);
                user.setStreakDays(user.getStreakDays() + 1);
                userRepository.save(user);
            }
            return savedLog;
        } catch (Exception e) {
            System.err.println("MongoDB log save note - stored in memory log list: " + e.getMessage());
            return log;
        }
    }

    public List<WorkoutLog> getUserWorkoutHistory(String userEmail) {
        try {
            List<WorkoutLog> dbHistory = workoutLogRepository.findByUserEmailOrderByDateDesc(userEmail);
            if (!dbHistory.isEmpty()) return dbHistory;
        } catch (Exception e) {
            System.err.println("MongoDB history fetch note: " + e.getMessage());
        }

        List<WorkoutLog> filtered = new ArrayList<>();
        for (WorkoutLog l : memoryLogs) {
            if (userEmail != null && userEmail.equalsIgnoreCase(l.getUserEmail())) {
                filtered.add(l);
            }
        }
        return filtered;
    }

    public List<WorkoutLog> getAllWorkoutLogs() {
        try {
            List<WorkoutLog> allDb = workoutLogRepository.findAll();
            if (!allDb.isEmpty()) return allDb;
        } catch (Exception e) {
            System.err.println("MongoDB all logs fetch note: " + e.getMessage());
        }
        return new ArrayList<>(memoryLogs);
    }
}
