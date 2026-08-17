package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password;

    // 1. Age
    private int age;

    // 2. Gender
    private String gender;

    // 3. Height (cm)
    private double height;

    // 4. Weight (kg)
    private double weight;

    // 5. Activity Level
    private String activityLevel;

    // 6. Fitness Goal
    private String fitnessGoal;

    // 7. Dietary Preference
    private String dietaryPreference;

    // 8. Workout Equipment
    private String workoutEquipment;

    // 9. Medical Conditions / Past Injuries
    private String medicalConditions;

    // User Role (USER / ADMIN)
    private String role = "USER";

    // Active Session & Login Tracking in MongoDB
    private boolean isLoggedIn = false;
    private String lastLoginTime;

    private int streakDays = 1;
    private int points = 250;

    // Stored persistent metric fields for MongoDB BSON document completeness
    private double bmi;
    private int bmr;
    private int tdee;
    private int targetCalories;
    private int fitnessScore;
    private String bmiCategory;

    public User() {}

    public void recalculateMetrics() {
        this.bmi = calculateBmi();
        this.bmiCategory = calculateBmiCategory();
        this.bmr = calculateBmr();
        this.tdee = calculateTdee();
        this.targetCalories = calculateTargetCalories();
        this.fitnessScore = calculateFitnessScore();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }

    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public String getWorkoutEquipment() { return workoutEquipment; }
    public void setWorkoutEquipment(String workoutEquipment) { this.workoutEquipment = workoutEquipment; }

    public String getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isLoggedIn() { return isLoggedIn; }
    public boolean getIsLoggedIn() { return isLoggedIn; }
    public void setLoggedIn(boolean loggedIn) { isLoggedIn = loggedIn; }

    public String getLastLoginTime() { return lastLoginTime; }
    public void setLastLoginTime(String lastLoginTime) { this.lastLoginTime = lastLoginTime; }

    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    // Calculated Health Profile Metrics (Mifflin-St Jeor & Harris-Benedict formulas)

    public double getBmi() {
        if (bmi <= 0) return calculateBmi();
        return bmi;
    }

    public double calculateBmi() {
        if (height <= 0 || weight <= 0) return 22.5;
        double heightInMeters = height / 100.0;
        return Math.round((weight / (heightInMeters * heightInMeters)) * 10.0) / 10.0;
    }

    public String getBmiCategory() {
        if (bmiCategory == null) return calculateBmiCategory();
        return bmiCategory;
    }

    public String calculateBmiCategory() {
        double bmiVal = calculateBmi();
        if (bmiVal < 18.5) return "Underweight";
        if (bmiVal <= 24.9) return "Normal / Optimal Weight";
        if (bmiVal <= 29.9) return "Overweight";
        return "Obese";
    }

    public int getBmr() {
        if (bmr <= 0) return calculateBmr();
        return bmr;
    }

    public int calculateBmr() {
        if (height <= 0 || weight <= 0 || age <= 0) return 1750;
        double baseBmr = (10 * weight) + (6.25 * height) - (5 * age);
        if ("Female".equalsIgnoreCase(gender)) {
            return (int) Math.round(baseBmr - 161);
        } else if ("Male".equalsIgnoreCase(gender)) {
            return (int) Math.round(baseBmr + 5);
        } else {
            return (int) Math.round(baseBmr - 78);
        }
    }

    public int getTdee() {
        if (tdee <= 0) return calculateTdee();
        return tdee;
    }

    public int calculateTdee() {
        int bmrVal = calculateBmr();
        double multiplier = 1.55;
        if (activityLevel != null) {
            String act = activityLevel.toLowerCase();
            if (act.contains("sedentary")) multiplier = 1.2;
            else if (act.contains("lightly")) multiplier = 1.375;
            else if (act.contains("moderately")) multiplier = 1.55;
            else if (act.contains("very")) multiplier = 1.725;
            else if (act.contains("extremely")) multiplier = 1.9;
        }
        return (int) Math.round(bmrVal * multiplier);
    }

    public int getTargetCalories() {
        if (targetCalories <= 0) return calculateTargetCalories();
        return targetCalories;
    }

    public int calculateTargetCalories() {
        int tdeeVal = calculateTdee();
        if (fitnessGoal != null) {
            String goal = fitnessGoal.toLowerCase();
            if (goal.contains("loss") || goal.contains("fat")) return tdeeVal - 500;
            if (goal.contains("muscle") || goal.contains("hypertrophy") || goal.contains("building")) return tdeeVal + 350;
        }
        return tdeeVal;
    }

    public int getFitnessScore() {
        if (fitnessScore <= 0) return calculateFitnessScore();
        return fitnessScore;
    }

    public int calculateFitnessScore() {
        double bmiVal = calculateBmi();
        int bmiScore = (bmiVal >= 18.5 && bmiVal <= 24.9) ? 30 : (int) Math.max(10, Math.round(30 - Math.abs(bmiVal - 21.7) * 2.5));
        
        int actScore = 20;
        if (activityLevel != null) {
            String act = activityLevel.toLowerCase();
            if (act.contains("very") || act.contains("extremely")) actScore = 25;
            else if (act.contains("moderately")) actScore = 20;
            else if (act.contains("lightly")) actScore = 15;
            else actScore = 10;
        }

        int streakBonus = Math.min(25, (int) Math.round(streakDays * 1.5));
        int healthScore = (medicalConditions == null || medicalConditions.trim().isEmpty() || "none".equalsIgnoreCase(medicalConditions.trim())) ? 20 : 15;

        return Math.min(100, bmiScore + actScore + streakBonus + healthScore);
    }
}
