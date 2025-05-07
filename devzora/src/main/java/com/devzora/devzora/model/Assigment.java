package com.devzora.devzora.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "assignments")
public abstract class Assigment {
    @Id
    private String id;
    private String title;
    private String description;
    private String deadline;
    private String type; // To differentiate between MCQ, Typing, and File Upload

    public Assigment(String id, String title, String description, String deadline, String type) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}
