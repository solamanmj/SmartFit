package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "nutritionists")
public class Nutritionist {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String qualification;
    private String specialization;
    private int experienceYears;
    private String status = "ACTIVE"; // ACTIVE or INACTIVE
    private String createdAt;

    public Nutritionist() {}

    public Nutritionist(String id, String fullName, String email, String qualification, String specialization, int experienceYears, String status, String createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.qualification = qualification;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
