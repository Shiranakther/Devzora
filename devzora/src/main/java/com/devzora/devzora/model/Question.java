package com.devzora.devzora.model;

import java.util.List;

public class Question {

    private String text; // The question text
    private List<String> options; // List of answer options
    private int correctAnswerIndex; // Index of the correct answer

    // Default constructor (needed for deserialization)
    public Question() {}

    // Constructor
    public Question(String text, List<String> options, int correctAnswerIndex) {
        this.text = text;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
    }

    // Getters and Setters
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(int correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }
}
