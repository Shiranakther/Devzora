package com.devzora.devzora.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
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


}
