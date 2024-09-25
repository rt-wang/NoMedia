package com.example.user_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceApplicationTests {

	private static final Logger logger = LoggerFactory.getLogger(UserServiceApplicationTests.class);

	@Test
	void contextLoads() {
		logger.info("Context load test started");
		// This test method is intentionally empty.
		// It's used to verify if the Spring context loads successfully.
		logger.info("Context load test completed");
	}

}
