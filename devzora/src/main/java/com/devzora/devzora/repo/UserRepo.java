package com.devzora.devzora.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devzora.devzora.model.Users;


@Repository
public interface UserRepo extends MongoRepository<Users, String> {

    Users findByUsername(String username);
    Users findByEmail(String email); // Optional: If you want to find users by email
   

}
  


