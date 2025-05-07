package com.devzora.devzora.controller;

import com.devzora.devzora.model.Assigment;
import com.devzora.devzora.model.MCQ;
import com.devzora.devzora.service.AssigmentService;
// Removed import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin
public class AssigmentController {

    @Autowired
    private AssigmentService assigmentService;

    @GetMapping
    public ResponseEntity<List<Assigment>> getAllAssignments() {
        List<Assigment> assignments = assigmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assigment> getAssignmentById(@PathVariable String id) {
        Optional<Assigment> assignmentOpt = assigmentService.getAssignmentById(id);
        // Handle Optional: Return 404 if not found, 200 if found
        return assignmentOpt
                .map(ResponseEntity::ok) // If present, wrap in ResponseEntity.ok()
                .orElseGet(() -> ResponseEntity.notFound().build()); // If empty, build 404 response
    }

    @PostMapping("/mcq")
    public ResponseEntity<Assigment> createMCQAssignment(@RequestBody MCQ mcqAssignment) { // Removed @Valid
        mcqAssignment.setType("MCQ");
        try {
            Assigment savedAssignment = assigmentService.saveAssignment(mcqAssignment);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAssignment);
        } catch (Exception e) {
            // Basic error handling - could be more specific
            System.err.println("Error creating assignment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assigment> updateAssignment(@PathVariable String id, @RequestBody MCQ assignmentDetails) { // Removed @Valid
        Optional<Assigment> updatedOpt = assigmentService.updateAssignment(id, assignmentDetails);
        return updatedOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String id) {
        boolean deleted = assigmentService.deleteAssignment(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}

