package com.devzora.devzora.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MediaUploadService {

    @Autowired
    private Cloudinary cloudinary;

    // Existing video upload method
    public String uploadVideo(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "video"));
        return uploadResult.get("secure_url").toString();
    }

    // New method for multiple image uploads
    public List<String> uploadImages(MultipartFile[] files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "image"));
            imageUrls.add(uploadResult.get("secure_url").toString());
        }
        return imageUrls;
    }
}