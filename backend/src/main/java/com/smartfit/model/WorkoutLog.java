package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.List;

@Document(collection = "workout_logs")
public class WorkoutLog {

    @Id
    private String id;

    @Indexed
    private String userEmail;
    private String workoutTitle;
    private String date;
    private int durationMinutes;
    private int caloriesBurned;
    private int xpEarned;
    private List<String> completedExercises;

    public WorkoutLog() {}

    public WorkoutLog(String userEmail, String workoutTitle, String date, int durationMinutes, int caloriesBurned, int xpEarned, List<String> completedExercises) {
        this.userEmail = userEmail;
        this.workoutTitle = workoutTitle;
        this.date = date;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.xpEarned = xpEarned;
        this.completedExercises = completedExercises;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getWorkoutTitle() { return workoutTitle; }
    public void setWorkoutTitle(String workoutTitle) { this.workoutTitle = workoutTitle; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(int caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public List<String> getCompletedExercises() { return completedExercises; }
    public void setCompletedExercises(List<String> completedExercises) { this.completedExercises = completedExercises; }
}
