package com.example.interaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InteractionApplication {

	public static void main(String[] args) {
		SpringApplication.run(InteractionApplication.class, args);
	}

}
