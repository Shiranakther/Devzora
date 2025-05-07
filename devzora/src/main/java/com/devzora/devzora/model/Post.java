package com.devzora.devzora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;

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
}
