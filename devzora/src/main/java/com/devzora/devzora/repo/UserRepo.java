package com.devzora.devzora.repo;

import com.devzora.devzora.model.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {
    Users findByUsername(String username);
    Users findByEmail(String email);
}