package com.devzora.devzora.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    private String id;
    private String title;
    private String shortDescription;
    private String fullDescription;
    private String category;
    private List<String> tags;
    private String thumbnailUrl;
    private String promoVideoUrl;
    private String level;
    private String language;
    private int estimatedDurationMinutes;

    @JsonProperty("isPaid")
    private boolean isPaid;

    private double price;

    @JsonProperty("hasCertificate")
    private boolean hasCertificate;

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String userId;

    private String instructorId;
    private List<Module> modules;
}

// Ensure Module class is defined elsewhere in the code or imported correctly
