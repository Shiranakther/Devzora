package com.devzora.devzora.service;

import com.devzora.devzora.model.Submission;
import com.devzora.devzora.repo.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public Submission submit(Submission submission) {
        submission.setSubmissionDate(LocalDateTime.now().toString());
        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByStudent(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public List<Submission> getSubmissionsByAssignment(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> getSubmissionsByCourse(String courseId) {
        return submissionRepository.findByCourseId(courseId);
    }
}


