package com.devzora.devzora.service;

// Removed import for ResourceNotFoundException
import com.devzora.devzora.model.Assigment;
import com.devzora.devzora.model.MCQ;
import com.devzora.devzora.repo.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException; // Spring's exception for delete non-existent
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AssigmentService {

    @Autowired
    private AssignmentRepository assigmentRepository;

    public List<Assigment> getAllAssignments() {
        return assigmentRepository.findAll();
    }

    public Optional<Assigment> getAssignmentById(String id) {
        // Return Optional to let the controller decide how to handle not found
        return assigmentRepository.findById(id);
    }

    public Assigment saveAssignment(Assigment assignment) {
        if (assignment instanceof MCQ && !"MCQ".equals(assignment.getType())) {
            assignment.setType("MCQ");
        }
        return assigmentRepository.save(assignment);
    }

    public Optional<Assigment> updateAssignment(String id, Assigment updatedAssignmentDetails) {
        Optional<Assigment> existingOptional = assigmentRepository.findById(id);
        if (existingOptional.isEmpty()) {
            return Optional.empty(); // Indicate not found
        }

        Assigment existingAssignment = existingOptional.get();

        // Basic check - more robust type handling might be needed
        if (!existingAssignment.getType().equals(updatedAssignmentDetails.getType())) {
            System.err.println("Warning: Attempting to update assignment with mismatched type. Type not changed.");
            // Or throw new IllegalArgumentException("Cannot change assignment type.");
        }

        // Update common fields
        existingAssignment.setTitle(updatedAssignmentDetails.getTitle());
        existingAssignment.setDescription(updatedAssignmentDetails.getDescription());
        existingAssignment.setDeadline(updatedAssignmentDetails.getDeadline());

        // Update MCQ specific fields
        if (existingAssignment instanceof MCQ && updatedAssignmentDetails instanceof MCQ) {
            MCQ existingMCQ = (MCQ) existingAssignment;
            MCQ updatedMCQ = (MCQ) updatedAssignmentDetails;
            existingMCQ.setQuestions(updatedMCQ.getQuestions());
        }

        return Optional.of(assigmentRepository.save(existingAssignment));
    }

    public boolean deleteAssignment(String id) {
        if (!assigmentRepository.existsById(id)) {
            return false; // Indicate deletion failed because it didn't exist
        }
        try {
            assigmentRepository.deleteById(id);
            return true; // Indicate successful deletion
        } catch (EmptyResultDataAccessException e) {
            // This might occur in race conditions, treat as not found
            return false;
        } catch (Exception e) {
            // Log other potential errors during deletion
            System.err.println("Error deleting assignment with ID " + id + ": " + e.getMessage());
            // Depending on policy, you might re-throw or return false
            return false;
        }
        // Consider deleting related submissions here if desired
    }
}
