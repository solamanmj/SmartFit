package com.smartfit.repository;

import com.smartfit.model.MealSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface MealScheduleRepository extends MongoRepository<MealSchedule, String> {
    Optional<MealSchedule> findByUserEmailAndDate(String userEmail, String date);
    List<MealSchedule> findByUserEmail(String userEmail);
    List<MealSchedule> findByNutritionistEmail(String nutritionistEmail);
}
