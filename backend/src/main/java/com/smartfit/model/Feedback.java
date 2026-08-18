package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "feedback")
public class Feedback {

    @Id
    private String id;
    private String userEmail;
    private int rating; // 1 to 5
    private String feedbackCategory; // Recommendation Accuracy, UI/UX, Workout Plan, Nutrition Plan
    private String recommendationType; // WORKOUT or NUTRITION
    private String comments;
    private String createdAt;

    public Feedback() {}

    public Feedback(String id, String userEmail, int rating, String feedbackCategory, String recommendationType, String comments, String createdAt) {
        this.id = id;
        this.userEmail = userEmail;
        this.rating = rating;
        this.feedbackCategory = feedbackCategory;
        this.recommendationType = recommendationType;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getFeedbackCategory() { return feedbackCategory; }
    public void setFeedbackCategory(String feedbackCategory) { this.feedbackCategory = feedbackCategory; }

    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
