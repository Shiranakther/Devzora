package com.devzora.devzora.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/course")
public class CourseController {

    @GetMapping("/course-details")
    public String Course(){
        return "courses";
    }


}
