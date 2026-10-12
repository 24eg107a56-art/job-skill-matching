package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "JobSkillMatch Backend REST API");
        healthInfo.put("version", "1.0.0");
        healthInfo.put("timestamp", Instant.now().toString());
        healthInfo.put("environment", "local-development");

        // Verify MySQL database connection
        if (dataSource != null) {
            try (Connection connection = dataSource.getConnection()) {
                healthInfo.put("database", "CONNECTED");
                healthInfo.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
                healthInfo.put("databaseVersion", connection.getMetaData().getDatabaseProductVersion());
                healthInfo.put("databaseCatalog", connection.getCatalog());
            } catch (Exception e) {
                healthInfo.put("database", "ERROR: " + e.getMessage());
            }
        } else {
            healthInfo.put("database", "DATASOURCE_NOT_INITIALIZED");
        }

        return ResponseEntity.ok(ApiResponse.success("Backend service and database are operational", healthInfo));
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
