package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "trainers")
public class Trainer {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String specialization;
    private int experienceYears;
    private int assignedUsersCount;
    private String status = "ACTIVE"; // ACTIVE or INACTIVE
    private String createdAt;

    public Trainer() {}

    public Trainer(String id, String fullName, String email, String specialization, int experienceYears, int assignedUsersCount, String status, String createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
        this.assignedUsersCount = assignedUsersCount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public int getAssignedUsersCount() { return assignedUsersCount; }
    public void setAssignedUsersCount(int assignedUsersCount) { this.assignedUsersCount = assignedUsersCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
