package com.devzora.devzora.repo;

import com.devzora.devzora.model.Assigment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends MongoRepository<Assigment, String> {
    // Custom query methods can be added here if needed
}
