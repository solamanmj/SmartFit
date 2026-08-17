package com.smartfit.controller;

import com.smartfit.model.Exercise;
import com.smartfit.model.User;
import com.smartfit.model.WorkoutLog;
import com.smartfit.service.UserService;
import com.smartfit.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
}
