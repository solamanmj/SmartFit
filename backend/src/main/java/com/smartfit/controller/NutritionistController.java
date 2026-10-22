package com.smartfit.controller;

import com.smartfit.model.MealSchedule;
import com.smartfit.model.MealPlan;
import com.smartfit.model.ChatMessage;
import com.smartfit.model.User;
import com.smartfit.service.NutritionistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nutritionist")
@CrossOrigin(origins = "*")
public class NutritionistController {

    private final NutritionistService nutritionistService;

    public NutritionistController(NutritionistService nutritionistService) {
        this.nutritionistService = nutritionistService;
    }

    private String resolveNutritionistEmail(Principal principal, String emailParam) {
        if (principal != null && principal.getName() != null) {
            return principal.getName();
        }
        if (emailParam != null && !emailParam.trim().isEmpty()) {
            return emailParam.trim();
        }
        return "sruthy@example.com";
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            Principal principal,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        return ResponseEntity.ok(nutritionistService.getDashboardStats(nutriEmail));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAssignedUsers(
            Principal principal,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        return ResponseEntity.ok(nutritionistService.getAssignedClients(nutriEmail));
    }

    @GetMapping("/users/{clientEmail}")
    public ResponseEntity<?> getClientAssessment(
            Principal principal,
            @PathVariable String clientEmail,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        if (!nutritionistService.isClientAssignedToNutritionist(clientEmail, nutriEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "FORBIDDEN", "message", "Client is not assigned to authenticated nutritionist."));
        }
        Map<String, Object> assessment = nutritionistService.getClientClinicalAssessment(clientEmail);
        if (assessment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(assessment);
    }

    @GetMapping("/meal-plans")
    public ResponseEntity<List<MealPlan>> getMealPlans(
            Principal principal,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        return ResponseEntity.ok(nutritionistService.getMealPlansByNutritionist(nutriEmail, status));
    }

    @PutMapping("/meal-plans/{email}/status")
    public ResponseEntity<?> updateMealPlanStatus(
            Principal principal,
            @PathVariable String email,
            @RequestBody Map<String, Object> body,
            @RequestParam(required = false) String nutriEmailParam) {
        String nutriEmail = resolveNutritionistEmail(principal, nutriEmailParam);
        String status = (String) body.get("status");
        try {
            MealPlan plan = nutritionistService.updateMealPlanStatus(email, status, nutriEmail);
            return ResponseEntity.ok(Map.of("message", "Meal plan transitioned to " + status, "plan", plan));
        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "FORBIDDEN", "message", se.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "UPDATE_ERROR", "message", e.getMessage()));
        }
    }

    @PostMapping("/meal-plans")
    public ResponseEntity<?> saveMealPlan(
            Principal principal,
            @RequestBody MealPlan plan,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        try {
            MealPlan saved = nutritionistService.saveMealPlan(plan, nutriEmail);
            return ResponseEntity.ok(Map.of("message", "Prescription saved successfully.", "plan", saved));
        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "FORBIDDEN", "message", se.getMessage()));
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(Map.of("error", "SAFETY_VIOLATION", "message", iae.getMessage()));
        }
    }

    @PostMapping("/meal-plans/shuffle-rotation")
    public ResponseEntity<?> shuffleRotation(
            Principal principal,
            @RequestBody Map<String, Object> body,
            @RequestParam(required = false) String email) {
        String clientEmail = (String) body.get("userEmail");
        String targetDate = (String) body.get("targetDate");
        boolean saveSchedule = Boolean.TRUE.equals(body.get("saveSchedule"));
        String bodyNutri = (String) body.get("nutritionistEmail");
        String nutriEmail = resolveNutritionistEmail(principal, bodyNutri != null ? bodyNutri : email);

        try {
            MealSchedule schedule = nutritionistService.generateAndSaveMealSchedule(clientEmail, targetDate, saveSchedule, nutriEmail);
            if (saveSchedule) {
                return ResponseEntity.ok(Map.of("message", "Daily meal schedule published successfully.", "schedule", schedule));
            } else {
                return ResponseEntity.ok(Map.of("message", "Generated rotation preview.", "previewSchedule", schedule));
            }
        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "FORBIDDEN", "message", se.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "ROTATION_ERROR", "message", e.getMessage()));
        }
    }

    @GetMapping("/meal-schedules/{userEmail}/{date}")
    public ResponseEntity<?> getMealSchedule(
            Principal principal,
            @PathVariable String userEmail,
            @PathVariable String date,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        if (!nutritionistService.isClientAssignedToNutritionist(userEmail, nutriEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "FORBIDDEN", "message", "Client is not assigned to authenticated nutritionist."));
        }
        MealSchedule schedule = nutritionistService.getMealScheduleForUser(userEmail, date);
        return ResponseEntity.ok(schedule != null ? schedule : Map.of());
    }

    @GetMapping("/chat/conversation/{clientEmail}")
    public ResponseEntity<?> getChatHistory(
            Principal principal,
            @PathVariable String clientEmail,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        if (!nutritionistService.isClientAssignedToNutritionist(clientEmail, nutriEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "FORBIDDEN", "message", "Client is not assigned to authenticated nutritionist."));
        }
        List<ChatMessage> messages = nutritionistService.getChatHistory(clientEmail, nutriEmail);
        return ResponseEntity.ok(Map.of("clientEmail", clientEmail, "specialistEmail", nutriEmail, "messages", messages));
    }

    @PostMapping("/chat/messages")
    public ResponseEntity<?> sendChatMessage(
            Principal principal,
            @RequestBody ChatMessage message,
            @RequestParam(required = false) String email) {
        String nutriEmail = resolveNutritionistEmail(principal, email);
        message.setSenderEmail(nutriEmail);
        message.setSenderRole("NUTRITIONIST");
        if (!nutritionistService.isClientAssignedToNutritionist(message.getClientEmail(), nutriEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "FORBIDDEN", "message", "Client is not assigned to authenticated nutritionist."));
        }
        ChatMessage saved = nutritionistService.sendChatMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
