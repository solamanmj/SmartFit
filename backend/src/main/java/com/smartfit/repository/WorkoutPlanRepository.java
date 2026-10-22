package com.smartfit.repository;

import com.smartfit.model.WorkoutPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlan, String> {
    List<WorkoutPlan> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<WorkoutPlan> findByTrainerEmailOrderByCreatedAtDesc(String trainerEmail);
    List<WorkoutPlan> findByStatusOrderByCreatedAtDesc(String status);
    Optional<WorkoutPlan> findFirstByUserEmailAndStatusOrderByCreatedAtDesc(String userEmail, String status);
}
