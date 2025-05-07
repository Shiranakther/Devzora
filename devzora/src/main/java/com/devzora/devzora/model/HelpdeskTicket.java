package com.devzora.devzora.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Getter
@Setter
@ToString
@Document(collection = "tickets")
public class HelpdeskTicket {
     @Id
    private String id;
    private String title;
    private String description;
    private String status; // e.g., "OPEN", "IN_PROGRESS", "RESOLVED"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String submittedBy;

}


