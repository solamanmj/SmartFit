package com.smartfit.controller;

import com.smartfit.model.Exercise;
import com.smartfit.model.User;
import com.smartfit.model.WorkoutLog;
import com.smartfit.service.UserService;
import com.smartfit.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserService userService;

    public WorkoutController(WorkoutService workoutService, UserService userService) {
        this.workoutService = workoutService;
        this.userService = userService;
    }

    @GetMapping("/recommend")
    public ResponseEntity<?> getRecommendation(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "john@example.com";
        Optional<User> userOpt = userService.findByEmail(email);

        User user = userOpt.orElseGet(() -> {
            User fallback = new User();
            fallback.setFullName("John Doe");
            fallback.setEmail(email);
            fallback.setAge(26);
            fallback.setGender("Male");
            fallback.setWeight(70.0);
            fallback.setHeight(175.0);
            fallback.setWorkoutEquipment("Dumbbells Only");
            fallback.setFitnessGoal("Weight Loss");
            return fallback;
        });

        Map<String, Object> mlRecommendation = workoutService.getMLWorkoutRecommendation(user);
        return ResponseEntity.ok(mlRecommendation);
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> postRecommendation(@RequestBody Map<String, Object> customProfile, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "john@example.com";
        Optional<User> userOpt = userService.findByEmail(email);

        User user = userOpt.orElseGet(() -> {
            User fallback = new User();
            fallback.setFullName("John Doe");
            fallback.setEmail(email);
            return fallback;
        });

        if (customProfile.containsKey("fitnessGoal")) {
            user.setFitnessGoal(customProfile.get("fitnessGoal").toString());
        }
        if (customProfile.containsKey("workoutEquipment")) {
            user.setWorkoutEquipment(customProfile.get("workoutEquipment").toString());
        }

        Map<String, Object> mlRecommendation = workoutService.getMLWorkoutRecommendation(user);
        return ResponseEntity.ok(mlRecommendation);
    }

    @GetMapping("/generate")
    public ResponseEntity<?> generateWorkout(@RequestParam(defaultValue = "Full Body") String category, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "john@example.com";
        Optional<User> userOpt = userService.findByEmail(email);

        User user = userOpt.orElseGet(() -> {
            User fallback = new User();
            fallback.setFullName("User");
            fallback.setEmail(email);
            fallback.setWorkoutEquipment("Full Gym Access");
            fallback.setFitnessGoal("Muscle Building");
            return fallback;
        });

        List<Exercise> exercises = workoutService.generateWorkoutForUser(user, category);
        return ResponseEntity.ok(Map.of(
            "category", category,
            "userGoal", user.getFitnessGoal(),
            "equipment", user.getWorkoutEquipment(),
            "exercises", exercises
        ));
    }

    @PostMapping("/log")
    public ResponseEntity<?> logWorkout(@RequestBody Map<String, Object> payload, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : (String) payload.getOrDefault("email", "john@example.com");
        String title = (String) payload.getOrDefault("workoutTitle", "SmartFit Daily Session");
        int duration = Integer.parseInt(payload.getOrDefault("durationMinutes", 45).toString());
        int calories = Integer.parseInt(payload.getOrDefault("caloriesBurned", 350).toString());
        @SuppressWarnings("unchecked")
        List<String> completedExercises = (List<String>) payload.getOrDefault("completedExercises", List.of());

        WorkoutLog savedLog = workoutLogRepositoryLog(email, title, duration, calories, completedExercises);
        return ResponseEntity.ok(Map.of(
            "message", "Workout logged successfully to MongoDB!",
            "log", savedLog
        ));
    }

    private WorkoutLog workoutLogRepositoryLog(String email, String title, int duration, int calories, List<String> completedExercises) {
        return workoutService.logCompletedWorkout(email, title, duration, calories, completedExercises);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestParam(required = false) String email, Authentication authentication) {
        String userEmail = email;
        if (userEmail == null || userEmail.trim().isEmpty()) {
            userEmail = authentication != null ? authentication.getName() : "john@example.com";
        }
        List<WorkoutLog> history = workoutService.getUserWorkoutHistory(userEmail);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/all-logs")
    public ResponseEntity<?> getAllLogs() {
        List<WorkoutLog> allLogs = workoutService.getAllWorkoutLogs();
        return ResponseEntity.ok(allLogs);
    }

    // =========================================================================
    // WORKOUT PLAN PRESCRIPTION & TRAINER APPROVAL ENDPOINTS
    // =========================================================================

    @GetMapping("/my-plan")
    public ResponseEntity<?> getMyActivePlan(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "john@example.com";
        Optional<com.smartfit.model.WorkoutPlan> planOpt = workoutService.getUserActiveWorkoutPlan(email);
        
        if (planOpt.isPresent()) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("hasApprovedPlan", true);
            resp.put("plan", planOpt.get());
            return ResponseEntity.ok(resp);
        }
        
        // Return status if still in review
        List<com.smartfit.model.WorkoutPlan> pendingPlans = workoutService.getTrainerPendingPlans(null);
        boolean isPending = pendingPlans.stream().anyMatch(p -> email.equalsIgnoreCase(p.getUserEmail()));
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("hasApprovedPlan", false);
        resp.put("status", isPending ? "PENDING_TRAINER_REVIEW" : "NO_PLAN");
        resp.put("message", isPending ? "Your AI workout recommendation has been submitted to your assigned coach for professional review and safety approval." : "No active workout plan found. Click generate to start.");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/request-ai-plan")
    public ResponseEntity<?> requestAiPlan(@RequestBody(required = false) Map<String, Object> payload, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "john@example.com";
        Optional<User> userOpt = userService.findByEmail(email);

        User user = userOpt.orElseGet(() -> {
            User fallback = new User();
            fallback.setFullName("Athlete");
            fallback.setEmail(email);
            fallback.setAge(26);
            fallback.setGender("Male");
            fallback.setWeight(70.0);
            fallback.setHeight(175.0);
            fallback.setWorkoutEquipment("Full Gym Access");
            fallback.setFitnessGoal("Muscle Building");
            return fallback;
        });

        String trainerEmail = payload != null && payload.containsKey("trainerEmail") 
            ? (String) payload.get("trainerEmail") 
            : "trainer@smartfit.com";

        com.smartfit.model.WorkoutPlan plan = workoutService.generateAiWorkoutPlanForReview(user, trainerEmail);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "AI Workout Plan generated and submitted for coach review.");
        resp.put("plan", plan);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/trainer/pending-plans")
    public ResponseEntity<?> getTrainerPendingPlans(@RequestParam(required = false) String trainerEmail, Authentication authentication) {
        String tEmail = trainerEmail != null ? trainerEmail : (authentication != null ? authentication.getName() : "trainer@smartfit.com");
        List<com.smartfit.model.WorkoutPlan> plans = workoutService.getTrainerPendingPlans(tEmail);
        return ResponseEntity.ok(plans);
    }

    @PutMapping("/trainer/plans/{planId}/modify")
    public ResponseEntity<?> modifyPlan(@PathVariable String planId, @RequestBody com.smartfit.model.WorkoutPlan updatedPlan) {
        com.smartfit.model.WorkoutPlan plan = workoutService.modifyWorkoutPlan(planId, updatedPlan);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Workout plan successfully updated by coach.");
        resp.put("plan", plan);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/trainer/plans/{planId}/approve")
    public ResponseEntity<?> approvePlan(@PathVariable String planId, @RequestBody(required = false) Map<String, Object> payload) {
        String notes = payload != null && payload.containsKey("trainerNotes") ? (String) payload.get("trainerNotes") : null;
        com.smartfit.model.WorkoutPlan plan = workoutService.approveAndPublishPlan(planId, notes);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Workout plan APPROVED and PUBLISHED to client dashboard!");
        resp.put("plan", plan);
        return ResponseEntity.ok(resp);
    }

    // =========================================================================
    // PROGRESS TRACKING & STREAK ENDPOINTS
    // =========================================================================

    @GetMapping("/progress")
    public ResponseEntity<?> getWorkoutProgress(@RequestParam(required = false) String email, Authentication authentication) {
        String userEmail = email != null ? email : (authentication != null ? authentication.getName() : "john@example.com");
        
        List<WorkoutLog> logs = workoutService.getUserWorkoutHistory(userEmail);
        int totalSessions = logs.size();
        int totalMinutes = logs.stream().mapToInt(WorkoutLog::getDurationMinutes).sum();
        int totalCalories = logs.stream().mapToInt(WorkoutLog::getCaloriesBurned).sum();
        int streakDays = Math.max(1, Math.min(totalSessions, 14));

        Map<String, Object> resp = new HashMap<>();
        resp.put("userEmail", userEmail);
        resp.put("totalSessions", totalSessions);
        resp.put("totalMinutes", totalMinutes);
        resp.put("totalCalories", totalCalories);
        resp.put("streakDays", streakDays);
        resp.put("completedDaysThisWeek", Math.min(totalSessions, 5));
        resp.put("targetDaysPerWeek", 5);
        resp.put("recentLogs", logs.stream().limit(5).collect(java.util.stream.Collectors.toList()));
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/complete-day")
    public ResponseEntity<?> completeWorkoutDay(@RequestBody(required = false) Map<String, Object> payload, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : (payload != null ? (String) payload.getOrDefault("email", "john@example.com") : "john@example.com");
        int dayIndex = payload != null && payload.containsKey("dayIndex") ? Integer.parseInt(payload.get("dayIndex").toString()) : 1;
        String dayTitle = payload != null && payload.containsKey("dayTitle") ? (String) payload.get("dayTitle") : "Workout Day " + dayIndex;

        WorkoutLog log = workoutService.logCompletedWorkout(email, dayTitle, 45, 380, List.of("Session Completed"));
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Workout day marked completed!");
        resp.put("log", log);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset-cycle")
    public ResponseEntity<?> resetCycle(@RequestBody(required = false) Map<String, Object> payload, Authentication authentication) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Workout cycle reset for the new week.");
        return ResponseEntity.ok(resp);
    }
}

