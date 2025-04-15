package com.devzora.devzora.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RoleTestController {

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminDashboard() {
        return "Admin content";
    }

    @GetMapping("/instructor/dashboard")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public String instructorDashboard() {
        return "Instructor content";
    }

    @GetMapping("/user/dashboard")
    @PreAuthorize("hasRole('USER')")
    public String userDashboard() {
        return "User content";
    }
} // END