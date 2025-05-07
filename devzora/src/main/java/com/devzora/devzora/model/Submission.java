package com.devzora.devzora.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "submissions")
public class Submission {
    @Id
    private String id;
    private String assignmentId;
    private String studentId;
    private String courseId;
    private List<Integer> mcqAnswers; // For MCQ assignments
    private String writtenAnswer;     // For written assignments
    private String fileUrl;           // For file upload assignments
    private String submissionDate;

    public Submission() {}

    // Getters and setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAssignmentId() { return assignmentId; }
    public void setAssignmentId(String assignmentId) { this.assignmentId = assignmentId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public List<Integer> getMcqAnswers() { return mcqAnswers; }
    public void setMcqAnswers(List<Integer> mcqAnswers) { this.mcqAnswers = mcqAnswers; }

    public String getWrittenAnswer() { return writtenAnswer; }
    public void setWrittenAnswer(String writtenAnswer) { this.writtenAnswer = writtenAnswer; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(String submissionDate) { this.submissionDate = submissionDate; }
}

