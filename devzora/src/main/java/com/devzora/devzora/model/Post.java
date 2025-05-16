package com.devzora.devzora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    private String id;
    private String title;
    private String description;
    private List<String> imageList;
    private String video;
    private String courseLink;
    private List<Comment> comments = new ArrayList<>();
    private String userId; // New field to store the ID of the user who created the post
    private String role;   // New field to store the role (e.g., "TEACHER" or "STUDENT")
    private List<String> likes = new ArrayList<>();
}