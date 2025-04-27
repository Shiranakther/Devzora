package com.devzora.devzora;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // Ensure that Spring uses application-test.properties
class DevzoraApplicationTests {

    @Test
    void contextLoads() {
        // Test to check if the context loads without issues
    }
}
