package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exercises")
public class ExerciseItem {

    @Id
    private String id;
    private String name;
    private String workoutType;
    private String muscleGroup;
    private String difficulty;
    private String equipmentNeeded;
    private int durationMinutes;
    private int estimatedCaloriesBurned;
    private String instructions;

    public ExerciseItem() {}

    public ExerciseItem(String id, String name, String workoutType, String muscleGroup, String difficulty, String equipmentNeeded, int durationMinutes, int estimatedCaloriesBurned, String instructions) {
        this.id = id;
        this.name = name;
        this.workoutType = workoutType;
        this.muscleGroup = muscleGroup;
        this.difficulty = difficulty;
        this.equipmentNeeded = equipmentNeeded;
        this.durationMinutes = durationMinutes;
        this.estimatedCaloriesBurned = estimatedCaloriesBurned;
        this.instructions = instructions;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWorkoutType() { return workoutType; }
    public void setWorkoutType(String workoutType) { this.workoutType = workoutType; }

    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getEquipmentNeeded() { return equipmentNeeded; }
    public void setEquipmentNeeded(String equipmentNeeded) { this.equipmentNeeded = equipmentNeeded; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getEstimatedCaloriesBurned() { return estimatedCaloriesBurned; }
    public void setEstimatedCaloriesBurned(int estimatedCaloriesBurned) { this.estimatedCaloriesBurned = estimatedCaloriesBurned; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}
