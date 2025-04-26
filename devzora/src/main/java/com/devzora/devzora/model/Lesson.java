package com.devzora.devzora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    private String title;
    private String content;
    private String type;
    private String mediaUrl;
    private int durationMinutes;
    private int orderIndex;
}
