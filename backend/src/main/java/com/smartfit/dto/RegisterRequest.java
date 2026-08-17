package com.smartfit.dto;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;

    private int age = 26;
    private String gender = "Male";
    private double height = 178;
    private double weight = 75;
    private String activityLevel = "Moderately Active";
    private String fitnessGoal = "Muscle Building";
    private String dietaryPreference = "Standard Balanced";
    private String workoutEquipment = "Full Gym Access";
    private String medicalConditions = "None";

    public RegisterRequest() {}

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
}
