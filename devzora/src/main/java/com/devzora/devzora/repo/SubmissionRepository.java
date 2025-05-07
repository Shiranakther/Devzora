package com.devzora.devzora.repo;

import com.devzora.devzora.model.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByStudentId(String studentId);
    List<Submission> findByAssignmentId(String assignmentId);
    List<Submission> findByCourseId(String courseId);
}