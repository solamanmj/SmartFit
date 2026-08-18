package com.smartfit.repository;

import com.smartfit.model.NutritionFoodItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NutritionFoodItemRepository extends MongoRepository<NutritionFoodItem, String> {
    List<NutritionFoodItem> findByCategory(String category);
}
