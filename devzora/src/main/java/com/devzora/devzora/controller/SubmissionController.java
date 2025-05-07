package com.devzora.devzora.controller;

import com.devzora.devzora.model.Submission;
import com.devzora.devzora.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submitAssignment(@RequestBody Submission submission) {
        Submission saved = submissionService.submit(submission);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudent(studentId));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(@PathVariable String assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Submission>> getSubmissionsByCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByCourse(courseId));
    }
}

