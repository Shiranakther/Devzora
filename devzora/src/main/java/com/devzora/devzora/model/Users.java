package com.devzora.devzora.model;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Document(collection = "users")
@Getter
@Setter
@ToString

public class Users {

    @Id
    private String id;
    private String username;
    private String password;


}
