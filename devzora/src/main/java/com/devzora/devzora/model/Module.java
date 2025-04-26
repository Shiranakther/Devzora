package com.devzora.devzora.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Module {
    private String title;
    private int orderIndex;
    private List<Lesson> lessons; // List of embedded lessons
}
