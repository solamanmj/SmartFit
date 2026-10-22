package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "workout_plans")
public class WorkoutPlan {

    @Id
    private String id;

    @Indexed
    private String userEmail;
    private String trainerEmail;
    
    private String planTitle;
    private String splitName;
    private String category;
    private String status = "PENDING_TRAINER_REVIEW"; // AI_GENERATED, PENDING_TRAINER_REVIEW, MODIFIED, APPROVED, PUBLISHED, IN_PROGRESS, COMPLETED
    
    private String aiConfidence;
    private String aiReason;
    private String trainerNotes;
    
    private String createdAt;
    private String approvedAt;
    
    private List<PlanExerciseItem> exercises = new ArrayList<>();

    public static class PlanExerciseItem {
        private String exerciseId;
        private String exerciseName;
        private String targetMuscle;
        private String category;
        private String difficulty;
        private int sets;
        private String reps;
        private int restSeconds;
        private double intensityRpe;
        private double confidence;
        private String recommendedAngle = "side";
        private String instructions;
        private boolean completed = false;

        public PlanExerciseItem() {}

        public PlanExerciseItem(String exerciseId, String exerciseName, String targetMuscle, String category, String difficulty, int sets, String reps, int restSeconds, double intensityRpe, double confidence, String recommendedAngle, String instructions) {
            this.exerciseId = exerciseId;
            this.exerciseName = exerciseName;
            this.targetMuscle = targetMuscle;
            this.category = category;
            this.difficulty = difficulty;
            this.sets = sets;
            this.reps = reps;
            this.restSeconds = restSeconds;
            this.intensityRpe = intensityRpe;
            this.confidence = confidence;
            this.recommendedAngle = recommendedAngle;
            this.instructions = instructions;
            this.completed = false;
        }

        public String getExerciseId() { return exerciseId; }
        public void setExerciseId(String exerciseId) { this.exerciseId = exerciseId; }

        public String getExerciseName() { return exerciseName; }
        public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

        public String getTargetMuscle() { return targetMuscle; }
        public void setTargetMuscle(String targetMuscle) { this.targetMuscle = targetMuscle; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

        public int getSets() { return sets; }
        public void setSets(int sets) { this.sets = sets; }

        public String getReps() { return reps; }
        public void setReps(String reps) { this.reps = reps; }

        public int getRestSeconds() { return restSeconds; }
        public void setRestSeconds(int restSeconds) { this.restSeconds = restSeconds; }

        public double getIntensityRpe() { return intensityRpe; }
        public void setIntensityRpe(double intensityRpe) { this.intensityRpe = intensityRpe; }

        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }

        public String getRecommendedAngle() { return recommendedAngle; }
        public void setRecommendedAngle(String recommendedAngle) { this.recommendedAngle = recommendedAngle; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }

    public WorkoutPlan() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTrainerEmail() { return trainerEmail; }
    public void setTrainerEmail(String trainerEmail) { this.trainerEmail = trainerEmail; }

    public String getPlanTitle() { return planTitle; }
    public void setPlanTitle(String planTitle) { this.planTitle = planTitle; }

    public String getSplitName() { return splitName; }
    public void setSplitName(String splitName) { this.splitName = splitName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(String aiConfidence) { this.aiConfidence = aiConfidence; }

    public String getAiReason() { return aiReason; }
    public void setAiReason(String aiReason) { this.aiReason = aiReason; }

    public String getTrainerNotes() { return trainerNotes; }
    public void setTrainerNotes(String trainerNotes) { this.trainerNotes = trainerNotes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getApprovedAt() { return approvedAt; }
    public void setApprovedAt(String approvedAt) { this.approvedAt = approvedAt; }

    public List<PlanExerciseItem> getExercises() { return exercises; }
    public void setExercises(List<PlanExerciseItem> exercises) { this.exercises = exercises; }
}
