package com.devzora.devzora.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.devzora.devzora.service.MediaUploadService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/media")
public class MediaUploadController {

    @Autowired
    private MediaUploadService mediaUploadService;

    // Existing video upload endpoint
    @PostMapping("/upload/video")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            String videoUrl = mediaUploadService.uploadVideo(file);
            return ResponseEntity.ok(videoUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Video upload failed: " + e.getMessage());
        }
    }

    // New endpoint for multiple image uploads
    @PostMapping("/upload/images")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> imageUrls = mediaUploadService.uploadImages(files);
            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of("Image upload failed: " + e.getMessage()));
        }
    }
}