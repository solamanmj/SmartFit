package com.smartfit.controller;

import com.smartfit.model.User;
import com.smartfit.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        try {
            userService.deleteUser(email);
            return ResponseEntity.ok(java.util.Map.of("message", "User account " + email + " successfully deleted from MongoDB database.", "email", email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestParam String email, @RequestBody User profileData) {
        try {
            User updatedUser = userService.updateUserProfile(email, profileData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/health-profile")
    public ResponseEntity<?> getHealthProfile(@RequestParam String email) {
        User u = userService.findByEmail(email).orElseGet(() -> {
            User defaultUser = new User();
            defaultUser.setEmail(email);
            defaultUser.setFullName(email != null && email.contains("@") ? email.split("@")[0] : "Alex Morgan");
            defaultUser.setAge(26);
            defaultUser.setGender("Male");
            defaultUser.setHeight(178);
            defaultUser.setWeight(75);
            defaultUser.setActivityLevel("Moderately Active");
            defaultUser.setFitnessGoal("Muscle Building");
            defaultUser.setDietaryPreference("Standard Balanced");
            defaultUser.setWorkoutEquipment("Full Gym Access");
            defaultUser.setMedicalConditions("None");
            defaultUser.setStreakDays(14);
            defaultUser.setPoints(1450);
            return defaultUser;
        });

        double heightM = u.getHeight() > 0 ? u.getHeight() / 100.0 : 1.78;
        double bmi = u.getWeight() / (heightM * heightM);
        bmi = Math.round(bmi * 10.0) / 10.0;

        String bmiCategory;
        if (bmi < 18.5) bmiCategory = "Underweight";
        else if (bmi <= 24.9) bmiCategory = "Normal Weight";
        else if (bmi <= 29.9) bmiCategory = "Overweight";
        else bmiCategory = "Obese";

        double weight = u.getWeight() > 0 ? u.getWeight() : 75;
        double height = u.getHeight() > 0 ? u.getHeight() : 178;
        int age = u.getAge() > 0 ? u.getAge() : 26;
        boolean isFemale = "Female".equalsIgnoreCase(u.getGender());

        int bmr = (int) Math.round((10 * weight) + (6.25 * height) - (5 * age) + (isFemale ? -161 : 5));

        double actMult = 1.55;
        if ("Sedentary".equalsIgnoreCase(u.getActivityLevel())) actMult = 1.2;
        else if ("Lightly Active".equalsIgnoreCase(u.getActivityLevel())) actMult = 1.375;
        else if ("Moderately Active".equalsIgnoreCase(u.getActivityLevel())) actMult = 1.55;
        else if ("Very Active".equalsIgnoreCase(u.getActivityLevel())) actMult = 1.725;
        else if ("Extra Active".equalsIgnoreCase(u.getActivityLevel())) actMult = 1.9;

        int tdee = (int) Math.round(bmr * actMult);

        int targetCalories = tdee;
        if ("Weight Loss".equalsIgnoreCase(u.getFitnessGoal()) || "Fat Loss".equalsIgnoreCase(u.getFitnessGoal())) {
            targetCalories = tdee - 500;
        } else if ("Muscle Building".equalsIgnoreCase(u.getFitnessGoal()) || "Weight Gain".equalsIgnoreCase(u.getFitnessGoal())) {
            targetCalories = tdee + 350;
        }

        int proteinGrams = (int) Math.round(weight * 2.2);
        int fatGrams = (int) Math.round((targetCalories * 0.25) / 9.0);
        int carbGrams = (int) Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4.0);

        // Fitness Score calculation (0 - 100)
        double bmiScore = (bmi >= 18.5 && bmi <= 24.9) ? 30.0 : Math.max(10.0, 30.0 - Math.abs(bmi - 21.7) * 2.5);
        double actScore = actMult >= 1.725 ? 25.0 : (actMult >= 1.55 ? 20.0 : (actMult >= 1.375 ? 15.0 : 10.0));
        double streakBonus = Math.min(25.0, u.getStreakDays() * 1.5);
        double healthRiskScore = ("None".equalsIgnoreCase(u.getMedicalConditions()) || u.getMedicalConditions() == null) ? 20.0 : 15.0;

        int fitnessScore = (int) Math.min(100, Math.round(bmiScore + actScore + streakBonus + healthRiskScore));

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("user", u);
        response.put("bmi", bmi);
        response.put("bmiCategory", bmiCategory);
        response.put("bmr", bmr);
        response.put("tdee", tdee);
        response.put("targetCalories", targetCalories);
        response.put("proteinGrams", proteinGrams);
        response.put("carbGrams", carbGrams);
        response.put("fatGrams", fatGrams);
        response.put("fitnessScore", fitnessScore);
        response.put("idealWeightMin", Math.round(18.5 * heightM * heightM * 10.0) / 10.0);
        response.put("idealWeightMax", Math.round(24.9 * heightM * heightM * 10.0) / 10.0);

        return ResponseEntity.ok((Object) response);
    }
}

