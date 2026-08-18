package com.smartfit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "nutrition_foods")
public class NutritionFoodItem {

    @Id
    private String id;
    private String name;
    private int calories;
    private double proteinGrams;
    private double carbGrams;
    private double fatGrams;
    private String category;
    private String dietaryCategory;

    public NutritionFoodItem() {}

    public NutritionFoodItem(String id, String name, int calories, double proteinGrams, double carbGrams, double fatGrams, String category, String dietaryCategory) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.proteinGrams = proteinGrams;
        this.carbGrams = carbGrams;
        this.fatGrams = fatGrams;
        this.category = category;
        this.dietaryCategory = dietaryCategory;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public double getProteinGrams() { return proteinGrams; }
    public void setProteinGrams(double proteinGrams) { this.proteinGrams = proteinGrams; }

    public double getCarbGrams() { return carbGrams; }
    public void setCarbGrams(double carbGrams) { this.carbGrams = carbGrams; }

    public double getFatGrams() { return fatGrams; }
    public void setFatGrams(double fatGrams) { this.fatGrams = fatGrams; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDietaryCategory() { return dietaryCategory; }
    public void setDietaryCategory(String dietaryCategory) { this.dietaryCategory = dietaryCategory; }
}
