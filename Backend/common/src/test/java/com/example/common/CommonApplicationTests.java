package com.example.common;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
public class CommonApplicationTests {

	@Test
	void contextLoads() {
		// This test method is intentionally empty.
		// It's used to verify if the Spring context loads successfully.
	}

}
