package com.devzora.devzora.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
// @RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService service;

        @PostMapping("/register")
        public Users register(@RequestBody  Users user) {
            return service.register(user);
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Users user) {
        String result = service.verify(user);

        if ("failed".equals(result)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Invalid username or password");
        }

            return ResponseEntity.ok().body(result); // token as body
}
        


}
