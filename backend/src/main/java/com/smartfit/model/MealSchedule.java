package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "mealSchedules")
public class MealSchedule {

    @Id
    private String id;

    @Indexed(unique = true)
    private String scheduleId;

    @Indexed
    private String userEmail;
    private String userName;

    @Indexed
    private String nutritionistEmail;
    private String nutritionistName;

    @Indexed
    private String date; // YYYY-MM-DD
    private String prescriptionId;
    private int prescriptionVersion = 1;
    private String algorithmVersion = "DETERMINISTIC_CONSTRAINT_ROTATION_V2";
    private String generationTime;
    private String status = "PUBLISHED";
    private boolean isStable = true;

    private Map<String, Object> validationResult = new HashMap<>();
    private Map<String, Object> targetTotals = new HashMap<>();
    private Map<String, Object> scheduledTotals = new HashMap<>();
    private Map<String, Object> reportedTotals = new HashMap<>();
    private List<Map<String, Object>> slots = new ArrayList<>();

    public MealSchedule() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getScheduleId() { return scheduleId; }
    public void setScheduleId(String scheduleId) { this.scheduleId = scheduleId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getNutritionistEmail() { return nutritionistEmail; }
    public void setNutritionistEmail(String nutritionistEmail) { this.nutritionistEmail = nutritionistEmail; }

    public String getNutritionistName() { return nutritionistName; }
    public void setNutritionistName(String nutritionistName) { this.nutritionistName = nutritionistName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public int getPrescriptionVersion() { return prescriptionVersion; }
    public void setPrescriptionVersion(int prescriptionVersion) { this.prescriptionVersion = prescriptionVersion; }

    public String getAlgorithmVersion() { return algorithmVersion; }
    public void setAlgorithmVersion(String algorithmVersion) { this.algorithmVersion = algorithmVersion; }

    public String getGenerationTime() { return generationTime; }
    public void setGenerationTime(String generationTime) { this.generationTime = generationTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isStable() { return isStable; }
    public void setStable(boolean stable) { isStable = stable; }

    public Map<String, Object> getValidationResult() { return validationResult; }
    public void setValidationResult(Map<String, Object> validationResult) { this.validationResult = validationResult; }

    public Map<String, Object> getTargetTotals() { return targetTotals; }
    public void setTargetTotals(Map<String, Object> targetTotals) { this.targetTotals = targetTotals; }

    public Map<String, Object> getScheduledTotals() { return scheduledTotals; }
    public void setScheduledTotals(Map<String, Object> scheduledTotals) { this.scheduledTotals = scheduledTotals; }

    public Map<String, Object> getReportedTotals() { return reportedTotals; }
    public void setReportedTotals(Map<String, Object> reportedTotals) { this.reportedTotals = reportedTotals; }

    public List<Map<String, Object>> getSlots() { return slots; }
    public void setSlots(List<Map<String, Object>> slots) { this.slots = slots; }
}
