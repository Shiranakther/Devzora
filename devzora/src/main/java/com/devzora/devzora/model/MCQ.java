package com.devzora.devzora.model;

import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "assignments")
@TypeAlias("mcq")
public class MCQ extends Assigment {
    private List<Question> questions;

    public MCQ(String id, String title, String description, String deadline, List<Question> questions) {
        super(id, title, description, deadline, "MCQ");
        this.questions = questions;
    }

    // Getters and Setters
    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}