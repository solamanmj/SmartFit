package com.smartfit.model;

public class Exercise {
    private String id;
    private String name;
    private int sets;
    private String reps;
    private String targetMuscle;
    private String equipmentNeeded;
    private String instructions;
    private int estimatedCaloriesBurned;
    private boolean completed = false;

    public Exercise() {}

    public Exercise(String id, String name, int sets, String reps, String targetMuscle, String equipmentNeeded, String instructions, int estimatedCaloriesBurned) {
        this.id = id;
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.targetMuscle = targetMuscle;
        this.equipmentNeeded = equipmentNeeded;
        this.instructions = instructions;
        this.estimatedCaloriesBurned = estimatedCaloriesBurned;
        this.completed = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getSets() { return sets; }
    public void setSets(int sets) { this.sets = sets; }

    public String getReps() { return reps; }
    public void setReps(String reps) { this.reps = reps; }

    public String getTargetMuscle() { return targetMuscle; }
    public void setTargetMuscle(String targetMuscle) { this.targetMuscle = targetMuscle; }

    public String getEquipmentNeeded() { return equipmentNeeded; }
    public void setEquipmentNeeded(String equipmentNeeded) { this.equipmentNeeded = equipmentNeeded; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public int getEstimatedCaloriesBurned() { return estimatedCaloriesBurned; }
    public void setEstimatedCaloriesBurned(int estimatedCaloriesBurned) { this.estimatedCaloriesBurned = estimatedCaloriesBurned; }

    public boolean isCompleted() { return completed; }
    public boolean getCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
