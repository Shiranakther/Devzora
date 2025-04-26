package com.devzora.devzora.service;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.devzora.devzora.model.Course;
import com.devzora.devzora.repo.CourseRepository;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final com.devzora.devzora.repo.CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course updatedCourse) {
        Course existing = getCourseById(id);

        existing.setTitle(updatedCourse.getTitle());
        existing.setShortDescription(updatedCourse.getShortDescription());
        existing.setFullDescription(updatedCourse.getFullDescription());
        existing.setCategory(updatedCourse.getCategory());
        existing.setTags(updatedCourse.getTags());
        existing.setThumbnailUrl(updatedCourse.getThumbnailUrl());
        existing.setPromoVideoUrl(updatedCourse.getPromoVideoUrl());
        existing.setLevel(updatedCourse.getLevel());
        existing.setLanguage(updatedCourse.getLanguage());
        existing.setEstimatedDurationMinutes(updatedCourse.getEstimatedDurationMinutes());
        existing.setPaid(updatedCourse.isPaid());
        existing.setPrice(updatedCourse.getPrice());
        existing.setHasCertificate(updatedCourse.isHasCertificate());
        existing.setStatus(updatedCourse.getStatus());
        existing.setInstructorId(updatedCourse.getInstructorId());
        existing.setModules(updatedCourse.getModules());
        existing.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(existing);
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
}
