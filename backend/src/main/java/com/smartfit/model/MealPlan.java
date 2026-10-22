package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "mealPlans")
public class MealPlan {

    @Id
    private String id;

    @Indexed
    private String prescriptionId;

    @Indexed
    private String userEmail;
    private String userName;

    @Indexed
    private String nutritionistEmail;
    private String nutritionistName;

    private String planTitle;
    private String dietaryPreference = "Standard Balanced";
    private String startDate;
    private String endDate;

    private int targetCalories = 2200;
    private int proteinGrams = 140;
    private int carbGrams = 220;
    private int fatGrams = 60;
    private int fiberGrams = 30;
    private double hydrationLiters = 3.5;
    private int calorieTolerancePct = 5;
    private int macroTolerancePct = 10;

    private String notes = "";
    private String clientInstructions = "";
    private String status = "DRAFT"; // DRAFT, VALIDATED, APPROVED, PUBLISHED, REVISED, ARCHIVED
    private int currentVersion = 1;
    private String approvedByEmail;
    private String approvedAt;
    private String publishedAt;
    private String revisionReason = "Initial prescription formulation";

    private List<Map<String, Object>> meals = new ArrayList<>();
    private List<Map<String, Object>> approvedCandidateMeals = new ArrayList<>();
    private List<Map<String, Object>> versionHistory = new ArrayList<>();
    private Map<String, Object> adequacyAudit = new HashMap<>();

    public MealPlan() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getNutritionistEmail() { return nutritionistEmail; }
    public void setNutritionistEmail(String nutritionistEmail) { this.nutritionistEmail = nutritionistEmail; }

    public String getNutritionistName() { return nutritionistName; }
    public void setNutritionistName(String nutritionistName) { this.nutritionistName = nutritionistName; }

    public String getPlanTitle() { return planTitle; }
    public void setPlanTitle(String planTitle) { this.planTitle = planTitle; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public int getTargetCalories() { return targetCalories; }
    public void setTargetCalories(int targetCalories) { this.targetCalories = targetCalories; }

    public int getProteinGrams() { return proteinGrams; }
    public void setProteinGrams(int proteinGrams) { this.proteinGrams = proteinGrams; }

    public int getCarbGrams() { return carbGrams; }
    public void setCarbGrams(int carbGrams) { this.carbGrams = carbGrams; }

    public int getFatGrams() { return fatGrams; }
    public void setFatGrams(int fatGrams) { this.fatGrams = fatGrams; }

    public int getFiberGrams() { return fiberGrams; }
    public void setFiberGrams(int fiberGrams) { this.fiberGrams = fiberGrams; }

    public double getHydrationLiters() { return hydrationLiters; }
    public void setHydrationLiters(double hydrationLiters) { this.hydrationLiters = hydrationLiters; }

    public int getCalorieTolerancePct() { return calorieTolerancePct; }
    public void setCalorieTolerancePct(int calorieTolerancePct) { this.calorieTolerancePct = calorieTolerancePct; }

    public int getMacroTolerancePct() { return macroTolerancePct; }
    public void setMacroTolerancePct(int macroTolerancePct) { this.macroTolerancePct = macroTolerancePct; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getClientInstructions() { return clientInstructions; }
    public void setClientInstructions(String clientInstructions) { this.clientInstructions = clientInstructions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getCurrentVersion() { return currentVersion; }
    public void setCurrentVersion(int currentVersion) { this.currentVersion = currentVersion; }

    public String getApprovedByEmail() { return approvedByEmail; }
    public void setApprovedByEmail(String approvedByEmail) { this.approvedByEmail = approvedByEmail; }

    public String getApprovedAt() { return approvedAt; }
    public void setApprovedAt(String approvedAt) { this.approvedAt = approvedAt; }

    public String getPublishedAt() { return publishedAt; }
    public void setPublishedAt(String publishedAt) { this.publishedAt = publishedAt; }

    public String getRevisionReason() { return revisionReason; }
    public void setRevisionReason(String revisionReason) { this.revisionReason = revisionReason; }

    public List<Map<String, Object>> getMeals() { return meals; }
    public void setMeals(List<Map<String, Object>> meals) { this.meals = meals; }

    public List<Map<String, Object>> getApprovedCandidateMeals() { return approvedCandidateMeals; }
    public void setApprovedCandidateMeals(List<Map<String, Object>> approvedCandidateMeals) { this.approvedCandidateMeals = approvedCandidateMeals; }

    public List<Map<String, Object>> getVersionHistory() { return versionHistory; }
    public void setVersionHistory(List<Map<String, Object>> versionHistory) { this.versionHistory = versionHistory; }

    public Map<String, Object> getAdequacyAudit() { return adequacyAudit; }
    public void setAdequacyAudit(Map<String, Object> adequacyAudit) { this.adequacyAudit = adequacyAudit; }
}
