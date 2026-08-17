package com.smartfit.repository;

import com.smartfit.model.WorkoutLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutLogRepository extends MongoRepository<WorkoutLog, String> {
    List<WorkoutLog> findByUserEmail(String userEmail);
    List<WorkoutLog> findByUserEmailOrderByDateDesc(String userEmail);
}
