package com.devzora.devzora.config;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dzb6vdgiu");
        config.put("api_key", "499689154862875");
        config.put("api_secret", "piXgxUbmxog4W8f5_UO9c11udlA");
        return new Cloudinary(config);
    }

}
