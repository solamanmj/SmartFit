package com.smartfit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import de.flapdoodle.embed.mongo.spring.autoconfigure.EmbeddedMongoAutoConfiguration;

@SpringBootApplication(exclude = { EmbeddedMongoAutoConfiguration.class })
public class SmartFitApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartFitApplication.class, args);
    }
}
