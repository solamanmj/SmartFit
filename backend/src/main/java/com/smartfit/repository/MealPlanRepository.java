package com.smartfit.repository;

import com.smartfit.model.MealPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {
    Optional<MealPlan> findFirstByUserEmailOrderByUpdatedAtDesc(String userEmail);
    Optional<MealPlan> findFirstByUserEmailAndStatusOrderByUpdatedAtDesc(String userEmail, String status);
    List<MealPlan> findByNutritionistEmail(String nutritionistEmail);
    List<MealPlan> findByUserEmail(String userEmail);
}
