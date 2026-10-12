package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.JobCreateRequest;
import com.jobskillmatch.dto.JobDto;
import com.jobskillmatch.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobDto>>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType) {

        List<JobDto> jobs;
        boolean hasFilter = (keyword != null && !keyword.isBlank()) ||
                            (location != null && !location.isBlank()) ||
                            (employmentType != null && !employmentType.isBlank());

        if (hasFilter) {
            jobs = jobService.searchJobs(keyword, location, employmentType);
        } else {
            jobs = jobService.getAllJobs();
        }

        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved successfully", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable Long id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved successfully", job));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobDto>> createJob(@Valid @RequestBody JobCreateRequest request) {
        JobDto created = jobService.createJob(request);
        return ResponseEntity.ok(ApiResponse.success("Job posted successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobCreateRequest request) {
        JobDto updated = jobService.updateJob(id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }
}
