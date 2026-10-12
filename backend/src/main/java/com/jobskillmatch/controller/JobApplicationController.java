package com.jobskillmatch.controller;

import com.jobskillmatch.dto.ApiResponse;
import com.jobskillmatch.dto.ApplicationStatusUpdateRequest;
import com.jobskillmatch.dto.JobApplicationDto;
import com.jobskillmatch.dto.JobApplicationRequest;
import com.jobskillmatch.dto.JobDto;
import com.jobskillmatch.exception.UnauthorizedException;
import com.jobskillmatch.security.UserPrincipal;
import com.jobskillmatch.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobApplicationDto>> applyForJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody JobApplicationRequest request) {
        validateAuthenticated(principal);
        JobApplicationDto application = applicationService.applyForJob(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", application));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<JobApplicationDto>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal principal) {
        validateAuthenticated(principal);
        List<JobApplicationDto> applications = applicationService.getCandidateApplications(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", applications));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<JobApplicationDto>>> getAllApplications() {
        List<JobApplicationDto> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success("All applications retrieved successfully", applications));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        JobApplicationDto updated = applicationService.updateApplicationStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", updated));
    }

    @PostMapping("/save/{jobId}")
    public ResponseEntity<ApiResponse<Void>> saveJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId) {
        validateAuthenticated(principal);
        applicationService.saveJob(principal.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job bookmarked successfully", null));
    }

    @DeleteMapping("/save/{jobId}")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long jobId) {
        validateAuthenticated(principal);
        applicationService.unsaveJob(principal.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job bookmark removed successfully", null));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<JobDto>>> getSavedJobs(
            @AuthenticationPrincipal UserPrincipal principal) {
        validateAuthenticated(principal);
        List<JobDto> savedJobs = applicationService.getSavedJobs(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Saved jobs retrieved successfully", savedJobs));
    }

    private void validateAuthenticated(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
    }
}
