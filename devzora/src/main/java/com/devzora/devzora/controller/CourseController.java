package com.devzora.devzora.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devzora.devzora.model.Course;
import com.devzora.devzora.service.CourseService;
import lombok.RequiredArgsConstructor;
import com.devzora.devzora.model.UserPrincipal;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/course-details")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    

    @GetMapping("/course-details/{id}")
    public Course getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id);
    }

    @PostMapping("/create-course")
    public Course createCourse(@RequestBody Course course, 
                               @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal.getUser().getId();  // Extract ID from principal
        course.setUserId(userId);                       // Assuming your Course model has userId
        return courseService.createCourse(course);
    }
    


    @PutMapping("/update-course/{id}")
    public Course updateCourse(@PathVariable String id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/delete-course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
}

