package com.smartfit.repository;

import com.smartfit.model.Nutritionist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NutritionistRepository extends MongoRepository<Nutritionist, String> {
    long countByStatus(String status);
}
