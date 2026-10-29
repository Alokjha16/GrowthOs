package com.tcet.growthos.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI growthOSOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GrowthOS Intelligence Backend API")
                        .description("High-performance Spring Boot REST API service powering GrowthOS: D2C E-commerce Multi-Agent Diagnostics, Scenario Simulations, and Store Metrics.")
                        .version("2.0.0")
                        .contact(new Contact()
                                .name("GrowthOS Platform Engineering")
                                .email("engineering@growthos.ai"))
                        .license(new License().name("Apache 2.0")));
    }
}