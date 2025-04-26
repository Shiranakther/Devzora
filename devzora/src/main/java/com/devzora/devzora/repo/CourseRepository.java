package com.devzora.devzora.repo;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.devzora.devzora.model.Course;

public interface CourseRepository extends MongoRepository<Course, String> {}
