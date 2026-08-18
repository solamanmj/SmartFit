package com.smartfit.repository;

import com.smartfit.model.ExerciseItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseItemRepository extends MongoRepository<ExerciseItem, String> {
    List<ExerciseItem> findByWorkoutType(String workoutType);
}
